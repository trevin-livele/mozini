'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { formatPrice, CATEGORIES } from '@/lib/data';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from '@/lib/actions/auth';

export default function Header() {
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const { user, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [mobileGiftsOpen, setMobileGiftsOpen] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const giftsRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // All gift-related categories for the dropdown
  const giftCategories = CATEGORIES.flatMap((c) => {
    const items: { name: string; href: string }[] = [];
    items.push({ name: c.name, href: `/shop?category=${encodeURIComponent(c.name)}` });
    if (c.subcategories) {
      c.subcategories.forEach((sub) => {
        items.push({ name: sub.name, href: `/shop?category=${encodeURIComponent(sub.name)}` });
      });
    }
    return items;
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    if (bannerRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(bannerRef.current.querySelector('.banner-text'), {
        scale: 1.03, duration: 0.8, ease: 'power1.inOut', yoyo: true, repeat: 1,
      })
      .to(bannerRef.current.querySelectorAll('.banner-heart'), {
        y: -4, rotation: 15, duration: 0.4, stagger: 0.1, ease: 'power1.inOut', yoyo: true, repeat: 1,
      }, 0)
      .to({}, { duration: 2 });
    }

    // Close gifts dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (giftsRef.current && !giftsRef.current.contains(e.target as Node)) {
        setGiftsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Valentine's Banner */}
      <div ref={bannerRef} className="bg-gradient-to-r from-[#D32F2F] via-[#E91E63] to-[#D32F2F] text-white text-center py-2.5 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-[10%] text-lg">❤️</div>
          <div className="absolute top-0 left-[30%] text-lg">💕</div>
          <div className="absolute top-0 left-[50%] text-lg">💖</div>
          <div className="absolute top-0 left-[70%] text-lg">💝</div>
          <div className="absolute top-0 left-[90%] text-lg">❤️</div>
        </div>
        <p className="banner-text text-xs md:text-sm font-semibold relative z-10 flex items-center justify-center gap-1.5">
          <span className="banner-heart inline-block">💝</span>
          <span>Valentine&apos;s Day Special — Show Your Love with Perfect Gifts!</span>
          <span className="hidden sm:inline">Free Gift Wrapping on All Orders</span>
          <span className="banner-heart inline-block">💝</span>
        </p>
      </div>

      {/* Top Bar */}
      <div className="bg-[var(--copper)] text-white text-xs py-2 hidden md:block">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center flex-wrap gap-2">
          <span className="text-[11px]">📍 Digital Shopping Mall, F27 · 💬 <a href="https://wa.me/254115757568" target="_blank" className="underline">+254 115 757 568</a></span>
          <div className="flex gap-4 items-center">
            <span>KES</span>
            <span className="text-xs">English</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`bg-white py-2.5 md:py-3 border-b border-[var(--border)] sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-5 flex items-center justify-between gap-3">
          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex flex-col gap-1 p-2" aria-label="Menu">
            <span className={`w-5 h-0.5 bg-[var(--dark)] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[var(--dark)] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[var(--dark)] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image src="/images/1.png" alt="Mozini Logo" width={40} height={40} className="h-8 md:h-10 w-auto" />
            <span className="font-serif text-lg md:text-xl font-bold text-[var(--dark)] leading-tight">
              Mozini<br className="hidden md:block" />
              <span className="text-[10px] md:text-xs font-normal tracking-wider text-[var(--text-light)] uppercase">Watches &amp; Gifts</span>
            </span>
          </Link>

          {/* Desktop Nav - Inline */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-[13px] text-[var(--text)] hover:text-[var(--copper)] transition-colors">HOME</Link>
            <Link href="/shop" className="px-3 py-2 text-[13px] text-[var(--text)] hover:text-[var(--copper)] transition-colors">SHOP</Link>
            {/* Gifts Dropdown */}
            <div ref={giftsRef} className="relative">
              <button
                onClick={() => setGiftsOpen(!giftsOpen)}
                className="px-3 py-2 text-[13px] text-[var(--text)] hover:text-[var(--copper)] transition-colors flex items-center gap-1"
              >
                GIFTS
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${giftsOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {giftsOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[var(--border)] rounded-lg shadow-xl py-2 min-w-[220px] z-50 max-h-[400px] overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.name}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setGiftsOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-[var(--dark)] hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors"
                      >
                        {cat.icon} {cat.name}
                      </Link>
                      {cat.subcategories?.map((sub) => (
                        <Link
                          key={sub.name}
                          href={`/shop?category=${encodeURIComponent(sub.name)}`}
                          onClick={() => setGiftsOpen(false)}
                          className="block px-8 py-1.5 text-xs text-[var(--text-light)] hover:bg-[var(--bg-soft)] hover:text-[var(--copper)] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/contact" className="px-3 py-2 text-[13px] text-[var(--text)] hover:text-[var(--copper)] transition-colors">CONTACT</Link>
            <Link href="/faqs" className="px-3 py-2 text-[13px] text-[var(--text)] hover:text-[var(--copper)] transition-colors">FAQs</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {mounted && (
              user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link href="/admin" className="p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors text-[var(--copper)]" title="Admin">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                    </Link>
                  )}
                  <Link href="/profile" className="p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors" title="Profile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </Link>
                  <Link href="/orders" className="p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors hidden sm:block" title="Orders">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="text-xs md:text-sm font-medium text-[var(--copper)] hover:underline">Sign In</Link>
              )
            )}
            <Link href="/wishlist" className="relative p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span className="absolute -top-0.5 -right-1 bg-[var(--copper)] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">{mounted ? wishlist.length : 0}</span>
            </Link>
            <Link href="/cart" className="relative p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="absolute -top-0.5 -right-1 bg-[var(--copper)] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">{mounted ? cartCount : 0}</span>
            </Link>
            <span className="text-xs md:text-sm font-medium text-[var(--dark)] hidden sm:inline">{mounted ? formatPrice(cartTotal) : 'KES 0'}</span>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-[280px] h-full bg-white z-50 shadow-lg lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Image src="/images/1.png" alt="Mozini" width={32} height={32} className="h-8 w-auto" />
                <button onClick={() => setMobileMenuOpen(false)} className="text-2xl">&times;</button>
              </div>
              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">HOME</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">SHOP</Link>

                {/* Mobile Gifts Accordion */}
                <button onClick={() => setMobileGiftsOpen(!mobileGiftsOpen)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors flex items-center justify-between">
                  GIFTS
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${mobileGiftsOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {mobileGiftsOpen && (
                  <div className="ml-2 border-l-2 border-[var(--border)]">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.name}>
                        <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-[var(--dark)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">
                          {cat.icon} {cat.name}
                        </Link>
                        {cat.subcategories?.map((sub) => (
                          <Link key={sub.name} href={`/shop?category=${encodeURIComponent(sub.name)}`} onClick={() => setMobileMenuOpen(false)} className="block px-8 py-1.5 text-xs text-[var(--text-light)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">CONTACT</Link>
                <Link href="/faqs" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">FAQs</Link>
                <hr className="my-2 border-[var(--border)]" />
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors font-medium">⚙️ ADMIN PANEL</Link>
                    )}
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">MY PROFILE</Link>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">MY ORDERS</Link>
                    <button onClick={() => { setMobileMenuOpen(false); signOut(); }} className="px-4 py-3 text-sm text-left text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">SIGN OUT</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors font-medium">SIGN IN</Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">CREATE ACCOUNT</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
