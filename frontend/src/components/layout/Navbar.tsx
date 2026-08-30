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
      className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md text-stone-900 border-b border-stone-200 shadow-xs transition-all duration-200"
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
          <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-full overflow-hidden border border-amber-600/30 shadow-xs bg-amber-50/60">
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
              <span className="font-serif text-2xl md:text-[26px] font-bold tracking-tight text-[#24130A] group-hover:text-[#FA7A21] transition-colors">
                ALMS
              </span>
              {/* <span className="text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 bg-orange-100 text-[#8B2500] rounded-full border border-orange-200">
                MoSJE Govt.
              </span> */}
            </div>
            <span
              className="text-stone-600 font-sans mt-0.5 font-normal text-[0.65rem] tracking-[0.04em]"
            >
              Artisan Linkage &amp; Market System
            </span>
          </div>
        </Link>

        {/* Typographic Desktop Navigation Links matching Screenshot 1 */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-sm font-semibold tracking-normal transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-[#FA7A21] font-bold'
                    : 'text-stone-800 hover:text-[#FA7A21]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FA7A21] rounded-full" />
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
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-stone-700 hover:text-[#24130A] hover:border-stone-400 transition-all cursor-pointer shadow-2xs"
              aria-label="Select Language"
            >
              <Globe size={13} className="text-[#FA7A21]" />
              <span>{currentLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-stone-200 py-1.5 z-50 rounded-2xl shadow-xl animate-in fade-in zoom-in-95">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-orange-50 hover:text-[#FA7A21] transition-colors cursor-pointer ${
                      currentLang === lang ? 'font-semibold text-[#FA7A21] bg-orange-50/60' : 'text-stone-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Truly Tribal Style 'Log In 👤' Pill matching Screenshot 1 */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 transition-all shadow-2xs"
          >
            <span>Log In</span>
            <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center text-white">
              <User size={11} />
            </div>
          </Link>

          {/* Signature Studio CTA */}
          <Link
            href="/artisan/create-product"
            className="px-5 py-2 text-xs font-semibold bg-[#FA7A21] text-white hover:bg-[#e06917] transition-all duration-200 rounded-full shadow-md hover:shadow-orange-500/25 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles size={13} />
            <span>Launch Studio</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white text-stone-900 border-t border-stone-200 shadow-2xl">
          <nav className="container flex flex-col py-6 px-4 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-serif text-lg py-2.5 px-4 flex items-center justify-between rounded-2xl transition-all ${
                    isActive ? 'text-[#FA7A21] bg-orange-50 font-bold' : 'text-stone-800 hover:bg-stone-50 hover:text-[#FA7A21]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            <div className="flex gap-3 pt-4 mt-2 border-t border-stone-200">
              <Link
                href="/login"
                className="px-4 py-3 text-xs font-semibold border border-stone-300 bg-white text-stone-800 rounded-full flex-1 text-center"
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
