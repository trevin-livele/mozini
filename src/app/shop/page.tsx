'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { type Product } from '@/lib/data';
import { getProducts, getCategories } from '@/lib/actions/products';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [priceMin, setPriceMin] = useState(minPriceParam || '');
  const [priceMax, setPriceMax] = useState(maxPriceParam || '');
  const [searchText, setSearchText] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const PAGE_SIZE = 12;

  useEffect(() => {
    if (categoryParam) setSelectedCategories([categoryParam]);
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) setSearchText(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (minPriceParam) setPriceMin(minPriceParam);
    if (maxPriceParam) setPriceMax(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  // Fetch categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    setLoading(true);
    const category = selectedCategories.length === 1 ? selectedCategories[0] : undefined;
    getProducts({ category, search: searchText || undefined, sortBy, page, limit: PAGE_SIZE })
      .then(({ products: p, total: t }) => {
        let filtered = p;
        // Client-side multi-category + price filtering
        if (selectedCategories.length > 1) {
          filtered = filtered.filter((pr) => selectedCategories.includes(pr.category));
        }
        const min = parseInt(priceMin) || 0;
        const max = parseInt(priceMax) || Infinity;
        filtered = filtered.filter((pr) => pr.price >= min && pr.price <= max);
        setProducts(filtered);
        setTotal(t);
      })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [selectedCategories, sortBy, page, priceMin, priceMax, searchText]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 lg:gap-10">
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--dark)] hover:border-[var(--copper)] transition-colors"
        >
          <span>🔍 Filters & Search</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="mb-6 lg:mb-8">
          <h3 className="text-sm lg:text-[15px] font-semibold text-[var(--dark)] mb-3 lg:mb-4 pb-2 lg:pb-2.5 border-b-2 border-[var(--copper)]">Search</h3>
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
            className="w-full px-3 py-2.5 lg:py-2 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] focus:outline-none transition-colors"
          />
        </div>
        <div className="mb-6 lg:mb-8">
          <h3 className="text-sm lg:text-[15px] font-semibold text-[var(--dark)] mb-3 lg:mb-4 pb-2 lg:pb-2.5 border-b-2 border-[var(--copper)]">Categories</h3>
          <div className="max-h-[200px] lg:max-h-none overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat.name} className="flex items-center gap-2.5 py-2 lg:py-1.5 text-sm cursor-pointer hover:text-[var(--copper)] transition-colors min-h-[44px] lg:min-h-0">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                  className="w-5 h-5 lg:w-4 lg:h-4 accent-[var(--copper)] flex-shrink-0"
                />
                <span className="flex-1">{cat.name} ({cat.count})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-6 lg:mb-8">
          <h3 className="text-sm lg:text-[15px] font-semibold text-[var(--dark)] mb-3 lg:mb-4 pb-2 lg:pb-2.5 border-b-2 border-[var(--copper)]">Price Range (KES)</h3>
          <div className="flex gap-2 lg:gap-2.5 items-center">
            <input type="number" placeholder="Min" value={priceMin} onChange={(e) => { setPriceMin(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 lg:py-2 border border-[var(--border)] rounded text-sm" />
            <span className="text-[var(--text-light)]">—</span>
            <input type="number" placeholder="Max" value={priceMax} onChange={(e) => { setPriceMax(e.target.value); setPage(1); }} className="w-full px-3 py-2.5 lg:py-2 border border-[var(--border)] rounded text-sm" />
          </div>
        </div>
      </aside>

      {/* Products */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
          <div className="text-sm text-[var(--text-light)]">
            {loading ? 'Loading...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
          </div>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="w-full sm:w-auto px-3 py-2.5 sm:py-2 border border-[var(--border)] rounded text-sm text-[var(--text)]">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--text-light)]">Loading products...</div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[44px] min-h-[44px] w-10 h-10 rounded text-sm font-medium transition-colors ${p === page ? 'bg-[var(--copper)] text-white' : 'border border-[var(--border)] text-[var(--text)] hover:border-[var(--copper)] hover:text-[var(--copper)]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-5 opacity-60">🔍</div>
            <h2 className="font-serif text-2xl text-[var(--dark)] mb-3">No Products Found</h2>
            <p className="text-[var(--text-light)] mb-7">Try adjusting your filters</p>
            <button onClick={() => { setSelectedCategories([]); setPriceMin(''); setPriceMax(''); setSearchText(''); setPage(1); }} className="bg-[var(--copper)] text-white px-6 sm:px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors min-h-[44px]">
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
