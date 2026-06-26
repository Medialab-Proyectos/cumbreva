import { Gift, Clock, Headset } from "lucide-react"
import { WaitlistForm } from "@/components/waitlist-form"

const perks = [
  {
    icon: Gift,
    title: "Acceso anticipado",
    desc: "Úsalo antes del lanzamiento oficial.",
  },
  {
    icon: Clock,
    title: "Sé de los primeros",
    desc: "Entérate antes que nadie del lanzamiento.",
  },
  {
    icon: Headset,
    title: "Soporte directo",
    desc: "Habla con el equipo por WhatsApp.",
  },
]

export function WaitlistSection() {
  return (
    <section id="lista-espera" className="relative overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="eyebrow mb-4 text-xs text-primary">Lista de espera</p>
        <h2 className="heading-display text-balance text-4xl text-foreground sm:text-5xl">
          Únete a la lista de espera
        </h2>
        <p className="mx-auto mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
          Déjanos tus datos y te avisaremos apenas Cumbreva esté disponible. Sé de los primeros en tener tu copiloto eléctrico.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {perks.map((perk) => (
            <li
              key={perk.title}
              className="rounded-2xl border border-border bg-card p-5 text-left"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <perk.icon className="size-5" />
              </span>
              <h3 className="font-heading text-base font-semibold uppercase tracking-tight text-foreground">
                {perk.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{perk.desc}</p>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-md text-left">
          <WaitlistForm />
        </div>
      </div>
    </section>
  )
}
