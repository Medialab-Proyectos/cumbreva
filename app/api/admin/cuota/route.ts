import { NextResponse, type NextRequest } from "next/server"
import { esAdmin } from "@/lib/admin-auth"
import { getUser, limiteDe, upsertUser } from "@/lib/calc-store"

export const runtime = "nodejs"

/** Ajusta manualmente la cuota extra de un usuario (sobre las 7 diarias). */
export async function POST(req: NextRequest) {
  if (!esAdmin(req)) return NextResponse.json({ error: "no-autorizado" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? "").trim().toLowerCase()
  const cuotaExtra = Math.max(0, Math.min(100, Math.round(Number(body.cuotaExtra))))
  if (!email || !Number.isFinite(cuotaExtra)) {
    return NextResponse.json({ error: "datos inválidos" }, { status: 400 })
  }

  const existente = await getUser(email)
  if (!existente) return NextResponse.json({ error: "usuario no encontrado" }, { status: 404 })

  const user = await upsertUser(email, { cuotaExtra })
  return NextResponse.json({ ok: true, cuotaExtra: user?.cuotaExtra ?? cuotaExtra, limite: limiteDe(user) })
}
