const stats = [
  { value: "+750 km", label: "Autonomía monitoreada" },
  { value: "24/7", label: "Tu vehículo bajo control" },
  { value: "1 app", label: "Todo en un solo lugar" },
  { value: "100%", label: "Pensada para eléctricos" },
]

export function StatsBand() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-5 py-12 sm:px-8 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="heading-display text-4xl sm:text-5xl">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-primary-foreground/75">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
