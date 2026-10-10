"use client";

import { useEffect, useState } from "react";
import { urlImagenes } from "@/lib/calculos";

/** Foto de referencia (Pexels si hay API key) o enlace a Google Imágenes. */
export function FotoPlatillo({ busqueda, nombre }: { busqueda: string; nombre: string }) {
  const [url, setUrl] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/imagen?q=${encodeURIComponent(busqueda)}`)
      .then((r) => r.json())
      .then((d: { url: string | null }) => vivo && setUrl(d.url))
      .catch(() => vivo && setUrl(null));
    return () => {
      vivo = false;
    };
  }, [busqueda]);

  const enlace = urlImagenes(busqueda);

  if (url) {
    return (
      <a href={enlace} target="_blank" rel="noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element -- imagen externa de Pexels */}
        <img src={url} alt={nombre} className="h-40 w-full rounded-xl object-cover" loading="lazy" />
      </a>
    );
  }

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noreferrer"
      className="flex h-24 w-full items-center justify-center gap-2 rounded-xl bg-acento-suave text-sm font-medium text-acento"
    >
      📷 Ver fotos de “{busqueda}”
    </a>
  );
}
