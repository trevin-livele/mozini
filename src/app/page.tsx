'use client';

import Link from 'next/link';
import { products, categories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('featured');
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    { label: 'Best of the Best', title: 'Premium Watches Collection', desc: 'Elegant timepieces · Classic designs · Modern style', icon: '⌚', bg: 'linear-gradient(135deg,#f0dcc8,#e4ccb5,#d4b89e)' },
    { label: 'New Arrivals', title: 'Luxury Perfumes & Fragrances', desc: 'Long-lasting scents · Premium quality · Gift ready', icon: '🧴', bg: 'linear-gradient(135deg,#e8d5c4,#dcc7b5,#c9b19e)' },
    { label: 'Special Offers', title: 'Gift Sets for Every Occasion', desc: 'Perfect combinations · Beautiful packaging · Great value', icon: '🎁', bg: 'linear-gradient(135deg,#d8c8b8,#c9b5a2,#b8a18e)' },
  ];

  const filteredProducts = products.filter(p => p.tag === activeTab).slice(0, 8);

  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[480px] overflow-hidden bg-[var(--bg-soft)]">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 flex items-center transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="relative z-10 pl-20 max-w-[500px]">
              <div className="font-serif text-sm tracking-[3px] uppercase text-[var(--copper)] mb-3 font-semibold">{slide.label}</div>
              <h1 className="font-serif text-5xl font-bold text-[var(--dark)] leading-tight mb-4">{slide.title}</h1>
              <p className="text-sm text-[var(--text-light)] mb-7 leading-relaxed">{slide.desc}</p>
              <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] hover:-translate-y-0.5 hover:shadow-lg transition-all">
                Shop Now
              </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-[55%] flex items-center justify-center" style={{ background: slide.bg }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-soft)] to-transparent z-10" style={{ width: '30%' }}></div>
              <span className="text-[160px] opacity-20">{slide.icon}</span>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:shadow-md hover:text-[var(--copper)] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:shadow-md hover:text-[var(--copper)] transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)} className={`h-2.5 rounded-full transition-all ${i === heroIndex ? 'w-7 bg-[var(--copper)]' : 'w-2.5 bg-black/20'}`}></button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-serif text-3xl font-semibold text-[var(--dark)] mb-10 relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--copper)] after:mx-auto after:mt-3">
            Popular Categories
          </h2>
          <div className="flex justify-center gap-9 flex-wrap">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="text-center cursor-pointer transition-transform hover:-translate-y-1.5 group">
                <div className="w-[105px] h-[105px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mx-auto mb-3.5 bg-white text-[42px] transition-all group-hover:border-[var(--copper)] group-hover:shadow-[0_0_0_4px_rgba(44,95,99,0.1)]">
                  {cat.icon}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--dark)] mb-0.5">{cat.name}</div>
                <div className="text-[11px] text-[var(--text-light)]">({cat.count} Items)</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/shop?category=Men's Watches" className="relative rounded-lg overflow-hidden h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[#3d3225] to-[#2a2118] text-white">
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <div className="text-[11px] uppercase tracking-[2px] mb-2.5 opacity-70">Special Offer</div>
                <h3 className="font-serif text-2xl font-semibold leading-tight mb-4">Premium Men&apos;s Watches</h3>
                <span className="inline-block text-xs font-medium uppercase tracking-wider px-5 py-2 border border-current rounded w-fit hover:bg-white hover:text-[var(--dark)] transition-colors">Shop Now</span>
              </div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[80px] opacity-15">⌚</div>
            </Link>
            <Link href="/shop?category=Women's Perfumes" className="relative rounded-lg overflow-hidden h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[#f5e6d8] to-[#ecddd0] text-[var(--dark)]">
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <div className="text-[11px] uppercase tracking-[2px] mb-2.5 opacity-70">New Collection</div>
                <h3 className="font-serif text-2xl font-semibold leading-tight mb-4">Luxury Fragrances</h3>
                <span className="inline-block text-xs font-medium uppercase tracking-wider px-5 py-2 border border-current rounded w-fit hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-colors">Shop Now</span>
              </div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[80px] opacity-15">🌸</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-8 pb-16 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-serif text-3xl font-semibold text-[var(--dark)] mb-10 relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-[var(--copper)] after:mx-auto after:mt-3">
            Trending Products
          </h2>
          
          <div className="flex justify-center gap-6 mb-9">
            {['featured', 'new', 'best'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium uppercase tracking-wider pb-1.5 border-b-2 transition-all ${activeTab === tab ? 'text-[var(--copper)] border-[var(--copper)]' : 'text-[var(--text-light)] border-transparent hover:text-[var(--copper)]'}`}
              >
                {tab === 'featured' ? 'Featured' : tab === 'new' ? 'New Arrivals' : 'Best Seller'}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative h-[380px] bg-gradient-to-br from-[#2a2118] via-[#3d3225] to-[#4a3d30] overflow-hidden">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#c9a882] to-[#b8956e] flex items-center justify-center text-[120px] opacity-30">
          🎁
        </div>
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center">
          <div className="ml-[55%] text-white relative z-10">
            <div className="font-serif text-sm tracking-[3px] uppercase text-[var(--copper-light)] mb-3 italic">Stand Out in Style</div>
            <h2 className="font-serif text-4xl font-semibold leading-tight mb-3.5">Perfect Gifts for Every Occasion</h2>
            <p className="text-sm text-white/70 mb-7">Watches · Perfumes · Gift Sets · Premium Packaging</p>
            <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider border-2 border-[var(--copper)] hover:bg-[var(--copper-dark)] hover:border-[var(--copper-dark)] transition-all">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-4xl">🚚</span>
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Nationwide Shipping</div>
              <div className="text-sm text-[var(--text-light)] max-w-[260px]">Free delivery across Kenya for orders above KES 10,000.</div>
            </div>
            <div className="flex flex-col items-center gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-4xl">🔄</span>
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Easy 30 Day Returns</div>
              <div className="text-sm text-[var(--text-light)] max-w-[260px]">Hassle-free returns within 30 days of purchase.</div>
            </div>
            <div className="flex flex-col items-center gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-4xl">🛡️</span>
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Money Back Guarantee</div>
              <div className="text-sm text-[var(--text-light)] max-w-[260px]">100% money back guarantee on all our products.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
