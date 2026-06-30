import { NextResponse, type NextRequest } from "next/server"
import { esAdmin } from "@/lib/admin-auth"
import { feedbacks, getUser, historial, limiteDe, usadasRegistrado } from "@/lib/calc-store"

export const runtime = "nodejs"

/** Detalle de un usuario: perfil + feedbacks + historial de búsquedas. */
export async function GET(req: NextRequest) {
  if (!esAdmin(req)) return NextResponse.json({ error: "no-autorizado" }, { status: 401 })

  const email = req.nextUrl.searchParams.get("email") ?? ""
  if (!email) return NextResponse.json({ error: "falta email" }, { status: 400 })

  const user = await getUser(email)
  const limite = limiteDe(user)
  const usadas = await usadasRegistrado(email)
  const [fb, hist] = await Promise.all([feedbacks(email), historial(email)])

  return NextResponse.json({
    email,
    nombre: user?.nombre ?? "",
    verificado: user?.verificado ?? false,
    feedbacks: user?.feedbacks ?? 0,
    cuotaExtra: user?.cuotaExtra ?? 0,
    limite,
    usadasHoy: usadas,
    creadoEn: user?.creadoEn ?? 0,
    ultimoAcceso: user?.ultimoAcceso ?? 0,
    feedbackItems: fb,
    historial: hist,
  })
}
