# Cumbrera — Arquitectura de cuota diaria con base de datos mínima

## El problema
Tienes pocos recursos de base de datos. El control de cuota (7 búsquedas/día por usuario) **debe** vivir en la BD, porque el `localStorage` se puede borrar y evadir. El reto es lograr control real gastando el mínimo de peticiones.

## La estrategia: contador local que manda, BD que reconcilia

La idea central es **no escribir en la BD en cada búsqueda**. En su lugar:

1. El navegador lleva el contador del día en `localStorage` (apoyo, rápido, gratis).
2. La BD guarda el contador **autoritativo** por usuario.
3. Se sincroniza con la BD solo en **3 momentos**, no en cada búsqueda:
   - Al **iniciar sesión del día** (1 lectura): el backend devuelve cuántas búsquedas le quedan hoy.
   - Cada **N búsquedas** (ej. cada 3) o al agotar la cuota (1 escritura por lote): se "descarga" el consumo acumulado.
   - Al **cerrar/recargar** la página (`navigator.sendBeacon`, 1 escritura best-effort): persiste lo pendiente.

Resultado: en vez de 7 escrituras + 7 lecturas por usuario/día, gastas **~1 lectura + 2-3 escrituras**. Reduces la carga a la BD en ~70%.

### ¿Por qué es seguro aunque el cliente lleve la cuenta?
- El backend **nunca confía ciegamente** en el número que envía el cliente. Aplica la regla: `consumo_real = max(consumo_BD, consumo_reportado)`. Si alguien manipula el localStorage para reportar menos, la BD ya tiene el valor más alto y gana.
- La cuota se valida en el backend **antes** de devolver el resultado de la ruta. Si la BD dice que ya gastó 7, el endpoint responde `429 Cuota agotada` y no calcula nada.
- El reset de 24h se calcula con la fecha del servidor (`fecha_reset`), nunca con la hora del cliente.

## Modelo de datos (1 tabla)

```sql
CREATE TABLE usuarios_cuota (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,   -- identidad real
  nombre        VARCHAR(120),
  device_hash   VARCHAR(64),                    -- huella del dispositivo (apoyo anti-evasión)
  busquedas_hoy SMALLINT DEFAULT 0,
  fecha_reset   DATE NOT NULL,                  -- día al que pertenece el contador
  verificado    BOOLEAN DEFAULT FALSE,
  creado_en     TIMESTAMPTZ DEFAULT now(),
  ultimo_acceso TIMESTAMPTZ
);

CREATE INDEX idx_device_hash ON usuarios_cuota(device_hash);

-- OTP efímero (puede ir en Redis/memoria si está disponible, para no tocar la BD principal)
CREATE TABLE otp_pendiente (
  email      VARCHAR(255) PRIMARY KEY,
  codigo     CHAR(6) NOT NULL,
  expira_en  TIMESTAMPTZ NOT NULL,
  intentos   SMALLINT DEFAULT 0
);
```

> **Tip de recursos:** si tienes Redis o similar, pon `otp_pendiente` ahí con TTL de 10 min. El OTP es de alta rotación y no merece tocar la BD relacional.

## Endpoints (mínimos)

### 1. `POST /api/sesion`  — al cargar la app (1 lectura)
Body: `{ email?, device_hash }`
- Si llega `email` (usuario que dice estar registrado): busca por email.
- Si no, busca por `device_hash` para detectar al que regresa.
- Aplica reset si `fecha_reset < hoy` → `busquedas_hoy = 0, fecha_reset = hoy`.
- Responde: `{ estado: "nuevo" | "registrado" | "regresa_sin_registro", restantes, limite: 7 }`

### 2. `POST /api/registro`  — pedir OTP (1 escritura + envío correo)
Body: `{ nombre, email, device_hash }`
- Valida que el correo no sea temporal (lista de dominios desechables).
- Si el email ya existe y está verificado → responde `ya_existe` (el front ofrece "reenviar OTP para entrar").
- Genera OTP, lo guarda en `otp_pendiente`, lo envía por correo.

### 3. `POST /api/verificar`  — validar OTP (1 escritura)
Body: `{ email, codigo, device_hash }`
- Compara contra `otp_pendiente`, chequea expiración e `intentos` (máx. 5).
- Si OK: `upsert` en `usuarios_cuota` con `verificado = true`, asocia `device_hash`, fija cuota del día.
- Responde: `{ ok: true, restantes, limite: 7 }`

### 4. `POST /api/consumir`  — descargar consumo por lote (1 escritura cada N)
Body: `{ email, device_hash, consumidas }`
- `busquedas_hoy = max(busquedas_hoy, consumidas)` (regla anti-manipulación).
- Si excede 7 → responde `429`.
- Responde: `{ restantes }`

> El cálculo de la ruta (ORS) ocurre en el front o en un endpoint aparte; `consumir` solo lleva la contabilidad.

## Detección del usuario que regresa

`device_hash` = huella simple del dispositivo (no invasiva): hash de `userAgent + idioma + zona horaria + resolución + plataforma`. No identifica a la persona, solo distingue dispositivos. Combinada con `localStorage`:

- localStorage presente → sabemos quién es al instante, sin tocar BD.
- localStorage borrado pero `device_hash` coincide en BD → "Ya usaste Cumbrera antes. Si ya te registraste, ingresa tu correo."

No es infalible (VPN, otro equipo, incógnito cuentan como nuevos), pero sube mucho la barrera de evasión sin costo de BD por búsqueda.

## Mensajes al usuario (cuota agotada)

> "Has agotado tu límite gratuito de hoy (7 búsquedas). Esperamos volver a verte mañana. Disculpa los recursos limitados: estamos ampliando nuestra capacidad para darte más información y más consultas pronto."

Mostrar también: "Tu cuota se renueva en HH:MM" (cuenta regresiva hasta `fecha_reset + 24h`).

## PWA (instalable y usable offline parcial)

- `manifest.json` con nombre, iconos, colores de marca (verde neón / negro), `display: standalone`.
- `service-worker.js` cachea el shell de la app (HTML/CSS/JS) para carga instantánea y uso sin red del catálogo y la calculadora.
- Las llamadas a ORS y a la BD siguen necesitando red; el SW solo cachea la interfaz.
- Con esto el usuario "instala" Cumbrera en su teléfono y la abre como app nativa.

## Resumen de ahorro

| Enfoque | Peticiones BD por usuario/día |
|---|---|
| Validar cada búsqueda | ~14 (7 lecturas + 7 escrituras) |
| **Lotes + reconciliación (este diseño)** | **~3-4** |

Mismo control real, ~70% menos carga.
