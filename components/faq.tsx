export const faqs = [
  {
    q: "Que es Cumbreva?",
    a: "Cumbreva es una app para carro electrico que reune bateria, autonomia, rutas con carga, electrolineras y documentos del vehiculo en un solo lugar.",
  },
  {
    q: "Que problemas ayuda a resolver?",
    a: "Ayuda a reducir la ansiedad de carga, entender mejor la autonomia real, ubicar puntos de carga y mantener ordenada la informacion del vehiculo para el uso diario.",
  },
  {
    q: "Cumbreva controla o repara la bateria del vehiculo?",
    a: "No. Cumbreva no repara la bateria ni reemplaza el mantenimiento del vehiculo. Su valor esta en darte mas visibilidad del estado del carro y mejores criterios para cargar y planear.",
  },
  {
    q: "Sirve para planear rutas y saber donde cargar?",
    a: "Si. Una de sus funciones principales es ayudarte a revisar la autonomia disponible y planear rutas con paradas de carga mas razonables segun el trayecto.",
  },
  {
    q: "Cuando estara disponible?",
    a: "Estamos en fase de validacion y afinando la experiencia con distintos vehiculos. Si te unes a la lista de espera, te compartiremos novedades del lanzamiento.",
  },
  {
    q: "Tiene costo unirme a la lista de espera?",
    a: "No. Registrarte es gratis y sin compromiso. Solo te avisaremos cuando Cumbreva este listo.",
  },
  {
    q: "Sirve para cualquier vehiculo electrico?",
    a: "Cumbreva esta pensado para los principales modelos electricos del mercado colombiano y seguira ampliando compatibilidad. Puedes dejarnos los datos de tu vehiculo en la lista de espera.",
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
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
          Respuestas directas sobre autonomia, carga, bateria y uso diario de una app
          para vehiculos electricos en Colombia.
        </p>
      </div>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((faq) => (
          <details key={faq.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
              {faq.q}
              <span className="text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
