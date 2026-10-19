import { Main } from '@askrjs/themes/components';

import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';

export default function App({ children }: { children?: unknown }) {
  return (
    <div class="site-shell">
      <SiteHeader />

      <Main id="content" className="main-content">
        {children}
      </Main>

      <SiteFooter />
    </div>
  );
}
