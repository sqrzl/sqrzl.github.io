# Sqrzl Website

The public marketing page and user documentation for the
[Sqrzl emulator](https://github.com/sqrzl/sqrzl-emulator), published at
[sqrzl.github.io](https://sqrzl.github.io/).

The site is built with Askr and Vite Plus. Askr provides the JSX runtime and
route registry; the Askr CLI generates deployable pages from that shared
registry. Vite Plus (`vp`) runs the development server and builds the browser
assets.

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
- `src/components/ui/` contains the small shared UI primitives.
- `src/routes.tsx` declares the Askr route registry used for site navigation and static generation.
- `src/styles.css` contains the shared layout and visual styles.
- `ssg.config.ts` configures the Askr CLI's `askr ssg` command, document metadata, static assets, and sitemap.

Use kebab-case for route paths and source filenames. To add a documentation
page, add its thin route page and feature, register the path in
`src/routes.tsx`, add its link to `src/components/docs-sidebar.tsx`, and add its
title and description to the route metadata in `ssg.config.ts`.

## Deployment

`.github/workflows/pages.yml` deploys the site to GitHub Pages when a commit is
pushed to `main` or the workflow is started manually. It installs locked
dependencies with `npm ci`, runs `npm run build`, and publishes `dist/static`.
Because the repository is `sqrzl.github.io`, the site is served from the domain
root rather than a repository subpath.
