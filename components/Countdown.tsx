'use client';
import { useEffect, useState } from 'react';

const DIA = 864e5;
const p = (n: number) => String(n).padStart(2, '0');

/** Contador de 24 h que se reinicia solo. El inicio se guarda en este navegador. */
export default function Countdown() {
  const [t, setT] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    let t0 = Date.now();
    try {
      const s = Number(localStorage.getItem('ad_t0'));
      if (s && Date.now() - s < DIA) t0 = s;
      else localStorage.setItem('ad_t0', String(t0));
    } catch {}
    const tick = () => {
      const r = DIA - ((Date.now() - t0) % DIA);
      setT({
        h: p(Math.floor(r / 36e5)),
        m: p(Math.floor((r % 36e5) / 6e4)),
        s: p(Math.floor((r % 6e4) / 1e3)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="cd" aria-label="Tiempo restante de la oferta">
      <div><span>{t.h}</span><small>horas</small></div>
      <div><span>{t.m}</span><small>min</small></div>
      <div><span>{t.s}</span><small>seg</small></div>
    </div>
  );
}
