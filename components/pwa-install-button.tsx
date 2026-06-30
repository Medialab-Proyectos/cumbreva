"use client"

import { useEffect, useState } from "react"
import { Check, Download, Share, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

/**
 * Botón para instalar Cumbreva como app (PWA).
 * - Chrome/Android/Edge: usa el evento nativo `beforeinstallprompt`.
 * - iOS/Safari (sin evento): muestra instrucciones para "Añadir a inicio".
 */
export function PwaInstallButton({ className }: { className?: string }) {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [instalada, setInstalada] = useState(false)
  const [verAyuda, setVerAyuda] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true
    if (standalone) setInstalada(true)

    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
    }
    const onInstalled = () => setInstalada(true)
    window.addEventListener("beforeinstallprompt", onBIP)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  if (instalada) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm text-primary", className)}>
        <Check className="size-4" /> App instalada
      </span>
    )
  }

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
    } else {
      setVerAyuda(true)
    }
  }

  return (
    <>
      <Button variant="outline" size="lg" onClick={onClick} className={className}>
        <Download className="size-4 text-primary" />
        Descargar la app
      </Button>

      {verAyuda && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setVerAyuda(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Instala Cumbreva</h3>
              <button onClick={() => setVerAyuda(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Para llevar Cumbreva en tu celular como app:
            </p>
            <ol className="flex flex-col gap-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <Share className="size-4 text-primary" /> Toca el botón <strong>Compartir</strong> del navegador.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">＋</span> Elige <strong>Añadir a pantalla de inicio</strong>.
              </li>
            </ol>
            <Button className="mt-5 w-full" onClick={() => setVerAyuda(false)}>Entendido</Button>
          </div>
        </div>
      )}
    </>
  )
}
