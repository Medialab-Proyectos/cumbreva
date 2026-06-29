/**
 * Geocodificación y ruteo con elevación, ejecutado en el SERVIDOR para no
 * exponer la API key de OpenRouteService al cliente.
 *
 * Cadena de respaldos:
 *   geocode → ORS (Pelias) → Nominatim (OSM) → catálogo local de ciudades
 *   ruta    → ORS directions (+elevación) → OSRM + Open-Elevation → recta×1.3
 */

const ORS_KEY = process.env.ORS_API_KEY || ""

export type Punto = { label: string; lat: number; lng: number; elev?: number }
export type Coord = [number, number, number] // [lng, lat, elev]
export type Ruta = { coords: Coord[]; distKm: number; durMin: number; fuente: string }

// Catálogo offline de ciudades de Colombia (último respaldo, con elevación real).
const CIUDADES: Record<string, { lat: number; lng: number; elev: number; label: string }> = {
  bogota: { lat: 4.711, lng: -74.072, elev: 2640, label: "Bogotá, Cundinamarca" },
  soacha: { lat: 4.579, lng: -74.217, elev: 2565, label: "Soacha, Cundinamarca" },
  medellin: { lat: 6.244, lng: -75.581, elev: 1495, label: "Medellín, Antioquia" },
  cali: { lat: 3.452, lng: -76.532, elev: 1018, label: "Cali, Valle del Cauca" },
  barranquilla: { lat: 10.969, lng: -74.781, elev: 18, label: "Barranquilla, Atlántico" },
  cartagena: { lat: 10.391, lng: -75.479, elev: 2, label: "Cartagena, Bolívar" },
  bucaramanga: { lat: 7.119, lng: -73.122, elev: 959, label: "Bucaramanga, Santander" },
  girardot: { lat: 4.304, lng: -74.802, elev: 289, label: "Girardot, Cundinamarca" },
  villavicencio: { lat: 4.142, lng: -73.626, elev: 467, label: "Villavicencio, Meta" },
  tunja: { lat: 5.535, lng: -73.368, elev: 2820, label: "Tunja, Boyacá" },
  honda: { lat: 5.207, lng: -74.737, elev: 229, label: "Honda, Tolima" },
  ibague: { lat: 4.439, lng: -75.232, elev: 1285, label: "Ibagué, Tolima" },
  manizales: { lat: 5.07, lng: -75.52, elev: 2160, label: "Manizales, Caldas" },
  pereira: { lat: 4.814, lng: -75.694, elev: 1411, label: "Pereira, Risaralda" },
  armenia: { lat: 4.535, lng: -75.681, elev: 1483, label: "Armenia, Quindío" },
  "la dorada": { lat: 5.45, lng: -74.66, elev: 178, label: "La Dorada, Caldas" },
  neiva: { lat: 2.936, lng: -75.281, elev: 442, label: "Neiva, Huila" },
  popayan: { lat: 2.444, lng: -76.614, elev: 1738, label: "Popayán, Cauca" },
  "santa marta": { lat: 11.241, lng: -74.199, elev: 6, label: "Santa Marta, Magdalena" },
  cucuta: { lat: 7.894, lng: -72.504, elev: 320, label: "Cúcuta, Norte de Santander" },
  duitama: { lat: 5.823, lng: -73.034, elev: 2530, label: "Duitama, Boyacá" },
  sogamoso: { lat: 5.715, lng: -72.933, elev: 2569, label: "Sogamoso, Boyacá" },
  chia: { lat: 4.861, lng: -74.059, elev: 2564, label: "Chía, Cundinamarca" },
  zipaquira: { lat: 5.027, lng: -74.005, elev: 2650, label: "Zipaquirá, Cundinamarca" },
  fusagasuga: { lat: 4.345, lng: -74.366, elev: 1728, label: "Fusagasugá, Cundinamarca" },
  melgar: { lat: 4.204, lng: -74.642, elev: 323, label: "Melgar, Tolima" },
}

export async function geocode(text: string): Promise<Punto[]> {
  const q = (text || "").trim()
  if (q.length < 2) return []

  if (ORS_KEY) {
    try {
      const url =
        `https://api.openrouteservice.org/geocode/search` +
        `?api_key=${encodeURIComponent(ORS_KEY)}` +
        `&text=${encodeURIComponent(q)}&boundary.country=CO&size=5`
      const r = await fetch(url)
      if (r.ok) {
        const j = await r.json()
        if (j.features?.length) {
          return j.features.map((f: any) => ({
            label: f.properties.label,
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          }))
        }
      }
    } catch {
      /* respaldo */
    }
  }

  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2&countrycodes=co&limit=5&q=${encodeURIComponent(q)}`
    const r = await fetch(url, {
      headers: { "Accept-Language": "es", "User-Agent": "Cumbreva/1.0 (calculadora)" },
    })
    if (r.ok) {
      const j = await r.json()
      if (j.length) {
        return j.map((p: any) => ({
          label: p.display_name.split(",").slice(0, 3).join(",").trim(),
          lat: parseFloat(p.lat),
          lng: parseFloat(p.lon),
        }))
      }
    }
  } catch {
    /* respaldo */
  }

  // Último respaldo: catálogo local
  const k = q.toLowerCase()
  const hits = Object.values(CIUDADES)
    .filter((c) => c.label.toLowerCase().includes(k) || Object.keys(CIUDADES).some((n) => n.includes(k) && CIUDADES[n] === c))
    .map((c) => ({ label: c.label, lat: c.lat, lng: c.lng, elev: c.elev }))
  return hits
}

export async function ruta(a: Punto, b: Punto): Promise<Ruta> {
  if (ORS_KEY) {
    try {
      const r = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: { Authorization: ORS_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: [
              [a.lng, a.lat],
              [b.lng, b.lat],
            ],
            elevation: true,
          }),
        },
      )
      if (r.ok) {
        const j = await r.json()
        const f = j.features[0]
        return {
          coords: f.geometry.coordinates,
          distKm: f.properties.summary.distance / 1000,
          durMin: f.properties.summary.duration / 60,
          fuente: "OpenRouteService",
        }
      }
    } catch {
      /* respaldo */
    }
  }
  return rutaRespaldo(a, b)
}

async function rutaRespaldo(a: Punto, b: Punto): Promise<Ruta> {
  let geometria: number[][] | null = null
  let distKm = 0
  let durMin = 0
  try {
    const r = await fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
        `${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`,
    )
    if (r.ok) {
      const j = await r.json()
      const rt = j.routes[0]
      geometria = rt.geometry.coordinates
      distKm = rt.distance / 1000
      durMin = rt.duration / 60
    }
  } catch {
    /* recta */
  }

  if (!geometria) {
    const R = 6371
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    const recta = 2 * R * Math.asin(Math.sqrt(h))
    distKm = recta * 1.3
    durMin = (distKm / 55) * 60
    const n = 24
    geometria = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      geometria.push([a.lng + (b.lng - a.lng) * t, a.lat + (b.lat - a.lat) * t])
    }
  }

  const muestreada = muestrear(geometria, 30)

  // Si ambos puntos traen elevación conocida (catálogo), perfil sintético sin API.
  if (a.elev != null && b.elev != null) {
    return {
      coords: perfilSintetico(muestreada, a.elev, b.elev),
      distKm,
      durMin,
      fuente: "Estimación offline",
    }
  }

  const coords = await anadirElevacion(muestreada)
  const conElev = coords.some((c) => c[2] !== 0)
  return { coords, distKm, durMin, fuente: conElev ? "OSRM + Open-Elevation" : "OSRM (sin elevación)" }
}

function perfilSintetico(coords: number[][], e0: number, e1: number): Coord[] {
  const n = coords.length - 1
  return coords.map(([lng, lat], i) => {
    const t = i / n
    const ond = Math.sin(t * Math.PI * 3) * 320 * Math.sin(t * Math.PI)
    return [lng, lat, e0 + (e1 - e0) * t + ond] as Coord
  })
}

function muestrear(arr: number[][], n: number): number[][] {
  if (arr.length <= n) return arr
  const paso = (arr.length - 1) / (n - 1)
  const out: number[][] = []
  for (let i = 0; i < n; i++) out.push(arr[Math.round(i * paso)])
  return out
}

async function anadirElevacion(coords: number[][]): Promise<Coord[]> {
  try {
    const r = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locations: coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
      }),
    })
    if (r.ok) {
      const j = await r.json()
      return coords.map(([lng, lat], i) => [lng, lat, j.results[i]?.elevation ?? 0] as Coord)
    }
  } catch {
    /* sin elevación */
  }
  return coords.map(([lng, lat]) => [lng, lat, 0] as Coord)
}
