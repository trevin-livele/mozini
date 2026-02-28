import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Mozini Watches & Gifts Kenya. How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Privacy Policy</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Privacy Policy
          </div>
        </div>
      </div>
      <div className="py-12 pb-20">
        <div className="max-w-3xl mx-auto px-5 prose prose-sm text-[var(--text)] [&_h2]:font-serif [&_h2]:text-[var(--dark)] [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
          <p className="text-xs text-[var(--text-light)]">Last updated: February 2026</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order, or contacting us:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Shipping address and city</li>
            <li>Order history and preferences</li>
            <li>Messages sent through our contact form</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul>
            <li>Process and deliver your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send promotional offers and new product announcements (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul>
            <li>Delivery partners to fulfill your orders</li>
            <li>Payment processors (M-Pesa, card networks) to process transactions</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. Your data is stored securely using encrypted connections. However, no method of transmission over the internet is 100% secure.</p>

          <h2>5. Cookies</h2>
          <p>Our website uses cookies to enhance your browsing experience, remember your preferences, and maintain your shopping cart. You can disable cookies in your browser settings, but some features may not work properly.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data stored with us</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of promotional communications</li>
          </ul>

          <h2>7. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites (e.g., WhatsApp, social media). We are not responsible for the privacy practices of these external sites.</p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.</p>

          <h2>10. Contact Us</h2>
          <p>For privacy-related questions or requests:</p>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/254115757568" className="text-[var(--copper)]">+254 115 757 568</a></li>
            <li>Email: <a href="mailto:info@mizini.co.ke" className="text-[var(--copper)]">info@mizini.co.ke</a></li>
          </ul>
        </div>
      </div>
    </>
  );
}
