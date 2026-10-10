"use client";

import Link from "next/link";
import { useState } from "react";
import { Estrellas } from "@/components/Estrellas";
import { useAhorro, useCalificaciones, useDespensa, usePerfil, useSemana } from "@/lib/almacen";
import { costoReceta, formatoCantidad, listaDeCompras } from "@/lib/calculos";
import { INGREDIENTES_POR_ID } from "@/lib/ingredientes";

export default function Cocinar() {
  const [semana, setSemana] = useSemana();
  const [perfil] = usePerfil();
  const [despensa] = useDespensa();
  const [calificaciones, setCalificaciones] = useCalificaciones();
  const [, setAhorro] = useAhorro();
  const [hechos, setHechos] = useState<number[]>([]);

  if (!semana) {
    return (
      <div className="tarjeta space-y-3 text-center">
        <p>Primero elige el menú de la semana.</p>
        <Link href="/planear" className="boton">
          Planear semana
        </Link>
      </div>
    );
  }

  const { propuesta } = semana;

  function terminar() {
    // El súper incluye paquetes completos (lo que sobra se usa otra semana), así que el
    // ahorro se mide contra el costo de lo que realmente lleva la comida.
    const costo = semana!.gastoReal ?? listaDeCompras(propuesta, despensa).total;
    const usado = propuesta.recetas.reduce((a, r) => a + costoReceta(r), 0);
    const ahorro = perfil.gastoComidaFuera * propuesta.calendario.length - usado;
    setAhorro((a) => [...a, { fecha: new Date().toISOString(), costo, ahorro }]);
    setSemana((s) => s && { ...s, cocinada: true });
  }

  function calificar(nombre: string, estrellas: number) {
    setCalificaciones((cs) => [
      ...cs.filter((c) => c.nombre !== nombre),
      { nombre, estrellas, fecha: new Date().toISOString() },
    ]);
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Sesión de cocina</h1>
        <p className="text-sm text-suave">
          {propuesta.titulo} · ~{Math.floor(propuesta.minutosSesion / 60)}h {propuesta.minutosSesion % 60}m
        </p>
      </header>

      <section className="tarjeta">
        <h2 className="mb-3 font-semibold">Plan paso a paso</h2>
        <ol className="space-y-2">
          {propuesta.planSesion.map((p, i) => {
            const hecho = hechos.includes(i);
            return (
              <li key={i}>
                <label className="flex gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-5 shrink-0 accent-[var(--acento)]"
                    checked={hecho}
                    onChange={() => setHechos((h) => (hecho ? h.filter((x) => x !== i) : [...h, i]))}
                  />
                  <span className={hecho ? "text-suave line-through" : ""}>
                    <span className="mr-1 font-mono text-xs text-acento">min {p.minuto}</span> {p.paso}
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
      </section>

      {propuesta.recetas.map((r) => (
        <section key={r.nombre} className="tarjeta space-y-3">
          <h2 className="text-lg font-semibold">{r.nombre}</h2>
          <p className="text-xs text-suave">
            {r.porciones} toppers · prep {r.minutosPrep} min · cocción {r.minutosCoccion} min
          </p>
          <ul className="list-disc pl-5 text-sm">
            {r.ingredientes.map((i) => (
              <li key={i.id}>
                {INGREDIENTES_POR_ID[i.id]?.nombre ?? i.id} — {formatoCantidad(i.gramos)}
                {i.nota ? <span className="text-suave"> ({i.nota})</span> : null}
              </li>
            ))}
          </ul>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {r.pasos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
          <div className="rounded-lg bg-acento-suave p-3 text-sm">
            <p>
              <strong>Guardar:</strong> {r.comoGuardar}
            </p>
            <p className="mt-1">
              <strong>Recalentar:</strong> {r.comoRecalentar}
            </p>
          </div>
          {semana.cocinada && (
            <div className="flex items-center justify-between">
              <span className="text-sm">¿Qué tal quedó?</span>
              <Estrellas
                valor={calificaciones.find((c) => c.nombre === r.nombre)?.estrellas ?? 0}
                onCambiar={(n) => calificar(r.nombre, n)}
              />
            </div>
          )}
        </section>
      ))}

      <section className="tarjeta text-sm text-suave">
        🧊 <strong>Seguridad:</strong> enfría la comida máximo 2 h después de cocinarla y guárdala. Lo del jueves y
        viernes va al congelador. Para descongelar, pásalo al refri la noche anterior o directo al microondas, nunca
        sobre la barra.
      </section>

      {!semana.cocinada ? (
        <button className="boton w-full" onClick={terminar}>
          ¡Terminé de cocinar!
        </button>
      ) : (
        <Link href="/" className="boton-secundario w-full">
          Ver mi calendario de toppers
        </Link>
      )}
    </div>
  );
}
