# Toppers — app de meal prep

App web personal (para usar en el celular) que:

1. **Propone 3 menús semanales** con IA (Claude): 2 recetas que comparten ingredientes y suman 5 toppers (lunes a viernes).
2. Muestra por propuesta: **valor nutricional** por topper (y % de tu meta diaria), **costo aprox.**, **tiempo de cocina** y fotos de referencia.
3. Genera la **lista del súper** por sección y tienda (Sam's, Aurrerá, Abastos), descontando lo que ya tienes en casa, con checklist y botón para compartir.
4. Da un **plan de cocina del domingo** paso a paso, cómo guardar (refri/congelador) y cómo recalentar.
5. **Calendario de toppers** con recordatorio de pasar al refri lo que está congelado.
6. **Calificación de recetas** (la IA se inspira en las que te gustan y evita las que no).
7. **Conteo de ahorro** vs. comer fuera.

## Cómo calcula los números

- **Macros**: la IA sólo elige ingredientes de una base fija (`src/lib/ingredientes.ts`) y sus gramos. Las calorías y macros los calcula la app con valores de referencia (USDA / SMAE), no los inventa la IA.
- **Precios**: aproximados (ZMG, 2026) y editables en `src/lib/ingredientes.ts`.
- **Metas**: Mifflin-St Jeor × factor de actividad + ~400 kcal de superávit; proteína 1.6–2.2 g/kg.

Los datos (perfil, semana, calificaciones, ahorro) se guardan en el navegador del celular (`localStorage`). Si borras los datos del navegador, se pierden.

## Correr en local

```bash
npm install
cp .env.example .env.local   # y pon tu ANTHROPIC_API_KEY
npm run dev
```

## Publicar en Vercel (gratis)

1. Entra a [vercel.com](https://vercel.com), inicia sesión con GitHub e importa este repo.
2. En **Environment Variables** agrega:
   - `ANTHROPIC_API_KEY` — de [console.anthropic.com](https://console.anthropic.com) (necesitas cargar saldo; cada generación de 3 propuestas cuesta del orden de unos pocos pesos).
   - `PEXELS_API_KEY` *(opcional)* — de [pexels.com/api](https://www.pexels.com/api/) para mostrar fotos dentro de la app. Sin ella, la app muestra un enlace a Google Imágenes.
3. Deploy. Abre la URL en el celular y usa "Agregar a pantalla de inicio".

> La URL queda pública: cualquiera que la tenga podría generar propuestas con tu API key. Para uso personal basta con no compartirla; si quieres, se puede agregar una contraseña simple.
