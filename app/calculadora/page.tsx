import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Calculator } from "@/components/calculadora/calculator"
import { HideOnStandalone } from "@/components/hide-on-standalone"
import { PwaInstallButton } from "@/components/pwa-install-button"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Calculadora de autonomía real para carros eléctricos",
  description:
    "Calcula si la batería de tu carro eléctrico realmente alcanza entre dos puntos en Colombia, corrigiendo por el desnivel real del terreno, clima por altitud y regeneración en bajadas.",
  alternates: { canonical: "/calculadora" },
}

export default function CalculadoraPage() {
  return (
    <div className="min-h-dvh bg-background">
      <HideOnStandalone>
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Volver a Cumbreva
            </Link>
            <PwaInstallButton className="h-9 px-4 text-sm" />
          </div>
        </header>
      </HideOnStandalone>
      <main className="px-5 py-10 sm:px-8 sm:py-14">
        <Calculator />
      </main>
      <HideOnStandalone>
        <SiteFooter />
      </HideOnStandalone>
    </div>
  )
}
