"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TarjetaPropuesta } from "@/components/TarjetaPropuesta";
import { useCalificaciones, useDespensa, usePerfil, usePersistente, useSemana } from "@/lib/almacen";
import { calcularMetas } from "@/lib/calculos";
import { armarInstrucciones, leerRespuesta } from "@/lib/instrucciones";
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
  const [copiado, setCopiado] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [avisos, setAvisos] = useState<string[]>([]);

  async function copiarInstrucciones() {
    const metas = calcularMetas(perfil);
    const texto = armarInstrucciones({
      pesoKg: perfil.pesoKg,
      kcal: metas.kcal,
      proteina: metas.proteina,
      presupuestoMin: perfil.presupuestoMin,
      presupuestoMax: perfil.presupuestoMax,
      comidasFrias: perfil.comidasFrias,
      notas: perfil.notas,
      meGustan: calificaciones.filter((c) => c.estrellas >= 4).map((c) => c.nombre),
      noMeGustan: calificaciones.filter((c) => c.estrellas <= 2).map((c) => c.nombre),
      recientes: calificaciones.slice(-6).map((c) => c.nombre),
      pedido,
    });
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      setError("No pude copiar al portapapeles. Intenta de nuevo.");
    }
  }

  function cargar() {
    const r = leerRespuesta(respuesta);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    setAvisos(r.avisos);
    setPropuestas(r.propuestas);
    setRespuesta("");
    setCopiado(false);
  }

  function elegir(p: Propuesta) {
    setSemana({ propuesta: p, creada: new Date().toISOString(), comprados: [], cocinada: false });
    router.push("/compras");
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Planear la semana</h1>
        <p className="text-sm text-suave">3 menús de 2 recetas para 5 toppers, generados con tu app de Claude.</p>
      </header>

      <section className="tarjeta space-y-3">
        <h2 className="font-semibold">1. Copia las instrucciones</h2>
        <label className="block text-sm text-suave" htmlFor="pedido">
          ¿Algún antojo o condición esta semana? (opcional)
        </label>
        <input
          id="pedido"
          className="campo"
          placeholder="Ej. algo con cerdo, que sea más barato, tengo 2 kg de pollo…"
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
        />
        <button className="boton w-full" onClick={copiarInstrucciones}>
          {copiado ? "✓ Copiadas" : "Copiar instrucciones"}
        </button>
      </section>

      <section className="tarjeta space-y-3">
        <h2 className="font-semibold">2. Pégalas en Claude</h2>
        <p className="text-sm text-suave">
          Abre un chat nuevo, pega y envía. Cuando termine, copia toda su respuesta (el bloque de código tiene un botón
          de copiar).
        </p>
        <a href="https://claude.ai/new" target="_blank" rel="noreferrer" className="boton-secundario w-full">
          Abrir Claude ↗
        </a>
      </section>

      <section className="tarjeta space-y-3">
        <h2 className="font-semibold">3. Pega aquí la respuesta</h2>
        <textarea
          className="campo font-mono text-xs"
          rows={5}
          placeholder='{ "propuestas": [ … ] }'
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
        />
        <button className="boton w-full" onClick={cargar} disabled={!respuesta.trim()}>
          Ver propuestas
        </button>
        {error && <p className="text-sm text-acento">{error}</p>}
        {avisos.length > 0 && (
          <p className="text-xs text-suave">
            Ignoré ingredientes que no están en el catálogo: {avisos.join(", ")}. Los macros de esas recetas pueden
            quedar un poco bajos.
          </p>
        )}
      </section>

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
