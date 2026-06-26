import { CalendarCheck } from "lucide-react"

export function WhatsAppBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/30 bg-background/90 backdrop-blur-xl">
      <a
        href="#lista-espera"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_-2px] shadow-primary/60">
            <CalendarCheck className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">
              Lista de espera abierta
            </p>
            <p className="text-xs text-muted-foreground">
              Gratis y sin compromiso. Sé de los primeros en probar Cumbreva.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Unirme
        </span>
      </a>
    </div>
  )
}
