import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function McpDocsFeature() {
  return (
    <DocsLayout
      current="mcp"
      title="Connect an MCP client"
      description="Use Sqrzl's standard Model Context Protocol server over Streamable HTTP."
    >
      <DocSection title="Connect to Sqrzl">
        <dl class="settings-list">
          <div>
            <dt>Endpoint</dt>
            <dd>
              <code>http://localhost:9001/mcp</code>
            </dd>
          </div>
          <div>
            <dt>Transport</dt>
            <dd>Streamable HTTP</dd>
          </div>
          <div>
            <dt>Capabilities</dt>
            <dd>Tools and resources</dd>
          </div>
        </dl>
        <p>
          The MCP endpoint shares the UI and admin listener. Its default port is{' '}
          <code>9001</code> (<code>SQRZL_UI_PORT</code>); the provider storage
          endpoint on <code>9000</code> is separate. If you map a different host
          port, use that port in the MCP URL. Connect with an MCP client that
          supports Streamable HTTP; Sqrzl does not require a separate MCP
          process or a custom protocol.
        </p>
      </DocSection>

      <DocSection title="Tools">
        <p>
          Use the MCP client's tool discovery to see the schemas available from
          the running Sqrzl version. The tool set covers:
        </p>
        <ul>
          <li>
            Buckets, lifecycle rules, policies, ACLs, and versioning, including{' '}
            <code>bucket_list</code> and <code>bucket_create</code>.
          </li>
          <li>
            Object listing, content, metadata, tags, ACLs, versions, copy,
            delete, and multipart uploads. Binary content uses base64 fields,
            such as <code>object_content_get</code> and{' '}
            <code>object_content_put</code>.
          </li>
          <li>
            Captured email and simulated text messages, including{' '}
            <code>mail_send_simulate</code>, <code>text_send_simulate</code>,
            inbound-message simulation, and delivery transitions.
          </li>
          <li>
            Usage diagnostics through <code>usage_query</code>.
          </li>
        </ul>
        <p>
          Tool calls use the same emulator services and stores as the admin UI
          and admin HTTP API, so changes and captured messages are visible
          there too. Email tools capture messages and text tools simulate
          delivery; neither sends to real recipients. Read tools use{' '}
          <code>sqrzl:read</code>; changes use{' '}
          <code>sqrzl:write</code> when OAuth is enabled.
        </p>
      </DocSection>

      <DocSection title="Resources and metrics">
        <table>
          <thead>
            <tr>
              <th>Resource or endpoint</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>sqrzl://health</code>
              </td>
              <td>Read the emulator health status as JSON.</td>
            </tr>
            <tr>
              <td>
                <code>sqrzl://usage</code>
              </td>
              <td>
                Read process-local usage rows for provider, bucket, client,
                operation, byte, and list activity.
              </td>
            </tr>
            <tr>
              <td>
                <code>/metrics</code>
              </td>
              <td>
                Export Prometheus text for request counts, bytes, request-size
                histograms, and list activity.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The usage resource and <code>usage_query</code> accept{' '}
          <code>min_requests</code> and <code>min_bytes</code> thresholds. The
          Prometheus endpoint accepts <code>?min_requests=N</code>. Counters are
          held in memory and reset when Sqrzl restarts. When admin session auth
          is enabled, <code>/metrics</code> uses that admin session.
        </p>
      </DocSection>

      <DocSection title="Authentication">
        <p>
          MCP is open when provider authentication is off and{' '}
          <code>SQRZL_MCP_AUTH_ENABLED</code> is false. The checked-in Compose
          setup sets <code>admin</code> and <code>sqrzl-secret</code>, which
          protect MCP too; those credentials are not OAuth bearer tokens, and
          Compose does not configure OAuth by default. Add the OAuth settings
          below before using protected MCP, or remove both generic access-key
          variables for a local open session. Removing them also opens provider
          and admin APIs, so keep that listener bound to loopback.
        </p>
        <p>
          Sqrzl does not issue OAuth tokens. It validates bearer tokens against
          the configured JWKS and checks token expiration, issuer, audience,
          and the scope needed for each read or write. The authorization server
          must issue tokens for the exact resource URL.
        </p>
        <table>
          <thead>
            <tr>
              <th>Scope</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>sqrzl:read</code>
              </td>
              <td>Read tools and MCP resources.</td>
            </tr>
            <tr>
              <td>
                <code>sqrzl:write</code>
              </td>
              <td>Tools that create, update, simulate, or delete data.</td>
            </tr>
          </tbody>
        </table>
        <p>
          When OAuth protection is configured, resource metadata is available at{' '}
          <code>/.well-known/oauth-protected-resource/mcp</code>. MCP clients
          send their token in the <code>Authorization: Bearer</code> header;
          admin UI/API cookie sessions remain separate.
        </p>
      </DocSection>

      <DocSection title="OAuth configuration">
        <p>
          Set all five resource-server values. The URLs below are examples;
          replace them with your authorization server's real endpoints and
          claims.
        </p>
        <pre>
          <code>
            {
              'SQRZL_MCP_AUTH_ENABLED=true\nSQRZL_MCP_RESOURCE_URL=https://sqrzl.example/mcp\nSQRZL_MCP_AUTHORIZATION_SERVER=https://auth.example\nSQRZL_MCP_ISSUER=https://auth.example/\nSQRZL_MCP_AUDIENCE=https://sqrzl.example/mcp\nSQRZL_MCP_JWKS_URL=https://auth.example/.well-known/jwks.json'
            }
          </code>
        </pre>
        <p>
          <code>SQRZL_MCP_RESOURCE_URL</code> must be an absolute URL whose path
          is exactly <code>/mcp</code>. The resource and authorization-server
          URLs can use HTTP for local development; the JWKS URL must use HTTPS.
          The configured issuer and audience must exactly match the access
          token claims. See <a href="docs/configuration/">Configuration</a> for
          other runtime settings.
        </p>
      </DocSection>

      <DocSection title="Browser origins and host names">
        <p>
          The MCP transport accepts loopback hosts by default. Add public HTTP
          Host values with <code>SQRZL_MCP_ALLOWED_HOSTS</code> when using a
          reverse proxy. Browser clients must use an allowed origin; the
          defaults are the local UI origins. Add origins with{' '}
          <code>SQRZL_MCP_ALLOWED_ORIGINS</code>. Non-browser MCP clients that
          omit the <code>Origin</code> header are allowed.
        </p>
      </DocSection>

    </DocsLayout>
  );
}
