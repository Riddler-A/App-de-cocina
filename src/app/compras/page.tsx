"use client";

import Link from "next/link";
import { useState } from "react";
import { useDespensa, useSemana } from "@/lib/almacen";
import { formatoCantidad, listaDeCompras, textoListaCompras } from "@/lib/calculos";

export default function Compras() {
  const [semana, setSemana] = useSemana();
  const [despensa, setDespensa] = useDespensa();
  const [copiado, setCopiado] = useState(false);

  if (!semana) {
    return (
      <div className="tarjeta space-y-3 text-center">
        <p>Aún no eliges el menú de esta semana.</p>
        <Link href="/planear" className="boton">
          Planear semana
        </Link>
      </div>
    );
  }

  const { porSeccion, items, total } = listaDeCompras(semana.propuesta, despensa);
  const pendientes = items.filter((i) => !i.enDespensa);
  const enCarrito = pendientes.filter((i) => semana.comprados.includes(i.ingrediente.id)).length;

  function alternarComprado(id: string) {
    setSemana((s) =>
      s && {
        ...s,
        comprados: s.comprados.includes(id) ? s.comprados.filter((x) => x !== id) : [...s.comprados, id],
      },
    );
  }

  function alternarDespensa(id: string) {
    setDespensa((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  async function compartir() {
    const texto = textoListaCompras(semana!.propuesta, despensa);
    if (navigator.share) {
      try {
        await navigator.share({ text: texto });
        return;
      } catch {
        /* cancelado: copiar como respaldo */
      }
    }
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lista del súper</h1>
          <p className="text-sm text-suave">
            {enCarrito}/{pendientes.length} en el carrito · aprox. ${Math.round(total)}
          </p>
        </div>
        <button className="boton-secundario text-sm" onClick={compartir}>
          {copiado ? "¡Copiada!" : "Compartir"}
        </button>
      </header>

      {[...porSeccion].map(([seccion, lista]) => {
        const porComprar = lista.filter((i) => !i.enDespensa);
        if (!porComprar.length) return null;
        return (
          <section key={seccion} className="tarjeta">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-suave">{seccion}</h2>
            <ul className="divide-y divide-borde">
              {porComprar.map((i) => {
                const hecho = semana.comprados.includes(i.ingrediente.id);
                return (
                  <li key={i.ingrediente.id} className="flex items-center gap-3 py-2.5">
                    <input
                      type="checkbox"
                      className="size-5 accent-[var(--acento)]"
                      checked={hecho}
                      onChange={() => alternarComprado(i.ingrediente.id)}
                      aria-label={i.ingrediente.nombre}
                    />
                    <div className={`flex-1 ${hecho ? "text-suave line-through" : ""}`}>
                      <div className="font-medium">{i.ingrediente.nombre}</div>
                      <div className="text-xs text-suave">
                        {i.unidades} × {i.ingrediente.unidadCompra} · usas {formatoCantidad(i.gramos)} ·{" "}
                        {i.ingrediente.tienda}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm tabular-nums">${Math.round(i.costo)}</div>
                      <button className="text-[11px] text-azul" onClick={() => alternarDespensa(i.ingrediente.id)}>
                        Ya lo tengo
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {items.some((i) => i.enDespensa) && (
        <section className="tarjeta">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-suave">Ya tienes en casa</h2>
          <ul className="space-y-1.5 text-sm">
            {items
              .filter((i) => i.enDespensa)
              .map((i) => (
                <li key={i.ingrediente.id} className="flex justify-between gap-2">
                  <span>
                    {i.ingrediente.nombre} <span className="text-suave">({formatoCantidad(i.gramos)})</span>
                  </span>
                  <button className="text-xs text-azul" onClick={() => alternarDespensa(i.ingrediente.id)}>
                    Se me acabó
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

      <section className="tarjeta space-y-2">
        <label className="block text-sm font-medium" htmlFor="gasto">
          ¿Cuánto pagaste en total? (para tu conteo de ahorro)
        </label>
        <input
          id="gasto"
          type="number"
          inputMode="decimal"
          className="campo"
          placeholder={`Aprox. ${Math.round(total)}`}
          value={semana.gastoReal ?? ""}
          onChange={(e) =>
            setSemana((s) => s && { ...s, gastoReal: e.target.value ? Number(e.target.value) : undefined })
          }
        />
      </section>

      <Link href="/cocinar" className="boton w-full">
        Listo, a cocinar 🍳
      </Link>
    </div>
  );
}
