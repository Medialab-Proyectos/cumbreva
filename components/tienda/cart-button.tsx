"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/tienda/cart-context"

/**
 * Botón del carrito para el header. Muestra el contador; si hay productos abre
 * el panel del carrito, y si está vacío lleva a la tienda.
 */
export function CartButton({ className }: { className?: string }) {
  const { count, setOpen } = useCart()
  const router = useRouter()

  const onClick = () => {
    if (count > 0) setOpen(true)
    else router.push("/tienda")
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `Carrito (${count})` : "Ir a la tienda"}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  )
}
