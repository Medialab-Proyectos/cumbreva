"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

/**
 * Si la PWA abre en "/" dentro de modo standalone, la mandamos a la calculadora.
 * Esto alinea la app instalada con el start_url y evita caer en el home por cache/fallback.
 */
export function StandaloneCalculatorRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== "/") return

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true

    if (standalone) router.replace("/calculadora")
  }, [pathname, router])

  return null
}
