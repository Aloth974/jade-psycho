# jade-psycho.fr

Website of Jade Techer, psychopraticienne in Orange (84): https://www.jade-psycho.fr

A [Next.js](https://nextjs.org) App Router site exported as static HTML (`output: "export"`) and hosted on
GitHub Pages.

## Development

```bash
npm ci
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export to `out/` |
| `npm start` | Serve `out/` locally (run `npm run build` first) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |

## Project layout

- `src/app/layout.tsx`: page shell (header, main, footer) and metadata
- `src/app/page.tsx`: home page, one `InkedModal` per section
- `src/app/components/content/`: the French copy shown in each modal
- `src/app/components/inked-modal/`: the modal with the ink transition
- `src/app/components/seo/`: metadata and JSON-LD structured data
- `public/`: files copied as-is to the site root (`CNAME`, `.nojekyll`)

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site
and publishes `out/` to GitHub Pages. This requires **Settings → Pages → Source: GitHub Actions** on the
repository. The custom domain comes from `public/CNAME`.

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, build and type checks on every pull request.

## Credits

- Development: Olivier Leclercq ([@Aloth974](https://github.com/Aloth974))
- Font: [Luciole](https://www.luciole-vision.com/) by Laurent Bourcellier & Jonathan Perez, CC BY 4.0
- Icons: [Font Awesome](https://fontawesome.com/) brand icons, CC BY 4.0
