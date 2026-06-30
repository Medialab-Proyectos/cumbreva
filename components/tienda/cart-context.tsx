"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { PRODUCTOS, type Producto } from "@/lib/store-products"

type Cart = Record<string, number> // clave = id o `id::talla`

type CartItem = { lineKey: string; producto: Producto; talla?: string; qty: number }

type CartCtx = {
  items: CartItem[]
  count: number
  total: number
  add: (id: string, talla?: string) => void
  inc: (lineKey: string) => void
  dec: (lineKey: string) => void
  removeLine: (lineKey: string) => void
  clear: () => void
  qtyOf: (id: string, talla?: string) => number
  open: boolean
  setOpen: (v: boolean) => void
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = "cumbreva_cart_v2"

const keyOf = (id: string, talla?: string) => (talla ? `${id}::${talla}` : id)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({})
  const [open, setOpen] = useState(false)
  const [hidratado, setHidratado] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setCart(JSON.parse(raw))
    } catch {
      /* sin almacenamiento */
    }
    setHidratado(true)
  }, [])

  useEffect(() => {
    if (!hidratado) return
    try {
      localStorage.setItem(KEY, JSON.stringify(cart))
    } catch {
      /* no-op */
    }
  }, [cart, hidratado])

  const add = (id: string, talla?: string) =>
    setCart((c) => {
      const k = keyOf(id, talla)
      return { ...c, [k]: (c[k] ?? 0) + 1 }
    })
  const inc = (lineKey: string) => setCart((c) => ({ ...c, [lineKey]: (c[lineKey] ?? 0) + 1 }))
  const dec = (lineKey: string) =>
    setCart((c) => {
      const n = (c[lineKey] ?? 0) - 1
      const next = { ...c }
      if (n <= 0) delete next[lineKey]
      else next[lineKey] = n
      return next
    })
  const removeLine = (lineKey: string) =>
    setCart((c) => {
      const next = { ...c }
      delete next[lineKey]
      return next
    })
  const clear = () => setCart({})

  const items = useMemo<CartItem[]>(
    () =>
      Object.entries(cart)
        .map(([lineKey, qty]) => {
          const [id, talla] = lineKey.split("::")
          return { lineKey, producto: PRODUCTOS.find((p) => p.id === id)!, talla, qty }
        })
        .filter((i) => i.producto && i.qty > 0),
    [cart],
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.producto.precio * i.qty, 0)
  const qtyOf = (id: string, talla?: string) => cart[keyOf(id, talla)] ?? 0

  return (
    <Ctx.Provider value={{ items, count, total, add, inc, dec, removeLine, clear, qtyOf, open, setOpen }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}
