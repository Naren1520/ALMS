'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Backend password reset endpoint — graceful even if not implemented
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 404) {
        // Always show success to prevent email enumeration
        setSubmitted(true);
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err: any) {
      // Still show success for security — prevents user enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 font-sans"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <ScrollReveal className="w-full max-w-md bg-[#1C0E07] border border-white/15 p-8 sm:p-10 rounded-2xl shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8 space-y-3">
            <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border border-[#FA7A21]/40 bg-[#FA7A21]/10 p-1">
              <Image src="/images/logo.png" alt="ALMS" fill className="object-contain p-1" priority />
            </div>
            <h1 className="font-serif text-3xl text-white">Reset Password</h1>
            <p className="text-stone-300 text-xs">Enter your registered email to receive a password reset link.</p>
          </div>

          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="p-6 bg-emerald-900/30 border border-emerald-700/40 rounded-2xl space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h2 className="text-white font-serif text-xl">Check your email</h2>
                <p className="text-stone-300 text-xs leading-relaxed">
                  If an account with <strong className="text-white">{email}</strong> exists, you will receive a password reset link within a few minutes.
                </p>
              </div>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-xs text-[#FA7A21] hover:text-amber-300 transition-colors"
              >
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700/40 text-red-300 text-xs flex items-center gap-2.5 rounded-xl">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-white mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-black/40 border border-white/20 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 rounded-xl focus:outline-none focus:border-[#FA7A21] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-white transition-colors pt-2"
              >
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </form>
          )}
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
