// Configuracion central de Cumbreva. Edita estos valores facilmente.

// Numero de WhatsApp en formato internacional, solo digitos (sin + ni espacios).
export const WHATSAPP_NUMBER = "573000000000"

export const WHATSAPP_MESSAGE =
  "Hola, quiero mas informacion sobre Cumbreva y unirme a la lista de espera."

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

// URL de produccion. Se puede sobreescribir en Vercel con NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cumbreva.medialab.design"
).replace(/\/$/, "")

export const BRAND = {
  name: "Cumbreva",
  tagline: "Tu copiloto electrico",
  description:
    "Antes de salir, Cumbreva calcula si tu carro electrico llega con la bateria actual, la ruta real y la montana colombiana.",
  company: "Medialab Ingenieria",
  companyUrl: "https://medialab.design/",
  country: "Colombia",
  email: "medialabproyectos@gmail.com",
}
