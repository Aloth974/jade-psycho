# Design: code review remediation for jade-psycho.fr

- **Status:** Proposed
- **Date:** 2026-10-21
- **Scope:** the whole repository at `3e24a34` (Next.js 14 static export deployed to GitHub Pages)

## 1. Context

The site is a single-page Next.js App Router project, exported statically (`output: "export"`) and pushed to
GitHub Pages with `gh-pages`. The home page shows four buttons; each opens a full-screen "inked" modal with an
animated ink sprite transition and a block of French content.

Baseline checks at `3e24a34`:

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `next lint` | clean |
| `next build` | succeeds, 3 routes: `/`, `/next`, `/_not-found` |
| `npm audit --omit=dev` | 9 vulnerabilities (1 critical: `next`, 8 high in transitive deps) |

Everything compiles, so the findings below are about runtime behavior, correctness of published data,
accessibility, SEO, maintainability, and supply chain, not build failures.

## 2. Findings

Severity: **High** = visibly wrong for visitors or search engines today; **Medium** = a real defect that
only shows up in some conditions, or a security/maintenance risk; **Low** = cleanup and polish.

### 2.1 Functional bugs

| ID | Sev | Location | Finding |
| --- | --- | --- | --- |
| F1 | High | `components/layout/social-networks.tsx:8` | `instagramUrl` is a copy of the Facebook URL, so the Instagram icon opens Facebook. |
| F2 | Medium | `components/inked-modal/inked-modal.tsx:74` | The effect returns `window.removeEventListener(...)` (it *calls* it) instead of a cleanup function. The resize listener is added and removed at once, so the ink layer is sized only on mount: rotating a phone or resizing the window leaves the transition mis-sized. The `resize` state and its dependency array exist only to drive this broken logic. |
| F3 | Medium | `inked-modal.tsx:97` | The close control is `<a href="#0">` with no `preventDefault`. Every close pushes `#0` into the URL and the history, and the back button then "does nothing". |
| F4 | Medium | `inked-modal.tsx:22-42` | `setTimeout`s are never cleared. A double click or a quick open→close runs the callbacks out of order (the modal can reopen after closing), and they fire after unmount. |
| F5 | Medium | `globals.css:10-21` | In dark mode `--foreground` switches to `#ededed` while the body background stays hard-coded to `#e2ddd3`. The social icons inherit this color and become almost invisible for dark-mode visitors. |
| F6 | Low | `modal-button.tsx:14` | When `className` is not passed, the class becomes `"modal-button undefined"`. The button also has no `type="button"`. |
| F7 | Low | `social-networks.scss:26` | `transition: color filter 1s` is invalid CSS (it should be a comma-separated list) and sits only on `:hover`, so there is no transition. |

### 2.2 Accessibility

| ID | Sev | Location | Finding |
| --- | --- | --- | --- |
| A1 | High | `inked-modal.tsx` | The modal is a `div` with no `role="dialog"`, `aria-modal`, or label. Focus is not moved into it or restored afterwards, Tab can reach the page behind it, and Escape does nothing. Keyboard and screen-reader users can get lost. |
| A2 | Medium | `inked-modal.tsx:97` | The close control is labelled "Close" (English) on a `lang="fr"` page, and its text is hidden with `text-indent`. |
| A3 | Medium | `social-networks.tsx` | The icon-only links have no accessible name (`aria-label`). |
| A4 | Medium | `inked-modal.scss` | The 0.8 s full-screen sprite animation ignores `prefers-reduced-motion`. |
| A5 | Medium | `components/content/*.tsx` | Sub-headings ("Objectifs des formations", "Méthodologie", …) are plain text separated by `<br />`, and `analyse.tsx` flattens what should be nested lists ("Gestion des comportements difficiles :" followed by its sub-items as siblings). Screen readers get no structure. |
| A6 | Low | `header.scss`, `footer.scss` | White text on `rgba(0,0,0,.1)` over a light background has low contrast; only the text-shadow keeps it readable. |

### 2.3 SEO and published data

| ID | Sev | Location | Finding |
| --- | --- | --- | --- |
| S1 | High | `components/seo/rich-snippet.tsx` | The JSON-LD is invalid or placeholder data: `"@type": "Psycho"` is not a schema.org type, `image` points at `example.com`, `addressRegion` is "Orange" (a city), and the phone number is not in international format. Google will ignore it or flag it. |
| S2 | High | `rich-snippet.tsx:10-22` vs commit `3e24a34` | The last commit removed the street address from the footer, but it is still published in the JSON-LD (with GPS coordinates). If the removal was for privacy, it did not work. **Owner decision needed (§5).** |
| S3 | Medium | `layout.tsx:48-65` | `next/head` does nothing in the App Router. The `<Head>` block, including the `example.com` og:image and "our cool page" description, is dead code (confirmed: it is absent from `out/index.html`). |
| S4 | Medium | `metadataConfiguration.tsx` | No `metadataBase`, canonical URL, `og:url`, `og:image`, `og:locale` (`fr_FR`), or `og:type`. Social shares show no image. The description has inconsistent casing ("84100 orange"). `authors` names the developer rather than the practitioner. |
| S5 | Medium | `src/app/next/` | `/next` is a byte-for-byte duplicate of `/` (page and SCSS). It is exported and indexable, so it is duplicate content. |
| S6 | Low | n/a | No `robots.txt` or `sitemap.xml`. |

### 2.4 Code health and maintainability

| ID | Sev | Location | Finding |
| --- | --- | --- | --- |
| M1 | Medium | `ancien` | A gitlink (submodule pointer) with no `.gitmodules` entry. `git submodule status` fails with `fatal: no submodule mapping found`, and the folder is always empty. |
| M2 | Medium | `components/style.scss` | Dead file left over from the CodyHouse template. It imports `bourbon` and `../partials/*`, which do not exist, so it would break the build if anything imported it. |
| M3 | Low | `inked-modal.scss:1-82` | Unused mixins (`MQ`, `column`, `center`, which calls an undefined `transform` mixin), unused color variables, a `PT Sans` font that is never loaded, obsolete `-moz-`/`-o-`/`-ms-` prefixes, Modernizr classes (`.no-touch`, `.no-cssanimations`) that are never set, and comments about jQuery. |
| M4 | Low | `footer.tsx`, `rich-snippet.tsx`, `social-networks.tsx` | Contact data (phone, email, socials, URL) is duplicated as literals in several files, which is how F1 happened. |
| M5 | Low | `layout.tsx:17-36` | Four `localFont` instances each declare a weight *range* for a static TTF and get their own CSS variable, but only `--font-luciole-regular` is used. Bold and italic text is synthesized by the browser instead of using the shipped faces. The fonts are TTF rather than WOFF2. |
| M6 | Low | `main.scss`, `header.scss`, `social-networks.scss` | The layout depends on magic numbers: the header is `height: 10%`, `.page` uses `padding-top: 10%` (percent of *width*, so it drifts on wide screens), the social icons sit at `bottom: 60px` / `140px`, and the mobile background uses `background-size: 100% 66%`, which distorts the image. There is a single 480 px breakpoint. |
| M7 | Low | `tailwind.config.ts`, `globals.css` | Tailwind is installed for two classes (`h-full`, `antialiased`). Its preflight resets list styles, which the SCSS then re-adds by hand. |
| M8 | Low | `README.md` | The README is create-next-app boilerplate (it mentions Geist and Vercel) and says nothing about deployment. |
| M9 | Low | `tsconfig.json:36` | `include` lists `next.config.js`, but the file is `next.config.mjs`. |
| M10 | Low | `src/app/images/background.png` (721 KB), `ink.png` (389 KB), `modal-bg.jpg` (143 KB) | These are large raster assets served unoptimized (`images.unoptimized` is required by the static export). |

### 2.5 Dependencies, security, delivery

| ID | Sev | Location | Finding |
| --- | --- | --- | --- |
| D1 | Medium | `package.json` | `next@14.2.18` has a critical advisory, and the 14.x line is end-of-life: many advisories are fixed only in `>=15.5.21`. Most of them hit the Next server (middleware, image optimizer, server actions), which a static export on GitHub Pages does not run, so the production risk is low. The dev-server and toolchain advisories (`postcss`, `nanoid`, `braces`, …) still apply on developer machines. ESLint 8 is also end-of-life, and `next lint` is removed in Next 16. |
| D2 | Medium | n/a | There is no CI. Deployment is a manual `npm run deploy` from a laptop, so nothing checks lint or the build before the site changes. |
| D3 | Low | `footer.tsx:11` | `tel:0759 60 30 77` contains spaces and no country code (RFC 3966); it should be `tel:+33759603077`. |

### 2.6 Content (French copy)

| ID | Sev | Location | Finding |
| --- | --- | --- | --- |
| C1 | Medium | `presentation.tsx` | Typos and grammar: "je suis sensibiliser" → "sensibilisée"; "que vous rencontrer" → "rencontrez"; "mon permis" → "m'ont permis"; "troubles déficitaire" → "déficitaires"; stray commas in "Neuro développementaux,", "confiance, en soi" and "milieu, petite enfance"; "Avec" capitalized mid-sentence; "parents ." spacing; "d'accompagnant aux enfants" → "d'accompagnants d'enfants". |
| C2 | Low | `page.tsx:13` | The title "Présentation personnelle " has a trailing space. |
| C3 | Low | n/a | No "mentions légales" page. French law (LCEN art. 6) requires one on a professional site, and psychologists normally display their professional registration number. **Owner decision needed (§5); this is not legal advice.** |

## 3. Design

The work is split into six workstreams. Each one can merge as its own PR, in the order given in §4.

### 3.1 One source of truth for site data (fixes M4, F1, D3, part of S1/S4)

Create `src/config/site.ts`:

```ts
export const site = {
  name: 'Jade Techer',
  title: 'Jade Techer – Psychologue à Orange (84)',
  description: 'Accompagnement psychologique, formations et analyse de pratiques professionnelles à Orange (84100).',
  url: 'https://www.jade-psycho.fr',
  locale: 'fr_FR',
  email: 'jade.techer.psycho@gmail.com',
  phone: { display: '07 59 60 30 77', e164: '+33759603077' },
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=61572511209865',
    instagram: 'https://www.instagram.com/<handle>/', // TODO: real handle from owner
  },
  address: { /* optional, see §5 */ },
  openingHours: [ /* same structure as today */ ],
} as const;
```

The footer, social links, metadata, and JSON-LD all read from `site`. No contact literal remains outside this
file.

### 3.2 Rebuild the modal (fixes F2, F3, F4, F6, A1, A2, A4, M3)

Rewrite `InkedModal` around the native `<dialog>` element:

- **Open:** add the `opening` class to the transition layer, then call `dialogRef.current.showModal()` on the
  layer's `animationend` event (or at the current 600 ms mark, using one timer stored in a ref). `showModal()`
  puts the dialog in the top layer, makes the rest of the page inert (which traps focus), and sends Escape to a
  `cancel` event. It also replaces the `z-index` stacking between modal (3) and header/footer (1000).
- **Close:** a real `<button type="button" aria-label="Fermer">`, plus Escape through `onCancel` with
  `preventDefault()` so the reverse animation can play. Then `dialog.close()` and play `closing`. Focus returns
  to the opener automatically.
- **State:** replace the three booleans with one `phase` state: `'closed' | 'opening' | 'open' | 'closing'`.
  Each transition is only allowed from the expected phase, which removes the double-click races. Any timer
  lives in a `useRef` and is cleared in an effect cleanup.
- **Sizing without JavaScript:** delete `updateLayerDimensions`, the resize listener, and the `resize` state.
  Size the sprite in CSS so it always covers the viewport:

  ```scss
  .bg-layer {
    --frame-h: max(calc(100vw / 1.78), 120vh);
    height: var(--frame-h);
    width: calc(var(--frame-h) * 1.78 * 25); // 25 frames
  }
  ```

- **Reduced motion:** under `@media (prefers-reduced-motion: reduce)`, hide the transition layer and open or
  close the dialog immediately (check `matchMedia` in JavaScript to skip the wait).
- **Labelling:** `aria-labelledby` points at the `<h2>` title; the content keeps its current reading order.
- **Styles:** cut `inked-modal.scss` down to what is used: no vendor prefixes (autoprefixer is not needed for
  any browser in the current support range), no dead mixins, no Modernizr selectors, and `::backdrop` instead
  of the full-screen background where possible.

`ModalButton` takes `React.ComponentPropsWithoutRef<'button'>`, defaults `type="button"`, and joins class
names with `[ 'modal-button', className ].filter(Boolean).join(' ')`. The `[x: string]: unknown` index
signature goes away.

Optional follow-up (not required for the fixes): sync the open modal with the URL hash (`#presentation`,
`#soins`, …) so sections can be deep-linked and the back button closes the modal.

### 3.3 Metadata and structured data (fixes S1–S6)

- Delete the `<Head>` block and the `next/head` import from `layout.tsx`.
- Replace `metadataConfiguration.tsx` with a typed `metadata` export built from `site`: `metadataBase`,
  `title` (with a `template` for future pages), `description`, `alternates.canonical: '/'`,
  `openGraph: { type: 'website', locale, url, siteName, images }`, `twitter.card: 'summary_large_image'`.
  `authors` names the practitioner. A developer credit can go in the README instead.
- Add `src/app/opengraph-image.jpg` (1200×630) so Next emits `og:image` with absolute URLs. This needs an image
  from the owner, or a crop of the existing background.
- Add `src/app/robots.ts` and `src/app/sitemap.ts`, both with `export const dynamic = 'force-static'` so they
  work with `output: "export"`.
- Rewrite the JSON-LD from `site`: `@type: "LocalBusiness"` (or `"MedicalBusiness"`), `name`, `url`, `telephone`
  in E.164, `email`, `sameAs: [facebook, instagram]`, `openingHoursSpecification`, and `image` pointing at the
  real OG image. `address` and `geo` are included only if the owner confirms they should be public (§5); if
  included, `addressRegion` becomes "Provence-Alpes-Côte d'Azur" (or "Vaucluse"). Keep the `<script>`, but
  escape `<` in the serialized JSON (`.replace(/</g, '\\u003c')`) as recommended in the Next.js docs.
- Delete `src/app/next/` (route and SCSS). If the URL was ever shared, add a
  `src/app/next/page.tsx` that only renders `redirect('/')`. In a static export this becomes a meta-refresh
  page.
- Validate with Google's Rich Results Test and an Open Graph debugger after deployment.

### 3.4 Layout, styling, fonts, assets (fixes F5, F7, M5, M6, M7, M10, A3, A6)

- **Theme:** the design is light-only. Remove the `prefers-color-scheme: dark` block and declare
  `color-scheme: light`. All colors become CSS custom properties in `globals.css` (`--color-ink`,
  `--color-paper`, `--color-accent: #802040`, …), and the SCSS files use those properties instead of hex
  literals.
- **Layout:** define `--header-h` and `--footer-h` as custom properties. Header and footer use those heights.
  `main` uses `min-height: 100dvh` with `padding-block: var(--header-h) var(--footer-h)` instead of percentage
  padding. The social bar becomes part of the footer's flex flow (or is positioned relative to
  `--footer-h`), which removes the `60px`/`140px` magic numbers. The mobile background uses
  `background-size: cover` (or `contain`) to stop distortion. Add a tablet breakpoint (768 px) next to the
  existing 480 px one, and keep both as SCSS variables in one `_breakpoints.scss`.
- **Social links:** add `aria-label="Facebook"` / `"Instagram"` and `aria-hidden` on the icons. Set
  `transition: color 0.3s, filter 0.3s` on the base rule (not only on `:hover`) and add a matching
  `:focus-visible` style.
- **Contrast:** raise the header and footer background to at least `rgba(0,0,0,.45)` (or use dark text), and
  check WCAG AA (4.5:1) with axe (§3.6).
- **Fonts:** use one `localFont({ src: [{ path, weight: '400', style: 'normal' }, { …700 }, { …italic }],
  variable: '--font-luciole', display: 'swap' })` with the files converted to WOFF2 (Luciole is CC-BY, so
  conversion is allowed). Body text uses `var(--font-luciole)`.
- **Tailwind:** remove it (along with `postcss.config.mjs` and `tailwind.config.ts`) and replace `h-full` and
  `antialiased` with a few lines of CSS. This drops preflight and with it the manual list-style fixes. If more
  Tailwind usage is planned, keep it instead and drop the SCSS duplication; the point is to have one styling
  system.
- **Assets:** convert `background.png` and `modal-bg.jpg` to WebP or AVIF (with a JPEG fallback through
  `image-set()`) and recompress `ink.png` with lossless palette PNG or WebP. The aim is a cut of more than 60%
  of the first-load weight.
- **Dead code:** delete `components/style.scss` and the `.cd-main-content` / `.center` wrappers that have no
  styles left.

### 3.5 Content semantics and copy (fixes A5, C1, C2)

- Turn each content component into semantic HTML: `<p>` for paragraphs, `<h3>` for sub-headings ("Objectifs
  des formations", "Méthodologie", …), and nested `<ul>` where an item introduces sub-items (`analyse.tsx`
  thematic list). Remove the `<br /><br />` spacing and set spacing in `.modal-content-text`. The inline
  `style={{ listStyle: 'decimal' }}` becomes an `<ol>`.
- Apply the corrections listed in C1 and trim the title in C2. Jade should proofread the result, since it is
  her professional voice.
- Optional: move the copy to MDX or Markdown files (`@next/mdx`) so Jade can edit it without touching JSX.

### 3.6 Repository, dependencies, CI/CD (fixes M1, M2, M8, M9, D1, D2)

- **Repo hygiene:** `git rm --cached ancien` (and delete the empty folder), delete `style.scss`, fix the
  `tsconfig.json` include, and rewrite the README (purpose, `npm run dev`, how content is organised, how
  deployment works).
- **Dependencies, in two steps:**
  1. Immediately: `next@14.2.35` (the last 14.x release), `eslint-config-next@14.2.35`, `npm audit fix`
     for transitive packages, and `npx update-browserslist-db@latest`. This needs no code change.
  2. Next: upgrade to the current Next.js major (16.x at the time of writing) with React 19. Move to an ESLint 9
     flat config (`eslint.config.mjs`) and replace `next lint` with `eslint .`. Upgrade
     `@fortawesome/react-fontawesome` to a React 19-compatible release. The codebase uses no async request
     APIs and no data fetching, so the migration is mostly in configuration. Do it after §3.2 so the modal
     rewrite is tested on the new React.
- **CI:** add `.github/workflows/ci.yml`, which runs on PRs and pushes to `main`:
  `npm ci` → `npm run lint` → `tsc --noEmit` → `npm run build` → Playwright smoke tests.
- **CD:** add `.github/workflows/deploy.yml`, which runs on push to `main` and uses the official
  `actions/upload-pages-artifact` + `actions/deploy-pages`. Move the custom domain to `public/CNAME`
  (`www.jade-psycho.fr`) and add `public/.nojekyll`. Remove the `gh-pages` dev dependency and the
  `push`/`deploy` scripts once the workflow has deployed successfully, and switch the repository's Pages
  source to "GitHub Actions".
- **Tests:** add one Playwright spec (Chromium is enough), run against `npx serve out`:
  1. the home page renders four buttons with no console errors;
  2. clicking a button opens a `dialog` named by its title, focus moves inside, Escape closes it, and focus
     returns to the button; the URL does not change;
  3. the social links have accessible names and the Instagram link does not point at facebook.com;
  4. `@axe-core/playwright` reports no serious or critical violations on the closed and open states;
  5. the JSON-LD parses and has a valid `@type`.
- Add Dependabot (`.github/dependabot.yml`, npm + github-actions, monthly) so D1 does not happen again.

## 4. Rollout plan

| Step | PR | Contents | Findings | Risk |
| --- | --- | --- | --- | --- |
| 1 | Quick fixes | Instagram URL (once known), `tel:` format, `ModalButton` class and type, CSS transition, dark-mode removal, delete `<Head>` block, `/next`, `ancien`, `style.scss`, tsconfig, `next@14.2.35` + audit fix | F1, F5–F7, D3, S3, S5, M1, M2, M9, D1 (step 1) | Very low |
| 2 | CI + CD | `ci.yml`, `deploy.yml`, `public/CNAME`, Dependabot, README | D2, M8 | Low; verify the custom domain right after the first deploy |
| 3 | Site config + SEO | `site.ts`, metadata, OG image, robots and sitemap, JSON-LD | M4, S1, S2, S4, S6 | Low; needs the §5 answers |
| 4 | Modal rewrite + tests | `<dialog>` modal, CSS sizing, reduced motion, Playwright + axe | F2–F4, A1, A2, A4, M3 | Medium; the largest UX change, covered by tests |
| 5 | Layout, fonts, assets | Custom properties, layout without magic numbers, fonts, image conversion, Tailwind decision | M5–M7, M10, A3, A6 | Medium; check visually on mobile, tablet, desktop |
| 6 | Content | Semantic markup + copy corrections, after Jade's review | A5, C1, C2 | Low |
| 7 | Framework upgrade | Next 16 / React 19 / ESLint 9 | D1 (step 2) | Medium; CI and tests from steps 2 and 4 cover it |
| — | Legal page | "Mentions légales" page | C3 | Depends on the owner |

Steps 1 and 2 have no dependencies and can ship right away. Steps 3–6 can run in parallel after step 2.

## 5. Decisions needed from the owner

1. **Street address:** should "21 cours Aristide Briand, Orange" and the GPS coordinates stay public in the
   structured data (S2)? Publishing them helps local search, but the last commit suggests they were removed on
   purpose.
2. **Instagram:** what is the real profile URL (F1)? If there is none, remove the icon.
3. **Dark mode:** is the light-only design (§3.4) fine, or should a proper dark theme be designed?
4. **Tailwind:** remove it, or adopt it for the whole site (§3.4)?
5. **Open Graph image:** which photo or visual should represent the site when it is shared?
6. **Mentions légales:** which details (professional registration number, host, publication director) should
   appear (C3)?

## 6. Out of scope

- Visual redesign beyond what the fixes need.
- Analytics or cookie consent. The site sets no cookies and loads no third-party scripts today, and none of
  these changes add any.
- Moving off GitHub Pages.
