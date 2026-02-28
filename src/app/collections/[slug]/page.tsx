'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCollectionProducts } from '@/lib/actions/collections';
import { toProductCompat } from '@/lib/supabase/types';
import ProductCard from '@/components/ProductCard';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollectionProducts(slug).then(setCollection).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--copper)] rounded-full animate-spin" />
      <p className="text-sm text-[var(--text-light)]">Loading collection...</p>
    </div>
  );
  if (!collection) return (
    <div className="text-center py-20">
      <h1 className="font-serif text-3xl text-[var(--dark)] mb-4">Collection Not Found</h1>
      <Link href="/collections" className="text-[var(--copper)] hover:underline">View All Collections</Link>
    </div>
  );

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">{collection.name}</h1>
          {collection.description && <p className="text-sm text-[var(--text-light)] mb-2">{collection.description}</p>}
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link>
            {' / '}
            <Link href="/collections" className="text-[var(--copper)] hover:underline">Collections</Link>
            {' / '}{collection.name}
          </div>
        </div>
      </div>
      <div className="py-10 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          {collection.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collection.products.map((p: any) => (
                <ProductCard key={p.id} product={toProductCompat(p)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[var(--text-light)]">No products in this collection yet.</p>
              <Link href="/shop" className="text-[var(--copper)] hover:underline mt-4 inline-block">Browse Shop</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
