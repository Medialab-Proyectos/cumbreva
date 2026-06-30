import type { MetadataRoute } from "next"
import { BRAND } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/calculadora",
    name: `${BRAND.name} — Calculadora de autonomía`,
    short_name: BRAND.name,
    description: BRAND.description,
    // La PWA es la calculadora (la app), no el sitio: al instalar abre aquí.
    start_url: "/calculadora",
    scope: "/",
    display: "standalone",
    background_color: "#0a1410",
    theme_color: "#0a1410",
    lang: "es-CO",
    categories: ["travel", "navigation", "utilities"],
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      // Mismas PNG con zona segura → no se recortan en Android (adaptive icon).
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "maskable" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  }
}
