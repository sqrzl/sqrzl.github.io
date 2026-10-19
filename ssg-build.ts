import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createStaticGen } from '@askrjs/askr/ssg';

import { registry } from './src/routes';
import { clientOutputDir, outputDir } from './ssg.config';

const rootHtmlPath = join(clientOutputDir, 'index.html');
const ssg = createStaticGen({
  registry,
  outputDir,
  assets: [
    { from: join(clientOutputDir, 'assets'), to: 'assets' },
    { from: join(clientOutputDir, 'favicon.svg') },
    { from: join(clientOutputDir, '404.html') },
  ],
});
const rootShell = await readFile(rootHtmlPath, 'utf8');
const result = await ssg.generate({ mode: 'full' });

const routeMetadata: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  'index.html': {
    title: 'Sqrzl Emulator',
    description:
      'Run object storage, email, and messaging services locally with the Sqrzl emulator.',
  },
  'docs/index.html': {
    title: 'Documentation | Sqrzl Emulator',
    description:
      'Quickstarts and focused guides for running and using the Sqrzl emulator.',
  },
  'docs/quick-start/index.html': {
    title: 'Quickstart | Sqrzl Emulator',
    description:
      'Start Sqrzl with Docker Compose and check the local services.',
  },
  'docs/s3/index.html': {
    title: 'S3 | Sqrzl Emulator',
    description: 'Connect an S3-compatible client to the Sqrzl emulator.',
  },
  'docs/azure-blob/index.html': {
    title: 'Azure Blob Storage | Sqrzl Emulator',
    description: 'Connect an Azure Blob Storage client to Sqrzl.',
  },
  'docs/gcs/index.html': {
    title: 'Google Cloud Storage | Sqrzl Emulator',
    description: 'Connect Google Cloud Storage clients to Sqrzl.',
  },
  'docs/oci/index.html': {
    title: 'OCI Object Storage | Sqrzl Emulator',
    description: 'Configure OCI Object Storage clients for the Sqrzl emulator.',
  },
  'docs/configuration/index.html': {
    title: 'Configuration | Sqrzl Emulator',
    description:
      'Configure authentication, ports, storage, and request limits.',
  },
  'docs/persistence/index.html': {
    title: 'Data and reset | Sqrzl Emulator',
    description: 'Keep, back up, and reset local Sqrzl emulator data.',
  },
  'docs/email-and-messaging/index.html': {
    title: 'Email and messaging | Sqrzl Emulator',
    description: 'Use local email and messaging emulation with Sqrzl.',
  },
  'docs/compatibility/index.html': {
    title: 'Compatibility | Sqrzl Emulator',
    description:
      'Review provider compatibility and supported Sqrzl operations.',
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getBaseHref(filePath: string) {
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const depth = normalizedPath.split('/').length - 1;

  if (depth <= 0) {
    return './';
  }

  return `${'../'.repeat(depth)}`;
}

function buildDocument(shellHtml: string, filePath: string, html: string) {
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const metadata = routeMetadata[normalizedPath] ?? routeMetadata['index.html'];
  const baseHref = getBaseHref(normalizedPath);
  const titlePattern = /<title>[\s\S]*?<\/title>/;
  const descriptionPattern =
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/;
  const appMountPattern = /<div id="app">\s*<\/div>/;

  if (!appMountPattern.test(shellHtml)) {
    throw new Error('Root template is missing the #app mount point.');
  }

  let documentHtml = shellHtml.replace(
    titlePattern,
    `<title>${escapeHtml(metadata.title)}</title>`
  );
  documentHtml = documentHtml.replace(
    descriptionPattern,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`
  );
  documentHtml = documentHtml.replace(
    titlePattern,
    (match) => `${match}\n    <base href="${baseHref}" />`
  );

  return documentHtml.replace(appMountPattern, `<div id="app">${html}</div>`);
}

console.log(`Generated ${result.successful}/${result.totalRoutes} pages`);

if (result.failed > 0) {
  console.error(`Generation failed for ${result.failed} route(s).`);
  process.exit(1);
}

const rootRoute = result.routes.find(
  (route) =>
    route.filePath.replace(/^\/+/, '') === 'index.html' &&
    route.status === 'success' &&
    route.written
);

if (!rootRoute) {
  throw new Error('Root SSG output was not generated.');
}

for (const route of result.routes) {
  if (route.status !== 'success' || !route.written) {
    continue;
  }

  const routePath = route.filePath.replace(/^\/+/, '');
  const routeHtmlPath = join(outputDir, routePath);
  const routeDocumentHtml = buildDocument(rootShell, routePath, route.html);

  await writeFile(routeHtmlPath, routeDocumentHtml, 'utf8');
}
