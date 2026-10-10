"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TarjetaPropuesta } from "@/components/TarjetaPropuesta";
import { useCalificaciones, useDespensa, usePerfil, usePersistente, useSemana } from "@/lib/almacen";
import { calcularMetas } from "@/lib/calculos";
import type { Propuesta } from "@/lib/tipos";

const SIN_PROPUESTAS: Propuesta[] = [];

export default function Planear() {
  const router = useRouter();
  const [perfil] = usePerfil();
  const [despensa] = useDespensa();
  const [calificaciones] = useCalificaciones();
  const [, setSemana] = useSemana();
  const [propuestas, setPropuestas] = usePersistente<Propuesta[]>("propuestas", SIN_PROPUESTAS);
  const [pedido, setPedido] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generar() {
    setCargando(true);
    setError(null);
    const metas = calcularMetas(perfil);
    const recientes = calificaciones.slice(-6).map((c) => c.nombre);
    try {
      const res = await fetch("/api/propuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfil,
          metas,
          meGustan: calificaciones.filter((c) => c.estrellas >= 4).map((c) => c.nombre),
          noMeGustan: calificaciones.filter((c) => c.estrellas <= 2).map((c) => c.nombre),
          recientes,
          pedido,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Algo salió mal");
      setPropuestas(data.propuestas);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal");
    } finally {
      setCargando(false);
    }
  }

  function elegir(p: Propuesta) {
    setSemana({ propuesta: p, creada: new Date().toISOString(), comprados: [], cocinada: false });
    router.push("/compras");
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Planear la semana</h1>
        <p className="text-sm text-suave">3 menús de 2 recetas para 5 toppers. Elige el que más se te antoje.</p>
      </header>

      <div className="tarjeta space-y-3">
        <label className="block text-sm font-medium" htmlFor="pedido">
          ¿Algún antojo o condición esta semana? (opcional)
        </label>
        <input
          id="pedido"
          className="campo"
          placeholder="Ej. algo con cerdo, que sea más barato, tengo 2 kg de pollo…"
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
        />
        <button className="boton w-full" onClick={generar} disabled={cargando}>
          {cargando ? "Pensando recetas… (1–2 min)" : propuestas.length ? "Generar otras 3" : "Generar propuestas"}
        </button>
        {error && <p className="text-sm text-acento">{error}</p>}
      </div>

      {propuestas.map((p, i) => (
        <TarjetaPropuesta key={`${p.titulo}-${i}`} propuesta={p} perfil={perfil} despensa={despensa} onElegir={() => elegir(p)} />
      ))}

      {propuestas.length > 0 && (
        <p className="text-center text-xs text-suave">
          Macros calculados con tablas de alimentos (USDA/SMAE) a partir de los gramos de cada receta. Precios
          aproximados.
        </p>
      )}
    </div>
  );
}
