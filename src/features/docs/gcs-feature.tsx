import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function GcsDocsFeature() {
  return (
    <DocsLayout
      current="gcs"
      title="Connect Google Cloud Storage"
      description="Use the GCS JSON API endpoint and anonymous credentials for an open local instance."
    >
      <DocSection title="Connection settings">
        <dl class="settings-list">
          <div>
            <dt>JSON API endpoint</dt>
            <dd>
              <code>http://localhost:9000</code>
            </dd>
          </div>
          <div>
            <dt>Credentials</dt>
            <dd>Anonymous when Sqrzl authentication is disabled.</dd>
          </div>
        </dl>
        <p>
          The default Compose configuration enables authentication. To use this
          example, disable it as described in{' '}
          <a href="docs/configuration/">Configuration</a>.
        </p>
      </DocSection>

      <DocSection title="Python example">
        <pre>
          <code>
            {
              'from google.auth.credentials import AnonymousCredentials\nfrom google.cloud import storage\n\ngcs = storage.Client(\n    project="sqrzl",\n    credentials=AnonymousCredentials(),\n    client_options={"api_endpoint": "http://localhost:9000"},\n)\nbucket = gcs.bucket("example-bucket")\nbucket.create()\nbucket.blob("hello.txt").upload_from_string("hello")'
            }
          </code>
        </pre>
      </DocSection>

      <DocSection title="XML API">
        <p>
          Raw XML API requests use{' '}
          <code>http://localhost:9000/&lt;bucket&gt;/&lt;object&gt;</code> and
          send <code>Host: storage.googleapis.com</code>. For signed requests,
          configure the GCS HMAC access ID and secret.
        </p>
        <p>
          See the <a href="docs/compatibility/">compatibility matrix</a> for the
          supported JSON and XML operations.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
