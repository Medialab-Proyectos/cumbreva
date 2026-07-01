import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Oswald } from "next/font/google"
import { PwaRegister } from "@/components/pwa-register"
import { CartProvider } from "@/components/tienda/cart-context"
import { CartDrawer } from "@/components/tienda/cart-drawer"
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

const title = "Cumbreva | Calcula si llegas en carro electrico"
const description =
  "No adivines la autonomia. Antes de salir, calcula si tu carro electrico llega con la bateria actual, la ruta real y la montana colombiana."

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
    "calculadora carro electrico",
    "calculadora autonomia carro electrico",
    "app vehiculo electrico Colombia",
    "copiloto electrico",
    "autonomia carro electrico",
    "autonomia real vehiculo electrico",
    "me alcanza la bateria",
    "como planear ruta carro electrico",
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
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  publisher: BRAND.name,
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
        alt: "Cumbreva: calcula si llegas antes de salir en carro electrico",
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
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
  appleWebApp: {
    title: BRAND.name,
    capable: true,
    statusBarStyle: "black-translucent",
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
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <PwaRegister />
        <Analytics />
      </body>
    </html>
  )
}
