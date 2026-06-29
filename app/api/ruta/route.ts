import { NextResponse, type NextRequest } from "next/server"
import { geocode, ruta, type Punto } from "@/lib/calc-geo"

export const runtime = "nodejs"

/**
 * Calcula la ruta con elevación entre dos puntos. Acepta puntos resueltos
 * (lat/lng) o texto a geocodificar. Devuelve coords [lng,lat,elev], distancia
 * y duración. La API key de ORS nunca sale al cliente.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const a = await resolver(body.origen, body.origenTexto)
    const b = await resolver(body.destino, body.destinoTexto)
    if (!a) return NextResponse.json({ error: "No se encontró el origen." }, { status: 422 })
    if (!b) return NextResponse.json({ error: "No se encontró el destino." }, { status: 422 })

    const r = await ruta(a, b)
    return NextResponse.json(r)
  } catch {
    return NextResponse.json({ error: "No se pudo calcular la ruta." }, { status: 500 })
  }
}

async function resolver(punto: unknown, texto: unknown): Promise<Punto | null> {
  if (punto && typeof punto === "object" && "lat" in punto && "lng" in punto) {
    const p = punto as Punto
    return { label: p.label ?? "", lat: p.lat, lng: p.lng, elev: p.elev }
  }
  if (typeof texto === "string" && texto.trim()) {
    const hits = await geocode(texto)
    return hits[0] ?? null
  }
  return null
}
