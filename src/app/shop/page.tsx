'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { products, categories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  let filtered = [...products];
  
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  }
  
  const min = parseInt(priceMin) || 0;
  const max = parseInt(priceMax) || Infinity;
  filtered = filtered.filter(p => p.price >= min && p.price <= max);
  
  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="mb-8">
          <h3 className="text-[15px] font-semibold text-[var(--dark)] mb-4 pb-2.5 border-b-2 border-[var(--copper)]">Categories</h3>
          {categories.map(cat => (
            <label key={cat.name} className="flex items-center gap-2.5 py-1.5 text-sm cursor-pointer hover:text-[var(--copper)] transition-colors">
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="w-4 h-4 accent-[var(--copper)]"
              />
              {cat.name} ({cat.count})
            </label>
          ))}
        </div>
        
        <div className="mb-8">
          <h3 className="text-[15px] font-semibold text-[var(--dark)] mb-4 pb-2.5 border-b-2 border-[var(--copper)]">Price Range (KES)</h3>
          <div className="flex gap-2.5 items-center">
            <input 
              type="number" 
              placeholder="Min" 
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
            />
            <span className="text-[var(--text-light)]">—</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
            />
          </div>
        </div>
      </aside>

      {/* Products */}
      <div>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)]">
          <div className="text-sm text-[var(--text-light)]">Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded text-sm text-[var(--text)]"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-5 opacity-60">🔍</div>
            <h2 className="font-serif text-2xl text-[var(--dark)] mb-3">No Products Found</h2>
            <p className="text-[var(--text-light)] mb-7">Try adjusting your filters</p>
            <button 
              onClick={() => { setSelectedCategories([]); setPriceMin(''); setPriceMax(''); }}
              className="bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Our Collection</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Shop
          </div>
        </div>
      </div>

      <div className="py-10 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <ShopContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
