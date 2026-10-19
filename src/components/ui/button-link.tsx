import { Button } from '@askrjs/themes/button';

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
    <Button asChild variant={variant}>
      <a class="home-button" href={href}>
        {children}
      </a>
    </Button>
  );
}
