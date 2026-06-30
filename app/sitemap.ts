import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { programmaticSeoPages } from "@/lib/programmatic-seo"
import { seoLandings } from "@/lib/seo-landings"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/calculadora`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/tienda`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...seoLandings.map((landing) => ({
      url: `${SITE_URL}/seo/${landing.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: landing.funnel === "Conversion" ? 0.9 : 0.8,
    })),
    ...programmaticSeoPages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority:
        page.path === "/calculadora-autonomia-carro-electrico-colombia"
          ? 0.95
          : page.group === "route"
            ? 0.9
            : 0.85,
    })),
  ]
}
