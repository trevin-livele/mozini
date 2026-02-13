'use client';

import Link from 'next/link';
import { type Product, formatPrice, getCategoryIcon, getCategoryImage } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import { useState, useEffect, useRef } from 'react';
import { getProducts } from '@/lib/actions/products';
import { getCategoryTree, getTopLevelCategoriesWithCounts, type CategoryTree } from '@/lib/actions/categories';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Highlight of the Month ─── */
function HighlightOfTheMonth() {
  return (
    <section className="py-12 md:py-16 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 md:px-5">
        <div className="bg-gradient-to-br from-[var(--copper-pale)] to-white rounded-2xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Text Content - Left Side */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <div className="inline-block bg-[var(--copper)] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 w-fit uppercase tracking-wider">
                🎁 Highlight of the Month
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--dark)] mb-4 leading-tight">
                Free 2026 Desktop Calendar
              </h2>
              <p className="text-base md:text-lg text-[var(--text)] mb-6 leading-relaxed">
                Get a beautiful desktop calendar with every order this month! Stay organized in style while enjoying your favorite watches and gifts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-block bg-[var(--copper)] text-white px-8 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-all text-center min-h-[44px] flex items-center justify-center"
                >
                  Shop Now
                </Link>
                <Link
                  href="/faqs"
                  className="inline-block bg-white text-[var(--copper)] border-2 border-[var(--copper)] px-8 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-[var(--copper-pale)] transition-all text-center min-h-[44px] flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="relative h-[300px] md:h-auto min-h-[400px] bg-gradient-to-br from-[var(--copper-light)] to-[var(--copper)]">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img 
                  src="/images/calender.PNG" 
                  alt="2026 Desktop Calendar" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [activeTab, setActiveTab] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; icon: string; image_url: string | null; count: number }[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [giftIndex, setGiftIndex] = useState(0);
  const giftSliderRef = useRef<HTMLDivElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    getTopLevelCategoriesWithCounts().then(setCategories).catch(() => {});
    getCategoryTree().then(setCategoryTree).catch(() => {});
  }, []);

  // Build lookup maps from dynamic category tree
  const catImageMap: Record<string, string> = {};
  const catIconMap: Record<string, string> = {};
  const walkTree = (nodes: CategoryTree[]) => {
    for (const n of nodes) {
      if (n.image_url) catImageMap[n.name] = n.image_url;
      catIconMap[n.name] = n.icon;
      walkTree(n.children);
    }
  };
  walkTree(categoryTree);

  const dynGetImage = (name: string) => catImageMap[name] || getCategoryImage(name);
  const dynGetIcon = (name: string) => catIconMap[name] || getCategoryIcon(name);

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

  return (
    <>
      <div className="floating-hearts" />

      {/* ═══════ HERO CAROUSEL ═══════ */}
      <HeroCarousel />

      {/* ═══════ HIGHLIGHT OF THE MONTH ═══════ */}
      <HighlightOfTheMonth />

      {/* Categories */}
      <section ref={categoriesRef} className="pt-16 md:pt-20 pb-12 md:pb-16 text-center">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--dark)] mb-2 relative">Shop With Us</h2>
          <p className="text-sm text-[var(--text-light)] mb-8 md:mb-10">Show your love with our curated collection</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-item group">
                <div className="bg-white rounded-2xl border border-[var(--border)] p-4 pb-5 transition-all hover:shadow-lg hover:border-[var(--copper)]/30 hover:-translate-y-1">
                  <div className="relative mx-auto mb-4 -mt-8">
                    <div className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-2xl overflow-hidden mx-auto shadow-md border-2 border-white group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 bg-[var(--bg-soft)]">
                      {(cat.image_url || dynGetImage(cat.name)) ? (
                        <img src={cat.image_url || dynGetImage(cat.name)!} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-[36px] md:text-[42px]">{cat.icon || dynGetIcon(cat.name)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-[var(--dark)] mb-0.5">{cat.name}</div>
                  <div className="text-[10px] md:text-[11px] text-[var(--text-light)]">({cat.count} Items)</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="promo-banners pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link href="/shop?category=Gents Watches" className="promo-card relative rounded-lg overflow-hidden h-[160px] md:h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[var(--copper)] to-[var(--copper-dark)] text-white">
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[2px] mb-2 md:mb-2.5 opacity-70">For Him 💖</div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold leading-tight mb-3 md:mb-4">Premium Gents Watches</h3>
                <span className="inline-block text-[11px] md:text-xs font-medium uppercase tracking-wider px-4 md:px-5 py-1.5 md:py-2 border border-current rounded w-fit hover:bg-white hover:text-[var(--copper)] transition-colors">Shop Now</span>
              </div>
              {dynGetImage('Gents Watches') ? (
                <img src={dynGetImage('Gents Watches')} alt="Gents Watches" className="absolute right-0 top-0 h-full w-[45%] object-cover opacity-30" />
              ) : (
                <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-[60px] md:text-[80px] opacity-15">⌚</div>
              )}
            </Link>
            <Link href="/shop?category=Hannah Martin" className="promo-card relative rounded-lg overflow-hidden h-[160px] md:h-[200px] cursor-pointer transition-transform hover:scale-[1.015] bg-gradient-to-br from-[var(--copper-pale)] to-[var(--bg-soft)] text-[var(--dark)]">
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[2px] mb-2 md:mb-2.5 opacity-70">For Her 💕</div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold leading-tight mb-3 md:mb-4">Hannah Martin Collection</h3>
                <span className="inline-block text-[11px] md:text-xs font-medium uppercase tracking-wider px-4 md:px-5 py-1.5 md:py-2 border border-current rounded w-fit hover:bg-[var(--copper)] hover:text-white hover:border-[var(--copper)] transition-colors">Shop Now</span>
              </div>
              {dynGetImage('Hannah Martin') ? (
                <img src={dynGetImage('Hannah Martin')} alt="Hannah Martin" className="absolute right-0 top-0 h-full w-[45%] object-cover opacity-30" />
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
      <section className="relative bg-gradient-to-br from-[var(--copper-dark)] via-[var(--copper)] to-[var(--copper-light)] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Gift slider — full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2 h-[260px] md:h-[380px] lg:h-[420px] bg-gradient-to-br from-[var(--copper-light)] to-[var(--copper)] flex items-center justify-center overflow-hidden relative">
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
          {/* Text content — full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2 flex items-center px-6 md:px-10 lg:px-14 py-8 md:py-0">
            <div className="text-white">
              <div className="font-serif text-xs md:text-sm tracking-[2px] md:tracking-[3px] uppercase text-[#FF6B6B] mb-2 md:mb-3 italic font-semibold">Valentine&apos;s Day Special 💕</div>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-2.5 md:mb-3.5">Celebrate Love with Perfect Gifts</h2>
              <p className="text-xs md:text-sm text-white/70 mb-5 md:mb-7">Watches · Jewelry · Flowers · Personalized Gifts</p>
              <Link href="/shop" className="inline-block bg-white text-[var(--copper)] px-6 md:px-8 py-2.5 md:py-3 rounded text-xs md:text-sm font-medium uppercase tracking-wider border-2 border-white hover:bg-[var(--copper-pale)] hover:text-[var(--copper-dark)] transition-all min-h-[44px] flex items-center justify-center">Shop Now</Link>
            </div>
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
