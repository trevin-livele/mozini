import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about Mozini Watches & Gifts Kenya. Delivery, returns, payment methods, warranty, and more.',
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
