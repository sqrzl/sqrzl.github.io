import { DocsLayout } from '../../components/docs-layout';

export default function AzureBlobDocsPage() {
  return (
    <DocsLayout
      current="azure-blob"
      title="Connect Azure Blob Storage"
      description="Use the local account URL with an Azure Blob Storage SDK."
    >
      <section class="doc-section">
        <h2>Connection settings</h2>
        <dl class="settings-list">
          <div>
            <dt>Account URL</dt>
            <dd>
              <code>http://localhost:9000/devstoreaccount1</code>
            </dd>
          </div>
          <div>
            <dt>Container</dt>
            <dd>Use a valid Azure container name.</dd>
          </div>
          <div>
            <dt>Authentication</dt>
            <dd>
              Shared Key or SAS when configured; anonymous access when auth is
              disabled.
            </dd>
          </div>
        </dl>
        <p>
          The default Compose credentials enable authentication. This anonymous
          example expects an open local instance. See{' '}
          <a href="docs/configuration/">Configuration</a> to turn off
          authentication or set provider credentials.
        </p>
      </section>

      <section class="doc-section">
        <h2>Python example</h2>
        <pre>
          <code>
            {
              'from azure.storage.blob import BlobServiceClient\n\nservice = BlobServiceClient(\n    account_url="http://localhost:9000/devstoreaccount1",\n    credential=None,\n)\ncontainer = service.create_container("example-container")\ncontainer.upload_blob("hello.txt", b"hello")'
            }
          </code>
        </pre>
      </section>

      <section class="doc-section">
        <h2>Account credentials</h2>
        <p>
          Set <code>AZURE_ACCOUNT</code> and <code>AZURE_ACCOUNT_KEY</code>{' '}
          together to use Azure-specific credentials. If they are unset, Sqrzl
          can use the generic <code>SQRZL_ACCESS_KEY_ID</code> and{' '}
          <code>SQRZL_SECRET_ACCESS_KEY</code> values.
        </p>
        <p>
          Supported operations and limits are listed in the{' '}
          <a href="docs/compatibility/">compatibility matrix</a>.
        </p>
      </section>
    </DocsLayout>
  );
}
