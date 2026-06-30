"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { PRODUCTOS, type Producto } from "@/lib/store-products"

type Cart = Record<string, number>

type CartItem = { producto: Producto; qty: number }

type CartCtx = {
  items: CartItem[]
  count: number
  total: number
  add: (id: string) => void
  sub: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  qtyOf: (id: string) => number
  open: boolean
  setOpen: (v: boolean) => void
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = "cumbreva_cart_v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({})
  const [open, setOpen] = useState(false)
  const [hidratado, setHidratado] = useState(false)

  // Carga el carrito guardado (persiste entre páginas y visitas).
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

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const sub = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1
      const next = { ...c }
      if (n <= 0) delete next[id]
      else next[id] = n
      return next
    })
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c }
      delete next[id]
      return next
    })
  const clear = () => setCart({})

  const items = useMemo<CartItem[]>(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ producto: PRODUCTOS.find((p) => p.id === id)!, qty }))
        .filter((i) => i.producto && i.qty > 0),
    [cart],
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.producto.precio * i.qty, 0)
  const qtyOf = (id: string) => cart[id] ?? 0

  return (
    <Ctx.Provider value={{ items, count, total, add, sub, remove, clear, qtyOf, open, setOpen }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
  return ctx
}
