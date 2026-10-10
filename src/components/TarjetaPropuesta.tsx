"use client";

import { useState } from "react";
import {
  calcularMetas,
  costoPorTopper,
  formatoCantidad,
  listaDeCompras,
  macrosPorTopper,
  macrosPromedioSemana,
} from "@/lib/calculos";
import { INGREDIENTES_POR_ID } from "@/lib/ingredientes";
import type { Perfil, Propuesta } from "@/lib/tipos";
import { FotoPlatillo } from "./FotoPlatillo";
import { Macros } from "./Macros";

export function TarjetaPropuesta({
  propuesta,
  perfil,
  despensa,
  onElegir,
}: {
  propuesta: Propuesta;
  perfil: Perfil;
  despensa: string[];
  onElegir?: () => void;
}) {
  const [abierta, setAbierta] = useState(false);
  const metas = calcularMetas(perfil);
  const { total } = listaDeCompras(propuesta, despensa);
  const fueraDePresupuesto = total > perfil.presupuestoMax;

  return (
    <article className="tarjeta space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {propuesta.recetas.map((r) => (
          <FotoPlatillo key={r.nombre} busqueda={r.busquedaImagen} />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold leading-tight">{propuesta.titulo}</h2>
        <p className="mt-1 text-sm text-suave">{propuesta.recetas.map((r) => `${r.nombre} (${r.porciones})`).join(" + ")}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-acento-suave p-2">
          <div className="font-bold">${Math.round(total)}</div>
          <div className="text-[11px] text-suave">súper aprox.</div>
        </div>
        <div className="rounded-lg bg-acento-suave p-2">
          <div className="font-bold">${Math.round(costoPorTopper(propuesta))}</div>
          <div className="text-[11px] text-suave">por topper</div>
        </div>
        <div className="rounded-lg bg-acento-suave p-2">
          <div className="font-bold">
            {Math.floor(propuesta.minutosSesion / 60)}h {propuesta.minutosSesion % 60}m
          </div>
          <div className="text-[11px] text-suave">cocinando</div>
        </div>
      </div>
      {fueraDePresupuesto && (
        <p className="text-xs text-acento">Se pasa de tu presupuesto máximo (${perfil.presupuestoMax}).</p>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-suave">Promedio por topper</p>
        <Macros m={macrosPromedioSemana(propuesta)} metas={metas} />
      </div>

      <p className="text-sm">💡 {propuesta.porQueFunciona}</p>

      <button className="text-sm font-medium text-acento" onClick={() => setAbierta(!abierta)}>
        {abierta ? "Ocultar recetas ▲" : "Ver recetas e ingredientes ▼"}
      </button>

      {abierta && (
        <div className="space-y-5">
          {propuesta.recetas.map((r) => (
            <section key={r.nombre} className="space-y-2 border-t border-borde pt-4">
              <h3 className="font-semibold">{r.nombre}</h3>
              <p className="text-sm text-suave">{r.descripcion}</p>
              <p className="text-xs text-suave">
                {r.porciones} toppers · {r.minutosPrep + r.minutosCoccion} min ·{" "}
                {r.congelable ? "❄️ congelable" : "solo refri"}
                {r.seComeFria ? " · 🥶 se come fría" : ""}
              </p>
              <Macros m={macrosPorTopper(r)} metas={metas} />
              <ul className="list-disc pl-5 text-sm">
                {r.ingredientes.map((i) => (
                  <li key={i.id}>
                    {INGREDIENTES_POR_ID[i.id]?.nombre ?? i.id} — {formatoCantidad(i.gramos)}
                    {i.nota ? <span className="text-suave"> ({i.nota})</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {onElegir && (
        <button className="boton w-full" onClick={onElegir}>
          Elegir este menú
        </button>
      )}
    </article>
  );
}
