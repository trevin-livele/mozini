'use client';

import Link from 'next/link';
import { type Product, formatPrice, getCategoryIcon, getCategoryImage } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect, useRef } from 'react';
import { getProducts, getCategories } from '@/lib/actions/products';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

/* ─── Hero Carousel Slides (main banner) ─── */
const heroSlides = [
  {
    image: '/images/curren/image00001.jpeg',
    label: "Valentine's Special 💝",
    title: 'Premium Watches for Him',
    desc: 'Curren · Naviforce · Poedagar — Bold timepieces that make a statement',
    cta: 'Shop Gents Watches',
    href: '/shop?category=Gents Watches',
    overlay: 'from-black/70 via-black/40 to-transparent',
  },
  {
    image: '/images/hannah-martin/image00001.jpeg',
    label: 'For Her 💕',
    title: 'Hannah Martin Collection',
    desc: 'Elegant ladies watches — the perfect Valentine\'s gift she\'ll treasure',
    cta: 'Shop Ladies Watches',
    href: '/shop?category=Hannah Martin',
    overlay: 'from-black/70 via-black/40 to-transparent',
  },
  {
    image: '/images/necklaces/image00001.jpeg',
    label: 'Jewelry ✨',
    title: 'Necklaces & Jewelry',
    desc: 'Beautiful necklaces, bracelets & accessories to express your love',
    cta: 'Shop Jewelry',
    href: '/shop?category=Jewelry',
    overlay: 'from-black/70 via-black/40 to-transparent',
  },
  {
    image: '/images/gift-cards/image00001.jpeg',
    label: 'Gift Ideas 🎁',
    title: 'His & Hers Gift Sets',
    desc: 'Curated Valentine\'s gift cards, personalized boxes & flower bouquets',
    cta: 'Shop Gifts',
    href: '/shop?category=Gifts',
    overlay: 'from-black/70 via-black/40 to-transparent',
  },
  {
    image: '/images/naviforce/image00001.jpeg',
    label: 'New Arrivals 🔥',
    title: 'Naviforce Watches',
    desc: 'Rugged, stylish & affordable — the watch brand everyone\'s talking about',
    cta: 'Shop Naviforce',
    href: '/shop?category=Naviforce',
    overlay: 'from-black/70 via-black/40 to-transparent',
  },
];

/* ─── Trending Now Product Carousel ─── */
function TrendingCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);
  const maxIndex = Math.max(0, products.length - perView);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  if (!products.length) return null;

  return (
    <section className="py-8 md:py-10 overflow-hidden border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 md:px-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-[var(--dark)]">🔥 Trending Now</h2>
          <div className="flex gap-2">
            <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0} className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--copper)] hover:text-[var(--copper)] transition-colors disabled:opacity-30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => setIndex((i) => Math.min(i + 1, maxIndex))} disabled={index >= maxIndex} className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--copper)] hover:text-[var(--copper)] transition-colors disabled:opacity-30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * (100 / perView)}%)` }}>
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 px-2" style={{ width: `${100 / perView}%` }}>
                <Link href={`/product/${product.id}`} className="block bg-white rounded-lg overflow-hidden border border-[var(--border)] hover:shadow-md transition-shadow group">
                  <div className="aspect-square bg-[var(--bg-soft)] flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-5xl">{product.icon}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[var(--text-light)] truncate">{product.brand}</p>
                    <p className="text-sm font-medium text-[var(--dark)] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[var(--copper)]">{formatPrice(product.price)}</span>
                      {product.oldPrice > 0 && <span className="text-xs text-[var(--text-light)] line-through">{formatPrice(product.oldPrice)}</span>}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [carouselProducts, setCarouselProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [giftIndex, setGiftIndex] = useState(0);
  const giftSliderRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchOccasion, setSearchOccasion] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchOccasion) params.set('category', searchOccasion);
    if (searchBudget) {
      const [min, max] = searchBudget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    router.push(`/shop?${params.toString()}`);
  };

  // Hero auto-advance
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch carousel products on mount
  useEffect(() => {
    getProducts({ tag: 'best', limit: 12 })
      .then(({ products: p }) => setCarouselProducts(p))
      .catch(() => {});
  }, []);

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

  const giftSlides = products.slice(0, 6).map((p) => ({
    icon: p.icon, image_url: p.image_url, title: p.name, price: formatPrice(p.price),
  }));

  // Animations & floating hearts
  useEffect(() => {
    const giftTimer = setInterval(() => {
      setGiftIndex((prev) => (prev + 1) % Math.max(1, giftSlides.length));
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
      gsap.from('.category-item', {
        scrollTrigger: { trigger: categoriesRef.current, start: 'top 80%' },
        opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)',
      });
      gsap.from('.product-card', {
        scrollTrigger: { trigger: productsRef.current, start: 'top 80%' },
        opacity: 0, y: 50, stagger: 0.1, duration: 0.5, ease: 'power2.out',
      });
      gsap.from('.promo-card', {
        scrollTrigger: { trigger: '.promo-banners', start: 'top 80%' },
        opacity: 0, scale: 0.9, stagger: 0.2, duration: 0.6, ease: 'back.out(1.7)',
      });
      gsap.from('.feature-item', {
        scrollTrigger: { trigger: '.features-bar', start: 'top 80%' },
        opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: 'power2.out',
      });
    });

    return () => { clearInterval(giftTimer); clearInterval(heartInterval); ctx.revert(); };
  }, [activeTab, giftSlides.length]);

  const nextHero = () => setHeroIndex((i) => (i + 1) % heroSlides.length);
  const prevHero = () => setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);

  return (
    <>
      <div className="floating-hearts" />

      {/* ═══════ HERO CAROUSEL — Full-width image slides ═══════ */}
      <section className="relative h-[420px] md:h-[500px] lg:h-[580px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-6xl mx-auto px-5 md:px-8 w-full">
                <div className="max-w-lg">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
                    {slide.label}
                  </span>
                  <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8 leading-relaxed max-w-md">
                    {slide.desc}
                  </p>
                  <Link
                    href={slide.href}
                    className="inline-block bg-[var(--copper)] text-white px-7 md:px-9 py-3 md:py-3.5 rounded-lg text-sm md:text-base font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Nav arrows */}
        <button onClick={prevHero} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={nextHero} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === heroIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-5 right-5 md:top-7 md:right-8 z-20 bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
          {heroIndex + 1} / {heroSlides.length}
        </div>
      </section>

      {/* ═══════ SEARCH / FILTER BAR ═══════ */}
      <section className="bg-white border-b border-[var(--border)] py-5 md:py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, gifts, jewelry..."
                className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:border-[var(--copper)] focus:outline-none transition-colors"
              />
            </div>
            <select
              value={searchOccasion}
              onChange={(e) => setSearchOccasion(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:border-[var(--copper)] focus:outline-none transition-colors"
            >
              <option value="">All Categories</option>
              <option value="Gents Watches">Gents Watches</option>
              <option value="Ladies Watches">Ladies Watches</option>
              <option value="Kids Watches">Kids Watches</option>
              <option value="Gifts">Gifts & Occasions</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Drinks & Candy">Drinks & Candy</option>
            </select>
            <select
              value={searchBudget}
              onChange={(e) => setSearchBudget(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:border-[var(--copper)] focus:outline-none transition-colors"
            >
              <option value="">Any Budget</option>
              <option value="0-2000">Under KES 2,000</option>
              <option value="2000-5000">KES 2,000 – 5,000</option>
              <option value="5000-10000">KES 5,000 – 10,000</option>
              <option value="10000-">Above KES 10,000</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--copper)] text-white rounded-lg text-sm font-medium hover:bg-[var(--copper-dark)] transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ═══════ TRENDING NOW — Product carousel ═══════ */}
      <TrendingCarousel products={carouselProducts} />

      {/* Categories */}
      <section ref={categoriesRef} className="py-12 md:py-16 text-center">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--dark)] mb-2 relative">Perfect Valentine&apos;s Gifts 💝</h2>
          <p className="text-sm text-[var(--text-light)] mb-8 md:mb-10">Show your love with our curated collection</p>
          <div className="flex justify-center gap-6 md:gap-9 flex-wrap">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-item text-center cursor-pointer transition-transform hover:-translate-y-1.5 group">
                <div className="w-[85px] h-[85px] md:w-[105px] md:h-[105px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mx-auto mb-2.5 md:mb-3.5 bg-white overflow-hidden transition-all group-hover:border-[var(--copper)] group-hover:shadow-[0_0_0_4px_rgba(44,95,99,0.1)]">
                  {getCategoryImage(cat.name) ? (
                    <img src={getCategoryImage(cat.name)} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[36px] md:text-[42px]">{getCategoryIcon(cat.name)}</span>
                  )}
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
              {getCategoryImage('Gents Watches') ? (
                <img src={getCategoryImage('Gents Watches')} alt="Gents Watches" className="absolute right-0 top-0 h-full w-[45%] object-cover opacity-30" />
              ) : (
                <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-15">⌚</div>
              )}
            </Link>
            <Link href="/shop?category=Hannah Martin" className="promo-card relative rounded-lg overflow-hidden h-[160px] md:h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[#f5e6d8] to-[#ecddd0] text-[var(--dark)]">
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[2px] mb-2 md:mb-2.5 opacity-70">For Her 💕</div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold leading-tight mb-3 md:mb-4">Hannah Martin Collection</h3>
                <span className="inline-block text-[11px] md:text-xs font-medium uppercase tracking-wider px-4 md:px-5 py-1.5 md:py-2 border border-current rounded w-fit hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-colors">Shop Now</span>
              </div>
              {getCategoryImage('Hannah Martin') ? (
                <img src={getCategoryImage('Hannah Martin')} alt="Hannah Martin" className="absolute right-0 top-0 h-full w-[45%] object-cover opacity-30" />
              ) : (
                <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-15">⌚</div>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products Grid */}
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
                <span className="text-[80px] md:text-[100px] lg:text-[120px] mb-2">
                  {gift.image_url ? (
                    <img src={gift.image_url} alt={gift.title} className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-contain rounded-lg" />
                  ) : (
                    gift.icon
                  )}
                </span>
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
            <p className="text-xs md:text-sm text-white/70 mb-5 md:mb-7">Watches · Jewelry · Flowers · Personalized Gifts</p>
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
              <div className="text-xs md:text-sm text-[var(--text-light)] max-w-[260px]">Fast & reliable delivery across Kenya.</div>
            </div>
            <div className="feature-item flex flex-col items-center gap-3 md:gap-3.5 transition-transform hover:-translate-y-1">
              <span className="text-3xl md:text-4xl">🎁</span>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[var(--dark)]">Gift Wrapping</div>
              <div className="text-xs md:text-sm text-[var(--text-light)] max-w-[260px]">Beautiful packaging for all Valentine&apos;s orders.</div>
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
