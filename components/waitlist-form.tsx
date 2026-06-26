"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2, Mail, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success"

export function WaitlistForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" })

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
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
            Cumbreva esté disponible. Mientras tanto, escríbenos por WhatsApp si
            tienes dudas.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-border"
          onClick={() => {
            setForm({ nombre: "", telefono: "", email: "" })
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
          icon={<Phone className="size-4" />}
          label="Teléfono / WhatsApp"
          htmlFor="telefono"
        >
          <input
            id="telefono"
            type="tel"
            required
            value={form.telefono}
            onChange={update("telefono")}
            placeholder="+57 300 000 0000"
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
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="mt-6 w-full text-base font-semibold"
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
}: {
  icon: React.ReactNode
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex flex-col gap-1.5 rounded-2xl border border-border bg-background/40 px-4 py-3 transition-colors focus-within:border-primary/60"
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 text-primary">
        {icon}
        {children}
      </span>
    </label>
  )
}
