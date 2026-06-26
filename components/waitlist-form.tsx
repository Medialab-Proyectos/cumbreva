"use client"

import { useState, type FormEvent } from "react"
import {
  CheckCircle2,
  Loader2,
  Mail,
  User,
  Car,
  Gauge,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success"

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

export function WaitlistForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState(initialForm)

  function update(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    // UI por ahora: simulamos el envío al CRM.
    setTimeout(() => {
      console.log("[v0] Lead capturado:", form)
      setStatus("success")
    }, 900)
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-card/60 p-8 text-center",
          className,
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            ¡Estás en la lista!
          </h3>
          <p className="text-sm text-muted-foreground text-pretty">
            Listo, {form.nombre.split(" ")[0] || "crack"}. Te avisaremos apenas
            Cumbreva esté disponible y te mantendremos al tanto de cada avance.
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
      className={cn(
        "rounded-2xl border border-border bg-card p-6 sm:p-8",
        className,
      )}
    >
      <div className="space-y-4">
        <Field
          icon={<User className="size-4" />}
          label="Nombre completo"
          htmlFor="nombre"
        >
          <input
            id="nombre"
            required
            value={form.nombre}
            onChange={update("nombre")}
            placeholder="Ej. Juan Pérez"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field
          icon={<Mail className="size-4" />}
          label="Correo electrónico"
          htmlFor="email"
        >
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="tucorreo@email.com"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field
          icon={<Car className="size-4" />}
          label="¿Qué vehículo tienes? (para enviarte consejos útiles)"
          htmlFor="vehiculo"
        >
          <select
            id="vehiculo"
            value={form.vehiculo}
            onChange={update("vehiculo")}
            className="w-full bg-transparent text-sm text-foreground outline-none [&>option]:bg-card [&>option]:text-foreground"
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
          <Field
            icon={<Car className="size-4" />}
            label="¿Cuál es tu marca? (la sumamos a la lista)"
            htmlFor="otraMarca"
          >
            <input
              id="otraMarca"
              required
              value={form.otraMarca}
              onChange={update("otraMarca")}
              placeholder="Ej. Tesla, Seres, Dongfeng…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </Field>
        )}

        <Field
          icon={<Gauge className="size-4" />}
          label="¿Cuántos kilómetros tiene? (opcional)"
          htmlFor="kilometros"
        >
          <input
            id="kilometros"
            type="number"
            min={0}
            inputMode="numeric"
            value={form.kilometros}
            onChange={update("kilometros")}
            placeholder="Ej. 25000"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field
          icon={<MessageSquare className="size-4" />}
          label="¿Algún comentario o problema con tu vehículo? (opcional)"
          htmlFor="comentario"
          align="start"
        >
          <textarea
            id="comentario"
            rows={3}
            value={form.comentario}
            onChange={update("comentario")}
            placeholder="Cuéntanos qué te gustaría resolver con Cumbreva…"
            className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </Field>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="mt-6 h-13 w-full text-base font-semibold"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Unirme a la lista de espera"
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Sin spam. Solo te avisamos cuando Cumbreva esté listo.
      </p>
    </form>
  )
}

function Field({
  icon,
  label,
  htmlFor,
  children,
  align = "center",
}: {
  icon: React.ReactNode
  label: string
  htmlFor: string
  children: React.ReactNode
  align?: "center" | "start"
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex flex-col gap-1.5 rounded-2xl border border-border bg-background/40 px-4 py-3 transition-colors focus-within:border-primary/60"
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={cn(
          "flex gap-2 text-primary",
          align === "start" ? "items-start" : "items-center",
        )}
      >
        {icon}
        {children}
      </span>
    </label>
  )
}
