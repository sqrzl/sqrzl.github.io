import { GitHubLogo } from '@askrjs/logos';

export function SiteHeader() {
  return (
    <>
      <a class="skip-link" href="#content">
        Skip to content
      </a>
      <header class="site-header">
        <div class="site-header-inner">
          <a class="brand" href="./" aria-label="Sqrzl home">
            <span class="brand-name">Sqrzl</span>
            <span class="brand-description">Local service emulator</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="./">Home</a>
            <a href="docs/">Documentation</a>
            <a
              class="source-link"
              href="https://github.com/sqrzl/sqrzl-emulator"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubLogo size={16} aria-hidden="true" />
              GitHub
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
