"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Fila tipo carrusel: scroll horizontal con snap (swipe en móvil) y flechas
 * de navegación visibles en pantallas con mouse (sm+). `className` se aplica
 * al contenedor que hace scroll.
 */
export function CarouselRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const mover = (dir: number) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => mover(-1)}
        aria-label="Ver anteriores"
        className="absolute left-1 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => mover(1)}
        aria-label="Ver siguientes"
        className="absolute right-1 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
