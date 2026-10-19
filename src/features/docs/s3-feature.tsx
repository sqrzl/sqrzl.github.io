import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function S3DocsFeature() {
  return (
    <DocsLayout
      current="s3"
      title="Connect an S3 client"
      description="Point an S3-compatible SDK at Sqrzl's local API endpoint."
    >
      <DocSection title="Connection settings">
        <dl class="settings-list">
          <div>
            <dt>Endpoint</dt>
            <dd>
              <code>http://localhost:9000</code>
            </dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>
              <code>us-east-1</code>
            </dd>
          </div>
          <div>
            <dt>Signature</dt>
            <dd>AWS Signature Version 4</dd>
          </div>
          <div>
            <dt>Addressing</dt>
            <dd>Path style</dd>
          </div>
        </dl>
        <p>
          With the default Compose authentication, use <code>admin</code> and{' '}
          <code>sqrzl-secret</code> as the access key and secret. If
          authentication is disabled, SDK placeholder credentials are accepted.
        </p>
      </DocSection>

      <DocSection title="Python example">
        <p>Install boto3, then create a bucket and write an object:</p>
        <pre>
          <code>
            {
              'import boto3\nfrom botocore.config import Config\n\ns3 = boto3.client(\n    "s3",\n    endpoint_url="http://localhost:9000",\n    aws_access_key_id="admin",\n    aws_secret_access_key="sqrzl-secret",\n    region_name="us-east-1",\n    config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),\n)\n\ns3.create_bucket(Bucket="example-bucket")\ns3.put_object(Bucket="example-bucket", Key="hello.txt", Body=b"hello")'
            }
          </code>
        </pre>
      </DocSection>

      <DocSection title="Large uploads">
        <p>
          Sqrzl supports S3 multipart upload within the documented compatibility
          limits. The default request body limit is 128 MiB per request, so use
          parts below that size or raise <code>SQRZL_MAX_REQUEST_BYTES</code>.
        </p>
        <p>
          Check the <a href="docs/compatibility/">compatibility matrix</a> for
          supported S3 operations.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
