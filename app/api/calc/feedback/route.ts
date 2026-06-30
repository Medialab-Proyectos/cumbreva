import { NextResponse, type NextRequest } from "next/server"
import { notificarAdminFeedback } from "@/lib/calc-email"
import { getSessionEmail, registrarFeedback } from "@/lib/calc-store"

export const runtime = "nodejs"

/** Guarda el feedback del usuario logueado y avisa al admin al llegar al umbral. */
export async function POST(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("cumbrera_sess")?.value)
    if (!email) return NextResponse.json({ ok: false, auth: false }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const mensaje = String(body.mensaje ?? "").trim().slice(0, 1000)
    if (!mensaje) return NextResponse.json({ ok: false, error: "Escribe tu comentario." }, { status: 400 })

    const { total, alerta } = await registrarFeedback(email, {
      mensaje,
      origen: body.origen ? String(body.origen).slice(0, 120) : undefined,
      destino: body.destino ? String(body.destino).slice(0, 120) : undefined,
      completado: typeof body.completado === "boolean" ? body.completado : undefined,
      ts: Date.now(),
    })

    if (alerta) {
      // No bloquea la respuesta al usuario si el correo falla.
      notificarAdminFeedback(email, total, mensaje).catch(() => {})
    }

    return NextResponse.json({ ok: true, total })
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 })
  }
}
