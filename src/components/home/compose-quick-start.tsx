import { CodeBlock } from '../ui/code-block';
import { Section } from '../ui/section';

export function ComposeQuickStart() {
  return (
    <Section
      className="home-section start-section"
      ariaLabelledBy="start-heading"
    >
      <div>
        <h2 id="start-heading">Start the emulator</h2>
        <p>Build from source with Docker Compose:</p>
      </div>
      <CodeBlock
        code={
          'git clone https://github.com/sqrzl/sqrzl-emulator.git\ncd sqrzl-emulator\ndocker compose up --build'
        }
      />
      <p>Or pull the latest published container image from GHCR:</p>
      <CodeBlock code="docker pull ghcr.io/sqrzl/sqrzl-emulator:latest" />
      <p>
        Storage APIs are at <code>localhost:9000</code>; the admin UI is at{' '}
        <code>localhost:9001</code>. The Compose setup enables authentication;
        the quickstart lists its local credentials and health checks.
      </p>
    </Section>
  );
}
