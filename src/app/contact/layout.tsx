import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mozini Watches & Gifts Kenya. Reach us via WhatsApp, phone, or email for orders, inquiries, and support. Based in Nairobi with nationwide delivery.",
  keywords: ["contact Mozini", "gift shop Nairobi contact", "Mozini WhatsApp"],
  openGraph: {
    title: "Contact Mozini Watches & Gifts Kenya",
    description: "Reach us for orders, inquiries, and support. Nairobi, Kenya.",
    url: "/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
