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

      <DocSection title="Authentication and gzip boundaries">
        <p>
          Authenticated JSON workflows can use the configured local secret as a
          bearer convenience token. This is not Google OAuth. A configured HMAC
          access identifier alone is not a bearer authority.
        </p>
        <p>
          Selected native GCS authentication coverage uses XML V2 HMAC signed
          URLs, separately from the JSON convenience lane. Native V4 HMAC
          qualification is outside that gate. Cloud IAM and OAuth issuance or
          validation are outside the emulator model.
        </p>
        <p>
          The official Google .NET client also has a regression for its default
          gzip behavior: Google.Cloud.Storage.V1 5.0.0 on .NET SDK 11.0.100. It
          exercises bucket metadata, resumable upload, byte readback and native
          missing-object parsing. See the{' '}
          <a href="https://github.com/sqrzl/sqrzl-emulator/tree/main/sdk-tests/dotnet/Gcs">
            runnable .NET example
          </a>{' '}
          and the <a href="docs/compatibility/">qualification boundary</a>.
        </p>
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
