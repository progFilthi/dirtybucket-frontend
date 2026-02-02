'use client';

import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion';
import { ReactNode } from 'react';

interface MotionButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

export function MotionButton({ children, variant = 'primary', className = '', onClick }: MotionButtonProps) {
  if (variant === 'primary') {
    return (
      <motion.button
        className={`relative overflow-hidden px-8 py-3 rounded-xl bg-[oklch(0.75_0.15_195)] text-black font-medium ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: motionTokens.duration.hover, ease: motionTokens.ease }}
        onClick={onClick}
      >
        {/* Sheen wipe */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%', skewX: -20 }}
          whileHover={{ x: '200%' }}
          transition={{ duration: motionTokens.duration.enter, ease: motionTokens.ease }}
        />
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      className={`relative px-8 py-3 rounded-xl overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: motionTokens.duration.hover, ease: motionTokens.ease }}
      onClick={onClick}
    >
      {/* Gradient ring */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[oklch(0.70_0.08_183/0.6)] via-[oklch(0.60_0.06_185/0.4)] to-[oklch(0.60_0.06_185/0.3)] p-[1px]">
        <div className="h-full w-full rounded-xl bg-transparent backdrop-blur-sm flex items-center justify-center">
          <span className="text-white font-medium">{children}</span>
        </div>
      </div>
    </motion.button>
  );
}
