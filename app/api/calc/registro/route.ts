import { NextResponse, type NextRequest } from "next/server"
import { enviarOtp } from "@/lib/calc-email"
import { generarOtp, validarCorreo } from "@/lib/calc-validation"
import { getUser, guardarOtp, kvConfigured, normalizeEmail } from "@/lib/calc-store"

export const runtime = "nodejs"

/**
 * Pide un OTP para registrarse o para entrar (usuario que ya existe).
 * Genera el código en el servidor, lo guarda en KV (TTL 10 min) y lo envía
 * por correo con Resend. En modo demo (sin RESEND_API_KEY) lo revela en la
 * respuesta para poder probar el flujo.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const nombre = String(body.nombre ?? "").trim()
    const email = normalizeEmail(String(body.email ?? ""))

    const v = validarCorreo(email)
    if (!v.ok) return NextResponse.json({ error: v.motivo }, { status: 400 })

    if (!kvConfigured()) {
      return NextResponse.json(
        { error: "La base de datos no está configurada. Configura Vercel KV." },
        { status: 503 },
      )
    }

    const existente = await getUser(email)
    const codigo = generarOtp()
    await guardarOtp(email, codigo, nombre || existente?.nombre)
    const enviado = await enviarOtp(email, codigo, nombre || existente?.nombre)

    return NextResponse.json({
      ok: true,
      yaExiste: !!existente?.verificado,
      demo: !enviado,
      ...(enviado ? {} : { codigo }), // solo en modo demo
    })
  } catch {
    return NextResponse.json({ error: "No se pudo enviar el código. Intenta de nuevo." }, { status: 500 })
  }
}
