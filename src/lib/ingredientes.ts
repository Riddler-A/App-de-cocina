// Base de ingredientes. Macros por 100 g de alimento CRUDO / tal como se compra
// (valores de referencia USDA FoodData Central / SMAE, redondeados).
// Precios aproximados en MXN (ZMG, 2026) — se ajustan desde la app si cambian.

export type Seccion =
  | "Frutas y verduras"
  | "Carnes y pollo"
  | "Huevo y lácteos"
  | "Abarrotes"
  | "Granos y leguminosas"
  | "Especias y salsas"
  | "Congelados";

export type Tienda = "Sam's" | "Aurrerá" | "Abastos";

export interface Ingrediente {
  id: string;
  nombre: string;
  seccion: Seccion;
  kcal: number;
  proteina: number;
  carbs: number;
  grasa: number;
  /** Cómo se compra, p. ej. "paquete ~1.5 kg" */
  unidadCompra: string;
  /** Gramos que trae una unidad de compra */
  gramosUnidad: number;
  /** Precio aproximado por unidad de compra (MXN) */
  precioUnidad: number;
  tienda: Tienda;
  /** Básico de despensa que normalmente ya tienes en casa */
  despensa?: boolean;
  /** Se congela bien */
  congelable: boolean;
}

export const INGREDIENTES: Ingrediente[] = [
  // ── Carnes y pollo ─────────────────────────────────────────────
  { id: "pechuga_pollo", nombre: "Pechuga de pollo sin hueso", seccion: "Carnes y pollo", kcal: 120, proteina: 22.5, carbs: 0, grasa: 2.6, unidadCompra: "paquete ~2 kg", gramosUnidad: 2000, precioUnidad: 290, tienda: "Sam's", congelable: true },
  { id: "muslo_pollo", nombre: "Muslo de pollo sin hueso", seccion: "Carnes y pollo", kcal: 177, proteina: 18, carbs: 0, grasa: 11, unidadCompra: "paquete ~2 kg", gramosUnidad: 2000, precioUnidad: 230, tienda: "Sam's", congelable: true },
  { id: "pierna_muslo_pollo", nombre: "Pierna y muslo de pollo", seccion: "Carnes y pollo", kcal: 190, proteina: 17, carbs: 0, grasa: 13, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 75, tienda: "Abastos", congelable: true },
  { id: "molida_res", nombre: "Carne molida de res 90/10", seccion: "Carnes y pollo", kcal: 176, proteina: 20, carbs: 0, grasa: 10, unidadCompra: "paquete ~1.5 kg", gramosUnidad: 1500, precioUnidad: 270, tienda: "Sam's", congelable: true },
  { id: "molida_mixta", nombre: "Carne molida mixta (res/cerdo)", seccion: "Carnes y pollo", kcal: 230, proteina: 18, carbs: 0, grasa: 17, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 130, tienda: "Abastos", congelable: true },
  { id: "bistec_res", nombre: "Bistec de res (aguayón/bola)", seccion: "Carnes y pollo", kcal: 150, proteina: 22, carbs: 0, grasa: 6.5, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 190, tienda: "Abastos", congelable: true },
  { id: "lomo_cerdo", nombre: "Lomo de cerdo", seccion: "Carnes y pollo", kcal: 143, proteina: 21, carbs: 0, grasa: 6, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 120, tienda: "Abastos", congelable: true },
  { id: "pulpa_cerdo", nombre: "Pulpa de cerdo", seccion: "Carnes y pollo", kcal: 180, proteina: 20, carbs: 0, grasa: 11, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 110, tienda: "Abastos", congelable: true },
  { id: "chorizo", nombre: "Chorizo", seccion: "Carnes y pollo", kcal: 455, proteina: 24, carbs: 2, grasa: 38, unidadCompra: "paquete 250 g", gramosUnidad: 250, precioUnidad: 35, tienda: "Aurrerá", congelable: true },
  { id: "atun_lata", nombre: "Atún en agua (lata)", seccion: "Abarrotes", kcal: 116, proteina: 26, carbs: 0, grasa: 1, unidadCompra: "lata 140 g (drenado ~100 g)", gramosUnidad: 100, precioUnidad: 22, tienda: "Aurrerá", congelable: false },

  // ── Huevo y lácteos ───────────────────────────────────────────
  { id: "huevo", nombre: "Huevo", seccion: "Huevo y lácteos", kcal: 143, proteina: 12.6, carbs: 0.7, grasa: 9.5, unidadCompra: "caja 30 piezas (~1.8 kg)", gramosUnidad: 1800, precioUnidad: 95, tienda: "Sam's", congelable: false },
  { id: "claras_huevo", nombre: "Claras de huevo líquidas", seccion: "Huevo y lácteos", kcal: 52, proteina: 11, carbs: 0.7, grasa: 0.2, unidadCompra: "envase 1 kg", gramosUnidad: 1000, precioUnidad: 75, tienda: "Sam's", congelable: false },
  { id: "yogur_griego", nombre: "Yogur griego natural", seccion: "Huevo y lácteos", kcal: 97, proteina: 9, carbs: 4, grasa: 5, unidadCompra: "bote 1 kg", gramosUnidad: 1000, precioUnidad: 85, tienda: "Sam's", congelable: false },
  { id: "queso_panela", nombre: "Queso panela", seccion: "Huevo y lácteos", kcal: 264, proteina: 18, carbs: 3, grasa: 20, unidadCompra: "pieza 400 g", gramosUnidad: 400, precioUnidad: 60, tienda: "Aurrerá", congelable: false },
  { id: "queso_oaxaca", nombre: "Queso Oaxaca", seccion: "Huevo y lácteos", kcal: 300, proteina: 22, carbs: 2, grasa: 23, unidadCompra: "paquete 400 g", gramosUnidad: 400, precioUnidad: 75, tienda: "Aurrerá", congelable: true },
  { id: "leche_deslactosada", nombre: "Leche deslactosada", seccion: "Huevo y lácteos", kcal: 46, proteina: 3.1, carbs: 4.8, grasa: 1.6, unidadCompra: "litro", gramosUnidad: 1000, precioUnidad: 27, tienda: "Aurrerá", congelable: false },

  // ── Granos y leguminosas ─────────────────────────────────────
  { id: "arroz", nombre: "Arroz blanco (crudo)", seccion: "Granos y leguminosas", kcal: 360, proteina: 6.6, carbs: 79, grasa: 0.6, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 32, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "pasta", nombre: "Pasta seca (codito/espagueti/penne)", seccion: "Granos y leguminosas", kcal: 371, proteina: 13, carbs: 75, grasa: 1.5, unidadCompra: "paquete 500 g", gramosUnidad: 500, precioUnidad: 22, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "frijol_negro", nombre: "Frijol negro (crudo)", seccion: "Granos y leguminosas", kcal: 341, proteina: 21.6, carbs: 62, grasa: 1.4, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 42, tienda: "Abastos", congelable: true },
  { id: "frijol_bayo", nombre: "Frijol peruano/bayo (crudo)", seccion: "Granos y leguminosas", kcal: 335, proteina: 22, carbs: 60, grasa: 1.2, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 45, tienda: "Abastos", congelable: true },
  { id: "frijol_lata", nombre: "Frijoles enteros/refritos (lata)", seccion: "Granos y leguminosas", kcal: 100, proteina: 6, carbs: 16, grasa: 1, unidadCompra: "lata 560 g", gramosUnidad: 560, precioUnidad: 25, tienda: "Aurrerá", congelable: true },
  { id: "lenteja", nombre: "Lenteja (cruda)", seccion: "Granos y leguminosas", kcal: 352, proteina: 24.6, carbs: 63, grasa: 1.1, unidadCompra: "bolsa 500 g", gramosUnidad: 500, precioUnidad: 25, tienda: "Aurrerá", congelable: true },
  { id: "garbanzo", nombre: "Garbanzo (crudo)", seccion: "Granos y leguminosas", kcal: 364, proteina: 19, carbs: 61, grasa: 6, unidadCompra: "bolsa 500 g", gramosUnidad: 500, precioUnidad: 30, tienda: "Aurrerá", congelable: true },
  { id: "avena", nombre: "Avena en hojuelas", seccion: "Granos y leguminosas", kcal: 379, proteina: 13, carbs: 68, grasa: 6.5, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 45, tienda: "Sam's", congelable: true },
  { id: "tortilla_maiz", nombre: "Tortilla de maíz", seccion: "Abarrotes", kcal: 218, proteina: 5.7, carbs: 45, grasa: 2.9, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 28, tienda: "Abastos", congelable: true },
  { id: "tortilla_harina", nombre: "Tortilla de harina", seccion: "Abarrotes", kcal: 304, proteina: 8, carbs: 50, grasa: 8, unidadCompra: "paquete 20 pzs (~900 g)", gramosUnidad: 900, precioUnidad: 55, tienda: "Sam's", congelable: true },
  { id: "pan_integral", nombre: "Pan integral de caja", seccion: "Abarrotes", kcal: 250, proteina: 11, carbs: 43, grasa: 3.5, unidadCompra: "bolsa 680 g", gramosUnidad: 680, precioUnidad: 52, tienda: "Aurrerá", congelable: true },

  // ── Frutas y verduras ────────────────────────────────────────
  { id: "papa", nombre: "Papa", seccion: "Frutas y verduras", kcal: 77, proteina: 2, carbs: 17, grasa: 0.1, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 28, tienda: "Abastos", congelable: false },
  { id: "camote", nombre: "Camote", seccion: "Frutas y verduras", kcal: 86, proteina: 1.6, carbs: 20, grasa: 0.1, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 30, tienda: "Abastos", congelable: true },
  { id: "jitomate", nombre: "Jitomate", seccion: "Frutas y verduras", kcal: 18, proteina: 0.9, carbs: 3.9, grasa: 0.2, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 30, tienda: "Abastos", congelable: true },
  { id: "tomate_verde", nombre: "Tomate verde", seccion: "Frutas y verduras", kcal: 32, proteina: 1, carbs: 6, grasa: 1, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 28, tienda: "Abastos", congelable: true },
  { id: "cebolla", nombre: "Cebolla blanca", seccion: "Frutas y verduras", kcal: 40, proteina: 1.1, carbs: 9.3, grasa: 0.1, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 30, tienda: "Abastos", congelable: true },
  { id: "ajo", nombre: "Ajo", seccion: "Frutas y verduras", kcal: 149, proteina: 6.4, carbs: 33, grasa: 0.5, unidadCompra: "cabeza ~40 g", gramosUnidad: 40, precioUnidad: 8, tienda: "Abastos", despensa: true, congelable: true },
  { id: "chile_serrano", nombre: "Chile serrano", seccion: "Frutas y verduras", kcal: 32, proteina: 1.7, carbs: 6.7, grasa: 0.4, unidadCompra: "1/4 kg", gramosUnidad: 250, precioUnidad: 12, tienda: "Abastos", congelable: true },
  { id: "chile_poblano", nombre: "Chile poblano", seccion: "Frutas y verduras", kcal: 20, proteina: 0.9, carbs: 4.6, grasa: 0.2, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 40, tienda: "Abastos", congelable: true },
  { id: "pimiento", nombre: "Pimiento morrón", seccion: "Frutas y verduras", kcal: 26, proteina: 1, carbs: 6, grasa: 0.3, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 50, tienda: "Abastos", congelable: true },
  { id: "calabacita", nombre: "Calabacita", seccion: "Frutas y verduras", kcal: 17, proteina: 1.2, carbs: 3.1, grasa: 0.3, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 30, tienda: "Abastos", congelable: false },
  { id: "zanahoria", nombre: "Zanahoria", seccion: "Frutas y verduras", kcal: 41, proteina: 0.9, carbs: 9.6, grasa: 0.2, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 18, tienda: "Abastos", congelable: true },
  { id: "brocoli", nombre: "Brócoli", seccion: "Frutas y verduras", kcal: 34, proteina: 2.8, carbs: 6.6, grasa: 0.4, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 45, tienda: "Abastos", congelable: true },
  { id: "chayote", nombre: "Chayote", seccion: "Frutas y verduras", kcal: 19, proteina: 0.8, carbs: 4.5, grasa: 0.1, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 20, tienda: "Abastos", congelable: false },
  { id: "elote", nombre: "Elote desgranado", seccion: "Congelados", kcal: 86, proteina: 3.3, carbs: 19, grasa: 1.4, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 55, tienda: "Sam's", congelable: true },
  { id: "verduras_congeladas", nombre: "Mezcla de verduras congeladas", seccion: "Congelados", kcal: 60, proteina: 2.9, carbs: 12, grasa: 0.5, unidadCompra: "bolsa 2 kg", gramosUnidad: 2000, precioUnidad: 110, tienda: "Sam's", congelable: true },
  { id: "espinaca", nombre: "Espinaca", seccion: "Frutas y verduras", kcal: 23, proteina: 2.9, carbs: 3.6, grasa: 0.4, unidadCompra: "manojo ~300 g", gramosUnidad: 300, precioUnidad: 15, tienda: "Abastos", congelable: false },
  { id: "lechuga", nombre: "Lechuga romana", seccion: "Frutas y verduras", kcal: 17, proteina: 1.2, carbs: 3.3, grasa: 0.3, unidadCompra: "pieza ~500 g", gramosUnidad: 500, precioUnidad: 20, tienda: "Abastos", congelable: false },
  { id: "pepino", nombre: "Pepino", seccion: "Frutas y verduras", kcal: 15, proteina: 0.7, carbs: 3.6, grasa: 0.1, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 20, tienda: "Abastos", congelable: false },
  { id: "aguacate", nombre: "Aguacate", seccion: "Frutas y verduras", kcal: 160, proteina: 2, carbs: 8.5, grasa: 14.7, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 70, tienda: "Abastos", congelable: false },
  { id: "cilantro", nombre: "Cilantro", seccion: "Frutas y verduras", kcal: 23, proteina: 2.1, carbs: 3.7, grasa: 0.5, unidadCompra: "manojo", gramosUnidad: 100, precioUnidad: 8, tienda: "Abastos", congelable: false },
  { id: "limon", nombre: "Limón", seccion: "Frutas y verduras", kcal: 29, proteina: 1.1, carbs: 9.3, grasa: 0.3, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 35, tienda: "Abastos", congelable: false },
  { id: "platano", nombre: "Plátano", seccion: "Frutas y verduras", kcal: 89, proteina: 1.1, carbs: 23, grasa: 0.3, unidadCompra: "kg", gramosUnidad: 1000, precioUnidad: 25, tienda: "Abastos", congelable: true },
  { id: "champinon", nombre: "Champiñón", seccion: "Frutas y verduras", kcal: 22, proteina: 3.1, carbs: 3.3, grasa: 0.3, unidadCompra: "charola 500 g", gramosUnidad: 500, precioUnidad: 45, tienda: "Sam's", congelable: true },

  // ── Abarrotes / grasas ────────────────────────────────────────
  { id: "aceite", nombre: "Aceite vegetal", seccion: "Abarrotes", kcal: 884, proteina: 0, carbs: 0, grasa: 100, unidadCompra: "botella 1 L (~920 g)", gramosUnidad: 920, precioUnidad: 45, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "aceite_oliva", nombre: "Aceite de oliva", seccion: "Abarrotes", kcal: 884, proteina: 0, carbs: 0, grasa: 100, unidadCompra: "botella 1 L (~920 g)", gramosUnidad: 920, precioUnidad: 190, tienda: "Sam's", despensa: true, congelable: true },
  { id: "crema_cacahuate", nombre: "Crema de cacahuate", seccion: "Abarrotes", kcal: 588, proteina: 25, carbs: 20, grasa: 50, unidadCompra: "frasco 1 kg", gramosUnidad: 1000, precioUnidad: 120, tienda: "Sam's", congelable: false },
  { id: "cacahuate", nombre: "Cacahuate natural", seccion: "Abarrotes", kcal: 567, proteina: 26, carbs: 16, grasa: 49, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 95, tienda: "Abastos", congelable: false },
  { id: "pure_tomate", nombre: "Puré de tomate", seccion: "Abarrotes", kcal: 38, proteina: 1.6, carbs: 8, grasa: 0.2, unidadCompra: "caja 1 kg", gramosUnidad: 1000, precioUnidad: 30, tienda: "Aurrerá", congelable: true },
  { id: "chipotle_lata", nombre: "Chiles chipotles adobados", seccion: "Especias y salsas", kcal: 60, proteina: 1.5, carbs: 9, grasa: 2, unidadCompra: "lata 210 g", gramosUnidad: 210, precioUnidad: 22, tienda: "Aurrerá", congelable: true },
  { id: "chile_guajillo", nombre: "Chile guajillo seco", seccion: "Especias y salsas", kcal: 324, proteina: 12, carbs: 56, grasa: 6, unidadCompra: "bolsa 100 g", gramosUnidad: 100, precioUnidad: 25, tienda: "Abastos", congelable: true },
  { id: "chile_ancho", nombre: "Chile ancho seco", seccion: "Especias y salsas", kcal: 281, proteina: 12, carbs: 51, grasa: 8, unidadCompra: "bolsa 100 g", gramosUnidad: 100, precioUnidad: 25, tienda: "Abastos", congelable: true },
  { id: "consome_pollo", nombre: "Consomé de pollo en polvo", seccion: "Especias y salsas", kcal: 200, proteina: 10, carbs: 25, grasa: 7, unidadCompra: "frasco 225 g", gramosUnidad: 225, precioUnidad: 40, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "salsa_soya", nombre: "Salsa de soya", seccion: "Especias y salsas", kcal: 53, proteina: 8, carbs: 5, grasa: 0, unidadCompra: "botella 300 ml", gramosUnidad: 300, precioUnidad: 35, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "miel", nombre: "Miel de abeja", seccion: "Abarrotes", kcal: 304, proteina: 0.3, carbs: 82, grasa: 0, unidadCompra: "botella 500 g", gramosUnidad: 500, precioUnidad: 75, tienda: "Sam's", congelable: true },
  { id: "sal", nombre: "Sal", seccion: "Especias y salsas", kcal: 0, proteina: 0, carbs: 0, grasa: 0, unidadCompra: "bolsa 1 kg", gramosUnidad: 1000, precioUnidad: 15, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "pimienta", nombre: "Pimienta negra molida", seccion: "Especias y salsas", kcal: 251, proteina: 10, carbs: 64, grasa: 3, unidadCompra: "frasco 50 g", gramosUnidad: 50, precioUnidad: 30, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "comino", nombre: "Comino molido", seccion: "Especias y salsas", kcal: 375, proteina: 18, carbs: 44, grasa: 22, unidadCompra: "frasco 40 g", gramosUnidad: 40, precioUnidad: 25, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "oregano", nombre: "Orégano seco", seccion: "Especias y salsas", kcal: 265, proteina: 9, carbs: 69, grasa: 4, unidadCompra: "bolsa 20 g", gramosUnidad: 20, precioUnidad: 12, tienda: "Abastos", despensa: true, congelable: true },
  { id: "paprika", nombre: "Paprika", seccion: "Especias y salsas", kcal: 282, proteina: 14, carbs: 54, grasa: 13, unidadCompra: "frasco 50 g", gramosUnidad: 50, precioUnidad: 30, tienda: "Aurrerá", despensa: true, congelable: true },
  { id: "laurel", nombre: "Hojas de laurel", seccion: "Especias y salsas", kcal: 313, proteina: 7.6, carbs: 75, grasa: 8, unidadCompra: "bolsa 10 g", gramosUnidad: 10, precioUnidad: 10, tienda: "Abastos", despensa: true, congelable: true },
];

export const INGREDIENTES_POR_ID: Record<string, Ingrediente> = Object.fromEntries(
  INGREDIENTES.map((i) => [i.id, i]),
);

export const IDS_INGREDIENTES = INGREDIENTES.map((i) => i.id) as [string, ...string[]];

export const ORDEN_SECCIONES: Seccion[] = [
  "Frutas y verduras",
  "Carnes y pollo",
  "Huevo y lácteos",
  "Granos y leguminosas",
  "Abarrotes",
  "Especias y salsas",
  "Congelados",
];
