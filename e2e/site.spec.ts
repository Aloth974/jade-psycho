import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const sections = [
  { button: 'Qui suis-je ?', title: 'Présentation personnelle' },
  { button: 'Soins à la personne', title: /Accompagnement et soins/ },
  { button: 'Formations', title: /Formations pour une meilleure/ },
  { button: 'Analyse pratique pro', title: /Analyses de pratiques/ },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('home page renders every section button without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');

  for (const { button } of sections) {
    await expect(page.getByRole('button', { name: button })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

for (const { button, title } of sections) {
  test(`"${button}" opens a labelled dialog that closes with the close button`, async ({ page }) => {
    await page.goto('/');
    const opener = page.getByRole('button', { name: button });
    await opener.click();

    const dialog = page.getByRole('dialog', { name: title });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Fermer' })).toBeFocused();

    await dialog.getByRole('button', { name: 'Fermer' }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    expect(new URL(page.url()).hash).toBe('');
  });
}

test('Escape closes the dialog and returns focus to the opener', async ({ page }) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Formations' });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('rapid double click opens a single dialog that can still be closed', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Formations' }).dblclick();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'Fermer' }).click();
  await expect(dialog).toBeHidden();
  await page.waitForTimeout(1500);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('with reduced motion the dialog opens without the ink transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Formations' }).click();
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 100 });
  await expect(page.locator('.cd-transition-layer').filter({ visible: true })).toHaveCount(0);
});

test('social links have accessible names and the right targets', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', /facebook\.com/);
  await expect(page.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', /instagram\.com\/jade_psychoprat/);
});

test('contact links use valid tel: and mailto: URLs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a[href^="tel:"]')).toHaveAttribute('href', 'tel:+33759603077');
  await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(1);
});

test('JSON-LD is valid JSON with a schema.org type and no street address', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? '');
  expect(data['@context']).toBe('https://schema.org');
  expect(data['@type']).toBe('ProfessionalService');
  expect(data.address).toBeUndefined();
  expect(data.geo).toBeUndefined();
});

test('no serious accessibility violations, closed or open', async ({ page }) => {
  await page.goto('/');
  const audit = async () => {
    const { violations } = await new AxeBuilder({ page }).analyze();
    return violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);
  };

  expect(await audit()).toEqual([]);

  await page.getByRole('button', { name: 'Formations' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.waitForTimeout(800);
  expect(await audit()).toEqual([]);
});

test('the ink transition still covers the screen after a resize', async ({ page }) => {
  await page.goto('/');
  for (const viewport of [{ width: 1600, height: 500 }, { width: 400, height: 900 }]) {
    await page.setViewportSize(viewport);
    const box = await page.locator('.bg-layer').first().evaluate((element) => {
      const { height, width } = getComputedStyle(element);
      return { height: parseFloat(height), frameWidth: parseFloat(width) / 25 };
    });
    expect(box.height).toBeGreaterThanOrEqual(viewport.height);
    expect(box.frameWidth).toBeGreaterThanOrEqual(viewport.width);
  }
});
