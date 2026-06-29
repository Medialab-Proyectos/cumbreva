/**
 * Modelo físico de autonomía real para vehículos eléctricos.
 * Integra por tramo: aerodinámica (∝ v²), rodadura, pendiente (m·g·h),
 * auxiliares (A/C / calefacción por altitud) y regeneración en bajadas,
 * corrigiendo por la altitud colombiana. Portado del prototipo Cumbrera.
 */

export type Coord = [number, number, number] // [lng, lat, elev]

export type EV = {
  id: string
  marca: string
  modelo: string
  kwh: number
  whkm: number
  masa: number
}

// Catálogo de EVs más vendidos en Colombia 2025 (ANDEMOS/RUNT).
export const EV_CATALOG: EV[] = [
  { id: "custom", marca: "Personalizado", modelo: "—", kwh: 50, whkm: 160, masa: 1700 },
  { id: "byd-yuan-up", marca: "BYD", modelo: "Yuan Up", kwh: 45.1, whkm: 140, masa: 1540 },
  { id: "byd-seagull", marca: "BYD", modelo: "Seagull / Dolphin Mini", kwh: 38.9, whkm: 125, masa: 1240 },
  { id: "kia-ev5", marca: "Kia", modelo: "EV5", kwh: 64.2, whkm: 168, masa: 1910 },
  { id: "byd-yuan-plus", marca: "BYD", modelo: "Yuan Plus / Atto 3", kwh: 60.5, whkm: 160, masa: 1750 },
  { id: "volvo-ex30", marca: "Volvo", modelo: "EX30", kwh: 64, whkm: 165, masa: 1830 },
  { id: "chery-icar03", marca: "Chery", modelo: "iCAR 03", kwh: 69.8, whkm: 175, masa: 1810 },
  { id: "chevrolet-spark-euv", marca: "Chevrolet", modelo: "Spark EUV", kwh: 42.3, whkm: 140, masa: 1480 },
  { id: "mg-4", marca: "MG", modelo: "MG 4", kwh: 51, whkm: 160, masa: 1655 },
  { id: "mg-s5", marca: "MG", modelo: "S5 EV", kwh: 49, whkm: 154, masa: 1620 },
  { id: "mg-4-urban", marca: "MG", modelo: "MG4 EV Urban", kwh: 42.8, whkm: 145, masa: 1540 },
  { id: "tesla-m3-rwd", marca: "Tesla", modelo: "Model 3 RWD", kwh: 60, whkm: 135, masa: 1765 },
  { id: "tesla-m3-lr", marca: "Tesla", modelo: "Model 3 Long Range AWD", kwh: 75, whkm: 138, masa: 1840 },
  { id: "tesla-my-rwd", marca: "Tesla", modelo: "Model Y RWD", kwh: 60, whkm: 150, masa: 1920 },
  { id: "tesla-my-lr", marca: "Tesla", modelo: "Model Y Long Range AWD", kwh: 75, whkm: 158, masa: 1990 },
  { id: "renault-kwid", marca: "Renault", modelo: "Kwid E-Tech", kwh: 26.8, whkm: 130, masa: 1000 },
  { id: "chery-eq7", marca: "Chery", modelo: "eQ7 / Omoda E5", kwh: 61.1, whkm: 172, masa: 1710 },
  { id: "zeekr-x", marca: "Zeekr", modelo: "X", kwh: 66, whkm: 170, masa: 1850 },
  { id: "byd-seal", marca: "BYD", modelo: "Seal", kwh: 82.5, whkm: 158, masa: 1920 },
  { id: "byd-dolphin", marca: "BYD", modelo: "Dolphin", kwh: 44.9, whkm: 142, masa: 1430 },
  { id: "bmw-ix1", marca: "BMW", modelo: "iX1", kwh: 64.7, whkm: 178, masa: 2010 },
  { id: "kia-ev6", marca: "Kia", modelo: "EV6", kwh: 77.4, whkm: 168, masa: 1950 },
  { id: "chevrolet-equinox", marca: "Chevrolet", modelo: "Equinox EV", kwh: 85, whkm: 175, masa: 2170 },
  { id: "volvo-ex40", marca: "Volvo", modelo: "EX40 / XC40", kwh: 78, whkm: 185, masa: 2100 },
]

function tempPorAltitud(metros: number) {
  return 29 - (metros / 1000) * 6.5
}
function densidadAire(metros: number) {
  return 1.225 * Math.exp(-metros / 8500)
}
function velocidadTramo(grad: number) {
  let kmh: number
  if (grad > 0.05) kmh = 60
  else if (grad > 0.02) kmh = 75
  else if (grad > -0.02) kmh = 90
  else if (grad > -0.05) kmh = 85
  else kmh = 75
  return kmh / 3.6
}

export type Consumo = {
  whTotal: number
  base: number
  wAero: number
  wRod: number
  wPend: number
  wAux: number
  wRegen: number
  velMedia: number
}

export function estimarConsumo(coords: Coord[], whkm: number, masaKg: number): Consumo {
  const g = 9.81
  const Cd = 0.28
  const A = 2.3
  const Crr = 0.011
  const etaPowertrain = 0.88
  const etaRegen = 0.5
  const regenMaxKW = 60

  let whTotal = 0,
    base = 0,
    wAero = 0,
    wRod = 0,
    wPend = 0,
    wAux = 0,
    wRegen = 0
  let velMediaSum = 0,
    nSeg = 0

  for (let i = 1; i < coords.length; i++) {
    const e0 = coords[i - 1][2],
      e1 = coords[i][2]
    const dEle = e1 - e0
    const dLng = coords[i][0] - coords[i - 1][0]
    const dLat = coords[i][1] - coords[i - 1][1]
    const distSegKm = Math.hypot(
      dLng * 111.32 * Math.cos((coords[i][1] * Math.PI) / 180),
      dLat * 110.57,
    )
    if (distSegKm <= 0) continue
    const distSegM = distSegKm * 1000

    const grad = dEle / distSegM
    const v = velocidadTramo(grad)
    velMediaSum += v * 3.6
    nSeg++
    const altMedia = (e0 + e1) / 2
    const rho = densidadAire(altMedia)

    const fAero = 0.5 * rho * Cd * A * v * v
    const fRod = Crr * masaKg * g
    const fPend = masaKg * g * grad

    const eAero = fAero * distSegM
    const eRod = fRod * distSegM
    const ePend = fPend * distSegM

    const temp = tempPorAltitud(altMedia)
    let auxW = 300
    if (temp > 26) auxW += 1800
    else if (temp > 20) auxW += 900
    else if (temp < 10) auxW += 1200
    const tiempoSeg = distSegM / v
    const eAux = auxW * tiempoSeg

    let eTraccionJ = eAero + eRod + Math.max(0, ePend)
    eTraccionJ /= etaPowertrain

    let eRegenJ = 0
    if (ePend < 0) {
      const potenciaRegenW = -ePend / tiempoSeg
      const factor = Math.min(1, (regenMaxKW * 1000) / Math.max(1, potenciaRegenW))
      eRegenJ = -ePend * etaRegen * factor
    }

    const eSegJ = eTraccionJ + eAux - eRegenJ
    const segWh = eSegJ / 3600

    whTotal += Math.max(0, segWh)
    base += whkm * distSegKm
    wAero += eAero / 3600 / etaPowertrain
    wRod += eRod / 3600 / etaPowertrain
    wPend += Math.max(0, ePend) / 3600 / etaPowertrain
    wAux += eAux / 3600
    wRegen += eRegenJ / 3600
  }

  whTotal = Math.max(base * 0.7, whTotal)
  const velMedia = nSeg ? velMediaSum / nSeg : 0
  return { whTotal, base, wAero, wRod, wPend, wAux, wRegen, velMedia }
}

export function perfilElevacion(coords: Coord[]) {
  let asc = 0,
    desc = 0,
    min = Infinity,
    max = -Infinity
  for (let i = 1; i < coords.length; i++) {
    const d = coords[i][2] - coords[i - 1][2]
    if (d > 0) asc += d
    else desc += -d
    min = Math.min(min, coords[i][2])
    max = Math.max(max, coords[i][2])
  }
  return { asc, desc, min: isFinite(min) ? min : 0, max: isFinite(max) ? max : 0 }
}

export type Resultado = {
  coords: Coord[]
  distKm: number
  durMin: number
  fuente: string
  perfil: ReturnType<typeof perfilElevacion>
  whTotal: number
  consumoReal: number
  kmAlcance: number
  alcanza: boolean
  pctLlegada: number
  penaliz: number
  disponibleWh: number
} & Omit<Consumo, "whTotal" | "base">

/** Combina ruta + consumo en el resultado final mostrado al usuario. */
export function evaluar(
  ruta: { coords: Coord[]; distKm: number; durMin: number; fuente: string },
  ev: { kwh: number; whkm: number; masa: number; bateria: number },
): Resultado {
  const perfil = perfilElevacion(ruta.coords)
  const cons = estimarConsumo(ruta.coords, ev.whkm, ev.masa)
  const disponibleWh = ev.kwh * 1000 * (ev.bateria / 100)
  const consumoReal = cons.whTotal / ruta.distKm
  const kmAlcance = disponibleWh / consumoReal
  const alcanza = kmAlcance >= ruta.distKm
  const pctLlegada = Math.max(0, ((disponibleWh - cons.whTotal) / (ev.kwh * 1000)) * 100)
  const penaliz = ((cons.whTotal - cons.base) / cons.base) * 100
  return {
    ...ruta,
    perfil,
    whTotal: cons.whTotal,
    consumoReal,
    kmAlcance,
    alcanza,
    pctLlegada,
    penaliz,
    disponibleWh,
    wAero: cons.wAero,
    wRod: cons.wRod,
    wPend: cons.wPend,
    wAux: cons.wAux,
    wRegen: cons.wRegen,
    velMedia: cons.velMedia,
  }
}

/** Huella no invasiva del dispositivo: distingue equipos, no identifica personas. */
export function deviceHash(): string {
  try {
    const s = [
      navigator.userAgent,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      `${screen.width}x${screen.height}`,
      navigator.platform || "",
    ].join("|")
    let h = 0
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i)
      h |= 0
    }
    return "d" + Math.abs(h).toString(36)
  } catch {
    return "d0"
  }
}
