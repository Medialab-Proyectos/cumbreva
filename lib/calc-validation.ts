/**
 * Validación de correo para la calculadora: formato + bloqueo de dominios
 * temporales/desechables. Se ejecuta en el backend (no confiar solo en el cliente).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Dominios desechables más comunes (lista embebida). En producción se puede
// complementar con la lista completa de disposable-email-domains.
const DOMINIOS_TEMPORALES = new Set([
  "mailinator.com", "10minutemail.com", "10minutemail.net", "guerrillamail.com",
  "guerrillamail.net", "guerrillamailblock.com", "tempmail.com", "temp-mail.org",
  "temp-mail.io", "tempmail.net", "tempmailo.com", "throwawaymail.com", "throwawaymail.net",
  "yopmail.com", "yopmail.net", "getnada.com", "trashmail.com", "trashmail.net",
  "maildrop.cc", "dispostable.com", "fakeinbox.com", "mailnesia.com", "mintemail.com",
  "mohmal.com", "sharklasers.com", "spam4.me", "grr.la", "tempinbox.com", "emailondeck.com",
  "mailcatch.com", "tempr.email", "discard.email", "33mail.com", "anonbox.net",
  "burnermail.io", "moakt.com", "inboxkitten.com", "1secmail.com", "1secmail.org",
  "wegwerfmail.de", "mailtemp.net", "tmpmail.net", "tmpmail.org", "fakemail.net",
  "20minutemail.com", "minuteinbox.com", "emailfake.com", "tempmailaddress.com",
  "mailpoof.com", "mail-temp.com", "spambox.us", "mailexpire.com", "incognitomail.com",
  "deadaddress.com", "nwytg.net", "byom.de", "tmail.ws", "mvrht.net",
])

export type ResultadoCorreo = { ok: true } | { ok: false; motivo: string }

export function validarCorreo(email: string): ResultadoCorreo {
  const limpio = (email || "").trim().toLowerCase()
  if (!EMAIL_RE.test(limpio)) {
    return { ok: false, motivo: "El correo no tiene un formato válido." }
  }
  const dominio = limpio.split("@")[1]
  if (DOMINIOS_TEMPORALES.has(dominio)) {
    return {
      ok: false,
      motivo: "No se permiten correos temporales o desechables. Usa un correo personal o corporativo.",
    }
  }
  // Chequeo de segundo nivel (ej. sub.tempmail.com → tempmail.com)
  const partes = dominio.split(".")
  for (let i = 0; i < partes.length - 1; i++) {
    if (DOMINIOS_TEMPORALES.has(partes.slice(i).join("."))) {
      return { ok: false, motivo: "No se permiten correos temporales o desechables." }
    }
  }
  return { ok: true }
}

export function generarOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
