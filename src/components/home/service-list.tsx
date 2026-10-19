import { Section } from '../ui/section';

const services = [
  {
    title: 'Object and blob storage',
    description:
      'S3, Azure Blob Storage, Google Cloud Storage, and OCI Object Storage.',
  },
  {
    title: 'Email',
    description:
      'Local SMTP capture, plus scoped SendGrid, Amazon SES, and Azure Communication Services APIs.',
  },
  {
    title: 'SMS and messaging',
    description:
      'Local adapters for Twilio, Amazon SNS, AWS SMS Voice, and Azure Communication Services.',
  },
];

export function ServiceList() {
  return (
    <Section className="home-section" ariaLabelledBy="services-heading">
      <h2 id="services-heading">What it emulates</h2>
      <div class="service-list">
        {services.map((service) => (
          <div key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
