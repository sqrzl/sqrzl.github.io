import { ButtonLink } from './ui/button-link';
import { Section } from './ui/section';

export function NotFoundContent() {
  return (
    <Section className="not-found-page">
      <h1>Page not found</h1>
      <p>
        The address may have changed. Return home or open the documentation
        index.
      </p>
      <p class="home-actions">
        <ButtonLink href="./">Home</ButtonLink>
        <ButtonLink href="docs/" variant="link">
          Documentation
        </ButtonLink>
      </p>
    </Section>
  );
}
