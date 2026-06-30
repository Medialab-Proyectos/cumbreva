// Catalogo de la tienda Cumbreva (demo). Precios en COP.
// Las compras son solo para Colombia; el pago real (Mercado Pago / ePayco) se integra despues.

export type Producto = {
  id: string
  nombre: string
  precio: number
  descripcion: string
  imagenes: string[]
  /** tallas disponibles (solo prendas). Si existe, hay que elegir una. */
  tallas?: string[]
  badge?: string
  /** Cómo encaja la imagen en la caja: "contain" (prendas, no recorta) o
   *  "cover" (gorra/peluche, llena la caja). Por defecto "contain". */
  encaje?: "cover" | "contain"
}

export const PRODUCTOS: Producto[] = [
  {
    id: "camiseta",
    nombre: "Camiseta Cumbreva",
    precio: 99000,
    descripcion: "Camiseta con gráfica Cumbreva para quienes ruedan eléctrico.",
    imagenes: [
      "/tienda/camiseta%20(1).png",
      "/tienda/camiseta%20(2).png",
      "/tienda/camiseta%20(3).png",
      "/tienda/camiseta%20(4).png",
    ],
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: "hoodie",
    nombre: "Hoodie Cumbreva",
    precio: 189000,
    descripcion: "Hoodie de la marca para trayectos fríos, carga nocturna y carretera.",
    imagenes: [
      "/tienda/buso%20(1).png",
      "/tienda/buso%20(2).png",
      "/tienda/buso%20(3).png",
      "/tienda/buso%20(4).png",
    ],
    tallas: ["S", "M", "L", "XL"],
    badge: "Nuevo",
  },
  {
    id: "gorra",
    nombre: "Gorra Cumbreva",
    precio: 69000,
    descripcion: "Gorra con el rayo Cumbreva bordado, para el sol de la ruta.",
    imagenes: [
      "/tienda/taza%20(2).png",
      "/tienda/taza%20(3).png",
      "/tienda/taza%20(4).png",
      "/tienda/taza%20(5).png",
    ],
    badge: "Nuevo",
    encaje: "cover",
  },
  {
    id: "taza",
    nombre: "Taza Cumbreva",
    precio: 45000,
    descripcion: "Taza para el café de ruta mientras planeas tu siguiente carga.",
    imagenes: [
      "/tienda/taza%20(1).png",
      "/tienda/taza%20(6).png",
      "/tienda/taza%20(7).png",
      "/tienda/taza%20(8).png",
    ],
    badge: "Más vista",
  },
  {
    id: "peluche",
    nombre: "Peluche Cumbreva",
    precio: 79000,
    descripcion: "Peluche de la mascota Cumbreva para llevar la marca en el carro.",
    imagenes: ["/tienda/peluche.png"],
    encaje: "cover",
  },
]

export function formatoCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor)
}
