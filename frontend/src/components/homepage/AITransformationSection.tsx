'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FEATURES = [
  {
    n: '01',
    title: 'Smart Photography',
    desc: 'Background removal, lighting correction, and professional framing — automatically.',
  },
  {
    n: '02',
    title: 'AI Catalog Writing',
    desc: 'Voice your product description in any Indian language. We translate, structure, and optimize.',
  },
  {
    n: '03',
    title: 'Smart Pricing',
    desc: 'Real-time market analysis ensures fair pricing for artisans and competitive rates for buyers.',
  },
  {
    n: '04',
    title: 'Global Discovery',
    desc: 'Semantic search connects your craft with the right international buyers automatically.',
  },
];

export default function AITransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(imgRef.current, {
          opacity: 0, x: 40, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
        if (listRef.current) {
          gsap.from(Array.from(listRef.current.children), {
            opacity: 0, x: -32, stagger: 0.12, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 75%' },
          });
        }
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 overflow-hidden"
      aria-labelledby="ai-heading"
      style={{ background: '#1A1A1A', color: '#FDFBF7' }}
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Text */}
        <div>
          <p className="overline text-gold mb-4">AI-Powered Tools</p>
          <div className="w-10 h-px bg-gold mb-8" />
          <h2
            id="ai-heading"
            className="font-serif text-ivory mb-6"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300, lineHeight: 1.1 }}
          >
            From phone photo to<br />
            <em className="text-gold-light" style={{ fontStyle: 'italic' }}>
              professional listing.
            </em>
          </h2>
          <p className="leading-relaxed mb-12" style={{ color: 'var(--stone-light)', fontSize: '1.0625rem' }}>
            Our AI pipeline handles the entire product presentation — so artisans can focus on
            making, not marketing.
          </p>

          <div ref={listRef} className="space-y-0 divide-y divide-white/10">
            {FEATURES.map((f) => (
              <div key={f.n} className="flex gap-6 py-6 group cursor-default">
                <span className="font-serif text-gold/50 text-sm mt-0.5 flex-shrink-0 w-6">
                  {f.n}
                </span>
                <div>
                  <h3 className="font-sans font-medium text-ivory mb-1 text-sm tracking-wide">
                    {f.title}
                  </h3>
                  <p className="text-stone-light leading-relaxed" style={{ fontSize: '0.9375rem' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image — before/after side-by-side */}
        <div ref={imgRef} className="grid grid-cols-2 gap-3">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=75&auto=format&fit=crop"
              alt="Raw unedited product photo — before AI enhancement"
              fill
              className="object-cover grayscale"
              sizes="25vw"
              unoptimized
            />
            <div className="absolute bottom-3 left-3 bg-charcoal/80 text-ivory overline px-2.5 py-1.5"
              style={{ fontSize: '0.55rem' }}>
              Before
            </div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=90&auto=format&fit=crop"
              alt="Professional AI-enhanced product photo — after"
              fill
              className="object-cover"
              sizes="25vw"
              unoptimized
            />
            <div className="absolute bottom-3 right-3 bg-gold text-ivory overline px-2.5 py-1.5"
              style={{ fontSize: '0.55rem' }}>
              After AI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

