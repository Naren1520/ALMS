'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MailCheck, ArrowRight, Lock, Mail, User, Briefcase, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';

const registerSchema = z
  .object({
    email: z.string().email('Must be a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required'),
    confirmPassword: z.string(),
    role: z.enum(['ARTISAN', 'BUYER', 'CONSUMER']),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterFormComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultRole = (searchParams.get('role') ?? 'ARTISAN') as RegisterForm['role'];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      // 1. Register Account
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, role: data.role }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? 'Registration failed');

      // 2. Auto-login immediately
      try {
        const loginRes = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const loginBody = await loginRes.json();
        if (loginRes.ok && loginBody.accessToken) {
          localStorage.setItem('access_token', loginBody.accessToken);
          if (loginBody.user) {
            localStorage.setItem('alms_user', JSON.stringify(loginBody.user));
          }
          let destination = '/artisan/create-product';
          if (data.role === 'BUYER') {
            destination = '/b2b/rfq';
          } else if (data.role === 'CONSUMER') {
            destination = '/explore';
          }
          window.location.href = destination;
          return;
        }
      } catch {
        // If auto-login fails, redirect to login page
      }

      // Fallback: Redirect to login page
      window.location.href = '/login';
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong during registration.');
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#1C0E07] border border-white/15 p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl relative text-white">
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
          <span>Join the ALMS Network</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
          Create Your Account
        </h1>
        <p className="text-stone-200 text-xs sm:text-sm font-light">
          Empowering Indian artisans and connecting global buyers directly
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
          <button type="button" onClick={() => { setValue('role', 'ARTISAN'); setValue('email', 'artisan.bastar@alms.in'); setValue('password', 'Password123!'); setValue('confirmPassword', 'Password123!'); }} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FA7A21]/50 text-white text-[11px] rounded-lg transition-all">
            Artisan
          </button>
          <button type="button" onClick={() => { setValue('role', 'BUYER'); setValue('email', 'procurement@fabindia.com'); setValue('password', 'Password123!'); setValue('confirmPassword', 'Password123!'); }} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FA7A21]/50 text-white text-[11px] rounded-lg transition-all">
            B2B Buyer
          </button>
          <button type="button" onClick={() => { setValue('role', 'CONSUMER'); setValue('email', 'consumer@alms.in'); setValue('password', 'Password123!'); setValue('confirmPassword', 'Password123!'); }} className="px-3 py-1.5 bg-black/40 border border-white/10 hover:border-[#FA7A21]/50 text-white text-[11px] rounded-lg transition-all">
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
        {/* Role Selector Cards */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-stone-100 mb-2">
            I am joining as a
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { id: 'ARTISAN', label: 'Artisan', icon: User, desc: 'Maker / Cluster' },
              { id: 'BUYER', label: 'B2B Buyer', icon: Briefcase, desc: 'Wholesale' },
              { id: 'CONSUMER', label: 'Consumer', icon: ShoppingBag, desc: 'Direct Buyer' },
            ].map(({ id, label, icon: Icon, desc }) => {
              const isChecked = selectedRole === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setValue('role', id as RegisterForm['role'])}
                  className={`p-3.5 text-center rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center gap-1.5 ${
                    isChecked
                      ? 'bg-[#FA7A21] text-white border-[#FA7A21] shadow-md'
                      : 'bg-white/10 border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                  }`}
                >
                  <Icon size={18} className={isChecked ? 'text-white' : 'text-[#FA7A21]'} />
                  <span className="text-xs font-semibold leading-none">{label}</span>
                  <span className="text-[10px] opacity-80 leading-none font-light">{desc}</span>
                </button>
              );
            })}
          </div>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-stone-100 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="name@domain.com"
              className="w-full bg-black/30 border border-white/15 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 rounded-xl focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
              style={{ borderColor: errors.email ? '#dc2626' : undefined }}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-stone-100 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              placeholder="••••••••••••"
              className="w-full bg-black/30 border border-white/15 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 rounded-xl focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
              style={{ borderColor: errors.password ? '#dc2626' : undefined }}
              aria-invalid={!!errors.password}
            />
          </div>
          <p className="mt-1 text-[11px] text-stone-300 font-light">
            Min 12 characters with uppercase, lowercase, number &amp; symbol
          </p>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider font-semibold text-stone-100 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              placeholder="••••••••••••"
              className="w-full bg-black/30 border border-white/15 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 rounded-xl focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
              style={{ borderColor: errors.confirmPassword ? '#dc2626' : undefined }}
              aria-invalid={!!errors.confirmPassword}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? 'Creating Account…' : 'Complete Registration'}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-stone-300">
          Already registered on ALMS?{' '}
          <Link href="/login" className="font-semibold text-[#FA7A21] hover:text-amber-200 transition-colors ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 font-sans" style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}>
        <ScrollReveal className="w-full flex justify-center">
          <Suspense
            fallback={
              <div className="w-full max-w-md bg-[#1C0E07] border border-white/15 p-12 text-center rounded-2xl shadow-lg">
                <p className="text-xs uppercase tracking-widest text-stone-300 font-medium">Loading registration…</p>
              </div>
            }
          >
            <RegisterFormComponent />
          </Suspense>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
