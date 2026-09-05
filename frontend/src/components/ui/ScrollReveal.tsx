'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    setCanAnimate(true);
  }, []);

  if (!canAnimate || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <motion.div
      {...({ className } as any)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
