const faqs = [
  {
    q: "¿Qué es Cumbreva?",
    a: "Cumbreva es tu copiloto eléctrico: una app que reúne batería, autonomía, rutas, carga y documentos de tu vehículo eléctrico en un solo lugar.",
  },
  {
    q: "¿Cuándo estará disponible?",
    a: "Estamos en fase final de desarrollo. Únete a la lista de espera y serás de los primeros en recibir acceso.",
  },
  {
    q: "¿Tiene costo unirme a la lista de espera?",
    a: "No. Registrarte es totalmente gratis y sin compromiso. Solo te avisaremos cuando esté listo.",
  },
  {
    q: "¿Sirve para cualquier vehículo eléctrico?",
    a: "Cumbreva está pensado para los principales modelos eléctricos. Cuéntanos el tuyo por WhatsApp y te confirmamos la compatibilidad.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="mb-10">
        <p className="eyebrow mb-4 text-xs text-primary">Preguntas</p>
        <h2 className="heading-display text-balance text-4xl text-foreground sm:text-5xl">
          Preguntas frecuentes
        </h2>
      </div>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
              {f.q}
              <span className="text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
