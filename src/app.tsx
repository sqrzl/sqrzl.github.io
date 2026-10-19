import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';

export default function App({ children }: { children?: unknown }) {
  return (
    <div class="site-shell">
      <SiteHeader />

      <main id="content" class="main-content">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
