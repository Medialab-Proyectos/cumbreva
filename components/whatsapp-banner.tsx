import { MessageCircle } from "lucide-react"
import { whatsappUrl } from "@/lib/site"

export function WhatsAppBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/30 bg-background/90 backdrop-blur-xl">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_-2px] shadow-primary/60">
            <MessageCircle className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">
              ¿Hablamos por WhatsApp?
            </p>
            <p className="text-xs text-muted-foreground">
              Resuelve tus dudas y entra a la lista al instante.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Escribir
        </span>
      </a>
    </div>
  )
}
