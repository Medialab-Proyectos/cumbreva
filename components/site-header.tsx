"use client"

import { ShoppingBag } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#funciones" className="transition-colors hover:text-foreground">
            Funciones
          </a>
          <a href="/calculadora" className="transition-colors hover:text-foreground">
            Calculadora
          </a>
          <a href="/tienda" className="transition-colors hover:text-foreground">
            Tienda
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            Preguntas
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="/tienda"
            aria-label="Tienda"
            className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ShoppingBag className="size-5" />
          </a>
          <a
            href="#lista-espera"
            className={cn(
              buttonVariants(),
              "h-10 rounded-full px-5 text-sm font-semibold hover:bg-primary/90",
            )}
          >
            Unirme a la lista
          </a>
        </div>
      </div>
    </header>
  )
}
