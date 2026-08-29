'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MailCheck, ArrowRight, Lock, Mail, User, Briefcase, ShoppingBag, AlertCircle } from 'lucide-react';

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
      <div className="w-full max-w-md bg-ivory-dark border border-border p-8 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <MailCheck size={32} className="text-gold" />
        </div>
        <h1 className="font-serif text-3xl font-light text-charcoal mb-3">Check Your Email</h1>
        <p className="text-stone text-sm leading-relaxed mb-6">
          We&apos;ve sent an activation link to your email address. Please verify to access your ALMS portal.
        </p>
        <Link href="/login" className="btn-primary inline-flex text-xs py-3 px-8">
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-ivory-dark border border-border p-8 sm:p-10 shadow-sm relative">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-6 h-px bg-gold" />
          <p className="overline text-gold" style={{ fontSize: '0.65rem' }}>
            Join the Network
          </p>
          <span className="w-6 h-px bg-gold" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal mb-2">
          Create Your Account
        </h1>
        <p className="text-stone text-xs sm:text-sm">
          Empowering Indian artisans and connecting global buyers directly
        </p>
      </div>

      {serverError && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-xs"
          role="alert"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Role Selector Cards */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-2">
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
                  className={`p-3 text-center border transition-all duration-200 cursor-pointer flex flex-col items-center gap-1.5 ${
                    isChecked
                      ? 'bg-charcoal text-ivory border-charcoal shadow-xs'
                      : 'bg-ivory border-border text-stone hover:border-gold hover:text-charcoal'
                  }`}
                >
                  <Icon size={16} className={isChecked ? 'text-gold-light' : 'text-stone-light'} />
                  <span className="text-xs font-semibold leading-none">{label}</span>
                  <span className="text-[10px] opacity-70 leading-none">{desc}</span>
                </button>
              );
            })}
          </div>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="name@domain.com"
              className="w-full bg-white border border-border pl-10 pr-4 py-2.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
              style={{ borderColor: errors.email ? '#dc2626' : undefined }}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              placeholder="••••••••••••"
              className="w-full bg-white border border-border pl-10 pr-4 py-2.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
              style={{ borderColor: errors.password ? '#dc2626' : undefined }}
              aria-invalid={!!errors.password}
            />
          </div>
          <p className="mt-1 text-[11px] text-stone-light">
            Min 12 characters with uppercase, lowercase, number &amp; symbol
          </p>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              placeholder="••••••••••••"
              className="w-full bg-white border border-border pl-10 pr-4 py-2.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
              style={{ borderColor: errors.confirmPassword ? '#dc2626' : undefined }}
              aria-invalid={!!errors.confirmPassword}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center text-xs py-3 mt-2 font-medium"
        >
          {isSubmitting ? 'Creating Account…' : 'Complete Registration'}
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-xs text-stone">
          Already registered on ALMS?{' '}
          <Link href="/login" className="font-semibold text-charcoal hover:text-gold transition-colors ml-1">
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
      <main className="min-h-screen bg-ivory flex items-center justify-center pt-28 pb-20 px-4 font-sans">
        <ScrollReveal className="w-full flex justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-ivory-dark border border-border p-12 text-center">
              <p className="text-xs uppercase tracking-widest text-stone">Loading registration…</p>
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
