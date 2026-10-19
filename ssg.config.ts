import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { DocumentRenderArgs } from '@askrjs/askr/ssg';

import { registry } from './src/routes';

const clientOutputDir = './dist/client';
const outputDir = './dist/static';
const siteUrl = 'https://sqrzl.github.io';

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Sqrzl Emulator',
    description:
      'Run object storage, email, and messaging services locally with the Sqrzl emulator.',
  },
  '/docs': {
    title: 'Documentation | Sqrzl Emulator',
    description:
      'Quickstarts and focused guides for running and using the Sqrzl emulator.',
  },
  '/docs/quick-start': {
    title: 'Quickstart | Sqrzl Emulator',
    description: 'Start Sqrzl with Docker Compose and check the local services.',
  },
  '/docs/s3': {
    title: 'S3 | Sqrzl Emulator',
    description: 'Connect an S3-compatible client to the Sqrzl emulator.',
  },
  '/docs/azure-blob': {
    title: 'Azure Blob Storage | Sqrzl Emulator',
    description: 'Connect an Azure Blob Storage client to Sqrzl.',
  },
  '/docs/gcs': {
    title: 'Google Cloud Storage | Sqrzl Emulator',
    description: 'Connect Google Cloud Storage clients to Sqrzl.',
  },
  '/docs/oci': {
    title: 'OCI Object Storage | Sqrzl Emulator',
    description: 'Configure OCI Object Storage clients for the Sqrzl emulator.',
  },
  '/docs/configuration': {
    title: 'Configuration | Sqrzl Emulator',
    description: 'Configure authentication, ports, storage, and request limits.',
  },
  '/docs/persistence': {
    title: 'Data and reset | Sqrzl Emulator',
    description: 'Keep, back up, and reset local Sqrzl emulator data.',
  },
  '/docs/email-and-messaging': {
    title: 'Email and messaging | Sqrzl Emulator',
    description: 'Use local email and messaging emulation with Sqrzl.',
  },
  '/docs/compatibility': {
    title: 'Compatibility | Sqrzl Emulator',
    description: 'Review provider compatibility and supported Sqrzl operations.',
  },
};

const titlePattern = /<title>[\s\S]*?<\/title>/;
const descriptionPattern = /<meta\s+name="description"\s+content="[^"]*"\s*\/>/;
const appMountPattern = /<div([^>]*\bid=["']app["'][^>]*)>\s*<\/div>/i;
let clientTemplate: string | undefined;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function baseHrefForRoute(pathname: string) {
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');
  const depth = normalizedPath ? normalizedPath.split('/').length : 0;

  return depth > 0 ? '../'.repeat(depth) : './';
}

function renderDocument({ appHtml, context }: DocumentRenderArgs) {
  const template =
    clientTemplate ??
    (clientTemplate = readFileSync(
      resolve(clientOutputDir, 'index.html'),
      'utf8'
    ));

  if (
    !titlePattern.test(template) ||
    !descriptionPattern.test(template) ||
    !appMountPattern.test(template)
  ) {
    throw new Error(
      'Built client template must contain a title, description, and empty #app mount point.'
    );
  }

  const metadata = routeMetadata[context.route.path] ?? routeMetadata['/'];
  let documentHtml = template.replace(
    titlePattern,
    `<title>${escapeHtml(metadata.title)}</title>`
  );
  documentHtml = documentHtml.replace(
    descriptionPattern,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`
  );
  documentHtml = documentHtml.replace(
    titlePattern,
    (match) => `${match}\n    <base href="${baseHrefForRoute(context.route.path)}" />`
  );

  return documentHtml.replace(
    appMountPattern,
    (_match, attributes: string) => `<div${attributes}>${appHtml}</div>`
  );
}

export const staticConfig = {
  registry,
  outputDir,
  siteUrl,
  sitemap: {
    resolve: (route: { path: string }) => ({
      url: route.path === '/' ? '/' : `${route.path}/`,
    }),
  },
  document: renderDocument,
  assets: [
    { from: resolve(clientOutputDir, 'assets'), to: 'assets' },
    { from: resolve(clientOutputDir, '404.html') },
  ],
};
