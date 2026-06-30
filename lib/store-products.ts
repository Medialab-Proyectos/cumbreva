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
}

export const PRODUCTOS: Producto[] = [
  {
    id: "camiseta",
    nombre: "Camiseta Cumbreva",
    precio: 99000,
    descripcion: "Camiseta con grafica Cumbreva para quienes ruedan electrico.",
    imagenes: [
      "/tienda/camiseta%20(1).png",
      "/tienda/camiseta%20(2).png",
      "/tienda/camiseta%20(3).png",
      "/tienda/camiseta%20(4).png",
    ],
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: "buso",
    nombre: "Buso Cumbreva",
    precio: 189000,
    descripcion: "Buso de la marca para trayectos frios, carga nocturna y carretera.",
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
    id: "taza",
    nombre: "Taza Cumbreva",
    precio: 45000,
    descripcion: "Taza para el cafe de ruta mientras planeas tu siguiente carga.",
    imagenes: [
      "/tienda/taza%20(1).png",
      "/tienda/taza%20(2).png",
      "/tienda/taza%20(3).png",
      "/tienda/taza%20(4).png",
      "/tienda/taza%20(5).png",
      "/tienda/taza%20(6).png",
      "/tienda/taza%20(7).png",
      "/tienda/taza%20(8).png",
    ],
    badge: "Mas vistas",
  },
  {
    id: "peluche",
    nombre: "Peluche Cumbreva",
    precio: 79000,
    descripcion: "Peluche de la mascota Cumbreva para llevar la marca en el carro.",
    imagenes: ["/tienda/peluche.png"],
  },
]

export function formatoCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor)
}
