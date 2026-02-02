import { useReducedMotion } from 'motion/react';

export const motionTokens = {
  duration: {
    micro: 0.16,
    hover: 0.24,
    enter: 0.36,
    special: 0.5,
  },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const fadeInUp = {
  initial: { opacity: 0, y: 12, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: motionTokens.duration.enter, ease: motionTokens.ease },
};

export const heroStagger = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: motionTokens.duration.enter, ease: motionTokens.ease },
  },
};

export function useMotion() {
  const shouldReduce = useReducedMotion();
  return {
    shouldReduce,
    variants: shouldReduce ? {} : fadeInUp,
  };
}
