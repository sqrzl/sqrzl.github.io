import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import {
  attribute,
  documents,
  elements,
  markdown,
  markdownPath,
  siteUrl,
  text,
} from '../scripts/site-html.mjs';

const output = resolve('dist/static');
const pages = documents(output);
const retired =
  /SQRZL_(?:SENDGRID_API_KEY|TWILIO_ACCOUNT_SID|TWILIO_AUTH_TOKEN|TWILIO_API_KEY_SID|TWILIO_API_KEY_SECRET|ACS_CONNECTION_STRING|SES_CONFIGURATION_SETS|AZURE_ENCRYPTION_SCOPES)/;

test('all published documentation uses current vendor configuration names', () => {
  for (const page of pages)
    assert.doesNotMatch(text(page.content), retired, page.path);
  for (const filename of ['llms-full.txt', 'docs/email.md', 'docs/sms.md']) {
    assert.doesNotMatch(
      readFileSync(resolve(output, filename), 'utf8'),
      retired,
      filename
    );
  }
});

test('operating guide and compatibility page expose the current bounded contract', () => {
  const runtime = pages.find((page) => page.path === '/docs/runtime');
  assert.ok(runtime, 'runtime guide must be generated');
  for (const name of [
    'SQRZL_MAX_CONNECTIONS',
    'SQRZL_MAX_INFLIGHT_REQUESTS',
    'SQRZL_MAX_INFLIGHT_BYTES',
    'SQRZL_MAX_MCP_SESSIONS',
    'SQRZL_MAX_SMTP_RECIPIENTS',
    'SQRZL_DRAIN_TIMEOUT_MS',
  ]) {
    assert.ok(text(runtime.content).includes(name), name);
  }
  const compatibility = pages.find(
    (page) => page.path === '/docs/compatibility'
  );
  assert.match(text(compatibility.content), /local-core-v1/);
  assert.match(text(compatibility.content), /partial/);
  assert.match(text(compatibility.content), /2024-11-04/);
});

test('every rendered page has one main landmark and one primary heading', () => {
  for (const page of pages) {
    assert.equal(
      page.nodes.filter((node) => node.tagName === 'main').length,
      1,
      page.path
    );
    assert.equal(
      page.nodes.filter((node) => node.tagName === 'h1').length,
      1,
      page.path
    );
  }
});

test('document base URLs resolve all local navigation and assets to generated files', () => {
  for (const page of pages) {
    for (const node of page.nodes) {
      const href = ['a', 'link'].includes(node.tagName)
        ? attribute(node, 'href')
        : ['script', 'img'].includes(node.tagName)
          ? attribute(node, 'src')
          : undefined;
      if (!href) continue;
      const url = new URL(href, page.base);
      if (url.origin !== new URL(siteUrl).origin) continue;
      let filename = resolve(output, `.${decodeURIComponent(url.pathname)}`);
      if (existsSync(filename) && statSync(filename).isDirectory())
        filename = resolve(filename, 'index.html');
      assert.ok(
        existsSync(filename),
        `${page.path}: ${href} resolves to missing ${filename}`
      );
    }
  }
});

test('Markdown and full-text mirrors preserve every rendered code example', () => {
  const full = readFileSync(resolve(output, 'llms-full.txt'), 'utf8');
  for (const page of pages) {
    const mirror = readFileSync(
      resolve(output, markdownPath(page.path)),
      'utf8'
    );
    assert.ok(full.includes(page.url.href), page.path);
    if (page.path.startsWith('/docs')) {
      assert.ok(
        page.nodes.some(
          (node) =>
            attribute(node, 'rel') === 'alternate' &&
            attribute(node, 'type') === 'text/markdown'
        ),
        page.path
      );
    }
    for (const node of elements(page.content)) {
      if (node.tagName !== 'pre') continue;
      const example = text(node).trim();
      assert.ok(
        mirror.includes(example),
        `${page.path}: Markdown changed a code example`
      );
      assert.ok(
        full.includes(example),
        `${page.path}: full text changed a code example`
      );
    }
  }
});

test('published build identity matches the checked-out source', () => {
  const info = JSON.parse(
    readFileSync(resolve(output, 'build-info.json'), 'utf8')
  );
  assert.equal(
    info.source_sha,
    execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  );
  assert.equal(typeof info.dirty_worktree, 'boolean');
  if (process.env.CI) assert.equal(info.dirty_worktree, false);
});

test('Markdown conversion preserves code whitespace, literal fences and entity decoding', () => {
  const root = parse(
    '<main><h1>Example</h1><pre><code>one\n\n\n    &lt;two&gt;\n```\n</code></pre><a href="docs/runtime/">Runtime</a></main>'
  );
  const result = markdown(root, new URL(siteUrl));
  assert.ok(result.includes('one\n\n\n    <two>\n```'));
  assert.ok(result.includes('````\n'));
  assert.ok(
    result.includes('[Runtime](https://sqrzl.github.io/docs/runtime/)')
  );
});

test('framework 404 uses a root base for unknown nested URLs and stays out of search', () => {
  const document = parse(readFileSync(resolve(output, '404.html'), 'utf8'));
  const nodes = [...elements(document)];
  assert.equal(
    attribute(
      nodes.find((node) => node.tagName === 'base'),
      'href'
    ),
    '/'
  );
  assert.ok(
    nodes.some(
      (node) =>
        node.tagName === 'meta' &&
        attribute(node, 'name') === 'robots' &&
        attribute(node, 'content') === 'noindex'
    )
  );
  assert.match(
    text(nodes.find((node) => node.tagName === 'h1')),
    /Page not found/
  );
});

test('search sitemap excludes the synthetic 404 route', () => {
  const sitemap = readFileSync(resolve(output, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/404(?:\/|\.html)<\/loc>/);
});

test('skip links stay on the current page and target a focusable main', () => {
  for (const page of pages) {
    const link = page.nodes.find((node) =>
      (attribute(node, 'class') ?? '').split(' ').includes('skip-link')
    );
    const target = new URL(attribute(link, 'href'), page.base);
    assert.equal(target.pathname, page.url.pathname, page.path);
    assert.equal(target.hash, '#content');
    assert.equal(
      attribute(
        page.nodes.find((node) => node.tagName === 'main'),
        'tabindex'
      ),
      '-1',
      page.path
    );
  }
});

test('literal marker text cannot be mistaken for an extracted code block', () => {
  const root = parse(
    '<main><p>&lt;!--SQRZL-CODE-0--&gt;</p><pre><code>real code</code></pre></main>'
  );
  const result = markdown(root, new URL(siteUrl));
  assert.ok(result.includes('<!--SQRZL-CODE-0-->'));
  assert.equal(result.match(/real code/g).length, 1);
});

test('inline code retains significant spaces and literal backticks', () => {
  const root = parse(
    '<main><p><code>a  b</code> and <code>literal ` fence</code></p></main>'
  );
  const result = markdown(root, new URL(siteUrl));
  assert.ok(result.includes('`a  b`'));
  assert.ok(result.includes('``literal ` fence``'));
});

test('documented admission defaults match the qualified running emulator reference', () => {
  const reference = JSON.parse(
    readFileSync(
      new URL('./fixtures/emulator-runtime.json', import.meta.url),
      'utf8'
    )
  );
  assert.match(reference.source_sha, /^[a-f0-9]{40}$/);
  const runtime = pages.find((page) => page.path === '/docs/runtime');
  const rows = new Map();
  for (const node of elements(runtime.content)) {
    if (node.tagName !== 'div') continue;
    const term = node.childNodes?.find((child) => child.tagName === 'dt');
    const definition = node.childNodes?.find((child) => child.tagName === 'dd');
    if (term && definition)
      rows.set(
        text(term).trim(),
        Number(text(definition).match(/Default:\s*(\d+)/)?.[1])
      );
  }
  for (const [name, value] of Object.entries(reference.defaults))
    assert.equal(rows.get(name), value, name);
});
