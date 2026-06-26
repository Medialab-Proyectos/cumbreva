import { Logo } from "@/components/logo"
import { BRAND } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 pb-28 pt-10 sm:px-6 md:flex-row md:pb-32">
        <Logo />
        <p className="text-center text-sm text-muted-foreground md:text-right">
          Un producto de{" "}
          <a
            href={BRAND.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {BRAND.company}
          </a>
          <br className="md:hidden" />
          <span className="md:ml-2">
            © {new Date().getFullYear()} {BRAND.name}. Todos los derechos
            reservados.
          </span>
        </p>
      </div>
    </footer>
  )
}
