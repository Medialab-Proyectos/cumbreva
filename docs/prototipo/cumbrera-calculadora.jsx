import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// CUMBRERA — Calculadora de autonomía real para vehículos eléctricos
// Estima si la batería alcanza, corrigiendo por el desnivel real de la ruta.
// MediaLab Ingeniería · verde neón sobre negro carbón
// ============================================================================

// ---- Tokens de marca -------------------------------------------------------
const C = {
  bg: "#0a0d0a",
  panel: "#11160f",
  panel2: "#0d110c",
  line: "#1d2a18",
  neon: "#36ff7a",      // verde brillante (signature)
  neonDim: "#1fa84f",
  lime: "#b6ff3d",
  amber: "#ffb547",
  red: "#ff4d4d",
  text: "#e8f3e6",
  textDim: "#7d8c79",
  textFaint: "#4a5547",
};

// ORS público de demo — el usuario debe reemplazar por su propia key gratuita
// de https://openrouteservice.org/dev/#/signup (no necesita tarjeta).
const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjViNTgwNDViNDBmMTQ2M2JiMzNmNTA1NzVjOGQ5NjJjIiwiaCI6Im11cm11cjY0In0="; // OpenRouteService API key

// Catálogo de EVs más vendidos en Colombia 2025 (fuente: ANDEMOS/RUNT).
// kwh = batería útil · whkm = consumo real estimado · masa = peso en orden de marcha (kg).
// Ordenado por volumen de ventas 2025.
const EV_CATALOG = [
  { id: "custom", marca: "Personalizado", modelo: "—", kwh: 50, whkm: 160, masa: 1700 },
  { id: "byd-yuan-up", marca: "BYD", modelo: "Yuan Up", kwh: 45.1, whkm: 140, masa: 1540 },
  { id: "byd-seagull", marca: "BYD", modelo: "Seagull / Dolphin Mini", kwh: 38.9, whkm: 125, masa: 1240 },
  { id: "kia-ev5", marca: "Kia", modelo: "EV5", kwh: 64.2, whkm: 168, masa: 1910 },
  { id: "byd-yuan-plus", marca: "BYD", modelo: "Yuan Plus / Atto 3", kwh: 60.5, whkm: 160, masa: 1750 },
  { id: "volvo-ex30", marca: "Volvo", modelo: "EX30", kwh: 64, whkm: 165, masa: 1830 },
  { id: "chery-icar03", marca: "Chery", modelo: "iCAR 03", kwh: 69.8, whkm: 175, masa: 1810 },
  { id: "chevrolet-spark-euv", marca: "Chevrolet", modelo: "Spark EUV", kwh: 42.3, whkm: 140, masa: 1480 },
  { id: "mg-4", marca: "MG", modelo: "MG 4", kwh: 51, whkm: 160, masa: 1655 },
  { id: "mg-s5", marca: "MG", modelo: "S5 EV", kwh: 49, whkm: 154, masa: 1620 },
  { id: "mg-4-urban", marca: "MG", modelo: "MG4 EV Urban", kwh: 42.8, whkm: 145, masa: 1540 },
  { id: "tesla-m3-rwd", marca: "Tesla", modelo: "Model 3 RWD", kwh: 60, whkm: 135, masa: 1765 },
  { id: "tesla-m3-lr", marca: "Tesla", modelo: "Model 3 Long Range AWD", kwh: 75, whkm: 138, masa: 1840 },
  { id: "tesla-my-rwd", marca: "Tesla", modelo: "Model Y RWD", kwh: 60, whkm: 150, masa: 1920 },
  { id: "tesla-my-lr", marca: "Tesla", modelo: "Model Y Long Range AWD", kwh: 75, whkm: 158, masa: 1990 },
  { id: "renault-kwid", marca: "Renault", modelo: "Kwid E-Tech", kwh: 26.8, whkm: 130, masa: 1000 },
  { id: "chery-eq7", marca: "Chery", modelo: "eQ7 / Omoda E5", kwh: 61.1, whkm: 172, masa: 1710 },
  { id: "zeekr-x", marca: "Zeekr", modelo: "X", kwh: 66, whkm: 170, masa: 1850 },
  { id: "byd-seal", marca: "BYD", modelo: "Seal", kwh: 82.5, whkm: 158, masa: 1920 },
  { id: "byd-dolphin", marca: "BYD", modelo: "Dolphin", kwh: 44.9, whkm: 142, masa: 1430 },
  { id: "bmw-ix1", marca: "BMW", modelo: "iX1", kwh: 64.7, whkm: 178, masa: 2010 },
  { id: "kia-ev6", marca: "Kia", modelo: "EV6", kwh: 77.4, whkm: 168, masa: 1950 },
  { id: "tesla-my", marca: "Tesla", modelo: "Model Y", kwh: 75, whkm: 157, masa: 1920 },
  { id: "chevrolet-equinox", marca: "Chevrolet", modelo: "Equinox EV", kwh: 85, whkm: 175, masa: 2170 },
  { id: "volvo-ex40", marca: "Volvo", modelo: "EX40 / XC40", kwh: 78, whkm: 185, masa: 2100 },
];

// ---- Validación de correo y OTP --------------------------------------------
// Dominios de correo temporal/desechable más comunes (embebidos para validar offline).
// En producción: complementar descargando la lista completa (~4.000 dominios) de
// https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf
// y cachearla en el backend de Mirave. Fuente usada también por PyPI.
const DOMINIOS_TEMPORALES = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "guerrillamail.net",
  "tempmail.com", "temp-mail.org", "tempmail.net", "throwawaymail.com",
  "yopmail.com", "yopmail.net", "getnada.com", "trashmail.com", "trashmail.net",
  "maildrop.cc", "dispostable.com", "fakeinbox.com", "mailnesia.com", "mintemail.com",
  "mohmal.com", "sharklasers.com", "spam4.me", "grr.la", "guerrillamailblock.com",
  "tempinbox.com", "emailondeck.com", "mailcatch.com", "tempr.email", "discard.email",
  "33mail.com", "anonbox.net", "burnermail.io", "temp-mail.io", "moakt.com",
  "inboxkitten.com", "tempmailo.com", "luxusmail.org", "1secmail.com", "1secmail.org",
  "wegwerfmail.de", "mailtemp.net", "tmpmail.net", "tmpmail.org", "fakemail.net",
  "10minutemail.net", "20minutemail.com", "minuteinbox.com", "emailfake.com",
  "throwawaymail.net", "tempmailaddress.com", "mailpoof.com", "mail-temp.com",
  "spambox.us", "mailexpire.com", "incognitomail.com", "deadaddress.com",
  "vomoto.com", "tafmail.com", "cuvox.de", "dayrep.com", "einrot.com",
  "fleckens.hu", "gustr.com", "jourrapide.com", "rhyta.com", "superrito.com",
  "teleworm.us", "armyspy.com", "nwytg.net", "byom.de", "tmail.ws", "mvrht.net",
]);

// Dominios reconocidos de confianza (atajo: si está aquí, se acepta sin más chequeo)
const DOMINIOS_CONFIABLES = new Set([
  "gmail.com", "hotmail.com", "outlook.com", "outlook.es", "live.com", "yahoo.com",
  "yahoo.es", "icloud.com", "me.com", "protonmail.com", "proton.me", "aol.com",
  "zoho.com", "gmx.com", "mail.com", "yandex.com", "hotmail.es", "msn.com",
  // Dominios institucionales/corporativos colombianos frecuentes
  "une.net.co", "etb.net.co", "unal.edu.co", "javeriana.edu.co", "uniandes.edu.co",
  "medialab.design", "mirave.com.co",
]);

function validarCorreo(email) {
  const limpio = (email || "").trim().toLowerCase();
  const formatoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio);
  if (!formatoOk) return { ok: false, motivo: "El correo no tiene un formato válido." };
  const dominio = limpio.split("@")[1];
  if (DOMINIOS_TEMPORALES.has(dominio)) {
    return { ok: false, motivo: "No se permiten correos temporales o desechables. Usa un correo personal o corporativo." };
  }
  // Chequeo de segundo nivel (ej. sub.tempmail.com → tempmail.com)
  const partes = dominio.split(".");
  for (let i = 0; i < partes.length - 1; i++) {
    if (DOMINIOS_TEMPORALES.has(partes.slice(i).join("."))) {
      return { ok: false, motivo: "No se permiten correos temporales o desechables." };
    }
  }
  return { ok: true, confiable: DOMINIOS_CONFIABLES.has(dominio) };
}

// Genera un OTP de 6 dígitos
function generarOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Huella simple del dispositivo (no invasiva): distingue equipos, no identifica personas.
// En producción se envía al backend para detectar al usuario que regresa sin tocar la BD por búsqueda.
function deviceHash() {
  try {
    const s = [
      navigator.userAgent, navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      `${screen.width}x${screen.height}`, navigator.platform || "",
    ].join("|");
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return "d" + Math.abs(h).toString(36);
  } catch (e) {
    return "d0";
  }
}

// Fecha "hoy" en formato YYYY-MM-DD (en producción usar la del servidor)
function hoyStr() {
  return new Date().toISOString().slice(0, 10);
}

// Milisegundos hasta el próximo reset (medianoche local + 24h del primer uso simplificado a medianoche)
function msHastaManana() {
  const ahora = new Date();
  const manana = new Date(ahora);
  manana.setHours(24, 0, 0, 0);
  return manana - ahora;
}


// Para cada segmento integra: aerodinámica (∝ v²), rodadura, pendiente (m·g·h),
// auxiliares (A/C/calefacción) según clima, corrigiendo por altitud colombiana.
// Velocidad automática según el tipo de vía inferido por la pendiente/contexto.

// Temperatura típica en Colombia según altitud (gradiente ~6.5°C/1000m, base ~29°C a nivel del mar)
function tempPorAltitud(metros) {
  return 29 - (metros / 1000) * 6.5;
}

// Densidad del aire según altitud (afecta la resistencia aerodinámica)
function densidadAire(metros) {
  // ρ ≈ 1.225 · exp(-h/8500)
  return 1.225 * Math.exp(-metros / 8500);
}

// Velocidad objetivo (m/s) según pendiente: en subida fuerte se baja, en plano de carretera sube
function velocidadTramo(grad) {
  // grad = pendiente (m/m). Vías colombianas de montaña son más rápidas de lo que parece.
  let kmh;
  if (grad > 0.05) kmh = 60;          // subida fuerte
  else if (grad > 0.02) kmh = 75;     // subida moderada
  else if (grad > -0.02) kmh = 90;    // plano / carretera abierta
  else if (grad > -0.05) kmh = 85;    // bajada moderada
  else kmh = 75;                       // bajada fuerte, freno motor
  return kmh / 3.6;
}

function estimarConsumo({ coords, distKm, whkm, masaKg }) {
  const g = 9.81;
  // Parámetros del vehículo (derivados o típicos para un EV mediano)
  const Cd = 0.28;          // coef. aerodinámico
  const A = 2.3;            // área frontal (m²)
  const Crr = 0.011;        // coef. rodadura
  const etaPowertrain = 0.88; // eficiencia motor+inversor tracción
  const etaRegen = 0.50;    // regeneración CONSERVADORA (50%)
  const regenMaxKW = 60;    // límite físico de potencia de regen

  let whTotal = 0, base = 0, wAero = 0, wRod = 0, wPend = 0, wAux = 0, wRegen = 0;
  let velMediaSum = 0, nSeg = 0;

  for (let i = 1; i < coords.length; i++) {
    const e0 = coords[i - 1][2], e1 = coords[i][2];
    const dEle = e1 - e0;
    // distancia del tramo (haversine aprox por grados → km)
    const dLng = coords[i][0] - coords[i - 1][0];
    const dLat = coords[i][1] - coords[i - 1][1];
    const distSegKm = Math.hypot(dLng * 111.32 * Math.cos((coords[i][1] * Math.PI) / 180), dLat * 110.57);
    if (distSegKm <= 0) continue;
    const distSegM = distSegKm * 1000;

    const grad = dEle / distSegM;          // pendiente
    const v = velocidadTramo(grad);        // m/s automático
    velMediaSum += v * 3.6; nSeg++;
    const altMedia = (e0 + e1) / 2;
    const rho = densidadAire(altMedia);

    // Fuerzas (N)
    const fAero = 0.5 * rho * Cd * A * v * v;
    const fRod = Crr * masaKg * g;
    const fPend = masaKg * g * grad;       // + subida, - bajada

    // Energía mecánica del tramo (J) = F · d
    const eAero = fAero * distSegM;
    const eRod = fRod * distSegM;
    const ePend = fPend * distSegM;

    // Auxiliares: A/C en tierra caliente, calefacción leve en páramo
    const temp = tempPorAltitud(altMedia);
    let auxW = 300; // base electrónica
    if (temp > 26) auxW += 1800;        // A/C fuerte (tierra caliente)
    else if (temp > 20) auxW += 900;    // A/C moderado
    else if (temp < 10) auxW += 1200;   // calefacción (páramo, Bogotá de noche)
    const tiempoSeg = distSegM / v;
    const eAux = auxW * tiempoSeg;       // J

    // Tracción: suma de positivos / eficiencia; pendiente negativa → regen limitada
    let eTraccionJ = eAero + eRod + Math.max(0, ePend);
    eTraccionJ /= etaPowertrain;

    // Regeneración en bajada (energía potencial liberada, limitada por potencia)
    let eRegenJ = 0;
    if (ePend < 0) {
      const potenciaRegenW = (-ePend) / tiempoSeg;
      const factor = Math.min(1, regenMaxKW * 1000 / Math.max(1, potenciaRegenW));
      eRegenJ = (-ePend) * etaRegen * factor;
    }

    const eSegJ = eTraccionJ + eAux - eRegenJ;
    // J → Wh
    const segWh = eSegJ / 3600;

    whTotal += Math.max(0, segWh);
    base += whkm * distSegKm;
    wAero += eAero / 3600 / etaPowertrain;
    wRod += eRod / 3600 / etaPowertrain;
    wPend += Math.max(0, ePend) / 3600 / etaPowertrain;
    wAux += eAux / 3600;
    wRegen += eRegenJ / 3600;
  }

  // Piso de seguridad realista: en bajada larga la batería rinde más, pero
  // nunca tanto como para prometer autonomías irreales. Conservador = 70% del nominal.
  whTotal = Math.max(base * 0.70, whTotal);
  const velMedia = nSeg ? velMediaSum / nSeg : 0;

  return { whTotal, base, wAero, wRod, wPend, wAux, wRegen, velMedia };
}

// Reparte ascenso/descenso a partir del array de elevaciones de la ruta
function perfilElevacion(coords) {
  let asc = 0, desc = 0, min = Infinity, max = -Infinity;
  for (let i = 1; i < coords.length; i++) {
    const d = coords[i][2] - coords[i - 1][2];
    if (d > 0) asc += d; else desc += -d;
    min = Math.min(min, coords[i][2]);
    max = Math.max(max, coords[i][2]);
  }
  return { asc, desc, min: isFinite(min) ? min : 0, max: isFinite(max) ? max : 0 };
}

// ---- Persistencia segura (localStorage con respaldo en memoria) ------------
// En la vista previa de artifacts localStorage puede estar bloqueado; el código
// no se rompe y cae a memoria. En cumbreva.medialab.design funciona normal.
const memoria = {};
const KEY = "cumbrera_estado_v1";

function leerEstado() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    if (memoria[KEY]) return memoria[KEY];
  }
  return null;
}

function guardarEstado(obj) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(obj));
  } catch (e) {
    memoria[KEY] = obj; // respaldo en memoria si localStorage está bloqueado
  }
}

// ---- Llamadas a OpenRouteService ------------------------------------------
async function geocode(text) {
  // 1) Intentar ORS (Pelias). La key debe ir URL-encoded por el "=" final.
  if (ORS_KEY) {
    try {
      const url =
        `https://api.openrouteservice.org/geocode/search` +
        `?api_key=${encodeURIComponent(ORS_KEY)}` +
        `&text=${encodeURIComponent(text)}&boundary.country=CO&size=5`;
      const r = await fetch(url);
      if (r.ok) {
        const j = await r.json();
        if (j.features && j.features.length) {
          return j.features.map((f) => ({
            label: f.properties.label,
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
          }));
        }
      }
    } catch (e) {
      /* cae al respaldo */
    }
  }
  // 2) Respaldo: Nominatim (OpenStreetMap), sin key, buen CORS.
  try {
    const hits = await nominatimGeocode(text);
    if (hits.length) return hits;
  } catch (e) {
    /* cae a demo */
  }
  // 3) Último respaldo: catálogo local de ciudades de Colombia (funciona offline / con CORS bloqueado)
  return demoGeocode(text);
}

async function nominatimGeocode(text) {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=jsonv2&countrycodes=co&limit=5&q=${encodeURIComponent(text)}`;
  const r = await fetch(url, { headers: { "Accept-Language": "es" } });
  if (!r.ok) throw new Error("geocode");
  const j = await r.json();
  return j.map((p) => ({
    label: p.display_name.split(",").slice(0, 3).join(",").trim(),
    lat: parseFloat(p.lat),
    lng: parseFloat(p.lon),
  }));
}

async function ruta(a, b) {
  // 1) Intentar ORS directions (vía real + elevación en una sola llamada)
  if (ORS_KEY) {
    try {
      const r = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: ORS_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [a.lng, a.lat],
              [b.lng, b.lat],
            ],
            elevation: true,
          }),
        }
      );
      if (r.ok) {
        const j = await r.json();
        const f = j.features[0];
        return {
          coords: f.geometry.coordinates,
          distKm: f.properties.summary.distance / 1000,
          durMin: f.properties.summary.duration / 60,
          fuente: "OpenRouteService",
        };
      }
    } catch (e) {
      /* cae al respaldo */
    }
  }
  // 2) Respaldo: ruteo OSRM (sin key) + elevación real de Open-Elevation
  return rutaRespaldo(a, b);
}

async function rutaRespaldo(a, b) {
  // Geometría de la vía con OSRM público (sin key)
  let geometria = null, distKm = null, durMin = null;
  try {
    const r = await fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
        `${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`
    );
    if (r.ok) {
      const j = await r.json();
      const ruta = j.routes[0];
      geometria = ruta.geometry.coordinates; // [lng,lat]
      distKm = ruta.distance / 1000;
      durMin = ruta.duration / 60;
    }
  } catch (e) {
    /* sin OSRM, estimamos en línea */
  }

  // Si OSRM falló, recta corregida ×1.3
  if (!geometria) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const recta = 2 * R * Math.asin(Math.sqrt(h));
    distKm = recta * 1.3;
    durMin = (distKm / 55) * 60;
    const n = 24;
    geometria = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      geometria.push([a.lng + (b.lng - a.lng) * t, a.lat + (b.lat - a.lat) * t]);
    }
  }

  // Reducir a ~30 puntos para no saturar Open-Elevation
  const muestreada = muestrear(geometria, 30);

  // Si los puntos traen elevación conocida (catálogo demo), generamos un
  // perfil sintético realista entre ambas cotas en vez de llamar a la API.
  if (a._elev != null && b._elev != null) {
    const coords = perfilSintetico(muestreada, a._elev, b._elev);
    return { coords, distKm, durMin, fuente: "Estimación offline (demo)" };
  }

  const coords = await añadirElevacion(muestreada);
  const conElev = coords.some((c) => c[2] !== 0);
  return {
    coords,
    distKm,
    durMin,
    fuente: conElev ? "OSRM + Open-Elevation" : "OSRM (sin elevación)",
  };
}

// Perfil de elevación sintético entre dos cotas, con ondulación de cordillera
function perfilSintetico(coords, e0, e1) {
  const n = coords.length - 1;
  return coords.map(([lng, lat], i) => {
    const t = i / n;
    const ond = Math.sin(t * Math.PI * 3) * 320 * Math.sin(t * Math.PI);
    return [lng, lat, e0 + (e1 - e0) * t + ond];
  });
}

function muestrear(arr, n) {
  if (arr.length <= n) return arr;
  const paso = (arr.length - 1) / (n - 1);
  const out = [];
  for (let i = 0; i < n; i++) out.push(arr[Math.round(i * paso)]);
  return out;
}

async function añadirElevacion(coords) {
  try {
    const r = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locations: coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng })),
      }),
    });
    if (r.ok) {
      const j = await r.json();
      return coords.map(([lng, lat], i) => [lng, lat, j.results[i]?.elevation ?? 0]);
    }
  } catch (e) {
    /* sin elevación */
  }
  // Sin elevación disponible: z=0 (el modelo seguirá dando distancia/consumo base)
  return coords.map(([lng, lat]) => [lng, lat, 0]);
}

// ---- Datos demo (sin API key) ---------------------------------------------
const CIUDADES = {
  "bogota": { lat: 4.711, lng: -74.072, elev: 2640, label: "Bogotá, Cundinamarca" },
  "soacha": { lat: 4.579, lng: -74.217, elev: 2565, label: "Soacha, Cundinamarca" },
  "medellin": { lat: 6.244, lng: -75.581, elev: 1495, label: "Medellín, Antioquia" },
  "cali": { lat: 3.452, lng: -76.532, elev: 1018, label: "Cali, Valle del Cauca" },
  "barranquilla": { lat: 10.969, lng: -74.781, elev: 18, label: "Barranquilla, Atlántico" },
  "cartagena": { lat: 10.391, lng: -75.479, elev: 2, label: "Cartagena, Bolívar" },
  "bucaramanga": { lat: 7.119, lng: -73.122, elev: 959, label: "Bucaramanga, Santander" },
  "girardot": { lat: 4.304, lng: -74.802, elev: 289, label: "Girardot, Cundinamarca" },
  "villavicencio": { lat: 4.142, lng: -73.626, elev: 467, label: "Villavicencio, Meta" },
  "tunja": { lat: 5.535, lng: -73.368, elev: 2820, label: "Tunja, Boyacá" },
  "honda": { lat: 5.207, lng: -74.737, elev: 229, label: "Honda, Tolima" },
  "ibague": { lat: 4.439, lng: -75.232, elev: 1285, label: "Ibagué, Tolima" },
  "manizales": { lat: 5.07, lng: -75.52, elev: 2160, label: "Manizales, Caldas" },
  "pereira": { lat: 4.814, lng: -75.694, elev: 1411, label: "Pereira, Risaralda" },
  "armenia": { lat: 4.535, lng: -75.681, elev: 1483, label: "Armenia, Quindío" },
  "la dorada": { lat: 5.45, lng: -74.66, elev: 178, label: "La Dorada, Caldas" },
  "neiva": { lat: 2.936, lng: -75.281, elev: 442, label: "Neiva, Huila" },
  "popayan": { lat: 2.444, lng: -76.614, elev: 1738, label: "Popayán, Cauca" },
  "santa marta": { lat: 11.241, lng: -74.199, elev: 6, label: "Santa Marta, Magdalena" },
  "cucuta": { lat: 7.894, lng: -72.504, elev: 320, label: "Cúcuta, Norte de Santander" },
  "duitama": { lat: 5.823, lng: -73.034, elev: 2530, label: "Duitama, Boyacá" },
  "sogamoso": { lat: 5.715, lng: -72.933, elev: 2569, label: "Sogamoso, Boyacá" },
  "chia": { lat: 4.861, lng: -74.059, elev: 2564, label: "Chía, Cundinamarca" },
  "zipaquira": { lat: 5.027, lng: -74.005, elev: 2650, label: "Zipaquirá, Cundinamarca" },
  "fusagasuga": { lat: 4.345, lng: -74.366, elev: 1728, label: "Fusagasugá, Cundinamarca" },
  "melgar": { lat: 4.204, lng: -74.642, elev: 323, label: "Melgar, Tolima" },
};
function demoGeocode(text) {
  const k = text.toLowerCase().trim();
  const hits = Object.entries(CIUDADES)
    .filter(([name]) => name.includes(k) || k.includes(name))
    .map(([, c]) => ({ label: c.label, lat: c.lat, lng: c.lng, _elev: c.elev }));
  return Promise.resolve(hits.length ? hits : [{ label: text + " (demo)", lat: 4.7, lng: -74, _elev: 2600 }]);
}
function demoRuta(a, b) {
  // distancia haversine ×1.35 (factor vía real) + perfil sintético entre elevaciones
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const recta = 2 * R * Math.asin(Math.sqrt(h));
  const distKm = recta * 1.35;
  const e0 = a._elev ?? 2600;
  const e1 = b._elev ?? 1500;
  const n = 40;
  const coords = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // perfil con ondulación (cordillera) + tendencia lineal
    const ond = Math.sin(t * Math.PI * 3) * 350 * Math.sin(t * Math.PI);
    coords.push([
      a.lng + (b.lng - a.lng) * t,
      a.lat + (b.lat - a.lat) * t,
      e0 + (e1 - e0) * t + ond,
    ]);
  }
  return Promise.resolve({ coords, distKm, durMin: distKm / 55 * 60 });
}

// ---- Sub-componentes -------------------------------------------------------
function Campo({ label, value, onChange, onPick, sugerencias, placeholder, dot }) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: dot }} />
        <label style={{ fontSize: 11, letterSpacing: 1.5, color: C.textDim, textTransform: "uppercase", fontWeight: 600 }}>
          {label}
        </label>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box", background: C.panel2,
          border: `1px solid ${C.line}`, borderRadius: 10, padding: "13px 14px",
          color: C.text, fontSize: 15, fontFamily: "inherit", outline: "none",
        }}
      />
      {sugerencias && sugerencias.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
          marginTop: 6, background: C.panel, border: `1px solid ${C.line}`,
          borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,.6)",
        }}>
          {sugerencias.map((s, i) => (
            <button key={i} onClick={() => onPick(s)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "11px 14px",
              background: "transparent", border: "none", borderBottom: i < sugerencias.length - 1 ? `1px solid ${C.line}` : "none",
              color: C.text, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.panel2)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >{s.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// Medidor: la "firma" visual — barra de batería que se vacía sobre la ruta
function MedidorBateria({ pct, alcanza, kmAlcance, distKm }) {
  const fillPct = Math.max(0, Math.min(100, pct));
  const cortePct = alcanza ? 100 : Math.max(0, Math.min(100, (kmAlcance / distKm) * 100));
  const color = !alcanza ? C.red : pct < 20 ? C.amber : C.neon;
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{
        position: "relative", height: 54, borderRadius: 12, overflow: "hidden",
        background: C.panel2, border: `1px solid ${C.line}`,
      }}>
        {/* relleno */}
        <div style={{
          position: "absolute", inset: 0, width: `${fillPct}%`,
          background: `linear-gradient(90deg, ${color}22, ${color})`,
          transition: "width .9s cubic-bezier(.2,.8,.2,1)",
          boxShadow: `0 0 24px ${color}99`,
        }} />
        {/* marca de corte si no alcanza */}
        {!alcanza && (
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: `${cortePct}%`,
            width: 2, background: C.red, boxShadow: `0 0 12px ${C.red}`,
          }}>
            <div style={{
              position: "absolute", top: -2, left: -28, fontSize: 10,
              color: C.red, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap",
            }}>SE AGOTA</div>
          </div>
        )}
        {/* texto */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px",
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.bg, mixBlendMode: "difference", filter: "invert(1)" }}>
            {Math.round(pct)}%
          </span>
          <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>
            llegada estimada
          </span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 10.5, letterSpacing: 1.3, color: C.textDim, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || C.text, marginTop: 4, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// Mini-gráfico SVG del perfil de elevación
// Mapa SVG de la ruta: proyecta lng/lat y colorea cada tramo según la pendiente.
// Marca origen, destino y, si no alcanza, el punto donde se agota la batería.
function MapaRuta({ coords, distKm, alcanza, kmAlcance, origen, destino }) {
  if (!coords || coords.length < 2) return null;
  const W = 600, H = 340, pad = 34;

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const rngLng = maxLng - minLng || 1e-4;
  const rngLat = maxLat - minLat || 1e-4;
  // Escala uniforme para no deformar la geografía
  const esc = Math.min((W - pad * 2) / rngLng, (H - pad * 2) / rngLat);
  const offX = (W - rngLng * esc) / 2;
  const offY = (H - rngLat * esc) / 2;
  const proy = (lng, lat) => [
    offX + (lng - minLng) * esc,
    H - (offY + (lat - minLat) * esc), // invertir Y (norte arriba)
  ];

  const pts = coords.map((c) => proy(c[0], c[1]));

  // Color por pendiente entre puntos consecutivos
  const colorPendiente = (g) => {
    if (g > 0.06) return C.red;
    if (g > 0.025) return C.amber;
    if (g > -0.02) return C.neon;
    return "#39c0ff"; // bajada (regen) en azul
  };
  const segmentos = [];
  for (let i = 1; i < coords.length; i++) {
    const dEle = coords[i][2] - coords[i - 1][2];
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const dxKm = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]) * 111;
    const grad = dxKm > 0 ? dEle / (dxKm * 1000) : 0;
    segmentos.push({ x1, y1, x2, y2, color: colorPendiente(grad) });
  }

  // Punto donde se agota la batería (fracción de la distancia)
  let puntoCorte = null;
  if (!alcanza && distKm > 0) {
    const frac = Math.max(0, Math.min(1, kmAlcance / distKm));
    const idx = Math.round(frac * (pts.length - 1));
    puntoCorte = pts[idx];
  }

  const [ox, oy] = pts[0];
  const [dx, dy] = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", borderRadius: 12, background: "#080b07" }}>
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke={C.line} strokeWidth="0.6" opacity="0.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" />

      {/* trazo de la ruta coloreado por pendiente */}
      {segmentos.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={s.color} strokeWidth="3.4" strokeLinecap="round" filter="url(#glow)" />
      ))}

      {/* origen */}
      <circle cx={ox} cy={oy} r="7" fill={C.neon} filter="url(#glow)" />
      <circle cx={ox} cy={oy} r="13" fill="none" stroke={C.neon} strokeWidth="1.2" opacity="0.5" />
      <text x={ox} y={oy - 18} fill={C.text} fontSize="12" fontWeight="600" textAnchor="middle">{recortar(origen)}</text>

      {/* destino */}
      <circle cx={dx} cy={dy} r="7" fill={C.amber} filter="url(#glow)" />
      <text x={dx} y={dy - 18} fill={C.text} fontSize="12" fontWeight="600" textAnchor="middle">{recortar(destino)}</text>

      {/* punto de batería agotada */}
      {puntoCorte && (
        <>
          <circle cx={puntoCorte[0]} cy={puntoCorte[1]} r="7" fill={C.red} filter="url(#glow)" />
          <text x={puntoCorte[0]} y={puntoCorte[1] + 24} fill={C.red} fontSize="11" fontWeight="700" textAnchor="middle">
            ⚠ batería 0%
          </text>
        </>
      )}

      {/* leyenda */}
      <g transform={`translate(${pad - 18}, ${H - 16})`} fontSize="10" fill={C.textDim}>
        <circle cx="4" cy="-3" r="4" fill={C.neon} /><text x="12" y="0">plano</text>
        <circle cx="62" cy="-3" r="4" fill={C.amber} /><text x="70" y="0">subida</text>
        <circle cx="128" cy="-3" r="4" fill={C.red} /><text x="136" y="0">subida fuerte</text>
        <circle cx="222" cy="-3" r="4" fill="#39c0ff" /><text x="230" y="0">bajada</text>
      </g>
    </svg>
  );
}
function recortar(t) {
  if (!t) return "";
  const s = t.split(",")[0];
  return s.length > 16 ? s.slice(0, 15) + "…" : s;
}

function PerfilSVG({ coords }) {
  if (!coords || coords.length < 2) return null;
  const W = 600, H = 90, pad = 4;
  const elevs = coords.map((c) => c[2]);
  const min = Math.min(...elevs), max = Math.max(...elevs);
  const rng = max - min || 1;
  const pts = coords.map((c, i) => {
    const x = pad + (i / (coords.length - 1)) * (W - pad * 2);
    const y = pad + (1 - (c[2] - min) / rng) * (H - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.neon} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.neon} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#elevFill)" />
      <path d={line} fill="none" stroke={C.neon} strokeWidth="1.6" />
      <text x={pad + 2} y={14} fill={C.textDim} fontSize="11">{Math.round(max)} m</text>
      <text x={pad + 2} y={H - 5} fill={C.textFaint} fontSize="11">{Math.round(min)} m</text>
    </svg>
  );
}

// ---- App -------------------------------------------------------------------
function CuentaRegresiva() {
  const [ms, setMs] = useState(msHastaManana());
  useEffect(() => {
    const t = setInterval(() => setMs(msHastaManana()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const p = (n) => String(n).padStart(2, "0");
  return <span>{p(h)}:{p(m)}:{p(s)}</span>;
}

export default function Cumbrera() {  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [origenSel, setOrigenSel] = useState(null);
  const [destinoSel, setDestinoSel] = useState(null);
  const [sugO, setSugO] = useState([]);
  const [sugD, setSugD] = useState([]);

  const [evId, setEvId] = useState("byd-yuan-up");
  const ev = EV_CATALOG.find((e) => e.id === evId);
  const [kwh, setKwh] = useState(ev.kwh);
  const [whkm, setWhkm] = useState(ev.whkm);
  const [masa, setMasa] = useState(1540);
  const [bateria, setBateria] = useState(100);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [res, setRes] = useState(null);

  // Muro de lista de espera: tras 3 consultas pide registro
  const LIMITE_NUEVO = 2;      // búsquedas gratis antes de pedir registro
  const LIMITE_DIARIO = 7;     // búsquedas por día para usuarios registrados
  const [consultas, setConsultas] = useState(0);   // consumidas hoy
  const [registrado, setRegistrado] = useState(false);
  const [regresaSinRegistro, setRegresaSinRegistro] = useState(false); // usó antes, borró sesión
  const [muro, setMuro] = useState(false);
  const [cuotaAgotada, setCuotaAgotada] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [registroOk, setRegistroOk] = useState(false);
  const [errReg, setErrReg] = useState("");
  // Flujo OTP
  const [faseRegistro, setFaseRegistro] = useState("datos"); // "datos" | "yaregistrado" | "otp" | "ok"
  const [otpEnviado, setOtpEnviado] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [reenvioEn, setReenvioEn] = useState(0);
  const [cargadoInicial, setCargadoInicial] = useState(false);

  const limiteActual = registrado ? LIMITE_DIARIO : LIMITE_NUEVO;
  const restantes = Math.max(0, limiteActual - consultas);

  // Al entrar: recupera sesión, aplica reset diario, detecta usuario que regresa
  useEffect(() => {
    const guardado = leerEstado();
    const hoy = hoyStr();
    if (guardado) {
      // Reset diario: si el contador es de un día anterior, vuelve a 0
      const consumidas = guardado.fecha === hoy ? (guardado.consultas || 0) : 0;
      if (guardado.registrado) {
        setRegistrado(true);
        setConsultas(consumidas);
        if (guardado.nombre) setNombre(guardado.nombre);
        if (guardado.email) setEmail(guardado.email);
      } else {
        // No registrado pero ya tiene huella previa → regresa sin registro
        setConsultas(consumidas);
        if (guardado.usoPrevio || guardado.device === deviceHash()) {
          if (consumidas >= LIMITE_NUEVO) setRegresaSinRegistro(true);
        }
      }
    }
    setCargadoInicial(true);
    // En producción: aquí va POST /api/sesion { email?, device_hash } para traer
    // las búsquedas restantes reales desde la BD (1 sola lectura por sesión).
  }, []);

  // Persiste el progreso (apoyo local; la BD es la autoridad en producción)
  useEffect(() => {
    if (!cargadoInicial) return;
    guardarEstado({
      registrado, consultas, fecha: hoyStr(), device: deviceHash(), usoPrevio: true,
      nombre: registrado ? nombre : "", email: registrado ? email : "",
    });
  }, [registrado, consultas, cargadoInicial]);

  // Responsive: detecta ancho para apilar campos en móvil
  const [esMovil, setEsMovil] = useState(false);
  useEffect(() => {
    const check = () => setEsMovil(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const tO = useRef(), tD = useRef();

  useEffect(() => {
    const e = EV_CATALOG.find((x) => x.id === evId);
    if (e && e.id !== "custom") { setKwh(e.kwh); setWhkm(e.whkm); if (e.masa) setMasa(e.masa); }
  }, [evId]);

  const buscarSug = (txt, set) => {
    if (txt.length < 3) { set([]); return; }
    geocode(txt).then(set).catch(() => set([]));
  };

  const onO = (v) => { setOrigen(v); setOrigenSel(null); clearTimeout(tO.current); tO.current = setTimeout(() => buscarSug(v, setSugO), 350); };
  const onD = (v) => { setDestino(v); setDestinoSel(null); clearTimeout(tD.current); tD.current = setTimeout(() => buscarSug(v, setSugD), 350); };

  const calcular = useCallback(async () => {
    setError(""); setRes(null);
    if (!origen.trim() || !destino.trim()) {
      setError("Escribe origen y destino.");
      return;
    }
    // No registrado y agotó las gratis → muro de registro
    if (!registrado && consultas >= LIMITE_NUEVO) {
      setMuro(true);
      setFaseRegistro(regresaSinRegistro ? "yaregistrado" : "datos");
      return;
    }
    // Registrado pero agotó la cuota diaria → aviso de cuota agotada
    if (registrado && consultas >= LIMITE_DIARIO) {
      setCuotaAgotada(true);
      return;
    }
    setCargando(true);
    try {
      // Resolver puntos: usa la selección, o geocodifica el texto escrito
      let a = origenSel, b = destinoSel;
      if (!a) {
        const h = await geocode(origen);
        if (!h.length) throw new Error("No se encontró el origen: " + origen);
        a = h[0];
      }
      if (!b) {
        const h = await geocode(destino);
        if (!h.length) throw new Error("No se encontró el destino: " + destino);
        b = h[0];
      }

      const r = await ruta(a, b);
      const perfil = perfilElevacion(r.coords);
      const cons = estimarConsumo({
        coords: r.coords, distKm: r.distKm, whkm, masaKg: masa,
      });
      const { whTotal, base, wAero, wRod, wPend, wAux, wRegen, velMedia } = cons;
      const disponibleWh = kwh * 1000 * (bateria / 100);
      const consumoReal = whTotal / r.distKm;
      const kmAlcance = disponibleWh / consumoReal;
      const alcanza = kmAlcance >= r.distKm;
      const pctLlegada = Math.max(0, ((disponibleWh - whTotal) / (kwh * 1000)) * 100);
      const penaliz = ((whTotal - base) / base) * 100;
      setRes({
        ...r, perfil, whTotal, consumoReal, kmAlcance, alcanza, pctLlegada, penaliz, disponibleWh,
        wAero, wRod, wPend, wAux, wRegen, velMedia,
      });
      setConsultas((n) => n + 1);
    } catch (e) {
      setError(e.message || "No se pudo calcular la ruta. Revisa los puntos o intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }, [origen, destino, origenSel, destinoSel, whkm, masa, kwh, bateria, registrado, consultas]);

  // Registro a la lista de espera
  const registrar = useCallback(async () => {
    setErrReg("");
    if (!nombre.trim()) { setErrReg("Escribe tu nombre."); return; }
    const v = validarCorreo(email);
    if (!v.ok) { setErrReg(v.motivo); return; }
    setEnviando(true);
    try {
      const codigo = generarOTP();
      // === PRODUCCIÓN (cumbreva.medialab.design) ===
      // El OTP debe generarse y enviarse desde el backend de Mirave, nunca en el cliente.
      // await fetch("/api/waitlist/registro", {
      //   method: "POST", headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ nombre, email, fuente: "cumbrera-calc" }),
      // }); // el backend valida duplicados, guarda el lead y envía el OTP por correo
      await new Promise((r) => setTimeout(r, 800)); // simulación de envío
      setOtpEnviado(codigo);   // en producción esto NO existe en el cliente
      setFaseRegistro("otp");
      setReenvioEn(30);
    } catch (e) {
      setErrReg("No se pudo enviar el código. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }, [nombre, email]);

  // Usuario que regresa y dice "ya me registré": busca el correo y, si existe, manda OTP
  const entrarConCorreo = useCallback(async () => {
    setErrReg("");
    const v = validarCorreo(email);
    if (!v.ok) { setErrReg(v.motivo); return; }
    setEnviando(true);
    try {
      const codigo = generarOTP();
      // === PRODUCCIÓN ===
      // const r = await fetch("/api/sesion", { method:"POST",
      //   headers:{"Content-Type":"application/json"},
      //   body: JSON.stringify({ email, device_hash: deviceHash() }) });
      // if (estado === "no_existe") { setErrReg("No encontramos ese correo. Regístrate primero."); ... }
      // else { backend genera y envía OTP }
      await new Promise((r) => setTimeout(r, 700));
      setOtpEnviado(codigo);
      setFaseRegistro("otp");
      setReenvioEn(30);
    } catch (e) {
      setErrReg("No se pudo procesar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }, [email]);

  const verificarOTP = useCallback(async () => {
    setErrReg("");
    const code = otpInput.trim();
    if (code.length !== 6) { setErrReg("El código tiene 6 dígitos."); return; }
    setEnviando(true);
    try {
      // === PRODUCCIÓN ===
      // const r = await fetch("/api/waitlist/verificar", { method:"POST",
      //   headers:{"Content-Type":"application/json"},
      //   body: JSON.stringify({ email, codigo: code }) });
      // const ok = r.ok; // el backend compara contra el OTP guardado y su expiración
      await new Promise((r) => setTimeout(r, 500));
      const ok = code === otpEnviado; // simulación local
      if (!ok) { setErrReg("Código incorrecto. Revísalo e intenta de nuevo."); setEnviando(false); return; }
      setRegistrado(true);
      setFaseRegistro("ok");
      setRegistroOk(true);
      setTimeout(() => setMuro(false), 1600);
    } catch (e) {
      setErrReg("No se pudo verificar el código. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }, [otpInput, otpEnviado, email]);

  const reenviarOTP = useCallback(() => {
    if (reenvioEn > 0) return;
    const codigo = generarOTP();
    setOtpEnviado(codigo);
    setReenvioEn(30);
    setErrReg("");
    // En producción: re-disparar el envío desde el backend.
  }, [reenvioEn]);

  // Cuenta regresiva para reenviar OTP
  useEffect(() => {
    if (reenvioEn <= 0) return;
    const t = setTimeout(() => setReenvioEn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [reenvioEn]);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      backgroundImage: `radial-gradient(900px 500px at 80% -10%, ${C.neon}14, transparent), radial-gradient(700px 500px at -10% 110%, ${C.neonDim}10, transparent)`,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Muro de lista de espera */}
      {muro && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(3,6,3,.78)", backdropFilter: "blur(6px)", padding: 18,
        }}
          onClick={() => { if (!enviando && faseRegistro === "datos") setMuro(false); }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 420, background: C.panel, border: `1px solid ${C.neonDim}44`,
            borderRadius: 18, padding: "clamp(22px,5vw,30px)", boxShadow: `0 24px 80px rgba(0,0,0,.7), 0 0 60px ${C.neon}18`,
          }}>
            {faseRegistro === "datos" && (
              <>
                <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.neon, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
                  Lista de espera · Cumbrera
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 23, fontWeight: 700, lineHeight: 1.15 }}>
                  Probaste {LIMITE_NUEVO} rutas. Regístrate para {LIMITE_DIARIO} búsquedas diarias
                </h2>
                <p style={{ margin: "0 0 20px", fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>
                  Estamos construyendo la app de Cumbrera para conductores eléctricos en Colombia. Regístrate y te
                  enviaremos un código de verificación para seguir usando el simulador, con acceso anticipado.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre"
                    style={muroInput} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com"
                    type="email" inputMode="email"
                    onKeyDown={(e) => e.key === "Enter" && registrar()}
                    style={muroInput} />
                  {errReg && <div style={{ color: C.red, fontSize: 12.5 }}>{errReg}</div>}
                  <button onClick={registrar} disabled={enviando} style={{
                    padding: 14, borderRadius: 11, border: "none", cursor: enviando ? "default" : "pointer",
                    background: enviando ? C.line : `linear-gradient(90deg, ${C.neonDim}, ${C.neon})`,
                    color: enviando ? C.textDim : "#06140a", fontSize: 15, fontWeight: 700, fontFamily: "inherit",
                    boxShadow: enviando ? "none" : `0 8px 26px ${C.neon}40`,
                  }}>
                    {enviando ? "Enviando código…" : "Registrarme y recibir código"}
                  </button>
                  <button onClick={() => { setErrReg(""); setFaseRegistro("yaregistrado"); }} disabled={enviando} style={{
                    padding: 6, background: "transparent", border: "none", color: C.neon,
                    fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Ya me registré antes
                  </button>
                </div>
                <p style={{ margin: "14px 0 0", fontSize: 10.5, color: C.textFaint, textAlign: "center" }}>
                  No se admiten correos temporales. No compartimos tu correo con terceros.
                </p>
              </>
            )}

            {faseRegistro === "yaregistrado" && (
              <>
                <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.neon, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
                  Bienvenido de vuelta
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                  Ya usaste Cumbrera antes
                </h2>
                <p style={{ margin: "0 0 18px", fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>
                  Si ya estás en nuestra lista de espera, ingresa tu correo y te enviaremos un código para entrar y
                  recuperar tus {LIMITE_DIARIO} búsquedas del día.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com"
                    type="email" inputMode="email"
                    onKeyDown={(e) => e.key === "Enter" && entrarConCorreo()}
                    style={muroInput} />
                  {errReg && <div style={{ color: C.red, fontSize: 12.5 }}>{errReg}</div>}
                  <button onClick={entrarConCorreo} disabled={enviando} style={{
                    padding: 14, borderRadius: 11, border: "none", cursor: enviando ? "default" : "pointer",
                    background: enviando ? C.line : `linear-gradient(90deg, ${C.neonDim}, ${C.neon})`,
                    color: enviando ? C.textDim : "#06140a", fontSize: 15, fontWeight: 700, fontFamily: "inherit",
                    boxShadow: enviando ? "none" : `0 8px 26px ${C.neon}40`,
                  }}>
                    {enviando ? "Enviando código…" : "Enviarme el código"}
                  </button>
                  <button onClick={() => { setErrReg(""); setFaseRegistro("datos"); }} disabled={enviando} style={{
                    padding: 6, background: "transparent", border: "none", color: C.textFaint,
                    fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    No, quiero registrarme
                  </button>
                </div>
              </>
            )}

            {faseRegistro === "otp" && (
              <>
                <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.neon, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
                  Verificación · Código OTP
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                  Revisa tu correo
                </h2>
                <p style={{ margin: "0 0 8px", fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>
                  Enviamos un código de 6 dígitos a <span style={{ color: C.text }}>{email}</span>. Ingrésalo para
                  continuar usando el simulador.
                </p>
                {/* Aviso solo de demostración: en producción el código llega al correo */}
                {otpEnviado && (
                  <div style={{ margin: "0 0 14px", fontSize: 12, color: C.amber, background: `${C.amber}15`, border: `1px solid ${C.amber}44`, borderRadius: 8, padding: "8px 10px" }}>
                    Demo: tu código es <strong style={{ letterSpacing: 2 }}>{otpEnviado}</strong>. En producción llega a tu correo.
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <input value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •" inputMode="numeric"
                    onKeyDown={(e) => e.key === "Enter" && verificarOTP()}
                    style={{ ...muroInput, textAlign: "center", fontSize: 24, letterSpacing: 8, fontWeight: 700 }} />
                  {errReg && <div style={{ color: C.red, fontSize: 12.5 }}>{errReg}</div>}
                  <button onClick={verificarOTP} disabled={enviando} style={{
                    padding: 14, borderRadius: 11, border: "none", cursor: enviando ? "default" : "pointer",
                    background: enviando ? C.line : `linear-gradient(90deg, ${C.neonDim}, ${C.neon})`,
                    color: enviando ? C.textDim : "#06140a", fontSize: 15, fontWeight: 700, fontFamily: "inherit",
                    boxShadow: enviando ? "none" : `0 8px 26px ${C.neon}40`,
                  }}>
                    {enviando ? "Verificando…" : "Verificar código"}
                  </button>
                  <button onClick={reenviarOTP} disabled={reenvioEn > 0} style={{
                    padding: 6, background: "transparent", border: "none",
                    color: reenvioEn > 0 ? C.textFaint : C.neon,
                    fontSize: 12.5, cursor: reenvioEn > 0 ? "default" : "pointer", fontFamily: "inherit",
                  }}>
                    {reenvioEn > 0 ? `Reenviar código en ${reenvioEn}s` : "Reenviar código"}
                  </button>
                </div>
              </>
            )}

            {faseRegistro === "ok" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: C.neon }}>¡Verificado!</h2>
                <p style={{ margin: 0, fontSize: 14, color: C.textDim }}>
                  Gracias por registrarte en la lista de espera de Cumbrera. Tienes {LIMITE_DIARIO} búsquedas disponibles hoy.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de cuota diaria agotada */}
      {cuotaAgotada && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(3,6,3,.78)", backdropFilter: "blur(6px)", padding: 18,
        }} onClick={() => setCuotaAgotada(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 420, background: C.panel, border: `1px solid ${C.amber}44`,
            borderRadius: 18, padding: "clamp(22px,5vw,30px)", textAlign: "center",
            boxShadow: `0 24px 80px rgba(0,0,0,.7), 0 0 60px ${C.amber}18`,
          }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🌙</div>
            <h2 style={{ margin: "0 0 10px", fontSize: 21, fontWeight: 700, lineHeight: 1.2 }}>
              Agotaste tus {LIMITE_DIARIO} búsquedas de hoy
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: C.textDim, lineHeight: 1.55 }}>
              Esperamos volver a verte mañana. Disculpa los recursos limitados: estamos ampliando nuestra capacidad
              para darte más información y más consultas muy pronto.
            </p>
            <div style={{ fontSize: 12.5, color: C.amber, background: `${C.amber}12`, border: `1px solid ${C.amber}33`, borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
              Tu cuota se renueva en <strong><CuentaRegresiva /></strong>
            </div>
            <button onClick={() => setCuotaAgotada(false)} style={{
              padding: "12px 20px", borderRadius: 11, border: `1px solid ${C.line}`, cursor: "pointer",
              background: "transparent", color: C.text, fontSize: 14, fontWeight: 600, fontFamily: "inherit",
            }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(20px,5vw,44px) 20px 60px" }}>

        {/* Header */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M2 18 L9 6 L13 13 L16 9 L22 18 Z" stroke={C.neon} strokeWidth="1.6" strokeLinejoin="round" fill={`${C.neon}1a`} />
            </svg>
            <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>
              Cumbrera
            </h1>
            <span style={{ fontSize: 10, letterSpacing: 1.5, color: C.neon, border: `1px solid ${C.neonDim}55`, borderRadius: 20, padding: "3px 9px", marginTop: 4 }}>
              EV · COLOMBIA
            </span>
          </div>
          <p style={{ margin: 0, color: C.textDim, fontSize: 14.5, maxWidth: 540 }}>
            Calcula si tu batería realmente alcanza. Modelo físico por tramo: pendiente, velocidad según el tipo de vía,
            aerodinámica, clima por altitud y regeneración en bajadas. La montaña colombiana cobra su parte.
          </p>
          {!registrado && (
            <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: C.textDim, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 20, padding: "5px 12px" }}>
              <span style={{ width: 7, height: 7, borderRadius: 7, background: restantes === 0 ? C.amber : C.neon }} />
              {restantes === 0
                ? "Búsquedas gratis agotadas · regístrate para continuar"
                : `${restantes} de ${LIMITE_NUEVO} búsquedas gratis`}
            </div>
          )}
          {registrado && (
            <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: restantes === 0 ? C.amber : C.neon, background: restantes === 0 ? `${C.amber}12` : `${C.neon}12`, border: `1px solid ${restantes === 0 ? C.amber : C.neonDim}55`, borderRadius: 20, padding: "5px 12px" }}>
              <span style={{ width: 7, height: 7, borderRadius: 7, background: restantes === 0 ? C.amber : C.neon }} />
              {restantes === 0
                ? "Cuota de hoy agotada · vuelve mañana"
                : `${restantes} de ${LIMITE_DIARIO} búsquedas hoy`}
            </div>
          )}
        </header>

        {/* Ruta */}
        <section style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", flexDirection: esMovil ? "column" : "row" }}>
            <Campo label="Origen" dot={C.neon} value={origen} onChange={onO} placeholder="Ej. Bogotá"
              sugerencias={sugO} onPick={(s) => { setOrigen(s.label); setOrigenSel(s); setSugO([]); }} />
            <Campo label="Destino" dot={C.amber} value={destino} onChange={onD} placeholder="Ej. Girardot"
              sugerencias={sugD} onPick={(s) => { setDestino(s.label); setDestinoSel(s); setSugD([]); }} />
          </div>
        </section>

        {/* Vehículo */}
        <section style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: C.textDim, textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
            Tu vehículo eléctrico
          </div>
          <div style={{ display: "grid", gridTemplateColumns: esMovil ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lblStyle}>Modelo</label>
              <select value={evId} onChange={(e) => setEvId(e.target.value)} style={selStyle}>
                {EV_CATALOG.map((e) => (
                  <option key={e.id} value={e.id} style={{ background: C.panel }}>
                    {e.marca} {e.modelo !== "—" ? e.modelo : ""} {e.id !== "custom" ? `· ${e.kwh} kWh` : ""}
                  </option>
                ))}
              </select>
            </div>
            <NumField label="Capacidad batería" unit="kWh" value={kwh} onChange={setKwh} step={0.5} />
            <NumField label="Consumo nominal" unit="Wh/km" value={whkm} onChange={setWhkm} step={1} />
            <NumField label="Peso del vehículo" unit="kg" value={masa} onChange={setMasa} step={50} />
            <NumField label="Carga actual" unit="%" value={bateria} onChange={setBateria} step={5} max={100} />
          </div>
          <button onClick={calcular} disabled={cargando} style={{
            width: "100%", padding: "15px", borderRadius: 12, border: "none", cursor: cargando ? "default" : "pointer",
            background: cargando ? C.line : `linear-gradient(90deg, ${C.neonDim}, ${C.neon})`,
            color: cargando ? C.textDim : "#06140a", fontSize: 15.5, fontWeight: 700, fontFamily: "inherit",
            letterSpacing: 0.3, boxShadow: cargando ? "none" : `0 8px 30px ${C.neon}40`,
            transition: "transform .1s",
          }}>
            {cargando
              ? "Calculando ruta y elevación…"
              : !registrado && consultas >= LIMITE_NUEVO
              ? "Regístrate para continuar"
              : registrado && consultas >= LIMITE_DIARIO
              ? "Cuota de hoy agotada · vuelve mañana"
              : "Calcular autonomía real"}
          </button>
          {error && <div style={{ marginTop: 12, color: C.red, fontSize: 13 }}>{error}</div>}
          {ORS_KEY && (
            <div style={{ marginTop: 12, fontSize: 11.5, color: C.textFaint, lineHeight: 1.5 }}>
              ● Conectado a OpenRouteService. En esta vista previa las llamadas externas pueden estar bloqueadas
              (CORS); si ocurre, Cumbrera usa automáticamente datos de ciudades de Colombia para que veas el cálculo.
              Al publicar en cumbreva.medialab.design las rutas y elevación reales funcionan sin cambios.
            </div>
          )}
        </section>

        {/* Resultado */}
        {res && (
          <section style={{ background: C.panel, border: `1px solid ${res.alcanza ? C.line : C.red + "66"}`, borderRadius: 16, padding: 22 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
              color: res.alcanza ? C.neon : C.red, fontSize: 15, fontWeight: 700,
            }}>
              <span style={{ fontSize: 20 }}>{res.alcanza ? "✓" : "⚠"}</span>
              {res.alcanza
                ? `Alcanzas con ${Math.round(res.pctLlegada)}% de margen`
                : `No alcanza — te quedarías a ${Math.round(res.distKm - res.kmAlcance)} km del destino`}
            </div>

            <MedidorBateria pct={res.pctLlegada} alcanza={res.alcanza} kmAlcance={res.kmAlcance} distKm={res.distKm} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginTop: 18 }}>
              <Stat label="Distancia real" value={`${Math.round(res.distKm)} km`} sub={`${Math.round(res.durMin)} min en vía`} />
              <Stat label="Autonomía real" value={`${Math.round(res.kmAlcance)} km`} sub={`con ${bateria}% de carga`} color={res.alcanza ? C.neon : C.amber} />
              <Stat label="Consumo corregido" value={`${Math.round(res.consumoReal)}`} sub={`Wh/km · +${Math.round(res.penaliz)}% vs catálogo`} color={C.lime} />
              <Stat label="Desnivel acumulado" value={`+${Math.round(res.perfil.asc)} m`} sub={`baja ${Math.round(res.perfil.desc)} m`} />
            </div>

            {/* Desglose de a dónde se va la energía */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.3, color: C.textDim, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
                A dónde se va la energía · vel. media ~{Math.round(res.velMedia)} km/h
              </div>
              {(() => {
                const partes = [
                  { lbl: "Subida (pendiente)", val: res.wPend, col: C.amber },
                  { lbl: "Aerodinámica", val: res.wAero, col: C.neon },
                  { lbl: "Rodadura", val: res.wRod, col: C.neonDim },
                  { lbl: "Clima / A·C", val: res.wAux, col: "#39c0ff" },
                ];
                const totalBruto = partes.reduce((s, p) => s + p.val, 0) || 1;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {partes.map((p, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                          <span style={{ color: C.textDim }}>{p.lbl}</span>
                          <span style={{ color: C.text }}>{Math.round(p.val / 1000)} kWh · {Math.round((p.val / totalBruto) * 100)}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 6, background: C.panel2, overflow: "hidden" }}>
                          <div style={{ width: `${(p.val / totalBruto) * 100}%`, height: "100%", background: p.col }} />
                        </div>
                      </div>
                    ))}
                    {res.wRegen > 0 && (
                      <div style={{ fontSize: 12, color: "#39c0ff", marginTop: 2 }}>
                        ↻ Regeneración recupera ~{Math.round(res.wRegen / 1000)} kWh en las bajadas
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.3, color: C.textDim, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
                Mapa de la ruta · {Math.round(res.distKm)} km
              </div>
              <MapaRuta
                coords={res.coords}
                distKm={res.distKm}
                alcanza={res.alcanza}
                kmAlcance={res.kmAlcance}
                origen={origen}
                destino={destino}
              />
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.3, color: C.textDim, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
                Perfil de elevación · {Math.round(res.perfil.min)}–{Math.round(res.perfil.max)} m
              </div>
              <PerfilSVG coords={res.coords} />
            </div>

            <p style={{ fontSize: 11.5, color: C.textFaint, marginTop: 16, lineHeight: 1.5 }}>
              Estimación · datos de {res.fuente || "ruteo"}. El consumo real también depende de velocidad, clima, aire
              acondicionado, carga y estilo de conducción. Deja siempre un margen de seguridad antes de viajar.
            </p>
          </section>
        )}

        <footer style={{ marginTop: 32, textAlign: "center", fontSize: 11.5, color: C.textFaint }}>
          Cumbrera · MediaLab Ingeniería · prototipo de calculadora EV
        </footer>
      </div>
    </div>
  );
}

const lblStyle = { display: "block", fontSize: 11, letterSpacing: 1.3, color: C.textDim, textTransform: "uppercase", fontWeight: 600, marginBottom: 7 };
const selStyle = { width: "100%", boxSizing: "border-box", background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 13px", color: C.text, fontSize: 14.5, fontFamily: "inherit", outline: "none" };
const muroInput = { width: "100%", boxSizing: "border-box", background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 11, padding: "13px 14px", color: C.text, fontSize: 15, fontFamily: "inherit", outline: "none" };

function NumField({ label, unit, value, onChange, step = 1, max }) {
  return (
    <div>
      <label style={lblStyle}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10, padding: "0 12px" }}>
        <input type="number" value={value} step={step} max={max}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: C.text, fontSize: 15, fontFamily: "inherit", padding: "12px 0", outline: "none" }} />
        <span style={{ fontSize: 11.5, color: C.textFaint, fontWeight: 600 }}>{unit}</span>
      </div>
    </div>
  );
}
