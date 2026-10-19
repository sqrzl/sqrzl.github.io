import { Section } from './ui/section';

const sections = [
  {
    title: 'Getting started',
    pages: [
      { key: 'quick-start', label: 'Quickstart', href: 'docs/quick-start/' },
    ],
  },
  {
    title: 'Storage APIs',
    pages: [
      { key: 's3', label: 'Amazon S3', href: 'docs/s3/' },
      {
        key: 'azure-blob',
        label: 'Azure Blob Storage',
        href: 'docs/azure-blob/',
      },
      { key: 'gcs', label: 'Google Cloud Storage', href: 'docs/gcs/' },
      { key: 'oci', label: 'OCI Object Storage', href: 'docs/oci/' },
    ],
  },
  {
    title: 'Running Sqrzl',
    pages: [
      {
        key: 'configuration',
        label: 'Configuration',
        href: 'docs/configuration/',
      },
      { key: 'persistence', label: 'Data and reset', href: 'docs/persistence/' },
    ],
  },
  {
    title: 'Other services',
    pages: [
      {
        key: 'email-and-messaging',
        label: 'Email and messaging',
        href: 'docs/email-and-messaging/',
      },
      {
        key: 'compatibility',
        label: 'Compatibility',
        href: 'docs/compatibility/',
      },
    ],
  },
];

export function DocsSidebar({ current }: { current?: string }) {
  return (
    <aside class="docs-sidebar" aria-label="Documentation">
      <a class="docs-home-link" href="docs/">
        All documentation
      </a>
      {sections.map((section) => (
        <Section className="docs-nav-section" key={section.title}>
          <h2>{section.title}</h2>
          <ul>
            {section.pages.map((page) => (
              <li key={page.key}>
                <a
                  href={page.href}
                  aria-current={current === page.key ? 'page' : undefined}
                >
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </aside>
  );
}
