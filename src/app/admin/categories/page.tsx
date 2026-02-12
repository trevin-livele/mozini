'use client';

import { useState, useEffect } from 'react';
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  type CategoryRow,
} from '@/lib/actions/categories';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', icon: '', image_url: '', sort_order: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', parent_id: '', icon: '🛍️', image_url: '', sort_order: '0' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setCategories(await getAllCategories()); } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleAdd = async () => {
    if (!newCat.name || !newCat.slug) { flash('Error: Name and slug are required'); return; }
    setSaving(true);
    const result = await addCategory({
      name: newCat.name,
      slug: newCat.slug,
      parent_id: newCat.parent_id ? parseInt(newCat.parent_id) : null,
      icon: newCat.icon || '🛍️',
      image_url: newCat.image_url || null,
      sort_order: parseInt(newCat.sort_order) || 0,
    });
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Category added!'); setNewCat({ name: '', slug: '', parent_id: '', icon: '🛍️', image_url: '', sort_order: '0' }); setShowAdd(false); await load(); }
    setSaving(false);
  };

  const handleSaveEdit = async (id: number) => {
    setSaving(true);
    const result = await updateCategory(id, {
      name: editForm.name,
      icon: editForm.icon,
      image_url: editForm.image_url || null,
      sort_order: editForm.sort_order,
    });
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Updated!'); setEditingId(null); await load(); }
    setSaving(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}" and all its children?`)) return;
    const result = await deleteCategory(id);
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Deleted!'); await load(); }
  };

  const handleToggle = async (c: CategoryRow) => {
    await updateCategory(c.id, { is_active: !c.is_active });
    await load();
  };

  // Build tree for display
  const buildDisplayTree = (parentId: number | null, depth: number): (CategoryRow & { depth: number })[] => {
    const filtered = categories.filter((c) => c.parent_id === parentId);
    const result: (CategoryRow & { depth: number })[] = [];
    for (const c of filtered) {
      result.push({ ...c, depth });
      result.push(...buildDisplayTree(c.id, depth + 1));
    }
    return result;
  };

  const treeRows = buildDisplayTree(null, 0);
  const filteredRows = filter
    ? treeRows.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()) || c.slug.toLowerCase().includes(filter.toLowerCase()))
    : treeRows;

  // Auto-generate slug from name
  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (loading) return <div className="py-10 text-center text-gray-500">Loading categories...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} total</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search..." value={filter} onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:outline-none w-48" />
          <button onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
            {showAdd ? 'Cancel' : '+ Add Category'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>
      )}

      {showAdd && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name *</label>
              <input placeholder="e.g. Gents Watches" value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value, slug: autoSlug(e.target.value) })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Slug *</label>
              <input placeholder="gents-watches" value={newCat.slug}
                onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Parent Category</label>
              <select value={newCat.parent_id} onChange={(e) => setNewCat({ ...newCat, parent_id: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                <option value="">None (top-level)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{'—'.repeat(buildDisplayTree(null, 0).find((r) => r.id === c.id)?.depth || 0)} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Icon</label>
              <input placeholder="🛍️" value={newCat.icon}
                onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Image URL</label>
              <input placeholder="/images/..." value={newCat.image_url}
                onChange={(e) => setNewCat({ ...newCat, image_url: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sort Order</label>
              <div className="flex gap-2">
                <input type="number" value={newCat.sort_order}
                  onChange={(e) => setNewCat({ ...newCat, sort_order: e.target.value })}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm" />
                <button onClick={handleAdd} disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {saving ? '...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5 w-20">Icon</th>
              <th className="px-4 py-2.5 w-20">Order</th>
              <th className="px-4 py-2.5 w-16">Active</th>
              <th className="px-4 py-2.5 w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((c) => (
              <tr key={c.id} className={`border-t border-gray-100 ${!c.is_active ? 'opacity-50' : ''}`}>
                <td className="px-4 py-2.5">
                  {editingId === c.id ? (
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-full" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-300">{'│ '.repeat(c.depth)}</span>
                      {c.image_url && <img src={c.image_url} alt="" className="w-6 h-6 rounded object-cover" />}
                      <span className="text-gray-800 font-medium">{c.name}</span>
                      <span className="text-xs text-gray-400 ml-1">/{c.slug}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {editingId === c.id ? (
                    <input value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-14" />
                  ) : (
                    <span className="text-lg">{c.icon}</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {editingId === c.id ? (
                    <input type="number" value={editForm.sort_order}
                      onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-14" />
                  ) : (
                    <span className="text-gray-500">{c.sort_order}</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={() => handleToggle(c)}
                    className={`w-8 h-5 rounded-full transition-colors relative ${c.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                    aria-label={c.is_active ? 'Deactivate' : 'Activate'}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${c.is_active ? 'left-3.5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-2.5 text-right">
                  {editingId === c.id ? (
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => handleSaveEdit(c.id)} disabled={saving}
                        className="px-2.5 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50">Save</button>
                      <button onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => { setEditingId(c.id); setEditForm({ name: c.name, icon: c.icon, image_url: c.image_url || '', sort_order: c.sort_order }); }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">Edit</button>
                      <button onClick={() => handleDelete(c.id, c.name)}
                        className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRows.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            {filter ? 'No categories match your search.' : 'No categories yet. Click "+ Add Category" to get started.'}
          </div>
        )}
      </div>
    </div>
  );
}
