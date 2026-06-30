import Image from "next/image"
import { CalendarCheck, Check, Mountain } from "lucide-react"
import { OpenCalculatorButton } from "@/components/calculadora/open-calculator-button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const benefits = ["Acceso anticipado gratis", "Sin permanencia"]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <Image
        src="/hero-route.png"
        alt="Vehiculo electrico recorriendo una carretera con su ruta de carga trazada por Cumbreva"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_center] lg:object-left"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_auto] lg:gap-4">
        <div className="flex max-w-2xl flex-col justify-center self-center">
          <div className="flex items-center gap-2">
            <span
              className="flex size-2 rounded-full bg-primary shadow-[0_0_12px_2px] shadow-primary/60"
              aria-hidden="true"
            />
            <span className="eyebrow text-xs text-primary">Lista de espera abierta</span>
          </div>

          <h1 className="heading-display mt-5 text-balance text-4xl text-foreground sm:mt-6 sm:text-6xl lg:text-6xl xl:text-7xl">
            Maneja un electrico sin <span className="text-primary">ansiedad de carga</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            Cumbreva es <span className="font-semibold text-foreground">tu copiloto electrico</span>:
            revisa si te alcanza la bateria, planea una ruta con carga y encuentra donde cargar tu carro electrico
            en Colombia desde una sola app.
          </p>

          <p className="mt-3 max-w-xl text-sm font-medium text-foreground/80 sm:text-base">
            Para quienes buscan respuestas concretas: cuanto dura la bateria, donde cargar y como planear una ruta
            larga sin adivinar.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <a
              href="#lista-espera"
              className={cn(buttonVariants({ size: "lg" }), "h-13 px-7 text-base font-semibold")}
            >
              <CalendarCheck className="size-5" />
              Unirme a la lista
            </a>
            <OpenCalculatorButton
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-13 border-primary/40 bg-background/40 px-7 text-base font-semibold backdrop-blur hover:bg-primary/10",
              )}
            >
              <Mountain className="size-5 text-primary" />
              Calcula tu ruta gratis
            </OpenCalculatorButton>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 sm:mt-8">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <Check className="size-3.5 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden justify-self-center lg:block">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full bg-primary/25 blur-[90px]"
          />
          <Image
            src="/cumbreva-app-mockup.png"
            alt="Pantalla de la app Cumbreva mostrando bateria, autonomia y planeacion de ruta del vehiculo electrico"
            width={649}
            height={1269}
            priority
            sizes="(min-width: 1024px) 300px, 0px"
            className="h-auto w-[280px] drop-shadow-2xl xl:w-[320px]"
          />
        </div>
      </div>
    </section>
  )
}
