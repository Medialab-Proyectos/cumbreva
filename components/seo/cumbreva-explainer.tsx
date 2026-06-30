import { BatteryCharging, History, MapPinned, Zap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CumbrevaExplainer() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="eyebrow text-xs text-primary">Que es Cumbreva</p>
          <h2 className="heading-display mt-4 text-4xl text-foreground sm:text-5xl">
            Un copiloto electrico para saber si llegas antes de salir
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Cumbreva es una herramienta para conductores de carros electricos en
            Colombia. Te ayuda a convertir bateria, ruta, montana y carga en
            una decision simple: salir tranquilo, cargar antes o cambiar el
            plan.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/"
              className={cn(
                buttonVariants(),
                "h-11 rounded-full px-5 text-sm font-bold",
              )}
            >
              Ir a la web
            </a>
            <a
              href="/calculadora"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 rounded-full px-5 text-sm font-bold",
              )}
            >
              Calcular mi ruta
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 bg-card/40 p-4">
            <Zap className="size-5 text-primary" />
            <h3 className="mt-4 text-sm font-bold uppercase text-foreground">
              Calcula si llegas
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Revisa tu autonomia real con el porcentaje de bateria, destino y
              condiciones de la ruta.
            </p>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/40 p-4">
            <MapPinned className="size-5 text-primary" />
            <h3 className="mt-4 text-sm font-bold uppercase text-foreground">
              Planea carga
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Identifica cuando conviene cargar antes, durante o despues del
              trayecto.
            </p>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/40 p-4">
            <BatteryCharging className="size-5 text-primary" />
            <h3 className="mt-4 text-sm font-bold uppercase text-foreground">
              Entiende tu bateria
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No dependas solo del rango del tablero: mira margen de llegada y
              consumo esperado.
            </p>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/40 p-4">
            <History className="size-5 text-primary" />
            <h3 className="mt-4 text-sm font-bold uppercase text-foreground">
              Recuerda rutas
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Guarda aprendizajes, comentarios y decisiones para manejar mejor
              la proxima vez.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
