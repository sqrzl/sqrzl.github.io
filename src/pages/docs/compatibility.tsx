import { DocsLayout } from '../../components/docs-layout';

export default function CompatibilityDocsPage() {
  return (
    <DocsLayout
      current="compatibility"
      title="Compatibility"
      description="Sqrzl implements provider protocols within a published scope. Check that scope before relying on an operation."
    >
      <section class="doc-section">
        <h2>Read the matrix</h2>
        <p>
          The matrix lists supported services, operations, request variants, and
          known limits for each provider. It is the detailed reference for what
          Sqrzl currently accepts.
        </p>
        <p>
          <a
            class="text-link"
            href="https://github.com/sqrzl/sqrzl-emulator/blob/main/compatibility-matrix.json"
            target="_blank"
            rel="noreferrer"
          >
            Open the compatibility matrix on GitHub
          </a>
        </p>
      </section>

      <section class="doc-section">
        <h2>What to expect</h2>
        <p>
          Sqrzl follows each provider's HTTP or SMTP contract for the supported
          surface. An unsupported request variant is rejected instead of being
          silently treated as a different operation.
        </p>
        <p>
          Sqrzl is intended for development and CI. A passing local request does
          not certify production capacity or full parity with a cloud service.
        </p>
      </section>
    </DocsLayout>
  );
}
