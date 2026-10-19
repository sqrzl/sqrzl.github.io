import { DocsLayout } from '../../components/docs-layout';

export default function OciDocsPage() {
  return (
    <DocsLayout
      current="oci"
      title="Connect OCI Object Storage"
      description="Configure an OCI client to use Sqrzl's local Object Storage endpoint."
    >
      <section class="doc-section">
        <h2>Connection settings</h2>
        <dl class="settings-list">
          <div>
            <dt>Endpoint</dt>
            <dd>
              <code>http://localhost:9000</code>
            </dd>
          </div>
          <div>
            <dt>Namespace</dt>
            <dd>
              <code>sqrzl-emulator</code>
            </dd>
          </div>
          <div>
            <dt>Bucket path</dt>
            <dd>
              <code>/n/sqrzl-emulator/b/&lt;bucket&gt;/...</code>
            </dd>
          </div>
          <div>
            <dt>Signing</dt>
            <dd>
              OCI native RSA-SHA256 request signing when authentication is
              configured.
            </dd>
          </div>
        </dl>
      </section>

      <section class="doc-section">
        <h2>Configure OCI authentication</h2>
        <p>
          Set all four variables together: <code>OCI_TENANCY_OCID</code>,{' '}
          <code>OCI_USER_OCID</code>, <code>OCI_KEY_FINGERPRINT</code>, and{' '}
          <code>OCI_PUBLIC_KEY_PATH</code>. The public key path must be readable
          inside the emulator container.
        </p>
        <p>
          For local clients, set the endpoint to{' '}
          <code>http://localhost:9000</code> and use namespace{' '}
          <code>sqrzl-emulator</code>. Check the{' '}
          <a href="docs/compatibility/">compatibility matrix</a> for supported
          Object Storage calls.
        </p>
      </section>
    </DocsLayout>
  );
}
