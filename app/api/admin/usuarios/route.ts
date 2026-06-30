import { NextResponse, type NextRequest } from "next/server"
import { esAdmin } from "@/lib/admin-auth"
import { getUser, limiteDe, listarEmails, usadasRegistrado } from "@/lib/calc-store"

export const runtime = "nodejs"

/** Lista todos los usuarios con su resumen (cuota, feedbacks). Ordenados por feedbacks. */
export async function GET(req: NextRequest) {
  if (!esAdmin(req)) return NextResponse.json({ error: "no-autorizado" }, { status: 401 })

  const emails = await listarEmails()
  const usuarios = await Promise.all(
    emails.map(async (email) => {
      const user = await getUser(email)
      const limite = limiteDe(user)
      const usadas = await usadasRegistrado(email)
      return {
        email,
        nombre: user?.nombre ?? "",
        verificado: user?.verificado ?? false,
        feedbacks: user?.feedbacks ?? 0,
        cuotaExtra: user?.cuotaExtra ?? 0,
        limite,
        usadasHoy: usadas,
        ultimoAcceso: user?.ultimoAcceso ?? 0,
      }
    }),
  )
  usuarios.sort((a, b) => b.feedbacks - a.feedbacks || b.ultimoAcceso - a.ultimoAcceso)
  return NextResponse.json({ usuarios })
}
