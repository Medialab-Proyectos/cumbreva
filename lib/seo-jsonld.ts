import type { BreadcrumbItem } from "@/components/seo/breadcrumbs"
import { SITE_URL } from "@/lib/site"

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const linkedItems = items.filter((item) => item.href)
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: linkedItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href as string),
    })),
  }
}
