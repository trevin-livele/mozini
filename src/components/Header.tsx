'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function Header() {
  const { getCartCount, getCartTotal, wishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[var(--copper)] text-white text-xs py-2">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center flex-wrap gap-2">
          <span>📍 Pick Up: Digital Shopping Mall, F27 · 💬 WhatsApp: <a href="https://wa.me/254115757568" target="_blank" className="underline">+254 115 757 568</a></span>
          <div className="flex gap-4 items-center">
            <span>KES</span>
            <select className="bg-transparent border-none text-white text-xs cursor-pointer">
              <option className="text-gray-800">English</option>
              <option className="text-gray-800">Kiswahili</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`bg-white py-3.5 border-b border-[var(--border)] sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Search */}
          <div className="flex items-center border border-[var(--border)] rounded-full px-4 py-2 w-[200px] gap-2 cursor-pointer hover:border-[var(--copper)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search..." className="border-none outline-none text-sm w-full cursor-pointer" readOnly />
          </div>

          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold text-[var(--dark)] flex items-center gap-2 group">
            <span className="w-6 h-6 bg-[var(--copper)] transition-transform group-hover:rotate-[72deg]" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></span>
            MOZINI
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span className="absolute -top-0.5 -right-1 bg-[var(--copper)] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">
                {mounted ? wishlist.length : 0}
              </span>
            </Link>
            <Link href="/cart" className="relative p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="absolute -top-0.5 -right-1 bg-[var(--copper)] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">
                {mounted ? getCartCount() : 0}
              </span>
            </Link>
            <span className="text-sm font-medium text-[var(--dark)] hidden sm:inline">
              {mounted ? formatPrice(getCartTotal()) : 'KES 0'}
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-center">
          <div className="flex items-center">
            <Link href="/" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">HOME</Link>
            <Link href="/shop" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">SHOP</Link>
            <Link href="/shop?category=Men's Watches" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">WATCHES</Link>
            <Link href="/shop?category=Men's Perfumes" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">PERFUMES</Link>
            <Link href="/shop?category=Gift Sets" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">GIFT SETS</Link>
            <Link href="/about" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">ABOUT</Link>
            <Link href="/contact" className="px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">CONTACT</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
