"use client"

import { useMemo, useState } from "react"
import { Check, Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PRODUCTOS, formatoCOP, type Producto } from "@/lib/store-products"

type Carrito = Record<string, number>

export function Store() {
  const [carrito, setCarrito] = useState<Carrito>({})
  const [abierto, setAbierto] = useState(false)
  const [pagado, setPagado] = useState(false)

  const items = useMemo(
    () =>
      Object.entries(carrito)
        .map(([id, qty]) => ({ producto: PRODUCTOS.find((p) => p.id === id)!, qty }))
        .filter((i) => i.producto && i.qty > 0),
    [carrito],
  )
  const total = items.reduce((s, i) => s + i.producto.precio * i.qty, 0)
  const cantidad = items.reduce((s, i) => s + i.qty, 0)

  const add = (id: string) => setCarrito((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const sub = (id: string) => setCarrito((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }))
  const quitar = (id: string) => setCarrito((c) => { const n = { ...c }; delete n[id]; return n })

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
        <Button size="lg" variant="outline" onClick={() => setAbierto(true)} className="relative">
          <ShoppingCart className="size-4" />
          Carrito
          {cantidad > 0 && (
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {cantidad}
            </span>
          )}
        </Button>
      </header>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-300">
        <span className="size-2 rounded-full bg-amber-400" /> Demo — el pago aún no está activo. Envíos solo dentro de Colombia.
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTOS.map((p) => (
          <ProductoCard key={p.id} producto={p} qty={carrito[p.id] ?? 0} onAdd={() => add(p.id)} onSub={() => sub(p.id)} />
        ))}
      </div>

      {/* Carrito (drawer) */}
      {abierto && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm" onClick={() => setAbierto(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l border-border bg-card"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <ShoppingBag className="size-5 text-primary" /> Tu carrito
              </h2>
              <button onClick={() => setAbierto(false)} className="text-muted-foreground hover:text-foreground">
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
                <Button variant="outline" onClick={() => { setPagado(false); setCarrito({}); setAbierto(false) }}>
                  Seguir explorando
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
                <ShoppingCart className="size-8 opacity-50" />
                <p className="text-sm">Tu carrito está vacío.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  <ul className="flex flex-col gap-3">
                    {items.map(({ producto, qty }) => (
                      <li key={producto.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
                        <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xl", producto.gradiente)}>
                          {producto.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{producto.nombre}</p>
                          <p className="text-xs text-muted-foreground">{formatoCOP(producto.precio)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => sub(producto.id)} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm">{qty}</span>
                          <button onClick={() => add(producto.id)} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button onClick={() => quitar(producto.id)} className="text-muted-foreground hover:text-destructive">
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
      )}
    </div>
  )
}

function ProductoCard({ producto, qty, onAdd, onSub }: { producto: Producto; qty: number; onAdd: () => void; onSub: () => void }) {
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
            <Button size="sm" onClick={onAdd} className="font-semibold">
              <Plus className="size-3.5" /> Agregar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onSub} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                <Minus className="size-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-medium">{qty}</span>
              <button onClick={onAdd} className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted">
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
