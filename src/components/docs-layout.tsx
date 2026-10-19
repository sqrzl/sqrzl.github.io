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
        <header class="docs-page-header">
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
      </article>
    </div>
  );
}
