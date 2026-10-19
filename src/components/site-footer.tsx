import { GitHubLogo } from '@askrjs/logos';

export function SiteFooter() {
  return (
    <footer class="site-footer">
      <div class="site-footer-inner page-container">
        <span>Sqrzl Emulator</span>
        <a
          class="icon-link"
          href="https://github.com/sqrzl/sqrzl-emulator"
          target="_blank"
          rel="noreferrer"
          aria-label="Sqrzl source code and releases on GitHub"
        >
          <GitHubLogo size={18} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
