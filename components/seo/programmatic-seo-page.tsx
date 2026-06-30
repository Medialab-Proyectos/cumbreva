import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Gauge,
  MapPinned,
  Route,
  Share2,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { CumbrevaExplainer } from "@/components/seo/cumbreva-explainer"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import type { ProgrammaticSeoPage } from "@/lib/programmatic-seo"
import { absoluteProgrammaticUrl } from "@/lib/programmatic-seo"
import { modelInsightForPath } from "@/lib/model-seo-insights"
import { breadcrumbJsonLd } from "@/lib/seo-jsonld"
import { BRAND } from "@/lib/site"
import { cn } from "@/lib/utils"

const statIcons = [Route, Gauge, BatteryCharging]

export function ProgrammaticSeoPageView({
  page,
}: {
  page: ProgrammaticSeoPage
}) {
  const modelInsight = modelInsightForPath(page.path)
  const breadcrumbItems = [
    { label: "Cumbreva", href: "/" },
    ...(page.group === "route" ? [{ label: "Rutas" }] : []),
    ...(page.group === "model" ? [{ label: "Modelos" }] : []),
    { label: page.title, href: page.path },
  ]
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: absoluteProgrammaticUrl(page.path),
      inLanguage: "es-CO",
      keywords: page.keywords.join(", "),
      isPartOf: {
        "@type": "WebSite",
        name: BRAND.name,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    breadcrumbJsonLd(breadcrumbItems),
    ...(page.group === "route"
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page.title,
            description: page.description,
            image: absoluteProgrammaticUrl(page.heroImage),
            url: absoluteProgrammaticUrl(page.path),
            inLanguage: "es-CO",
            author: {
              "@type": "Organization",
              name: BRAND.name,
            },
            publisher: {
              "@type": "Organization",
              name: BRAND.name,
              logo: {
                "@type": "ImageObject",
                url: absoluteProgrammaticUrl("/android-chrome-512x512.png"),
              },
            },
            articleSection: "Rutas para carros electricos",
            abstract:
              "Informacion estimada para planear una ruta electrica. La distancia, el consumo, la carga recomendada y los riesgos pueden cambiar segun origen exacto, modelo del vehiculo, bateria, clima, trafico y disponibilidad de carga.",
            dateModified: new Date().toISOString(),
          },
        ]
      : []),
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
            href={page.primaryCta.href}
            className={cn(
              buttonVariants(),
              "h-10 rounded-full px-4 text-sm font-semibold sm:px-5",
            )}
          >
            {page.primaryCta.label}
            <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(72,224,123,0.1),transparent_68%)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:py-16">
            <div>
              <p className="eyebrow text-xs text-primary">{page.eyebrow}</p>
              <h1 className="heading-display mt-5 max-w-4xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                {page.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={page.primaryCta.href}
                  className={cn(
                    buttonVariants(),
                    "h-12 rounded-full px-6 text-base font-bold",
                  )}
                >
                  {page.primaryCta.label}
                  <Zap className="size-5" />
                </a>
                {page.secondaryCta ? (
                  <a
                    href={page.secondaryCta.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-12 rounded-full px-6 text-base font-bold",
                    )}
                  >
                    {page.secondaryCta.label}
                  </a>
                ) : null}
              </div>
            </div>

            <figure className="overflow-hidden rounded-lg border border-border bg-card/50">
              <img
                src={page.heroImage}
                alt={page.heroAlt}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-border/70 p-4 text-sm leading-6 text-muted-foreground">
                <span>{page.intro.body}</span>
                {page.imageCredit ? (
                  <span className="mt-3 block text-xs text-muted-foreground/70">
                    Imagen:{" "}
                    <a
                      href={page.imageCredit.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {page.imageCredit.label}
                    </a>
                  </span>
                ) : null}
              </figcaption>
            </figure>
          </div>
        </section>

        <CumbrevaExplainer />

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl gap-3 px-4 py-8 sm:grid-cols-3 sm:px-6">
            {page.stats.map((stat, index) => {
              const Icon = statIcons[index] ?? CheckCircle2
              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/70 bg-card/40 p-4"
                >
                  <Icon className="size-5 text-primary" />
                  <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="heading-display mt-2 text-3xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {stat.note}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-xs text-primary">Mensaje clave</p>
              <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                {page.intro.title}
              </h2>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/35 p-5">
              <p className="text-base leading-8 text-muted-foreground">
                {page.intro.body}
              </p>
            </div>
          </div>
        </section>

        {page.sections.map((section, index) => (
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

        {modelInsight ? (
          <section className="border-b border-border/60">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow text-xs text-primary">
                  Datos para decidir
                </p>
                <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                  Autonomia estimada de {modelInsight.name} en uso real
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Tomamos la bateria y consumo base del catalogo de Cumbreva y
                  los convertimos en escenarios faciles de leer. No reemplaza el
                  calculo de tu ruta, pero ya te da una referencia mas util que
                  decir solo "depende".
                </p>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/70 bg-card/40 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Bateria usada
                    </p>
                    <p className="heading-display mt-2 text-3xl">
                      {modelInsight.kwh} kWh
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Masa aprox. {modelInsight.mass.toLocaleString("es-CO")}{" "}
                      kg.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-card/40 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Consumo base
                    </p>
                    <p className="heading-display mt-2 text-3xl">
                      {modelInsight.kwhPer100} kWh/100 km
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Equivale a {modelInsight.whkm} Wh/km en escenario base.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-card/40 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Rango oficial
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {modelInsight.officialRange}.
                    </p>
                    <a
                      href={modelInsight.sourceHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Ver fuente: {modelInsight.sourceLabel}
                    </a>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/70 bg-background/55 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Ciudad suave
                    </p>
                    <p className="heading-display mt-2 text-3xl">
                      {modelInsight.cityKm} km
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Mejor escenario: velocidad baja, frenado regenerativo y
                      poca carga.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/55 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Carretera plana
                    </p>
                    <p className="heading-display mt-2 text-3xl">
                      {modelInsight.roadKm} km
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Referencia para velocidad sostenida y menor regeneracion.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/55 p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Montana / calor
                    </p>
                    <p className="heading-display mt-2 text-3xl">
                      {modelInsight.mountainKm} km
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Escenario prudente para pendientes, aire acondicionado o
                      carro cargado.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/70 bg-card/40 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Lectura rapida:
                    </span>{" "}
                    {modelInsight.name} funciona mejor para{" "}
                    {modelInsight.bestUse}. Pon mas cuidado en{" "}
                    {modelInsight.caution}. Para decidir de verdad, calcula con
                    tu porcentaje de bateria y destino.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {page.group === "route" ? (
          <section className="border-b border-border/60 bg-card/20">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="eyebrow text-xs text-primary">
                  Como leer estos datos
                </p>
                <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                  La ruta real cambia por tu punto de salida y tu carro
                </h2>
              </div>
              <div className="grid gap-3">
                <div className="rounded-lg border border-border/70 bg-background/55 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    Las distancias estan expresadas como rangos porque no es lo
                    mismo salir del norte, centro o sur de una ciudad. El dato
                    util para decidir no es solo el kilometraje, sino el tramo
                    exigente, la subida, el regreso y el margen de bateria.
                  </p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/55 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    El consumo estimado se presenta como rango porque cambia
                    entre un urbano pequeno, un hatch eficiente y un SUV
                    familiar cargado. Si viajas con pasajeros, calor, lluvia o
                    equipaje, usa el extremo alto del rango.
                  </p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/55 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    La carga recomendada de salida no es una regla fija: es una
                    senal de prudencia para carretera colombiana. La respuesta
                    final debe calcularse con tu modelo, tu porcentaje actual y
                    tu destino exacto.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {page.charging || page.risks ? (
          <section className="border-b border-border/60">
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
              {page.charging ? (
                <div className="rounded-lg border border-border/70 bg-card/40 p-5">
                  <MapPinned className="size-5 text-primary" />
                  <h2 className="heading-display mt-4 text-3xl">
                    {page.charging.title}
                  </h2>
                  <ul className="mt-5 grid gap-3">
                    {page.charging.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-6 text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {page.risks ? (
                <div className="rounded-lg border border-border/70 bg-card/40 p-5">
                  <ShieldAlert className="size-5 text-primary" />
                  <h2 className="heading-display mt-4 text-3xl">
                    Riesgos de la ruta
                  </h2>
                  <ul className="mt-5 grid gap-3">
                    {page.risks.map((risk) => (
                      <li
                        key={risk}
                        className="text-sm leading-6 text-muted-foreground"
                      >
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow text-xs text-primary">Usalo cuando</p>
              <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                {page.checklistTitle}
              </h2>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {page.checklist.map((item, index) => (
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
                  Respuestas antes de salir
                </h2>
              </div>
              <div className="grid gap-3">
                {page.faq.map((item) => (
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
                {page.shareLine}
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-primary-foreground/80">
                Antes de salir, revisa si llegas con tu carro, tu bateria y tu
                ruta real.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={page.primaryCta.href}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#061a11] bg-[#061a11] px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#10271b] hover:text-white focus-visible:ring-3 focus-visible:ring-[#061a11]/30"
              >
                {page.primaryCta.label}
                <Zap className="size-4" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${page.h1} - ${absoluteProgrammaticUrl(page.path)}`,
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
