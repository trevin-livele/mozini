'use client';

import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '@/lib/actions/admin';
import { formatPrice } from '@/lib/data';
import type { Order, Profile } from '@/lib/supabase/types';

const STATUSES = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  dispatched: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 10;

export default function AdminOrders() {
  const [allOrders, setAllOrders] = useState<(Order & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setAllOrders(data);
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const totalPages = Math.ceil(allOrders.length / PAGE_SIZE);
  const orders = allOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = async (orderId: string, status: string) => {
    const result = await updateOrderStatus(orderId, status);
    if (result.error) {
      alert(result.error);
    } else {
      if (result.notifyLink) {
        window.open(result.notifyLink, '_blank');
      }
      loadOrders();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{allOrders.length} total</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--copper)] rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.shipping_name}</p>
                      <p className="text-xs text-gray-500">{o.shipping_email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs border-0 cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y">
              {orders.map((o) => (
                <div key={o.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{o.shipping_name}</p>
                      <p className="text-xs text-gray-500 truncate">{o.shipping_email}</p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">{formatPrice(o.total)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-gray-400">#{o.id.slice(0, 8)}</span>
                      <span className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</span>
                    </div>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs border-0 cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-40">← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded text-sm font-medium ${p === page ? 'bg-[var(--copper)] text-white' : 'border hover:bg-gray-50'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
