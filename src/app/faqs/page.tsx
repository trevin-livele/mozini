'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept M-Pesa, cash on delivery, Visa, and Mastercard. M-Pesa is the most popular option for our Kenyan customers.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Nairobi deliveries take 1–2 business days. Nationwide delivery across Kenya takes 3–5 business days depending on your location.',
  },
  {
    q: 'Is delivery free?',
    a: 'Yes! We offer free delivery on all orders above KES 10,000. Orders below that have a flat delivery fee of KES 500.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Absolutely. We offer a 7-day return/exchange policy. Items must be unused and in original packaging. Contact us via WhatsApp to initiate a return.',
  },
  {
    q: 'Are your watches original?',
    a: 'Yes, all our watches are 100% authentic brand products. We are authorized dealers for Curren, Naviforce, Poedagar, and Hannah Martin in Kenya.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Yes! All Valentine\'s orders come with complimentary gift wrapping. We also offer premium gift boxes for an additional fee.',
  },
  {
    q: 'Can I personalize my gift?',
    a: 'Yes, we offer personalized mugs, engraved keychains, custom gift cards, and personalized boxes. Add your message during checkout or contact us on WhatsApp.',
  },
  {
    q: 'Do you ship outside Kenya?',
    a: 'Currently we deliver nationwide within Kenya. International shipping is coming soon. Contact us for special arrangements.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order is confirmed, you can track it from your account under "My Orders". You\'ll also receive WhatsApp updates on your order status.',
  },
  {
    q: 'What is your warranty policy?',
    a: 'All watches come with a 1-year warranty covering manufacturing defects. Jewelry and accessories have a 30-day quality guarantee.',
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Frequently Asked Questions</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / FAQs
          </div>
        </div>
      </div>
      <div className="py-12 pb-20">
        <div className="max-w-3xl mx-auto px-5">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--bg-soft)] transition-colors"
                >
                  <span className="text-sm font-medium text-[var(--dark)]">{faq.q}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 text-[var(--copper)] transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4 text-sm text-[var(--text)] leading-relaxed border-t border-[var(--border)] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-[var(--text-light)] mb-4">Still have questions?</p>
            <Link href="/contact" className="inline-block bg-[var(--copper)] text-white px-8 py-3 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
