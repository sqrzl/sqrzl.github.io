import { CodeBlock } from '../ui/code-block';
import { Section } from '../ui/section';

export function ComposeQuickStart() {
  return (
    <Section
      className="home-section start-section"
      ariaLabelledBy="start-heading"
    >
      <div>
        <h2 id="start-heading">Start with Docker Compose</h2>
        <p>Clone the emulator and start it from its repository:</p>
      </div>
      <CodeBlock
        code={
          'git clone https://github.com/sqrzl/sqrzl-emulator.git\ncd sqrzl-emulator\ndocker compose up --build'
        }
      />
      <p>
        Storage APIs are at <code>localhost:9000</code>; the admin UI is at{' '}
        <code>localhost:9001</code>. The Compose setup enables authentication;
        the quickstart lists its local credentials and health checks.
      </p>
    </Section>
  );
}
