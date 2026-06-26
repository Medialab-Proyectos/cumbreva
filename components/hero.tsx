import Image from "next/image"
import { MessageCircle, CalendarCheck, Check, Star } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

const benefits = ["Acceso anticipado gratis", "Sin permanencia", "Cupos limitados"]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      {/* Background photo */}
      <Image
        src="/hero-person.png"
        alt="Conductora sonriendo mientras revisa su vehículo eléctrico en la app Cumbreva"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      {/* Overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="eyebrow text-xs text-primary">Lista de espera abierta</span>
          </div>

          <h1 className="heading-display mt-6 text-balance text-5xl text-foreground sm:text-6xl lg:text-7xl">
            Maneja eléctrico sin <span className="text-primary">ansiedad de carga</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Cumbreva es <span className="font-semibold text-foreground">tu copiloto eléctrico</span>: batería,
            autonomía real, rutas con carga y tus documentos, todo en un solo lugar. Sé de los primeros en probarlo.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#lista-espera"
              className={cn(buttonVariants({ size: "lg" }), "h-13 px-7 text-base font-semibold")}
            >
              <CalendarCheck className="size-5" />
              Unirme a la lista
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-13 border-foreground/20 bg-background/40 px-7 text-base font-semibold backdrop-blur hover:bg-background/60",
              )}
            >
              <MessageCircle className="size-5 text-primary" />
              Hablar por WhatsApp
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/15">
                  <Check className="size-3 text-primary" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
