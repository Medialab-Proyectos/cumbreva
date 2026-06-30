// Catálogo de la tienda Cumbreva (demo). Precios en COP.
// Las compras son solo para Colombia; el pago real (Mercado Pago / ePayco) se integra después.

export type Producto = {
  id: string
  nombre: string
  precio: number
  descripcion: string
  emoji: string
  /** gradiente principal (placeholder visual mientras no hay foto) */
  gradiente: string
  /** galería: varios "ángulos"/imágenes para rotar (placeholder = gradientes) */
  galeria: string[]
  /** tallas disponibles (solo prendas). Si existe, hay que elegir una. */
  tallas?: string[]
  badge?: string
}

export const PRODUCTOS: Producto[] = [
  {
    id: "gorra",
    nombre: "Gorra Cumbreva",
    precio: 89000,
    descripcion: "Gorra de perfil bajo con el logo bordado en hilo neón.",
    emoji: "🧢",
    gradiente: "from-primary/30 to-emerald-900/40",
    galeria: ["from-primary/30 to-emerald-900/40", "from-emerald-600/30 to-black/50"],
    badge: "Más vendida",
  },
  {
    id: "mug",
    nombre: "Mug Cumbreva",
    precio: 45000,
    descripcion: "Mug de cerámica 350 ml. Para cargar tu café mientras cargas el carro.",
    emoji: "☕",
    gradiente: "from-sky-500/25 to-emerald-900/40",
    galeria: ["from-sky-500/25 to-emerald-900/40", "from-emerald-700/25 to-black/50"],
  },
  {
    id: "camiseta",
    nombre: "Camiseta Cumbreva",
    precio: 99000,
    descripcion: "Camiseta 100% algodón con estampado de la cumbre eléctrica.",
    emoji: "👕",
    gradiente: "from-primary/25 to-teal-900/40",
    galeria: ["from-primary/25 to-teal-900/40", "from-teal-600/25 to-black/50", "from-emerald-500/25 to-emerald-950/50"],
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: "hoodie",
    nombre: "Hoodie Cumbreva",
    precio: 189000,
    descripcion: "Hoodie premium con interior afelpado y cordones neón.",
    emoji: "🧥",
    gradiente: "from-amber-500/20 to-emerald-900/40",
    galeria: ["from-amber-500/20 to-emerald-900/40", "from-emerald-700/25 to-black/50", "from-amber-400/15 to-teal-950/50"],
    tallas: ["S", "M", "L", "XL"],
    badge: "Nuevo",
  },
]

export function formatoCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor)
}
