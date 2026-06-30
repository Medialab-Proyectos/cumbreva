import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Info, Mountain } from "lucide-react"
import { PwaInstallButton } from "@/components/pwa-install-button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** CTA claro para instalar la PWA (la calculadora) en el celular. */
export function DownloadApp() {
  return (
    <section id="app-movil" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-primary/50 bg-primary p-8 text-center text-primary-foreground shadow-2xl shadow-primary/20 sm:p-12">
        <Image
          src="/icon-512.png"
          alt="Ícono de la app Cumbreva"
          width={88}
          height={88}
          className="rounded-[22px] shadow-xl shadow-black/30"
        />
        <div>
          <div className="eyebrow text-xs text-primary-foreground/70">App móvil</div>
          <h2 className="heading-display mt-2 text-3xl text-primary-foreground sm:text-4xl">
            Lleva Cumbreva en tu celular
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-primary-foreground/80 sm:text-base">
            Instala la calculadora de autonomía como app y úsala cuando quieras: tu cuota diaria, tu historial y tus
            rutas, siempre a la mano. Sin tiendas de apps, se instala desde el navegador.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <PwaInstallButton className="h-12 border-transparent bg-background px-6 text-base font-semibold text-foreground shadow-lg shadow-black/30 hover:bg-background/85 dark:border-transparent dark:bg-background dark:hover:bg-background/85" />
          <Link
            href="/calculadora"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-12 border-transparent bg-background px-6 text-base font-semibold text-foreground shadow-lg shadow-black/25 hover:bg-background/85",
            )}
          >
            <Mountain className="size-5 text-primary" />
            Abrir la calculadora
          </Link>
        </div>

        {/* Metodología (E-E-A-T) — colapsada por defecto, el usuario la abre */}
        <details className="group w-full text-left">
          <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary-foreground/90 transition-opacity hover:text-primary-foreground">
            <Info className="size-4" />
            Cómo calcula Cumbreva la autonomía real
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-4 space-y-6 rounded-2xl bg-background p-5 text-left text-foreground sm:p-6">
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-foreground">
                Cómo calculamos la autonomía real
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Partimos de la <strong className="text-foreground">capacidad útil de tu batería</strong> (kWh) y de la{" "}
                <strong className="text-foreground">carga actual</strong> (%). Sobre la ruta corregimos el consumo base
                del modelo (Wh/km) con varios factores:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">Desnivel y pendiente:</strong> subir consume más energía y el peso
                  del vehículo influye.
                </li>
                <li>
                  <strong className="text-foreground">Regeneración:</strong> en las bajadas se recupera parte de la
                  energía.
                </li>
                <li>
                  <strong className="text-foreground">Altitud y clima:</strong> la temperatura y la densidad del aire
                  cambian con la altura.
                </li>
                <li>
                  <strong className="text-foreground">Velocidad media</strong> estimada de la vía.
                </li>
                <li>
                  <strong className="text-foreground">Margen de seguridad:</strong> dejamos un colchón antes de indicar
                  que “alcanza”.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-foreground">
                Qué tener en cuenta
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Es una <strong className="text-foreground">estimación para ayudarte a planear</strong>, no una garantía.
                El consumo real también depende de tu estilo de conducción, el aire acondicionado, la carga del
                vehículo, el estado de la batería y el clima del momento. Conduce siempre con un margen y confirma los
                puntos de carga antes de viajar.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-foreground">
                Fuentes y límites del cálculo
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Fuentes:</strong> distancias, perfil de elevación y ruteo de
                OpenRouteService; especificaciones del modelo (capacidad, consumo y peso) del catálogo de la app.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Límites:</strong> no incluye tráfico en tiempo real, viento, estado
                de neumáticos o batería, ni desvíos. La disponibilidad de electrolineras puede variar. Úsalo como apoyo
                para decidir, no como única referencia de seguridad.
              </p>
            </div>
          </div>
        </details>
      </div>
    </section>
  )
}
