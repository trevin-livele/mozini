import type { Metadata } from "next";
import { getProductById } from "@/lib/actions/products";
import { formatPrice } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(parseInt(id));

  if (!product) {
    return { title: "Product Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mozini.co.ke";
  const price = formatPrice(product.price);
  const title = `${product.name} – ${product.brand} | ${price}`;
  const description = `Buy ${product.name} by ${product.brand} for ${price}. ${product.desc} Free delivery across Kenya on orders above KES 10,000. Shop now at Mozini.`;
  const url = `${siteUrl}/product/${product.id}`;
  const image = product.image_url || "/images/curren/image00001.jpeg";

  return {
    title,
    description,
    keywords: [
      `buy ${product.name}`,
      `${product.brand} Kenya`,
      `${product.category} Kenya`,
      "buy watches online Kenya",
      "valentine gifts Kenya",
    ],
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} – ${price}`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(parseInt(id));

  if (!product) return <>{children}</>;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mozini.co.ke";
  const image = product.image_url || "/images/curren/image00001.jpeg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc,
    image: image.startsWith("http") ? image : `${siteUrl}${image}`,
    brand: { "@type": "Brand", name: product.brand },
    sku: `MZ-${String(product.id).padStart(4, "0")}`,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: "KES",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Mozini Watches & Gifts" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
