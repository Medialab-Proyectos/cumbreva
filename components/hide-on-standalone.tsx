"use client"

import { useEffect, useState } from "react"

/**
 * Oculta su contenido cuando la app corre como PWA instalada (standalone).
 * Sirve para que la calculadora-app no muestre el cromo del sitio (header
 * "Volver a Cumbreva", footer, etc.) — se ve como una app propia.
 */
export function HideOnStandalone({ children }: { children: React.ReactNode }) {
  const [standalone, setStandalone] = useState(false)
  useEffect(() => {
    setStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-expect-error iOS Safari
        window.navigator.standalone === true,
    )
  }, [])
  if (standalone) return null
  return <>{children}</>
}
