'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '🛒' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/messages', label: 'Messages', icon: '💬' },
  { href: '/admin/broadcast', label: 'Broadcast', icon: '📢' },
  { href: '/admin/delivery-zones', label: 'Delivery Zones', icon: '🗺️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirectTo=/admin');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[var(--dark)] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-base md:text-lg whitespace-nowrap">Mozini Admin</Link>
            {/* Desktop nav */}
            <div className="hidden md:flex gap-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-white/15 text-white'
                      : 'hover:text-[var(--copper)] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs md:text-sm hover:text-[var(--copper)] transition-colors whitespace-nowrap">← Store</Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5"
              aria-label="Admin menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-2 pb-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-white/15 text-white'
                    : 'hover:bg-white/5 text-white/80'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">{children}</main>
    </div>
  );
}
