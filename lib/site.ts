// Configuración central de Cumbreva. Edita estos valores fácilmente.

// Número de WhatsApp en formato internacional, solo dígitos (sin + ni espacios).
export const WHATSAPP_NUMBER = "573000000000"

export const WHATSAPP_MESSAGE =
  "Hola, quiero más información sobre Cumbreva y unirme a la lista de espera."

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

export const BRAND = {
  name: "Cumbreva",
  tagline: "Tu copiloto eléctrico",
  company: "Medialab Ingeniería",
  companyUrl: "https://medialab.design/",
}
