import { NextResponse, type NextRequest } from "next/server"
import {
  LIMITE_ANONIMO,
  consumirAnonimo,
  consumirRegistrado,
  getSessionEmail,
  getUser,
  limiteDe,
} from "@/lib/calc-store"

export const runtime = "nodejs"

/**
 * Reserva una búsqueda ANTES de calcular (incremento atómico en KV).
 * - Registrado: límite diario (7 + cuotaExtra). Si lo supera → 429 cuotaAgotada.
 * - Anónimo: 2 gratis por device. Si lo supera → 429 requiereRegistro.
 * La regla incr() es la autoridad: el cliente no puede evadir la cuota.
 */
export async function POST(req: NextRequest) {
  try {
    const { deviceHash = "" } = await req.json().catch(() => ({}))
    const email = await getSessionEmail(req.cookies.get("cumbrera_sess")?.value)

    if (email) {
      const user = await getUser(email)
      const limite = limiteDe(user)
      const total = await consumirRegistrado(email)
      if (total > limite) {
        return NextResponse.json(
          { ok: false, cuotaAgotada: true, restantes: 0, limite },
          { status: 429 },
        )
      }
      return NextResponse.json({ ok: true, restantes: Math.max(0, limite - total), limite })
    }

    if (!deviceHash) {
      return NextResponse.json({ ok: false, requiereRegistro: true }, { status: 429 })
    }
    const total = await consumirAnonimo(deviceHash)
    if (total > LIMITE_ANONIMO) {
      return NextResponse.json(
        { ok: false, requiereRegistro: true, restantes: 0, limite: LIMITE_ANONIMO },
        { status: 429 },
      )
    }
    return NextResponse.json({
      ok: true,
      restantes: Math.max(0, LIMITE_ANONIMO - total),
      limite: LIMITE_ANONIMO,
      anonimo: true,
    })
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 })
  }
}
