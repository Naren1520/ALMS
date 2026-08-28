'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const STATS = [
  { value: 12400, label: 'Verified Buyers', suffix: '+' },
  { value: 850, label: 'Crore in B2B Orders', prefix: '₹', suffix: 'Cr+' },
  { value: 340, label: 'Districts Covered', suffix: '+' },
];

/** Section 6 — Counter animation (Req 27.3) */
export default function B2BSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        STATS.forEach((stat, i) => {
          const el = countersRef.current[i];
          if (!el) return;
          gsap.from({ val: 0 }, {
            val: stat.value,
            duration: 2,
            ease: 'power2.out',
            snap: { val: 1 },
            onUpdate: function (this: { val: number }) {
              if (el) el.textContent = Math.floor(this.val).toLocaleString('en-IN');
            },
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          });
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ background: 'var(--color-bg-primary)' }}
      aria-labelledby="b2b-heading"
    >
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-accent font-ui">B2B Commerce</p>
            <h2 id="b2b-heading" className="font-display text-4xl md:text-5xl font-light leading-tight">
              Bulk orders. Fair prices. Zero friction.
            </h2>
            <p className="text-brand-muted font-ui leading-relaxed text-lg">
              Verified buyers submit RFQs. Our AI matches them with the right artisans in minutes.
              Wholesale pricing, production scheduling, and delivery estimation — automated.
            </p>
            <Link
              href="/register?role=BUYER"
              className="inline-flex px-6 py-3 rounded-lg text-white font-ui font-medium hover:opacity-90 transition"
              style={{ background: 'var(--color-accent)' }}
            >
              Register as a Buyer
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl flex items-center gap-6"
                style={{ background: 'var(--color-surface)' }}
              >
                <div className="text-4xl font-display font-medium" style={{ color: 'var(--color-accent)' }}>
                  {stat.prefix}
                  <span ref={(el) => { countersRef.current[i] = el; }}>0</span>
                  {stat.suffix}
                </div>
                <div className="font-ui text-brand-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
