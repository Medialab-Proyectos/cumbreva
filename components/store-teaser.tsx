import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PRODUCTOS, formatoCOP } from "@/lib/store-products"
import { cn } from "@/lib/utils"

/** Teaser de la tienda en el home (visible y responsive). Lleva a /tienda. */
export function StoreTeaser() {
  return (
    <section id="tienda" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-primary">Tienda</div>
          <h2 className="heading-display mt-2 text-3xl text-foreground sm:text-4xl">Lleva la cumbre puesta</h2>
          <p className="mt-2 max-w-lg text-pretty text-sm text-muted-foreground sm:text-base">
            Gorras, mugs, camisetas y hoodies de Cumbreva. Para los pioneros de la movilidad eléctrica.
          </p>
        </div>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Ver la tienda <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PRODUCTOS.map((p) => (
          <Link
            key={p.id}
            href="/tienda"
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
          >
            <div className={cn("flex aspect-square items-center justify-center bg-gradient-to-br", p.gradiente)}>
              <span className="text-5xl transition-transform group-hover:scale-110 sm:text-6xl">{p.emoji}</span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4">
              <span className="truncate text-sm font-medium text-foreground">{p.nombre.replace("Cumbreva", "").trim()}</span>
              <span className="shrink-0 text-sm font-bold text-foreground">{formatoCOP(p.precio)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
