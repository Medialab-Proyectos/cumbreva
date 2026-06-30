import { SITE_URL } from "@/lib/site"

export type ProgrammaticSeoPage = {
  path: string
  group: "root" | "route" | "model"
  title: string
  description: string
  eyebrow: string
  h1: string
  lead: string
  heroImage: string
  heroAlt: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  stats: Array<{
    label: string
    value: string
    note: string
  }>
  intro: {
    title: string
    body: string
  }
  sections: Array<{
    eyebrow: string
    title: string
    body: string
    items: string[]
  }>
  charging?: {
    title: string
    items: string[]
  }
  risks?: string[]
  checklistTitle: string
  checklist: string[]
  faq: Array<{
    question: string
    answer: string
  }>
  shareLine: string
  keywords: string[]
}

const utm = (path: string) =>
  `utm_source=seo_programatico&utm_medium=organic&utm_campaign=${path
    .replace(/^\//, "")
    .replaceAll("/", "_")}`

const calculatorHref = (path: string) => `/calculadora?${utm(path)}`
const waitlistHref = (path: string) => `/?${utm(path)}#lista-espera`
const storeHref = (path: string) => `/tienda?${utm(path)}`

export const rootSeoPages: ProgrammaticSeoPage[] = [
  {
    path: "/calculadora-autonomia-carro-electrico-colombia",
    group: "root",
    title: "Calculadora autonomia carro electrico Colombia",
    description:
      "No adivines la autonomia. Calcula si tu carro electrico llega antes de salir, con bateria real, ruta y margen para carretera colombiana.",
    eyebrow: "Calculadora de autonomia",
    h1: "No adivines la autonomia: calcula si llegas antes de salir",
    lead: "La pregunta no es cuantos kilometros promete el carro. La pregunta es si con tu bateria de hoy, tu destino y la carretera colombiana puedes llegar sin quedarte corto.",
    heroImage: "/hero-route.png",
    heroAlt: "Calculadora de autonomia para carro electrico en Colombia",
    primaryCta: {
      label: "Calcular con mi carro",
      href: calculatorHref("/calculadora-autonomia-carro-electrico-colombia"),
    },
    secondaryCta: {
      label: "Recibir acceso",
      href: waitlistHref("/calculadora-autonomia-carro-electrico-colombia"),
    },
    stats: [
      {
        label: "Variable clave",
        value: "Bateria real",
        note: "El porcentaje actual pesa mas que la autonomia prometida.",
      },
      {
        label: "Contexto",
        value: "Montana",
        note: "Subidas, bajadas y calor cambian el consumo.",
      },
      {
        label: "Salida segura",
        value: "Margen",
        note: "El objetivo es llegar tranquilo, no llegar al limite.",
      },
    ],
    intro: {
      title: "Calcula bateria real con montana colombiana",
      body: "Colombia no se maneja en una pista plana. Entre peajes, trancones, subidas largas, descensos, aire acondicionado y cambios de clima, la autonomia real puede sentirse muy distinta a la ficha tecnica.",
    },
    sections: [
      {
        eyebrow: "Antes de salir",
        title: "La calculadora existe para una decision concreta",
        body: "Si tienes una ruta, no necesitas leer una guia completa para decidir. Necesitas saber si sales, si cargas primero o si ajustas el trayecto.",
        items: [
          "Ingresa tu bateria disponible antes de moverte.",
          "Usa el destino real, no una distancia aproximada de memoria.",
          "Planea carretera sin quedarte corto cuando el margen sea justo.",
        ],
      },
      {
        eyebrow: "Autonomia real",
        title: "El porcentaje no significa lo mismo en todas las rutas",
        body: "Un 35% en ciudad puede sentirse suficiente. Ese mismo 35% antes de una subida, con pasajeros y sin cargador cercano, se siente distinto.",
        items: [
          "Ten mas reserva en rutas nuevas o de montana.",
          "No uses el ultimo porcentaje como parte normal del plan.",
          "Comparte el calculo si viajas con alguien mas.",
        ],
      },
    ],
    checklistTitle: "Usala cuando",
    checklist: [
      "Vas a salir de la ciudad y no conoces bien los cargadores.",
      "El carro muestra autonomia, pero la ruta tiene montana.",
      "Quieres saber si debes cargar antes de salir.",
      "Necesitas explicar el plan a otra persona antes del viaje.",
    ],
    faq: [
      {
        question: "Como saber si mi carro electrico llega?",
        answer:
          "Calcula con bateria actual, distancia, consumo esperado y margen. La autonomia oficial ayuda, pero la decision debe hacerse con la ruta real.",
      },
      {
        question: "Por que mi carro electrico consume mas en carretera?",
        answer:
          "La velocidad sostenida, las subidas, el clima y la carga del vehiculo pueden aumentar el consumo frente a ciudad o frente a datos homologados.",
      },
      {
        question: "Que hago si el margen es bajo?",
        answer:
          "Carga antes de salir, busca una parada intermedia o cambia el plan. Lo importante es no esperar a estar en bateria critica.",
      },
    ],
    shareLine:
      "Comparte esta calculadora con quien todavia decide la ruta mirando solo el tablero.",
    keywords: [
      "calculadora autonomia carro electrico Colombia",
      "autonomia real carro electrico",
      "cuantos km dura bateria carro electrico",
    ],
  },
  {
    path: "/carga-en-casa-carro-electrico-colombia",
    group: "root",
    title: "Carga en casa para carro electrico en Colombia",
    description:
      "Guia para entender carga en casa de carro electrico en Colombia: apartamento, potencia, habitos, costo y cuando calcular rutas antes de salir.",
    eyebrow: "Carga en casa",
    h1: "Cargar en casa cambia todo, pero hay que hacerlo con cabeza",
    lead: "La mejor experiencia electrica suele empezar cuando el carro carga mientras tu descansas. Pero en Colombia la pregunta real es si tu casa, parqueadero o edificio estan listos para ese habito.",
    heroImage: "/lifestyle-charging.png",
    heroAlt: "Carro electrico cargando en casa",
    primaryCta: {
      label: "Calcular mi autonomia",
      href: calculatorHref("/carga-en-casa-carro-electrico-colombia"),
    },
    secondaryCta: {
      label: "Unirme a Cumbreva",
      href: waitlistHref("/carga-en-casa-carro-electrico-colombia"),
    },
    stats: [
      {
        label: "Mejor caso",
        value: "Cargar quieto",
        note: "Casa, trabajo o parqueadero reducen ansiedad.",
      },
      {
        label: "Revisar",
        value: "Potencia",
        note: "No todo tomacorriente es una solucion permanente.",
      },
      {
        label: "Decidir",
        value: "Rutina",
        note: "La carga debe encajar con tus trayectos reales.",
      },
    ],
    intro: {
      title: "No se trata solo de enchufar",
      body: "Carga en casa significa revisar instalacion, seguridad, tiempo disponible, consumo mensual y reglas del edificio. Si vives en apartamento, tambien entra la administracion y el parqueadero.",
    },
    sections: [
      {
        eyebrow: "Apartamento",
        title: "La pregunta no es si se puede, sino como hacerlo bien",
        body: "Muchos compradores se frenan por el edificio. La conversacion debe empezar temprano: punto asignado, medidor, acometida, autorizacion y tipo de cargador.",
        items: [
          "Pregunta por capacidad electrica antes de comprar.",
          "Evita depender de extensiones o soluciones temporales.",
          "Calcula tus rutas para saber cuanta carga necesitas de verdad.",
        ],
      },
      {
        eyebrow: "Habito",
        title: "Cargar poco y frecuente suele ser mas comodo",
        body: "No siempre necesitas llenar al 100%. Para muchos usuarios, cargar de noche y salir con margen suficiente resuelve mejor que buscar carga rapida a ultima hora.",
        items: [
          "Define tu porcentaje minimo para salir tranquilo.",
          "Carga mas antes de carretera o rutas nuevas.",
          "Usa la calculadora cuando la rutina cambie.",
        ],
      },
    ],
    checklistTitle: "Antes de instalar",
    checklist: [
      "Revisa potencia disponible y protecciones electricas.",
      "Consulta reglas del edificio o parqueadero.",
      "Estima cuanto recorres por semana.",
      "Calcula si tu carga nocturna cubre tus rutas habituales.",
    ],
    faq: [
      {
        question: "Puedo cargar un carro electrico en apartamento?",
        answer:
          "Puede ser posible, pero depende del edificio, parqueadero, capacidad electrica, permisos y una instalacion segura.",
      },
      {
        question: "Necesito cargador especial?",
        answer:
          "Para uso frecuente conviene una instalacion dedicada y segura. Un tomacorriente comun puede ser lento o no ser ideal como solucion permanente.",
      },
      {
        question: "Carga en casa reemplaza cargar en carretera?",
        answer:
          "No siempre. Para ciudad ayuda muchisimo, pero en viajes largos debes calcular autonomia y posibles paradas.",
      },
    ],
    shareLine:
      "Enviasela a quien quiere comprar electrico pero vive en apartamento.",
    keywords: [
      "carro electrico carga en apartamento",
      "carga en casa carro electrico Colombia",
      "cuanto cuesta cargar un carro electrico",
    ],
  },
  {
    path: "/viajar-en-carro-electrico-colombia",
    group: "root",
    title: "Viajar en carro electrico en Colombia",
    description:
      "Planea carretera en carro electrico por Colombia sin quedarte corto: bateria, autonomia real, paradas, puntos de carga y riesgos de ruta.",
    eyebrow: "Carretera electrica",
    h1: "Planea carretera sin quedarte corto",
    lead: "Viajar en electrico en Colombia es posible, pero no se maneja igual que llenar gasolina y seguir. La tranquilidad esta en calcular antes de salir y no improvisar con la bateria baja.",
    heroImage: "/hero-person.png",
    heroAlt: "Persona planeando viaje en carro electrico por Colombia",
    primaryCta: {
      label: "Calcular mi viaje",
      href: calculatorHref("/viajar-en-carro-electrico-colombia"),
    },
    secondaryCta: {
      label: "Recibir acceso",
      href: waitlistHref("/viajar-en-carro-electrico-colombia"),
    },
    stats: [
      {
        label: "Clave",
        value: "Salir alto",
        note: "Carretera nueva pide mas reserva.",
      },
      {
        label: "Cuidado",
        value: "Montana",
        note: "El regreso puede consumir mas que la ida.",
      },
      {
        label: "Plan",
        value: "Paradas",
        note: "Ten alternativa antes de necesitarla.",
      },
    ],
    intro: {
      title: "Antes de salir, revisa si llegas",
      body: "La carretera colombiana tiene cierres, pendientes, clima, trafico pesado y tramos sin muchas opciones de carga. La mejor ruta es la que combina tiempo, energia y margen.",
    },
    sections: [
      {
        eyebrow: "Carretera",
        title: "No salgas con una sola opcion",
        body: "Si dependes de un unico punto de carga y algo falla, todo el viaje cambia. Planea el punto ideal y una alternativa razonable.",
        items: [
          "Calcula el tramo mas exigente, no solo el total del viaje.",
          "Ubica zonas de carga antes de entrar a tramos largos.",
          "Evita llegar al cargador con porcentaje critico.",
        ],
      },
      {
        eyebrow: "Voz real",
        title: "La ansiedad no es miedo al electrico, es falta de contexto",
        body: "Cuando sabes con cuanto sales, donde puedes cargar y que margen tienes, el viaje deja de sentirse como apuesta.",
        items: [
          "Revisa bateria real antes de salir.",
          "Ajusta velocidad si necesitas proteger margen.",
          "Comparte el plan con tu copiloto o familia.",
        ],
      },
    ],
    checklistTitle: "Checklist de viaje",
    checklist: [
      "Salir con bateria suficiente para el primer tramo exigente.",
      "Verificar puntos de carga cercanos a la ruta.",
      "Guardar una parada alternativa.",
      "Calcular regreso, no solo ida.",
    ],
    faq: [
      {
        question: "Se puede viajar en carro electrico por Colombia?",
        answer:
          "Si, pero hay que planear mejor. La experiencia cambia segun ruta, cargadores disponibles, consumo real y margen de salida.",
      },
      {
        question: "Que ruta debo calcular primero?",
        answer:
          "Calcula el tramo mas largo o con mas montana. Ahi suele aparecer el riesgo real de autonomia.",
      },
      {
        question: "Debo cargar al 100% antes de carretera?",
        answer:
          "En rutas nuevas o con poca infraestructura, salir alto da tranquilidad. La decision final depende de tu carro, distancia y cargadores disponibles.",
      },
    ],
    shareLine:
      "Compartela antes de un viaje para que nadie decida la carga tarde.",
    keywords: [
      "viajar en carro electrico Colombia",
      "electrolineras en carretera",
      "planea carretera carro electrico",
    ],
  },
  {
    path: "/autonomia-real-vs-wltp",
    group: "root",
    title: "Autonomia real vs WLTP en carros electricos",
    description:
      "Entiende por que la autonomia WLTP no siempre coincide con la autonomia real de un carro electrico en carretera colombiana.",
    eyebrow: "Autonomia real vs WLTP",
    h1: "La autonomia de brochure no es la autonomia de tu carretera",
    lead: "WLTP sirve para comparar modelos, pero tu consumo real depende de velocidad, clima, llantas, peso, montana y forma de manejar. Por eso Cumbreva se enfoca en calcular si llegas con tu ruta.",
    heroImage: "/cumbreva-app-mockup.png",
    heroAlt: "Comparacion de autonomia real y autonomia homologada",
    primaryCta: {
      label: "Calcular autonomia real",
      href: calculatorHref("/autonomia-real-vs-wltp"),
    },
    secondaryCta: {
      label: "Unirme a la lista",
      href: waitlistHref("/autonomia-real-vs-wltp"),
    },
    stats: [
      {
        label: "WLTP",
        value: "Comparar",
        note: "Util para mirar modelos bajo un ciclo estandar.",
      },
      {
        label: "Real",
        value: "Decidir",
        note: "Depende de tu ruta, bateria y manejo.",
      },
      {
        label: "Colombia",
        value: "Montana",
        note: "El terreno cambia mucho la energia necesaria.",
      },
    ],
    intro: {
      title: "No adivines la autonomia",
      body: "La ficha tecnica puede decir una cifra atractiva, pero una subida larga con aire acondicionado y pasajeros puede contar otra historia. Lo importante es convertir esa diferencia en margen de viaje.",
    },
    sections: [
      {
        eyebrow: "Homologado",
        title: "WLTP ayuda, pero no conoce tu destino",
        body: "El dato homologado no sabe si vas a Girardot, Villavicencio, Medellin o a una finca con subida al final.",
        items: [
          "Usa WLTP para comparar versiones.",
          "Usa autonomia real para decidir rutas.",
          "No confundas rango maximo con margen seguro.",
        ],
      },
      {
        eyebrow: "Realidad",
        title: "Tu consumo cambia por ruta y por habito",
        body: "Dos conductores con el mismo carro pueden tener consumos distintos. Y el mismo conductor puede consumir distinto entre ciudad, carretera y montana.",
        items: [
          "Velocidad alta consume mas energia.",
          "Subidas largas castigan el margen.",
          "El frio, el calor y las llantas tambien pesan.",
        ],
      },
    ],
    checklistTitle: "Cuando desconfiar del dato ideal",
    checklist: [
      "Viajas a carretera con velocidad sostenida.",
      "La ruta tiene subidas o desnivel fuerte.",
      "El carro va lleno o con equipaje.",
      "No conoces cargadores cercanos al destino.",
    ],
    faq: [
      {
        question: "Que significa WLTP?",
        answer:
          "Es un ciclo de prueba para medir consumo y autonomia de forma estandarizada. Sirve para comparar, pero no garantiza el resultado de cada ruta real.",
      },
      {
        question: "Por que mi autonomia real es menor?",
        answer:
          "Puede ser por velocidad, pendientes, clima, presion de llantas, carga del vehiculo o estilo de manejo.",
      },
      {
        question: "Como uso ese dato sin confundirme?",
        answer:
          "Toma WLTP como referencia inicial y calcula cada ruta con bateria real y margen de seguridad.",
      },
    ],
    shareLine:
      "Enviasela a quien cree que la cifra WLTP es una promesa exacta.",
    keywords: [
      "WLTP vs autonomia real",
      "autonomia real carro electrico",
      "por que mi carro electrico consume mas en carretera",
    ],
  },
  {
    path: "/estaciones-de-carga-en-carretera-colombia",
    group: "root",
    title: "Estaciones de carga en carretera Colombia",
    description:
      "Como planear estaciones de carga en carretera en Colombia: puntos cercanos, alternativas, riesgos de ruta y calculo antes de salir.",
    eyebrow: "Carga en carretera",
    h1: "En carretera, no busques carga tarde",
    lead: "La carga que salva un viaje es la que planeaste antes de necesitarla. En carretera colombiana conviene mirar zonas de carga, alternativas y margen antes de que la bateria se vuelva urgente.",
    heroImage: "/hero-route.png",
    heroAlt: "Ruta con estaciones de carga en carretera Colombia",
    primaryCta: {
      label: "Calcular ruta con carga",
      href: calculatorHref("/estaciones-de-carga-en-carretera-colombia"),
    },
    secondaryCta: {
      label: "Recibir acceso",
      href: waitlistHref("/estaciones-de-carga-en-carretera-colombia"),
    },
    stats: [
      {
        label: "Buscar",
        value: "Zonas",
        note: "No solo puntos aislados.",
      },
      {
        label: "Evitar",
        value: "Ultimo %",
        note: "Llegar critico reduce tus opciones.",
      },
      {
        label: "Decidir",
        value: "Desvio",
        note: "El punto mas cercano no siempre conviene.",
      },
    ],
    intro: {
      title: "La estacion correcta depende de tu ruta",
      body: "Una estacion puede estar cerca en el mapa y aun asi ser mala opcion si exige devolverte, desviarte mucho o llegar con bateria critica.",
    },
    sections: [
      {
        eyebrow: "Puntos de carga",
        title: "Piensa en corredores, no en puntos sueltos",
        body: "Para viajar mejor, identifica zonas donde hay opciones y calcula si llegas con margen suficiente.",
        items: [
          "Busca carga antes de entrar al tramo mas largo.",
          "Ten una segunda opcion si el punto esta ocupado o fuera de servicio.",
          "Verifica compatibilidad, potencia y horario cuando aplique.",
        ],
      },
      {
        eyebrow: "Decision",
        title: "Carga recomendada no es siempre 100%",
        body: "A veces necesitas salir al 100%. Otras veces basta con cargar lo necesario para llegar al siguiente tramo con margen. La diferencia la da la ruta.",
        items: [
          "Calcula tramo por tramo.",
          "Ajusta el plan si vas con pasajeros o equipaje.",
          "No dejes el regreso para ultimo minuto.",
        ],
      },
    ],
    checklistTitle: "Antes de confiar en un punto",
    checklist: [
      "Verifica que quede cerca de la ruta real.",
      "Confirma que tu carro pueda cargar ahi.",
      "Calcula llegada con margen.",
      "Ten una alternativa por si el punto no esta disponible.",
    ],
    faq: [
      {
        question: "Como encuentro estaciones de carga en carretera?",
        answer:
          "Busca por corredor y no solo por cercania. Lo importante es que la estacion sirva para tu ruta, tu bateria y tu siguiente tramo.",
      },
      {
        question: "Debo parar en el primer cargador disponible?",
        answer:
          "No siempre. Si tienes margen, puede convenir uno mejor ubicado. Si no tienes margen, la prioridad cambia.",
      },
      {
        question: "Cumbreva muestra si debo cargar?",
        answer:
          "Cumbreva ayuda a decidir si tu bateria alcanza y cuando conviene planear carga antes de salir.",
      },
    ],
    shareLine:
      "Compartela con quien espera a tener bateria baja para buscar cargador.",
    keywords: [
      "estaciones de carga carros electricos Colombia",
      "electrolineras en carretera",
      "cargadores electricos cerca",
    ],
  },
]

export const routeSeoPages: ProgrammaticSeoPage[] = [
  {
    path: "/rutas/bogota-girardot-carro-electrico",
    group: "route",
    title: "Bogota a Girardot en carro electrico",
    description:
      "Planea Bogota Girardot en carro electrico: distancia, desnivel, consumo estimado, carga recomendada, riesgos y CTA para calcular con tu carro.",
    eyebrow: "Ruta Bogota - Girardot",
    h1: "Bogota a Girardot en electrico: la ida baja, el regreso cobra",
    lead: "Esta ruta parece facil por distancia, pero el cambio de altura entre la Sabana y el valle del Magdalena hace que la ida y el regreso se sientan muy distintos en bateria.",
    heroImage: "/hero-route.png",
    heroAlt: "Ruta Bogota Girardot en carro electrico",
    primaryCta: {
      label: "Calcular esta ruta",
      href: calculatorHref("/rutas/bogota-girardot-carro-electrico"),
    },
    stats: [
      {
        label: "Distancia",
        value: "135-150 km",
        note: "Aproximado segun origen en Bogota y destino en Girardot.",
      },
      {
        label: "Desnivel",
        value: "Bajada fuerte",
        note: "El regreso exige una subida larga hacia la Sabana.",
      },
      {
        label: "Carga salida",
        value: "70-90%",
        note: "Mas alta si regresas el mismo dia o llevas el carro lleno.",
      },
    ],
    intro: {
      title: "Antes de salir, revisa si llegas y si tambien regresas",
      body: "La ida puede verse amable por la bajada, pero el retorno hacia Bogota aumenta el consumo. Si vas con familia, calor y trancones, no planees con margen minimo.",
    },
    sections: [
      {
        eyebrow: "Consumo estimado",
        title: "La ida puede ahorrar energia, el regreso puede duplicar la preocupacion",
        body: "Un compacto eficiente puede hacer la ida con poco consumo relativo, pero el regreso subiendo a Bogota pide mas bateria y mas paciencia.",
        items: [
          "Ida estimada: 20-35 kWh segun carro, velocidad y trafico.",
          "Regreso estimado: 30-50 kWh por subida, calor y carga del vehiculo.",
          "Si sales de Girardot bajo de bateria, carga antes de enfrentar la subida.",
        ],
      },
    ],
    charging: {
      title: "Zonas donde revisar carga",
      items: [
        "Bogota y Soacha antes de salir.",
        "Fusagasuga o Melgar como zonas intermedias a verificar.",
        "Girardot y alrededores antes del regreso.",
      ],
    },
    risks: [
      "Calor y aire acondicionado en tierra caliente.",
      "Trancores de fin de semana y festivos.",
      "Regreso con subida prolongada y carro cargado.",
    ],
    checklistTitle: "Calcula especialmente si",
    checklist: [
      "Viajas en puente festivo.",
      "Vuelves el mismo dia.",
      "No tienes carga asegurada en Girardot.",
      "Tu carro tiene bateria pequena.",
    ],
    faq: [
      {
        question: "Se puede ir de Bogota a Girardot en carro electrico?",
        answer:
          "Si, pero debes calcular ida y regreso por separado. La subida hacia Bogota puede consumir mucho mas que la ida.",
      },
      {
        question: "Con cuanto porcentaje salir de Bogota?",
        answer:
          "Depende del carro, pero para ir tranquilo conviene salir alto y mas aun si no tienes carga garantizada en destino.",
      },
      {
        question: "Donde conviene cargar?",
        answer:
          "Revisa opciones antes de salir en Bogota/Soacha y opciones en Girardot o zonas intermedias como Fusagasuga o Melgar.",
      },
    ],
    shareLine:
      "Enviale esta ruta a quien baja a tierra caliente sin calcular el regreso.",
    keywords: [
      "viajar en carro electrico de Bogota a Girardot",
      "Bogota Girardot carro electrico",
      "cargadores Bogota Girardot",
    ],
  },
  {
    path: "/rutas/bogota-villavicencio-carro-electrico",
    group: "route",
    title: "Bogota a Villavicencio en carro electrico",
    description:
      "Calcula Bogota Villavicencio en carro electrico: distancia, montana, consumo, carga de salida, riesgos de via y puntos de carga cercanos.",
    eyebrow: "Ruta Bogota - Villavicencio",
    h1: "Bogota a Villavicencio: la bajada ayuda, la via exige respeto",
    lead: "La distancia no es enorme, pero la ruta tiene pendiente, tuneles, clima variable y cierres posibles. En electrico, el plan debe incluir bateria para llegar y margen para cualquier cambio.",
    heroImage: "/hero-person.png",
    heroAlt: "Ruta Bogota Villavicencio en carro electrico",
    primaryCta: {
      label: "Calcular esta ruta",
      href: calculatorHref("/rutas/bogota-villavicencio-carro-electrico"),
    },
    stats: [
      {
        label: "Distancia",
        value: "120-130 km",
        note: "Aproximado desde Bogota hacia Villavicencio.",
      },
      {
        label: "Desnivel",
        value: "Descenso alto",
        note: "El regreso subiendo a Bogota es el tramo exigente.",
      },
      {
        label: "Carga salida",
        value: "80-100%",
        note: "Recomendable si no tienes carga confirmada en destino.",
      },
    ],
    intro: {
      title: "No calcules solo kilometros: calcula la montana",
      body: "La via al Llano puede cambiar por trafico, clima o cierres. Si el plan se alarga, el margen de bateria deja de ser detalle y se vuelve tranquilidad.",
    },
    sections: [
      {
        eyebrow: "Consumo estimado",
        title: "El regreso puede ser mas duro que la ida",
        body: "Bajar desde Bogota puede favorecer consumo, pero subir de Villavicencio a la Sabana exige energia sostenida.",
        items: [
          "Ida estimada: 22-38 kWh segun carro y ritmo.",
          "Regreso estimado: 35-60 kWh por pendiente y trafico.",
          "Si hay cierres o desvio, el margen debe ser mayor.",
        ],
      },
    ],
    charging: {
      title: "Zonas donde revisar carga",
      items: [
        "Bogota antes de tomar la salida al Llano.",
        "Villavicencio y alrededores para asegurar regreso.",
        "Zonas intermedias solo si confirmas disponibilidad antes de salir.",
      ],
    },
    risks: [
      "Cierres, pare y siga o trafico pesado.",
      "Lluvia, neblina y uso alto de climatizacion.",
      "Subida larga en el regreso hacia Bogota.",
    ],
    checklistTitle: "Calcula especialmente si",
    checklist: [
      "Sales con menos del 80%.",
      "Vas a regresar el mismo dia.",
      "No sabes donde cargar en Villavicencio.",
      "Hay reporte de cierres o trafico en la via.",
    ],
    faq: [
      {
        question: "Se puede ir de Bogota a Villavicencio en electrico?",
        answer:
          "Si, pero calcula con margen. La ruta tiene desnivel fuerte y el regreso a Bogota puede ser exigente para la bateria.",
      },
      {
        question: "Que es lo mas riesgoso de esta ruta?",
        answer:
          "La combinacion de pendiente, cierres posibles y poca flexibilidad si sales con bateria justa.",
      },
      {
        question: "Debo cargar en Villavicencio?",
        answer:
          "Si el regreso queda justo, si viajas con carga o si no saliste al 100%, conviene asegurar carga antes de subir.",
      },
    ],
    shareLine:
      "Compartela con quien cree que al Llano solo se calcula por distancia.",
    keywords: [
      "cargadores via Bogota Villavicencio",
      "Bogota Villavicencio carro electrico",
      "viajar electrico al Llano",
    ],
  },
  {
    path: "/rutas/bogota-medellin-carro-electrico",
    group: "route",
    title: "Bogota a Medellin en carro electrico",
    description:
      "Planea Bogota Medellin en carro electrico: distancia larga, consumo estimado, carga recomendada, riesgos y puntos de carga por corredor.",
    eyebrow: "Ruta Bogota - Medellin",
    h1: "Bogota a Medellin en electrico no se improvisa",
    lead: "Esta es una ruta para planear por tramos. La distancia, las montanas, el trafico pesado y las paradas hacen que la pregunta no sea si el carro es bueno, sino si el plan esta bien armado.",
    heroImage: "/hero-route.png",
    heroAlt: "Ruta Bogota Medellin en carro electrico",
    primaryCta: {
      label: "Calcular esta ruta",
      href: calculatorHref("/rutas/bogota-medellin-carro-electrico"),
    },
    stats: [
      {
        label: "Distancia",
        value: "410-430 km",
        note: "Aproximado segun ruta y puntos de salida/llegada.",
      },
      {
        label: "Desnivel",
        value: "Varias subidas",
        note: "Corredor con montana y cambios de clima.",
      },
      {
        label: "Carga salida",
        value: "100% + paradas",
        note: "Planea al menos una o dos cargas segun modelo.",
      },
    ],
    intro: {
      title: "Divide el viaje antes de dividir la bateria",
      body: "Para Bogota Medellin, pensar solo en autonomia total puede enganar. Lo correcto es revisar tramo por tramo, con zonas de carga y alternativas.",
    },
    sections: [
      {
        eyebrow: "Consumo estimado",
        title: "Una ruta larga exige estrategia, no heroismo",
        body: "El consumo puede variar mucho entre un compacto eficiente y un SUV cargado. La velocidad sostenida y la montana pueden mover el resultado.",
        items: [
          "Consumo total estimado: 85-135 kWh segun carro y condiciones.",
          "Carga recomendada: salir al 100% y planear paradas confirmadas.",
          "No dependas de llegar a Medellin con el ultimo margen.",
        ],
      },
    ],
    charging: {
      title: "Zonas donde revisar carga",
      items: [
        "Bogota antes de salir.",
        "Honda, La Dorada o corredor Magdalena Medio segun ruta elegida.",
        "Doradal, Puerto Triunfo, Rionegro, Medellin y area metropolitana.",
      ],
    },
    risks: [
      "Tramos largos entre opciones de carga.",
      "Subidas, lluvia y trafico pesado.",
      "Cargadores ocupados en temporadas de viaje.",
    ],
    checklistTitle: "Calcula especialmente si",
    checklist: [
      "Tu carro tiene menos de 60 kWh utiles.",
      "Viajas con familia y equipaje.",
      "Quieres hacer el trayecto en un solo dia.",
      "No has usado antes carga rapida en carretera.",
    ],
    faq: [
      {
        question: "Puedo viajar Bogota Medellin en carro electrico?",
        answer:
          "Si, pero requiere planear tramos, cargas y alternativas. No es una ruta para salir sin revisar infraestructura.",
      },
      {
        question: "Cuantas paradas de carga necesito?",
        answer:
          "Depende del carro, bateria y velocidad. Algunos necesitaran una parada; otros dos o mas. Calcula con tu modelo.",
      },
      {
        question: "Que debo confirmar antes de salir?",
        answer:
          "Carga de salida, cargadores por corredor, compatibilidad, horarios, margen por tramo y plan B.",
      },
    ],
    shareLine:
      "Mandasela a quien quiere hacer Bogota Medellin electrico sin partir el viaje en tramos.",
    keywords: [
      "carro electrico Bogota Medellin",
      "Bogota Medellin carro electrico",
      "cargadores Bogota Medellin",
    ],
  },
  {
    path: "/rutas/medellin-eje-cafetero-carro-electrico",
    group: "route",
    title: "Medellin al Eje Cafetero en carro electrico",
    description:
      "Planea Medellin al Eje Cafetero en carro electrico: distancia, montana, consumo, carga recomendada, riesgos y zonas de carga.",
    eyebrow: "Ruta Medellin - Eje Cafetero",
    h1: "Medellin al Eje Cafetero: una ruta bonita que pide margen",
    lead: "Entre Antioquia y el Eje Cafetero hay montana, curvas, clima y destinos posibles. El plan cambia si vas a Manizales, Pereira, Armenia o a un municipio cercano.",
    heroImage: "/lifestyle-charging.png",
    heroAlt: "Ruta Medellin Eje Cafetero en carro electrico",
    primaryCta: {
      label: "Calcular esta ruta",
      href: calculatorHref("/rutas/medellin-eje-cafetero-carro-electrico"),
    },
    stats: [
      {
        label: "Distancia",
        value: "210-280 km",
        note: "Varia segun destino en el Eje Cafetero.",
      },
      {
        label: "Desnivel",
        value: "Montana continua",
        note: "Subidas, descensos y clima variable.",
      },
      {
        label: "Carga salida",
        value: "90-100%",
        note: "Recomendable si no tienes parada confirmada.",
      },
    ],
    intro: {
      title: "No todos los destinos del Eje piden la misma energia",
      body: "Pereira, Manizales y Armenia no son la misma ruta energetica. Antes de salir, calcula con el destino real y revisa el regreso.",
    },
    sections: [
      {
        eyebrow: "Consumo estimado",
        title: "Montana mas clima: ahi aparece la autonomia real",
        body: "Un viaje aparentemente medio puede volverse exigente si hay lluvia, trafico o desvio hacia municipios con subida.",
        items: [
          "Consumo estimado: 55-90 kWh segun destino y carro.",
          "Carga recomendada: salir alto y revisar una zona de parada.",
          "Calcula el regreso si vas a moverte dentro del Eje.",
        ],
      },
    ],
    charging: {
      title: "Zonas donde revisar carga",
      items: [
        "Medellin y sur del Valle de Aburra antes de salir.",
        "La Pintada o corredores intermedios segun ruta.",
        "Manizales, Pereira, Armenia y alrededores segun destino final.",
      ],
    },
    risks: [
      "Lluvia y cambios de temperatura.",
      "Tramos con pendientes sostenidas.",
      "Moverse entre municipios del Eje sin recalcular.",
    ],
    checklistTitle: "Calcula especialmente si",
    checklist: [
      "Vas a un municipio fuera de las capitales.",
      "Planeas moverte varios dias sin carga fija.",
      "Sales con pasajeros y equipaje.",
      "No sabes donde cargar en destino.",
    ],
    faq: [
      {
        question: "Es viable Medellin Eje Cafetero en electrico?",
        answer:
          "Si, pero depende del destino exacto, bateria y carga disponible. Calcula por destino, no como una sola ruta generica.",
      },
      {
        question: "Que destino consume mas?",
        answer:
          "Puede variar por pendientes y ruta elegida. Manizales, Pereira, Armenia y municipios cercanos tienen perfiles diferentes.",
      },
      {
        question: "Debo cargar en el Eje Cafetero?",
        answer:
          "Si vas a moverte varios dias o volver sin pasar por un punto confirmado, conviene asegurar carga en destino.",
      },
    ],
    shareLine:
      "Compartela con quien va al Eje Cafetero y cree que todas las ciudades quedan igual.",
    keywords: [
      "Medellin Eje Cafetero carro electrico",
      "viajar electrico Medellin Pereira",
      "cargadores Eje Cafetero carro electrico",
    ],
  },
  {
    path: "/rutas/cali-popayan-carro-electrico",
    group: "route",
    title: "Cali a Popayan en carro electrico",
    description:
      "Planea Cali Popayan en carro electrico: distancia, subida, consumo estimado, carga recomendada, riesgos y puntos de carga cercanos.",
    eyebrow: "Ruta Cali - Popayan",
    h1: "Cali a Popayan: distancia corta, subida que se siente",
    lead: "La ruta no parece larga, pero Popayan esta mas alto y el consumo puede cambiar si sales con calor, trafico o poco margen.",
    heroImage: "/hero-route.png",
    heroAlt: "Ruta Cali Popayan en carro electrico",
    primaryCta: {
      label: "Calcular esta ruta",
      href: calculatorHref("/rutas/cali-popayan-carro-electrico"),
    },
    stats: [
      {
        label: "Distancia",
        value: "135-150 km",
        note: "Aproximado desde Cali hacia Popayan.",
      },
      {
        label: "Desnivel",
        value: "Subida moderada",
        note: "Popayan esta mas alto que Cali.",
      },
      {
        label: "Carga salida",
        value: "75-90%",
        note: "Mas si no tienes carga asegurada en destino.",
      },
    ],
    intro: {
      title: "No dejes que la distancia te confie de mas",
      body: "Cali Popayan puede parecer facil, pero la subida, el calor y el trafico pueden reducir margen. Calcula antes de salir, sobre todo si regresas el mismo dia.",
    },
    sections: [
      {
        eyebrow: "Consumo estimado",
        title: "La subida se nota mas cuando sales justo",
        body: "Un vehiculo eficiente puede hacer la ruta sin drama, pero si sales con bateria baja o sin carga en destino, el margen importa.",
        items: [
          "Consumo estimado: 28-45 kWh segun modelo y condiciones.",
          "Carga recomendada: salir alto si regresas sin cargar.",
          "Revisa el estado de carga antes de salir de Popayan.",
        ],
      },
    ],
    charging: {
      title: "Zonas donde revisar carga",
      items: [
        "Cali y Jamundi antes de salir.",
        "Santander de Quilichao como zona intermedia a verificar.",
        "Popayan y alrededores antes del regreso.",
      ],
    },
    risks: [
      "Calor al salir de Cali y uso de aire acondicionado.",
      "Trafico y obras en la via.",
      "Regreso sin haber confirmado carga en Popayan.",
    ],
    checklistTitle: "Calcula especialmente si",
    checklist: [
      "Vuelves el mismo dia.",
      "Tu destino no es Popayan centro.",
      "Sales con menos del 70%.",
      "No sabes donde cargar en Popayan.",
    ],
    faq: [
      {
        question: "Se puede ir de Cali a Popayan en carro electrico?",
        answer:
          "Si, pero calcula margen por la subida y confirma carga si necesitas regresar el mismo dia.",
      },
      {
        question: "Cuanto consume Cali Popayan?",
        answer:
          "Depende del carro y condiciones. Como referencia amplia, puede moverse entre 28 y 45 kWh.",
      },
      {
        question: "Debo cargar antes de regresar?",
        answer:
          "Si el margen es bajo o no conoces bien la ruta de regreso, conviene cargar en Popayan o salir con suficiente reserva.",
      },
    ],
    shareLine:
      "Enviasela a quien mira Cali Popayan como si fuera una ruta plana.",
    keywords: [
      "Cali Popayan carro electrico",
      "viajar en electrico Cali Popayan",
      "cargadores Cali Popayan",
    ],
  },
]

export const modelSeoPages: ProgrammaticSeoPage[] = [
  {
    path: "/modelos/byd-yuan-up-autonomia-colombia",
    group: "model",
    title: "BYD Yuan Up autonomia real en Colombia",
    description:
      "Calcula autonomia real del BYD Yuan Up en Colombia: bateria, carretera, montana, consumo esperado y rutas donde conviene revisar margen.",
    eyebrow: "BYD Yuan Up",
    h1: "BYD Yuan Up: no mires solo el rango, calcula tu ruta",
    lead: "El Yuan Up puede ser muy atractivo para ciudad y viajes cercanos, pero la autonomia real cambia cuando sales a carretera, subes montana o llevas el carro cargado.",
    heroImage: "/logos/2b84e07f-fff1-48b5-b739-fb6f680fb312.png",
    heroAlt: "BYD Yuan Up autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi Yuan Up",
      href: calculatorHref("/modelos/byd-yuan-up-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "45 kWh",
        note: "Puede variar por version y mercado.",
      },
      {
        label: "Uso fuerte",
        value: "Ciudad + viajes",
        note: "Buen candidato para calcular salidas de fin de semana.",
      },
      {
        label: "Cuidado",
        value: "Montana",
        note: "El rango baja si viajas rapido o cargado.",
      },
    ],
    intro: {
      title: "La pregunta de compra es si tu ruta le queda comoda",
      body: "Para BYD Yuan Up, la busqueda por autonomia suele venir de alguien que ya lo tiene en lista. Lo importante es probar tus rutas reales: trabajo, casa, carretera y regreso.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "En ciudad puede sentirse amplio; en carretera se calcula",
        body: "La bateria rinde distinto si manejas suave en ciudad o si vas a 100 km/h con aire y pendientes.",
        items: [
          "Calcula rutas como Bogota-Girardot o Cali-Popayan antes de salir.",
          "No uses el rango homologado como margen final.",
          "Sal con mas reserva en puentes y carretera.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Sales de ciudad con menos del 80%.",
      "Vas con pasajeros y equipaje.",
      "No tienes carga en destino.",
      "La ruta tiene subida de regreso.",
    ],
    faq: [
      {
        question: "Cuanta autonomia real tiene el BYD Yuan Up?",
        answer:
          "Con la referencia de Cumbreva de 45.1 kWh y 140 Wh/km, puede rondar 300 km en uso urbano suave, cerca de 260 km en carretera estable y unos 220 km en montana o calor. Calcula con tu porcentaje real antes de salir.",
      },
      {
        question: "Sirve para carretera?",
        answer:
          "Puede servir para muchas rutas, pero conviene planear margen y carga si el trayecto tiene montana o regreso exigente.",
      },
      {
        question: "Que ruta deberia probar primero?",
        answer:
          "Prueba la ruta que mas te preocupa: trabajo largo, viaje de fin de semana o carretera con subida.",
      },
    ],
    shareLine:
      "Compartela con quien esta mirando el Yuan Up y pregunta si le alcanza.",
    keywords: ["BYD Yuan Up autonomia", "BYD Yuan Up Colombia", "autonomia BYD Yuan Up carretera"],
  },
  {
    path: "/modelos/byd-seagull-autonomia-colombia",
    group: "model",
    title: "BYD Seagull autonomia real en Colombia",
    description:
      "Calcula autonomia real del BYD Seagull en Colombia: ciudad, carretera corta, bateria, margen y rutas donde conviene cargar antes.",
    eyebrow: "BYD Seagull",
    h1: "BYD Seagull: perfecto para ciudad, calcula bien la carretera",
    lead: "El Seagull tiene sentido para uso urbano y trayectos diarios, pero si lo llevas a carretera colombiana conviene revisar la ruta antes de confiarse.",
    heroImage: "/logos/2b84e07f-fff1-48b5-b739-fb6f680fb312.png",
    heroAlt: "BYD Seagull autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi Seagull",
      href: calculatorHref("/modelos/byd-seagull-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "30-39 kWh",
        note: "Segun version.",
      },
      {
        label: "Uso fuerte",
        value: "Ciudad",
        note: "Muy atractivo para trayectos diarios.",
      },
      {
        label: "Cuidado",
        value: "Carretera",
        note: "El margen baja rapido si sales justo.",
      },
    ],
    intro: {
      title: "No confundas autonomia urbana con autonomia de viaje",
      body: "Un carro urbano electrico puede sentirse sobrado entre semana y justo en una salida con subida, calor o velocidad sostenida.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "El Seagull pide calcular cuando sales de la rutina",
        body: "Para ciudad, el consumo puede ser amable. Para carretera, el plan debe incluir margen, regreso y carga disponible.",
        items: [
          "Calcula viajes cortos antes de salir con poca bateria.",
          "Evita planear regreso con margen minimo.",
          "Revisa carga en destino si vas fuera de ciudad.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Vas a carretera con bateria media.",
      "Viajas a clima caliente con aire acondicionado.",
      "No sabes si hay cargador en destino.",
      "El regreso incluye subida.",
    ],
    faq: [
      {
        question: "El BYD Seagull sirve para viajar?",
        answer:
          "Si, para rutas cortas o medianas bien planeadas. Con bateria de 38.9 kWh y 125 Wh/km, la referencia prudente cae de unos 320 km urbanos a cerca de 250 km en carretera y 215 km en montana o calor.",
      },
      {
        question: "Por que baja la autonomia en carretera?",
        answer:
          "Por velocidad, aire acondicionado, pendientes y peso. En un carro pequeno, el margen se debe cuidar mas.",
      },
      {
        question: "Cumbreva ayuda con el Seagull?",
        answer:
          "Si. Puedes calcular si tu bateria alcanza para una ruta especifica y decidir si cargas antes.",
      },
    ],
    shareLine:
      "Compartela con quien quiere un Seagull y pregunta por carretera.",
    keywords: ["BYD Seagull autonomia", "BYD Seagull Colombia", "BYD Seagull carretera"],
  },
  {
    path: "/modelos/volvo-ex30-autonomia-colombia",
    group: "model",
    title: "Volvo EX30 autonomia real en Colombia",
    description:
      "Calcula autonomia real del Volvo EX30 en Colombia: versiones, carretera, montana, consumo y carga recomendada antes de viajar.",
    eyebrow: "Volvo EX30",
    h1: "Volvo EX30: potencia y rango, pero la montana tambien cuenta",
    lead: "El EX30 puede tener muy buen desempeno, pero en Colombia la autonomia real se decide en la ruta: velocidad, desnivel, clima y como uses esa potencia.",
    heroImage: "/logos/volvo.svg",
    heroAlt: "Volvo EX30 autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi EX30",
      href: calculatorHref("/modelos/volvo-ex30-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "51-69 kWh",
        note: "Segun version.",
      },
      {
        label: "Uso fuerte",
        value: "Carretera",
        note: "Buen margen si se planea bien.",
      },
      {
        label: "Cuidado",
        value: "Velocidad",
        note: "La potencia invita, pero consume.",
      },
    ],
    intro: {
      title: "Un buen rango no elimina la necesidad de calcular",
      body: "Mientras mas capaz es el carro, mas facil es confiarse. En rutas largas como Bogota-Medellin o Medellin-Eje Cafetero, calcula por tramos.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "El EX30 puede viajar, pero no ignora la fisica",
        body: "Aceleraciones fuertes, velocidad sostenida y montana cambian el consumo. La clave es usar el rango como ventaja, no como excusa para improvisar.",
        items: [
          "Calcula tramos largos con carga recomendada.",
          "Ajusta velocidad si necesitas proteger margen.",
          "Planea carga rapida antes de depender del ultimo porcentaje.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Vas a una ruta de mas de 250 km.",
      "Planeas manejar rapido en carretera.",
      "No conoces puntos de carga del corredor.",
      "Viajas con clima frio o lluvia.",
    ],
    faq: [
      {
        question: "Cuanta autonomia real tiene el Volvo EX30?",
        answer:
          "Con la referencia de Cumbreva de 64 kWh y 165 Wh/km, puede acercarse a 400 km en ciudad suave, 320 km en carretera estable y cerca de 270 km en montana o con manejo exigente. La cifra oficial sirve para comparar, pero la ruta colombiana se decide con margen.",
      },
      {
        question: "El EX30 sirve para viajes largos?",
        answer:
          "Si, especialmente con una planeacion de carga adecuada y calculo por tramos.",
      },
      {
        question: "Que consume mas en el EX30?",
        answer:
          "Velocidad alta, aceleraciones fuertes, montana, clima y peso del vehiculo pueden subir el consumo.",
      },
    ],
    shareLine:
      "Compartela con quien cree que un EX30 no necesita planear carga.",
    keywords: ["Volvo EX30 autonomia", "Volvo EX30 Colombia", "Volvo EX30 carretera"],
  },
  {
    path: "/modelos/kia-ev5-autonomia-colombia",
    group: "model",
    title: "Kia EV5 autonomia real en Colombia",
    description:
      "Calcula autonomia real del Kia EV5 en Colombia: bateria, consumo, carretera, montana, carga recomendada y rutas familiares.",
    eyebrow: "Kia EV5",
    h1: "Kia EV5: espacio para viajar, autonomia para calcular",
    lead: "Un SUV electrico familiar puede ser ideal para viajes, pero tambien carga pasajeros, equipaje y expectativas. Antes de salir, revisa si llegas con margen.",
    heroImage: "/logos/kia.svg",
    heroAlt: "Kia EV5 autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi EV5",
      href: calculatorHref("/modelos/kia-ev5-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "64-88 kWh",
        note: "Segun version.",
      },
      {
        label: "Uso fuerte",
        value: "Familiar",
        note: "Viajes con pasajeros y equipaje.",
      },
      {
        label: "Cuidado",
        value: "Peso",
        note: "Carga y velocidad suben consumo.",
      },
    ],
    intro: {
      title: "La autonomia familiar se calcula con el carro lleno",
      body: "No es lo mismo probar solo que viajar con familia, maletas, aire y carretera. El EV5 debe calcularse en el escenario real.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "El rango debe cubrir el viaje completo, no solo la ida",
        body: "Para rutas de descanso, calcula ida, movimientos en destino y regreso. La comodidad esta en no depender de una sola carga.",
        items: [
          "Calcula con pasajeros y equipaje en mente.",
          "Planea carga si vas a fincas, hoteles o municipios sin punto claro.",
          "Evita regresar con margen critico.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Viajas con familia completa.",
      "Llevas baul cargado.",
      "El destino no garantiza carga.",
      "La ruta tiene montana o clima exigente.",
    ],
    faq: [
      {
        question: "El Kia EV5 tiene buena autonomia?",
        answer:
          "Si, especialmente para uso familiar y carretera planeada. Con la referencia de Cumbreva de 64.2 kWh y 168 Wh/km, estima unos 400 km urbanos, 313 km en carretera y 264 km en montana/calor. Si va lleno de pasajeros y equipaje, calcula con mas reserva.",
      },
      {
        question: "Sirve para viajes familiares?",
        answer:
          "Si, pero conviene calcular con el carro cargado y con paradas de carga claras si la ruta es larga.",
      },
      {
        question: "Que rutas debo probar?",
        answer:
          "Prueba las rutas familiares frecuentes: fin de semana, vacaciones, carretera con subida y regreso el mismo dia.",
      },
    ],
    shareLine:
      "Compartela con quien esta mirando un EV5 para viajar en familia.",
    keywords: ["Kia EV5 autonomia", "Kia EV5 Colombia", "Kia EV5 carro electrico"],
  },
  {
    path: "/modelos/mg4-autonomia-colombia",
    group: "model",
    title: "MG4 autonomia real en Colombia",
    description:
      "Calcula autonomia real del MG4 en Colombia: bateria, consumo, carretera, ciudad, montana y carga recomendada por ruta.",
    eyebrow: "MG4",
    h1: "MG4: autonomia atractiva, margen real por calcular",
    lead: "El MG4 combina precio, desempeno y autonomia interesante. Pero como todo electrico, la cifra que importa es la de tu ruta real.",
    heroImage: "/logos/mg.svg",
    heroAlt: "MG4 autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi MG4",
      href: calculatorHref("/modelos/mg4-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "51-64 kWh",
        note: "Segun version.",
      },
      {
        label: "Uso fuerte",
        value: "Mixto",
        note: "Ciudad y viajes cercanos.",
      },
      {
        label: "Cuidado",
        value: "Ritmo",
        note: "Velocidad alta reduce margen.",
      },
    ],
    intro: {
      title: "El MG4 se entiende mejor con rutas reales",
      body: "Para saber si te sirve, no basta mirar la ficha: calcula tu trabajo, tus fines de semana y tus viajes con desnivel.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "Un hatch electrico cambia mucho entre ciudad y carretera",
        body: "En ciudad puedes recuperar energia y consumir menos. En carretera, la velocidad sostenida se vuelve protagonista.",
        items: [
          "Calcula salidas de mas de 150 km.",
          "Revisa carga si vas a tierra caliente y vuelves subiendo.",
          "Usa margen extra si no conoces el punto de carga.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Sales de ciudad con bateria media.",
      "Vas por carretera rapida.",
      "No tienes carga en destino.",
      "Quieres comparar versiones por autonomia.",
    ],
    faq: [
      {
        question: "Cuanta autonomia real tiene el MG4?",
        answer:
          "Con la referencia de Cumbreva de 51 kWh y 160 Wh/km, puede rondar 335 km en ciudad, 261 km en carretera y 220 km en montana o calor. Versiones con bateria menor deben calcularse con mas cuidado.",
      },
      {
        question: "El MG4 sirve para carretera?",
        answer:
          "Si puede servir, pero conviene calcular margen y carga para rutas largas o con subida.",
      },
      {
        question: "Que version me conviene?",
        answer:
          "Depende de tus rutas. Si viajas seguido, prioriza bateria y carga; si haces ciudad, puede bastar una version menor.",
      },
    ],
    shareLine:
      "Compartela con quien esta comparando MG4 por autonomia.",
    keywords: ["MG4 autonomia", "MG4 Colombia", "MG4 carro electrico autonomia"],
  },
  {
    path: "/modelos/tesla-model-y-autonomia-colombia",
    group: "model",
    title: "Tesla Model Y autonomia real en Colombia",
    description:
      "Calcula autonomia real del Tesla Model Y en Colombia: carretera, montana, consumo, carga recomendada y rutas largas.",
    eyebrow: "Tesla Model Y",
    h1: "Tesla Model Y: mucho rango, pero igual conviene calcular",
    lead: "El Model Y puede hacer viajes largos con buena planeacion, pero Colombia no es plana y la red de carga no siempre se comporta como en otros mercados.",
    heroImage: "/logos/tesla.svg",
    heroAlt: "Tesla Model Y autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi Model Y",
      href: calculatorHref("/modelos/tesla-model-y-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "60-80 kWh",
        note: "Segun version.",
      },
      {
        label: "Uso fuerte",
        value: "Viajes largos",
        note: "Buen rango si hay carga planeada.",
      },
      {
        label: "Cuidado",
        value: "Red local",
        note: "Verifica conectores y puntos disponibles.",
      },
    ],
    intro: {
      title: "No importes habitos de carga de otro pais sin revisar Colombia",
      body: "El Model Y tiene ventajas, pero la experiencia depende de la infraestructura disponible, conectores, potencia y rutas locales.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "El rango ayuda, pero no reemplaza el plan",
        body: "Para rutas como Bogota-Medellin, lo importante es dividir en tramos y no asumir que siempre habra carga rapida ideal.",
        items: [
          "Calcula con tu version y porcentaje real.",
          "Verifica compatibilidad de carga antes del viaje.",
          "Planea alternativas si dependes de un punto especifico.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Planeas carretera larga.",
      "Vas a usar cargadores desconocidos.",
      "Viajas a zonas con poca infraestructura.",
      "Quieres estimar paradas antes de salir.",
    ],
    faq: [
      {
        question: "Cuanta autonomia real tiene un Tesla Model Y?",
        answer:
          "Usando como referencia el Model Y Long Range de 75 kWh y 158 Wh/km, Cumbreva estima cerca de 500 km urbanos, 389 km en carretera y 327 km en montana o calor. La version RWD o llantas distintas pueden cambiar bastante el margen.",
      },
      {
        question: "El Model Y sirve para viajar por Colombia?",
        answer:
          "Puede servir muy bien, pero hay que revisar infraestructura y conectores por corredor.",
      },
      {
        question: "Necesito calcular si tiene mucho rango?",
        answer:
          "Si. Mucho rango reduce ansiedad, pero no elimina pendientes, desvio, clima ni disponibilidad de carga.",
      },
    ],
    shareLine:
      "Compartela con quien cree que por ser Tesla no necesita planear.",
    keywords: ["Tesla Model Y autonomia", "Tesla Model Y Colombia", "Tesla Model Y carretera Colombia"],
  },
  {
    path: "/modelos/renault-kwid-e-tech-autonomia-colombia",
    group: "model",
    title: "Renault Kwid E-Tech autonomia real en Colombia",
    description:
      "Calcula autonomia real del Renault Kwid E-Tech en Colombia: ciudad, carretera corta, consumo, bateria y margen recomendado.",
    eyebrow: "Renault Kwid E-Tech",
    h1: "Kwid E-Tech: urbano, economico y mejor cuando calculas la salida",
    lead: "El Kwid E-Tech tiene mucho sentido para ciudad. Para carretera o trayectos fuera de la rutina, la clave es no pedirle una autonomia que no corresponde al plan.",
    heroImage: "/logos/renault.svg",
    heroAlt: "Renault Kwid E-Tech autonomia Colombia",
    primaryCta: {
      label: "Calcular con mi Kwid",
      href: calculatorHref("/modelos/renault-kwid-e-tech-autonomia-colombia"),
    },
    stats: [
      {
        label: "Bateria aprox.",
        value: "27 kWh",
        note: "Enfoque principalmente urbano.",
      },
      {
        label: "Uso fuerte",
        value: "Ciudad",
        note: "Trayectos diarios y carga en casa.",
      },
      {
        label: "Cuidado",
        value: "Rutas largas",
        note: "Calcula antes de salir de ciudad.",
      },
    ],
    intro: {
      title: "El Kwid electrico se disfruta mas cuando no lo fuerzas",
      body: "Como carro urbano, puede ser muy practico. Para viajes, debes mirar distancia, carga disponible y regreso con mas cuidado.",
    },
    sections: [
      {
        eyebrow: "Autonomia real",
        title: "La ciudad es su zona comoda; la carretera pide plan",
        body: "Su bateria pequena hace que cada decision pese mas: velocidad, aire, subida, pasajeros y carga en destino.",
        items: [
          "Calcula cualquier salida fuera de ciudad.",
          "Evita viajar con bateria media sin punto confirmado.",
          "Planea regreso antes de salir.",
        ],
      },
    ],
    checklistTitle: "Calcula antes si",
    checklist: [
      "Sales de la ciudad.",
      "La ruta supera tu autonomia comoda.",
      "No tienes carga en destino.",
      "Vas a subir de tierra caliente a ciudad alta.",
    ],
    faq: [
      {
        question: "El Renault Kwid E-Tech sirve para carretera?",
        answer:
          "Puede servir en trayectos cortos y bien planeados, pero su enfoque es urbano y el margen debe cuidarse.",
      },
      {
        question: "Cuanta autonomia real tiene?",
        answer:
          "Con la referencia de Cumbreva de 26.8 kWh y 130 Wh/km, puede rondar 217 km en ciudad suave, 169 km en carretera estable y 142 km en montana o calor. Por eso conviene tratarlo como urbano y calcular cualquier salida de ciudad.",
      },
      {
        question: "Que debo calcular primero?",
        answer:
          "Calcula la ruta fuera de ciudad que mas te preocupa y confirma si hay carga antes del regreso.",
      },
    ],
    shareLine:
      "Compartela con quien quiere Kwid electrico y piensa salir de ciudad.",
    keywords: ["Renault Kwid E-Tech autonomia", "Kwid electrico Colombia", "Renault Kwid E-Tech carretera"],
  },
]

export const programmaticSeoPages = [
  ...rootSeoPages,
  ...routeSeoPages,
  ...modelSeoPages,
]

export const programmaticSeoPageByPath = new Map(
  programmaticSeoPages.map((page) => [page.path, page]),
)

export function absoluteProgrammaticUrl(path: string) {
  return `${SITE_URL}${path}`
}

export function rootSlug(path: string) {
  return path.replace(/^\//, "")
}

export function segmentSlug(path: string) {
  return path.split("/").filter(Boolean).at(-1) ?? ""
}
