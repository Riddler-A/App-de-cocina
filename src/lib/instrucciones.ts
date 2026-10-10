import { INGREDIENTES, INGREDIENTES_POR_ID } from "./ingredientes";
import { RespuestaIASchema, type Propuesta } from "./tipos";

// La app no llama a ninguna API de pago: arma un mensaje para pegarlo en la
// app de Claude y luego lee (y valida) la respuesta que el usuario pega de vuelta.

const CATALOGO = INGREDIENTES.map(
  (i) => `${i.id} | ${i.nombre} | ${i.unidadCompra} ~$${i.precioUnidad} (${i.tienda})${i.congelable ? "" : " | NO congelable"}`,
).join("\n");

const REGLAS = `Eres un cocinero mexicano experto en meal prep económico para ganar masa muscular. Ayudas a un estudiante universitario en Guadalajara que cocina UNA vez el domingo (2–4 horas) y lleva un topper de comida de lunes a viernes.

Equipo disponible: estufa y microondas. NO tiene horno, air fryer, Instant Pot ni olla de presión. Compra en Sam's, Bodega Aurrerá y el Mercado de Abastos.

Cada propuesta es un menú semanal de EXACTAMENTE 2 recetas que suman 5 toppers (p. ej. 3 + 2) y que se aprovechan entre sí: comparten base de ingredientes (misma cebolla, mismo arroz, misma proteína cocida de dos formas, misma salsa) y pasos (cocer el arroz una vez, picar todo junto).

Reglas:
- Prioridad: alta proteína (idealmente 40 g o más por topper) y densidad calórica (650–900 kcal por topper), barato y que llene.
- Lácteos: los come pero prefiere poca cantidad; úsalos como acento, no como base.
- Nada caldoso ni sopas: el topper va en la mochila y no debe escurrir. Guisos espesos, secos o con salsa reducida.
- Seguridad: la comida cocinada dura 3–4 días en refri. Lunes a miércoles pueden ir en refri; jueves y viernes DEBEN ir en congelador, así que su receta debe ser congelable. Explica en comoGuardar cómo enfriar rápido, porcionar y etiquetar.
- Descongelar siempre en refri la noche anterior o directo en microondas, nunca a temperatura ambiente.
- Respeta el número de comidas frías por semana: la receta de ese día debe saber bien fría (seComeFria = true).
- Usa SOLO ingredientes del catálogo, con su id exacto, y escribe los gramos totales de la receta en crudo. Sal, pimienta y especias en cantidades realistas (pocos gramos).
- Tiempos realistas para nivel básico-intermedio. planSesion es una línea de tiempo del domingo (minuto 0 = empiezas) que aprovecha dos quemadores en paralelo.
- Las 3 propuestas deben ser claramente distintas entre sí (proteína y estilo).
- Escribe en español de México, claro y directo.`;

const FORMATO = `{
  "propuestas": [
    {
      "titulo": "Nombre corto del menú",
      "porQueFunciona": "Qué ingredientes y pasos comparten las recetas",
      "recetas": [
        {
          "nombre": "Tinga de pollo con arroz",
          "descripcion": "1-2 frases que se antojen",
          "busquedaImagen": "tinga de pollo",
          "porciones": 3,
          "ingredientes": [{ "id": "pechuga_pollo", "gramos": 750, "nota": "deshebrada" }],
          "pasos": ["Paso 1", "Paso 2"],
          "minutosPrep": 20,
          "minutosCoccion": 40,
          "congelable": true,
          "seComeFria": false,
          "comoGuardar": "Cómo enfriar, porcionar y congelar o refrigerar",
          "comoRecalentar": "Microondas 3 min tapado"
        }
      ],
      "planSesion": [{ "minuto": 0, "paso": "Pon a cocer el pollo" }],
      "minutosSesion": 150,
      "calendario": [
        { "dia": "Lunes", "receta": 0, "guardar": "refri", "fria": false },
        { "dia": "Martes", "receta": 1, "guardar": "refri", "fria": false },
        { "dia": "Miércoles", "receta": 0, "guardar": "refri", "fria": false },
        { "dia": "Jueves", "receta": 1, "guardar": "congelador", "fria": false },
        { "dia": "Viernes", "receta": 0, "guardar": "congelador", "fria": false }
      ]
    }
  ]
}`;

export interface DatosInstrucciones {
  pesoKg: number;
  kcal: number;
  proteina: number;
  presupuestoMin: number;
  presupuestoMax: number;
  comidasFrias: number;
  notas: string;
  meGustan: string[];
  noMeGustan: string[];
  recientes: string[];
  pedido: string;
}

export function armarInstrucciones(d: DatosInstrucciones): string {
  const situacion = [
    `Peso: ${d.pesoKg} kg. Meta diaria: ${d.kcal} kcal y ${d.proteina} g de proteína (el topper es la comida principal del día).`,
    `Presupuesto del súper de la semana: $${d.presupuestoMin}–$${d.presupuestoMax} MXN (puede subir un poco si vale la pena por proteína).`,
    `Comidas frías esta semana: ${d.comidasFrias}.`,
    d.meGustan.length ? `Recetas que le gustaron (inspírate, no repitas igual): ${d.meGustan.join(", ")}.` : "",
    d.noMeGustan.length ? `Recetas que NO le gustaron (evita algo parecido): ${d.noMeGustan.join(", ")}.` : "",
    d.recientes.length ? `Cocinó recientemente (no repetir): ${d.recientes.join(", ")}.` : "",
    d.notas ? `Notas: ${d.notas}` : "",
    d.pedido ? `Pedido para esta semana: ${d.pedido}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${REGLAS}

## Situación de esta semana
${situacion}

## Catálogo de ingredientes (id | nombre | presentación ~precio)
${CATALOGO}

## Tarea
Dame 3 propuestas de menú semanal. Responde ÚNICAMENTE con un bloque de código JSON (sin texto antes ni después y sin crear artefactos), con exactamente esta estructura:

${FORMATO}

Cada propuesta lleva exactamente 2 recetas y un calendario de lunes a viernes. "receta" es el índice (0 o 1). "guardar" es "refri" o "congelador".`;
}

export type ResultadoLectura =
  | { ok: true; propuestas: Propuesta[]; avisos: string[] }
  | { ok: false; error: string };

/** Lee la respuesta pegada: tolera ```json, texto alrededor e ids desconocidos. */
export function leerRespuesta(texto: string): ResultadoLectura {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio === -1 || fin <= inicio) {
    return { ok: false, error: "No encontré el JSON. Copia la respuesta completa de Claude." };
  }

  let datos: unknown;
  try {
    datos = JSON.parse(texto.slice(inicio, fin + 1));
  } catch {
    return {
      ok: false,
      error: "La respuesta está incompleta o cortada. Pídele a Claude que la repita completa y vuelve a pegarla.",
    };
  }

  const resultado = RespuestaIASchema.safeParse(datos);
  if (!resultado.success) {
    const problema = resultado.error.issues[0];
    return {
      ok: false,
      error: `La respuesta no tiene el formato esperado (${problema.path.join(".")}: ${problema.message}). Pídele a Claude que respete el formato.`,
    };
  }

  const avisos = new Set<string>();
  const propuestas = resultado.data.propuestas.map((p) => ({
    ...p,
    recetas: p.recetas.map((r) => ({
      ...r,
      ingredientes: r.ingredientes.filter((i) => {
        if (INGREDIENTES_POR_ID[i.id]) return true;
        avisos.add(`"${i.id}" en ${r.nombre}`);
        return false;
      }),
    })),
  }));

  return { ok: true, propuestas, avisos: [...avisos] };
}
