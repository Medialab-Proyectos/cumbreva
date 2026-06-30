import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Store } from "@/components/tienda/store"
import { CartButton } from "@/components/tienda/cart-button"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Tienda Cumbreva — camisetas, hoodies, gorras, tazas y peluches",
  description:
    "La tienda de Cumbreva: camisetas, hoodies, gorras, tazas y peluches para los pioneros de la movilidad eléctrica en Colombia.",
  alternates: { canonical: "/tienda" },
}

export default function TiendaPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver a Cumbreva
          </Link>
          <CartButton />
        </div>
      </header>
      <main className="px-5 py-10 sm:px-8 sm:py-14">
        <Store />
      </main>
      <SiteFooter />
    </div>
  )
}
