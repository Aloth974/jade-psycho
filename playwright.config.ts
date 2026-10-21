import { defineConfig, devices } from '@playwright/test';

// Runs against the static export: `npm run build` first.
export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx serve -l 4173 out',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
