'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const socials = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/254115757568',
    color: '#25D366',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mozini_gifts',
    color: '#E1306C',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@mozini_watches',
    color: '#010101',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17v-3.44a4.85 4.85 0 01-3.77-1.82V6.69h3.77z"/>
      </svg>
    ),
  },
];

export default function SocialFloat() {
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<gsap.core.Tween | null>(null);

  // Gentle floating animation on the main button
  useEffect(() => {
    if (!fabRef.current) return;

    pulseRef.current = gsap.to(fabRef.current, {
      y: -6,
      duration: 1.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => { pulseRef.current?.kill(); };
  }, []);

  // Animate menu items in/out
  useEffect(() => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll('.social-item');

    if (open) {
      // Pause the float while menu is open
      pulseRef.current?.pause();
      gsap.set(fabRef.current, { y: 0 });

      gsap.fromTo(items,
        { scale: 0, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: 'back.out(2)' }
      );
    } else {
      gsap.to(items, {
        scale: 0, opacity: 0, y: 20, duration: 0.2, stagger: 0.05,
        onComplete: () => { pulseRef.current?.resume(); }
      });
    }
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3">
      {/* Social links menu */}
      <div ref={menuRef} className="flex flex-col items-center gap-2.5 mb-1">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-item flex items-center gap-2.5 opacity-0 scale-0 group"
            style={{ transformOrigin: 'center bottom' }}
          >
            <span className="text-xs font-medium text-white bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {s.label}
            </span>
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110"
              style={{ background: s.color }}
            >
              {s.icon}
            </span>
          </a>
        ))}
      </div>

      {/* Main FAB */}
      <button
        ref={fabRef}
        onClick={() => setOpen(!open)}
        aria-label="Social links"
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 relative group"
        style={{
          background: open
            ? 'linear-gradient(135deg, #D32F2F, #E91E63)'
            : 'linear-gradient(135deg, #2C5F63, #3a7a7f)',
        }}
      >
        {/* Ping ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[var(--copper)]" />
        )}

        {/* Icon morphs between chat bubble and X */}
        <span className={`transition-transform duration-300 ${open ? 'rotate-45 scale-110' : 'rotate-0'}`}>
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
