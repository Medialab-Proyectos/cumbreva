// Configuración central de Cumbreva. Edita estos valores fácilmente.

// Número de WhatsApp en formato internacional, solo dígitos (sin + ni espacios).
export const WHATSAPP_NUMBER = "573000000000"

export const WHATSAPP_MESSAGE =
  "Hola, quiero más información sobre Cumbreva y unirme a la lista de espera."

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

// URL de producción. Configúrala en Vercel/host con NEXT_PUBLIC_SITE_URL.
// El default debe reemplazarse por el dominio real cuando se confirme.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cumbreva.com"
).replace(/\/$/, "")

export const BRAND = {
  name: "Cumbreva",
  tagline: "Tu copiloto eléctrico",
  description:
    "Cumbreva es el copiloto inteligente para tu vehículo eléctrico: batería, autonomía real, rutas con carga, recomendaciones con IA y tus documentos en un solo lugar.",
  company: "Medialab Ingeniería",
  companyUrl: "https://medialab.design/",
  country: "Colombia",
  email: "medialabproyectos@gmail.com",
}
