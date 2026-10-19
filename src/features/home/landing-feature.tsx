import { CompatibilityNote } from '../../components/home/compatibility-note';
import { ComposeQuickStart } from '../../components/home/compose-quick-start';
import { HomeIntro } from '../../components/home/home-intro';
import { ServiceList } from '../../components/home/service-list';

export function LandingFeature() {
  return (
    <div class="home-page">
      <HomeIntro />
      <ServiceList />
      <ComposeQuickStart />
      <CompatibilityNote />
    </div>
  );
}
