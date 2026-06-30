import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Calculator } from "@/components/calculadora/calculator"
import { LogoutButton } from "@/components/calculadora/logout-button"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { HideOnStandalone } from "@/components/hide-on-standalone"
import { Logo } from "@/components/logo"
import { PwaInstallButton } from "@/components/pwa-install-button"
import { SiteFooter } from "@/components/site-footer"
import { breadcrumbJsonLd } from "@/lib/seo-jsonld"
import { BRAND, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Calculadora de autonomia real para carro electrico",
  description:
    "Calcula si te alcanza la bateria de tu carro electrico entre dos puntos en Colombia y planea la ruta con carga segun desnivel real, clima por altitud y regeneracion en bajadas.",
  alternates: { canonical: "/calculadora" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: `${SITE_URL}/calculadora`,
    siteName: BRAND.name,
    title: "Calculadora de autonomia real para carro electrico | Cumbreva",
    description:
      "Antes de salir, calcula si llegas con tu bateria actual, tu ruta real y la montana colombiana.",
    images: [
      {
        url: "/hero-route.png",
        width: 1731,
        height: 909,
        alt: "Calculadora Cumbreva para rutas en carro electrico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de autonomia real para carro electrico | Cumbreva",
    description:
      "No adivines la autonomia. Calcula si llegas antes de salir.",
    images: ["/hero-route.png"],
  },
}

export default function CalculadoraPage() {
  const breadcrumbItems = [
    { label: "Cumbreva", href: "/" },
    { label: "Calculadora", href: "/calculadora" },
  ]
  const jsonLd = [
    breadcrumbJsonLd(breadcrumbItems),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Cumbreva Calculadora de autonomia",
      applicationCategory: "TravelApplication",
      applicationSubCategory:
        "Calculadora de autonomia para vehiculos electricos",
      operatingSystem: "Web, Android, iOS",
      url: `${SITE_URL}/calculadora`,
      inLanguage: "es-CO",
      description:
        "Calcula si un carro electrico llega a su destino con la bateria actual, la ruta real, desnivel, consumo estimado y margen de llegada.",
      publisher: {
        "@type": "Organization",
        name: BRAND.name,
      },
      featureList: [
        "Calculo de autonomia real con bateria actual",
        "Estimacion por distancia, desnivel y regeneracion",
        "Margen de llegada por ruta",
        "Historial y comentarios de rutas",
        "Feedback de uso para mejorar la experiencia",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "COP",
        availability: "https://schema.org/PreOrder",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "La calculadora garantiza que voy a llegar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Cumbreva entrega una estimacion para ayudarte a decidir antes de salir. El resultado puede cambiar por trafico, clima, viento, estado de bateria, llantas, peso y disponibilidad de carga.",
          },
        },
        {
          "@type": "Question",
          name: "Que datos usa la calculadora?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Usa bateria actual, modelo del vehiculo, consumo base, distancia, desnivel de la ruta y factores como regeneracion en bajadas y climatizacion estimada por altitud.",
          },
        },
        {
          "@type": "Question",
          name: "Por que calcular antes de salir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Porque la autonomia real cambia con montana, velocidad, carga del vehiculo y clima. Calcular antes permite decidir si sales, cargas primero o ajustas la ruta.",
          },
        },
      ],
    },
  ]

  return (
    <div className="min-h-dvh bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <HideOnStandalone>
              <Link
                href="/"
                className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                <ArrowLeft className="size-4" />
                Volver a Cumbreva
              </Link>
              <PwaInstallButton className="h-9 px-4 text-sm" />
            </HideOnStandalone>
            <LogoutButton />
          </div>
        </div>
      </header>
      <HideOnStandalone>
        <Breadcrumbs items={breadcrumbItems} />
      </HideOnStandalone>
      <main className="px-5 py-6 sm:px-8 sm:py-10">
        <Calculator />
      </main>
      <HideOnStandalone>
        <SiteFooter />
      </HideOnStandalone>
    </div>
  )
}
