"use client";

import { Estrellas } from "@/components/Estrellas";
import { useAhorro, useCalificaciones, useDespensa, usePerfil } from "@/lib/almacen";
import { calcularMetas } from "@/lib/calculos";
import { INGREDIENTES, ORDEN_SECCIONES } from "@/lib/ingredientes";
import { PERFIL_INICIAL, type Perfil } from "@/lib/tipos";

type CampoNumerico = { [K in keyof Perfil]: Perfil[K] extends number ? K : never }[keyof Perfil];

const CAMPOS: { clave: CampoNumerico; etiqueta: string }[] = [
  { clave: "pesoKg", etiqueta: "Peso (kg)" },
  { clave: "estaturaCm", etiqueta: "Estatura (cm)" },
  { clave: "edad", etiqueta: "Edad" },
  { clave: "diasGym", etiqueta: "Días de gym por semana" },
  { clave: "presupuestoMin", etiqueta: "Presupuesto mínimo ($)" },
  { clave: "presupuestoMax", etiqueta: "Presupuesto máximo ($)" },
  { clave: "gastoComidaFuera", etiqueta: "¿Cuánto gastarías en una comida fuera? ($)" },
  { clave: "comidasFrias", etiqueta: "Comidas frías por semana" },
];

export default function PerfilPagina() {
  const [perfil, setPerfil] = usePerfil();
  const [despensa, setDespensa] = useDespensa();
  const [calificaciones, setCalificaciones] = useCalificaciones();
  const [ahorro] = useAhorro();
  const metas = calcularMetas(perfil);

  const actualizar = <K extends keyof Perfil>(clave: K, valor: Perfil[K]) =>
    setPerfil((p) => ({ ...PERFIL_INICIAL, ...p, [clave]: valor }));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Perfil</h1>

      <section className="tarjeta space-y-2">
        <h2 className="font-semibold">Tus metas diarias para ganar masa</h2>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-acento-suave p-3">
            <div className="text-xl font-bold">{metas.kcal.toLocaleString("es-MX")}</div>
            <div className="text-xs text-suave">kcal al día</div>
          </div>
          <div className="rounded-lg bg-acento-suave p-3">
            <div className="text-xl font-bold">{metas.proteina} g</div>
            <div className="text-xs text-suave">
              proteína ({metas.proteinaMin}–{metas.proteinaMax} g)
            </div>
          </div>
        </div>
        <p className="text-xs text-suave">
          Gasto estimado (Mifflin-St Jeor × actividad) + ~400 kcal de superávit; proteína de 1.6–2.2 g por kg. Si en 3–4
          semanas tu peso no sube, aumenta ~200 kcal. Es una estimación: un nutriólogo deportivo puede afinarla.
        </p>
      </section>

      <section className="tarjeta space-y-3">
        <h2 className="font-semibold">Tus datos</h2>
        <div className="flex gap-2">
          {(["hombre", "mujer"] as const).map((s) => (
            <button
              key={s}
              className={perfil.sexo === s ? "boton flex-1" : "boton-secundario flex-1"}
              onClick={() => actualizar("sexo", s)}
            >
              {s === "hombre" ? "Hombre" : "Mujer"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CAMPOS.map(({ clave, etiqueta }) => (
            <label key={clave} className="text-sm">
              <span className="mb-1 block text-suave">{etiqueta}</span>
              <input
                type="number"
                inputMode="decimal"
                className="campo"
                value={perfil[clave]}
                onChange={(e) => actualizar(clave, Number(e.target.value))}
              />
            </label>
          ))}
        </div>
        <label className="block text-sm">
          <span className="mb-1 block text-suave">Notas para la IA (gustos, cosas que no comes…)</span>
          <textarea
            className="campo"
            rows={3}
            placeholder="Ej. Evito un poco los lácteos. No me gusta el hígado. Me encanta el picante."
            value={perfil.notas}
            onChange={(e) => actualizar("notas", e.target.value)}
          />
        </label>
      </section>

      <section className="tarjeta space-y-3">
        <h2 className="font-semibold">Despensa: lo que siempre tienes en casa</h2>
        <p className="text-xs text-suave">Lo marcado no aparece en tu lista del súper.</p>
        {ORDEN_SECCIONES.map((seccion) => (
          <details key={seccion}>
            <summary className="cursor-pointer text-sm font-medium">{seccion}</summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {INGREDIENTES.filter((i) => i.seccion === seccion).map((i) => {
                const tengo = despensa.includes(i.id);
                return (
                  <button
                    key={i.id}
                    className={`rounded-full border px-3 py-1 text-xs ${tengo ? "border-[var(--verde)] text-verde" : "border-borde text-suave"}`}
                    onClick={() => setDespensa((d) => (tengo ? d.filter((x) => x !== i.id) : [...d, i.id]))}
                  >
                    {tengo ? "✓ " : ""}
                    {i.nombre}
                  </button>
                );
              })}
            </div>
          </details>
        ))}
      </section>

      {calificaciones.length > 0 && (
        <section className="tarjeta space-y-2">
          <h2 className="font-semibold">Recetas calificadas</h2>
          <p className="text-xs text-suave">4–5 ⭐ la IA se inspira en ellas; 1–2 ⭐ las evita.</p>
          <ul className="divide-y divide-borde">
            {[...calificaciones].reverse().map((c) => (
              <li key={c.nombre} className="flex items-center justify-between gap-2 py-2 text-sm">
                <span>{c.nombre}</span>
                <Estrellas
                  valor={c.estrellas}
                  onCambiar={(n) =>
                    setCalificaciones((cs) => cs.map((x) => (x.nombre === c.nombre ? { ...x, estrellas: n } : x)))
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {ahorro.length > 0 && (
        <section className="tarjeta space-y-2">
          <h2 className="font-semibold">Historial de ahorro</h2>
          <ul className="space-y-1 text-sm">
            {[...ahorro].reverse().map((r) => (
              <li key={r.fecha} className="flex justify-between">
                <span className="text-suave">{new Date(r.fecha).toLocaleDateString("es-MX")}</span>
                <span>
                  súper ${Math.round(r.costo)} · <span className="text-verde">ahorro ${Math.round(r.ahorro)}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-suave">Ahorro = 5 comidas fuera − costo de los ingredientes que usaste (lo que sobra del súper te queda para otra semana).</p>
        </section>
      )}
    </div>
  );
}
