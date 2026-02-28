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
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);

  const load = async () => {
    try { setCategories(await getAllCategories()); } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const openAdd = () => {
    setEditing(null);
    setFormName('');
    setFormImage(null);
    setFormImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (c: CategoryRow) => {
    setEditing(c);
    setFormName(c.name);
    setFormImage(null);
    setFormImagePreview(c.image_url || null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSubmit = async () => {
    if (!formName.trim()) { flash('Error: Name is required'); return; }
    setSaving(true);
    let imageUrl: string | null | undefined = undefined;
    if (formImage) imageUrl = await toBase64(formImage);

    if (editing) {
      const updates: Record<string, any> = { name: formName.trim() };
      if (imageUrl !== undefined) updates.image_url = imageUrl;
      const result = await updateCategory(editing.id, updates);
      if (result.error) flash(`Error: ${result.error}`);
      else { flash('Updated!'); closeForm(); await load(); }
    } else {
      const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const result = await addCategory({ name: formName.trim(), slug, parent_id: null, icon: '', image_url: imageUrl ?? null, sort_order: 0 });
      if (result.error) flash(`Error: ${result.error}`);
      else { flash('Category added!'); closeForm(); await load(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const result = await deleteCategory(id);
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Deleted!'); await load(); }
  };

  const handleToggle = async (c: CategoryRow) => {
    await updateCategory(c.id, { is_active: !c.is_active });
    await load();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFormImage(f); setFormImagePreview(URL.createObjectURL(f)); }
  };

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const topLevel = categories.filter(c => c.parent_id === null);
  const totalPages = Math.ceil(topLevel.length / PAGE_SIZE);
  const paged = topLevel.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="py-10 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{topLevel.length} total</p>
        </div>
        <button onClick={openAdd} className="bg-[var(--copper)] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm">+ Add Category</button>
      </div>

      {message && <div className={`mb-4 p-3 rounded text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-5">{editing ? 'Edit Category' : 'New Category'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Gents Watches" className="w-full px-3 py-2.5 border rounded-lg text-sm focus:border-[var(--copper)] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                {formImagePreview && (
                  <div className="mt-3 relative inline-block">
                    <img src={formImagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border" />
                    <button type="button" onClick={() => { setFormImage(null); setFormImagePreview(null); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-[var(--copper)] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Category'}</button>
                <button onClick={closeForm} className="flex-1 border py-2.5 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className={`border-b hover:bg-gray-50 ${!c.is_active ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {c.image_url ? <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" /> : <span className="text-gray-300 text-lg">📷</span>}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(c)} className={`w-8 h-5 rounded-full transition-colors relative ${c.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${c.is_active ? 'left-3.5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {topLevel.length === 0 && <div className="text-center py-12 text-gray-400">No categories yet.</div>}
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
    </div>
  );
}
