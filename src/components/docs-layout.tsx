import { PageHeader } from '@askrjs/themes/page-header';

import { DocsSidebar } from './docs-sidebar';

type DocsLayoutProps = {
  current?: string;
  title: string;
  description: string;
  children?: unknown;
};

export function DocsLayout({
  current,
  title,
  description,
  children,
}: DocsLayoutProps) {
  return (
    <div class="docs-layout page-container">
      <DocsSidebar current={current} />
      <article class="docs-article">
        <PageHeader
          className="docs-page-header"
          title={title}
          description={description}
        />
        {children}
      </article>
    </div>
  );
}
