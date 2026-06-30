"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Loader2, LogOut, MessageSquare, RefreshCw, Search, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Usuario = {
  email: string
  nombre: string
  verificado: boolean
  feedbacks: number
  cuotaExtra: number
  limite: number
  usadasHoy: number
  ultimoAcceso: number
}
type Detalle = Usuario & {
  creadoEn: number
  feedbackItems: { mensaje: string; origen?: string; destino?: string; ts: number }[]
  historial: { origen: string; destino: string; distKm?: number; alcanza?: boolean; ts: number }[]
}

const input =
  "w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"

const fecha = (ts: number) =>
  ts ? new Date(ts).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "—"

export function AdminPanel() {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [sel, setSel] = useState<Detalle | null>(null)
  const [token, setToken] = useState("")
  const [err, setErr] = useState("")
  const [cargando, setCargando] = useState(false)
  const [filtro, setFiltro] = useState("")

  const cargarUsuarios = useCallback(async () => {
    setCargando(true)
    try {
      const r = await fetch("/api/admin/usuarios", { cache: "no-store" })
      if (r.status === 401) {
        setAuth("login")
        return
      }
      const j = await r.json()
      setUsuarios(j.usuarios ?? [])
      setAuth("ok")
    } catch {
      setAuth("login")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const entrar = async () => {
    setErr("")
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const j = await r.json()
      if (!j.ok) {
        setErr(j.error || "No se pudo entrar.")
        return
      }
      setToken("")
      cargarUsuarios()
    } catch {
      setErr("No se pudo entrar.")
    }
  }

  const salir = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {})
    setAuth("login")
    setSel(null)
  }

  const abrir = async (email: string) => {
    try {
      const r = await fetch(`/api/admin/usuario?email=${encodeURIComponent(email)}`, { cache: "no-store" })
      if (!r.ok) return
      setSel(await r.json())
    } catch {
      /* no-op */
    }
  }

  const guardarCuota = async (email: string, cuotaExtra: number) => {
    try {
      const r = await fetch("/api/admin/cuota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cuotaExtra }),
      })
      if (!r.ok) return
      await abrir(email)
      cargarUsuarios()
    } catch {
      /* no-op */
    }
  }

  if (auth === "checking") {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (auth === "login") {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Shield className="size-5" />
          </span>
          <h1 className="text-lg font-bold text-foreground">Panel de administración</h1>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="Token de administrador"
            className={input}
            autoFocus
          />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <Button size="lg" onClick={entrar} className="h-12 font-semibold">Entrar</Button>
        </div>
      </div>
    )
  }

  const visibles = usuarios.filter(
    (u) => !filtro || u.email.includes(filtro.toLowerCase()) || u.nombre.toLowerCase().includes(filtro.toLowerCase()),
  )

  if (sel) return <DetalleUsuario detalle={sel} onVolver={() => setSel(null)} onGuardar={guardarCuota} />

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Shield className="size-5" />
          </span>
          <h1 className="heading-display text-2xl text-foreground sm:text-3xl">Administración</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-lg" onClick={cargarUsuarios} aria-label="Recargar">
            <RefreshCw className={cn("size-4", cargando && "animate-spin")} />
          </Button>
          <Button variant="outline" size="lg" onClick={salir}>
            <LogOut className="size-4" /> Salir
          </Button>
        </div>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar por correo o nombre…" className={cn(input, "pl-9")} />
      </div>

      {visibles.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
          {cargando ? "Cargando…" : "Aún no hay usuarios registrados."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Usuario</th>
                <th className="px-4 py-3 text-center font-semibold">Feedbacks</th>
                <th className="px-4 py-3 text-center font-semibold">Cuota</th>
                <th className="px-4 py-3 text-center font-semibold">Hoy</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((u) => (
                <tr
                  key={u.email}
                  onClick={() => abrir(u.email)}
                  className="cursor-pointer border-t border-border transition-colors hover:bg-card/60"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{u.nombre || u.email}</div>
                    {u.nombre && <div className="text-xs text-muted-foreground">{u.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", u.feedbacks >= 20 ? "bg-primary/15 text-primary" : "text-muted-foreground")}>
                      <MessageSquare className="size-3" /> {u.feedbacks}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-foreground">{u.limite}{u.cuotaExtra > 0 && <span className="text-primary"> (+{u.cuotaExtra})</span>}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{u.usadasHoy}/{u.limite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function DetalleUsuario({
  detalle,
  onVolver,
  onGuardar,
}: {
  detalle: Detalle
  onVolver: () => void
  onGuardar: (email: string, cuotaExtra: number) => void
}) {
  const [extra, setExtra] = useState(detalle.cuotaExtra)
  return (
    <div className="mx-auto w-full max-w-3xl">
      <button onClick={onVolver} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver a la lista
      </button>

      <header className="mb-5">
        <h1 className="heading-display text-2xl text-foreground">{detalle.nombre || detalle.email}</h1>
        <p className="text-sm text-muted-foreground">{detalle.email}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">Creado: {fecha(detalle.creadoEn)}</span>
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">Último acceso: {fecha(detalle.ultimoAcceso)}</span>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-primary">{detalle.feedbacks} feedbacks</span>
        </div>
      </header>

      {/* Control de cuota */}
      <section className="mb-4 rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cuota diaria</div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <div className="text-3xl font-bold text-foreground">{7 + extra}</div>
            <div className="text-xs text-muted-foreground">7 base + {extra} extra</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-lg" onClick={() => setExtra((e) => Math.max(0, e - 1))}>−</Button>
            <span className="w-10 text-center text-lg font-semibold text-foreground">+{extra}</span>
            <Button variant="outline" size="icon-lg" onClick={() => setExtra((e) => Math.min(100, e + 1))}>+</Button>
          </div>
          <Button onClick={() => onGuardar(detalle.email, extra)} disabled={extra === detalle.cuotaExtra} className="font-semibold">
            Guardar cuota
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Sube la cuota solo tras revisar que el feedback del usuario tiene sentido y validez.
        </p>
      </section>

      {/* Feedback */}
      <section className="mb-4 rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feedback ({detalle.feedbackItems.length})</div>
        {detalle.feedbackItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin feedback todavía.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {detalle.feedbackItems.map((f, i) => (
              <li key={i} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="text-sm text-foreground">{f.mensaje}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{fecha(f.ts)}{f.origen ? ` · ${f.origen} → ${f.destino}` : ""}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Historial */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Búsquedas ({detalle.historial.length})</div>
        {detalle.historial.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin búsquedas registradas.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {detalle.historial.map((b, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="truncate text-foreground">{(b.origen || "").split(",")[0]} → {(b.destino || "").split(",")[0]}</span>
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
        )}
      </section>
    </div>
  )
}
