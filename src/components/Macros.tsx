import { pct, type Macros as M, type Metas } from "@/lib/calculos";

export function Macros({ m, metas }: { m: M; metas?: Metas }) {
  const celdas = [
    { etiqueta: "kcal", valor: Math.round(m.kcal), meta: metas?.kcal },
    { etiqueta: "proteína", valor: `${Math.round(m.proteina)} g`, meta: metas?.proteina, num: m.proteina },
    { etiqueta: "carbs", valor: `${Math.round(m.carbs)} g` },
    { etiqueta: "grasa", valor: `${Math.round(m.grasa)} g` },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {celdas.map((c) => (
        <div key={c.etiqueta} className="rounded-lg bg-fondo px-1 py-2">
          <div className="text-base font-bold tabular-nums">{c.valor}</div>
          <div className="text-[11px] text-suave">{c.etiqueta}</div>
          {c.meta ? (
            <div className="text-[11px] font-medium text-verde">
              {pct(c.num ?? m.kcal, c.meta)}% del día
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
