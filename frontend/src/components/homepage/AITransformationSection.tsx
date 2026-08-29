'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Camera, Mic, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';

const PILLARS = [
  {
    icon: Camera,
    title: 'AI Image Studio & Lighting Normalization',
    desc: 'Automatically extracts products from noisy rural backgrounds (mud floors, tin sheds) and creates standardized high-res studio lighting.',
  },
  {
    icon: Mic,
    title: 'Multilingual Auto-Cataloger (Bhashini/Gemini)',
    desc: 'Artisans speak in 12+ native Indian languages. AI transcribes, translates, and generates structured English and Hindi product listings.',
  },
  {
    icon: Calculator,
    title: 'Dynamic Pricing Engine & Cost Floor Protection',
    desc: 'Computes raw materials, crafting hours, and regional wage indices to establish a defensible price floor and prevent buyer exploitation.',
  },
];

export default function AITransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.from(imgRef.current, {
            opacity: 0,
            x: 40,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          });
          if (listRef.current) {
            gsap.from(Array.from(listRef.current.children), {
              opacity: 0,
              x: -32,
              stagger: 0.12,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: listRef.current, start: 'top 75%' },
            });
          }
        });
      } catch (e) {
        // fallback
      }
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 overflow-hidden"
      aria-labelledby="ai-pillars-heading"
      style={{ background: '#1A1A1A', color: '#FDFBF7' }}
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Content */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-px bg-gold" />
            <p className="overline text-gold text-[11px]">Virtual Business Manager Architecture</p>
          </div>
          <h2
            id="ai-pillars-heading"
            className="font-serif text-ivory mb-6 font-light"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: 1.1 }}
          >
            Zero-Literacy AI Pipeline:<br />
            <em className="text-gold-light" style={{ fontStyle: 'italic' }}>
              One Photo. One Voice Note.
            </em>
          </h2>
          <p className="leading-relaxed mb-10 text-stone-light text-base">
            ALMS replaces complex e-commerce seller dashboards with an intuitive voice-first mobile pipeline. We solve the exact operational bottlenecks holding back rural micro-producers.
          </p>

          <div ref={listRef} className="space-y-6">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-gold/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-ivory text-sm mb-1">{p.title}</h3>
                    <p className="text-stone-light text-xs leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Real Visual Transformation */}
        <div ref={imgRef} className="relative space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=70&auto=format&fit=crop"
                alt="Raw unedited artisan smartphone photo"
                fill
                className="object-cover grayscale contrast-75"
                sizes="25vw"
                unoptimized
              />
              <div className="absolute bottom-3 left-3 bg-charcoal/90 text-ivory overline px-2.5 py-1 text-[10px] rounded">
                Raw Smartphone Photo
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gold/40 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=95&auto=format&fit=crop"
                alt="AI-enhanced studio listing"
                fill
                className="object-cover contrast-105"
                sizes="25vw"
                unoptimized
              />
              <div className="absolute bottom-3 right-3 bg-gold text-ivory overline px-2.5 py-1 text-[10px] font-semibold rounded flex items-center gap-1">
                <Sparkles size={11} /> AI Studio Ready
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between text-xs text-stone-light">
            <span className="flex items-center gap-1.5 text-ivory">
              <CheckCircle2 size={15} className="text-gold" />
              Direct Output to ONDC &amp; B2B Buyers
            </span>
            <span className="text-gold font-mono text-[11px]">Latency: ~1.2s</span>
          </div>
        </div>
      </div>
    </section>
  );
}
