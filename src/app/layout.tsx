import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mozini.co.ke";
const SITE_NAME = "Mozini Watches & Gifts";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mozini – Valentine's Gifts, Watches & Jewelry | Kenya's #1 Gift Shop",
    template: "%s | Mozini Watches & Gifts Kenya",
  },
  description:
    "Shop premium Valentine's gifts, watches for men & women, jewelry, flower bouquets, and personalized gifts in Kenya. Nationwide delivery. Curren, Naviforce, Hannah Martin & more.",
  keywords: [
    "valentine gifts Kenya",
    "valentine gifts for him",
    "valentine gifts for her",
    "watches for men Kenya",
    "watches for women Kenya",
    "gift shop Kenya",
    "Nairobi gift shop",
    "buy watches online Kenya",
    "Hannah Martin watches",
    "Curren watches Kenya",
    "Naviforce watches Kenya",
    "Poedagar watches",
    "flower bouquet Kenya",
    "personalized gifts Kenya",
    "jewelry Kenya",
    "necklaces for her",
    "valentine's day gifts",
    "gift ideas Kenya",
    "couple gifts Kenya",
    "romantic gifts Nairobi",
    "affordable watches Kenya",
    "ladies watches Kenya",
    "gents watches Kenya",
    "gift cards Kenya",
    "Mozini",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Mozini – Valentine's Gifts, Watches & Jewelry | Kenya",
    description:
      "Kenya's favourite gift shop. Premium watches, jewelry, flower bouquets & personalized gifts. Free delivery on orders above KES 10,000.",
    images: [
      {
        url: "/images/curren/image00001.jpeg",
        width: 1200,
        height: 630,
        alt: "Mozini Watches & Gifts Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mozini – Valentine's Gifts, Watches & Jewelry | Kenya",
    description:
      "Shop premium watches, jewelry & personalized gifts. Nationwide delivery across Kenya.",
    images: ["/images/curren/image00001.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "E-commerce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Kenya's favourite gift shop. Premium watches, jewelry, flower bouquets & personalized gifts.",
    image: `${SITE_URL}/images/curren/image00001.jpeg`,
    telephone: "+254115757568",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KE",
      addressLocality: "Nairobi",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2921,
      longitude: 36.8219,
    },
    priceRange: "KES 500 - KES 50,000",
    currenciesAccepted: "KES",
    paymentAccepted: "Cash, M-Pesa",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
    sameAs: [
      "https://wa.me/254115757568",
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider initialUser={user}>
          <ToastProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <SocialFloat />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
