import Image from "next/image"
import { Clock, Gift, Headset } from "lucide-react"
import { WaitlistForm } from "@/components/waitlist-form"

const perks = [
  {
    icon: Gift,
    title: "Acceso anticipado",
    desc: "Usalo antes del lanzamiento oficial.",
  },
  {
    icon: Clock,
    title: "Se de los primeros",
    desc: "Enterate antes que nadie del lanzamiento.",
  },
  {
    icon: Headset,
    title: "Soporte directo",
    desc: "Acompanamiento cercano del equipo en cada paso.",
  },
]

export function WaitlistSection() {
  return (
    <section id="lista-espera" className="relative overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-left">
          <p className="eyebrow mb-4 text-xs text-primary">Lista de espera</p>
          <h2 className="heading-display text-balance text-4xl text-foreground lg:text-5xl">
            Unete a la lista de espera
          </h2>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
            Dejanos tus datos y te avisaremos apenas Cumbreva este disponible. Se de los
            primeros en probar un copiloto para carro electrico pensado para Colombia.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-stretch sm:gap-8 lg:gap-14">
          {/* Izquierda: imagen + cajas de beneficios */}
          <div className="flex min-w-0 flex-col">
            <div className="overflow-hidden rounded-2xl border border-border shadow-xl shadow-black/25">
              <Image
                src="/waitlist-couple.png"
                alt="Pareja revisando la autonomia de su carro electrico en la app Cumbreva mientras carga"
                width={1402}
                height={1122}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            <ul className="mt-5 grid flex-1 grid-cols-3 grid-rows-1 gap-3">
              {perks.map((perk) => (
                <li
                  key={perk.title}
                  className="flex flex-col justify-start gap-3 rounded-xl border border-border bg-card/70 p-4 text-left"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <perk.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-base">
                      {perk.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{perk.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: formulario */}
          <div className="min-w-0 text-left">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  )
}
