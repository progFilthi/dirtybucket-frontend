import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

export function ButtonLink({
  href,
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
