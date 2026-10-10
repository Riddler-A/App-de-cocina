"use client";

export function Estrellas({ valor, onCambiar }: { valor: number; onCambiar: (n: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} estrellas`}
          className={`text-2xl leading-none ${n <= valor ? "" : "opacity-25 grayscale"}`}
          onClick={() => onCambiar(n)}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
