import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Store } from "@/components/tienda/store"
import { CartButton } from "@/components/tienda/cart-button"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { SiteFooter } from "@/components/site-footer"
import { breadcrumbJsonLd } from "@/lib/seo-jsonld"
import { BRAND, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Tienda Cumbreva - productos para comunidad electrica",
  description:
    "La tienda de Cumbreva: camisetas, busos, tazas y productos para quienes viven la movilidad electrica en Colombia.",
  alternates: { canonical: "/tienda" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: `${SITE_URL}/tienda`,
    siteName: BRAND.name,
    title: "Tienda Cumbreva - productos para comunidad electrica",
    description:
      "Productos Cumbreva para conductores, fans y pioneros de la movilidad electrica en Colombia.",
    images: [
      {
        url: "/tienda/camiseta%20(1).png",
        alt: "Camiseta de la tienda Cumbreva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda Cumbreva - productos para comunidad electrica",
    description:
      "Camisetas, busos, tazas y productos para la comunidad electrica de Cumbreva.",
    images: ["/tienda/camiseta%20(1).png"],
  },
}

export default function TiendaPage() {
  const breadcrumbItems = [
    { label: "Cumbreva", href: "/" },
    { label: "Tienda", href: "/tienda" },
  ]
  const jsonLd = [
    breadcrumbJsonLd(breadcrumbItems),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tienda Cumbreva",
      description:
        "Productos Cumbreva para la comunidad de movilidad electrica en Colombia.",
      url: `${SITE_URL}/tienda`,
      inLanguage: "es-CO",
      isPartOf: {
        "@type": "WebSite",
        name: BRAND.name,
        url: `${SITE_URL}/`,
      },
    },
  ]

  return (
    <div className="min-h-dvh bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver a Cumbreva
          </Link>
          <CartButton />
        </div>
      </header>
      <Breadcrumbs items={breadcrumbItems} />
      <main className="px-5 py-10 sm:px-8 sm:py-14">
        <Store />
      </main>
      <SiteFooter />
    </div>
  )
}
