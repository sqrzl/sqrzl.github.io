import { For } from '@askrjs/askr/control';

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
    title: 'Email and SMS',
    pages: [
      {
        key: 'email',
        label: 'Email',
        href: 'docs/email/',
      },
      {
        key: 'sms',
        label: 'SMS and MMS',
        href: 'docs/sms/',
      },
      {
        key: 'compatibility',
        label: 'Compatibility',
        href: 'docs/compatibility/',
      },
    ],
  },
];

function DocsNavigation({ current }: { current?: string }) {
  return (
    <>
      <a class="docs-home-link" href="docs/">
        All documentation
      </a>
      <For each={sections} by={(section) => section.title}>
        {(section) => (
          <Section className="docs-nav-section">
            <h2>{section.title}</h2>
            <ul>
              <For each={section.pages} by={(page) => page.key}>
                {(page) => (
                  <li>
                    <a
                      href={page.href}
                      aria-current={current === page.key ? 'page' : undefined}
                    >
                      {page.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </Section>
        )}
      </For>
    </>
  );
}

export function DocsSidebar({ current }: { current?: string }) {
  return (
    <aside class="docs-sidebar" aria-label="Documentation">
      <nav class="docs-desktop-navigation" aria-label="Documentation pages">
        <DocsNavigation current={current} />
      </nav>
      <details class="docs-mobile-navigation">
        <summary>Browse documentation</summary>
        <nav
          class="docs-mobile-navigation-links"
          aria-label="Documentation pages"
        >
          <DocsNavigation current={current} />
        </nav>
      </details>
    </aside>
  );
}
