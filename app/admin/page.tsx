import type { Metadata } from "next"
import { AdminPanel } from "@/components/admin/admin-panel"

export const metadata: Metadata = {
  title: "Administración — Cumbreva",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <div className="min-h-dvh bg-background px-5 py-10 sm:px-8 sm:py-14">
      <AdminPanel />
    </div>
  )
}
