import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mozini Watches & Gifts Kenya",
    short_name: "Mozini",
    description:
      "Shop premium Valentine's gifts, watches, jewelry & personalized gifts in Kenya.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#2c5f63",
    icons: [
      { src: "/images/curren/image00001.jpeg", sizes: "192x192", type: "image/jpeg" },
      { src: "/images/curren/image00001.jpeg", sizes: "512x512", type: "image/jpeg" },
    ],
  };
}
