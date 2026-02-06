import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/actions/auth';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect('/login?redirectTo=/profile');

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">My Profile</h1>
        </div>
      </div>
      <div className="py-12 pb-20">
        <div className="max-w-lg mx-auto px-5">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </>
  );
}
