import { GitHubLogo } from '@askrjs/logos';
import { Footer, FooterLink } from '@askrjs/themes/components';

export function SiteFooter() {
  return (
    <Footer className="site-footer">
      <div class="site-footer-inner page-container">
        <div class="site-footer-credit">
          <span>Sqrzl Emulator</span>
          <span aria-hidden="true">·</span>
          <FooterLink
            href="https://github.com/askrjs/askr"
            target="_blank"
            rel="noreferrer"
            aria-label="Askr on GitHub"
          >
            Built with Askr
          </FooterLink>
        </div>
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
    </Footer>
  );
}
