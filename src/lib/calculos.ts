import { INGREDIENTES_POR_ID, ORDEN_SECCIONES, type Ingrediente, type Seccion } from "./ingredientes";
import type { Perfil, Propuesta, Receta } from "./tipos";

export interface Macros {
  kcal: number;
  proteina: number;
  carbs: number;
  grasa: number;
}

const CERO: Macros = { kcal: 0, proteina: 0, carbs: 0, grasa: 0 };

function sumar(a: Macros, b: Macros): Macros {
  return {
    kcal: a.kcal + b.kcal,
    proteina: a.proteina + b.proteina,
    carbs: a.carbs + b.carbs,
    grasa: a.grasa + b.grasa,
  };
}

function escalar(m: Macros, f: number): Macros {
  return { kcal: m.kcal * f, proteina: m.proteina * f, carbs: m.carbs * f, grasa: m.grasa * f };
}

/** Macros de UN topper (receta total ÷ porciones). */
export function macrosPorTopper(receta: Receta): Macros {
  const total = receta.ingredientes.reduce((acc, { id, gramos }) => {
    const ing = INGREDIENTES_POR_ID[id];
    return ing ? sumar(acc, escalar(ing, gramos / 100)) : acc;
  }, CERO);
  return escalar(total, 1 / Math.max(1, receta.porciones));
}

/** Costo proporcional de lo que usa la receta (no de lo que compras). */
export function costoReceta(receta: Receta): number {
  return receta.ingredientes.reduce((acc, { id, gramos }) => {
    const ing = INGREDIENTES_POR_ID[id];
    return ing ? acc + (gramos / ing.gramosUnidad) * ing.precioUnidad : acc;
  }, 0);
}

export function macrosPromedioSemana(p: Propuesta): Macros {
  if (p.calendario.length === 0) return CERO;
  const total = p.calendario.reduce((acc, d) => {
    const r = p.recetas[d.receta];
    return r ? sumar(acc, macrosPorTopper(r)) : acc;
  }, CERO);
  return escalar(total, 1 / p.calendario.length);
}

export function costoPorTopper(p: Propuesta): number {
  const toppers = p.recetas.reduce((a, r) => a + r.porciones, 0);
  const costo = p.recetas.reduce((a, r) => a + costoReceta(r), 0);
  return toppers ? costo / toppers : 0;
}

// ── Lista de compras ─────────────────────────────────────────────

export interface ItemCompra {
  ingrediente: Ingrediente;
  gramos: number;
  unidades: number;
  costo: number;
  enDespensa: boolean;
}

export function listaDeCompras(p: Propuesta, despensa: string[]) {
  const gramosPorId = new Map<string, number>();
  for (const r of p.recetas) {
    for (const { id, gramos } of r.ingredientes) {
      gramosPorId.set(id, (gramosPorId.get(id) ?? 0) + gramos);
    }
  }

  const items: ItemCompra[] = [];
  for (const [id, gramos] of gramosPorId) {
    const ing = INGREDIENTES_POR_ID[id];
    if (!ing) continue;
    const unidades = Math.max(1, Math.ceil(gramos / ing.gramosUnidad - 0.05));
    items.push({
      ingrediente: ing,
      gramos,
      unidades,
      costo: unidades * ing.precioUnidad,
      enDespensa: despensa.includes(id),
    });
  }

  const porSeccion = new Map<Seccion, ItemCompra[]>();
  for (const s of ORDEN_SECCIONES) porSeccion.set(s, []);
  for (const it of items) porSeccion.get(it.ingrediente.seccion)!.push(it);

  const total = items.filter((i) => !i.enDespensa).reduce((a, i) => a + i.costo, 0);
  return { porSeccion, items, total };
}

export function formatoCantidad(gramos: number): string {
  return gramos >= 1000 ? `${(gramos / 1000).toFixed(1).replace(/\.0$/, "")} kg` : `${Math.round(gramos)} g`;
}

export function textoListaCompras(p: Propuesta, despensa: string[]): string {
  const { porSeccion, total } = listaDeCompras(p, despensa);
  const lineas = [`🛒 Súper — ${p.titulo}`, ""];
  for (const [seccion, items] of porSeccion) {
    const pendientes = items.filter((i) => !i.enDespensa);
    if (!pendientes.length) continue;
    lineas.push(`*${seccion}*`);
    for (const i of pendientes) {
      lineas.push(`- ${i.ingrediente.nombre}: ${i.unidades} × ${i.ingrediente.unidadCompra} (${i.ingrediente.tienda})`);
    }
    lineas.push("");
  }
  lineas.push(`Total aprox: $${Math.round(total)}`);
  return lineas.join("\n");
}

// ── Metas diarias (ganancia de masa muscular) ──────────────────────

export interface Metas {
  kcal: number;
  proteina: number;
  proteinaMin: number;
  proteinaMax: number;
}

/** Mifflin-St Jeor × factor de actividad + superávit moderado (~400 kcal). */
export function calcularMetas(perfil: Perfil): Metas {
  const base =
    10 * perfil.pesoKg + 6.25 * perfil.estaturaCm - 5 * perfil.edad + (perfil.sexo === "hombre" ? 5 : -161);
  const factor = perfil.diasGym <= 2 ? 1.375 : perfil.diasGym <= 4 ? 1.55 : 1.725;
  return {
    kcal: Math.round((base * factor + 400) / 50) * 50,
    proteina: Math.round(perfil.pesoKg * 2),
    proteinaMin: Math.round(perfil.pesoKg * 1.6),
    proteinaMax: Math.round(perfil.pesoKg * 2.2),
  };
}

export function pct(valor: number, meta: number): number {
  return meta ? Math.round((valor / meta) * 100) : 0;
}

export function urlImagenes(busqueda: string): string {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(busqueda + " receta")}`;
}
