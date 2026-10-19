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
    <section
      class={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </section>
  );
}
