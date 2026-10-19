import { GitHubLogo } from '@askrjs/logos';
import { BookOpenIcon } from '@askrjs/lucide';
import { Image, image } from '@askrjs/vite/image';

const sqrzlLogo = image(new URL('../assets/sqrzl-logo.png', import.meta.url), {
  widths: [32, 64, 128],
  quality: { avif: 70, webp: 85 },
});

export function SiteHeader() {
  return (
    <>
      <a class="skip-link" href="#content">
        Skip to content
      </a>
      <header class="site-header">
        <div class="site-header-inner page-container">
          <a class="brand" href="/" aria-label="Sqrzl home">
            <Image
              image={sqrzlLogo}
              class="brand-logo"
              sizes="32px"
              alt=""
            />
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
