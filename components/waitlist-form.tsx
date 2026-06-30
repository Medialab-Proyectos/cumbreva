"use client"

import { useState, type FormEvent } from "react"
import {
  Car,
  CheckCircle2,
  Gauge,
  Loader2,
  Mail,
  MessageSquare,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

const initialForm = {
  nombre: "",
  email: "",
  vehiculo: "",
  otraMarca: "",
  kilometros: "",
  comentario: "",
}

// Marcas eléctricas más comunes en Colombia para el desplegable.
const vehiculos = [
  "BYD",
  "Volvo",
  "Renault",
  "Kia",
  "GWM",
  "BMW",
  "Zeekr",
  "Hyundai",
  "Volkswagen",
  "JAC",
  "Audi",
  "Mercedes-Benz",
  "MG",
  "Chevrolet",
  "Nissan",
  "Otra marca",
  "Aún no tengo eléctrico",
]

// Misma estética que la calculadora: campos abiertos (subrayado), no cajitas.
const inputBase =
  "w-full border-0 border-b-2 border-border bg-transparent px-0.5 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-primary"

export function WaitlistForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState(initialForm)

  function update(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("request failed")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-card/60 p-8 text-center",
          className,
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">¡Estás en la lista!</h3>
          <p className="text-sm text-pretty text-muted-foreground">
            Listo, {form.nombre.split(" ")[0] || "crack"}. Te avisaremos apenas Cumbreva esté disponible y te
            mantendremos al tanto de cada avance.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-border"
          onClick={() => {
            setForm(initialForm)
            setStatus("idle")
          }}
        >
          Registrar otro
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8", className)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field icon={<User className="size-3.5" />} label="Nombre completo" htmlFor="nombre" className="sm:col-span-2">
          <input
            id="nombre"
            required
            value={form.nombre}
            onChange={update("nombre")}
            placeholder="Ej. Juan Pérez"
            className={inputBase}
          />
        </Field>

        <Field icon={<Mail className="size-3.5" />} label="Correo electrónico" htmlFor="email" className="sm:col-span-2">
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="tucorreo@email.com"
            className={inputBase}
          />
        </Field>

        <Field icon={<Car className="size-3.5" />} label="¿Qué vehículo tienes?" htmlFor="vehiculo" className={form.vehiculo === "Otra marca" ? "" : "sm:col-span-2"}>
          <select
            id="vehiculo"
            value={form.vehiculo}
            onChange={update("vehiculo")}
            className={cn(inputBase, "[&>option]:bg-card [&>option]:text-foreground")}
          >
            <option value="" disabled>
              Selecciona tu marca
            </option>
            {vehiculos.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        {form.vehiculo === "Otra marca" && (
          <Field icon={<Car className="size-3.5" />} label="¿Cuál es tu marca?" htmlFor="otraMarca">
            <input
              id="otraMarca"
              required
              value={form.otraMarca}
              onChange={update("otraMarca")}
              placeholder="Ej. Tesla, Seres…"
              className={inputBase}
            />
          </Field>
        )}

        <Field icon={<Gauge className="size-3.5" />} label="Kilómetros (opcional)" htmlFor="kilometros" className="sm:col-span-2">
          <input
            id="kilometros"
            type="number"
            min={0}
            inputMode="numeric"
            value={form.kilometros}
            onChange={update("kilometros")}
            placeholder="Ej. 25000"
            className={inputBase}
          />
        </Field>

        <Field icon={<MessageSquare className="size-3.5" />} label="Comentario (opcional)" htmlFor="comentario" className="sm:col-span-2">
          <textarea
            id="comentario"
            rows={3}
            value={form.comentario}
            onChange={update("comentario")}
            placeholder="Cuéntanos qué te gustaría resolver con Cumbreva…"
            className={cn(inputBase, "resize-none")}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={status === "loading"} className="mt-7 h-13 w-full text-base font-semibold">
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Unirme a la lista de espera"
        )}
      </Button>

      {status === "error" ? (
        <p className="mt-3 text-center text-xs text-destructive">
          Ups, no pudimos registrarte. Verifica tu correo e inténtalo de nuevo.
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Sin spam. Solo te avisamos cuando Cumbreva esté listo.
        </p>
      )}
    </form>
  )
}

function Field({
  icon,
  label,
  htmlFor,
  children,
  className,
}: {
  icon: React.ReactNode
  label: string
  htmlFor: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label htmlFor={htmlFor} className={cn("flex flex-col gap-1.5", className)}>
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  )
}
