import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      className="font-sans relative"
      style={{
        backgroundColor: '#3d2817',
        backgroundImage: `
          repeating-linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
          repeating-linear-gradient(0deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px),
          linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      }}
    >
      {/* Main Footer Container */}
      <div className="container py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Contact */}
          <div className="space-y-5">
            <h3 className="font-serif text-2xl font-semibold text-white tracking-wide">
              Contact
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-amber-100 font-light leading-relaxed">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FA7A21] shrink-0 mt-1" />
                <span className="text-amber-100/90">
                  <strong className="text-white font-medium">Central Office:</strong> ALMS Facilitation Cell, Ministry of Social Justice &amp; Empowerment, Shastri Bhawan, Dr. Rajendra Prasad Rd, New Delhi &mdash; 110001
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={17} className="text-[#FA7A21] shrink-0" />
                <span className="text-amber-100/90"><a href="tel:+911123381001" className="text-amber-100/90 hover:text-white transition-colors no-underline">+91 11 2338 1001</a> / <a href="tel:+919511909951" className="text-amber-100/90 hover:text-white transition-colors no-underline">+91 95119 09951</a></span>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={17} className="text-[#FA7A21] shrink-0" />
                <span className="text-amber-100/90">Email: <a href="mailto:support@alms.gov.in" className="text-amber-100/90 hover:text-white transition-colors no-underline">support@alms.gov.in</a></span>
              </p>
            </div>
          </div>

          {/* Column 2: Helpful Links */}
          <div className="space-y-5">
            <h3 className="font-serif text-2xl font-semibold text-white tracking-wide">
              Helpful Links
            </h3>
            <ul className="space-y-3.5 text-sm sm:text-base font-light text-amber-100/90">
              <li>
                <Link href="/b2b/rfq" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                  B2B Bulk Enquiry
                </Link>
              </li>
              <li>
                <Link href="/artisan/create-product" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                  Virtual Business Manager (AI Studio)
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                  Craft Catalog &amp; Clusters
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                  MoSJE Impact &amp; Governance
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                  Privacy Policy &amp; Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Opening Hours */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-semibold text-white tracking-wide">
                Company &amp; Mission
              </h3>
              <ul className="space-y-3 text-sm sm:text-base font-light text-amber-100/90">
                <li>
                  <Link href="/artisans" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                    Our Story &amp; Master Artisans
                  </Link>
                </li>
                <li>
                  <Link href="/craft-atlas" className="text-amber-100/90 hover:text-white transition-colors no-underline inline-block hover:translate-x-1 duration-200">
                    Indigenous Heritage Atlas
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <h4 className="font-serif text-lg font-medium text-white flex items-center gap-2.5">
                <Clock size={18} className="text-[#FA7A21]" />
                <span>Support &amp; Hub Hours</span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-100/80 font-light leading-relaxed">
                Mon &ndash; Sat: 10:00am &ndash; 07:30pm<br />
                Sunday: Closed (Online Helpdesk Active)
              </p>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-5">
            <h3 className="font-serif text-2xl font-semibold text-white tracking-wide">
              Follow Us
            </h3>
            <p className="text-sm sm:text-base text-amber-100/90 font-light leading-relaxed">
              Stay connected with stories of rural empowerment, master craftspeople, and live exhibitions.
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm no-underline"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm no-underline"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm no-underline"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm no-underline"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="Twitter / X"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Wave/Ridge Background Strip */}
      <div
        className="w-full h-8 bg-repeat-x opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 10px 0, rgba(250, 122, 33, 0.4) 6px, transparent 7px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Bottom Copyright Bar */}
      <div 
        className="py-6 text-center text-xs sm:text-sm text-amber-100/90 font-light border-t border-white/10"
        style={{
          backgroundColor: '#2d1810',
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
            linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%)
          `,
          backgroundSize: '100% 100%, 100% 100%',
        }}
      >
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} ALMS &mdash; Artisan Linkage and Market System. Ministry of Social Justice &amp; Empowerment, Govt. of India.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm text-amber-100/90">
            <Link href="/privacy-policy" className="text-amber-100/90 hover:text-white transition-colors no-underline">Privacy</Link>
            <Link href="/terms" className="text-amber-100/90 hover:text-white transition-colors no-underline">Terms of Service</Link>
            <Link href="/impact" className="text-amber-100/90 hover:text-white transition-colors no-underline">MoSJE Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
