'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginForm { email: string; password: string; }

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

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
      setServerError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{ background: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-light mb-2">Welcome back</h1>
          <p className="font-ui text-brand-muted">Sign in to your ALMS account</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-ui text-sm" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-ui font-medium text-brand-text mb-1">Email</label>
            <input
              id="email" type="email" autoComplete="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-3 rounded-lg border font-ui focus:outline-none focus:ring-2 focus:ring-brand-accent"
              style={{ borderColor: errors.email ? '#ef4444' : '#D1C4B0' }}
              aria-describedby={errors.email ? 'email-err' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p id="email-err" className="mt-1 text-sm text-red-600 font-ui">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-ui font-medium text-brand-text mb-1">Password</label>
            <input
              id="password" type="password" autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 rounded-lg border font-ui focus:outline-none focus:ring-2 focus:ring-brand-accent"
              style={{ borderColor: errors.password ? '#ef4444' : '#D1C4B0' }}
              aria-describedby={errors.password ? 'pwd-err' : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p id="pwd-err" className="mt-1 text-sm text-red-600 font-ui">{errors.password.message}</p>}
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg text-white font-ui font-medium hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--color-accent)' }}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center mt-6 font-ui text-sm text-brand-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium" style={{ color: 'var(--color-accent)' }}>Create one</Link>
        </p>
      </div>
    </main>
  );
}
