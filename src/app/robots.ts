import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mozini.co.ke";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", "/orders", "/profile", "/login", "/signup"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
