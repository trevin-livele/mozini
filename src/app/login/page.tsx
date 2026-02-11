'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { signIn } from '@/lib/actions/auth';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('redirectTo', redirectTo);

    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      // Refresh server components so AuthProvider picks up the new session
      router.refresh();
      router.push(result.redirectTo || '/');
    }
  }

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Sign In</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Sign In
          </div>
        </div>
      </div>

      <div className="py-12 pb-20">
        <div className="max-w-md mx-auto px-5">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-[var(--border)]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--copper)] text-white py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-[var(--text-light)] mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--copper)] hover:underline">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
