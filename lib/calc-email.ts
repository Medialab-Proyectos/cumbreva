/**
 * Correo OTP de la calculadora Cumbrera. Reutiliza Resend (igual que la lista
 * de espera). Si no hay RESEND_API_KEY, no envía (modo demo) y el endpoint
 * decide cómo seguir.
 */
import { BRAND } from "@/lib/site"

const FROM_EMAIL = process.env.FROM_EMAIL || "Cumbreva <onboarding@resend.dev>"

const NEON = "#36ff7a"
const BG = "#0a0d0a"
const PANEL = "#11160f"

export function otpEmailHtml(codigo: string, nombre?: string): string {
  const saludo = nombre ? `Hola ${nombre},` : "Hola,"
  return `
  <div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:520px;margin:0 auto;background:${BG};color:#e8f3e6;border-radius:16px;overflow:hidden;border:1px solid #1d2a18">
    <div style="padding:28px 30px 8px">
      <div style="font-size:12px;letter-spacing:2px;color:${NEON};text-transform:uppercase;font-weight:700">Cumbreva · Calculadora</div>
      <h1 style="font-size:22px;margin:10px 0 4px;color:#fff">Tu código de acceso</h1>
      <p style="font-size:14px;line-height:1.6;color:#9fb09a;margin:6px 0 0">${saludo} usa este código de 6 dígitos para continuar usando la calculadora de autonomía. Vence en 10 minutos.</p>
    </div>
    <div style="margin:22px 30px;background:${PANEL};border:1px solid #1d2a18;border-radius:12px;padding:22px;text-align:center">
      <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:${NEON}">${codigo}</span>
    </div>
    <p style="font-size:12px;color:#5a6856;margin:0 30px 26px;line-height:1.6">Si no solicitaste este código, puedes ignorar este correo. Nunca compartimos tu correo con terceros.</p>
    <div style="background:${PANEL};padding:14px 30px;font-size:11px;color:#5a6856;border-top:1px solid #1d2a18">
      ${BRAND.name} · ${BRAND.company}
    </div>
  </div>`
}

/**
 * Envía el OTP. Devuelve true si se envió por correo, false en modo demo
 * (sin RESEND_API_KEY) — en ese caso el endpoint revela el código en la respuesta.
 */
export async function enviarOtp(email: string, codigo: string, nombre?: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false
  const { Resend } = await import("resend")
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: `Tu código de acceso — Calculadora Cumbreva`,
    html: otpEmailHtml(codigo, nombre),
  })
  return true
}
