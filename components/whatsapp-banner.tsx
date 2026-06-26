"use client"

import { useEffect, useState } from "react"
import { CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function WhatsAppBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // La barra aparece solo cuando el usuario empieza a hacer scroll,
    // para no tapar/cortar el hero al cargar la pantalla.
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-primary/30 bg-background/90 backdrop-blur-xl transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <a
        href="#lista-espera"
        tabIndex={visible ? 0 : -1}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_-2px] shadow-primary/60">
            <CalendarCheck className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">
              Lista de espera abierta
            </p>
            <p className="text-xs text-muted-foreground">
              Gratis y sin compromiso. Sé de los primeros en probar Cumbreva.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Unirme
        </span>
      </a>
    </div>
  )
}
