"use client"

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PRODUCTOS, formatoCOP, type Producto } from "@/lib/store-products"
import { useCart } from "@/components/tienda/cart-context"

export function Store() {
  const { count, setOpen } = useCart()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-primary">Tienda Cumbreva</div>
          <h1 className="heading-display mt-2 text-3xl text-foreground sm:text-4xl">Lleva la cumbre puesta</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Gorras, mugs, camisetas y hoodies de Cumbreva. Edición para los pioneros de la movilidad eléctrica.
          </p>
        </div>
        <Button size="lg" variant="outline" onClick={() => setOpen(true)} className="relative">
          <ShoppingCart className="size-4" />
          Carrito
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </header>

      <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2.5 text-xs leading-relaxed text-amber-300">
        <span className="mt-1 size-2 shrink-0 rounded-full bg-amber-400" />
        <span>
          Por ahora la tienda de Cumbreva funciona <strong>solo para Colombia</strong> como comercio electrónico. El pago
          en línea está en <strong>demo</strong> (no se cobra nada todavía).
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTOS.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  )
}

function ProductoCard({ producto }: { producto: Producto }) {
  const { add } = useCart()
  const [vista, setVista] = useState(0)
  const [talla, setTalla] = useState<string | null>(null)
  const [agregado, setAgregado] = useState(false)
  const [pideTalla, setPideTalla] = useState(false)

  const galeria = producto.galeria.length ? producto.galeria : [producto.gradiente]
  const rotar = (dir: number) => setVista((v) => (v + dir + galeria.length) % galeria.length)

  const onAgregar = () => {
    if (producto.tallas && !talla) {
      setPideTalla(true)
      return
    }
    add(producto.id, talla ?? undefined)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1400)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40">
      <div className={cn("relative flex aspect-square items-center justify-center bg-gradient-to-br transition-colors", galeria[vista])}>
        <span className="text-6xl drop-shadow-lg transition-transform group-hover:scale-110">{producto.emoji}</span>
        {producto.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
            {producto.badge}
          </span>
        )}
        {galeria.length > 1 && (
          <>
            <button
              onClick={() => rotar(-1)}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => rotar(1)}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
              {galeria.map((_, i) => (
                <span key={i} className={cn("size-1.5 rounded-full transition-colors", i === vista ? "bg-primary" : "bg-foreground/30")} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-foreground">{producto.nombre}</h3>
        <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{producto.descripcion}</p>

        {producto.tallas && (
          <div className="mt-3">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Talla</div>
            <div className="flex flex-wrap gap-1.5">
              {producto.tallas.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTalla(t); setPideTalla(false) }}
                  className={cn(
                    "flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors",
                    talla === t
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            {pideTalla && <p className="mt-1.5 text-[11px] text-amber-400">Elige una talla.</p>}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-foreground">{formatoCOP(producto.precio)}</span>
          <Button size="sm" onClick={onAgregar} className="font-semibold">
            {agregado ? <><Check className="size-3.5" /> Agregado</> : <><Plus className="size-3.5" /> Agregar</>}
          </Button>
        </div>
      </div>
    </div>
  )
}
