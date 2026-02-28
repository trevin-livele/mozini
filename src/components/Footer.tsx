'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
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
  const [logoError, setLogoError] = useState(false);
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
            <Link href="/" className="flex items-center mb-4">
              {logoError ? (
                <span className="w-16 h-16 rounded-xl bg-[var(--copper)] flex items-center justify-center text-white font-serif font-bold text-4xl shadow-sm">M</span>
              ) : (
                <Image src="/images/logodark.png" alt="Mozini Logo" width={64} height={64} className="h-16 w-auto" onError={() => setLogoError(true)} />
              )}
            </Link>
            <p className="text-sm leading-relaxed mb-5">Kenya&apos;s finest watches &amp; gifts collection. Premium timepieces, jewelry, and personalized gifts crafted with precision and love.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Shop All</Link></li>
              <li><Link href="/shop?category=Gents Watches" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Gents Watches</Link></li>
              <li><Link href="/shop?category=Ladies Watches" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Ladies Watches</Link></li>
              <li><Link href="/shop?category=Hannah Martin" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Hannah Martin</Link></li>
              <li><Link href="/shop?category=Gifts" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Gifts</Link></li>
              <li><Link href="/shop?category=Jewelry" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Jewelry</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5">
              <li><Link href="/cart" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Shopping Cart</Link></li>
              <li><Link href="/wishlist" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Wishlist</Link></li>
              <li><Link href="/faqs" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">FAQs</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-[var(--copper-light)] hover:pl-1 transition-all">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5">
              <li className="text-sm">📍 Digital Shopping Mall, F27</li>
              <li><a href="https://wa.me/254115757568" target="_blank" className="text-sm hover:text-[var(--copper-light)]">💬 WhatsApp: +254 115 757 568</a></li>
              <li><a href="mailto:info@mizini.co.ke" className="text-sm hover:text-[var(--copper-light)]">✉️ info@mizini.co.ke</a></li>
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
