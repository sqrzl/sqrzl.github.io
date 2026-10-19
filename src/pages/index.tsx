import { ArrowRightIcon } from '@askrjs/lucide';

export default function HomePage() {
  return (
    <div class="home-page">
      <section class="home-intro">
        <h1>Run your cloud services locally.</h1>
        <p class="home-lead">
          Sqrzl is a Docker-ready emulator for local development and CI. Point
          your existing clients at familiar endpoints, test the behavior you
          need, and keep the feedback loop on your machine.
        </p>
        <p class="home-actions">
          <a class="button button-primary" href="docs/quick-start/">
            Start the emulator
            <ArrowRightIcon size={16} aria-hidden="true" />
          </a>
          <a class="button button-link" href="docs/">
            Read the documentation
          </a>
        </p>
      </section>

      <section class="home-section" aria-labelledby="services-heading">
        <h2 id="services-heading">What it emulates</h2>
        <div class="service-list">
          <div>
            <h3>Object and blob storage</h3>
            <p>
              S3, Azure Blob Storage, Google Cloud Storage, and OCI Object
              Storage.
            </p>
          </div>
          <div>
            <h3>Email</h3>
            <p>
              Local SMTP capture, plus scoped SendGrid, Amazon SES, and Azure
              Communication Services APIs.
            </p>
          </div>
          <div>
            <h3>SMS and messaging</h3>
            <p>
              Local adapters for Twilio, Amazon SNS, AWS SMS Voice, and Azure
              Communication Services.
            </p>
          </div>
        </div>
      </section>

      <section
        class="home-section start-section"
        aria-labelledby="start-heading"
      >
        <div>
          <h2 id="start-heading">Start with Docker Compose</h2>
          <p>Clone the emulator and start it from its repository:</p>
        </div>
        <pre>
          <code>
            {
              'git clone https://github.com/sqrzl/sqrzl-emulator.git\ncd sqrzl-emulator\ndocker compose up --build'
            }
          </code>
        </pre>
        <p>
          Storage APIs are at <code>localhost:9000</code>; the admin UI is at{' '}
          <code>localhost:9001</code>. The Compose setup enables authentication;
          the quickstart lists its local credentials and health checks.
        </p>
      </section>

      <section class="home-note" aria-label="Project status">
        <p>
          Sqrzl is a development emulator, not a production service.
          Compatibility is scoped by provider; check the{' '}
          <a href="docs/compatibility/">compatibility notes</a> for the
          operations your app depends on.
        </p>
      </section>
    </div>
  );
}
