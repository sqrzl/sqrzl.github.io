import { Section } from '../ui/section';

export function CompatibilityNote() {
  return (
    <Section className="home-note" ariaLabel="Project status">
      <p>
        Sqrzl is a development emulator, not a production service. Compatibility
        is scoped by provider; check the{' '}
        <a href="docs/compatibility/">compatibility notes</a> for the
        operations your app depends on.
      </p>
    </Section>
  );
}
