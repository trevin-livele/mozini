'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signUp } from '@/lib/actions/auth';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.message || 'Account created! Check your email.');
    }
    setLoading(false);
  }

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Create Account</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Sign Up
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
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]"
                placeholder="John Doe"
              />
            </div>

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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-[var(--text-light)] mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--copper)] hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
