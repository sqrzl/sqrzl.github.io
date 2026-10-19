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

Requirements: Node.js 24 or newer and npm.

```sh
npm ci
npm run dev
```

The local development server is available at <http://127.0.0.1:5173>.

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite Plus development server. |
| `npm run build` | Build browser assets and generate all routes into `dist/static`. |
| `npm run generate` | Run `askr ssg` using the shared route registry and client assets. |
| `npm run preview` | Preview the generated site from `dist/static`. |
| `npm run analyze` | Run Askr's read-only source analysis. |
| `npm run type-check` | Check TypeScript types. |
| `npm run lint` | Run Vite Plus linting. |
| `npm run fmt` | Format the project. |

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
title and description to the route metadata in `ssg.config.ts`. For a standalone
Markdown version, add its file under `public/docs/` and set the route's
`markdown` metadata field.

## Deployment

The source repository is [`sqrzl/website`](https://github.com/sqrzl/website).
The public root domain is published from
[`sqrzl/sqrzl.github.io`](https://github.com/sqrzl/sqrzl.github.io). Push the
same source commit to both repositories to update the site. The `pages` remote
in this checkout points to `sqrzl/sqrzl.github.io`.

In the root-domain repository, `.github/workflows/pages.yml` installs locked
dependencies with `npm ci`, runs `npm run build` (Vite Plus followed by
`askr ssg`), and publishes `dist/static` with GitHub's Pages actions. The
workflow skips deployment when it runs from `sqrzl/website`, preventing a
second copy at `/website/`.
