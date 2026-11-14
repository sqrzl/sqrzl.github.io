import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { documents, markdown, markdownPath } from './site-html.mjs';

const output = resolve('dist/static');
const sections = [
  '# Sqrzl documentation\n\nGenerated from the same pages as the website. The guides describe source builds; published images may lag main.',
];
for (const page of documents(output)) {
  const content = markdown(page.content, page.base);
  const filename = resolve(output, markdownPath(page.path));
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, content);
  sections.push(`Source: ${page.url.href}\n\n${content}`);
}
writeFileSync(
  resolve(output, 'llms-full.txt'),
  `${sections.join('\n\n---\n\n')}\n`
);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
writeFileSync(
  resolve(output, 'build-info.json'),
  `${JSON.stringify(
    {
      source_sha: git('rev-parse', 'HEAD'),
      source_tree: git('rev-parse', 'HEAD^{tree}'),
      dirty_worktree: git('status', '--porcelain').length > 0,
    },
    null,
    2
  )}\n`
);
console.log(
  'Generated Markdown mirrors, full-text documentation and build identity.'
);
