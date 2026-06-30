import { NextResponse } from "next/server"

export const runtime = "nodejs"

/** Cierra la sesión de la web app borrando la cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("cumbrera_sess", "", { httpOnly: true, path: "/", maxAge: 0 })
  return res
}
