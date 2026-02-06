import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rolik.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/admin/",
          "/setup",
          "/orders/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
