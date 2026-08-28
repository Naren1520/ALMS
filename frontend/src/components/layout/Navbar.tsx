'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Discover', href: '/explore' },
  { label: 'Artisans', href: '/artisans' },
  { label: 'Heritage', href: '/craft-atlas' },
  { label: 'B2B', href: '/register?role=BUYER' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-ivory/98 backdrop-blur-sm shadow-sm border-b border-border'
          : 'bg-transparent'
        }`}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="ALMS — Home">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="ALMS logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`font-serif text-lg font-medium transition-colors duration-300
                ${scrolled ? 'text-charcoal' : 'text-ivory'}`}
              style={{ letterSpacing: '0.1em' }}
            >
              ALMS
            </span>
            <span
              className={`overline hidden sm:block mt-0.5 transition-colors duration-300
                ${scrolled ? 'text-stone' : 'text-ivory/60'}`}
              style={{ fontSize: '0.55rem' }}
            >
              Artisan Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`overline transition-colors duration-300 hover:text-charcoal
                ${scrolled ? 'text-stone' : 'text-ivory/70 hover:!text-ivory'}`}
              style={{ fontSize: '0.7rem' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA group */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className={`overline transition-colors duration-300
              ${scrolled ? 'text-stone hover:text-charcoal' : 'text-ivory/70 hover:text-ivory'}`}
            style={{ fontSize: '0.7rem' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={`px-5 py-2.5 text-xs font-sans font-medium uppercase tracking-widest
              transition-all duration-300 border
              ${scrolled
                ? 'bg-charcoal text-ivory border-charcoal hover:bg-charcoal-mid'
                : 'bg-ivory/10 text-ivory border-ivory/30 hover:bg-ivory/20'
              }`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block w-6 h-px transition-all duration-300
              ${scrolled ? 'bg-charcoal' : 'bg-ivory'}
              ${menuOpen ? 'rotate-45 translate-y-[8.5px]' : ''}`}
          />
          <span
            className={`block w-6 h-px transition-all duration-300
              ${scrolled ? 'bg-charcoal' : 'bg-ivory'}
              ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
          />
          <span
            className={`block w-6 h-px transition-all duration-300
              ${scrolled ? 'bg-charcoal' : 'bg-ivory'}
              ${menuOpen ? '-rotate-45 -translate-y-[8.5px]' : ''}`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400
          bg-ivory border-t border-border
          ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="container flex flex-col py-8 gap-6" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-serif text-2xl font-light text-charcoal hover:text-gold
                transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Link
              href="/login"
              className="px-5 py-3 text-xs font-sans font-medium uppercase tracking-widest
                border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory
                transition-all duration-300 flex-1 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-3 text-xs font-sans font-medium uppercase tracking-widest
                bg-charcoal text-ivory hover:bg-charcoal-mid
                transition-all duration-300 flex-1 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
