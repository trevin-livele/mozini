'use client';

import { useState, useEffect } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '@/lib/actions/admin';
import { formatPrice } from '@/lib/data';
import { getCategoryNames } from '@/lib/actions/categories';
import type { Product } from '@/lib/supabase/types';

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const loadProducts = async (p = page) => {
    setLoading(true);
    try {
      const data = await getAdminProducts({ page: p, limit: PAGE_SIZE, search: searchText || undefined, category: filterCategory || undefined });
      setProducts(data.products);
      setTotal(data.total);
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadProducts(page); }, [page, searchText, filterCategory]);
  useEffect(() => { getCategoryNames().then(setCategoryNames).catch(() => {}); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // If an image file was selected, convert to base64 data URL for storage
    if (imageFile) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
      formData.set('imageUrl', dataUrl);
    }

    const result = editing
      ? await updateProduct(editing.id, formData)
      : await createProduct(formData);

    if (result.error) {
      alert(result.error);
    } else {
      setShowForm(false);
      setEditing(null);
      setImageFile(null);
      setImagePreview(null);
      loadProducts(page);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    const result = await deleteProduct(id);
    if (result.error) alert(result.error);
    else loadProducts(page);
  };

  const openForm = (product?: Product) => {
    setEditing(product || null);
    setImageFile(null);
    setImagePreview(product?.image_url || null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total</p>
        </div>
        <button onClick={() => openForm()} className="bg-[var(--copper)] text-white px-4 py-2 rounded-lg hover:opacity-90">
          + Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[var(--copper)] focus:outline-none"
        />
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[var(--copper)] focus:outline-none"
        >
          <option value="">All Categories</option>
          {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" defaultValue={editing?.name} placeholder="Name" required className="w-full border rounded px-3 py-2" />
              <input name="brand" defaultValue={editing?.brand || 'Mozini'} placeholder="Brand" className="w-full border rounded px-3 py-2" />
              <select name="category" defaultValue={editing?.category} required className="w-full border rounded px-3 py-2">
                <option value="">Select Category</option>
                {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" defaultValue={editing?.price} placeholder="Price (KES)" required className="border rounded px-3 py-2" />
                <input name="oldPrice" type="number" defaultValue={editing?.old_price} placeholder="Old Price" className="border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="icon" defaultValue={editing?.icon || '🎁'} placeholder="Icon (emoji)" className="border rounded px-3 py-2" />
                <input name="stock" type="number" defaultValue={editing?.stock ?? 100} placeholder="Stock" className="border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                {imagePreview && (
                  <div className="mt-2 w-20 h-20 rounded border overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input type="hidden" name="imageUrl" defaultValue={editing?.image_url || ''} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="badge" defaultValue={editing?.badge} placeholder="Badge (e.g. sale, hot)" className="border rounded px-3 py-2" />
                <input name="tag" defaultValue={editing?.tag} placeholder="Tag (e.g. featured, new, best)" className="border rounded px-3 py-2" />
              </div>
              <textarea name="description" defaultValue={editing?.description} placeholder="Description" rows={3} className="w-full border rounded px-3 py-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" value="true" defaultChecked={editing?.is_active ?? true} />
                <span>Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[var(--copper)] text-white py-2 rounded-lg hover:opacity-90">Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(null); }} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xl">{p.icon}</span>}
                        </div>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openForm(p)} className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y">
              {products.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-2xl">{p.icon}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.brand} · {p.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                        <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {p.is_active ? 'Active' : 'Off'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={() => openForm(p)} className="text-blue-600 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 text-xs font-medium">Delete</button>
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
