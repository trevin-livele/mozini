import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using Mozini Watches & Gifts Kenya online store.',
};

export default function TermsPage() {
  return (
    <>
      <div className="bg-[var(--bg-soft)] py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="font-serif text-4xl text-[var(--dark)] mb-2">Terms &amp; Conditions</h1>
          <div className="text-sm text-[var(--text-light)]">
            <Link href="/" className="text-[var(--copper)] hover:underline">Home</Link> / Terms &amp; Conditions
          </div>
        </div>
      </div>
      <div className="py-12 pb-20">
        <div className="max-w-3xl mx-auto px-5 prose prose-sm text-[var(--text)] [&_h2]:font-serif [&_h2]:text-[var(--dark)] [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
          <p className="text-xs text-[var(--text-light)]">Last updated: February 2026</p>

          <h2>1. General</h2>
          <p>These Terms and Conditions govern your use of the Mozini Watches &amp; Gifts website and services. By accessing or using our website, you agree to be bound by these terms.</p>

          <h2>2. Products &amp; Pricing</h2>
          <p>All prices are listed in Kenyan Shillings (KES) and include applicable taxes. We reserve the right to change prices without prior notice. Product images are for illustration purposes and may vary slightly from the actual product.</p>

          <h2>3. Orders &amp; Payment</h2>
          <p>By placing an order, you are making an offer to purchase. We reserve the right to accept or decline any order. Payment can be made via M-Pesa, cash on delivery, Visa, or Mastercard. Orders are confirmed once payment is received or verified.</p>

          <h2>4. Shipping &amp; Delivery</h2>
          <ul>
            <li>Nairobi: 1–2 business days</li>
            <li>Rest of Kenya: 3–5 business days</li>
            <li>Free delivery on orders above KES 10,000</li>
            <li>Flat rate of KES 500 for orders below KES 10,000</li>
          </ul>
          <p>Delivery timelines are estimates and may vary due to unforeseen circumstances.</p>

          <h2>5. Returns &amp; Exchanges</h2>
          <p>We accept returns and exchanges within 7 days of delivery. Items must be unused, in original packaging, and accompanied by proof of purchase. Contact us via WhatsApp at +254 115 757 568 to initiate a return. Refunds are processed within 5–7 business days.</p>

          <h2>6. Warranty</h2>
          <p>All watches come with a 1-year manufacturer warranty covering defects in materials and workmanship. Jewelry and accessories carry a 30-day quality guarantee. Warranty does not cover damage from misuse, accidents, or normal wear and tear.</p>

          <h2>7. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and designs, is the property of Mozini Watches &amp; Gifts and is protected by copyright laws. Unauthorized use is prohibited.</p>

          <h2>8. Limitation of Liability</h2>
          <p>Mozini Watches &amp; Gifts shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the product in question.</p>

          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>

          <h2>10. Contact</h2>
          <p>For questions about these terms, contact us at:</p>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/254115757568" className="text-[var(--copper)]">+254 115 757 568</a></li>
            <li>Email: <a href="mailto:info@mizini.co.ke" className="text-[var(--copper)]">info@mizini.co.ke</a></li>
            <li>Location: Digital Shopping Mall, F27, Nairobi</li>
          </ul>
        </div>
      </div>
    </>
  );
}
