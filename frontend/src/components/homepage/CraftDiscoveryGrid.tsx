'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CRAFTS = [
  { name: 'Pashmina Weaving', region: 'Kashmir', color: '#E8D5C4' },
  { name: 'Madhubani Painting', region: 'Bihar', color: '#F4E4B8' },
  { name: 'Dhokra Metal Casting', region: 'Chhattisgarh', color: '#E4D4C4' },
  { name: 'Chikankari Embroidery', region: 'Lucknow', color: '#D4E8E4' },
  { name: 'Warli Painting', region: 'Maharashtra', color: '#E8E4D4' },
  { name: 'Bidriware', region: 'Karnataka', color: '#D4D4E8' },
  { name: 'Phulkari Embroidery', region: 'Punjab', color: '#E8D4D4' },
  { name: 'Blue Pottery', region: 'Rajasthan', color: '#D4E4F4' },
];

/** Section 4 — Horizontal card scroll, pinned section (Req 27.3) */
export default function CraftDiscoveryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const track = trackRef.current;
        if (!track) return;
        const totalWidth = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden"
      aria-labelledby="discovery-heading"
    >
      <div className="py-16 ps-8 md:ps-16">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-accent font-ui mb-4">
          Discover Crafts
        </p>
        <h2 id="discovery-heading" className="font-display text-4xl md:text-5xl font-light mb-12">
          India&apos;s living heritage
        </h2>
      </div>

      <div ref={trackRef} className="flex gap-6 ps-8 md:ps-16 pb-16" style={{ width: 'max-content' }}>
        {CRAFTS.map((craft) => (
          <article
            key={craft.name}
            className="flex-shrink-0 w-72 h-80 rounded-2xl p-6 flex flex-col justify-end cursor-pointer
              hover:scale-[1.02] transition-transform duration-300"
            style={{ background: craft.color }}
            role="button"
            tabIndex={0}
            aria-label={`Explore ${craft.name} from ${craft.region}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
          >
            <div>
              <h3 className="font-display text-2xl font-medium text-brand-text mb-1">
                {craft.name}
              </h3>
              <p className="font-ui text-sm text-brand-muted">{craft.region}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
