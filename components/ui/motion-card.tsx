'use client';

import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion';
import { ReactNode } from 'react';

interface MotionCardProps {
  children: ReactNode;
  className?: string;
}

export function MotionCard({ children, className = '' }: MotionCardProps) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -4 }}
      transition={{ duration: motionTokens.duration.hover, ease: motionTokens.ease }}
    >
      {/* Gradient ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[oklch(0.70_0.08_183/0.4)] via-[oklch(0.60_0.06_185/0.3)] to-[oklch(0.60_0.06_185/0.2)] p-[1px]">
        <div className="h-full w-full rounded-2xl bg-[oklch(0.145_0_0)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
