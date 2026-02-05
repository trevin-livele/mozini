'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Contact Us</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Contact
          </div>
        </div>
      </div>

      <div className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <h2 className="font-serif text-3xl text-[var(--dark)] mb-5">Get In Touch</h2>
              <p className="text-sm leading-relaxed text-[var(--text)] mb-8">Have a question or need help? We&apos;d love to hear from you.</p>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 bg-[var(--bg-soft)] rounded-full flex items-center justify-center text-xl flex-shrink-0">📍</div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--dark)] mb-0.5">Our Store</h4>
                  <p className="text-sm text-[var(--text-light)]">Digital Shopping Mall, F27, Nairobi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 bg-[var(--bg-soft)] rounded-full flex items-center justify-center text-xl flex-shrink-0">📞</div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--dark)] mb-0.5">WhatsApp</h4>
                  <p className="text-sm text-[var(--text-light)]">+254 115 757 568</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 bg-[var(--bg-soft)] rounded-full flex items-center justify-center text-xl flex-shrink-0">✉️</div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--dark)] mb-0.5">Email</h4>
                  <p className="text-sm text-[var(--text-light)]">info@mozini.co.ke</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-[var(--bg-soft)] rounded-full flex items-center justify-center text-xl flex-shrink-0">🕐</div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--dark)] mb-0.5">Working Hours</h4>
                  <p className="text-sm text-[var(--text-light)]">Mon – Sat: 9AM – 7PM</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-serif text-3xl text-[var(--dark)] mb-5">Send a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Name *</label>
                    <input required placeholder="Your name" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Email *</label>
                    <input type="email" required placeholder="your@email.com" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Phone</label>
                  <input type="tel" placeholder="+254 7XX XXX XXX" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Subject</label>
                  <input placeholder="How can we help?" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Message *</label>
                  <textarea required placeholder="Write your message..." className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors min-h-[140px] resize-y"></textarea>
                </div>
                <button type="submit" className="w-full bg-[var(--copper)] text-white py-3.5 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors">
                  Send Message
                </button>
                {submitted && (
                  <div className="mt-4 p-4 bg-green-100 rounded text-sm text-green-800">
                    ✅ Thank you! We&apos;ll get back to you within 24 hours.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
