import { DocSection } from '../../components/doc-section';
import { DocsLayout } from '../../components/docs-layout';

export default function CompatibilityDocsFeature() {
  return (
    <DocsLayout
      current="compatibility"
      title="Compatibility"
      description="Sqrzl implements provider protocols within a published scope. Check that scope before relying on an operation."
    >
      <DocSection title="Read the matrix">
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
      </DocSection>

      <DocSection title="What to expect">
        <p>
          Sqrzl follows each provider's HTTP or SMTP contract for the supported
          surface. An unsupported request variant is rejected instead of being
          silently treated as a different operation.
        </p>
        <p>
          Sqrzl is intended for development and CI. A passing local request does
          not certify production capacity or full parity with a cloud service.
        </p>
      </DocSection>
    </DocsLayout>
  );
}
