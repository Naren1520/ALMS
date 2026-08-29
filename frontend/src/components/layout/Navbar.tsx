'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'AI Studio', href: '/artisan/create-product' },
  { label: 'B2B RFQ Matcher', href: '/b2b/rfq' },
  { label: 'Explore Crafts', href: '/explore' },
  { label: 'Artisans', href: '/artisans' },
  { label: 'Impact Dashboard', href: '/impact' },
  { label: 'Heritage Atlas', href: '/craft-atlas' },
];

const LANGUAGES = ['English', 'हिन्दी', 'ಕನ್ನಡ', 'বাংলা', 'தமிழ்'];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-charcoal/95 text-ivory border-b border-white/10 backdrop-blur-md shadow-md"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="ALMS — Home"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="ALMS logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg md:text-xl font-medium tracking-wider text-ivory">
              ALMS
            </span>
            <span
              className="overline mt-0.5 text-stone-light"
              style={{ fontSize: '0.55rem' }}
            >
              Virtual Business Manager
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-xs uppercase tracking-widest transition-colors duration-200 font-medium ${
                  isActive ? 'text-gold-light' : 'text-stone-light hover:text-ivory'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-light rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls (Language Selector + CTAs) */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border border-white/20 text-ivory hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Select Language"
            >
              <Globe size={13} className="text-gold" />
              <span>{currentLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-charcoal border border-white/20 rounded-lg shadow-xl py-1 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs text-stone-light hover:text-ivory hover:bg-white/10 transition-colors cursor-pointer ${
                      currentLang === lang ? 'font-bold text-gold-light' : ''
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="text-xs uppercase tracking-widest px-2.5 py-2 text-stone-light hover:text-ivory transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/artisan/create-product"
            className="px-4 py-2.5 text-xs font-sans font-medium uppercase tracking-widest bg-gold text-ivory hover:bg-gold-dark transition-all rounded shadow-sm"
          >
            Launch Studio
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-ivory hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-charcoal text-ivory border-t border-white/10 shadow-2xl">
          <nav className="container flex flex-col py-6 gap-3.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-serif text-xl font-light transition-colors py-1 flex items-center justify-between ${
                    isActive ? 'text-gold-light font-normal' : 'text-ivory hover:text-gold-light'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-xs overline text-gold">Active</span>}
                </Link>
              );
            })}
            <div className="flex gap-3 pt-4 mt-2 border-t border-white/10">
              <Link
                href="/login"
                className="px-4 py-3 text-xs font-sans font-medium uppercase tracking-widest border border-white/20 text-ivory hover:bg-white/10 flex-1 text-center rounded"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/artisan/create-product"
                className="px-4 py-3 text-xs font-sans font-medium uppercase tracking-widest bg-gold text-ivory hover:bg-gold-dark flex-1 text-center rounded"
                onClick={() => setMenuOpen(false)}
              >
                Launch Studio
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
