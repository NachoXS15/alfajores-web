'use client';
import { useEffect, useState } from 'react';
import { HOTMART_URL } from '@/lib/site';

/** Botón fijo de compra (celular): aparece cuando el hero sale de la pantalla. */
export default function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((a) => setShow(!a[0].isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div id="sticky" className={show ? 'show' : ''}>
      <a className="btn" href={HOTMART_URL} target="_blank" rel="noopener">QUIERO EMPEZAR HOY</a>
    </div>
  );
}
