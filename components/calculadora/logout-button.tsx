"use client"

import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"
import { deviceHash } from "@/lib/calc-physics"

/**
 * Botón "Salir" para el header de la calculadora. Solo aparece si hay sesión
 * registrada. Al salir hace logout y recarga, de modo que la calculadora
 * reinicia su estado de sesión sin acoplarse a este componente.
 */
export function LogoutButton() {
  const [registrado, setRegistrado] = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    let cancel = false
    fetch("/api/calc/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceHash: deviceHash() }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (!cancel) setRegistrado(j?.estado === "registrado")
      })
      .catch(() => {})
    return () => {
      cancel = true
    }
  }, [])

  if (!registrado) return null

  const salir = async () => {
    setSaliendo(true)
    await fetch("/api/calc/logout", { method: "POST" }).catch(() => {})
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={salir}
      disabled={saliendo}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:opacity-50"
      aria-label="Salir"
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">Salir</span>
    </button>
  )
}
