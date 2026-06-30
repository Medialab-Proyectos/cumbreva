import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Calculator } from "@/components/calculadora/calculator"
import { LogoutButton } from "@/components/calculadora/logout-button"
import { HideOnStandalone } from "@/components/hide-on-standalone"
import { Logo } from "@/components/logo"
import { PwaInstallButton } from "@/components/pwa-install-button"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Calculadora de autonomia real para carro electrico",
  description:
    "Calcula si te alcanza la bateria de tu carro electrico entre dos puntos en Colombia y planea la ruta con carga segun desnivel real, clima por altitud y regeneracion en bajadas.",
  alternates: { canonical: "/calculadora" },
}

export default function CalculadoraPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <HideOnStandalone>
              <Link
                href="/"
                className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                <ArrowLeft className="size-4" />
                Volver a Cumbreva
              </Link>
              <PwaInstallButton className="h-9 px-4 text-sm" />
            </HideOnStandalone>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="px-5 py-6 sm:px-8 sm:py-10">
        <Calculator />
      </main>
      <HideOnStandalone>
        <SiteFooter />
      </HideOnStandalone>
    </div>
  )
}
