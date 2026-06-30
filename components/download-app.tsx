import Image from "next/image"
import Link from "next/link"
import { Mountain } from "lucide-react"
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
      </div>
    </section>
  )
}
