'use client';

import Link from 'next/link';
import { type Product, formatPrice, getCategoryIcon } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect, useRef } from 'react';
import { getProducts, getCategories } from '@/lib/actions/products';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeTab, setActiveTab] = useState('featured');
  const [heroIndex, setHeroIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const heroSlides = [
    { label: 'Valentine\'s Special 💝', title: 'Perfect Gifts for Your Loved One', desc: 'Watches · Perfumes · Gift Sets · Express Your Love', icon: '⌚', bg: 'linear-gradient(135deg,#f0dcc8,#e4ccb5,#d4b89e)' },
    { label: 'Love Collection 💕', title: 'Romantic Fragrances & Timepieces', desc: 'Premium quality · Beautiful packaging · Made with love', icon: '🧴', bg: 'linear-gradient(135deg,#e8d5c4,#dcc7b5,#c9b19e)' },
    { label: 'Special Offers ❤️', title: 'Valentine\'s Day Gift Sets', desc: 'Perfect combinations · Romantic packaging · Great value', icon: '🎁', bg: 'linear-gradient(135deg,#d8c8b8,#c9b5a2,#b8a18e)' },
  ];

  const [giftIndex, setGiftIndex] = useState(0);
  const giftSliderRef = useRef<HTMLDivElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch products when tab changes
  useEffect(() => {
    setLoadingProducts(true);
    getProducts({ tag: activeTab, limit: 8 })
      .then(({ products: p }) => setProducts(p))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [activeTab]);

  // Gift slides from first 6 products
  const giftSlides = products.slice(0, 6).map((p) => ({
    icon: p.icon,
    title: p.name,
    price: formatPrice(p.price),
  }));

  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const heroTimer = setInterval(() => setHeroIndex(prev => (prev + 1) % 3), 5000);
    const giftTimer = setInterval(() => {
      setGiftIndex(prev => (prev + 1) % Math.max(1, giftSlides.length));
    }, 3000);

    const createFloatingHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = ['❤️', '💕', '💖', '💝'][Math.floor(Math.random() * 4)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
      heart.style.animationDuration = (Math.random() * 5 + 10) + 's';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 20000);
    };
    const heartInterval = setInterval(createFloatingHeart, 3000);

    const ctx = gsap.context(() => {
      gsap.from('.hero-content', { opacity: 0, x: -50, duration: 1, ease: 'power3.out' });
      gsap.from('.category-item', {
        scrollTrigger: { trigger: categoriesRef.current, start: 'top 80%' },
        opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)'
      });
      gsap.from('.product-card', {
        scrollTrigger: { trigger: productsRef.current, start: 'top 80%' },
        opacity: 0, y: 50, stagger: 0.1, duration: 0.5, ease: 'power2.out'
      });
      gsap.from('.promo-card', {
        scrollTrigger: { trigger: '.promo-banners', start: 'top 80%' },
        opacity: 0, scale: 0.9, stagger: 0.2, duration: 0.6, ease: 'back.out(1.7)'
      });
      gsap.from('.feature-item', {
        scrollTrigger: { trigger: '.features-bar', start: 'top 80%' },
        opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: 'power2.out'
      });
    });

    return () => { clearInterval(heroTimer); clearInterval(giftTimer); clearInterval(heartInterval); ctx.revert(); };
  }, [activeTab, giftSlides.length]);

  return (
    <>
      <div className="floating-hearts" />

      {/* Hero */}
      <section ref={heroRef} className="relative h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden bg-[var(--bg-soft)]">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 flex items-center transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="hero-content relative z-10 px-5 md:pl-12 lg:pl-20 max-w-[90%] md:max-w-[500px]">
              <div className="font-serif text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase text-[var(--copper)] mb-2 md:mb-3 font-semibold">{slide.label}</div>
              <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--dark)] leading-tight mb-3 md:mb-4">{slide.title}</h1>
              <p className="text-xs md:text-sm text-[var(--text-light)] mb-5 md:mb-7 leading-relaxed">{slide.desc}</p>
              <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-6 md:px-8 py-2.5 md:py-3 rounded text-xs md:text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] hover:-translate-y-0.5 hover:shadow-lg transition-all">Shop Now</Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-[45%] md:w-[50%] lg:w-[55%] flex items-center justify-center" style={{ background: slide.bg }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-soft)] to-transparent z-10" style={{ width: '30%' }}></div>
              <span className="text-[80px] md:text-[120px] lg:text-[160px] opacity-20">{slide.icon}</span>
            </div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:shadow-md hover:text-[var(--copper)] transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-5 md:h-5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={nextSlide} className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:shadow-md hover:text-[var(--copper)] transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-5 md:h-5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-2.5 z-20">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)} className={`h-2 md:h-2.5 rounded-full transition-all ${i === heroIndex ? 'w-6 md:w-7 bg-[var(--copper)]' : 'w-2 md:w-2.5 bg-black/20'}`}></button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section ref={categoriesRef} className="py-12 md:py-16 text-center">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--dark)] mb-2 relative">Perfect Valentine's Gifts 💝</h2>
          <p className="text-sm text-[var(--text-light)] mb-8 md:mb-10">Show your love with our curated collection</p>
          <div className="flex justify-center gap-6 md:gap-9 flex-wrap">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-item text-center cursor-pointer transition-transform hover:-translate-y-1.5 group">
                <div className="w-[85px] h-[85px] md:w-[105px] md:h-[105px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mx-auto mb-2.5 md:mb-3.5 bg-white text-[36px] md:text-[42px] transition-all group-hover:border-[var(--copper)] group-hover:shadow-[0_0_0_4px_rgba(44,95,99,0.1)]">
                  {getCategoryIcon(cat.name)}
                </div>
                <div className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-[var(--dark)] mb-0.5">{cat.name}</div>
                <div className="text-[10px] md:text-[11px] text-[var(--text-light)]">({cat.count} Items)</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="promo-banners pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link href="/shop?category=Gents Watches" className="promo-card relative rounded-lg overflow-hidden h-[160px] md:h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[#3d3225] to-[#2a2118] text-white">
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[2px] mb-2 md:mb-2.5 opacity-70">For Him 💖</div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold leading-tight mb-3 md:mb-4">Premium Gents Watches</h3>
                <span className="inline-block text-[11px] md:text-xs font-medium uppercase tracking-wider px-4 md:px-5 py-1.5 md:py-2 border border-current rounded w-fit hover:bg-white hover:text-[var(--dark)] transition-colors">Shop Now</span>
              </div>
              <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-15">⌚</div>
            </Link>
            <Link href="/shop?category=Gifts" className="promo-card relative rounded-lg overflow-hidden h-[160px] md:h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[#f5e6d8] to-[#ecddd0] text-[var(--dark)]">
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[2px] mb-2 md:mb-2.5 opacity-70">Perfect Gifts 💕</div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold leading-tight mb-3 md:mb-4">Curated Gift Collections</h3>
                <span className="inline-block text-[11px] md:text-xs font-medium uppercase tracking-wider px-4 md:px-5 py-1.5 md:py-2 border border-current rounded w-fit hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-colors">Shop Now</span>
              </div>
              <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-15">🎁</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section ref={productsRef} className="py-6 md:py-8 pb-12 md:pb-16 text-center">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--dark)] mb-2 relative">Trending Love Gifts ❤️</h2>
          <p className="text-sm text-[var(--text-light)] mb-8 md:mb-10">Most loved by our customers</p>
          <div className="flex justify-center gap-4 md:gap-6 mb-7 md:mb-9 overflow-x-auto pb-2">
            {['featured', 'new', 'best'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xs md:text-sm font-medium uppercase tracking-wider pb-1.5 border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'text-[var(--copper)] border-[var(--copper)]' : 'text-[var(--text-light)] border-transparent hover:text-[var(--copper)]'}`}>
                {tab === 'featured' ? 'Featured' : tab === 'new' ? 'New Arrivals' : 'Best Seller'}
              </button>
            ))}
          </div>
          {loadingProducts ? (
            <div className="py-20 text-[var(--text-light)]">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner with Gift Slider */}
      <section className="relative h-[320px] md:h-[380px] lg:h-[420px] bg-gradient-to-br from-[#2a2118] via-[#3d3225] to-[#4a3d30] overflow-hidden">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#c9a882] to-[#b8956e] flex items-center justify-center overflow-hidden">
          <div ref={giftSliderRef} className="relative w-full h-full">
            {giftSlides.map((gift, i) => (
              <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === giftIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <span className="text-[80px] md:text-[100px] lg:text-[120px] mb-2">{gift.icon}</span>
                <span className="text-white/80 text-sm md:text-base font-medium text-center px-4">{gift.title}</span>
                <span className="text-white/60 text-xs md:text-sm mt-1">{gift.price}</span>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {giftSlides.map((_, i) => (
                <button key={i} onClick={() => setGiftIndex(i)} className={`h-1.5 rounded-full transition-all ${i === giftIndex ? 'w-5 bg-white/80' : 'w-1.5 bg-white/30'}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-5 h-full flex items-center">
          <div className="ml-[50%] md:ml-[55%] text-white relative z-10">
            <div className="font-serif text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase text-[var(--copper-light)] mb-2 md:mb-3 italic">Valentine&apos;s Day Special 💕</div>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-2.5 md:mb-3.5">Celebrate Love with Perfect Gifts</h2>
            <p className="text-xs md:text-sm text-white/70 mb-5 md:mb-7">Watches · Perfumes · Gift Sets</p>
            <Link href="/shop" className="inline-block bg-[var(--copper)] text-white px-6 md:px-8 py-2.5 md:py-3 rounded text-xs md:text-sm font-medium uppercase tracking-wider border-2 border-[var(--copper)] hover:bg-[var(--copper-dark)] hover:border-[var(--copper-dark)] transition-all">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-bar py-12 md:py-16 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
            <div className="feature-item flex flex-col items-center gap-3 md:gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-3xl md:text-4xl">🚚</span>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Nationwide Shipping</div>
              <div className="text-xs md:text-sm text-[var(--text-light)] max-w-[260px]">Free delivery across Kenya for orders above KES 10,000.</div>
            </div>
            <div className="feature-item flex flex-col items-center gap-3 md:gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-3xl md:text-4xl">🎁</span>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Gift Wrapping</div>
              <div className="text-xs md:text-sm text-[var(--text-light)] max-w-[260px]">Beautiful packaging for all Valentine's orders.</div>
            </div>
            <div className="feature-item flex flex-col items-center gap-3 md:gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-3xl md:text-4xl">🛡️</span>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Money Back Guarantee</div>
              <div className="text-xs md:text-sm text-[var(--text-light)] max-w-[260px]">100% money back guarantee on all our products.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
