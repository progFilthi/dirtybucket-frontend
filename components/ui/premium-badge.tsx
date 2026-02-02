import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'accent' | 'neutral';
}

export function Badge({ children, variant = 'accent', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        variant === 'accent' ? 'accent-badge' : 'neutral-badge',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
