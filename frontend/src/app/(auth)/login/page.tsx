'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? 'Login failed');
      
      if (body.accessToken) {
        localStorage.setItem('access_token', body.accessToken);
      }
      if (body.user) {
        localStorage.setItem('alms_user', JSON.stringify(body.user));
      }

      // Role-based redirection
      let destination = '/artisan/create-product';
      if (body.user?.role === 'BUYER') {
        destination = '/b2b/rfq';
      } else if (body.user?.role === 'CONSUMER') {
        destination = '/explore';
      } else if (body.user?.role === 'ADMIN' || body.user?.role === 'MODERATOR') {
        destination = '/craft-atlas';
      }

      // Use window.location for full state hydration
      window.location.href = destination;
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 font-sans" style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}>
        <ScrollReveal className="w-full max-w-md bg-[#1C0E07] border border-white/15 p-8 sm:p-10 rounded-2xl shadow-2xl relative">
          {/* Top Logo & Emblem */}
          <div className="text-center mb-8 space-y-3">
            <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border border-[#FA7A21]/40 shadow-xs bg-[#FA7A21]/10 p-1">
              <Image
                src="/images/logo.png"
                alt="ALMS emblem"
                fill
                className="object-contain p-1"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FA7A21]/15 border border-[#FA7A21]/30 text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
              <span>MoSJE Beneficiary Portal</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-white text-xs sm:text-sm font-light leading-relaxed">
              Sign in to your ALMS artisan, buyer, or government portal
            </p>
          </div>

          {serverError && (
            <div
              className="mb-6 p-4 bg-red-900/30 border border-red-700/40 text-red-300 text-xs flex items-center gap-2.5 rounded-xl"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* MOCK LOGIN HELPERS */}
          <div className="mb-6 p-4 bg-[#FA7A21]/10 border border-[#FA7A21]/20 rounded-xl space-y-2">
            <p className="text-[10px] text-amber-200 uppercase tracking-widest font-semibold mb-2">Dev Helpers: Auto-fill Seeded Accounts</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setValue('email', 'artisan.bastar@alms.in'); setValue('password', 'Password123!'); }} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FA7A21]/50 text-white text-[11px] rounded-lg transition-all">
                Artisan
              </button>
              <button onClick={() => { setValue('email', 'procurement@fabindia.com'); setValue('password', 'Password123!'); }} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FA7A21]/50 text-white text-[11px] rounded-lg transition-all">
                B2B Buyer
              </button>
              <button onClick={() => { setValue('email', 'consumer@alms.in'); setValue('password', 'Password123!'); }} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FA7A21]/50 text-white text-[11px] rounded-lg transition-all">
                Consumer
              </button>
            </div>
          </div>

          <form
            action="#"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            noValidate
            className="space-y-5"
          >
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-white mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="artisan@domain.com"
                  className="w-full bg-black/40 border border-white/20 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 rounded-xl focus:outline-none focus:border-[#FA7A21] focus:ring-1 focus:ring-[#FA7A21] transition-all"
                  style={{ borderColor: errors.email ? '#dc2626' : undefined }}
                  aria-describedby={errors.email ? 'email-err' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p id="email-err" className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-white">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-white hover:text-amber-200 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/20 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 rounded-xl focus:outline-none focus:border-[#FA7A21] focus:ring-1 focus:ring-[#FA7A21] transition-all"
                  style={{ borderColor: errors.password ? '#dc2626' : undefined }}
                  aria-describedby={errors.password ? 'pwd-err' : undefined}
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password && (
                <p id="pwd-err" className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? 'Authenticating…' : 'Sign In'}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-semibold text-[#FA7A21] hover:text-amber-200 transition-colors ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
