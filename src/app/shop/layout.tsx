import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Watches, Gifts & Jewelry",
  description:
    "Browse our full collection of premium watches for men & women, Valentine's gifts, jewelry, flower bouquets, and personalized gifts. Free delivery across Kenya on orders above KES 10,000.",
  keywords: [
    "buy watches online Kenya",
    "valentine gifts shop",
    "gift shop Nairobi",
    "watches for men",
    "watches for women",
    "jewelry online Kenya",
    "flower bouquet delivery Kenya",
  ],
  openGraph: {
    title: "Shop Watches, Gifts & Jewelry | Mozini Kenya",
    description:
      "Browse premium watches, Valentine's gifts, jewelry & more. Nationwide delivery.",
    url: "/shop",
  },
  alternates: { canonical: "/shop" },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
