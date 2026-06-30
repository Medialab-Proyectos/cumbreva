import { faqs } from "@/components/faq"
import { BRAND, SITE_URL } from "@/lib/site"

// Datos estructurados para SEO, E-E-A-T y motores generativos.
export function StructuredData() {
  const homeUrl = `${SITE_URL}/`
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND.name,
        legalName: BRAND.name,
        alternateName: [
          "Cumbreva",
          "Cumbreva Colombia",
          "Cumbreva calculadora de autonomia",
          "Cumbreva copiloto electrico",
        ],
        url: homeUrl,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        email: BRAND.email,
        description: BRAND.description,
        knowsAbout: [
          "carro electrico",
          "vehiculo electrico",
          "autonomia real",
          "rutas con carga",
          "electrolineras en Colombia",
          "calculo de bateria real",
        ],
        areaServed: {
          "@type": "Country",
          name: BRAND.country,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: homeUrl,
        name: BRAND.name,
        alternateName: [
          "Cumbreva",
          "Cumbreva Colombia",
          "Cumbreva copiloto electrico",
        ],
        description: BRAND.description,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: homeUrl,
        name: "Cumbreva | Calcula si llegas en carro electrico",
        description: BRAND.description,
        inLanguage: "es-CO",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: [
          "ansiedad de carga",
          "autonomia real de carro electrico",
          "estaciones de carga en Colombia",
          "bateria de vehiculo electrico",
          "donde cargar carro electrico",
          "como planear una ruta en carro electrico",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: BRAND.name,
        applicationCategory: "TravelApplication",
        applicationSubCategory: "Calculadora de autonomia para vehiculos electricos",
        operatingSystem: "Android, iOS",
        description: BRAND.description,
        url: SITE_URL,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#organization` },
        featureList: [
          "Calcula si llegas antes de salir",
          "Estimacion de autonomia real con bateria actual",
          "Planeacion de rutas electricas con margen de llegada",
          "Lectura de montana, consumo y puntos de carga cercanos",
          "Historial de rutas y comentarios del conductor",
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "COP",
          availability: "https://schema.org/PreOrder",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: "es-CO",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
