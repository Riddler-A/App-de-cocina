import { z } from "zod";

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;
export type Dia = (typeof DIAS)[number];

// ── Formato de la respuesta de Claude ──────────────────────────────
// Claude sólo elige ingredientes de la base (por id) y en gramos; los
// macros y el costo se calculan en la app, no los inventa el modelo.

export const RecetaSchema = z.object({
  nombre: z.string(),
  descripcion: z.string().describe("1-2 frases, que se antoje"),
  busquedaImagen: z
    .string()
    .describe("Término corto para buscar una foto del platillo, p. ej. 'tinga de pollo'"),
  porciones: z.number().describe("Número de toppers que salen de esta receta"),
  ingredientes: z.array(
    z.object({
      id: z.string(),
      gramos: z.number().describe("Gramos totales de la receta, en crudo"),
      nota: z.string().default(""),
    }),
  ),
  pasos: z.array(z.string()),
  minutosPrep: z.number(),
  minutosCoccion: z.number(),
  congelable: z.boolean(),
  seComeFria: z.boolean().describe("true si sabe bien fría o a temperatura ambiente"),
  comoGuardar: z.string().describe("Cómo porcionar, enfriar y congelar o refrigerar"),
  comoRecalentar: z.string(),
});

export const PropuestaSchema = z.object({
  titulo: z.string().describe("Nombre corto del menú de la semana"),
  porQueFunciona: z
    .string()
    .describe("Qué ingredientes y pasos comparten las recetas para ahorrar tiempo y dinero"),
  recetas: z.array(RecetaSchema).describe("Exactamente 2 recetas"),
  planSesion: z
    .array(z.object({ minuto: z.number(), paso: z.string() }))
    .describe("Plan de cocina del domingo en orden, aprovechando quemadores en paralelo"),
  minutosSesion: z.number().describe("Duración total realista de la sesión, incluyendo porcionar"),
  calendario: z
    .array(
      z.object({
        // Acepta "Miercoles" sin acento.
        dia: z.preprocess((v) => (v === "Miercoles" ? "Miércoles" : v), z.enum(DIAS)),
        receta: z.number().describe("Índice de la receta (0 o 1)"),
        guardar: z.enum(["refri", "congelador"]),
        fria: z.boolean().describe("true si ese día se come fría"),
      }),
    )
    .describe("Lunes a viernes, un topper por día"),
});

export const RespuestaIASchema = z.object({
  propuestas: z.array(PropuestaSchema).describe("Exactamente 3 propuestas distintas"),
});

export type Receta = z.infer<typeof RecetaSchema>;
export type Propuesta = z.infer<typeof PropuestaSchema>;

// ── Estado guardado en el celular ────────────────────────────────

export interface Perfil {
  sexo: "hombre" | "mujer";
  edad: number;
  pesoKg: number;
  estaturaCm: number;
  diasGym: number;
  presupuestoMin: number;
  presupuestoMax: number;
  /** Lo que gastarías en una comida si no llevaras topper */
  gastoComidaFuera: number;
  /** Comidas frías por semana que te gustaría */
  comidasFrias: number;
  notas: string;
}

export const PERFIL_INICIAL: Perfil = {
  sexo: "hombre",
  edad: 20,
  pesoKg: 60,
  estaturaCm: 175,
  diasGym: 4,
  presupuestoMin: 500,
  presupuestoMax: 1000,
  gastoComidaFuera: 120,
  comidasFrias: 1,
  notas: "",
};

export interface Semana {
  propuesta: Propuesta;
  creada: string;
  /** ids de ingredientes ya en el carrito */
  comprados: string[];
  /** Lo que realmente pagaste en el súper (opcional) */
  gastoReal?: number;
  cocinada: boolean;
}

export interface Calificacion {
  nombre: string;
  estrellas: number;
  fecha: string;
}

export interface RegistroAhorro {
  fecha: string;
  costo: number;
  ahorro: number;
}
