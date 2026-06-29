import { NextResponse, type NextRequest } from "next/server"
import {
  asociarDevice,
  borrarOtp,
  createSession,
  leerOtp,
  limiteDe,
  normalizeEmail,
  sumarIntentoOtp,
  upsertUser,
  usadasRegistrado,
} from "@/lib/calc-store"

export const runtime = "nodejs"

const MAX_INTENTOS = 5

/**
 * Verifica el OTP. Si es correcto: marca al usuario como verificado, asocia su
 * device, crea sesión (cookie HttpOnly 30 días) y devuelve la cuota del día.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = normalizeEmail(String(body.email ?? ""))
    const codigo = String(body.codigo ?? "").trim()
    const deviceHash = String(body.deviceHash ?? "")
    const nombre = String(body.nombre ?? "").trim()

    const rec = await leerOtp(email)
    if (!rec) return NextResponse.json({ ok: false, error: "expirado" })
    if (rec.intentos >= MAX_INTENTOS) {
      await borrarOtp(email)
      return NextResponse.json({ ok: false, error: "bloqueado" })
    }
    if (codigo !== rec.codigo) {
      await sumarIntentoOtp(email, rec)
      return NextResponse.json({ ok: false, error: "incorrecto" })
    }

    await borrarOtp(email)
    const user = await upsertUser(email, {
      verificado: true,
      nombre: nombre || rec.nombre || undefined,
    })
    if (deviceHash) await asociarDevice(deviceHash, email)
    const token = await createSession(email)

    const limite = limiteDe(user)
    const usadas = await usadasRegistrado(email)

    const res = NextResponse.json({
      ok: true,
      nombre: user?.nombre ?? "",
      limite,
      usadas,
      restantes: Math.max(0, limite - usadas),
    })
    if (token) {
      res.cookies.set("cumbrera_sess", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    }
    return res
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 })
  }
}
