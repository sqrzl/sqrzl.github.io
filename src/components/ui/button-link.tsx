type ButtonLinkProps = {
  href: string;
  variant?: 'primary' | 'link';
  children?: unknown;
};

export function ButtonLink({
  href,
  variant = 'primary',
  children,
}: ButtonLinkProps) {
  return (
    <a class={`button button-${variant}`} href={href}>
      {children}
    </a>
  );
}
