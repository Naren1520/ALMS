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
      {/* Main Footer Container matching Screenshot 2 */}
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-white tracking-wide">
              Contact
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-amber-100 font-light leading-relaxed">
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#FA7A21] shrink-0 mt-1" />
                <span className="text-amber-100">
                  <strong className="text-white font-medium">Central Office:</strong> ALMS Facilitation Cell, Ministry of Social Justice &amp; Empowerment, Shastri Bhawan, Dr. Rajendra Prasad Rd, New Delhi &mdash; 110001
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#FA7A21] shrink-0" />
                <span className="text-amber-100"><a href="tel:+911123381001" className="text-amber-100 hover:text-white transition-colors">+91 11 2338 1001</a> / <a href="tel:+919511909951" className="text-amber-100 hover:text-white transition-colors">+91 95119 09951</a></span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#FA7A21] shrink-0" />
                <span className="text-amber-100">Email: <a href="mailto:support@alms.gov.in" className="text-amber-100 hover:text-white transition-colors underline">support@alms.gov.in</a></span>
              </p>
            </div>
          </div>

          {/* Column 2: Helpful Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-white tracking-wide">
              Helpful Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-amber-100">
              <li>
                <Link href="/b2b/rfq" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                  B2B Bulk Enquiry
                </Link>
              </li>
              <li>
                <Link href="/artisan/create-product" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                  Virtual Business Manager (AI Studio)
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                  Craft Catalog &amp; Clusters
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                  MoSJE Impact &amp; Governance
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                  Privacy Policy &amp; Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Opening Hours */}
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-semibold text-white tracking-wide">
                Company &amp; Mission
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm font-light text-amber-100">
                <li>
                  <Link href="/artisans" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                    Our Story &amp; Master Artisans
                  </Link>
                </li>
                <li>
                  <Link href="/craft-atlas" className="text-amber-100 hover:text-white transition-colors underline decoration-amber-200 hover:decoration-white">
                    Indigenous Heritage Atlas
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <Clock size={16} className="text-[#FA7A21]" />
                <span>Support &amp; Hub Hours</span>
              </h4>
              <p className="text-xs text-amber-100 font-light leading-relaxed">
                Mon &ndash; Sat: 10:00am &ndash; 07:30pm<br />
                Sunday: Closed (Online Helpdesk Active)
              </p>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-white tracking-wide">
              Follow Us
            </h3>
            <p className="text-xs text-amber-100 font-light leading-relaxed">
              Stay connected with stories of rural empowerment, master craftspeople, and live exhibitions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-colors shadow-sm"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-colors shadow-sm"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-colors shadow-sm"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full hover:bg-[#FA7A21] text-white flex items-center justify-center transition-colors shadow-sm"
                style={{ backgroundColor: '#2d1810' }}
                aria-label="Twitter / X"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Wave/Ridge Background Strip matching bottom of Screenshot 2 */}
      <div
        className="w-full h-8 bg-repeat-x opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 10px 0, rgba(250, 122, 33, 0.4) 6px, transparent 7px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Bottom Copyright Bar matching Screenshot 2 */}
      <div 
        className="py-5 text-center text-xs text-amber-100 font-light border-t border-white/10"
        style={{
          backgroundColor: '#2d1810',
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
            linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%)
          `,
          backgroundSize: '100% 100%, 100% 100%',
        }}
      >
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} ALMS &mdash; Artisan Linkage and Market System. Ministry of Social Justice &amp; Empowerment, Govt. of India.
          </p>
          <div className="flex gap-6 text-[11px] text-amber-100">
            <Link href="/privacy-policy" className="text-amber-100 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-amber-100 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/impact" className="text-amber-100 hover:text-white transition-colors">MoSJE Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
