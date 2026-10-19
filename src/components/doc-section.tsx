import { Section } from './ui/section';

type DocSectionProps = {
  title: string;
  children?: unknown;
};

export function DocSection({ title, children }: DocSectionProps) {
  return (
    <Section className="doc-section">
      <h2>{title}</h2>
      {children}
    </Section>
  );
}
