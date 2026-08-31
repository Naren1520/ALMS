'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { type HTMLMotionProps, motion, useReducedMotion } from 'framer-motion';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Shared, one-time viewport entrance used outside the homepage.
 * It deliberately only animates opacity and transform so it cannot shift layout.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    setCanAnimate(true);
  }, []);

  // Never server-render content in its hidden state. This keeps every page
  // usable if JavaScript is delayed, disabled, or blocked by a strict CSP.
  if (!canAnimate || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const motionProps: HTMLMotionProps<'div'> = {
    className,
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  };

  return <motion.div {...motionProps}>{children}</motion.div>;
}
