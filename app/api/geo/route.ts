import { NextResponse, type NextRequest } from "next/server"
import { geocode } from "@/lib/calc-geo"

export const runtime = "nodejs"

/** Geocodificación server-side (oculta la API key de ORS). GET /api/geo?q=Bogotá */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? ""
  try {
    return NextResponse.json({ hits: await geocode(q) })
  } catch {
    return NextResponse.json({ hits: [] }, { status: 500 })
  }
}
