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
      .min(12, 'At least 12 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/\d/, 'Must contain a digit')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
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
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, role: data.role }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? 'Registration failed');
      setSuccess(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong during registration.');
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-[#1C0E07] border border-white/15 p-8 sm:p-10 rounded-2xl shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FA7A21]/10 border border-[#FA7A21]/30 flex items-center justify-center mx-auto mb-4 text-[#FA7A21]">
          <MailCheck size={32} />
        </div>
        <h1 className="font-serif text-3xl font-normal text-white">Check Your Email</h1>
        <p className="text-stone-400 text-sm leading-relaxed font-light">
          We&apos;ve sent an activation link to your email address. Please verify to access your ALMS portal.
        </p>
        <div className="pt-2">
          <Link href="/login" className="w-full py-3.5 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md transition-all inline-flex items-center justify-center gap-2">
            <span>Proceed to Sign In</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
