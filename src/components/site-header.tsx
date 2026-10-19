import { GitHubLogo } from '@askrjs/logos';
import { BookOpenIcon } from '@askrjs/lucide';

export function SiteHeader() {
  return (
    <>
      <a class="skip-link" href="#content">
        Skip to content
      </a>
      <header class="site-header">
        <div class="site-header-inner page-container">
          <a class="brand" href="/" aria-label="Sqrzl home">
            <img class="brand-logo" src="/assets/sqrzl.png" alt="" />
            <span class="brand-name">Sqrzl</span>
            <span class="brand-description">Local service emulator</span>
          </a>
          <nav aria-label="Main navigation">
            <a class="icon-link" href="/docs/" aria-label="Documentation">
              <BookOpenIcon size={18} aria-hidden="true" />
            </a>
            <a
              class="icon-link"
              href="https://github.com/sqrzl/sqrzl-emulator"
              target="_blank"
              rel="noreferrer"
              aria-label="Sqrzl on GitHub"
            >
              <GitHubLogo size={18} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
