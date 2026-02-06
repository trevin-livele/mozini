import Link from 'next/link';
import { getOrders, type OrderWithItems } from '@/lib/actions/orders';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/actions/auth';

const formatPrice = (n: number) => 'KES ' + n.toLocaleString();

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function OrdersPage() {
  const user = await getUser();
  if (!user) redirect('/login?redirectTo=/orders');

  const orders = await getOrders();

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">My Orders</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Orders
          </div>
        </div>
      </div>

      <div className="py-12 pb-20">
        <div className="max-w-4xl mx-auto px-5">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-5 opacity-60">📦</div>
              <h2 className="font-serif text-2xl text-[var(--dark)] mb-3">No Orders Yet</h2>
              <p className="text-[var(--text-light)] mb-7">Start shopping to see your orders here.</p>
              <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border border-[var(--border)] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="text-xs text-[var(--text-light)]">Order #{order.id.slice(0, 8)}</div>
                      <div className="text-xs text-[var(--text-light)]">
                        {new Date(order.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>
                          {item.product_icon} {item.product_name} × {item.quantity}
                        </span>
                        <span className="text-[var(--copper)] font-medium">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--border)] pt-3 flex justify-between items-center">
                    <span className="text-sm text-[var(--text-light)]">Total</span>
                    <span className="text-lg font-semibold text-[var(--copper)]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
