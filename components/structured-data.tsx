import { BRAND, SITE_URL } from "@/lib/site"
import { faqs } from "@/components/faq"

// Datos estructurados (JSON-LD) para SEO, E-E-A-T y motores generativos (GEO).
// Un solo @graph enlaza las entidades por @id para que Google/IA entiendan
// quién publica, qué es el producto y qué responde el FAQ.
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND.name,
        legalName: BRAND.company,
        url: SITE_URL,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        email: BRAND.email,
        description: BRAND.description,
        areaServed: {
          "@type": "Country",
          name: BRAND.country,
        },
        parentOrganization: {
          "@type": "Organization",
          name: BRAND.company,
          url: BRAND.companyUrl,
        },
        sameAs: [BRAND.companyUrl],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND.name,
        description: BRAND.description,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: BRAND.name,
        applicationCategory: "TravelApplication",
        operatingSystem: "Android, iOS",
        description: BRAND.description,
        url: SITE_URL,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#organization` },
        featureList: [
          "Estado de batería y autonomía real en tiempo real",
          "Planeación de rutas con paradas de carga",
          "Mapa de electrolineras",
          "Recomendaciones de carga con inteligencia artificial",
          "Documentos del vehículo en un solo lugar",
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
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // JSON-LD seguro: serializamos un objeto controlado, sin datos de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
