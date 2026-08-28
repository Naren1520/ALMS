'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z.object({
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
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

/**
 * Inner component that uses useSearchParams — must be inside <Suspense>.
 * Next.js 14 requires any component calling useSearchParams() to be wrapped
 * in a Suspense boundary to allow static prerendering of the page shell.
 */
function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultRole = (searchParams.get('role') ?? 'CONSUMER') as RegisterForm['role'];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

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
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display text-3xl mb-4">Check your email</h1>
          <p className="font-ui text-brand-muted">
            We&apos;ve sent a verification link to your email address. Please verify to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-light mb-2">Create your account</h1>
          <p className="font-ui text-brand-muted">Join thousands of artisans and buyers on ALMS</p>
        </div>

        {serverError && (
          <div
            className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-ui text-sm"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Role selector */}
          <div>
            <label htmlFor="role" className="block text-sm font-ui font-medium text-brand-text mb-1">
              I am a
            </label>
            <select
              id="role"
              {...register('role')}
              className="w-full px-4 py-3 rounded-lg border font-ui text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
              style={{ borderColor: errors.role ? '#ef4444' : '#D1C4B0', background: 'white' }}
              aria-describedby={errors.role ? 'role-error' : undefined}
            >
              <option value="CONSUMER">Consumer (individual buyer)</option>
              <option value="ARTISAN">Artisan (craftsperson)</option>
              <option value="BUYER">Buyer (B2B / business)</option>
            </select>
            {errors.role && (
              <p id="role-error" className="mt-1 text-sm text-red-600 font-ui">{errors.role.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-ui font-medium text-brand-text mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-lg border font-ui focus:outline-none focus:ring-2 focus:ring-brand-accent"
              style={{ borderColor: errors.email ? '#ef4444' : '#D1C4B0' }}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 font-ui">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-ui font-medium text-brand-text mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-lg border font-ui focus:outline-none focus:ring-2 focus:ring-brand-accent"
              style={{ borderColor: errors.password ? '#ef4444' : '#D1C4B0' }}
              aria-describedby={errors.password ? 'password-error' : 'password-hint'}
              aria-invalid={!!errors.password}
            />
            <p id="password-hint" className="mt-1 text-xs text-brand-muted font-ui">
              Min 12 chars, upper &amp; lowercase, digit, and special character
            </p>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600 font-ui">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-ui font-medium text-brand-text mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full px-4 py-3 rounded-lg border font-ui focus:outline-none focus:ring-2 focus:ring-brand-accent"
              style={{ borderColor: errors.confirmPassword ? '#ef4444' : '#D1C4B0' }}
              aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p id="confirm-error" className="mt-1 text-sm text-red-600 font-ui">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg text-white font-ui font-medium transition-all
              hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'var(--color-accent)' }}
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center mt-6 font-ui text-sm text-brand-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: 'var(--color-accent)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

/** Page shell — wraps the form in Suspense so Next.js can statically render the page boundary. */
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--color-bg-primary)' }}
        >
          <p className="font-ui text-brand-muted">Loading…</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
