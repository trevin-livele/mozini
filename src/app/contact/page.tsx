'use client';

import Link from 'next/link';
import { useState } from 'react';
import { submitContactMessage } from '@/lib/actions/contact';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      await submitContactMessage({ name, email, phone, subject, message });
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    const text = `Hi Mozini! 👋\n\nName: ${name}\n${subject ? `Subject: ${subject}\n` : ''}Message: ${message}`;
    window.open(`https://wa.me/254115757568?text=${encodeURIComponent(text)}`, '_blank');
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
                  <h4 className="text-sm font-semibold text-[var(--dark)] mb-0.5">Pick Up Point</h4>
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
              <form onSubmit={handleSubmit} id="contactForm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Name *</label>
                    <input name="name" required placeholder="Your name" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Email *</label>
                    <input name="email" type="email" required placeholder="your@email.com" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Phone</label>
                  <input name="phone" type="tel" placeholder="+254 7XX XXX XXX" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Subject</label>
                  <input name="subject" placeholder="How can we help?" className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[var(--dark)] mb-1.5">Message *</label>
                  <textarea name="message" required placeholder="Write your message..." className="w-full px-4 py-3 border border-[var(--border)] rounded text-sm focus:border-[var(--copper)] transition-colors min-h-[140px] resize-y"></textarea>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
                )}

                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="flex-1 bg-[var(--copper)] text-white py-3.5 rounded text-sm font-medium uppercase tracking-wider hover:bg-[var(--copper-dark)] transition-colors disabled:opacity-50">
                    {submitting ? 'Sending...' : '✉️ Send Message'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const form = document.getElementById('contactForm') as HTMLFormElement;
                      if (form.checkValidity()) {
                        handleWhatsApp({ preventDefault: () => {}, currentTarget: form } as any);
                      } else {
                        form.reportValidity();
                      }
                    }}
                    className="px-6 bg-[#25D366] text-white py-3.5 rounded text-sm font-medium uppercase tracking-wider hover:bg-[#1da851] transition-colors"
                  >
                    💬 WhatsApp
                  </button>
                </div>

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
