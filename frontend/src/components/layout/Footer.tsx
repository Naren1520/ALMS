import Link from 'next/link';
import Image from 'next/image';

const LINKS = {
  Marketplace: [
    { label: 'Discover Crafts',   href: '/explore' },
    { label: 'Artisan Profiles',  href: '/artisans' },
    { label: 'Heritage Atlas',    href: '/craft-atlas' },
    { label: 'B2B Sourcing',      href: '/register?role=BUYER' },
  ],
  Platform: [
    { label: 'How It Works',  href: '/how-it-works' },
    { label: 'AI Features',   href: '/ai-tools' },
    { label: 'Trust System',  href: '/trust' },
    { label: 'Pricing',       href: '/pricing' },
  ],
  Company: [
    { label: 'About',         href: '/about' },
    { label: 'Impact Report', href: '/impact' },
    { label: 'Press',         href: '/press' },
    { label: 'Contact',       href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/70" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="container">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 py-20 border-b border-white/10">

          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6" aria-label="ALMS — Home">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="ALMS logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-ivory text-lg tracking-widest">ALMS</span>
            </Link>
            <p className="leading-relaxed text-sm max-w-xs mb-8" style={{ color: 'var(--stone-light)' }}>
              Connecting India&apos;s master artisans with discerning buyers worldwide.
              Authentic craft, direct from the source.
            </p>
            <p className="overline" style={{ fontSize: '0.6rem', color: 'var(--stone)' }}>
              Ministry of Social Justice &amp; Empowerment, Govt. of India
            </p>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <p className="overline text-ivory/50 mb-6" style={{ fontSize: '0.6rem' }}>
                {category}
              </p>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-7">
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            &copy; {new Date().getFullYear()} ALMS &mdash; Artisan Linkage and Market System.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs hover:text-ivory transition-colors duration-300"
                style={{ color: 'var(--stone)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
