import { NextResponse, type NextRequest } from "next/server"
import {
  getSessionEmail,
  getUser,
  historial,
  limiteDe,
  usadasRegistrado,
} from "@/lib/calc-store"

export const runtime = "nodejs"

/** Panel de la cuenta (web app): perfil + cuota del día + historial. */
export async function GET(req: NextRequest) {
  try {
    const email = await getSessionEmail(req.cookies.get("cumbrera_sess")?.value)
    if (!email) return NextResponse.json({ auth: false })

    const user = await getUser(email)
    const limite = limiteDe(user)
    const usadas = await usadasRegistrado(email)
    const items = await historial(email)

    return NextResponse.json({
      auth: true,
      email,
      nombre: user?.nombre ?? "",
      limite,
      usadas,
      restantes: Math.max(0, limite - usadas),
      feedbacks: user?.feedbacks ?? 0,
      historial: items,
    })
  } catch {
    return NextResponse.json({ auth: false }, { status: 500 })
  }
}
