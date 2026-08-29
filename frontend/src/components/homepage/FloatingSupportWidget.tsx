'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Building2, ArrowUp, Star } from 'lucide-react';
import Link from 'next/link';

export default function FloatingSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !query.trim()) return;
    setSubmitted(true);
  };

  return (
    <>
      {/* Floating Trust / Rating Badge on Bottom Left matching Screenshot 4 */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-stone-200 text-stone-800 text-xs font-sans">
        <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-900 text-xs">
          G
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-stone-900 text-xs">5.0</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">MoSJE Verified Reviews</p>
        </div>
      </div>

      {/* Floating Bottom Right Controls */}
      <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end gap-3">
        {/* Scroll To Top Button matching Screenshot 4 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-amber-100/90 hover:bg-amber-200 text-stone-800 flex items-center justify-center shadow-lg border border-amber-200/80 transition-all duration-200 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </button>
        )}

        {/* Expanded Modal Box */}
        {isOpen && (
          <div
            className="mb-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-fade-up"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.22)' }}
          >
            {/* Header */}
            <div className="bg-[#24130A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FA7A21] flex items-center justify-center text-white shadow-md">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold leading-tight">ALMS &bull; Support Hub</h3>
                  <p className="text-[11px] text-amber-200">Artisan Sourcing &amp; Gifting Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-charcoal">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="font-serif text-xl font-medium text-charcoal">Inquiry Received!</h4>
                  <p className="text-xs text-stone-600">
                    Thank you, <strong>{name}</strong>! An artisan coordinator will connect with you via WhatsApp or Email within 2 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setIsOpen(false); }}
                    className="px-6 py-2 bg-[#FA7A21] text-white text-xs font-semibold rounded-full shadow-md mt-2"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-orange-50 border border-orange-200/80 p-3.5 rounded-2xl text-xs text-[#8B2500] leading-relaxed">
                    Namaste! Looking for authentic tribal crafts, corporate gifting hampers, or assistance with the Virtual Business Manager?
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/b2b/rfq"
                      onClick={() => setIsOpen(false)}
                      className="p-2.5 bg-stone-100 hover:bg-orange-50 rounded-xl text-center font-medium text-stone-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Building2 size={13} className="text-[#FA7A21]" />
                      Corporate RFQ
                    </Link>
                    <Link
                      href="/artisan/create-product"
                      onClick={() => setIsOpen(false)}
                      className="p-2.5 bg-stone-100 hover:bg-orange-50 rounded-xl text-center font-medium text-stone-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={13} className="text-[#FA7A21]" />
                      AI Studio
                    </Link>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                    <input
                      type="text"
                      placeholder="Your Name or Company"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#FA7A21]"
                    />
                    <textarea
                      placeholder="Ask about bulk gifting, craft origins, or pricing..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      required
                      rows={3}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#FA7A21] resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Send Message</span>
                      <Send size={13} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Floating Trigger Button with 'Message us' pill matching Screenshot 4 */}
        <div className="flex items-center gap-2">
          {!isOpen && (
            <span className="hidden sm:inline-block px-3 py-1.5 bg-white text-stone-800 text-xs font-semibold rounded-full shadow-lg border border-stone-200 animate-pulse">
              Message us
            </span>
          )}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="w-14 h-14 rounded-full bg-[#FA7A21] hover:bg-[#e06917] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ boxShadow: '0 8px 25px rgba(250, 122, 33, 0.45)' }}
            aria-label="Open support chat"
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={26} className="fill-white/20" />}
          </button>
        </div>
      </div>
    </>
  );
}
