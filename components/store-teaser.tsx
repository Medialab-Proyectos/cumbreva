import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PRODUCTOS, formatoCOP } from "@/lib/store-products"

/** Teaser de la tienda en el home (visible y responsive). Lleva a /tienda. */
export function StoreTeaser() {
  return (
    <section id="tienda" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-primary">Tienda</div>
          <h2 className="heading-display mt-2 text-3xl text-foreground sm:text-4xl">Lleva la cumbre puesta</h2>
          <p className="mt-2 max-w-lg text-pretty text-sm text-muted-foreground sm:text-base">
            Camisetas, busos, tazas y peluches de Cumbreva. Para los pioneros de la movilidad electrica.
          </p>
        </div>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Ver la tienda <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PRODUCTOS.map((p) => (
          <Link
            key={p.id}
            href="/tienda"
            className="group flex w-[64%] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40 sm:w-[42%] lg:w-auto"
          >
            <div className="aspect-square overflow-hidden bg-muted/30">
              <img
                src={p.imagenes[0]}
                alt={p.nombre}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
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
