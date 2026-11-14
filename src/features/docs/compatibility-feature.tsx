import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function CompatibilityDocsFeature() {
  return (
    <DocsLayout
      current="compatibility"
      title="Compatibility"
      description="Use the published operation boundaries and exact-source evidence for the behavior your app needs."
    >
      <DocSection title="Supported scope">
        <p>
          Broad provider families remain partial. Unsupported operations and
          variants are rejected explicitly; deferred services have no current
          support contract. Sqrzl is intended for development and CI, with local
          capture and simulated delivery. It does not provide cloud IAM, real
          email or SMS delivery, Google OAuth issuance or validation, or actual
          cloud KMS encryption.
        </p>
        <p>
          The{' '}
          <a href="https://github.com/sqrzl/sqrzl-emulator/blob/main/compatibility-matrix.json">
            compatibility matrix
          </a>{' '}
          is the detailed reference for each method, path, selector and
          boundary. A passing request does not establish full provider parity.
        </p>
      </DocSection>
      <DocSection title="Versioned certified subset">
        <p>
          The <code>local-core-v1</code> profile defines nine selected scopes:
          six plaintext SMTP command contracts (session, envelope, DATA, RSET,
          NOOP and QUIT), and current-object HEAD metadata for S3 API{' '}
          <code>2006-03-01</code>, Azure API <code>2024-11-04</code> and OCI API{' '}
          <code>20160918</code>.
        </p>
        <p>
          The HEAD contracts cover selected metadata and ETag conditions, native
          errors and credential rejection, restart and interruption recovery,
          and metadata-only reads of a 1 GiB sparse object. Other headers, API
          versions, historical resources and PAR access remain outside this
          certificate. Plaintext SMTP does not qualify AUTH or STARTTLS.
        </p>
        <p>
          Certification requires matching receipts for the exact source and
          binary, pinned SDK versions and explicit per-operation assertions.
          Missing or skipped tests, anonymous native-auth claims and remote
          smoke endpoints do not qualify. A matrix profile link names an
          eligible scope; the acceptance artifact establishes its result.
        </p>
        <p>
          Read the{' '}
          <a href="https://github.com/sqrzl/sqrzl-emulator/blob/main/operation-certification.json">
            versioned acceptance policy
          </a>{' '}
          and{' '}
          <a href="https://github.com/sqrzl/sqrzl-emulator/blob/main/docs/support-certification.md">
            qualification guide
          </a>
          . Everything outside the selected scopes retains its partial,
          unsupported or deferred status.
        </p>
      </DocSection>
      <DocSection title="Resource qualification">
        <p>
          Separate measured campaigns exercise selected 1 GiB S3 multipart,
          Azure block, GCS resumable and OCI multipart workflows with readback,
          restart and resource observations. These are selected workflows, not
          unrestricted object-size or throughput guarantees. GCS JSON uses
          anonymous or local-bearer convenience authentication, not Google
          OAuth.
        </p>
        <p>
          Read{' '}
          <a href="https://github.com/sqrzl/sqrzl-emulator/blob/main/docs/large-upload-qualification.md">
            large-upload qualification
          </a>{' '}
          and <a href="docs/runtime/">runtime limits</a> before changing request
          sizes or concurrency. Sampled resource measurements do not establish
          hard OS memory bounds or power-loss survival.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
