import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function ConfigurationDocsFeature() {
  return (
    <DocsLayout
      current="configuration"
      title="Configuration"
      description="Set the few runtime options most local setups need in Compose."
    >
      <DocSection title="Authentication">
        <p>
          The checked-in Compose setup enables provider and admin authentication
          with <code>admin</code> and <code>sqrzl-secret</code>. Change these
          values before sharing a local environment.
        </p>
        <p>
          For an open development instance, remove{' '}
          <code>SQRZL_ACCESS_KEY_ID</code> and{' '}
          <code>SQRZL_SECRET_ACCESS_KEY</code> from the service environment.
          Authentication is enabled only when both are set. Provider-specific
          settings can override the generic credentials.
        </p>
        <p>
          Set <code>SQRZL_ADMIN_AUTH_DISABLED=true</code> to leave the UI and
          admin API open while keeping provider API authentication enabled.
        </p>
        <p>
          MCP uses the same listener but has its own OAuth bearer-token flow
          when protected. See <a href="docs/mcp/">MCP configuration</a> before
          connecting an MCP client to an authenticated instance.
        </p>
      </DocSection>

      <DocSection title="Common settings">
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>SQRZL_BLOBS_PATH</code>
              </td>
              <td>
                Storage root. Use <code>/app/blobs</code> with the Compose
                volume.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_MAX_REQUEST_BYTES</code>
              </td>
              <td>
                Maximum size for one HTTP request body or SMTP DATA payload;
                default is 128 MiB.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_BUCKET_LIST</code>
              </td>
              <td>Comma-separated buckets created at startup.</td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_LOG_FORMAT</code>
              </td>
              <td>
                <code>text</code> or <code>json</code>; default is{' '}
                <code>text</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_API_PORT</code>
              </td>
              <td>
                Storage API listener; default is <code>9000</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_UI_PORT</code>
              </td>
              <td>
                Admin UI listener; default is <code>9001</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>SQRZL_SMTP_PORT</code>
              </td>
              <td>
                SMTP capture listener; default is <code>2525</code>.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Docker port mappings are written <code>HOST:CONTAINER</code>. To use
          host port <code>19000</code> for the API, map <code>19000:9000</code>{' '}
          and keep the container port unchanged.
        </p>
      </DocSection>

      <DocSection title="Provider credentials">
        <ul>
          <li>
            Azure overrides: <code>AZURE_ACCOUNT</code> and{' '}
            <code>AZURE_ACCOUNT_KEY</code>.
          </li>
          <li>
            GCS HMAC: <code>GCS_HMAC_ACCESS_ID</code> and{' '}
            <code>GCS_HMAC_SECRET</code>.
          </li>
          <li>
            OCI signing: set all four <code>OCI_*</code> identity and public-key
            variables.
          </li>
        </ul>
        <p>
          Provider credential pairs must be configured together. See{' '}
          <a href="docs/s3/">S3</a>, <a href="docs/azure-blob/">Azure</a>,{' '}
          <a href="docs/gcs/">GCS</a>, or <a href="docs/oci/">OCI</a> for client
          setup.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
