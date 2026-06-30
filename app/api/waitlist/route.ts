import { NextResponse, type NextRequest } from "next/server"
import { BRAND } from "@/lib/site"
import { adminEmailHtml, clientEmailHtml, type WaitlistLead } from "@/lib/waitlist-emails"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || BRAND.email
const FROM_EMAIL = process.env.FROM_EMAIL || "Cumbreva <onboarding@resend.dev>"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombre = String(body.nombre ?? "").trim()
    const email = String(body.email ?? "").trim()
    const ciudad = String(body.ciudad ?? "").trim()
    const vehiculo = String(body.vehiculo ?? "").trim()
    const otraMarca = String(body.otraMarca ?? "").trim()
    const cargadorCasa = String(body.cargadorCasa ?? "").trim()
    const rutaPreocupa = String(body.rutaPreocupa ?? "").trim()

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Correo electrónico válido es requerido" },
        { status: 400 },
      )
    }

    const vehiculoLabel =
      vehiculo === "Otra marca" && otraMarca ? otraMarca : vehiculo || "No especificado"

    const lead: WaitlistLead = { nombre, email, ciudad, vehiculoLabel, cargadorCasa, rutaPreocupa }

    // Sin proveedor de correo configurado → modo demo (no falla la UI).
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true, demo: true })
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const timestamp = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "full",
      timeStyle: "short",
    })

    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `Nuevo lead — Lista de espera Cumbreva — ${email}`,
        html: adminEmailHtml(lead, timestamp),
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "¡Estás en la lista! Pronto estaremos contigo — Cumbreva",
        html: clientEmailHtml(lead),
      }),
    ])

    if (adminResult.status === "rejected")
      console.error("[waitlist] Admin email error:", adminResult.reason)
    if (clientResult.status === "rejected")
      console.error("[waitlist] Client email error:", clientResult.reason)

    if (adminResult.status === "rejected" && clientResult.status === "rejected") {
      return NextResponse.json({ error: "Error enviando el registro" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[waitlist] Unexpected error:", err)
    return NextResponse.json({ error: "Error procesando el registro" }, { status: 500 })
  }
}
