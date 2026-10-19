import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function QuickStartDocsFeature() {
  return (
    <DocsLayout
      current="quick-start"
      title="Quickstart"
      description="Run the emulator with Docker Compose and check that the services are ready."
    >
      <DocSection title="Start Sqrzl">
        <p>Run these commands in a terminal:</p>
        <pre>
          <code>
            {
              'git clone https://github.com/sqrzl/sqrzl-emulator.git\ncd sqrzl-emulator\ndocker compose up --build'
            }
          </code>
        </pre>
        <p>
          The first build can take a few minutes. Leave Compose running while
          you use the emulator.
        </p>
      </DocSection>

      <DocSection title="Open a service">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Storage APIs</td>
              <td>
                <code>http://localhost:9000</code>
              </td>
            </tr>
            <tr>
              <td>Admin UI</td>
              <td>
                <code>http://localhost:9001</code>
              </td>
            </tr>
            <tr>
              <td>SMTP capture</td>
              <td>
                <code>localhost:2525</code>
              </td>
            </tr>
            <tr>
              <td>API health</td>
              <td>
                <code>http://localhost:9000/healthz</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The checked-in Compose file enables authentication. Sign in to the
          admin UI with:
        </p>
        <dl class="credential-list">
          <div>
            <dt>Username or access key</dt>
            <dd>
              <code>admin</code>
            </dd>
          </div>
          <div>
            <dt>Password or secret key</dt>
            <dd>
              <code>sqrzl-secret</code>
            </dd>
          </div>
        </dl>
      </DocSection>

      <DocSection title="Check readiness">
        <pre>
          <code>
            {'curl --fail http://localhost:9000/healthz\ndocker compose ps'}
          </code>
        </pre>
        <p>
          A healthy API returns <code>200 OK</code>. To inspect startup or
          request logs, run:
        </p>
        <pre>
          <code>docker compose logs --follow sqrzl</code>
        </pre>
      </DocSection>

      <DocSection title="Stop Sqrzl">
        <pre>
          <code>docker compose down</code>
        </pre>
        <p>
          This stops the container and keeps the named storage volume. See{' '}
          <a href="docs/persistence/">Data and reset</a> before deleting stored
          data.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
