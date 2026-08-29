'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, Sparkles, User, BookOpen } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'AI Studio', href: '/artisan/create-product' },
  { label: 'B2B RFQ', href: '/b2b/rfq' },
  { label: 'Explore Crafts', href: '/explore' },
  { label: 'Artisans', href: '/artisans' },
  { label: 'Impact', href: '/impact' },
  { label: 'Docs', href: '/docs' },
];

const LANGUAGES = ['English', 'हिन्दी', 'ಕನ್ನಡ', 'বাংলা', 'தமிழ்'];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-[#24130A]/95 backdrop-blur-md text-amber-50 border-b border-amber-900/40 shadow-md transition-all duration-200"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 sm:px-6">
        
        {/* Typographic Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="ALMS — Home"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-full overflow-hidden border border-amber-500/40 shadow-xs bg-[#361E13]">
            <Image
              src="/images/logo.png"
              alt="ALMS emblem"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl md:text-[26px] font-bold tracking-tight text-[#FFF2DE] group-hover:text-[#FA7A21] transition-colors">
                ALMS
              </span>
              <span className="text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#FA7A21]/20 text-amber-300 rounded-full border border-[#FA7A21]/40">
                MoSJE Govt.
              </span>
            </div>
            <span
              className="text-amber-200/70 font-sans mt-0.5 font-normal"
              style={{ fontSize: '0.65rem', letterSpacing: '0.04em' }}
            >
              Artisan Linkage &amp; Market System
            </span>
          </div>
        </Link>

        {/* Typographic Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-normal transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-amber-300 font-semibold bg-[#FA7A21]/20 border border-[#FA7A21]/40'
                    : 'text-stone-200 hover:text-[#FA7A21] hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FA7A21] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls (Truly Tribal Pill Theme: Log In & Launch Studio) */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-900/60 bg-[#361E13] text-amber-100 hover:text-white hover:border-[#FA7A21]/60 hover:bg-[#462618] transition-all cursor-pointer shadow-2xs"
              aria-label="Select Language"
            >
              <Globe size={13} className="text-[#FA7A21]" />
              <span>{currentLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#2B1810] border border-amber-900/60 py-1.5 z-50 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-[#3D2214] hover:text-[#FA7A21] transition-colors cursor-pointer ${
                      currentLang === lang ? 'font-semibold text-amber-300 bg-[#FA7A21]/20' : 'text-amber-200/80'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Truly Tribal Style 'Log In 👤' Pill */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-amber-800/60 bg-[#361E13] text-amber-100 hover:bg-[#462618] hover:text-white hover:border-amber-500/50 transition-all shadow-2xs"
          >
            <span>Log In</span>
            <div className="w-5 h-5 rounded-full bg-[#24130A] flex items-center justify-center text-amber-300">
              <User size={12} />
            </div>
          </Link>

          {/* Signature Studio CTA */}
          <Link
            href="/artisan/create-product"
            className="px-5 py-2 text-xs font-semibold bg-[#FA7A21] text-white hover:bg-[#e06917] transition-all duration-200 rounded-full shadow-md hover:shadow-orange-950/60 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles size={13} />
            <span>Launch Studio</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-amber-100 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#24130A] text-amber-100 border-t border-amber-900/40 shadow-2xl">
          <nav className="container flex flex-col py-6 px-4 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-serif text-lg py-2.5 px-4 flex items-center justify-between rounded-2xl transition-all ${
                    isActive ? 'text-amber-300 bg-[#FA7A21]/20 font-semibold' : 'text-stone-200 hover:bg-white/5 hover:text-[#FA7A21]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <div className="flex gap-3 pt-4 mt-2 border-t border-amber-900/40">
              <Link
                href="/login"
                className="px-4 py-3 text-xs font-medium border border-amber-800/60 bg-[#361E13] text-amber-100 rounded-full flex-1 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/artisan/create-product"
                className="px-4 py-3 text-xs font-semibold bg-[#FA7A21] text-white rounded-full flex-1 text-center shadow-md hover:bg-[#e06917]"
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
