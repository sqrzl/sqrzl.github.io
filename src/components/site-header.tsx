import { currentRoute } from '@askrjs/askr/router';
import { GitHubLogo } from '@askrjs/logos';
import { BookOpenIcon } from '@askrjs/lucide';
import { Header, NavBrand, NavGroup, Navbar } from '@askrjs/themes/components';
import { Image, image } from '@askrjs/vite/image';

const sqrzlLogo = image(new URL('../assets/sqrzl-logo.png', import.meta.url), {
  widths: [32, 64, 128],
  quality: { avif: 70, webp: 85 },
});

export function SiteHeader() {
  const path = currentRoute().path;
  const skipTarget = `${path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`}#content`;

  return (
    <>
      <a class="skip-link" href={skipTarget}>
        Skip to content
      </a>
      <Header className="site-header">
        <Navbar
          className="site-header-inner page-container"
          aria-label="Main navigation"
        >
          <NavBrand>
            <a class="brand" href="/" aria-label="Sqrzl home">
              <Image image={sqrzlLogo} class="brand-logo" sizes="32px" alt="" />
              <span class="brand-name">Sqrzl</span>
              <span class="brand-description">Local service emulator</span>
            </a>
          </NavBrand>
          <NavGroup align="end">
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
          </NavGroup>
        </Navbar>
      </Header>
    </>
  );
}
