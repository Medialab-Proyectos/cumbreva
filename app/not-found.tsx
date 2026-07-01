import Link from "next/link"
import { ArrowLeft, Mountain } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
          <Link href="/" aria-label="Ir a Cumbreva">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md text-center">
          <p className="heading-display text-7xl text-primary sm:text-8xl">404</p>
          <h1 className="heading-display mt-4 text-3xl text-foreground sm:text-4xl">
            Esta ruta no existe
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-pretty text-base leading-relaxed text-muted-foreground">
            La página que buscas se movió o nunca estuvo aquí. Pero tu próxima ruta sí la podemos calcular.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base font-semibold")}
            >
              <ArrowLeft className="size-5" />
              Volver al inicio
            </Link>
            <Link
              href="/calculadora"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-primary/40 px-6 text-base font-semibold hover:bg-primary/10",
              )}
            >
              <Mountain className="size-5 text-primary" />
              Ir a la calculadora
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
