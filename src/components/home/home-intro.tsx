import { ArrowRightIcon } from '@askrjs/lucide';

import { ButtonLink } from '../ui/button-link';
import { Section } from '../ui/section';

export function HomeIntro() {
  return (
    <Section className="home-intro">
      <h1>Run your cloud services locally.</h1>
      <p class="home-lead">
        Sqrzl is a Docker-ready emulator for local development and CI. Point
        your existing clients at familiar endpoints, test the behavior you
        need, and keep the feedback loop on your machine.
      </p>
      <p class="home-actions">
        <ButtonLink href="docs/quick-start/">
          Start the emulator
          <ArrowRightIcon size={16} aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="docs/" variant="link">
          Read the documentation
        </ButtonLink>
      </p>
    </Section>
  );
}
