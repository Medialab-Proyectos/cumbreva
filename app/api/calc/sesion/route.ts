import { NextResponse, type NextRequest } from "next/server"
import {
  LIMITE_ANONIMO,
  emailDeDevice,
  getSessionEmail,
  getUser,
  limiteDe,
  upsertUser,
  usadasAnonimo,
  usadasRegistrado,
} from "@/lib/calc-store"

export const runtime = "nodejs"

/**
 * Estado de la sesión al cargar la calculadora (1 lectura).
 * - Con sesión válida → usuario registrado, devuelve cuota del día.
 * - Sin sesión pero el device ya se vio → "regresa_sin_registro".
 * - Resto → anónimo con su cuota gratis.
 */
export async function POST(req: NextRequest) {
  try {
    const { deviceHash = "" } = await req.json().catch(() => ({}))
    const token = req.cookies.get("cumbrera_sess")?.value
    const email = await getSessionEmail(token)

    if (email) {
      const user = (await getUser(email)) ?? (await upsertUser(email, { verificado: true }))
      const limite = limiteDe(user)
      const usadas = await usadasRegistrado(email)
      return NextResponse.json({
        estado: "registrado",
        email,
        nombre: user?.nombre ?? "",
        limite,
        usadas,
        restantes: Math.max(0, limite - usadas),
      })
    }

    const usadas = await usadasAnonimo(deviceHash)
    const conocido = deviceHash ? await emailDeDevice(deviceHash) : null

    return NextResponse.json({
      estado: conocido ? "regresa_sin_registro" : "anonimo",
      emailSugerido: conocido ?? "",
      limite: LIMITE_ANONIMO,
      usadas,
      restantes: Math.max(0, LIMITE_ANONIMO - usadas),
    })
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 })
  }
}
