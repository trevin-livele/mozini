'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategoryTree, type CategoryTree } from '@/lib/actions/categories';
import { getCollections, type Collection } from '@/lib/actions/collections';
import { CATEGORIES as FALLBACK_CATEGORIES } from '@/lib/data';

export default function CollectionsPage() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCategoryTree()
        .then((tree) => {
          if (tree.length > 0) setCategories(tree);
          else setCategories(FALLBACK_CATEGORIES.map((c) => ({
            id: 0, name: c.name, slug: c.name, icon: c.icon, image_url: c.image || null, sort_order: 0,
            children: c.subcategories?.map((s) => ({ id: 0, name: s.name, slug: s.name, icon: c.icon, image_url: s.image || null, sort_order: 0, children: [] })) || [],
          })));
        })
        .catch(() => {}),
      getCollections().then(setCollections).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Our Collections</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Collections
          </div>
        </div>
      </div>
      <div className="py-10 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--copper)] rounded-full animate-spin" />
              <p className="text-sm text-[var(--text-light)]">Loading collections...</p>
            </div>
          ) : (
            <>
          {collections.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-[var(--dark)] mb-6 text-center">Special Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col) => (
                  <Link key={col.id} href={`/collections/${col.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-white hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="h-48 bg-[var(--bg-soft)] flex items-center justify-center overflow-hidden">
                      {col.image_url ? (
                        <img src={col.image_url} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <span className="text-6xl transition-transform duration-500 group-hover:scale-125">🏷️</span>
                      )}
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-serif text-xl text-[var(--dark)] mb-1">{col.name}</h3>
                      {col.description && <p className="text-xs text-[var(--text-light)]">{col.description}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-serif text-2xl text-[var(--dark)] mb-6 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-white hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="h-48 bg-[var(--bg-soft)] flex items-center justify-center overflow-hidden">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span className="text-6xl transition-transform duration-500 group-hover:scale-125">{cat.icon}</span>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-serif text-xl text-[var(--dark)] mb-1">{cat.name}</h3>
                  {cat.children && cat.children.length > 0 && (
                    <p className="text-xs text-[var(--text-light)]">{cat.children.length} subcategories</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
