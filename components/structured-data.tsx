import { faqs } from "@/components/faq"
import { BRAND, SITE_URL } from "@/lib/site"

// Datos estructurados para SEO, E-E-A-T y motores generativos.
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND.name,
        legalName: BRAND.company,
        alternateName: "Cumbreva calculadora de autonomia",
        url: SITE_URL,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        email: BRAND.email,
        description: BRAND.description,
        knowsAbout: [
          "carro electrico",
          "vehiculo electrico",
          "autonomia real",
          "rutas con carga",
          "electrolineras en Colombia",
          "documentos del vehiculo",
        ],
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
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "App para carro electrico en Colombia | Cumbreva",
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
        applicationSubCategory: "App para carro electrico",
        operatingSystem: "Android, iOS",
        description: BRAND.description,
        url: SITE_URL,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#organization` },
        featureList: [
          "Estado de bateria y autonomia real",
          "Planeacion de rutas con paradas de carga",
          "Mapa de electrolineras y puntos para cargar",
          "Recomendaciones de carga con inteligencia artificial",
          "Documentos del vehiculo en un solo lugar",
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
