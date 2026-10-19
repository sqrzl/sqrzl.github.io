import { DocsLayout } from '../../components/docs-layout';
import { GuideList } from '../../components/guide-list';

const guides = [
  {
    href: 'docs/quick-start/',
    title: 'Quickstart',
    description: 'Start Sqrzl with Docker Compose and check that it is ready.',
  },
  {
    href: 'docs/s3/',
    title: 'Connect an S3 client',
    description: 'Use the S3 endpoint, credentials, and a boto3 example.',
  },
  {
    href: 'docs/azure-blob/',
    title: 'Connect Azure Blob Storage',
    description: 'Configure the account URL and connect with the Azure SDK.',
  },
  {
    href: 'docs/gcs/',
    title: 'Connect Google Cloud Storage',
    description: 'Use the JSON API endpoint with anonymous local credentials.',
  },
  {
    href: 'docs/oci/',
    title: 'Connect OCI Object Storage',
    description:
      'Set the endpoint, namespace, and optional request-signing identity.',
  },
  {
    href: 'docs/configuration/',
    title: 'Configuration',
    description: 'Set authentication, ports, storage path, and request limits.',
  },
  {
    href: 'docs/persistence/',
    title: 'Data and reset',
    description:
      'Keep emulator data between runs or remove a disposable volume.',
  },
  {
    href: 'docs/email-and-messaging/',
    title: 'Email and messaging',
    description: 'Find the local SMTP, email API, and SMS adapter endpoints.',
  },
  {
    href: 'docs/compatibility/',
    title: 'Compatibility',
    description:
      'Check the supported operation matrix before relying on a provider feature.',
  },
];

export default function DocsIndexFeature() {
  return (
    <DocsLayout
      title="Sqrzl documentation"
      description="Start the emulator, connect a client, and configure the parts you need."
    >
      <GuideList guides={guides} />
    </DocsLayout>
  );
}
