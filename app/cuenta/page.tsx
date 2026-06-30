import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AccountDashboard } from "@/components/calculadora/account-dashboard"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Mi cuenta — Cumbreva",
  description:
    "Tu cuenta Cumbreva: revisa cuántas búsquedas has usado y cuántas te quedan, tu historial de rutas y deja tu feedback.",
  alternates: { canonical: "/cuenta" },
  robots: { index: false, follow: false },
}

export default function CuentaPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver a Cumbreva
          </Link>
        </div>
      </header>
      <main className="px-5 py-10 sm:px-8 sm:py-14">
        <AccountDashboard />
      </main>
      <SiteFooter />
    </div>
  )
}
