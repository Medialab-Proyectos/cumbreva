import {
  BatteryCharging,
  FileText,
  MapPin,
  Route,
  ShieldCheck,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: BatteryCharging,
    title: "Bateria y autonomia real",
    desc: "Consulta tu estado de carga y una autonomia mas aterrizada para el uso diario.",
  },
  {
    icon: Route,
    title: "Rutas con carga",
    desc: "Planea trayectos con paradas de carga segun la autonomia disponible.",
  },
  {
    icon: Zap,
    title: "Recomendaciones de carga",
    desc: "Recibe apoyo para cargar con mas criterio y reducir la ansiedad de carga.",
  },
  {
    icon: MapPin,
    title: "Electrolineras",
    desc: "Ubica estaciones de carga cercanas para moverte con mas confianza.",
  },
  {
    icon: FileText,
    title: "Documentos",
    desc: "Ten a la mano la informacion y los documentos clave de tu vehiculo.",
  },
  {
    icon: ShieldCheck,
    title: "Control diario",
    desc: "Todo lo importante de tu carro electrico en una sola app, sin saltar entre herramientas.",
  },
]

export function Features() {
  return (
    <section id="funciones" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4 text-xs text-primary">Todo a mano</p>
        <h2 className="heading-display text-balance text-4xl text-foreground sm:text-5xl">
          Una sola app para tu vida electrica
        </h2>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
          Cumbreva reune lo esencial para conducir un vehiculo electrico con mas claridad:
          autonomia, carga, ruta y control del vehiculo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/50"
          >
            <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary transition-transform group-hover:scale-105">
              <feature.icon className="size-6" />
            </span>
            <h3 className="font-heading mb-2 text-xl font-semibold uppercase tracking-tight text-foreground">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
