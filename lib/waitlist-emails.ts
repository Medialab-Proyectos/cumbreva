import { BRAND, SITE_URL } from "@/lib/site"

// Plantillas de correo de la lista de espera de Cumbreva (colores de marca).

const LOGO_URL = `${SITE_URL}/android-chrome-512x512.png`

// Colores de marca Cumbreva
const C = {
  dark: "#0a1410",
  green: "#19e07f",
  greenDeep: "#0a8f55",
  ink: "#1a1a1a",
  paper: "#f0f2f5",
  surface: "#f3faf6",
  border: "#cdeee2",
}

export type WaitlistLead = {
  nombre?: string
  email: string
  ciudad?: string
  vehiculoLabel: string
  cargadorCasa?: string
  rutaPreocupa?: string
}

// Escape básico para no romper el HTML ni permitir inyección desde el form.
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

const host = SITE_URL.replace(/^https?:\/\//, "")

// ── Correo interno (lead que te llega a ti) ──
export function adminEmailHtml(lead: WaitlistLead, timestamp: string): string {
  const { nombre, email, ciudad, vehiculoLabel, cargadorCasa, rutaPreocupa } = lead
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:${C.paper};color:${C.ink}}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10)}
  .header{background:${C.dark};background-image:linear-gradient(135deg,${C.dark} 0%,#0c241b 100%);padding:26px 32px;border-bottom:3px solid ${C.green}}
  .brand{display:flex;align-items:center;gap:12px}
  .brand img{height:30px;width:30px;border-radius:8px}
  .brand-name{color:#fff;font-size:18px;font-weight:800;letter-spacing:0.04em}
  .header h1{color:#fff;font-size:16px;font-weight:700;margin-top:16px}
  .header p{color:rgba(255,255,255,0.55);font-size:12px;margin-top:4px}
  .tag{display:inline-block;background:${C.green};color:${C.dark};font-size:11px;font-weight:800;padding:4px 11px;border-radius:100px;margin-bottom:20px;text-transform:uppercase;letter-spacing:0.05em}
  .body{padding:32px}
  .field{margin-bottom:16px}
  .field-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${C.greenDeep};margin-bottom:6px}
  .field-value{font-size:14px;color:#333;line-height:1.6;background:${C.surface};padding:12px 16px;border-radius:8px;border-left:3px solid ${C.green};white-space:pre-wrap;word-break:break-word}
  .footer{padding:20px 32px;background:#f8f8f8;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center}
  .footer a{color:${C.greenDeep};text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <div class="brand"><img src="${LOGO_URL}" alt="Cumbreva" /><span class="brand-name">CUMBREVA</span></div>
    <h1>Nuevo registro en la lista de espera</h1>
    <p>${esc(timestamp)}</p>
  </div>
  <div class="body">
    <div class="tag">Lead · Lista de espera</div>
    ${nombre ? `<div class="field"><div class="field-label">Nombre</div><div class="field-value">${esc(nombre)}</div></div>` : ""}
    <div class="field"><div class="field-label">Correo</div><div class="field-value">${esc(email)}</div></div>
    ${ciudad ? `<div class="field"><div class="field-label">Ciudad</div><div class="field-value">${esc(ciudad)}</div></div>` : ""}
    <div class="field"><div class="field-label">Carro eléctrico</div><div class="field-value">${esc(vehiculoLabel)}</div></div>
    ${cargadorCasa ? `<div class="field"><div class="field-label">¿Cargador en casa?</div><div class="field-value">${esc(cargadorCasa)}</div></div>` : ""}
    ${rutaPreocupa ? `<div class="field"><div class="field-label">Ruta que más le preocupa</div><div class="field-value">${esc(rutaPreocupa)}</div></div>` : ""}
  </div>
  <div class="footer"><a href="${SITE_URL}">${esc(host)}</a> &nbsp;·&nbsp; ${esc(BRAND.company)} · Bogotá, Colombia</div>
</div>
</body></html>`
}

// ── Correo de confirmación al usuario ──
export function clientEmailHtml(lead: WaitlistLead): string {
  const { nombre, vehiculoLabel } = lead
  const firstName = (nombre ?? "").split(" ")[0] || ""
  const tieneVehiculo = vehiculoLabel && vehiculoLabel !== "No especificado"
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:${C.paper};color:${C.ink}}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10)}
  .header{background:${C.dark};background-image:linear-gradient(135deg,${C.dark} 0%,#0c241b 60%,#0e2a20 100%);padding:44px 32px;text-align:center;border-bottom:3px solid ${C.green}}
  .header img{height:48px;width:48px;border-radius:12px;margin:0 auto 18px;display:block}
  .header h1{color:#fff;font-size:24px;font-weight:800;line-height:1.25;margin-bottom:10px}
  .header h1 span{color:${C.green}}
  .header p{color:rgba(255,255,255,0.7);font-size:14px}
  .body{padding:40px 32px}
  .greeting{font-size:15px;color:#333;line-height:1.7;margin-bottom:26px}
  .greeting strong{color:${C.ink}}
  .highlight{background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:22px;margin-bottom:26px}
  .highlight p{font-size:14px;color:#444;line-height:1.7}
  .steps-title{font-size:13px;font-weight:700;color:${C.greenDeep};margin-bottom:16px;text-transform:uppercase;letter-spacing:0.06em}
  .step{margin-bottom:14px}
  .step-row{display:flex;gap:14px;align-items:flex-start}
  .step-num{width:28px;height:28px;border-radius:50%;background-image:linear-gradient(135deg,${C.green},${C.greenDeep});color:${C.dark};font-size:12px;font-weight:800;text-align:center;line-height:28px;flex-shrink:0}
  .step-text{font-size:14px;color:#555;line-height:1.55;padding-top:4px}
  .step-text strong{color:${C.ink}}
  .cta{display:inline-block;margin-top:8px;background:${C.green};color:${C.dark};font-weight:700;font-size:14px;text-decoration:none;padding:13px 26px;border-radius:100px}
  .footer{padding:24px 32px;background:#f8f8f8;border-top:1px solid #eee;text-align:center;font-size:12px;color:#aaa}
  .footer a{color:${C.greenDeep};text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="Cumbreva" />
    <h1>¡Ya estás en la lista! <span>Pronto estaremos contigo</span></h1>
    <p>Cumbreva · ${esc(BRAND.tagline)}</p>
  </div>
  <div class="body">
    <p class="greeting">
      Hola${firstName ? ` ${esc(firstName)}` : ""},<br><br>
      ¡Gracias por sumarte a <strong>Cumbreva</strong>! Recibimos tu registro y guardamos tu cupo en la
      lista de espera. Estamos en la fase final de desarrollo y <strong>pronto estaremos contigo</strong>
      con acceso anticipado.
    </p>

    <div class="highlight">
      <p>
        <strong>Sin costo y sin compromiso.</strong> Te escribiremos a este correo apenas Cumbreva esté
        listo${tieneVehiculo ? ` y te enviaremos consejos pensados para tu <strong>${esc(vehiculoLabel)}</strong>` : ""}.
      </p>
    </div>

    <p class="steps-title">¿Qué sigue?</p>
    <div class="step"><div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Guardamos tu cupo</strong> — quedas entre los primeros en la fila.</div></div></div>
    <div class="step"><div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Te mantenemos al tanto</strong> — te contamos cada avance del desarrollo.</div></div></div>
    <div class="step"><div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Acceso anticipado</strong> — serás de los primeros en probar tu copiloto eléctrico.</div></div></div>

    <div style="text-align:center;margin-top:28px"><a class="cta" href="${SITE_URL}">Conocer más de Cumbreva</a></div>
  </div>
  <div class="footer">
    <a href="${SITE_URL}">${esc(host)}</a> &nbsp;·&nbsp; ${esc(BRAND.company)} &nbsp;·&nbsp; Bogotá, Colombia<br>
    <span style="margin-top:6px;display:block">Recibes este correo porque te uniste a la lista de espera de Cumbreva.</span>
  </div>
</div>
</body></html>`
}
