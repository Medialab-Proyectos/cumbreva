/**
 * Persistencia de la calculadora Cumbrera en Vercel KV (Upstash Redis).
 *
 * Misma tecnología que Medialab Ingeniería / UXBox (medialabweb/lib/lab-store.ts):
 * degradación elegante — si no están KV_REST_API_URL / KV_REST_API_TOKEN,
 * todo cae a un modo "sin BD" para que el build y el entorno local funcionen.
 *
 * Modelo de claves
 *   calc:otp:<email>             JSON { codigo, nombre, intentos } · TTL 10 min
 *   calc:user:<email>            JSON UserRecord
 *   calc:quota:<email>:<fecha>   contador de búsquedas del día · TTL 48 h
 *   calc:anon:<device>:<fecha>   contador anónimo del día · TTL 48 h
 *   calc:device:<device>         email asociado (detecta usuario que regresa)
 *   calc:sess:<token>            email de la sesión · TTL 30 días
 *   calc:hist:<email>            lista (LPUSH) de búsquedas recientes
 */
import { randomBytes } from "crypto"

export const LIMITE_ANONIMO = 2 // búsquedas antes de pedir registro
export const LIMITE_DIARIO = 7 // búsquedas/día para usuarios registrados

const OTP_TTL = 60 * 10 // 10 min
const QUOTA_TTL = 60 * 60 * 48 // 48 h (la clave incluye la fecha → reset natural)
const SESSION_TTL = 60 * 60 * 24 * 30 // 30 días
const HIST_MAX = 25 // búsquedas guardadas por usuario

export type UserRecord = {
  email: string
  nombre?: string
  verificado: boolean
  creadoEn: number
  ultimoAcceso: number
  /** cuota adicional otorgada manualmente por el admin (sobre LIMITE_DIARIO) */
  cuotaExtra: number
  /** total de feedbacks válidos acumulados */
  feedbacks: number
}

export type Busqueda = {
  origen: string
  destino: string
  distKm?: number
  alcanza?: boolean
  completado?: boolean
  ts: number
}

export function kvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function getKv() {
  if (!kvConfigured()) return null
  const { kv } = await import("@vercel/kv")
  return kv
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Fecha "hoy" en America/Bogota (YYYY-MM-DD) calculada en el servidor. */
export function hoyBogota(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

// ---- OTP -------------------------------------------------------------------
export async function guardarOtp(email: string, codigo: string, nombre?: string): Promise<boolean> {
  const kv = await getKv()
  if (!kv) return false
  try {
    await kv.set(
      `calc:otp:${normalizeEmail(email)}`,
      { codigo, nombre: nombre ?? "", intentos: 0 },
      { ex: OTP_TTL },
    )
    return true
  } catch {
    return false
  }
}

type OtpRecord = { codigo: string; nombre: string; intentos: number }

export async function leerOtp(email: string): Promise<OtpRecord | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<OtpRecord>(`calc:otp:${normalizeEmail(email)}`)) ?? null
  } catch {
    return null
  }
}

export async function sumarIntentoOtp(email: string, rec: OtpRecord): Promise<void> {
  const kv = await getKv()
  if (!kv) return
  try {
    await kv.set(
      `calc:otp:${normalizeEmail(email)}`,
      { ...rec, intentos: rec.intentos + 1 },
      { ex: OTP_TTL },
    )
  } catch {
    /* no-op */
  }
}

export async function borrarOtp(email: string): Promise<void> {
  const kv = await getKv()
  if (!kv) return
  try {
    await kv.del(`calc:otp:${normalizeEmail(email)}`)
  } catch {
    /* no-op */
  }
}

// ---- Usuarios --------------------------------------------------------------
export async function getUser(email: string): Promise<UserRecord | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<UserRecord>(`calc:user:${normalizeEmail(email)}`)) ?? null
  } catch {
    return null
  }
}

export async function upsertUser(
  email: string,
  patch: Partial<UserRecord>,
): Promise<UserRecord | null> {
  const kv = await getKv()
  if (!kv) return null
  const e = normalizeEmail(email)
  try {
    const prev = (await kv.get<UserRecord>(`calc:user:${e}`)) ?? null
    const next: UserRecord = {
      email: e,
      nombre: prev?.nombre,
      verificado: prev?.verificado ?? false,
      creadoEn: prev?.creadoEn ?? Date.now(),
      ultimoAcceso: Date.now(),
      cuotaExtra: prev?.cuotaExtra ?? 0,
      feedbacks: prev?.feedbacks ?? 0,
      ...patch,
    }
    await kv.set(`calc:user:${e}`, next)
    return next
  } catch {
    return null
  }
}

export function limiteDe(user: UserRecord | null): number {
  return LIMITE_DIARIO + (user?.cuotaExtra ?? 0)
}

// ---- Cuota diaria (contador autoritativo) ----------------------------------
async function leerContador(key: string): Promise<number> {
  const kv = await getKv()
  if (!kv) return 0
  try {
    return (await kv.get<number>(key)) ?? 0
  } catch {
    return 0
  }
}

/** Incrementa atómicamente y refresca el TTL. Devuelve el nuevo total. */
async function incrementar(key: string): Promise<number> {
  const kv = await getKv()
  if (!kv) return 0
  try {
    const total = await kv.incr(key)
    if (total === 1) await kv.expire(key, QUOTA_TTL)
    return total
  } catch {
    return 0
  }
}

export async function usadasRegistrado(email: string): Promise<number> {
  return leerContador(`calc:quota:${normalizeEmail(email)}:${hoyBogota()}`)
}

export async function consumirRegistrado(email: string): Promise<number> {
  return incrementar(`calc:quota:${normalizeEmail(email)}:${hoyBogota()}`)
}

export async function usadasAnonimo(deviceHash: string): Promise<number> {
  return leerContador(`calc:anon:${deviceHash}:${hoyBogota()}`)
}

export async function consumirAnonimo(deviceHash: string): Promise<number> {
  return incrementar(`calc:anon:${deviceHash}:${hoyBogota()}`)
}

// ---- Detección del usuario que regresa -------------------------------------
export async function asociarDevice(deviceHash: string, email: string): Promise<void> {
  const kv = await getKv()
  if (!kv || !deviceHash) return
  try {
    await kv.set(`calc:device:${deviceHash}`, normalizeEmail(email), { ex: SESSION_TTL })
  } catch {
    /* no-op */
  }
}

export async function emailDeDevice(deviceHash: string): Promise<string | null> {
  const kv = await getKv()
  if (!kv || !deviceHash) return null
  try {
    return (await kv.get<string>(`calc:device:${deviceHash}`)) ?? null
  } catch {
    return null
  }
}

// ---- Sesiones --------------------------------------------------------------
export async function createSession(email: string): Promise<string | null> {
  const kv = await getKv()
  if (!kv) return null
  try {
    const token = randomBytes(24).toString("hex")
    await kv.set(`calc:sess:${token}`, normalizeEmail(email), { ex: SESSION_TTL })
    return token
  } catch {
    return null
  }
}

export async function getSessionEmail(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const kv = await getKv()
  if (!kv) return null
  try {
    return (await kv.get<string>(`calc:sess:${token}`)) ?? null
  } catch {
    return null
  }
}

// ---- Historial de búsquedas ------------------------------------------------
export async function registrarBusqueda(email: string, b: Busqueda): Promise<void> {
  const kv = await getKv()
  if (!kv) return
  try {
    const key = `calc:hist:${normalizeEmail(email)}`
    await kv.lpush(key, JSON.stringify(b))
    await kv.ltrim(key, 0, HIST_MAX - 1)
  } catch {
    /* no-op */
  }
}

export async function historial(email: string): Promise<Busqueda[]> {
  const kv = await getKv()
  if (!kv) return []
  try {
    const raw = await kv.lrange<string | Busqueda>(`calc:hist:${normalizeEmail(email)}`, 0, HIST_MAX - 1)
    return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r))
  } catch {
    return []
  }
}
