import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mozini.co.ke";
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/wishlist`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${siteUrl}/cart`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
  ];

  // Category pages
  const categories = [
    "Gents Watches", "Ladies Watches", "Kids Watches", "Gifts",
    "Jewelry", "Drinks & Candy", "Curren", "Naviforce",
    "Poedagar", "Hannah Martin", "Flower Bouquet", "Gift Cards",
  ];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/shop?category=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Product pages from Supabase
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at")
      .order("id");

    if (products) {
      productPages = products.map((p) => ({
        url: `${siteUrl}/product/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Sitemap still works without product pages
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
