import {
  BatteryCharging,
  Route,
  Zap,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react"

const features = [
  {
    icon: BatteryCharging,
    title: "Batería y autonomía",
    desc: "Conoce el estado de carga y los kilómetros reales disponibles en tiempo real.",
  },
  {
    icon: Route,
    title: "Planea tus rutas",
    desc: "Rutas optimizadas para tu autonomía, con paradas de carga inteligentes.",
  },
  {
    icon: Zap,
    title: "Carga sin estrés",
    desc: "Encuentra electrolineras cercanas y gestiona la carga desde la app.",
  },
  {
    icon: MapPin,
    title: "Electrolineras",
    desc: "Mapa de estaciones de carga disponibles, siempre actualizado.",
  },
  {
    icon: FileText,
    title: "Documentos",
    desc: "Tu vehículo y todos sus documentos, siempre bajo control.",
  },
  {
    icon: Wrench,
    title: "Servicios y beneficios",
    desc: "Agenda mantenimientos y accede a beneficios exclusivos.",
  },
]

export function Features() {
  return (
    <section id="funciones" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4 text-xs text-primary">Todo a mano</p>
        <h2 className="heading-display text-balance text-4xl text-foreground sm:text-5xl">
          Una sola app para tu vida eléctrica
        </h2>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
          Cumbreva reúne todo lo que necesitas para moverte con confianza en tu vehículo eléctrico.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/50"
          >
            <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform group-hover:scale-105">
              <f.icon className="size-6" />
            </span>
            <h3 className="font-heading mb-2 text-xl font-semibold uppercase tracking-tight text-foreground">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
