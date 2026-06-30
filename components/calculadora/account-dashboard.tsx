"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Gauge,
  History,
  Loader2,
  LogOut,
  MapPin,
  MessageSquare,
  Mountain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { deviceHash } from "@/lib/calc-physics"

type Busqueda = { origen: string; destino: string; distKm?: number; alcanza?: boolean; ts: number }
type Cuenta = {
  auth: boolean
  email?: string
  nombre?: string
  limite?: number
  usadas?: number
  restantes?: number
  feedbacks?: number
  historial?: Busqueda[]
}

const input =
  "w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"

export function AccountDashboard() {
  const [cuenta, setCuenta] = useState<Cuenta | null>(null)
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    try {
      const r = await fetch("/api/calc/cuenta", { cache: "no-store" })
      setCuenta(await r.json())
    } catch {
      setCuenta({ auth: false })
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (!cuenta?.auth) return <LoginCard onLogin={recargar} />

  return <Dashboard cuenta={cuenta} onLogout={recargar} onFeedback={recargar} />
}

// ---- Login (OTP) -----------------------------------------------------------
function LoginCard({ onLogin }: { onLogin: () => void }) {
  const [fase, setFase] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [otp, setOtp] = useState("")
  const [codigoDemo, setCodigoDemo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [err, setErr] = useState("")

  const pedir = async () => {
    setErr("")
    setEnviando(true)
    try {
      const r = await fetch("/api/calc/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre, deviceHash: deviceHash() }),
      })
      const j = await r.json()
      if (!r.ok) {
        setErr(j.error || "No se pudo enviar el código.")
        return
      }
      setCodigoDemo(j.demo ? j.codigo : "")
      setFase("otp")
    } catch {
      setErr("No se pudo enviar el código. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  const verificar = async () => {
    setErr("")
    if (otp.trim().length !== 6) {
      setErr("El código tiene 6 dígitos.")
      return
    }
    setEnviando(true)
    try {
      const r = await fetch("/api/calc/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: otp.trim(), nombre, deviceHash: deviceHash() }),
      })
      const j = await r.json()
      if (!j.ok) {
        setErr("Código incorrecto o expirado. Pide uno nuevo.")
        return
      }
      onLogin()
    } catch {
      setErr("No se pudo verificar. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Mountain className="size-5" />
        </span>
        <div>
          <h1 className="text-lg font-bold text-foreground">Tu cuenta Cumbreva</h1>
          <p className="text-xs text-muted-foreground">Entra con tu correo para ver tu uso e historial</p>
        </div>
      </div>

      {fase === "email" ? (
        <div className="flex flex-col gap-3">
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre (si es tu primera vez)" className={input} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" type="email" inputMode="email" onKeyDown={(e) => e.key === "Enter" && pedir()} className={input} />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <Button size="lg" onClick={pedir} disabled={enviando} className="h-12 font-semibold">
            {enviando ? <><Loader2 className="size-4 animate-spin" /> Enviando…</> : "Enviarme el código"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Código enviado a <span className="text-foreground">{email}</span>.
          </p>
          {codigoDemo && (
            <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
              Demo: tu código es <strong className="tracking-widest">{codigoDemo}</strong>.
            </p>
          )}
          <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" inputMode="numeric" onKeyDown={(e) => e.key === "Enter" && verificar()} className={cn(input, "text-center text-2xl font-bold tracking-[0.5em]")} />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <Button size="lg" onClick={verificar} disabled={enviando} className="h-12 font-semibold">
            {enviando ? <><Loader2 className="size-4 animate-spin" /> Verificando…</> : "Entrar"}
          </Button>
          <button onClick={() => setFase("email")} className="text-xs text-muted-foreground">Usar otro correo</button>
        </div>
      )}
    </div>
  )
}

// ---- Dashboard -------------------------------------------------------------
function Dashboard({ cuenta, onLogout, onFeedback }: { cuenta: Cuenta; onLogout: () => void; onFeedback: () => void }) {
  const usadas = cuenta.usadas ?? 0
  const limite = cuenta.limite ?? 7
  const restantes = cuenta.restantes ?? 0
  const pct = Math.min(100, (usadas / Math.max(1, limite)) * 100)

  const logout = async () => {
    await fetch("/api/calc/logout", { method: "POST" }).catch(() => {})
    onLogout()
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Hola{cuenta.nombre ? "," : ""}</p>
          <h1 className="heading-display text-2xl text-foreground sm:text-3xl">{cuenta.nombre || cuenta.email}</h1>
        </div>
        <Button variant="outline" size="lg" onClick={logout}>
          <LogOut className="size-4" /> Salir
        </Button>
      </header>

      {/* Cuota del día */}
      <section className="mb-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Gauge className="size-4 text-primary" /> Tu cuota de hoy
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold leading-none text-foreground">
              {restantes}<span className="text-xl text-muted-foreground"> / {limite}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">búsquedas disponibles</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300">
            <Clock className="size-3.5" /> renueva en <ResetCountdown />
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${100 - pct}%` }} />
        </div>
        <Link href="/calculadora" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Mountain className="size-4" /> Abrir la calculadora
        </Link>
      </section>

      {/* Historial */}
      <section className="mb-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <History className="size-4 text-primary" /> Búsquedas recientes
        </div>
        {cuenta.historial && cuenta.historial.length > 0 ? (
          <ul className="flex flex-col divide-y divide-border">
            {cuenta.historial.map((b, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-foreground">
                  <MapPin className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">{recortar(b.origen)} → {recortar(b.destino)}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  {b.distKm ? `${Math.round(b.distKm)} km` : ""}
                  {typeof b.alcanza === "boolean" && (
                    <span className={cn("rounded-full px-2 py-0.5", b.alcanza ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive")}>
                      {b.alcanza ? "alcanza" : "no alcanza"}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">Aún no tienes búsquedas. Abre la calculadora y prueba una ruta.</p>
        )}
      </section>

      {/* Feedback */}
      <FeedbackCard onSent={onFeedback} feedbacks={cuenta.feedbacks ?? 0} />
    </div>
  )
}

function FeedbackCard({ onSent, feedbacks }: { onSent: () => void; feedbacks: number }) {
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState("")

  const enviar = async () => {
    setErr("")
    if (!mensaje.trim()) {
      setErr("Escribe tu comentario.")
      return
    }
    setEnviando(true)
    try {
      const r = await fetch("/api/calc/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje }),
      })
      const j = await r.json()
      if (!j.ok) {
        setErr(j.error || "No se pudo enviar.")
        return
      }
      setOk(true)
      setMensaje("")
      onSent()
      setTimeout(() => setOk(false), 2500)
    } catch {
      setErr("No se pudo enviar. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <MessageSquare className="size-4 text-primary" /> Tu feedback
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        ¿Algo falló o se puede mejorar? Tu feedback nos ayuda a mejorar la calculadora — y entre más aportes útiles,
        más cuota podemos darte.
      </p>
      {ok ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          <CheckCircle2 className="size-4" /> ¡Gracias! Recibimos tu feedback.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={3} placeholder="Cuéntanos qué pasó o qué te gustaría…" className={cn(input, "resize-none")} />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{feedbacks} feedbacks enviados</span>
            <Button onClick={enviar} disabled={enviando} className="font-semibold">
              {enviando ? <><Loader2 className="size-4 animate-spin" /> Enviando…</> : "Enviar feedback"}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

function recortar(t: string) {
  if (!t) return "—"
  const s = t.split(",")[0]
  return s.length > 18 ? s.slice(0, 17) + "…" : s
}

function ResetCountdown() {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    const calc = () => {
      const ahora = new Date()
      const manana = new Date(ahora)
      manana.setHours(24, 0, 0, 0)
      return manana.getTime() - ahora.getTime()
    }
    setMs(calc())
    const t = setInterval(() => setMs(calc()), 1000)
    return () => clearInterval(t)
  }, [])
  const p = (n: number) => String(n).padStart(2, "0")
  return <span className="font-semibold">{p(Math.floor(ms / 3600000))}:{p(Math.floor((ms % 3600000) / 60000))}</span>
}
