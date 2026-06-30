"use client"

import { useEffect } from "react"

/**
 * Si la PWA instalada (modo standalone) se abre en el home, la lleva a la
 * calculadora. Cubre instalaciones viejas cuyo start_url quedó en "/".
 */
export function StandaloneHomeRedirect() {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari expone navigator.standalone
      window.navigator.standalone === true
    if (standalone && window.location.pathname === "/") {
      window.location.replace("/calculadora")
    }
  }, [])
  return null
}
