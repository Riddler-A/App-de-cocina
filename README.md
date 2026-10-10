# Toppers — app de meal prep

App web personal (para usar en el celular) que:

1. **Propone 3 menús semanales** con tu app de Claude (sin API de pago): 2 recetas que comparten ingredientes y suman 5 toppers (lunes a viernes).
2. Muestra por propuesta: **valor nutricional** por topper (y % de tu meta diaria), **costo aprox.**, **tiempo de cocina** y enlace a fotos de referencia.
3. Genera la **lista del súper** por sección y tienda (Sam's, Aurrerá, Abastos), descontando lo que ya tienes en casa, con checklist y botón para compartir.
4. Da un **plan de cocina del domingo** paso a paso, cómo guardar (refri/congelador) y cómo recalentar.
5. **Calendario de toppers** con recordatorio de pasar al refri lo que está congelado.
6. **Calificación de recetas** (la IA se inspira en las que te gustan y evita las que no).
7. **Conteo de ahorro** vs. comer fuera.

## Cómo se generan las recetas (gratis)

La app no usa ninguna API de pago:

1. En **Planear**, "Copiar instrucciones" arma un mensaje con tu perfil, metas, calificaciones, el catálogo de ingredientes y el formato de respuesta.
2. Lo pegas en [claude.ai](https://claude.ai/new) (web o app del celular).
3. Copias la respuesta (un bloque JSON) y la pegas de vuelta en la app, que la valida y la muestra.

## Cómo calcula los números

- **Macros**: la IA sólo elige ingredientes de una base fija (`src/lib/ingredientes.ts`) y sus gramos. Las calorías y macros los calcula la app con valores de referencia (USDA / SMAE), no los inventa la IA.
- **Precios**: aproximados (ZMG, 2026) y editables en `src/lib/ingredientes.ts`.
- **Metas**: Mifflin-St Jeor × factor de actividad + ~400 kcal de superávit; proteína 1.6–2.2 g/kg.

Los datos (perfil, semana, calificaciones, ahorro) se guardan en el navegador del celular (`localStorage`). Si borras los datos del navegador, se pierden.

## Correr en local

```bash
npm install
npm run dev
```

## Publicar (Netlify o Vercel, gratis)

Importa el repo en Netlify o Vercel y despliega. No necesita variables de entorno: todas las páginas son estáticas.
