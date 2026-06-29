import { NextResponse, type NextRequest } from "next/server"
import { getSessionEmail, historial, registrarBusqueda } from "@/lib/calc-store"

export const runtime = "nodejs"

/** Registra una búsqueda completada (solo usuarios registrados). */
export async function POST(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("cumbrera_sess")?.value)
    if (!email) return NextResponse.json({ ok: true, skipped: true })

    const body = await req.json().catch(() => ({}))
    await registrarBusqueda(email, {
      origen: String(body.origen ?? "").slice(0, 120),
      destino: String(body.destino ?? "").slice(0, 120),
      distKm: Number.isFinite(body.distKm) ? Number(body.distKm) : undefined,
      alcanza: typeof body.alcanza === "boolean" ? body.alcanza : undefined,
      completado: true,
      ts: Date.now(),
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

/** Devuelve el historial reciente del usuario. */
export async function GET(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("cumbrera_sess")?.value)
    if (!email) return NextResponse.json({ items: [] })
    return NextResponse.json({ items: await historial(email) })
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}
