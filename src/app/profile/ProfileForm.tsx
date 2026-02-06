'use client';

import { useState } from 'react';
import { updateProfile, signOut } from '@/lib/actions/auth';
import type { Profile } from '@/lib/supabase/types';

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) setMessage(`Error: ${result.error}`);
    else setMessage('Profile updated!');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-[var(--border)]">
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Email</label>
        <input type="email" value={profile.email} disabled className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm bg-gray-50 text-[var(--text-light)]" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Full Name</label>
        <input type="text" name="fullName" defaultValue={profile.full_name || ''} className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Phone</label>
        <input type="tel" name="phone" defaultValue={profile.phone || ''} className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]" placeholder="+254..." />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Address</label>
        <input type="text" name="address" defaultValue={profile.address || ''} className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">City</label>
        <input type="text" name="city" defaultValue={profile.city || ''} className="w-full px-4 py-2.5 border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--copper)]" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="flex-1 bg-[var(--copper)] text-white py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => signOut()} className="px-6 py-3 rounded text-sm font-medium uppercase tracking-wider border-2 border-[var(--border)] text-[var(--text-light)] hover:border-[var(--copper)] hover:text-[var(--copper)] transition-colors">
          Sign Out
        </button>
      </div>
    </form>
  );
}
