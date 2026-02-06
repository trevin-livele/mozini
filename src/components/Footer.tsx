'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { gsap } from 'gsap';

function SocialButton({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = () => {
    if (ref.current) {
      gsap.timeline()
        .to(ref.current, { scale: 0.85, duration: 0.1 })
        .to(ref.current, { scale: 1.2, duration: 0.2, ease: 'back.out(3)' })
        .to(ref.current, { scale: 1, duration: 0.15 });
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      onClick={handleClick}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <span
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
        style={{ background: color }}
      >
        {icon}
      </span>
      <span className="text-xs text-white/60 group-hover:text-white transition-colors">{label}</span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] text-white/70 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        {/* Social Engagement Section */}
        <div className="text-center mb-14 pb-10 border-b border-white/10">
          <h3 className="font-serif text-2xl text-white mb-2">Engage With Us 💬</h3>
          <p className="text-sm text-white/50 mb-8">Follow us for exclusive deals, new arrivals &amp; giveaways</p>
          <div className="flex justify-center gap-6 md:gap-10">
            <SocialButton href="https://www.instagram.com/mozini_gifts" icon="📷" label="Instagram" color="linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" />
            <SocialButton href="https://www.tiktok.com/@mozini_watches" icon="🎵" label="TikTok" color="#010101" />
            <SocialButton href="https://wa.me/254115757568" icon="💬" label="WhatsApp" color="#25D366" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/1.png" alt="Mozini Logo" width={40} height={40} className="h-10 w-auto" />
              <span className="font-serif text-xl font-bold text-white leading-tight">
                Mozini<br />
                <span className="text-[10px] font-normal tracking-wider text-white/50 uppercase">Watches &amp; Gifts</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5">Kenya&apos;s finest watches &amp; gifts collection. Premium timepieces and fragrances crafted with precision and love.</p>
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
          <span>© 2026 Mozini Watches &amp; Gifts. All rights reserved.</span>
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
