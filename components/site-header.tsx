"use client"

import { MessageCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { whatsappUrl } from "@/lib/site"
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
          <a href="#app" className="transition-colors hover:text-foreground">
            La app
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            Preguntas
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden h-10 rounded-full border-primary/30 px-5 text-sm font-semibold text-primary hover:bg-primary/10 hover:text-primary sm:inline-flex [&_svg:not([class*='size-'])]:size-4",
            )}
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <a
            href="#lista-espera"
            className={cn(
              buttonVariants(),
              "h-10 rounded-full px-5 text-sm font-semibold hover:bg-primary/90",
            )}
          >
            Unirme
          </a>
        </div>
      </div>
    </header>
  )
}
