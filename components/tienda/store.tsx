"use client"

import { Minus, Plus, ShoppingCart } from "lucide-react"
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
  const { add, sub, qtyOf } = useCart()
  const qty = qtyOf(producto.id)
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40">
      <div className={cn("relative flex aspect-square items-center justify-center bg-gradient-to-br", producto.gradiente)}>
        <span className="text-6xl drop-shadow-lg transition-transform group-hover:scale-110">{producto.emoji}</span>
        {producto.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
            {producto.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-foreground">{producto.nombre}</h3>
        <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{producto.descripcion}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-foreground">{formatoCOP(producto.precio)}</span>
          {qty === 0 ? (
            <Button size="sm" onClick={() => add(producto.id)} className="font-semibold">
              <Plus className="size-3.5" /> Agregar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => sub(producto.id)} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                <Minus className="size-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => add(producto.id)} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
