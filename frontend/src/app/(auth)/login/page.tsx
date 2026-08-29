'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

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
      localStorage.setItem('access_token', body.accessToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory flex items-center justify-center pt-28 pb-20 px-4 font-sans">
        <ScrollReveal className="w-full max-w-md bg-ivory-dark border border-border p-8 sm:p-10 shadow-sm relative">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-6 h-px bg-gold" />
              <p className="overline text-gold" style={{ fontSize: '0.65rem' }}>
                Account Access
              </p>
              <span className="w-6 h-px bg-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-charcoal mb-2">
              Welcome Back
            </h1>
            <p className="text-stone text-xs sm:text-sm">
              Sign in to your ALMS artisan or buyer account
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
                  {...register('email', { required: 'Email is required' })}
                  placeholder="artisan@domain.com"
                  className="w-full bg-white border border-border pl-10 pr-4 py-2.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
                  style={{ borderColor: errors.email ? '#dc2626' : undefined }}
                  aria-describedby={errors.email ? 'email-err' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p id="email-err" className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-stone hover:text-gold transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-border pl-10 pr-4 py-2.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
                  style={{ borderColor: errors.password ? '#dc2626' : undefined }}
                  aria-describedby={errors.password ? 'pwd-err' : undefined}
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password && (
                <p id="pwd-err" className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center text-xs py-3 mt-2 font-medium"
            >
              {isSubmitting ? 'Authenticating…' : 'Sign In'}
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-stone">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-semibold text-charcoal hover:text-gold transition-colors ml-1">
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
