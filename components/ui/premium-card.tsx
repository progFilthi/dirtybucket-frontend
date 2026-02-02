import { motion, HTMLMotionProps, useMotionValue, useMotionTemplate } from 'motion/react';
import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';

interface PremiumCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, children, hover = true, glow = false, ...props }, ref) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!glow) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    };

    const glowStyle = useMotionTemplate`${mouseX}px ${mouseY}px`;

    return (
      <motion.div
        ref={ref}
        className={cn(
          'premium-card',
          glow && 'premium-card-glow',
          className
        )}
        style={
          glow
            ? {
                // @ts-ignore - CSS custom properties
                '--mouse-x': `${(mousePosition.x / 300) * 100}%`,
                '--mouse-y': `${(mousePosition.y / 300) * 100}%`,
              }
            : undefined
        }
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div className="premium-card-inner">{children}</div>
      </motion.div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';
