import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/site"

export function Logo({
  className,
  showTagline = true,
}: {
  className?: string
  showTagline?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-2px] shadow-primary/60">
        <Zap className="size-5 fill-current" />
      </span>
      <div className="leading-none">
        <span className="font-heading block text-xl font-bold uppercase tracking-tight text-foreground">
          {BRAND.name}
        </span>
        {showTagline && (
          <span className="block text-xs text-muted-foreground">
            {BRAND.tagline}
          </span>
        )}
      </div>
    </div>
  )
}
