'use client';

import { useState, useEffect } from 'react';
import {
  getAllCollections, createCollection, updateCollection, deleteCollection,
  addProductToCollection, removeProductFromCollection,
  type CollectionWithProducts,
} from '@/lib/actions/collections';
import { getAdminProducts } from '@/lib/actions/admin';
import type { Product } from '@/lib/supabase/types';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionWithProducts[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newCol, setNewCol] = useState({ name: '', description: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState('');

  const load = async () => {
    try {
      const [cols, prods] = await Promise.all([
        getAllCollections(),
        getAdminProducts({ limit: 500 }),
      ]);
      setCollections(cols);
      setProducts(prods.products);
    } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleAdd = async () => {
    if (!newCol.name) { flash('Error: Name is required'); return; }
    setSaving(true);
    const result = await createCollection(newCol);
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Collection created!'); setNewCol({ name: '', description: '', image_url: '' }); setShowAdd(false); await load(); }
    setSaving(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const result = await deleteCollection(id);
    if (result.error) flash(`Error: ${result.error}`);
    else { flash('Deleted!'); await load(); }
  };

  const handleToggle = async (c: CollectionWithProducts) => {
    await updateCollection(c.id, { is_active: !c.is_active });
    await load();
  };

  const handleAddProduct = async (collectionId: number, productId: number) => {
    const result = await addProductToCollection(collectionId, productId);
    if (result.error) flash(`Error: ${result.error}`);
    else await load();
  };

  const handleRemoveProduct = async (collectionId: number, productId: number) => {
    const result = await removeProductFromCollection(collectionId, productId);
    if (result.error) flash(`Error: ${result.error}`);
    else await load();
  };

  const filteredProducts = productSearch
    ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
    : products.slice(0, 20);

  if (loading) return <div className="py-10 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">e.g. Valentine&apos;s Day, Women&apos;s Day, Christmas</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
          {showAdd ? 'Cancel' : '+ New Collection'}
        </button>
      </div>

      {message && <div className={`mb-4 p-3 rounded text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}

      {showAdd && (
        <div className="mb-6 bg-white border rounded-lg p-5 space-y-3">
          <input placeholder="Collection name (e.g. Valentine's Day)" value={newCol.name} onChange={(e) => setNewCol({ ...newCol, name: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
          <input placeholder="Description (optional)" value={newCol.description} onChange={(e) => setNewCol({ ...newCol, description: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
          <input placeholder="Image URL (optional)" value={newCol.image_url} onChange={(e) => setNewCol({ ...newCol, image_url: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
          <button onClick={handleAdd} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">{saving ? '...' : 'Create'}</button>
        </div>
      )}

      <div className="space-y-4">
        {collections.map((col) => (
          <div key={col.id} className={`bg-white border rounded-lg overflow-hidden ${!col.is_active ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(expandedId === col.id ? null : col.id)}>
              <div>
                <h3 className="font-medium">{col.name}</h3>
                <p className="text-xs text-gray-500">{col.product_ids.length} products · {col.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleToggle(col); }} className={`w-8 h-5 rounded-full transition-colors relative ${col.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${col.is_active ? 'left-3.5' : 'left-0.5'}`} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(col.id, col.name); }} className="text-red-500 text-xs hover:underline">Delete</button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${expandedId === col.id ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>

            {expandedId === col.id && (
              <div className="border-t p-4">
                <div className="mb-3">
                  <input type="text" placeholder="Search products to add..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
                {productSearch && (
                  <div className="mb-4 max-h-40 overflow-y-auto border rounded">
                    {filteredProducts.filter(p => !col.product_ids.includes(p.id)).map(p => (
                      <button key={p.id} onClick={() => handleAddProduct(col.id, p.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between items-center border-b last:border-0">
                        <span>{p.name}</span>
                        <span className="text-green-600 text-xs">+ Add</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 mb-2">Products in this collection:</p>
                  {col.product_ids.length === 0 ? (
                    <p className="text-xs text-gray-400">No products yet. Search above to add.</p>
                  ) : (
                    col.product_ids.map(pid => {
                      const p = products.find(pr => pr.id === pid);
                      return p ? (
                        <div key={pid} className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded text-sm">
                          <span>{p.name}</span>
                          <button onClick={() => handleRemoveProduct(col.id, pid)} className="text-red-500 text-xs hover:underline">Remove</button>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {collections.length === 0 && <p className="text-center py-10 text-gray-400">No collections yet.</p>}
      </div>
    </div>
  );
}
