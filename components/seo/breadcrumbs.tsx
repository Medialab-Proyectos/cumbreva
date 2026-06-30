import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav
      aria-label="Ruta de navegacion"
      className={cn(
        "border-b border-border/60 bg-background/70 backdrop-blur",
        className,
      )}
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 text-xs text-muted-foreground sm:px-6">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="whitespace-nowrap font-medium transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    "whitespace-nowrap",
                    isLast && "font-medium text-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
