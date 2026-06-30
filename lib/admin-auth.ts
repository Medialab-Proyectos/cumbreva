import { type NextRequest } from "next/server"

/**
 * Autenticación mínima del panel de administración.
 * Se basa en un secreto `ADMIN_TOKEN` (env var en Vercel). Al iniciar sesión se
 * guarda ese token en una cookie HttpOnly y cada ruta admin lo verifica.
 * Si `ADMIN_TOKEN` no está configurado, el panel queda deshabilitado (seguro).
 */
export const ADMIN_COOKIE = "cumbrera_admin"

export function adminTokenConfigurado(): boolean {
  return !!process.env.ADMIN_TOKEN
}

export function esAdmin(req: NextRequest): boolean {
  const token = process.env.ADMIN_TOKEN
  if (!token) return false
  return req.cookies.get(ADMIN_COOKIE)?.value === token
}
