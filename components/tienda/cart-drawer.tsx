"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatoCOP } from "@/lib/store-products"
import { useCart } from "@/components/tienda/cart-context"

/** Panel global del carrito. Se monta una vez y se abre desde cualquier página. */
export function CartDrawer() {
  const { items, total, inc, dec, removeLine, clear, open, setOpen } = useCart()
  const [pagado, setPagado] = useState(false)
  const router = useRouter()

  if (!open) return null

  const cerrar = () => {
    setOpen(false)
    setTimeout(() => setPagado(false), 200)
  }

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-black/70 backdrop-blur-sm" onClick={cerrar}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-card"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <ShoppingBag className="size-5 text-primary" /> Tu carrito
          </h2>
          <button onClick={cerrar} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>

        {pagado ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-7" />
            </span>
            <h3 className="text-xl font-bold text-foreground">¡Pedido demo confirmado!</h3>
            <p className="text-sm text-muted-foreground">
              Esto es una demostración. Pronto activaremos el pago real con tarjeta para envíos en Colombia.
            </p>
            <Button variant="outline" onClick={() => { clear(); cerrar() }}>Seguir explorando</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
            <ShoppingCart className="size-9 opacity-50" />
            <p className="text-sm">Tu carrito está vacío.</p>
            <Button onClick={() => { setOpen(false); router.push("/tienda") }} className="font-semibold">
              Ir a la tienda
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <ul className="flex flex-col gap-3">
                {items.map(({ lineKey, producto, talla, qty }) => (
                  <li key={lineKey} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
                    <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xl", producto.gradiente)}>
                      {producto.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {producto.nombre}{talla ? <span className="text-muted-foreground"> · {talla}</span> : null}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatoCOP(producto.precio)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => dec(lineKey)} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm">{qty}</span>
                      <button onClick={() => inc(lineKey)} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeLine(lineKey)} className="text-muted-foreground hover:text-destructive" aria-label="Quitar">
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">{formatoCOP(total)}</span>
              </div>
              <Button size="lg" className="h-12 w-full font-semibold" onClick={() => setPagado(true)}>
                Pagar (demo)
              </Button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
                Pago simulado. No se cobra nada. Envíos solo en Colombia.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
