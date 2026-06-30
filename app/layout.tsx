import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Oswald } from "next/font/google"
import { PwaRegister } from "@/components/pwa-register"
import { BRAND, SITE_URL } from "@/lib/site"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

const title = "Cumbreva | App para carro electrico en Colombia"
const description =
  "Cumbreva es una app para carro electrico en Colombia: bateria, autonomia real, rutas con carga, electrolineras y documentos del vehiculo en un solo lugar. Unete a la lista de espera gratis."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | Cumbreva",
  },
  description,
  applicationName: BRAND.name,
  generator: "Next.js",
  keywords: [
    "Cumbreva",
    "app carro electrico",
    "app vehiculo electrico Colombia",
    "copiloto electrico",
    "autonomia carro electrico",
    "autonomia real vehiculo electrico",
    "donde cargar carro electrico",
    "rutas de carga",
    "electrolineras Colombia",
    "carro electrico Colombia",
    "estaciones de carga para carros electricos",
    "app carga electrica",
    "bateria carro electrico",
    "bateria vehiculo electrico",
    "ansiedad de carga",
  ],
  authors: [{ name: BRAND.company, url: BRAND.companyUrl }],
  creator: BRAND.company,
  publisher: BRAND.company,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: BRAND.name,
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1731,
        height: 909,
        alt: "Cumbreva, app para carro electrico: maneja electrico sin ansiedad de carga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a1410",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-CO"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${oswald.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        <PwaRegister />
        <Analytics />
      </body>
    </html>
  )
}
