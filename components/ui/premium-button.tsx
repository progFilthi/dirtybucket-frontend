import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface PremiumButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const baseClass = 
      variant === 'primary' 
        ? 'premium-button' 
        : variant === 'secondary'
        ? 'premium-button-secondary'
        : 'premium-button-ghost';
    
    return (
      <motion.button
        ref={ref}
        className={cn(baseClass, 'inline-flex items-center justify-center gap-2', className)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';
