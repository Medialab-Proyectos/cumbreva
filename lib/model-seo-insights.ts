import { EV_CATALOG } from "@/lib/calc-physics"

type ModelInsightConfig = {
  path: string
  evId: string
  officialRange: string
  sourceLabel: string
  sourceHref: string
  bestUse: string
  caution: string
}

const configs: ModelInsightConfig[] = [
  {
    path: "/modelos/byd-yuan-up-autonomia-colombia",
    evId: "byd-yuan-up",
    officialRange: "hasta 380 km anunciados en Colombia",
    sourceLabel: "BYD Auto Colombia",
    sourceHref: "https://bydauto.com.co/modelo/byd-yuan-up/byd-yuan-up/",
    bestUse: "ciudad, trayectos diarios y salidas de fin de semana calculadas",
    caution: "regresos con subida hacia Bogota o rutas sin carga confirmada",
  },
  {
    path: "/modelos/byd-seagull-autonomia-colombia",
    evId: "byd-seagull",
    officialRange: "hasta 300 km o 380 km segun version anunciada",
    sourceLabel: "BYD Auto Colombia",
    sourceHref: "https://bydauto.com.co/modelo/byd-seagull-ev/byd-seagull/",
    bestUse: "ciudad, desplazamientos diarios y carretera corta bien planeada",
    caution: "salidas largas con aire acondicionado, velocidad sostenida o regreso en subida",
  },
  {
    path: "/modelos/volvo-ex30-autonomia-colombia",
    evId: "volvo-ex30",
    officialRange: "hasta 540 km anunciados por Volvo Colombia",
    sourceLabel: "Volvo Cars Colombia",
    sourceHref: "https://www.volvocars.com/co/cars/ex30-electric/",
    bestUse: "carretera con buena planeacion y carga rapida disponible",
    caution: "velocidad alta, aceleraciones fuertes y rutas con montana",
  },
  {
    path: "/modelos/kia-ev5-autonomia-colombia",
    evId: "kia-ev5",
    officialRange: "hasta 555 km en version EV5 Light Plus Colombia",
    sourceLabel: "Kia Colombia",
    sourceHref: "https://kia.com.co/nuestros-vehiculos/ev5/especificaciones/light-%2B",
    bestUse: "viajes familiares, ciudad y carretera con pasajeros",
    caution: "peso del vehiculo, equipaje y destinos sin carga segura",
  },
  {
    path: "/modelos/mg4-autonomia-colombia",
    evId: "mg-4",
    officialRange: "330 km a 385 km WLTP segun version disponible",
    sourceLabel: "MG Colombia / Los Coches",
    sourceHref: "https://loscoches.com/vehiculo/mg-4/",
    bestUse: "uso mixto, ciudad y viajes medianos con una parada clara",
    caution: "carretera rapida, tramos largos y versiones con bateria menor",
  },
  {
    path: "/modelos/tesla-model-y-autonomia-colombia",
    evId: "tesla-my-lr",
    officialRange: "466 km a 600 km WLTP segun version en Colombia",
    sourceLabel: "Tesla Colombia",
    sourceHref: "https://www.tesla.com/es_co/modely",
    bestUse: "viajes largos por tramos y uso familiar con carga rapida",
    caution: "compatibilidad, disponibilidad de carga y consumo a alta velocidad",
  },
  {
    path: "/modelos/renault-kwid-e-tech-autonomia-colombia",
    evId: "renault-kwid",
    officialRange: "hasta 298 km anunciados por Renault Colombia",
    sourceLabel: "Renault Colombia",
    sourceHref: "https://www.renault.com.co/electricos/kwid-etech0/autonomia-y-recarga.html",
    bestUse: "ciudad, trayectos diarios y carga en casa",
    caution: "carretera, bateria pequena y viajes sin carga en destino",
  },
]

function kmRange(kwh: number, whkm: number, factor: number) {
  return Math.round((kwh * 1000) / (whkm * factor))
}

export function modelInsightForPath(path: string) {
  const config = configs.find((item) => item.path === path)
  if (!config) return null

  const ev = EV_CATALOG.find((item) => item.id === config.evId)
  if (!ev) return null

  return {
    ...config,
    name: `${ev.marca} ${ev.modelo}`,
    kwh: ev.kwh,
    whkm: ev.whkm,
    mass: ev.masa,
    cityKm: kmRange(ev.kwh, ev.whkm, 0.95),
    roadKm: kmRange(ev.kwh, ev.whkm, 1.22),
    mountainKm: kmRange(ev.kwh, ev.whkm, 1.45),
    kwhPer100: Math.round((ev.whkm / 10) * 10) / 10,
  }
}
