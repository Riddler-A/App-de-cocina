"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const RUTAS = [
  { href: "/", etiqueta: "Semana", icono: "📅" },
  { href: "/planear", etiqueta: "Planear", icono: "✨" },
  { href: "/compras", etiqueta: "Súper", icono: "🛒" },
  { href: "/cocinar", etiqueta: "Cocinar", icono: "🍳" },
  { href: "/perfil", etiqueta: "Perfil", icono: "👤" },
];

export function NavInferior() {
  const ruta = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-borde bg-superficie/95 backdrop-blur">
      <ul className="mx-auto flex max-w-xl justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {RUTAS.map((r) => {
          const activa = r.href === "/" ? ruta === "/" : ruta.startsWith(r.href);
          return (
            <li key={r.href} className="flex-1">
              <Link
                href={r.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs ${activa ? "font-semibold text-acento" : "text-suave"}`}
              >
                <span className="text-xl" aria-hidden>
                  {r.icono}
                </span>
                {r.etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
