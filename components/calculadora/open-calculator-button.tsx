"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Loader2, X } from "lucide-react"

// Carga la calculadora solo cuando se abre el modal (no pesa el home).
const Calculator = dynamic(
  () => import("@/components/calculadora/calculator").then((m) => m.Calculator),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    ),
  },
)

/**
 * Abre la calculadora como POP-UP en escritorio y como VISTA NUEVA en móvil.
 * En móvil navega a /calculadora (pantalla completa, instalable como app).
 */
export function OpenCalculatorButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const abrir = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      router.push("/calculadora")
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <button type="button" onClick={abrir} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] overflow-y-auto bg-black/75 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="flex min-h-full items-start justify-center px-4 pb-10 pt-20 sm:px-8 sm:pt-24">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl border border-border bg-background p-5 shadow-2xl sm:p-8"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
              <Calculator />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
