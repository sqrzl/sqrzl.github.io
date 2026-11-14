# Sqrzl Website

The public marketing page and user documentation for the
[Sqrzl emulator](https://github.com/sqrzl/sqrzl-emulator), published at
[sqrzl.github.io](https://sqrzl.github.io/).

The site is built with Askr and Vite Plus. Askr provides the JSX runtime and
route registry; the Askr CLI generates deployable pages from that shared
registry. Vite Plus (`vp`) runs the development server and builds the browser
assets. The visual foundation and shared UI patterns come from
[`@askrjs/themes`](https://github.com/askrjs/askr-themes), with the site's
warm neutral palette and compact geometry applied through Askr token overrides.

## Develop locally

Requirements: Node.js 24.11+ (24.x) or Node.js 26+ and npm. CI uses Node 26.

```sh
npm ci
npm run dev
```

The local development server is available at <http://127.0.0.1:5173>.

Useful commands:

| Command              | Purpose                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run dev`        | Start the Vite Plus development server.                                                                      |
| `npm run build`      | Build static pages, Markdown mirrors, full-text docs and build identity into `dist/static`.                  |
| `npm run generate`   | Run `askr ssg` using the shared route registry and client assets.                                            |
| `npm run preview`    | Preview the generated site from `dist/static`.                                                               |
| `npm test`           | Check generated routes, links, code examples, content contracts and workspace discovery. Run after building. |
| `npm run analyze`    | Run Askr's read-only source analysis.                                                                        |
| `npm run type-check` | Check TypeScript types.                                                                                      |
| `npm run lint`       | Run Vite Plus linting.                                                                                       |
| `npm run fmt`        | Format the project.                                                                                          |

## Project structure

Pages follow the composition hierarchy
`pages → features → components → primitives`:

- `src/pages/` contains thin route entrypoints.
- `src/features/` composes the page-level content and behavior.
- `src/components/` contains reusable site, docs, and landing-page components.
- `src/components/ui/` contains small adapters over Askr theme primitives and
  semantic elements, such as the site section, action link, and code block.
- `src/routes.tsx` declares the Askr route registry used for site navigation and static generation.
- `src/styles.css` imports the Askr theme foundations and the component styles
  used by the site. Its `--ak-*` overrides retain the existing palette,
  typography, compact controls, and low radius; site-specific layout recipes
  stay alongside the site.
- `ssg.config.ts` configures the Askr CLI's `askr ssg` command, document metadata, static assets, and sitemap.

The shared header, footer, sections, page headers, buttons, and mobile docs
drawer use Askr theme components. The docs drawer composes the theme's Sheet
with its dialog interaction behavior. The static document renderer wraps
Askr's `withThemeStyles` helper so generated layout styles are present on the
first page load.

Use kebab-case for route paths and source filenames. To add a documentation
page, add its thin route page and feature, register the path in
`src/routes.tsx`, add its link to `src/components/docs-sidebar.tsx`, and add its
title and description to the route metadata in `ssg.config.ts`. Markdown mirrors and `llms-full.txt` are generated from rendered page content by
`scripts/generate-content.mjs`; do not maintain separate copies under `public/`.
Code blocks retain their original whitespace and characters. Runtime-default tests
use a fixture captured from the qualified emulator’s `/healthz`; its source SHA
is recorded in `tests/fixtures/emulator-runtime.json`. Refresh that fixture from
a qualified source build when the documented defaults change. `parse5` parses the
HTML for generation and generated-site checks. The route registry remains the
source of page rendering and navigation.

## Deployment

[`sqrzl/sqrzl.github.io`](https://github.com/sqrzl/sqrzl.github.io) is the
canonical source repository and publishes the site at the root domain. Push to
its `main` branch to deploy. Its `.github/workflows/pages.yml` validates pull requests without deploying them.
Type checking, linting, Askr analysis, dependency audit, a full build and generated
content/tooling checks must pass before main publishes `dist/static`. After
deployment, a bounded smoke check verifies the clean source identity in
`build-info.json` and current HTML, Markdown and full-text content on the public
site. The framework generates `404.html`; its root base URL keeps assets and
recovery links working for unknown nested paths.

## Tooling dependency overrides

The current `@npmcli/map-workspaces` release, reached through the Askr CLI,
constrains `glob` and `minimatch` below their security fixes. Overrides are scoped
to that package and select patched glob 14 and minimatch 11 releases. Regression
tests exercise workspace exclusions/reinclusion and cancellation through the
actual consumer, alongside the real Askr commands. Remove these overrides when
the parent supports patched ranges. The audit gate checks moderate and higher
findings. References: [glob advisory](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)
and [minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249).
