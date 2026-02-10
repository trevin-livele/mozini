import { getAdminStats } from '@/lib/actions/admin';
import { formatPrice } from '@/lib/data';
import Link from 'next/link';

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, href: '/admin/products', color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, href: '/admin/orders', color: 'bg-green-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, href: '/admin/orders', color: 'bg-yellow-500' },
    { label: 'Total Users', value: stats.totalUsers, href: '/admin/users', color: 'bg-purple-500' },
    { label: 'Messages', value: `${stats.unreadMessages} unread`, href: '/admin/messages', color: 'bg-orange-500' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), href: '/admin/orders', color: 'bg-[var(--copper)]' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${card.color} rounded-lg mb-3`}></div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
