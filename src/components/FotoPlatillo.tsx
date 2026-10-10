import { urlImagenes } from "@/lib/calculos";

/** Enlace a fotos de referencia del platillo en Google Imágenes. */
export function FotoPlatillo({ busqueda }: { busqueda: string }) {
  return (
    <a
      href={urlImagenes(busqueda)}
      target="_blank"
      rel="noreferrer"
      className="flex h-24 w-full items-center justify-center gap-2 rounded-xl bg-acento-suave px-2 text-center text-sm font-medium text-acento"
    >
      📷 Ver fotos de “{busqueda}”
    </a>
  );
}
