'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] text-white/70 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-2xl font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-[var(--copper)]" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></span>
              MOZINI
            </Link>
            <p className="text-sm leading-relaxed mb-5">Kenya&apos;s finest watches & gifts collection. Premium timepieces and fragrances crafted with precision and love.</p>
            <div className="flex gap-2.5">
              <a href="https://www.instagram.com/mozini_gifts" target="_blank" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">📷</a>
              <a href="https://www.tiktok.com/@mozini_watches" target="_blank" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">▶</a>
              <a href="https://wa.me/254115757568" target="_blank" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--copper)] hover:border-[var(--copper)] transition-colors">💬</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">About Us</Link></li>
              <li><Link href="/shop" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Shop</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5">
              <li><Link href="/cart" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Shopping Cart</Link></li>
              <li><Link href="/wishlist" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Wishlist</Link></li>
              <li><span className="text-sm">Order Tracking</span></li>
              <li><span className="text-sm">Returns</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5">
              <li className="text-sm">📍 Digital Shopping Mall, F27</li>
              <li><a href="https://wa.me/254115757568" target="_blank" className="text-sm hover:text-[var(--copper-light)]">💬 WhatsApp: +254 115 757 568</a></li>
              <li><a href="mailto:info@mozini.co.ke" className="text-sm hover:text-[var(--copper-light)]">✉️ info@mozini.co.ke</a></li>
              <li className="text-sm">🕐 Mon–Sat: 9AM–7PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-between items-center flex-wrap gap-2.5 text-sm">
          <span>© 2026 Mozini. All rights reserved.</span>
          <div className="flex gap-2 text-xl">
            <span title="M-PESA">📱</span>
            <span title="Visa">💳</span>
            <span title="Mastercard">🏦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
