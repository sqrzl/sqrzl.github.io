import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'parse5';

export const siteUrl = 'https://sqrzl.github.io/';
export const attribute = (node, name) =>
  node.attrs?.find((item) => item.name === name)?.value;
export function* elements(node) {
  if (node.tagName) yield node;
  for (const child of node.childNodes ?? []) yield* elements(child);
}
export function text(node) {
  if (['script', 'style', 'svg'].includes(node.tagName)) return '';
  return node.nodeName === '#text'
    ? node.value
    : (node.childNodes ?? []).map(text).join('');
}
export function documents(output = 'dist/static') {
  const metadata = JSON.parse(
    readFileSync(resolve(output, 'metadata.json'), 'utf8')
  );
  return metadata.routes
    .filter((route) => route.path !== '/404')
    .map((route) => {
      if (route.status !== 'success')
        throw new Error(`Failed route: ${route.path}`);
      const html = readFileSync(resolve(output, route.filePath), 'utf8');
      const document = parse(html);
      const nodes = [...elements(document)];
      const url = new URL(route.path === '/' ? '/' : `${route.path}/`, siteUrl);
      const base = new URL(
        attribute(
          nodes.find((node) => node.tagName === 'base') ?? {},
          'href'
        ) ?? './',
        url
      );
      const content =
        nodes.find((node) => node.tagName === 'article') ??
        nodes.find((node) => node.tagName === 'main');
      if (!content) throw new Error(`Missing main content: ${route.path}`);
      return { ...route, html, document, nodes, url, base, content };
    });
}
export function markdownPath(path) {
  return path === '/'
    ? 'index.md'
    : path === '/docs'
      ? 'docs/index.md'
      : `${path.slice(1)}.md`;
}
export function markdown(content, base) {
  const codeBlocks = [];
  // HTML parsing cannot produce NUL text, so this delimiter cannot collide
  // with authored prose, attributes or code examples.
  const delimiter = String.fromCharCode(0);
  const fenceFor = (code, minimum) =>
    '`'.repeat(
      [...code.matchAll(/`+/g)].reduce(
        (longest, match) => Math.max(longest, match[0].length),
        minimum - 1
      ) + 1
    );
  const children = (node) => (node.childNodes ?? []).map(render).join('');
  function render(node) {
    if (node.nodeName === '#text') return node.value.replace(/\s+/g, ' ');
    if (['style', 'script', 'svg', 'nav', 'aside'].includes(node.tagName))
      return '';
    if (node.tagName === 'pre') {
      const marker = `${delimiter}${codeBlocks.length}${delimiter}`;
      const code = text(node).replace(/^\n|\n$/g, '');
      const fence = fenceFor(code, 3);
      codeBlocks.push(`${fence}\n${code}\n${fence}`);
      return `\n\n${marker}\n\n`;
    }
    if (node.tagName === 'table') {
      const rows = [...elements(node)]
        .filter((item) => item.tagName === 'tr')
        .map((row) =>
          (row.childNodes ?? [])
            .filter((cell) => ['td', 'th'].includes(cell.tagName))
            .map((cell) => children(cell).trim().replaceAll('|', '\\|'))
        );
      if (!rows.length) return '';
      const line = (row) => `| ${row.join(' | ')} |`;
      return `\n\n${[line(rows[0]), line(rows[0].map(() => '---')), ...rows.slice(1).map(line)].join('\n')}\n\n`;
    }
    const value = children(node);
    if (/^h[1-6]$/.test(node.tagName ?? ''))
      return `\n\n${'#'.repeat(Number(node.tagName[1]))} ${value.trim()}\n\n`;
    if (node.tagName === 'a') {
      const href = attribute(node, 'href');
      const label = value.trim() || attribute(node, 'aria-label');
      return href && label ? `[${label}](${new URL(href, base)})` : value;
    }
    if (node.tagName === 'code') {
      const code = text(node);
      const fence = fenceFor(code, 1);
      const padding = /^[ `]|[ `]$/.test(code) ? ' ' : '';
      return `${fence}${padding}${code}${padding}${fence}`;
    }
    if (['strong', 'b'].includes(node.tagName)) return `**${value}**`;
    if (['em', 'i'].includes(node.tagName)) return `*${value}*`;
    if (node.tagName === 'li') return `\n- ${value.trim()}\n`;
    if (node.tagName === 'dt') return `\n- **${value.trim()}**: `;
    if (node.tagName === 'dd') return `${value.trim()}\n`;
    if (node.tagName === 'br') return '\n';
    if (['p', 'ul', 'ol', 'dl', 'section', 'header'].includes(node.tagName))
      return `\n\n${value.trim()}\n\n`;
    return value;
  }
  return `${render(content)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .split(delimiter)
    .map((part, index) => (index % 2 === 1 ? codeBlocks[Number(part)] : part))
    .join('')}\n`;
}
