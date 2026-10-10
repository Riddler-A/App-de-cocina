"use client";

import { useCallback, useSyncExternalStore } from "react";
import { INGREDIENTES } from "./ingredientes";
import { PERFIL_INICIAL, type Calificacion, type Perfil, type RegistroAhorro, type Semana } from "./tipos";

// Todo vive en el navegador del celular (localStorage). Es una app de una
// sola persona: no hace falta servidor de datos ni login.

const PREFIJO = "cocina:";
const oyentes = new Set<() => void>();
const cache = new Map<string, { raw: string | null; valor: unknown }>();

function leer<T>(clave: string, inicial: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PREFIJO + clave);
  } catch {
    return inicial;
  }
  const previo = cache.get(clave);
  if (previo && previo.raw === raw) return previo.valor as T;
  let valor: T = inicial;
  if (raw !== null) {
    try {
      valor = JSON.parse(raw) as T;
    } catch {
      valor = inicial;
    }
  }
  cache.set(clave, { raw, valor });
  return valor;
}

function suscribir(cb: () => void) {
  oyentes.add(cb);
  const alStorage = (e: StorageEvent) => e.key?.startsWith(PREFIJO) && cb();
  window.addEventListener("storage", alStorage);
  return () => {
    oyentes.delete(cb);
    window.removeEventListener("storage", alStorage);
  };
}

export function usePersistente<T>(clave: string, inicial: T) {
  const valor = useSyncExternalStore(
    suscribir,
    () => leer(clave, inicial),
    () => inicial,
  );
  const guardar = useCallback(
    (nuevo: T | ((prev: T) => T)) => {
      const actual = leer(clave, inicial);
      const siguiente = typeof nuevo === "function" ? (nuevo as (p: T) => T)(actual) : nuevo;
      try {
        localStorage.setItem(PREFIJO + clave, JSON.stringify(siguiente));
      } catch {
        /* almacenamiento lleno o bloqueado */
      }
      oyentes.forEach((cb) => cb());
    },
    // `inicial` es una constante de módulo en cada uso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clave],
  );
  return [valor, guardar] as const;
}

const DESPENSA_INICIAL = INGREDIENTES.filter((i) => i.despensa).map((i) => i.id);
const SIN_SEMANA: Semana | null = null;
const SIN_CALIFICACIONES: Calificacion[] = [];
const SIN_AHORRO: RegistroAhorro[] = [];

/** Combina con los valores iniciales por si se agregan campos nuevos al perfil. */
export function usePerfil() {
  const [perfil, setPerfil] = usePersistente<Perfil>("perfil", PERFIL_INICIAL);
  return [{ ...PERFIL_INICIAL, ...perfil }, setPerfil] as const;
}
export const useDespensa = () => usePersistente<string[]>("despensa", DESPENSA_INICIAL);
export const useSemana = () => usePersistente<Semana | null>("semana", SIN_SEMANA);
export const useCalificaciones = () => usePersistente<Calificacion[]>("calificaciones", SIN_CALIFICACIONES);
export const useAhorro = () => usePersistente<RegistroAhorro[]>("ahorro", SIN_AHORRO);
