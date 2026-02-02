'use client';

import { motion } from 'motion/react';
import { fadeInUp } from '@/lib/motion';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <motion.section {...fadeInUp} className={className}>
      {children}
    </motion.section>
  );
}
