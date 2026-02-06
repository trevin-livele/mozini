'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function Header() {
  const { getCartCount, getCartTotal, wishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[var(--copper)] text-white text-xs py-2 hidden md:block">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center flex-wrap gap-2">
          <span className="text-[11px]">📍 Digital Shopping Mall, F27 · 💬 <a href="https://wa.me/254115757568" target="_blank" className="underline">+254 115 757 568</a></span>
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
      <header className={`bg-white py-3 md:py-3.5 border-b border-[var(--border)] sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-5 flex items-center justify-between gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1 p-2"
            aria-label="Menu"
          >
            <span className={`w-5 h-0.5 bg-[var(--dark)] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[var(--dark)] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[var(--dark)] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Logo */}
          <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-[var(--dark)] flex items-center gap-1.5 md:gap-2 group">
            <span className="w-5 h-5 md:w-6 md:h-6 bg-[var(--copper)] transition-transform group-hover:rotate-[72deg]" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></span>
            MOZINI
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/wishlist" className="relative p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span className="absolute -top-0.5 -right-1 bg-[var(--copper)] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">
                {mounted ? wishlist.length : 0}
              </span>
            </Link>
            <Link href="/cart" className="relative p-1.5 rounded-full hover:bg-[var(--bg-soft)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="md:w-[22px] md:h-[22px]"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span className="absolute -top-0.5 -right-1 bg-[var(--copper)] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-semibold">
                {mounted ? getCartCount() : 0}
              </span>
            </Link>
            <span className="text-xs md:text-sm font-medium text-[var(--dark)] hidden sm:inline">
              {mounted ? formatPrice(getCartTotal()) : 'KES 0'}
            </span>
          </div>
        </div>
      </header>

      {/* Navigation - Desktop */}
      <nav className="bg-white border-b border-[var(--border)] hidden lg:block">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-center">
          <div className="flex items-center">
            <Link href="/" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">HOME</Link>
            <Link href="/shop" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">SHOP</Link>
            <Link href="/shop?category=Men's Watches" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">WATCHES</Link>
            <Link href="/shop?category=Men's Perfumes" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">PERFUMES</Link>
            <Link href="/shop?category=Gift Sets" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">GIFT SETS</Link>
            <Link href="/about" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">ABOUT</Link>
            <Link href="/contact" className="px-4 xl:px-5 py-3.5 text-sm text-[var(--text)] hover:text-[var(--copper)] transition-colors">CONTACT</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-[280px] h-full bg-white z-50 shadow-lg lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="font-serif text-xl font-bold text-[var(--dark)]">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-2xl">&times;</button>
              </div>
              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">HOME</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">SHOP</Link>
                <Link href="/shop?category=Men's Watches" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">WATCHES</Link>
                <Link href="/shop?category=Men's Perfumes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">PERFUMES</Link>
                <Link href="/shop?category=Gift Sets" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">GIFT SETS</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">ABOUT</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm text-[var(--text)] hover:text-[var(--copper)] hover:bg-[var(--bg-soft)] rounded transition-colors">CONTACT</Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
