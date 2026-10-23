'use client';
import { useState, type ReactNode } from 'react';

export type Item = { titulo: string; contenido: ReactNode };

/** Acordeón: se abre un ítem y se cierran los demás. Se usa en módulos y preguntas frecuentes. */
export default function Accordion({ items, id }: { items: Item[]; id?: string }) {
  const [abierto, setAbierto] = useState<number | null>(null);
  return (
    <div className="faq" id={id}>
      {items.map((it, i) => {
        const on = abierto === i;
        return (
          <div key={it.titulo}>
            <button aria-expanded={on} onClick={() => setAbierto(on ? null : i)}>
              {it.titulo}
            </button>
            <div className={'a' + (on ? ' on' : '')}>{it.contenido}</div>
          </div>
        );
      })}
    </div>
  );
}
