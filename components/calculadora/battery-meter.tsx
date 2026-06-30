"use client"

import type { Coord } from "@/lib/calc-physics"

// Paleta de la firma visual (verde neón sobre carbón) — coherente con la marca.
const C = {
  neon: "#36ff7a",
  amber: "#ffb547",
  red: "#ff4d4d",
  blue: "#39c0ff",
  line: "#1d2a18",
  panel: "#0d110c",
  text: "#e8f3e6",
  dim: "#7d8c79",
  faint: "#4a5547",
}

export function MedidorBateria({
  pct,
  alcanza,
  kmAlcance,
  distKm,
}: {
  pct: number
  alcanza: boolean
  kmAlcance: number
  distKm: number
}) {
  const fillPct = Math.max(0, Math.min(100, pct))
  const color = !alcanza ? C.red : pct < 20 ? C.amber : C.neon
  return (
    <div>
      <div className="relative h-14 overflow-hidden rounded-lg border" style={{ borderColor: C.line, background: C.panel }}>
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-700"
          style={{
            width: `${fillPct}%`,
            background: `linear-gradient(90deg, ${color}22, ${color})`,
            boxShadow: `0 0 24px ${color}80`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <span className="text-2xl font-bold" style={{ color: C.text }}>
            {Math.round(pct)}%
          </span>
          <span className="text-xs font-semibold" style={{ color: C.text }}>
            bateria al llegar
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Alcance estimado: {Math.round(kmAlcance)} km</span>
        <span>Ruta: {Math.round(distKm)} km</span>
      </div>
    </div>
  )
}

export function MapaRuta({
  coords,
  distKm,
  alcanza,
  kmAlcance,
  origen,
  destino,
}: {
  coords: Coord[]
  distKm: number
  alcanza: boolean
  kmAlcance: number
  origen: string
  destino: string
}) {
  if (!coords || coords.length < 2) return null
  const W = 600,
    H = 340,
    pad = 34
  const lngs = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats)
  const rngLng = maxLng - minLng || 1e-4
  const rngLat = maxLat - minLat || 1e-4
  const esc = Math.min((W - pad * 2) / rngLng, (H - pad * 2) / rngLat)
  const offX = (W - rngLng * esc) / 2
  const offY = (H - rngLat * esc) / 2
  const proy = (lng: number, lat: number): [number, number] => [
    offX + (lng - minLng) * esc,
    H - (offY + (lat - minLat) * esc),
  ]
  const pts = coords.map((c) => proy(c[0], c[1]))

  const colorPendiente = (g: number) => {
    if (g > 0.06) return "#ffd166"
    if (g > 0.025) return C.amber
    if (g > -0.02) return C.neon
    return C.blue
  }
  const segmentos: { x1: number; y1: number; x2: number; y2: number; color: string }[] = []
  for (let i = 1; i < coords.length; i++) {
    const dEle = coords[i][2] - coords[i - 1][2]
    const [x1, y1] = pts[i - 1],
      [x2, y2] = pts[i]
    const dxKm = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]) * 111
    const grad = dxKm > 0 ? dEle / (dxKm * 1000) : 0
    segmentos.push({ x1, y1, x2, y2, color: colorPendiente(grad) })
  }

  let puntoCorte: [number, number] | null = null
  if (!alcanza && distKm > 0) {
    const frac = Math.max(0, Math.min(1, kmAlcance / distKm))
    const idx = Math.round(frac * (pts.length - 1))
    puntoCorte = pts[idx]
  }

  const [ox, oy] = pts[0]
  const [dx, dy] = pts[pts.length - 1]
  const recortar = (t: string) => {
    if (!t) return ""
    const s = t.split(",")[0]
    return s.length > 16 ? s.slice(0, 15) + "…" : s
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full rounded-xl" style={{ background: "#080b07" }}>
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke={C.line} strokeWidth="0.6" opacity="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />
      {segmentos.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} strokeWidth="3.4" strokeLinecap="round" filter="url(#glow)" />
      ))}
      <circle cx={ox} cy={oy} r="7" fill={C.neon} filter="url(#glow)" />
      <circle cx={ox} cy={oy} r="13" fill="none" stroke={C.neon} strokeWidth="1.2" opacity="0.5" />
      <text x={ox} y={oy - 18} fill={C.text} fontSize="12" fontWeight="600" textAnchor="middle">
        {recortar(origen)}
      </text>
      <circle cx={dx} cy={dy} r="7" fill={C.amber} filter="url(#glow)" />
      <text x={dx} y={dy - 18} fill={C.text} fontSize="12" fontWeight="600" textAnchor="middle">
        {recortar(destino)}
      </text>
      {puntoCorte && (
        <>
          <circle cx={puntoCorte[0]} cy={puntoCorte[1]} r="7" fill={C.red} filter="url(#glow)" />
          <text x={puntoCorte[0]} y={puntoCorte[1] + 24} fill={C.red} fontSize="11" fontWeight="700" textAnchor="middle">
            ⚠ batería 0%
          </text>
        </>
      )}
      <g transform={`translate(${pad - 18}, ${H - 16})`} fontSize="10" fill={C.dim}>
        <circle cx="4" cy="-3" r="4" fill={C.neon} />
        <text x="12" y="0">plano</text>
        <circle cx="62" cy="-3" r="4" fill={C.amber} />
        <text x="70" y="0">subida</text>
        <circle cx="128" cy="-3" r="4" fill="#ffd166" />
        <text x="136" y="0">subida fuerte</text>
        <circle cx="222" cy="-3" r="4" fill={C.blue} />
        <text x="230" y="0">bajada</text>
      </g>
    </svg>
  )
}

export function PerfilSVG({ coords }: { coords: Coord[] }) {
  if (!coords || coords.length < 2) return null
  const W = 600,
    H = 90,
    pad = 4
  const elevs = coords.map((c) => c[2])
  const min = Math.min(...elevs),
    max = Math.max(...elevs)
  const rng = max - min || 1
  const pts = coords.map((c, i) => {
    const x = pad + (i / (coords.length - 1)) * (W - pad * 2)
    const y = pad + (1 - (c[2] - min) / rng) * (H - pad * 2)
    return [x, y]
  })
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.neon} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.neon} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#elevFill)" />
      <path d={line} fill="none" stroke={C.neon} strokeWidth="1.6" />
      <text x={pad + 2} y={14} fill={C.dim} fontSize="11">{Math.round(max)} m</text>
      <text x={pad + 2} y={H - 5} fill={C.faint} fontSize="11">{Math.round(min)} m</text>
    </svg>
  )
}
