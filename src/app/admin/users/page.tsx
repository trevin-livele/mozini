'use client';

import { useState, useEffect } from 'react';
import { getAdminUsers, updateUserRole } from '@/lib/actions/admin';
import type { Profile } from '@/lib/supabase/types';

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId: string, role: 'customer' | 'admin' | 'super_admin') => {
    if (!confirm(`Change this user's role to ${role}?`)) return;
    const result = await updateUserRole(userId, role);
    if (result.error) alert(result.error);
    else loadUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--copper)] rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading users...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop table */}
          <table className="w-full text-sm hidden md:table">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">City</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.full_name || 'No name'}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">{u.phone || '-'}</td>
                  <td className="px-4 py-3">{u.city || '-'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as 'customer' | 'admin' | 'super_admin')}
                      className={`px-2 py-1 rounded text-xs border-0 cursor-pointer ${u.role === 'super_admin' ? 'bg-red-100 text-red-700' : u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y">
            {users.map((u) => (
              <div key={u.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{u.full_name || 'No name'}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as 'customer' | 'admin' | 'super_admin')}
                    className={`px-2 py-1 rounded text-xs border-0 cursor-pointer shrink-0 ${u.role === 'super_admin' ? 'bg-red-100 text-red-700' : u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  {u.phone && <span>📞 {u.phone}</span>}
                  {u.city && <span>📍 {u.city}</span>}
                  <span>{new Date(u.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
