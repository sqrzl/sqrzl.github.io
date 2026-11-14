import { For } from '@askrjs/askr/control';
import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

const limits = [
  ['SQRZL_MAX_CONNECTIONS', '128', 'Shared API, UI and SMTP connection cap.'],
  [
    'SQRZL_MAX_INFLIGHT_REQUESTS',
    '4',
    'Shared HTTP, MCP tool and SMTP DATA work slots.',
  ],
  [
    'SQRZL_MAX_INFLIGHT_BYTES',
    '536870912 (512 MiB)',
    'Encoded-input reservations across admitted work.',
  ],
  ['SQRZL_MAX_MCP_SESSIONS', '128', 'Maximum retained MCP sessions.'],
  [
    'SQRZL_MAX_SMTP_RECIPIENTS',
    '1000',
    'Accepted RCPT commands in one SMTP transaction.',
  ],
  [
    'SQRZL_DRAIN_TIMEOUT_MS',
    '30000 (30 seconds)',
    'One shutdown deadline across listeners.',
  ],
];

export default function RuntimeDocsFeature() {
  return (
    <DocsLayout
      current="runtime"
      title="Runtime and diagnostics"
      description="Bound concurrent work, stop gracefully, and inspect local readiness."
    >
      <DocSection title="Admission limits">
        <dl class="settings-list">
          <For each={limits} by={(limit) => limit[0]}>
            {(limit) => (
              <div>
                <dt>
                  <code>{limit[0]}</code>
                </dt>
                <dd>
                  <strong>Default: {limit[1]}.</strong> {limit[2]}
                </dd>
              </div>
            )}
          </For>
        </dl>
        <p>
          Limits are shared across listeners and do not create an admission
          queue. HTTP work overload returns <code>503</code> with{' '}
          <code>Retry-After</code>; SMTP DATA overload returns <code>452</code>.
          Excess connections close, with SMTP returning <code>421</code> where
          possible. Rejected recipients leave the previously accepted SMTP
          envelope usable.
        </p>
        <p>
          Each admitted application request reserves the configured{' '}
          <code>SQRZL_MAX_REQUEST_BYTES</code> maximum until its response and
          worker finish. The default is 128 MiB per request. The byte budget
          must be at least that large. These reservations do not include all
          decoded data, fan-out copies or caches; use container memory and disk
          quotas when you need hard process limits. Mail capture has a separate
          64 MiB projected allocation budget.
        </p>
        <p>
          Admission settings must be positive integers. The drain timeout
          accepts 1–300000 milliseconds. Invalid limits fail startup before
          storage is created. Recreate the container after changing its
          environment.
        </p>
      </DocSection>
      <DocSection title="Stop gracefully">
        <pre>
          <code>docker compose down --timeout 35</code>
        </pre>
        <p>
          SIGINT and SIGTERM stop new admission. Admitted uploads, SMTP DATA and
          callbacks can finish against one shared deadline; idle SMTP sessions
          close. At the deadline, stalled asynchronous work is cancelled.
          Blocking filesystem writes retain storage ownership until they finish
          and can extend process exit.
        </p>
        <p>
          Give Docker more time than the configured drain timeout. The command
          above allows 35 seconds for the default 30-second drain. Increase it
          when you increase <code>SQRZL_DRAIN_TIMEOUT_MS</code> or need more
          time for slow storage. A forced kill can interrupt work that has not
          been acknowledged.
        </p>
      </DocSection>
      <DocSection title="Readiness and metrics">
        <pre>
          <code>
            {
              'curl --fail http://localhost:9000/healthz\ncurl --fail http://localhost:9001/healthz'
            }
          </code>
        </pre>
        <p>
          Health reports blob, mail and SMS readability, authentication modes,
          admission counts and limits, MCP sessions and draining state. An
          unreadable subsystem makes readiness return <code>503</code>.
          Readability does not guarantee writable media or free disk space.
          During shutdown, listeners stop accepting new connections.
        </p>
        <p>
          Prometheus metrics are at <code>http://localhost:9001/metrics</code>.
          When admin authentication is enabled, open that URL in a signed-in
          browser or send a valid admin session cookie. Metrics include active
          connections and requests, reserved bytes, rejections, fixed status
          classes and work-duration buckets, plus bounded usage series.
        </p>
        <p>
          One separate probe slot keeps health and metrics available during work
          saturation, subject to the shared connection cap. Diagnostic labels do
          not contain request paths, credentials or message contents.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
