import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { INGREDIENTES } from "@/lib/ingredientes";
import { RespuestaIASchema } from "@/lib/tipos";

// Generar 3 menús con razonamiento puede tardar 1–2 minutos.
export const maxDuration = 300;

const client = new Anthropic();

const CATALOGO = INGREDIENTES.map(
  (i) => `${i.id} | ${i.nombre} | ${i.unidadCompra} ~$${i.precioUnidad} (${i.tienda})${i.congelable ? "" : " | NO congelable"}`,
).join("\n");

// Prompt estable (se cachea). Lo variable va en el mensaje del usuario.
const SISTEMA = `Eres un cocinero mexicano experto en meal prep económico para ganar masa muscular. Ayudas a un estudiante universitario en Guadalajara que cocina UNA vez el domingo (2–4 horas) y lleva un topper de comida de lunes a viernes.

Equipo disponible: estufa y microondas. NO tiene horno, air fryer, Instant Pot ni olla de presión. Compra en Sam's, Bodega Aurrerá y el Mercado de Abastos.

Cada propuesta es un menú semanal de EXACTAMENTE 2 recetas que suman 5 toppers (p. ej. 3 + 2) y que se aprovechan entre sí: comparten base de ingredientes (misma cebolla, mismo arroz, misma proteína cocida de dos formas, misma salsa) y pasos (cocer el arroz una vez, picar todo junto).

Reglas:
- Prioridad: alta proteína (idealmente 40 g o más por topper) y densidad calórica (650–900 kcal por topper), barato y que llene.
- Lácteos: los come pero prefiere poca cantidad; úsalos como acento, no como base.
- Nada caldoso ni sopas: el topper va en la mochila y no debe escurrir. Guisos espesos, secos o con salsa reducida.
- Seguridad: la comida cocinada dura 3–4 días en refri. Lunes a miércoles pueden ir en refri; jueves y viernes DEBEN ir en congelador, así que su receta debe ser congelable (si no, toda la semana usa la receta congelable para esos días). Explica en comoGuardar cómo enfriar rápido, porcionar en cubos o toppers y etiquetar.
- Descongelar siempre en refri la noche anterior o directo en microondas, nunca a temperatura ambiente.
- Respeta el número de comidas frías por semana que pida el usuario: la receta de ese día debe saber bien fría (seComeFria = true).
- Usa SOLO ingredientes del catálogo (por id) y escribe los gramos totales de la receta en crudo. Sal, pimienta y especias en cantidades realistas (pocos gramos).
- Tiempos realistas para alguien de nivel básico-intermedio. planSesion es una línea de tiempo del domingo (minuto 0 = empiezas) que aprovecha dos quemadores en paralelo.
- Las 3 propuestas deben ser claramente distintas entre sí (proteína y estilo).
- Escribe en español de México, claro y directo.

Catálogo (id | nombre | presentación ~precio):
${CATALOGO}`;

const EntradaSchema = z.object({
  perfil: z.object({
    pesoKg: z.number(),
    comidasFrias: z.number(),
    presupuestoMin: z.number(),
    presupuestoMax: z.number(),
    notas: z.string(),
  }),
  metas: z.object({ kcal: z.number(), proteina: z.number() }),
  meGustan: z.array(z.string()),
  noMeGustan: z.array(z.string()),
  recientes: z.array(z.string()),
  pedido: z.string(),
});

export async function POST(request: Request) {
  const entrada = EntradaSchema.safeParse(await request.json());
  if (!entrada.success) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const { perfil, metas, meGustan, noMeGustan, recientes, pedido } = entrada.data;

  const mensaje = [
    `Peso: ${perfil.pesoKg} kg. Meta diaria: ${metas.kcal} kcal y ${metas.proteina} g de proteína (el topper es la comida principal del día).`,
    `Presupuesto del súper de la semana: $${perfil.presupuestoMin}–$${perfil.presupuestoMax} MXN (puede subir un poco si vale la pena por proteína).`,
    `Comidas frías esta semana: ${perfil.comidasFrias}.`,
    meGustan.length ? `Recetas que le gustaron (puedes inspirarte, no repetir igual): ${meGustan.join(", ")}.` : "",
    noMeGustan.length ? `Recetas que NO le gustaron (evita algo parecido): ${noMeGustan.join(", ")}.` : "",
    recientes.length ? `Cocinó recientemente (no repetir): ${recientes.join(", ")}.` : "",
    perfil.notas ? `Notas de su perfil: ${perfil.notas}` : "",
    pedido ? `Pedido para esta semana: ${pedido}` : "",
    "Dame 3 propuestas de menú semanal.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const respuesta = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(RespuestaIASchema) },
      system: [{ type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: mensaje }],
    });

    if (respuesta.stop_reason === "refusal") {
      return Response.json({ error: "La IA no pudo generar propuestas. Intenta de nuevo." }, { status: 502 });
    }
    if (respuesta.stop_reason === "max_tokens" || !respuesta.parsed_output) {
      return Response.json({ error: "La respuesta llegó incompleta. Intenta de nuevo." }, { status: 502 });
    }
    return Response.json(respuesta.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor." }, { status: 500 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Demasiadas solicitudes, espera un momento." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: `Error de la IA (${error.status}).` }, { status: 502 });
    }
    throw error;
  }
}
