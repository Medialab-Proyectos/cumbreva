import { SITE_URL } from "@/lib/site"

export type SeoLanding = {
  slug: string
  funnel: string
  audience: string
  title: string
  metaDescription: string
  h1: string
  lead: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  heroImage: string
  heroAlt: string
  proof: string[]
  intent: string
  painPoints: string[]
  sections: Array<{
    eyebrow: string
    title: string
    body: string
    items: string[]
  }>
  checklistTitle: string
  checklist: string[]
  shareLine: string
  faq: Array<{
    question: string
    answer: string
  }>
}

const utm = (slug: string) =>
  `utm_source=seo_landing&utm_medium=organic&utm_campaign=${slug}`

const waitlistHref = (slug: string) => `/?${utm(slug)}#lista-espera`
const calculatorHref = (slug: string) => `/calculadora?${utm(slug)}`
const storeHref = (slug: string) => `/tienda?${utm(slug)}`

export const seoLandings: SeoLanding[] = [
  {
    slug: "calculadora-autonomia-carro-electrico-colombia",
    funnel: "Antes de salir",
    audience:
      "Para quien ya tiene una ruta en mente y necesita una respuesta sin vueltas: si llega, si debe cargar o si conviene cambiar el plan.",
    title: "Calculadora de autonomia para carro electrico en Colombia",
    metaDescription:
      "Calcula si la bateria de tu carro electrico alcanza para una ruta en Colombia. Estima autonomia, margen de llegada y necesidad de carga antes de salir.",
    h1: "Antes de salir, confirma si la bateria te alcanza",
    lead: "Hay viajes que se deciden con una pregunta sencilla: con la bateria que tengo, llego tranquilo o me estoy confiando? Cumbreva te ayuda a convertir esa duda en una decision clara antes de prender el carro.",
    primaryCta: {
      label: "Calcular mi ruta",
      href: calculatorHref("calculadora-autonomia-carro-electrico-colombia"),
    },
    secondaryCta: {
      label: "Recibir acceso",
      href: waitlistHref("calculadora-autonomia-carro-electrico-colombia"),
    },
    heroImage: "/hero-route.png",
    heroAlt: "Ruta electrica en Colombia calculada con Cumbreva",
    proof: ["Autonomia real", "Margen de llegada", "Decision clara"],
    intent:
      "Para esos momentos en los que el tablero dice una cosa, la ruta dice otra y uno necesita salir con calma.",
    painPoints: [
      "El carro marca autonomia, pero no siempre se siente real para esa ruta.",
      "Da rabia salir confiado y terminar buscando cargador con afan.",
      "En carretera, un 20% de bateria no se siente igual que en ciudad.",
    ],
    sections: [
      {
        eyebrow: "La duda real",
        title: "No quieres teoria, quieres saber si llegas",
        body: "Cuando alguien busca autonomia no esta buscando una clase de baterias. Quiere saber si puede hacer su trayecto sin quedar mirando el porcentaje cada cinco minutos.",
        items: [
          "Pon tu bateria actual y calcula con una ruta concreta.",
          "Revisa el margen antes de salir, no cuando ya estas en camino.",
          "Toma la decision: salir, cargar primero o ajustar el trayecto.",
        ],
      },
      {
        eyebrow: "Con margen",
        title: "La autonomia oficial no maneja por ti",
        body: "La vida real tiene subidas, trafico, aire acondicionado, pasajeros, velocidad y dias en los que uno maneja distinto. Por eso la respuesta importante no es solo cuantos kilometros faltan, sino con cuanto margen llegas.",
        items: [
          "Piensa la bateria como margen de seguridad, no como promesa exacta.",
          "Si la ruta es nueva, planea con mas reserva.",
          "Comparte el calculo con quien viaja contigo para decidir juntos.",
        ],
      },
    ],
    checklistTitle: "Cuando te sirve mas",
    checklist: [
      "Antes de un viaje entre ciudades.",
      "Cuando vas a una zona donde no conoces cargadores.",
      "Si el carro muestra autonomia pero no sabes si confiar.",
      "Cuando quieres decidir rapido si cargas antes de salir.",
    ],
    shareLine:
      "Mandasela a esa persona que siempre pregunta: con esa bateria si llego?",
    faq: [
      {
        question: "Como saber si la bateria me alcanza para una ruta?",
        answer:
          "Lo mas practico es mirar bateria actual, distancia, consumo esperado y margen de llegada. Cumbreva junta esas variables para que no tengas que decidir solo con intuicion.",
      },
      {
        question: "Por que cambia tanto la autonomia real?",
        answer:
          "Porque no manejas en laboratorio. La velocidad, las subidas, el clima, el peso del carro y tu forma de conducir pueden cambiar el consumo.",
      },
      {
        question: "Con cuanto porcentaje deberia llegar?",
        answer:
          "Depende de la ruta, pero para viajes nuevos o carretera conviene llegar con reserva. Si el margen es muy justo, es mejor cargar antes.",
      },
    ],
  },
  {
    slug: "planificador-rutas-carros-electricos-colombia",
    funnel: "Planeacion",
    audience:
      "Para conductores que quieren viajar electrico sin improvisar paradas, cargadores y margen de bateria.",
    title: "Planificador de rutas para carros electricos en Colombia",
    metaDescription:
      "Planea rutas para carro electrico en Colombia con bateria, autonomia y puntos de carga como variables principales antes de salir.",
    h1: "Viajar en electrico se disfruta mas cuando la ruta esta pensada",
    lead: "No es solo poner el destino en el mapa. En un carro electrico tambien importa donde puedes cargar, con cuanto llegas y que haces si una parada no te conviene.",
    primaryCta: {
      label: "Planear una ruta",
      href: calculatorHref("planificador-rutas-carros-electricos-colombia"),
    },
    secondaryCta: {
      label: "Recibir acceso",
      href: waitlistHref("planificador-rutas-carros-electricos-colombia"),
    },
    heroImage: "/lifestyle-charging.png",
    heroAlt: "Conductor planeando una ruta para carro electrico",
    proof: ["Ruta", "Carga", "Margen"],
    intent:
      "Para convertir un viaje que da nervios en una ruta con paradas y decisiones mas claras.",
    painPoints: [
      "El mapa te dice por donde ir, pero no si la energia alcanza.",
      "Una parada de carga mal elegida puede volverse media tarde perdida.",
      "Viajar con otros es mas facil cuando todos entienden el plan.",
    ],
    sections: [
      {
        eyebrow: "Ruta electrica",
        title: "El destino no es lo unico que importa",
        body: "En un electrico, la mejor ruta no siempre es la mas corta. A veces es la que te deja llegar con bateria, con una parada razonable y sin depender de la suerte.",
        items: [
          "Calcula con el porcentaje que tienes ahora.",
          "Piensa en la siguiente carga antes de que sea urgente.",
          "Evita rutas que se ven bien en distancia pero mal en energia.",
        ],
      },
      {
        eyebrow: "Viaje tranquilo",
        title: "La planeacion baja la ansiedad del camino",
        body: "Cuando ya sabes que hacer si el margen baja, manejas diferente. No vas pegado al porcentaje; vas siguiendo una decision tomada con calma.",
        items: [
          "Define si debes cargar antes, durante o despues del trayecto.",
          "Guarda las rutas que repites para aprender de tus propios viajes.",
          "Comparte el plan antes de salir, especialmente en viajes largos.",
        ],
      },
    ],
    checklistTitle: "Ideal para planear",
    checklist: [
      "Viajes de fin de semana.",
      "Rutas entre ciudades colombianas.",
      "Trayectos donde no conoces bien la infraestructura.",
      "Salidas familiares donde todos quieren certeza.",
    ],
    shareLine:
      "Enviala antes del viaje para que la ruta electrica no se decida a ultima hora.",
    faq: [
      {
        question: "Como se planea una ruta en carro electrico?",
        answer:
          "Primero mira bateria, distancia y margen. Despues revisa donde podrias cargar si el margen no es suficiente. La ruta se planea con energia, no solo con kilometros.",
      },
      {
        question: "El planificador reemplaza Google Maps o Waze?",
        answer:
          "No. Los complementa. El mapa tradicional te ayuda con calles y trafico; Cumbreva se enfoca en la pregunta electrica: llegas con bateria suficiente?",
      },
      {
        question: "Sirve para viajes cortos?",
        answer:
          "Si. En ciudad tambien ayuda cuando tienes varias vueltas, poca bateria o no quieres cerrar el dia buscando donde cargar.",
      },
    ],
  },
  {
    slug: "cuanto-cuesta-cargar-carro-electrico-colombia",
    funnel: "Compra informada",
    audience:
      "Para quien esta pensando pasarse a electrico y quiere entender el gasto sin perderse entre kWh, tarifas y comparaciones raras.",
    title: "Cuanto cuesta cargar un carro electrico en Colombia",
    metaDescription:
      "Entiende como estimar el costo de cargar un carro electrico en Colombia y que variables afectan el gasto real por ruta o por mes.",
    h1: "El costo de cargar no deberia ser un misterio",
    lead: "Si vienes de la gasolina, el cambio de mentalidad cuesta. Ya no piensas en galones: piensas en energia, habitos, rutas y en donde cargas. Cumbreva te ayuda a aterrizar esa cuenta a tu vida real.",
    primaryCta: {
      label: "Entender mi uso",
      href: waitlistHref("cuanto-cuesta-cargar-carro-electrico-colombia"),
    },
    secondaryCta: {
      label: "Calcular una ruta",
      href: calculatorHref("cuanto-cuesta-cargar-carro-electrico-colombia"),
    },
    heroImage: "/cumbreva-app-mockup.png",
    heroAlt: "Aplicacion Cumbreva para estimar uso de carro electrico",
    proof: ["Energia", "Ruta", "Ahorro"],
    intent:
      "Para compradores que quieren saber si el ahorro se siente en la vida diaria, no solo en una tabla.",
    painPoints: [
      "El kWh suena tecnico hasta que lo conviertes en una ruta real.",
      "Cargar en casa y cargar por fuera no se sienten igual en el bolsillo.",
      "La comparacion con gasolina cambia segun como uses el carro.",
    ],
    sections: [
      {
        eyebrow: "Cuenta real",
        title: "No compras kWh: compras tranquilidad para moverte",
        body: "La pregunta no es solo cuanto cuesta llenar la bateria. La pregunta que importa es cuanto te cuesta hacer tus trayectos de siempre y que tan facil es mantener ese habito.",
        items: [
          "Calcula costo por ruta, no solo por carga completa.",
          "Ten en cuenta donde cargas: casa, trabajo o punto publico.",
          "Compara con tus trayectos reales, no con promedios perfectos.",
        ],
      },
      {
        eyebrow: "Decision",
        title: "El ahorro se entiende mejor cuando se baja al dia a dia",
        body: "Un electrico puede tener mucho sentido si tus rutas, acceso a carga y habitos encajan. Por eso conviene mirar el uso semanal y no solo el precio del vehiculo.",
        items: [
          "Mira cuantas veces cargas al mes.",
          "Identifica si puedes cargar cuando el carro esta quieto.",
          "Usa Cumbreva para conectar costo, autonomia y ruta.",
        ],
      },
    ],
    checklistTitle: "Preguntas que aterriza",
    checklist: [
      "Cuanto me cuesta moverme una semana normal.",
      "Que pasa si no puedo cargar siempre en casa.",
      "Como cambia el costo por ruta larga.",
      "Cuando el ahorro compensa el cambio de habito.",
    ],
    shareLine:
      "Compartela con quien esta haciendo cuentas para comprar su primer electrico.",
    faq: [
      {
        question: "Como calculo el costo de cargar un carro electrico?",
        answer:
          "Multiplica la energia que necesitas por la tarifa del lugar donde cargas. Para hacerlo mas util, calcula por trayecto o por semana, no solo por bateria llena.",
      },
      {
        question: "Siempre es mas barato cargar en casa?",
        answer:
          "Muchas veces si, pero depende de tu tarifa, horario, cargador y del acceso que tengas. Si dependes de carga publica, la cuenta puede cambiar.",
      },
      {
        question: "Por que Cumbreva habla de rutas si estoy mirando costos?",
        answer:
          "Porque el costo real aparece cuando cruzas energia con tus rutas. No todos manejan igual ni cargan en los mismos lugares.",
      },
    ],
  },
  {
    slug: "puntos-carga-carros-electricos-colombia",
    funnel: "Carga",
    audience:
      "Para quien necesita cargar sin improvisar y quiere saber que punto le sirve de verdad segun su ruta.",
    title: "Puntos de carga para carros electricos en Colombia",
    metaDescription:
      "Encuentra como pensar los puntos de carga para carros electricos en Colombia: cercania, compatibilidad, disponibilidad y ruta.",
    h1: "El mejor punto de carga no siempre es el mas cercano",
    lead: "Cuando la bateria baja, uno no busca un punto en abstracto: busca el punto que sirve para su carro, su ruta, su tiempo y el margen con el que quiere llegar.",
    primaryCta: {
      label: "Ver mi ruta electrica",
      href: calculatorHref("puntos-carga-carros-electricos-colombia"),
    },
    secondaryCta: {
      label: "Entrar a la lista",
      href: waitlistHref("puntos-carga-carros-electricos-colombia"),
    },
    heroImage: "/hero-person.png",
    heroAlt: "Persona revisando puntos de carga para carro electrico",
    proof: ["Cercania", "Compatibilidad", "Margen"],
    intent:
      "Para dejar de mirar puntos sueltos y empezar a decidir donde cargar segun el viaje.",
    painPoints: [
      "Un cargador cerca puede no quedar bien para tu trayecto.",
      "No todos los puntos tienen la misma potencia, conector o disponibilidad.",
      "La peor carga es la que buscas cuando ya estas en rojo.",
    ],
    sections: [
      {
        eyebrow: "Carga con contexto",
        title: "No busques cargadores: busca opciones que te sirvan",
        body: "La diferencia esta en cruzar punto de carga, bateria, destino y desvio. Asi puedes decidir si parar ahora, seguir o cambiar el plan.",
        items: [
          "Mira los puntos con relacion a tu ruta, no como una lista suelta.",
          "Evalua si el desvio vale la pena.",
          "Planea una alternativa antes de quedarte sin margen.",
        ],
      },
      {
        eyebrow: "Sin afan",
        title: "Cargar con tiempo cambia toda la experiencia",
        body: "Cuando esperas al ultimo porcentaje, cualquier punto parece urgente. Cuando planeas antes, puedes elegir mejor y evitar decisiones incomodas.",
        items: [
          "Carga antes de entrar en zona critica.",
          "Ten claro si necesitas carga rapida o solo completar margen.",
          "Comparte la ruta si viajas con alguien que tambien necesita estar tranquilo.",
        ],
      },
    ],
    checklistTitle: "Antes de elegir un punto",
    checklist: [
      "Revisa si queda sobre la ruta o te obliga a desviarte mucho.",
      "Confirma que el margen de bateria te permite llegar.",
      "Piensa si ese punto te deja seguir el viaje o solo salir del apuro.",
      "Calcula antes de depender de una sola opcion.",
    ],
    shareLine:
      "Mandasela a quien cree que cargar es solo buscar el punto mas cercano.",
    faq: [
      {
        question: "Como elegir un punto de carga?",
        answer:
          "Elige segun ruta, bateria disponible, desvio, compatibilidad y tiempo. El punto mas cercano no siempre es el que mejor resuelve el viaje.",
      },
      {
        question: "Todos los cargadores sirven para todos los carros?",
        answer:
          "No siempre. Depende del conector, la potencia y las condiciones del punto. Por eso conviene revisar antes de llegar.",
      },
      {
        question: "Cuando deberia buscar donde cargar?",
        answer:
          "Antes de que sea urgente. Si ya estas muy bajo de bateria, pierdes margen para escoger y cualquier imprevisto pesa mas.",
      },
    ],
  },
  {
    slug: "app-conductores-carros-electricos",
    funnel: "Comunidad",
    audience:
      "Para conductores que quieren una app que entienda sus rutas, su bateria y sus decisiones de carga en Colombia.",
    title: "Cumbreva para conductores de carros electricos en Colombia",
    metaDescription:
      "Cumbreva ayuda a conductores de carros electricos en Colombia a calcular si llegan antes de salir, planear carga y recordar rutas.",
    h1: "Un copiloto para manejar electrico sin sentir que improvisas",
    lead: "Cumbreva nace para esa vida real del carro electrico: revisar bateria antes de salir, calcular si llegas, recordar rutas, aprender de cada viaje y compartir informacion que le sirva a otros.",
    primaryCta: {
      label: "Unirme a la lista",
      href: waitlistHref("app-conductores-carros-electricos"),
    },
    secondaryCta: {
      label: "Probar calculadora",
      href: calculatorHref("app-conductores-carros-electricos"),
    },
    heroImage: "/cumbreva-devices.png",
    heroAlt: "Cumbreva en celular calculando autonomia para carro electrico",
    proof: ["Autonomia", "Historial", "Comunidad"],
    intent:
      "Para quienes ya manejan electrico o estan a punto de hacerlo y quieren una herramienta hecha para su rutina.",
    painPoints: [
      "Una herramienta muestra el mapa, otra el carro, otra el cargador: ninguna junta la decision.",
      "La experiencia de una ruta se pierde si no queda guardada.",
      "La movilidad electrica en Colombia necesita informacion compartida y util.",
    ],
    sections: [
      {
        eyebrow: "Copiloto electrico",
        title: "Cumbreva junta lo que hoy decides por pedazos",
        body: "La idea es simple: que no tengas que saltar entre porcentajes, mapas, recuerdos y chats para decidir si sales, cargas o cambias la ruta.",
        items: [
          "Calcula autonomia con una ruta real.",
          "Guarda historial y comentarios de tus trayectos.",
          "Recibe una experiencia pensada para Colombia.",
        ],
      },
      {
        eyebrow: "Aprendizaje",
        title: "Cada ruta puede ayudar a la siguiente",
        body: "Si recuerdas que una ruta fue justa, que una parada sirvio o que conviene cargar antes, tu proximo viaje mejora. Y si compartes esa experiencia, tambien ayudas a otros conductores.",
        items: [
          "Agrega comentarios a tus rutas.",
          "Identifica patrones de consumo y margen.",
          "Se parte de una comunidad que aprende manejando.",
        ],
      },
    ],
    checklistTitle: "Lo que Cumbreva quiere resolver",
    checklist: [
      "Menos ansiedad antes de salir.",
      "Mejores decisiones cuando la bateria esta justa.",
      "Memoria de rutas para no repetir errores.",
      "Una comunidad electrica con informacion practica.",
    ],
    shareLine:
      "Compartela con alguien que ya maneja electrico o esta pensando dar el salto.",
    faq: [
      {
        question: "Para que sirve una app de carro electrico?",
        answer:
          "Para tomar mejores decisiones sobre autonomia, rutas, carga e historial. La idea es que el conductor tenga contexto antes de moverse.",
      },
      {
        question: "Cumbreva esta pensada para Colombia?",
        answer:
          "Si. La propuesta nace desde las dudas reales de manejar electrico en Colombia: infraestructura desigual, viajes con margen y necesidad de informacion local.",
      },
      {
        question: "Puedo entrar antes del lanzamiento?",
        answer:
          "Si. Puedes unirte a la lista de espera para recibir novedades y acceso cuando Cumbreva este disponible.",
      },
    ],
  },
  {
    slug: "tienda-cumbreva",
    funnel: "Pertenencia",
    audience:
      "Para usuarios tempranos, fans de la movilidad electrica y personas que quieren regalar algo con identidad Cumbreva.",
    title: "Tienda Cumbreva para amantes de los carros electricos",
    metaDescription:
      "Explora productos Cumbreva para la comunidad electrica: camisetas, busos, tazas y objetos de marca para quienes viven la movilidad electrica.",
    h1: "Lleva la energia de Cumbreva tambien fuera del carro",
    lead: "Hay marcas que uno usa porque le gustan, y otras porque representan una forma de moverse. La tienda Cumbreva es para quienes sienten que la movilidad electrica tambien es identidad.",
    primaryCta: {
      label: "Ver tienda",
      href: storeHref("tienda-cumbreva"),
    },
    secondaryCta: {
      label: "Conocer la app",
      href: waitlistHref("tienda-cumbreva"),
    },
    heroImage: "/tienda/camiseta%20(1).png",
    heroAlt: "Producto de la tienda Cumbreva",
    proof: ["Camisetas", "Busos", "Tazas"],
    intent:
      "Para convertir afinidad en comunidad: productos simples, visibles y faciles de compartir.",
    painPoints: [
      "Quieres regalar algo distinto a alguien que ama los carros electricos.",
      "Te gusta la marca y quieres llevarla sin que parezca publicidad pesada.",
      "Quieres sentirte parte de una comunidad que apenas esta creciendo.",
    ],
    sections: [
      {
        eyebrow: "Comunidad visible",
        title: "Un producto tambien puede abrir conversacion",
        body: "Una camiseta, una taza o un buso pueden ser una forma sencilla de decir: me interesa esta nueva forma de moverme y quiero que crezca.",
        items: [
          "Productos con presencia clara de Cumbreva.",
          "Fotos reales para elegir sin imaginar demasiado.",
          "Una entrada suave para conocer la app y la comunidad.",
        ],
      },
      {
        eyebrow: "Regalo electrico",
        title: "Para quien ya habla de bateria, rutas y cargadores",
        body: "Si alguien en tu vida ya compara autonomia, pregunta por puntos de carga o celebra cada nuevo electrico en la calle, esta tienda le va a hacer sentido.",
        items: [
          "Regalos para usuarios y curiosos electricos.",
          "Objetos cotidianos con identidad de marca.",
          "Un puente hacia la lista de espera de Cumbreva.",
        ],
      },
    ],
    checklistTitle: "Para quien es",
    checklist: [
      "Usuarios tempranos de Cumbreva.",
      "Conductores o futuros conductores electricos.",
      "Regalos para fans de tecnologia y movilidad.",
      "Personas que quieren apoyar el proyecto desde el inicio.",
    ],
    shareLine:
      "Compartela con quien habla de carros electricos hasta en el cafe.",
    faq: [
      {
        question: "Que productos hay en la tienda Cumbreva?",
        answer:
          "La tienda incluye productos de marca como camisetas, busos, tazas y objetos pensados para la comunidad electrica.",
      },
      {
        question: "La tienda es parte del ecosistema Cumbreva?",
        answer:
          "Si. La tienda ayuda a que la comunidad sea visible mientras la app crece como herramienta para conductores electricos.",
      },
      {
        question: "Puedo compartir productos de Cumbreva?",
        answer:
          "Si. La tienda esta pensada para descubrir, compartir y llevar la marca de forma sencilla.",
      },
    ],
  },
  {
    slug: "guia-carros-electricos-colombia",
    funnel: "Primer acercamiento",
    audience:
      "Para quien esta empezando a mirar carros electricos y necesita entender autonomia, carga y costos sin sentirse perdido.",
    title: "Guia de carros electricos en Colombia para nuevos usuarios",
    metaDescription:
      "Guia simple para entender carros electricos en Colombia: autonomia, carga, rutas, costos, habitos y como empezar con menos incertidumbre.",
    h1: "Si estas pensando en un electrico, empieza por las preguntas correctas",
    lead: "Antes de elegir marca o modelo, necesitas entender como vas a cargar, cuanto recorres, que rutas haces y que tan tranquilo quieres sentirte con la bateria.",
    primaryCta: {
      label: "Empezar con Cumbreva",
      href: waitlistHref("guia-carros-electricos-colombia"),
    },
    secondaryCta: {
      label: "Calcular autonomia",
      href: calculatorHref("guia-carros-electricos-colombia"),
    },
    heroImage: "/waitlist-couple.png",
    heroAlt: "Nuevos usuarios aprendiendo sobre carros electricos",
    proof: ["Autonomia", "Carga", "Costo"],
    intent:
      "Para bajar la barrera de entrada: menos tecnicismos, mas decisiones practicas.",
    painPoints: [
      "Todos hablan de autonomia, pero nadie la explica con tu rutina.",
      "La carga parece facil hasta que preguntas donde, cuando y cuanto demora.",
      "Comprar electrico da emocion, pero tambien muchas dudas nuevas.",
    ],
    sections: [
      {
        eyebrow: "Lo basico",
        title: "Un carro electrico se entiende desde tu vida diaria",
        body: "No empieces por la ficha tecnica. Empieza por tus trayectos, tu parqueadero, tus viajes y tu tolerancia a planear un poco mas.",
        items: [
          "Mira cuantos kilometros haces en una semana normal.",
          "Identifica donde podrias cargar sin cambiar demasiado tu rutina.",
          "Aprende que autonomia real no es lo mismo que autonomia anunciada.",
        ],
      },
      {
        eyebrow: "Siguiente paso",
        title: "Cuando entiendes tus rutas, la decision se vuelve mas clara",
        body: "La pregunta no es si un electrico sirve en abstracto. La pregunta es si sirve para tu forma de moverte. Cumbreva te ayuda a probar esa idea con rutas reales.",
        items: [
          "Calcula una ruta que hagas de verdad.",
          "Compara si necesitas cargar en casa, en trabajo o en via.",
          "Unete a la lista si quieres aprender con una comunidad local.",
        ],
      },
    ],
    checklistTitle: "Antes de decidir",
    checklist: [
      "Entiende tu autonomia real, no solo la de brochure.",
      "Define donde cargarias la mayor parte del tiempo.",
      "Calcula tus rutas frecuentes con margen.",
      "Ten claro que cambiar a electrico tambien cambia habitos.",
    ],
    shareLine:
      "Mandasela a esa persona que esta entre comprar electrico o seguir esperando.",
    faq: [
      {
        question: "Que debo saber antes de comprar un carro electrico?",
        answer:
          "Debes entender tus rutas, donde cargarias, cuanto recorres cada semana y que margen de bateria necesitas para sentirte tranquilo.",
      },
      {
        question: "Es dificil manejar electrico en Colombia?",
        answer:
          "No tiene que ser dificil, pero exige planear mejor la carga, especialmente fuera de las zonas donde ya conoces la infraestructura.",
      },
      {
        question: "Como empiezo con Cumbreva?",
        answer:
          "Puedes probar la calculadora de ruta o unirte a la lista de espera para recibir novedades y acceso cuando la app este disponible.",
      },
    ],
  },
]

export const seoLandingBySlug = new Map(
  seoLandings.map((landing) => [landing.slug, landing]),
)

export function absoluteLandingUrl(slug: string) {
  return `${SITE_URL}/seo/${slug}`
}
