import type { MetadataRoute } from "next"
import { BRAND } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — Calculadora de autonomía`,
    short_name: BRAND.name,
    description: BRAND.description,
    // La PWA es la calculadora (la app), no el sitio: al instalar abre aquí.
    start_url: "/calculadora",
    display: "standalone",
    background_color: "#0a1410",
    theme_color: "#0a1410",
    lang: "es-CO",
    categories: ["travel", "navigation", "utilities"],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        // Maskable con zona segura → no se recorta el logo en Android.
        src: "/maskable.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "maskable",
      },
    ],
  }
}
