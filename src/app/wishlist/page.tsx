'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getWishlist } from '@/lib/actions/wishlist';
import { type Product } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getWishlist()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">My Wishlist</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Wishlist
          </div>
        </div>
      </div>

      <div className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          {loading ? (
            <div className="text-center py-20 text-[var(--text-light)]">Loading...</div>
          ) : !user ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-5 opacity-60">♡</div>
              <h2 className="font-serif text-2xl text-[var(--dark)] mb-3">Sign in to view your wishlist</h2>
              <p className="text-[var(--text-light)] mb-7">Your wishlist is saved to your account.</p>
              <Link href="/login?redirectTo=/wishlist" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
                Sign In
              </Link>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-5 opacity-60">♡</div>
              <h2 className="font-serif text-2xl text-[var(--dark)] mb-3">Your Wishlist is Empty</h2>
              <p className="text-[var(--text-light)] mb-7">Save favorites here to buy later.</p>
              <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
                Browse Collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
