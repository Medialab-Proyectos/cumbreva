import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Gauge,
  MapPinned,
  MessageCircle,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react"
import { CumbrevaExplainer } from "@/components/seo/cumbreva-explainer"
import { Logo } from "@/components/logo"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { BRAND, SITE_URL } from "@/lib/site"
import type { SeoLanding } from "@/lib/seo-landings"
import { absoluteLandingUrl } from "@/lib/seo-landings"
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo-jsonld"
import { cn } from "@/lib/utils"

const detailIcons = [Gauge, MapPinned, BatteryCharging]

export function SeoLandingPage({ landing }: { landing: SeoLanding }) {
  const pagePath = `/seo/${landing.slug}`
  const pageUrl = absoluteLandingUrl(landing.slug)
  const homeUrl = `${SITE_URL}/`
  const breadcrumbItems = [
    { label: "Cumbreva", href: "/" },
    { label: "Guías" },
    { label: landing.title, href: pagePath },
  ]
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND.name,
      url: homeUrl,
      logo: `${SITE_URL}/android-chrome-512x512.png`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: BRAND.name,
      url: homeUrl,
      inLanguage: "es-CO",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      name: landing.title,
      description: landing.metaDescription,
      url: pageUrl,
      inLanguage: "es-CO",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      primaryImageOfPage: landing.heroImage
        ? { "@type": "ImageObject", url: absoluteUrl(landing.heroImage) }
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      inLanguage: "es-CO",
      isPartOf: { "@id": `${pageUrl}#webpage` },
      mainEntity: landing.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    breadcrumbJsonLd(breadcrumbItems),
  ]

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="/" aria-label="Ir a Cumbreva">
            <Logo />
          </a>
          <a
            href={landing.primaryCta.href}
            className={cn(
              buttonVariants(),
              "h-10 rounded-full px-4 text-sm font-semibold sm:px-5",
            )}
          >
            {landing.primaryCta.label}
            <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(72,224,123,0.08),transparent_62%)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:py-16">
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-xs text-primary">{landing.funnel}</p>
              <h1 className="heading-display mt-5 max-w-4xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
                {landing.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                {landing.lead}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={landing.primaryCta.href}
                  className={cn(
                    buttonVariants(),
                    "h-12 rounded-full px-6 text-base font-bold",
                  )}
                >
                  {landing.primaryCta.label}
                  <ArrowRight className="size-5" />
                </a>
                {landing.secondaryCta ? (
                  <a
                    href={landing.secondaryCta.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-12 rounded-full px-6 text-base font-bold",
                    )}
                  >
                    {landing.secondaryCta.label}
                  </a>
                ) : null}
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                {landing.proof.map((item, index) => {
                  const Icon = detailIcons[index] ?? CheckCircle2
                  return (
                    <div
                      key={item}
                      className="rounded-lg border border-border/70 bg-card/40 p-3"
                    >
                      <dt className="sr-only">{item}</dt>
                      <dd className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                        <Icon className="size-4 text-primary" />
                        {item}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>

            <div className="flex items-center">
              <figure className="w-full overflow-hidden rounded-lg border border-border bg-card/50">
                <img
                  src={landing.heroImage}
                  alt={landing.heroAlt}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="border-t border-border/70 p-4 text-sm text-muted-foreground">
                  <span>{landing.intent}</span>
                  {landing.imageCredit ? (
                    <span className="mt-3 block text-xs text-muted-foreground/70">
                      Imagen:{" "}
                      <a
                        href={landing.imageCredit.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {landing.imageCredit.label}
                      </a>
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <CumbrevaExplainer />

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-xs text-primary">Esto te pasa</p>
              <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                La duda no es tecnica. Es poder moverte tranquilo.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                {landing.audience}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {landing.painPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-lg border border-border/70 bg-card/35 p-4 text-sm leading-6 text-muted-foreground"
                >
                  <MessageCircle className="mb-4 size-5 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {landing.sections.map((section, index) => (
          <section
            key={section.title}
            className={cn(
              "border-b border-border/60",
              index % 2 === 0 ? "bg-card/20" : "bg-background",
            )}
          >
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="eyebrow text-xs text-primary">
                  {section.eyebrow}
                </p>
                <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  {section.body}
                </p>
              </div>

              <div className="grid content-start gap-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/55 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow text-xs text-primary">Usalo cuando</p>
              <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                {landing.checklistTitle}
              </h2>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {landing.checklist.map((item, index) => (
                <li
                  key={item}
                  className="rounded-lg border border-border/70 bg-card/40 p-4"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border/60 bg-card/20">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="eyebrow text-xs text-primary">
                  Preguntas frecuentes
                </p>
                <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                  Preguntas que convierten busqueda en accion
                </h2>
              </div>
              <div className="grid gap-3">
                {landing.faq.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-lg border border-border/70 bg-background/55 p-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground">
                      {item.question}
                      <Sparkles className="size-4 shrink-0 text-primary transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 rounded-lg border border-primary-foreground/20 bg-primary p-5 text-primary-foreground shadow-[0_18px_60px_-28px] shadow-primary sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase">
                <Share2 className="size-4" />
                {landing.shareLine}
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-primary-foreground/80">
                Si esto te ayudo a ordenar la decision, prueba Cumbreva y
                comparte la pagina con alguien que tambien este resolviendo
                como manejar electrico con mas confianza.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={landing.primaryCta.href}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#061a11] bg-[#061a11] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#10271b] hover:text-white focus-visible:ring-3 focus-visible:ring-[#061a11]/30"
              >
                {landing.primaryCta.label}
                <Zap className="size-4" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${landing.h1} - ${absoluteLandingUrl(landing.slug)}`,
                )}`}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#061a11] bg-[#061a11] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#10271b] hover:text-white focus-visible:ring-3 focus-visible:ring-[#061a11]/30"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share2 className="size-4" />
                Compartir
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
