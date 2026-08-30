'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, Sparkles, User, Briefcase, ShoppingBag } from 'lucide-react';

export type UserRoleType = 'ARTISAN' | 'BUYER' | 'CONSUMER' | 'DEFAULT';

const ROLE_NAV_LINKS: Record<UserRoleType, Array<{ label: string; href: string }>> = {
  ARTISAN: [
    { label: 'Home', href: '/' },
    { label: 'AI Studio', href: '/artisan/create-product' },
    { label: 'My Products', href: '/explore' },
    { label: 'B2B RFQ Quotes', href: '/b2b/rfq' },
    { label: 'Impact & Trust', href: '/impact' },
  ],
  BUYER: [
    { label: 'Home', href: '/' },
    { label: 'B2B RFQ Engine', href: '/b2b/rfq' },
    { label: 'Wholesale Catalog', href: '/explore' },
    { label: 'Craft Clusters', href: '/craft-atlas' },
    { label: 'Artisans Guild', href: '/artisans' },
    { label: 'ESG Impact', href: '/impact' },
  ],
  CONSUMER: [
    { label: 'Home', href: '/' },
    { label: 'Explore Marketplace', href: '/explore' },
    { label: 'Craft Atlas', href: '/craft-atlas' },
    { label: 'Master Artisans', href: '/artisans' },
    { label: 'Heritage Stories', href: '/impact' },
  ],
  DEFAULT: [
    { label: 'Home', href: '/' },
    { label: 'Explore Crafts', href: '/explore' },
    { label: 'Craft Atlas', href: '/craft-atlas' },
    { label: 'Artisans', href: '/artisans' },
    { label: 'Impact', href: '/impact' },
  ],
};

const LANGUAGES = ['English', 'हिन्दी', 'ಕನ್ನಡ', 'বাংলা', 'தமிழ்'];

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const syncUserFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('alms_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.role) {
          setUser(parsed);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    syncUserFromStorage();

    const handleStorageChange = () => syncUserFromStorage();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('alms-auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('alms-auth-change', handleStorageChange);
    };
  }, [pathname, syncUserFromStorage]);

  // Determine normalized role (ARTISAN, BUYER, CONSUMER, or DEFAULT)
  const activeRole: UserRoleType = (() => {
    if (!mounted || !user?.role) return 'DEFAULT';
    const clean = String(user.role).trim().toUpperCase();
    if (clean === 'ARTISAN' || clean === 'BUYER' || clean === 'CONSUMER') {
      return clean as UserRoleType;
    }
    return 'DEFAULT';
  })();

  const navLinks = ROLE_NAV_LINKS[activeRole];

  const handleLogout = () => {
    try {
      localStorage.removeItem('alms_user');
      localStorage.removeItem('access_token');
      window.dispatchEvent(new Event('alms-auth-change'));
    } catch {}
    window.location.href = '/login';
  };

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
            </div>
            <span
              className="text-stone-600 font-sans mt-0.5 font-normal text-[0.65rem] tracking-[0.04em]"
            >
              Artisan Linkage &amp; Market System
            </span>
          </div>
        </Link>

        {/* Dynamic Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Primary navigation">
          {navLinks.map((link) => {
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

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors cursor-pointer"
              aria-label="Select Language"
            >
              <Globe size={13} className="text-[#FA7A21]" />
              <span>{currentLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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

          {/* User Controls */}
          {mounted && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-stone-50" title={user.email}>
                <div className="w-6 h-6 rounded-full bg-[#FA7A21]/20 flex items-center justify-center text-[#FA7A21]">
                  <User size={13} />
                </div>
                <span className="text-[10px] font-semibold text-stone-700 uppercase tracking-wider">{activeRole}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-stone-500 hover:text-red-500 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 transition-all shadow-2xs"
            >
              <span>Log In</span>
              <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center text-white">
                <User size={11} />
              </div>
            </Link>
          )}

          {/* Role-Adaptive Signature CTA */}
          {activeRole === 'ARTISAN' ? (
            <Link
              href="/artisan/create-product"
              className="px-5 py-2 text-xs font-semibold bg-[#FA7A21] text-white hover:bg-[#e06917] transition-all duration-200 rounded-full shadow-md hover:shadow-orange-500/25 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles size={13} />
              <span>AI Studio</span>
            </Link>
          ) : activeRole === 'BUYER' ? (
            <Link
              href="/b2b/rfq"
              className="px-5 py-2 text-xs font-semibold bg-[#8B2500] text-white hover:bg-[#721e00] transition-all duration-200 rounded-full shadow-md hover:shadow-amber-900/25 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Briefcase size={13} />
              <span>Post Bulk RFQ</span>
            </Link>
          ) : (
            <Link
              href="/explore"
              className="px-5 py-2 text-xs font-semibold bg-[#FA7A21] text-white hover:bg-[#e06917] transition-all duration-200 rounded-full shadow-md hover:shadow-orange-500/25 flex items-center gap-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag size={13} />
              <span>Explore Crafts</span>
            </Link>
          )}
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
            {navLinks.map((link) => {
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
              {mounted && user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-xs font-semibold border border-stone-300 bg-white text-red-500 hover:bg-red-50 rounded-full flex-1 text-center cursor-pointer"
                >
                  Log Out ({activeRole})
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-3 text-xs font-semibold border border-stone-300 bg-white text-stone-800 rounded-full flex-1 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
              )}
              
              {activeRole === 'ARTISAN' ? (
                <Link
                  href="/artisan/create-product"
                  className="px-4 py-3 text-xs font-semibold bg-[#FA7A21] text-white rounded-full flex-1 text-center shadow-md hover:bg-[#e06917]"
                  onClick={() => setMenuOpen(false)}
                >
                  AI Studio
                </Link>
              ) : activeRole === 'BUYER' ? (
                <Link
                  href="/b2b/rfq"
                  className="px-4 py-3 text-xs font-semibold bg-[#8B2500] text-white rounded-full flex-1 text-center shadow-md hover:bg-[#721e00]"
                  onClick={() => setMenuOpen(false)}
                >
                  Post Bulk RFQ
                </Link>
              ) : (
                <Link
                  href="/explore"
                  className="px-4 py-3 text-xs font-semibold bg-[#FA7A21] text-white rounded-full flex-1 text-center shadow-md hover:bg-[#e06917]"
                  onClick={() => setMenuOpen(false)}
                >
                  Explore Crafts
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
