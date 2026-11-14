import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve('@askrjs/cli/package.json'));
const configRequire = createRequire(cliRequire.resolve('@npmcli/config'));
const mapWorkspaces = configRequire('@npmcli/map-workspaces');
const workspaceRequire = createRequire(
  configRequire.resolve('@npmcli/map-workspaces')
);
const { glob } = workspaceRequire('glob');

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'sqrzl-workspaces-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const name of ['alpha', 'beta', 'excluded']) {
    const directory = join(root, 'packages', name);
    mkdirSync(directory, { recursive: true });
    writeFileSync(
      join(directory, 'package.json'),
      JSON.stringify({ name, version: '1.0.0' })
    );
  }
  return root;
}

test('patched workspace globs preserve exclusions and explicit reinclusion', async (t) => {
  const root = fixture(t);
  const selected = await mapWorkspaces({
    cwd: root,
    pkg: { workspaces: ['packages/*', '!packages/excluded'] },
  });
  assert.deepEqual([...selected.keys()].sort(), ['alpha', 'beta']);
  const reincluded = await mapWorkspaces({
    cwd: root,
    pkg: {
      workspaces: ['packages/*', '!packages/excluded', 'packages/excluded'],
    },
  });
  assert.deepEqual([...reincluded.keys()].sort(), [
    'alpha',
    'beta',
    'excluded',
  ]);
});

test('an already cancelled glob does not produce workspace results', async (t) => {
  const root = fixture(t);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    glob('packages/*', { cwd: root, signal: controller.signal }),
    { name: 'AbortError' }
  );
});
