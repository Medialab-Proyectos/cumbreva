import Image from "next/image"
import { Check } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const points = [
  "Batería y autonomía real en tiempo real",
  "Rutas optimizadas con paradas de carga",
  "Garaje, servicios y documentos a la mano",
  "Modo claro y oscuro para cualquier momento",
]

export function AppShowcase() {
  return (
    <section id="app" className="relative isolate overflow-hidden">
      <Image
        src="/lifestyle-charging.png"
        alt="Persona usando la app Cumbreva junto a su vehículo eléctrico cargando de noche"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/80" />

      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-28">
        <p className="eyebrow mb-4 text-xs text-primary">La experiencia</p>
        <h2 className="heading-display text-balance text-4xl text-foreground sm:text-5xl">
          Hecha para que conducir eléctrico sea simple
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Sin tecnicismos, sin estrés. Cumbreva te muestra lo importante y te acompaña en cada kilómetro.
        </p>

        <ul className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-left">
          {points.map((p) => (
            <li
              key={p}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 backdrop-blur"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="size-3.5" />
              </span>
              <span className="text-pretty text-foreground">{p}</span>
            </li>
          ))}
        </ul>

        <a
          href="#lista-espera"
          className={cn(buttonVariants({ size: "lg" }), "mt-10 h-13 px-7 text-base font-semibold")}
        >
          Quiero ser de los primeros
        </a>
      </div>
    </section>
  )
}
