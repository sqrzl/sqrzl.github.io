import { setTimeout as delay } from 'node:timers/promises';

const base = new URL(process.env.SITE_URL ?? 'https://sqrzl.github.io/');
const source = process.env.EXPECTED_SOURCE_SHA ?? process.env.GITHUB_SHA;
if (!/^[a-f0-9]{40}$/.test(source ?? ''))
  throw new Error('An exact expected source SHA is required.');
const deadline = Date.now() + 120000;
let attempt = 0;
while (true) {
  try {
    const read = async (path, status = 200) => {
      const url = new URL(path, base);
      url.searchParams.set('revision', `${source}-${attempt}`);
      const response = await fetch(url, {
        headers: { 'cache-control': 'no-cache' },
        signal: AbortSignal.timeout(15000),
      });
      if (response.status !== status)
        throw new Error(`${url.pathname}: HTTP ${response.status}`);
      return response.text();
    };
    const info = JSON.parse(await read('build-info.json'));
    if (info.source_sha !== source || info.dirty_worktree !== false)
      throw new Error('Published revision is not the expected clean source.');
    const expected = [
      ['', 'Run your cloud services locally'],
      ['__site-check__/nested/missing', 'Page not found', 404],
      ['docs/configuration/', 'TWILIO_ACCOUNT_SID'],
      ['docs/runtime/', 'SQRZL_MAX_CONNECTIONS'],
      ['docs/compatibility/', 'local-core-v1'],
      ['docs/email.md', 'SES_CONFIGURATION_SETS'],
      ['docs/sms.md', 'TWILIO_AUTH_TOKEN'],
      ['llms-full.txt', 'SQRZL_MAX_MCP_SESSIONS'],
    ];
    await Promise.all(
      expected.map(async ([path, content, status]) => {
        if (!(await read(path, status)).includes(content))
          throw new Error(`Published content missing at ${path}`);
      })
    );
    console.log(
      `Verified ${expected.length} published surfaces at ${base} from ${source}.`
    );
    break;
  } catch (error) {
    if (Date.now() >= deadline) throw error;
    console.log(`Waiting for Pages propagation: ${error.message}`);
    attempt += 1;
    await delay(5000);
  }
}
