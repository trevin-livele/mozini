import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/actions/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  if (!admin) redirect('/login?redirectTo=/admin');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[var(--dark)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg">Mozini Admin</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/admin" className="hover:text-[var(--copper)] transition-colors">Dashboard</Link>
              <Link href="/admin/products" className="hover:text-[var(--copper)] transition-colors">Products</Link>
              <Link href="/admin/orders" className="hover:text-[var(--copper)] transition-colors">Orders</Link>
              <Link href="/admin/users" className="hover:text-[var(--copper)] transition-colors">Users</Link>
              <Link href="/admin/messages" className="hover:text-[var(--copper)] transition-colors">Messages</Link>
              <Link href="/admin/broadcast" className="hover:text-[var(--copper)] transition-colors">Broadcast</Link>
              <Link href="/admin/settings" className="hover:text-[var(--copper)] transition-colors">Settings</Link>
            </div>
          </div>
          <Link href="/" className="text-sm hover:text-[var(--copper)] transition-colors">← Back to Store</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
