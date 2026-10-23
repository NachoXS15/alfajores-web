'use client';
import { useEffect, useRef, useState } from 'react';
import { popups } from '@/lib/landing-data';

type Pop = { i: number; mins: number; in: boolean };

// Pausa entre avisos, variable: 30% cortas (6-12 s), 50% medias (12-25 s), 20% largas (28-50 s).
const pausa = () => {
  const r = Math.random();
  return r < 0.3 ? 6e3 + Math.random() * 6e3 : r < 0.8 ? 12e3 + Math.random() * 13e3 : 28e3 + Math.random() * 22e3;
};

/** Avisos de actividad: mazo mezclado, sin repetir hasta completar la vuelta. */
export default function Popups() {
  const [pop, setPop] = useState<Pop | null>(null);
  const mazo = useRef<number[]>([]);
  const last = useRef(-1);
  const timers = useRef<{ hide?: ReturnType<typeof setTimeout>; next?: ReturnType<typeof setTimeout> }>({});
  const hideRef = useRef<() => void>(() => {});

  useEffect(() => {
    const sig = () => {
      if (!mazo.current.length) {
        const m = popups.map((_, k) => k);
        for (let k = m.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [m[k], m[j]] = [m[j], m[k]];
        }
        if (m[m.length - 1] === last.current) [m[0], m[m.length - 1]] = [m[m.length - 1], m[0]];
        mazo.current = m;
      }
      return mazo.current.pop() as number;
    };
    const hide = () => {
      clearTimeout(timers.current.hide);
      setPop((c) => (c ? { ...c, in: false } : c));
      setTimeout(() => setPop(null), 500);
      clearTimeout(timers.current.next);
      timers.current.next = setTimeout(show, pausa());
    };
    const show = () => {
      const i = sig();
      last.current = i;
      setPop({ i, mins: 2 + Math.floor(Math.random() * 57), in: false });
      requestAnimationFrame(() => requestAnimationFrame(() => setPop((c) => (c ? { ...c, in: true } : c))));
      timers.current.hide = setTimeout(hide, 6e3);
    };
    hideRef.current = hide;
    timers.current.next = setTimeout(show, 8e3);
    const t = timers.current;
    return () => {
      clearTimeout(t.hide);
      clearTimeout(t.next);
    };
  }, []);

  const d = pop ? popups[pop.i] : null;
  return (
    <div id="pops" aria-live="polite">
      {pop && d && (
        <div className={'pop' + (pop.in ? ' in' : '')}>
          <div className="ini">{d[0][0]}</div>
          <div>
            <b>{d[0]} · {d[1]}</b>
            {d[2]}
            <br />
            <em>hace {pop.mins} minutos</em>
          </div>
          <button className="x" aria-label="Cerrar" onClick={() => hideRef.current()}>×</button>
        </div>
      )}
    </div>
  );
}
