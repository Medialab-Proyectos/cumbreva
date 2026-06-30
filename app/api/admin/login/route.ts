import { NextResponse, type NextRequest } from "next/server"
import { ADMIN_COOKIE, adminTokenConfigurado } from "@/lib/admin-auth"

export const runtime = "nodejs"

/** Inicia sesión de admin comparando el token contra ADMIN_TOKEN. */
export async function POST(req: NextRequest) {
  if (!adminTokenConfigurado()) {
    return NextResponse.json(
      { ok: false, error: "El panel no está configurado. Define ADMIN_TOKEN en Vercel." },
      { status: 503 },
    )
  }
  const { token } = await req.json().catch(() => ({}))
  if (typeof token !== "string" || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "Token incorrecto." }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 h
  })
  return res
}

/** Cierra sesión de admin. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return res
}
