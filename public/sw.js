/* Service worker de Cumbreva — PWA instalable.
   Cachea el "shell" de la app para carga instantánea; nunca cachea las APIs
   (cuota, OTP, rutas) que siempre necesitan red y datos frescos. */
const CACHE = "cumbreva-v2"
const SHELL = ["/", "/calculadora", "/cuenta", "/manifest.webmanifest"]

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Nunca interceptar APIs ni peticiones que no sean GET.
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) return

  // Navegaciones: red primero, con respaldo a caché si no hay conexión.
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
          return res
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/calculadora"))),
    )
    return
  }

  // Estáticos: caché primero, con relleno desde la red.
  e.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && url.origin === self.location.origin) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
          }
          return res
        }),
    ),
  )
})
