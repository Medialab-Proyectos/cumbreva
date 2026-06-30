"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Copy, History, Loader2, LogOut, MapPin, MessageSquare, Share2, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/site"
import {
  EV_CATALOG,
  deviceHash,
  evaluar,
  type Resultado,
} from "@/lib/calc-physics"
import { MapaRuta, MedidorBateria, PerfilSVG } from "@/components/calculadora/battery-meter"

type Punto = { label: string; lat: number; lng: number; elev?: number }
type Fase = "datos" | "yaregistrado" | "otp" | "ok"

// Estilo app: secciones abiertas, con separadores suaves en vez de cajas dentro de cajas.
const card = "border-t border-border/70 py-5 sm:py-6"
const inputBase =
  "w-full border-0 border-b-2 border-border bg-transparent px-0.5 py-2.5 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-primary"

const clampBattery = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))

export function Calculator() {
  // Ruta
  const [origen, setOrigen] = useState("")
  const [destino, setDestino] = useState("")
  const [origenSel, setOrigenSel] = useState<Punto | null>(null)
  const [destinoSel, setDestinoSel] = useState<Punto | null>(null)
  const [sugO, setSugO] = useState<Punto[]>([])
  const [sugD, setSugD] = useState<Punto[]>([])

  // Vehículo
  const [evId, setEvId] = useState("byd-yuan-up")
  const ev = EV_CATALOG.find((e) => e.id === evId)!
  const [kwh, setKwh] = useState(ev.kwh)
  const [whkm, setWhkm] = useState(ev.whkm)
  const [masa, setMasa] = useState(ev.masa)
  const [bateria, setBateria] = useState(100)

  const [cargando, setCargando] = useState(false)
  const [sesionLista, setSesionLista] = useState(false)
  const [error, setError] = useState("")
  const [res, setRes] = useState<Resultado | null>(null)
  const [shareState, setShareState] = useState<"idle" | "copied">("idle")

  // Cuota / registro
  const [registrado, setRegistrado] = useState(false)
  const [nombre, setNombre] = useState("")
  const [limite, setLimite] = useState(2)
  const [restantes, setRestantes] = useState(2)
  const [regresaSinRegistro, setRegresaSinRegistro] = useState(false)
  const [muro, setMuro] = useState(false)
  const [cuotaAgotada, setCuotaAgotada] = useState(false)

  // Formulario del muro
  const [fase, setFase] = useState<Fase>("datos")
  const [email, setEmail] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [codigoDemo, setCodigoDemo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [errReg, setErrReg] = useState("")
  const [reenvioEn, setReenvioEn] = useState(0)

  // App: pestañas (Calcular / Historial) y acordeón de especificaciones
  const [tab, setTab] = useState<"calcular" | "historial">("calcular")
  const [verSpecs, setVerSpecs] = useState(false)
  const [histItems, setHistItems] = useState<{ origen: string; destino: string; distKm?: number; alcanza?: boolean; ts: number }[]>([])
  const [histCargando, setHistCargando] = useState(false)
  const [feedbackAbierto, setFeedbackAbierto] = useState(false)
  const [feedbackTexto, setFeedbackTexto] = useState("")
  const [feedbackEnviando, setFeedbackEnviando] = useState(false)
  const [feedbackError, setFeedbackError] = useState("")

  const tO = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const tD = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Sesión inicial (1 lectura a la BD)
  useEffect(() => {
    const inicio = Date.now()
    let cancelado = false
    const terminarSplash = () => {
      const restante = Math.max(0, 400 - (Date.now() - inicio))
      window.setTimeout(() => {
        if (!cancelado) setSesionLista(true)
      }, restante)
    }
    ;(async () => {
      try {
        const r = await fetch("/api/calc/sesion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceHash: deviceHash() }),
        })
        const j = await r.json()
        if (j.estado === "registrado") {
          setRegistrado(true)
          setNombre(j.nombre || "")
        } else if (j.estado === "regresa_sin_registro") {
          setRegresaSinRegistro(true)
          setFase("yaregistrado")
          if (j.emailSugerido) setEmail(j.emailSugerido)
        }
        setLimite(j.limite ?? 2)
        setRestantes(j.restantes ?? 0)
      } catch {
        /* Si la sesion falla, dejamos que el usuario intente entrar con correo. */
      } finally {
        terminarSplash()
      }
    })()
    return () => {
      cancelado = true
    }
  }, [])

  // Sincroniza specs al cambiar de modelo
  useEffect(() => {
    const e = EV_CATALOG.find((x) => x.id === evId)
    if (e && e.id !== "custom") {
      setKwh(e.kwh)
      setWhkm(e.whkm)
      setMasa(e.masa)
    }
  }, [evId])

  // Cuenta regresiva de reenvío OTP
  useEffect(() => {
    if (reenvioEn <= 0) return
    const t = setTimeout(() => setReenvioEn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [reenvioEn])

  // Carga el historial al abrir la pestaña (solo registrado)
  useEffect(() => {
    if (tab !== "historial" || !registrado) return
    setHistCargando(true)
    fetch("/api/calc/historial", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setHistItems(j.items ?? []))
      .catch(() => {})
      .finally(() => setHistCargando(false))
  }, [tab, registrado])

  useEffect(() => {
    if (!sesionLista || !registrado) return
    if (window.sessionStorage.getItem("cumbreva_session_counted") === "1") return
    window.sessionStorage.setItem("cumbreva_session_counted", "1")
    const key = "cumbreva_session_count"
    const dismissedKey = "cumbreva_feedback_done"
    const total = Number(window.localStorage.getItem(key) ?? "0") + 1
    window.localStorage.setItem(key, String(total))
    if (total >= 5 && window.localStorage.getItem(dismissedKey) !== "1") {
      setFeedbackAbierto(true)
    }
  }, [registrado, sesionLista])

  const pedirFeedbackSiToca = useCallback(() => {
    const key = "cumbreva_calc_count"
    const dismissedKey = "cumbreva_feedback_done"
    const total = Number(window.localStorage.getItem(key) ?? "0") + 1
    window.localStorage.setItem(key, String(total))
    if (total >= 5 && window.localStorage.getItem(dismissedKey) !== "1") {
      setFeedbackAbierto(true)
    }
  }, [])

  const enviarFeedback = useCallback(async (mensaje: string, contexto?: { origen?: string; destino?: string }) => {
    const limpio = mensaje.trim()
    if (!limpio) {
      setFeedbackError("Escribe un comentario corto para enviarlo.")
      return false
    }
    setFeedbackEnviando(true)
    setFeedbackError("")
    try {
      const r = await fetch("/api/calc/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: limpio,
          origen: contexto?.origen ?? origen,
          destino: contexto?.destino ?? destino,
          completado: true,
        }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.ok) {
        setFeedbackError(j.error || "No se pudo enviar. Intenta de nuevo.")
        return false
      }
      window.localStorage.setItem("cumbreva_feedback_done", "1")
      setFeedbackTexto("")
      setFeedbackAbierto(false)
      return true
    } catch {
      setFeedbackError("No se pudo enviar. Intenta de nuevo.")
      return false
    } finally {
      setFeedbackEnviando(false)
    }
  }, [destino, origen])

  const cerrarSesion = useCallback(async () => {
    await fetch("/api/calc/logout", { method: "POST" }).catch(() => {})
    setRegistrado(false)
    setNombre("")
    setRes(null)
    setTab("calcular")
    setHistItems([])
    setEmail("")
    setOtpInput("")
    setFase("datos")
    setLimite(2)
    setRestantes(2)
  }, [])

  const buscarSug = (txt: string, set: (p: Punto[]) => void) => {
    if (txt.trim().length < 3) return set([])
    fetch(`/api/geo?q=${encodeURIComponent(txt)}`)
      .then((r) => r.json())
      .then((j) => set(j.hits ?? []))
      .catch(() => set([]))
  }
  const onO = (v: string) => {
    setOrigen(v)
    setOrigenSel(null)
    clearTimeout(tO.current)
    tO.current = setTimeout(() => buscarSug(v, setSugO), 350)
  }
  const onD = (v: string) => {
    setDestino(v)
    setDestinoSel(null)
    clearTimeout(tD.current)
    tD.current = setTimeout(() => buscarSug(v, setSugD), 350)
  }

  const calcular = useCallback(async () => {
    setError("")
    setRes(null)
    if (!origen.trim() || !destino.trim()) {
      setError("Escribe origen y destino.")
      return
    }
    setCargando(true)
    try {
      // 1) Reservar cuota (autoridad en el servidor)
      const cr = await fetch("/api/calc/consumir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceHash: deviceHash() }),
      })
      const cj = await cr.json()
      if (!cr.ok) {
        setCargando(false)
        if (cj.requiereRegistro) {
          setRestantes(0)
          setFase(regresaSinRegistro ? "yaregistrado" : "datos")
          setMuro(true)
        } else if (cj.cuotaAgotada) {
          setRestantes(0)
          setCuotaAgotada(true)
        } else {
          setError("No se pudo validar tu cuota. Intenta de nuevo.")
        }
        return
      }
      setRestantes(cj.restantes ?? 0)
      if (cj.limite) setLimite(cj.limite)

      // 2) Calcular ruta + elevación (la API key de ORS vive en el servidor)
      const rr = await fetch("/api/ruta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: origenSel,
          origenTexto: origen,
          destino: destinoSel,
          destinoTexto: destino,
        }),
      })
      const rj = await rr.json()
      if (!rr.ok) throw new Error(rj.error || "No se pudo calcular la ruta.")

      // 3) Física (cliente)
      const resultado = evaluar(rj, { kwh, whkm, masa, bateria })
      setRes(resultado)
      pedirFeedbackSiToca()

      // 4) Historial (best-effort, solo registrados)
      fetch("/api/calc/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen,
          destino,
          distKm: resultado.distKm,
          alcanza: resultado.alcanza,
        }),
      }).catch(() => {})
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo calcular la ruta.")
    } finally {
      setCargando(false)
    }
  }, [origen, destino, origenSel, destinoSel, kwh, whkm, masa, bateria, regresaSinRegistro, pedirFeedbackSiToca])

  // Pedir OTP (registro nuevo o entrada de usuario existente)
  const pedirCodigo = useCallback(async () => {
    setErrReg("")
    if (!email.trim()) {
      setErrReg("Escribe tu correo.")
      return
    }
    setEnviando(true)
    try {
      const r = await fetch("/api/calc/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, deviceHash: deviceHash() }),
      })
      const j = await r.json()
      if (!r.ok) {
        setErrReg(j.error || "No se pudo enviar el código.")
        return
      }
      setCodigoDemo(j.demo ? j.codigo : "")
      setFase("otp")
      setReenvioEn(30)
    } catch {
      setErrReg("No se pudo enviar el código. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }, [fase, nombre, email])

  const verificarOTP = useCallback(async () => {
    setErrReg("")
    if (otpInput.trim().length !== 6) {
      setErrReg("El código tiene 6 dígitos.")
      return
    }
    setEnviando(true)
    try {
      const r = await fetch("/api/calc/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: otpInput.trim(), deviceHash: deviceHash(), nombre }),
      })
      const j = await r.json()
      if (!j.ok) {
        const msg =
          j.error === "incorrecto"
            ? "Código incorrecto. Revísalo e intenta de nuevo."
            : j.error === "expirado"
              ? "El código expiró. Pide uno nuevo."
              : j.error === "bloqueado"
                ? "Demasiados intentos. Pide un código nuevo."
                : "No se pudo verificar. Intenta de nuevo."
        setErrReg(msg)
        return
      }
      setRegistrado(true)
      setNombre(j.nombre || nombre)
      setLimite(j.limite ?? 7)
      setRestantes(j.restantes ?? 7)
      setRegresaSinRegistro(false)
      setFase("ok")
      setTimeout(() => setMuro(false), 1600)
    } catch {
      setErrReg("No se pudo verificar el código. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }, [otpInput, email, nombre])

  const botonTexto = cargando
    ? "Calculando ruta y elevación…"
    : restantes === 0 && !registrado
      ? "Regístrate para continuar"
      : restantes === 0 && registrado
        ? "Cuota de hoy agotada · vuelve mañana"
        : "Calcular autonomía real"

  const compartirRegistro = useCallback(async () => {
    const url = `${SITE_URL}/calculadora`
    const text = "Registrate en Cumbreva y calcula la autonomia real de tu carro electrico."
    try {
      if (navigator.share) {
        await navigator.share({ title: "Cumbreva", text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareState("copied")
      setTimeout(() => setShareState("idle"), 1800)
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        setShareState("copied")
        setTimeout(() => setShareState("idle"), 1800)
      } catch {}
    }
  }, [])

  if (!sesionLista) {
    return <SessionSplash />
  }

  if (!registrado) {
    return (
      <div className="mx-auto w-full max-w-md">
        <AccessGate
          fase={fase}
          email={email}
          otpInput={otpInput}
          codigoDemo={codigoDemo}
          errReg={errReg}
          enviando={enviando}
          reenvioEn={reenvioEn}
          onEmail={setEmail}
          onOtp={setOtpInput}
          onPedirCodigo={pedirCodigo}
          onVerificar={verificarOTP}
          onFase={(f) => {
            setErrReg("")
            setFase(f)
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Encabezado tipo app: logo + cuota */}
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <Eyebrow>Autonomia real</Eyebrow>
          <h1 className="font-heading text-2xl font-bold uppercase leading-none text-foreground">Planea tu ruta</h1>
        </div>
        <div className="flex items-center gap-2">
          <CuotaBadge registrado={registrado} restantes={restantes} limite={limite} />
          <button
            type="button"
            onClick={cerrarSesion}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Cerrar sesion"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <div className="sticky top-16 z-30 -mx-5 mb-5 grid grid-cols-2 gap-1 border-b border-border/60 bg-background/92 px-5 py-2 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <button
          onClick={() => setTab("calcular")}
          className={cn("flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors", tab === "calcular" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}
        >
          <Zap className="size-4" /> Calcular
        </button>
        <button
          onClick={() => setTab("historial")}
          className={cn("flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors", tab === "historial" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}
        >
          <History className="size-4" /> Historial
        </button>
      </div>

      {tab === "historial" ? (
        <HistorialView
          items={histItems}
          cargando={histCargando}
          feedbackEnviando={feedbackEnviando}
          onIr={() => setTab("calcular")}
          onFeedback={enviarFeedback}
        />
      ) : res ? (
        /* ---- Vista de resultado (como pantalla de app) ---- */
        <div className="pb-36">
          <section className="space-y-5">
            <div className="mb-2 text-xs font-medium text-muted-foreground">
              {origen.split(",")[0]}{" -> "}{destino.split(",")[0]}
            </div>
            <div className={cn("flex items-start gap-3 border-b border-border/70 pb-4 text-base font-bold", res.alcanza ? "text-primary" : "text-destructive")}>
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-current/10">
                {res.alcanza ? <Check className="size-4" /> : "!"}
              </span>
              <span>
              {res.alcanza
                ? `Alcanzas con ${Math.round(res.pctLlegada)}% de margen`
                : `No alcanza: te quedarias a ${Math.round(res.distKm - res.kmAlcance)} km del destino`}
              </span>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mapa de la ruta · {Math.round(res.distKm)} km
              </div>
              <MapaRuta coords={res.coords} distKm={res.distKm} alcanza={res.alcanza} kmAlcance={res.kmAlcance} origen={origen} destino={destino} />
            </div>

            <MedidorBateria pct={res.pctLlegada} alcanza={res.alcanza} kmAlcance={res.kmAlcance} distKm={res.distKm} />

            <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
              <Stat label="Distancia real" value={`${Math.round(res.distKm)} km`} sub={`${Math.round(res.durMin)} min en via`} />
              <Stat label="Autonomia real" value={`${Math.round(res.kmAlcance)} km`} sub={`con ${bateria}% de carga`} />
              <Stat label="Consumo corregido" value={`${Math.round(res.consumoReal)}`} sub={`Wh/km · +${Math.round(res.penaliz)}% vs catalogo`} />
              <Stat label="Desnivel acumulado" value={`+${Math.round(res.perfil.asc)} m`} sub={`baja ${Math.round(res.perfil.desc)} m`} />
            </div>

            <div className="border-t border-border/70 pt-5">
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Energia estimada · vel. media ~{Math.round(res.velMedia)} km/h
              </div>
              <Desglose res={res} />
            </div>

            <div className="border-t border-border/70 pt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Perfil de elevacion · {Math.round(res.perfil.min)}-{Math.round(res.perfil.max)} m
              </div>
              <PerfilSVG coords={res.coords} />
            </div>

            <p className="border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground/70">
              Estimacion con datos de {res.fuente}. El consumo real tambien depende de velocidad, clima, aire acondicionado,
              carga y estilo de conduccion. Deja siempre un margen de seguridad antes de viajar.
            </p>
          </section>
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 p-3 backdrop-blur-xl">
            <div className="mx-auto flex max-w-3xl gap-2">
              <Button size="lg" onClick={() => setRes(null)} variant="outline" className="h-12 flex-1 font-semibold">
                Calcular otra ruta
              </Button>
              <Button size="lg" onClick={compartirRegistro} className="h-12 px-4 font-semibold" aria-label="Compartir registro">
                {shareState === "copied" ? <Copy className="size-4" /> : <Share2 className="size-4" />}
                <span className="hidden sm:inline">{shareState === "copied" ? "Link copiado" : "Compartir"}</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ---- Vista de formulario (botón sticky abajo) ---- */
        <div className="pb-36">
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Calcula si tu batería <span className="text-foreground">realmente alcanza</span> entre dos puntos, corrigiendo
            por el terreno real de la ruta: pendiente, altitud y clima. Indica el origen, el destino y tu carga actual.
          </p>

          {/* Ruta */}
          <section className={cn(card, "mb-4")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoLugar label="Origen" dot="bg-primary" value={origen} onChange={onO} placeholder="Ej. Bogotá" sugerencias={sugO} onPick={(s) => { setOrigen(s.label); setOrigenSel(s); setSugO([]) }} />
              <CampoLugar label="Destino" dot="bg-amber-400" value={destino} onChange={onD} placeholder="Ej. Girardot" sugerencias={sugD} onPick={(s) => { setDestino(s.label); setDestinoSel(s); setSugD([]) }} />
            </div>
          </section>

          {/* Vehículo */}
          <section className={cn(card, "mb-3")}>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Zap className="size-4 text-primary" /> Tu vehículo eléctrico
            </div>
            <div className="grid gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Modelo</label>
                <select
                  value={evId}
                  onChange={(e) => setEvId(e.target.value)}
                  className={cn(inputBase, "[&>option]:bg-card [&>option]:text-foreground")}
                >
                  {EV_CATALOG.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.marca} {e.modelo !== "—" ? e.modelo : ""} {e.id !== "custom" ? `· ${e.kwh} kWh` : ""}
                    </option>
                  ))}
                </select>
              </div>
              {/* Lo más importante: con cuánta carga sale */}
              <BatteryField value={bateria} onChange={setBateria} />
            </div>

            {/* Especificaciones en acordeón (la app queda más pequeña) */}
            <button
              type="button"
              onClick={() => setVerSpecs((v) => !v)}
              className="mt-4 flex w-full items-center justify-between py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Especificaciones del vehículo
              <ChevronDown className={cn("size-4 transition-transform", verSpecs && "rotate-180")} />
            </button>
            {verSpecs && (
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <NumField label="Capacidad" unit="kWh" value={kwh} onChange={setKwh} step={0.5} />
                <NumField label="Consumo" unit="Wh/km" value={whkm} onChange={setWhkm} step={1} />
                <NumField label="Peso" unit="kg" value={masa} onChange={setMasa} step={50} />
              </div>
            )}
          </section>

          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}

          {/* Botón Calcular — sticky en la parte baja (app) */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 p-3 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">
              <Button
                size="lg"
                onClick={calcular}
                disabled={cargando}
                className="h-14 w-full rounded-lg text-base font-semibold shadow-xl shadow-primary/25"
              >
                {cargando ? <><Loader2 className="size-4 animate-spin" /> {botonTexto}</> : botonTexto}
              </Button>
            </div>
          </div>
        </div>
      )}

      {cargando && <AnalysisOverlay />}

      {feedbackAbierto && (
        <FeedbackModal
          value={feedbackTexto}
          error={feedbackError}
          sending={feedbackEnviando}
          onChange={setFeedbackTexto}
          onClose={() => {
            window.localStorage.setItem("cumbreva_feedback_done", "1")
            setFeedbackAbierto(false)
            setFeedbackError("")
          }}
          onSubmit={() => enviarFeedback(feedbackTexto)}
        />
      )}

      {/* Muro de registro */}
      {muro && (
        <Modal onClose={() => { if (!enviando && fase === "datos") setMuro(false) }}>
          {fase === "datos" && (
            <>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-4px] shadow-primary/60">
                  <Zap className="size-6 fill-current" />
                </span>
                <span className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">Cumbreva</span>
              </div>
              <h2 className="mb-2 text-xl font-bold leading-tight text-foreground">
                Ingresa tu correo para continuar
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Te enviamos un código para activar tus 7 búsquedas diarias gratis y guardar tu historial.
              </p>
              <div className="flex flex-col gap-3">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" type="email" inputMode="email" onKeyDown={(e) => e.key === "Enter" && pedirCodigo()} className={inputBase} autoFocus />
                {errReg && <p className="text-xs text-destructive">{errReg}</p>}
                <Button size="lg" onClick={pedirCodigo} disabled={enviando} className="h-12 font-semibold">
                  {enviando ? <><Loader2 className="size-4 animate-spin" /> Enviando código…</> : "Recibir código"}
                </Button>
                <button onClick={() => { setErrReg(""); setFase("yaregistrado") }} disabled={enviando} className="text-xs text-primary">
                  Ya me registré antes
                </button>
              </div>
              <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
                No se admiten correos temporales. No compartimos tu correo con terceros.
              </p>
            </>
          )}

          {fase === "yaregistrado" && (
            <>
              <Eyebrow>Bienvenido de vuelta</Eyebrow>
              <h2 className="mb-2 text-xl font-bold leading-tight text-foreground">Ya usaste Cumbreva antes</h2>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Ingresa tu correo y te enviaremos un código para entrar y recuperar tus 7 búsquedas del día.
              </p>
              <div className="flex flex-col gap-3">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" type="email" inputMode="email" onKeyDown={(e) => e.key === "Enter" && pedirCodigo()} className={inputBase} />
                {errReg && <p className="text-xs text-destructive">{errReg}</p>}
                <Button size="lg" onClick={pedirCodigo} disabled={enviando} className="h-12 font-semibold">
                  {enviando ? <><Loader2 className="size-4 animate-spin" /> Enviando código…</> : "Enviarme el código"}
                </Button>
                <button onClick={() => { setErrReg(""); setFase("datos") }} disabled={enviando} className="text-xs text-muted-foreground">
                  No, quiero registrarme
                </button>
              </div>
            </>
          )}

          {fase === "otp" && (
            <>
              <Eyebrow>Verificación · Código OTP</Eyebrow>
              <h2 className="mb-2 text-xl font-bold leading-tight text-foreground">Revisa tu correo</h2>
              <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                Enviamos un código de 6 dígitos a <span className="text-foreground">{email}</span>. Ingrésalo para continuar.
              </p>
              {codigoDemo && (
                <p className="mb-3 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-300">
                  Demo (sin correo configurado): tu código es <strong className="tracking-widest">{codigoDemo}</strong>.
                </p>
              )}
              <div className="flex flex-col gap-3">
                <input
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  inputMode="numeric"
                  onKeyDown={(e) => e.key === "Enter" && verificarOTP()}
                  className={cn(inputBase, "text-center text-2xl font-bold tracking-[0.5em]")}
                />
                {errReg && <p className="text-xs text-destructive">{errReg}</p>}
                <Button size="lg" onClick={verificarOTP} disabled={enviando} className="h-12 font-semibold">
                  {enviando ? <><Loader2 className="size-4 animate-spin" /> Verificando…</> : "Verificar código"}
                </Button>
                <button onClick={pedirCodigo} disabled={reenvioEn > 0} className={cn("text-xs", reenvioEn > 0 ? "text-muted-foreground/60" : "text-primary")}>
                  {reenvioEn > 0 ? `Reenviar código en ${reenvioEn}s` : "Reenviar código"}
                </button>
              </div>
            </>
          )}

          {fase === "ok" && (
            <div className="py-2 text-center">
              <div className="mb-2 text-4xl">✓</div>
              <h2 className="mb-1.5 text-xl font-bold text-primary">¡Verificado!</h2>
              <p className="text-sm text-muted-foreground">
                Listo. Tienes 7 búsquedas disponibles hoy. ¡Bienvenido a Cumbreva!
              </p>
            </div>
          )}
        </Modal>
      )}

      {/* Cuota agotada */}
      {cuotaAgotada && (
        <Modal onClose={() => setCuotaAgotada(false)}>
          <div className="text-center">
            <div className="mb-2.5 text-3xl">🌙</div>
            <h2 className="mb-2.5 text-lg font-bold leading-tight text-foreground">Agotaste tus 7 búsquedas de hoy</h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Esperamos volver a verte mañana. Disculpa los recursos limitados: estamos ampliando nuestra capacidad para
              darte más información y más consultas muy pronto.
            </p>
            <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-300">
              Tu cuota se renueva en <strong><CuentaRegresiva /></strong>
            </div>
            <Button variant="outline" onClick={() => setCuotaAgotada(false)}>Entendido</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ---- Subcomponentes --------------------------------------------------------
function SessionSplash() {
  return (
    <div className="flex min-h-[58dvh] flex-col items-center justify-center gap-4 text-center">
      <BlackLogoMark className="size-24 animate-pulse" />
      <div>
        <div className="font-heading text-2xl font-bold uppercase leading-none text-foreground">Cumbreva</div>
        <div className="mt-2 text-sm text-muted-foreground">Preparando tu sesión</div>
      </div>
    </div>
  )
}

function AccessGate({
  fase,
  email,
  otpInput,
  codigoDemo,
  errReg,
  enviando,
  reenvioEn,
  onEmail,
  onOtp,
  onPedirCodigo,
  onVerificar,
  onFase,
}: {
  fase: Fase
  email: string
  otpInput: string
  codigoDemo: string
  errReg: string
  enviando: boolean
  reenvioEn: number
  onEmail: (v: string) => void
  onOtp: (v: string) => void
  onPedirCodigo: () => void
  onVerificar: () => void
  onFase: (f: Fase) => void
}) {
  const esRegreso = fase === "yaregistrado"

  return (
    <section className="flex min-h-[calc(100dvh-9rem)] flex-col justify-center pb-10">
      <BlackLogoMark className="mb-6 size-24" />

      {(fase === "datos" || fase === "yaregistrado") && (
        <>
          <Eyebrow>{esRegreso ? "Bienvenido de vuelta" : "Iniciar sesion"}</Eyebrow>
          <h1 className="font-heading text-4xl font-bold uppercase leading-none text-foreground">
            {esRegreso ? "Recupera tu acceso" : "Entra a Cumbreva"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Ingresa tu correo para activar la calculadora, guardar historial y compartir rutas.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              type="email"
              inputMode="email"
              onKeyDown={(e) => e.key === "Enter" && onPedirCodigo()}
              className={inputBase}
              autoFocus
            />
            {errReg && <p className="text-xs text-destructive">{errReg}</p>}
            <Button size="lg" onClick={onPedirCodigo} disabled={enviando} className="h-12 font-semibold">
              {enviando ? <><Loader2 className="size-4 animate-spin" /> Enviando codigo...</> : "Recibir codigo"}
            </Button>
            <button
              onClick={() => onFase(esRegreso ? "datos" : "yaregistrado")}
              disabled={enviando}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {esRegreso ? "Quiero registrarme con otro correo" : "Ya me registre antes"}
            </button>
          </div>
        </>
      )}

      {fase === "otp" && (
        <>
          <Eyebrow>Codigo OTP</Eyebrow>
          <h1 className="font-heading text-4xl font-bold uppercase leading-none text-foreground">Revisa tu correo</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Enviamos un codigo de 6 digitos a <span className="text-foreground">{email}</span>.
          </p>
          {codigoDemo && (
            <p className="mt-4 border-l-2 border-amber-400 pl-3 text-xs text-amber-300">
              Demo: tu codigo es <strong className="tracking-widest">{codigoDemo}</strong>.
            </p>
          )}
          <div className="mt-8 flex flex-col gap-4">
            <input
              value={otpInput}
              onChange={(e) => onOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              inputMode="numeric"
              onKeyDown={(e) => e.key === "Enter" && onVerificar()}
              className={cn(inputBase, "text-center text-2xl font-bold tracking-[0.5em]")}
            />
            {errReg && <p className="text-xs text-destructive">{errReg}</p>}
            <Button size="lg" onClick={onVerificar} disabled={enviando} className="h-12 font-semibold">
              {enviando ? <><Loader2 className="size-4 animate-spin" /> Verificando...</> : "Verificar codigo"}
            </Button>
            <button
              onClick={onPedirCodigo}
              disabled={reenvioEn > 0}
              className={cn("text-sm", reenvioEn > 0 ? "text-muted-foreground/60" : "text-primary")}
            >
              {reenvioEn > 0 ? `Reenviar codigo en ${reenvioEn}s` : "Reenviar codigo"}
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function BlackLogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full border border-primary/60 bg-primary/15 text-primary shadow-2xl shadow-primary/35", className)}>
      <Zap className="size-1/2 fill-current" />
    </div>
  )
}

function AnalysisOverlay() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-lg border border-primary/25 bg-card p-6 text-center shadow-2xl">
        <BlackLogoMark className="mx-auto size-20 animate-pulse" />
        <h2 className="mt-5 font-heading text-2xl font-bold uppercase leading-none text-foreground">Analizando datos</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Estamos calculando ruta, elevacion y consumo real.
        </p>
        <Loader2 className="mx-auto mt-5 size-5 animate-spin text-primary" />
      </div>
    </div>
  )
}

function FeedbackModal({
  value,
  error,
  sending,
  onChange,
  onClose,
  onSubmit,
}: {
  value: string
  error: string
  sending: boolean
  onChange: (v: string) => void
  onClose: () => void
  onSubmit: () => void
}) {
  return (
    <Modal onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Star className="size-5 fill-current" />
        </span>
        <div>
          <Eyebrow>Tu opinion ayuda</Eyebrow>
          <h2 className="text-xl font-bold leading-tight text-foreground">Califica Cumbreva</h2>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Ya probaste varias rutas. Cuéntanos que mejorarías para que esta app ayude mejor a otros conductores.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. Me ayudo a entender el margen, pero agregaria puntos de carga..."
        className="mt-4 min-h-28 w-full resize-none rounded-lg border border-border bg-background/60 p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={onClose} disabled={sending} className="h-11 flex-1">
          Luego
        </Button>
        <Button onClick={onSubmit} disabled={sending} className="h-11 flex-1 font-semibold">
          {sending ? <><Loader2 className="size-4 animate-spin" /> Enviando...</> : "Enviar"}
        </Button>
      </div>
    </Modal>
  )
}

function CuotaBadge({ registrado, restantes, limite }: { registrado: boolean; restantes: number; limite: number }) {
  const agotada = restantes === 0
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs",
        agotada ? "border-amber-400/50 bg-amber-400/10 text-amber-300" : "border-primary/40 bg-primary/10 text-primary",
      )}
    >
      <span className={cn("size-2 rounded-full", agotada ? "bg-amber-400" : "bg-primary")} />
      {agotada
        ? registrado ? "Sin cuota hoy" : "Regístrate"
        : `${limite - restantes}/${limite} ${registrado ? "usadas hoy" : "usadas"}`}
    </div>
  )
}

function HistorialView({
  items,
  cargando,
  feedbackEnviando,
  onIr,
  onFeedback,
}: {
  items: { origen: string; destino: string; distKm?: number; alcanza?: boolean; ts: number }[]
  cargando: boolean
  feedbackEnviando: boolean
  onIr: () => void
  onFeedback: (mensaje: string, contexto?: { origen?: string; destino?: string }) => Promise<boolean>
}) {
  const [abierto, setAbierto] = useState<number | null>(null)
  const [comentario, setComentario] = useState("")
  const [enviado, setEnviado] = useState<number | null>(null)

  if (cargando) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border bg-card/40 p-8 text-center">
        <History className="mx-auto size-8 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">Aún no tienes búsquedas. Calcula tu primera ruta.</p>
        <Button onClick={onIr} className="mt-4 font-semibold">Calcular una ruta</Button>
      </div>
    )
  }
  const recorta = (t: string) => {
    const s = (t || "").split(",")[0]
    return s.length > 18 ? s.slice(0, 17) + "…" : s
  }
  return (
    <section>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tus búsquedas recientes</div>
      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {items.map((b, i) => (
          <li key={i} className="py-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-foreground">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{recorta(b.origen)} -&gt; {recorta(b.destino)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                {b.distKm ? `${Math.round(b.distKm)} km` : ""}
                {typeof b.alcanza === "boolean" && (
                  <span className={cn("rounded-full px-2 py-0.5", b.alcanza ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive")}>
                    {b.alcanza ? "alcanza" : "no alcanza"}
                  </span>
                )}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setAbierto(abierto === i ? null : i)
                  setComentario("")
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary transition-colors hover:text-foreground"
              >
                <MessageSquare className="size-3.5" />
                Apoyar a otros con un comentario
              </button>
              {enviado === i && <span className="text-xs text-primary">Comentario guardado</span>}
            </div>
            {abierto === i && (
              <div className="mt-3">
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Ej. Esta ruta tiene subida fuerte saliendo de la ciudad..."
                  className="min-h-20 w-full resize-none rounded-lg border border-border bg-card/40 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={async () => {
                      const ok = await onFeedback(comentario, { origen: b.origen, destino: b.destino })
                      if (ok) {
                        setEnviado(i)
                        setAbierto(null)
                        setComentario("")
                      }
                    }}
                    disabled={feedbackEnviando || !comentario.trim()}
                    className="font-semibold"
                  >
                    {feedbackEnviando ? <Loader2 className="size-3.5 animate-spin" /> : null}
                    Guardar comentario
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground/70">
        Tus comentarios ayudan a mejorar futuras recomendaciones y a orientar a otros usuarios en rutas similares.
      </p>
    </section>
  )
}

function CampoLugar({
  label,
  dot,
  value,
  onChange,
  onPick,
  sugerencias,
  placeholder,
}: {
  label: string
  dot: string
  value: string
  onChange: (v: string) => void
  onPick: (s: Punto) => void
  sugerencias: Punto[]
  placeholder: string
}) {
  return (
    <div className="relative">
      <div className="mb-1.5 flex items-center gap-2">
        <span className={cn("size-2 rounded-full", dot)} />
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      </div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputBase} />
      {sugerencias.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
          {sugerencias.map((s, i) => (
            <button
              key={i}
              onClick={() => onPick(s)}
              className="flex w-full items-center gap-2 border-b border-border px-3.5 py-2.5 text-left text-sm text-foreground last:border-0 hover:bg-muted/60"
            >
              <MapPin className="size-3.5 shrink-0 text-primary" />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BatteryField({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const pct = clampBattery(value)
  const set = (n: number) => onChange(clampBattery(n))
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Carga actual de la bateria</label>
        <div className="flex w-24 items-center gap-1 border-b-2 border-border transition-colors focus-within:border-primary">
          <input
            type="number"
            value={pct}
            min={0}
            max={100}
            step={1}
            onChange={(e) => set(Number(e.target.value))}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-right text-lg font-semibold text-foreground outline-none"
          />
          <span className="text-xs font-semibold text-muted-foreground/70">%</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={(e) => set(Number(e.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-full accent-primary"
        style={{ background: `linear-gradient(90deg, #36ff7a ${pct}%, rgba(255,255,255,0.14) ${pct}%)` }}
        aria-label="Carga actual de la bateria"
      />
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground/70">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

function NumField({
  label,
  unit,
  value,
  onChange,
  step = 1,
  max,
}: {
  label: string
  unit: string
  value: number
  onChange: (n: number) => void
  step?: number
  max?: number
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 border-b-2 border-border transition-colors focus-within:border-primary">
        <input
          type="number"
          value={value}
          step={step}
          max={max}
          onChange={(e) => {
            const n = Math.max(0, Number(e.target.value))
            onChange(typeof max === "number" ? Math.min(max, n) : n)
          }}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-lg text-foreground outline-none"
        />
        <span className="text-xs font-semibold text-muted-foreground/70">{unit}</span>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-[10.5rem] snap-start rounded-lg border border-border bg-card/45 px-3.5 py-3 sm:min-w-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold leading-none text-foreground">{value}</div>
      {sub && <div className="mt-1 text-[11px] text-muted-foreground/70">{sub}</div>}
    </div>
  )
}

function Desglose({ res }: { res: Resultado }) {
  const partes = [
    { lbl: "Subida (pendiente)", val: res.wPend, col: "bg-amber-400" },
    { lbl: "Aerodinámica", val: res.wAero, col: "bg-primary" },
    { lbl: "Rodadura", val: res.wRod, col: "bg-primary/60" },
    { lbl: "Clima / A·C", val: res.wAux, col: "bg-sky-400" },
  ]
  const total = partes.reduce((s, p) => s + p.val, 0) || 1
  return (
    <div className="flex flex-col gap-2">
      {partes.map((p, i) => (
        <div key={i}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">{p.lbl}</span>
            <span className="text-foreground">{Math.round(p.val / 1000)} kWh · {Math.round((p.val / total) * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-background">
            <div className={cn("h-full", p.col)} style={{ width: `${(p.val / total) * 100}%` }} />
          </div>
        </div>
      ))}
      {res.wRegen > 0 && (
        <div className="mt-0.5 text-xs text-sky-400">
          ↻ Regeneración recupera ~{Math.round(res.wRegen / 1000)} kWh en las bajadas
        </div>
      )}
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-primary/25 bg-card p-6 shadow-2xl sm:p-7">
        {children}
      </div>
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-primary">{children}</div>
}

function CuentaRegresiva() {
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
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return <span>{p(h)}:{p(m)}:{p(s)}</span>
}
