"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Macros } from "@/components/Macros";
import { useAhorro, usePerfil, useSemana } from "@/lib/almacen";
import { calcularMetas, macrosPorTopper } from "@/lib/calculos";
import { DIAS } from "@/lib/tipos";

const sinSuscripcion = () => () => {};
// getDay(): 0 = domingo … 5 = viernes → índice en DIAS
const diaDeHoy = () => new Date().getDay() - 1;

export default function Semana() {
  const [semana] = useSemana();
  const [perfil] = usePerfil();
  const [ahorro] = useAhorro();
  const metas = calcularMetas(perfil);
  const ahorroTotal = ahorro.reduce((a, r) => a + r.ahorro, 0);
  const indiceHoy = useSyncExternalStore(sinSuscripcion, diaDeHoy, () => -1);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Mis toppers</h1>
        {ahorro.length > 0 && (
          <p className="text-sm text-verde">
            💰 Llevas ~${Math.round(ahorroTotal).toLocaleString("es-MX")} ahorrados en {ahorro.length}{" "}
            {ahorro.length === 1 ? "semana" : "semanas"}
          </p>
        )}
      </header>

      {!semana ? (
        <div className="tarjeta space-y-3 text-center">
          <p className="text-4xl">🍱</p>
          <p>Todavía no planeas esta semana.</p>
          <Link href="/planear" className="boton">
            Planear semana
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-suave">
            {semana.propuesta.titulo}
            {!semana.cocinada && (
              <>
                {" · "}
                <Link href="/compras" className="text-acento underline">
                  falta comprar y cocinar
                </Link>
              </>
            )}
          </p>

          <ol className="space-y-3">
            {DIAS.map((dia, i) => {
              const d = semana.propuesta.calendario.find((c) => c.dia === dia);
              const receta = d ? semana.propuesta.recetas[d.receta] : undefined;
              const manana = semana.propuesta.calendario.find((c) => c.dia === DIAS[i + 1]);
              const esHoy = i === indiceHoy;
              return (
                <li key={dia} className={`tarjeta space-y-2 ${esHoy ? "ring-2 ring-[var(--acento)]" : ""}`}>
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-semibold">
                      {dia} {esHoy && <span className="text-xs text-acento">· hoy</span>}
                    </h2>
                    {d && (
                      <span className="text-xs text-suave">
                        {d.guardar === "congelador" ? "❄️ congelador" : "🧊 refri"} · {d.fria ? "🥶 fría" : "🔥 caliente"}
                      </span>
                    )}
                  </div>
                  {i === 0 && d?.guardar === "congelador" && (
                    <p className="rounded-lg bg-acento-suave px-3 py-2 text-xs">
                      🌙 Domingo en la noche: pasa este topper del congelador al refri.
                    </p>
                  )}
                  {receta ? (
                    <>
                      <p>{receta.nombre}</p>
                      <Macros m={macrosPorTopper(receta)} metas={metas} />
                    </>
                  ) : (
                    <p className="text-sm text-suave">Sin topper asignado</p>
                  )}
                  {manana?.guardar === "congelador" && (
                    <p className="rounded-lg bg-acento-suave px-3 py-2 text-xs">
                      🌙 Esta noche: pasa el topper del {DIAS[i + 1].toLowerCase()} del congelador al refri.
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
