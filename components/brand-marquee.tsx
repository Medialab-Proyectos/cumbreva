import Image from "next/image"

// EV brands available in Colombia. Some Chinese market leaders (BYD, GWM, JAC,
// Zeekr) are wordmark-style brands not in the SVG registry, so we render them
// as clean text marks to keep the row complete.
type Brand =
  | { name: string; file: string }
  | { name: string; wordmark: string }

const brands: Brand[] = [
  { name: "BYD", wordmark: "BYD" },
  { name: "Volvo", file: "volvo.svg" },
  { name: "Renault", file: "renault.svg" },
  { name: "Kia", file: "kia.svg" },
  { name: "GWM", wordmark: "GWM" },
  { name: "BMW", file: "bmw.svg" },
  { name: "Zeekr", wordmark: "ZEEKR" },
  { name: "Hyundai", file: "hyundai.svg" },
  { name: "Volkswagen", file: "volkswagen.svg" },
  { name: "JAC", wordmark: "JAC" },
  { name: "Audi", file: "audi.svg" },
  { name: "Mercedes-Benz", file: "mercedes-benz.svg" },
  { name: "MG", file: "mg.svg" },
  { name: "Chevrolet", file: "chevrolet.svg" },
  { name: "Citroën", file: "citroen.svg" },
  { name: "Peugeot", file: "peugeot.svg" },
  { name: "Mini", file: "mini.svg" },
  { name: "Nissan", file: "nissan.svg" },
  { name: "Porsche", file: "porsche.svg" },
  { name: "Ford", file: "ford.svg" },
]

function LogoTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
      aria-hidden={ariaHidden}
    >
      {brands.map((b) => (
        <li key={b.name} className="flex items-center">
          {"file" in b ? (
            <Image
              src={`/logos/${b.file}`}
              alt={ariaHidden ? "" : b.name}
              width={120}
              height={40}
              className="h-7 w-auto opacity-55 brightness-0 invert transition-opacity duration-300 hover:opacity-100 sm:h-8"
            />
          ) : (
            <span
              aria-hidden={ariaHidden}
              className="font-heading whitespace-nowrap text-2xl font-bold uppercase tracking-tight text-foreground opacity-55 transition-opacity duration-300 hover:opacity-100 sm:text-3xl"
            >
              {b.wordmark}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export function BrandMarquee() {
  return (
    <section
      aria-label="Marcas de vehículos eléctricos compatibles en Colombia"
      className="border-y border-border bg-card/40 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow mb-8 text-center text-xs text-muted-foreground">
          Compatible con los eléctricos que ruedan en Colombia
        </p>
      </div>
      <div className="marquee-mask relative flex overflow-hidden">
        <div className="flex animate-marquee">
          <LogoTrack />
          <LogoTrack ariaHidden />
        </div>
      </div>
    </section>
  )
}
