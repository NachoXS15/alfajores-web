import { estrellas } from '@/lib/landing-data';
import { asset } from '@/lib/paths';

const Estrella = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.300 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9z" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.500l4.500 4.500L19 7.500" />
  </svg>
);

/** Bloque de los 2 bonus estrella: Catálogo Dulce y Mi Emprendimiento Dulce. */
export default function BonusEstrella() {
  return (
    <div className="stars">
      <div className="stars-h">
        <span className="tag star-tag"><Estrella /> Bonus estrella</span>
        <h2>2 bonus estrella para llevar tu emprendimiento al siguiente nivel</h2>
        <p className="stars-sub">
          No solo aprendés a hacer alfajores irresistibles. También obtenés herramientas para presentar tus productos y organizar tu negocio.
        </p>
        <p>
          Empezar un emprendimiento implica mucho más que preparar algo rico. También necesitás mostrar lo que ofrecés de una manera atractiva y tener organizada la información de tu negocio.
        </p>
        <p>
          Por eso, con <b>Alfajores Irresistibles</b>, vas a recibir dos herramientas digitales diseñadas para acompañarte en ese camino.
        </p>
      </div>

      {estrellas.map((e) => (
        <article key={e.n} className="card star">
          {/* Texto arriba */}
          <header className="star-top">
            <span className="tag star-tag"><Estrella /> Bonus estrella N.º {e.n}</span>
            <h3 className="nm">{e.nombre}</h3>
            <p className="tl">{e.bajada}</p>
            <p>{e.desc}</p>
          </header>
          <div className="star-cols">
            <div>
              <h4>¿Qué vas a poder hacer?</h4>
              <ul className="checks">
                {e.acciones.map(([t, d]) => (
                  <li key={t}><Check /><span><b>{t}:</b> {d}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>¿Para qué te sirve?</h4>
              <p>{e.utilidad}</p>
              <p className="res">{e.cierre}</p>
            </div>
          </div>

          {/* Imágenes abajo */}
          <div className={'star-imgs n' + e.imgs.length}>
            {e.imgs.map((im) => (
              <figure key={im.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(im.src)} alt={im.alt} width={im.w} height={im.h} loading="lazy" />
                {im.cap && <figcaption>{im.cap}</figcaption>}
              </figure>
            ))}
          </div>
          <p className="star-note">Imágenes de ejemplo con datos ficticios</p>
        </article>
      ))}

      <div className="closer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/media/collage.jpg')} alt="De la idea al alfajor terminado: amasar, hornear, rellenar, bañar y armar la caja de regalo" width={1200} height={1280} loading="lazy" />
        <div>
          <h3>Tu idea merece más que una receta</h3>
          <p>
            Con <b>Alfajores Irresistibles</b>, aprendés a elaborar tus alfajores y sumás herramientas para empezar a dar forma a tu emprendimiento.
          </p>
          <p><b>Catálogo Dulce</b> te ayuda a organizar y presentar tus productos.</p>
          <p><b>Mi Emprendimiento Dulce</b> te ayuda a gestionar los números y la organización de tu negocio.</p>
          <p className="fin-l">
            Dos herramientas. Dos funciones complementarias. Un mismo objetivo: ayudarte a avanzar con tu emprendimiento de alfajores desde casa.
          </p>
        </div>
      </div>

      <h3 className="mas">Y además, 6 bonos más</h3>
    </div>
  );
}
