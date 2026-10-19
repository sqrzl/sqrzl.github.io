import { Section as ThemeSection } from '@askrjs/themes/section';

type SectionProps = {
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children?: unknown;
};

export function Section({
  className,
  ariaLabel,
  ariaLabelledBy,
  children,
}: SectionProps) {
  return (
    <ThemeSection
      className={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      gap="0"
      paddingY="0"
    >
      {children}
    </ThemeSection>
  );
}
