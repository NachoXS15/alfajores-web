import BonusEstrella from '@/components/BonusEstrella';
import Accordion, { type Item } from '@/components/Accordion';
import Countdown from '@/components/Countdown';
import Popups from '@/components/Popups';
import StickyCta from '@/components/StickyCta';
import { modulos, testimonios } from '@/lib/landing-data';
import { asset, pagina } from '@/lib/paths';
import { HOTMART_URL, INSTAGRAM_URL, WHATSAPP_URL } from '@/lib/site';

const moduloItems: Item[] = modulos.map(([titulo, lista]) => ({
  titulo,
  contenido: (
    <ul>
      {lista.map((s) => (
        <li key={s} className={/^Paso/.test(s) ? 'st' : undefined}>{s}</li>
      ))}
    </ul>
  ),
}));

const faqItems: Item[] = [
  ['¿Es caro?', 'Pagás una sola vez $49.99. Con la ganancia de tus primeras docenas, ya lo recuperás. Y tenés 7 días de garantía.'],
  ['¿Cuánto tiempo necesito?', 'El que vos tengas. Las clases son cortas y las ves a tu ritmo, cuando puedas. El acceso no vence.'],
  ['¿Me va a servir si nunca cociné?', 'Sí. Está pensado para quien empieza de cero. Cada técnica se explica en video, paso a paso. Si ya cocinás, vas a sumar sabores y método de negocio.'],
  ['¿Tengo ayuda si me trabo?', 'Sí. Escribinos por WhatsApp o por Instagram @somosemprendedulce y te respondemos.'],
  ['¿Cómo accedo al programa?', 'Apenas pagás, Hotmart te manda el acceso a tu mail. Entrás desde el celular o la computadora.'],
  ['¿Qué formas de pago hay?', 'Pagás en la página segura de Hotmart. Vas a ver los medios disponibles en tu país, como tarjeta y otros.'],
].map(([titulo, txt]) => ({ titulo, contenido: <p>{txt}</p> }));

const Cta = ({ children = 'QUIERO EMPEZAR HOY' }: { children?: string }) => (
  <a className="btn" href={HOTMART_URL} target="_blank" rel="noopener">{children}</a>
);

const iconos = [
  <path key="a" d="M12 3v8M8 5l2 6M16 5l-2 6M7 11h10l-1.500 9h-7z" />,
  <path key="b" d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z" />,
  <g key="c"><circle cx="12" cy="12" r="8" /><path d="M12 7.500v9M14.500 9.500h-3.500a1.700 1.700 0 0 0 0 3.400h2a1.700 1.700 0 0 1 0 3.400H9.500" /></g>,
  <path key="d" d="M4 20h5v-5h5v-5h6M17 4l3 3-3 3" />,
  <path key="e" d="M5 19l8-8M13 11l4-4a3 3 0 0 0-4-4L9 7z" />,
  <g key="f"><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></g>,
];

const aprendes: [string, string][] = [
  ['Técnicas simples y sabrosas', 'Prepararás alfajores ricos y te destacarás en el mercado.'],
  ['Sabores irresistibles', 'Crearás combinaciones y presentaciones que enamorarán a tus clientes.'],
  ['Más ganancia, menos costos', 'Optimizarás la producción y ganarás más desde casa.'],
  ['Para todos los niveles', 'Empezarás de cero o con práctica. Tendrás la visión completa del negocio.'],
  ['Materiales y herramientas', 'Conocerás todo lo necesario para un trabajo de calidad.'],
  ['Certificado', 'Avalado por Hotmart y Seminarios Online.'],
];

export default function Home() {
  return (
    <>
      {/* HERO: la promesa es lo primero */}
      <header className="hero">
        <div className="wrap hero-g" style={{ gridTemplateColumns: '1fr', maxWidth: 880, textAlign: 'center' }}>
          <div>
            <h1>
              Aprendé a hacer alfajores irresistibles en <mark>7 días</mark> y convertilos en una gran oportunidad de negocio
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tv" width={560} height={315} alt="Preparando la masa de alfajores" src={asset('/media/tv.webp')} />
            <p className="sub">
              Tu emprendimiento no tiene por qué empezar en un local. Puede empezar en tu cocina, vendiendo desde casa y con bajo presupuesto.
            </p>
            <Cta />
            <p className="small">Pago seguro por Hotmart · 7 días de garantía</p>
          </div>
        </div>
      </header>

      {/* BARRA DE CREDIBILIDAD: datos de ejemplo, cambialos por los reales */}
      <div className="bar">
        <div className="wrap">
          <div><b>+1.800</b><span>alumnos</span></div>
          <div><b>5</b><span>recetas con fotos del paso a paso</span></div>
          <div><b>+30</b><span>videos explicativos</span></div>
          <div><b>7 días</b><span>de garantía total</span></div>
        </div>
      </div>

      {/* SOLUCIÓN Y TRANSFORMACIÓN */}
      <section className="alt">
        <div className="wrap">
          <h2>Un negocio dulce, simple y desde tu casa</h2>
          <p className="lead">
            Emprende Dulce te enseña a cocinar una gran variedad de alfajores irresistibles, a presentarlos bonito y venderlos con ganancia. Todo en un solo programa.
          </p>
          <div className="foto sq" data-foto="producto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Alfajores de chocolate y dulce de leche" src={asset('/media/producto.jpg')} />
          </div>
          <div className="ba">
            <div className="card">
              <h3>Antes</h3>
              <ul>
                <li>¿Y si no me salen bien? Soy principiante</li>
                <li>¿Necesito mucho dinero para empezar?</li>
                <li>¿Cómo calculo lo que me cuesta?</li>
                <li>¿Cómo consigo clientes?</li>
                <li>¿Cuánto debería cobrar?</li>
              </ul>
            </div>
            <div className="card des">
              <h3>Después</h3>
              <ul>
                <li>Aprendés a elaborar alfajores paso a paso y desarrollás la seguridad para empezar</li>
                <li>Identificás lo necesario para poner en marcha tu idea y planificás mejor tu inversión</li>
                <li>Calculás costos, ganancias y rentabilidad con herramientas prácticas en Excel</li>
                <li>Aprendés estrategias para presentar, promocionar y ofrecer tus alfajores</li>
                <li>Calculás un precio de venta basado en tus costos y el margen que querés obtener</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section>
        <div className="wrap">
          <h2>Qué incluye el programa</h2>
          <p className="lead">Todo lo que necesitás para empezar, en un solo acceso.</p>
          <div className="grid g3">
            <div className="card"><h3>Curso en video por módulos</h3><p>Clases cortas y claras, de la masa al empaque.</p></div>
            <div className="card"><h3>Recetario de 5 variedades</h3><p>Cantidades exactas y técnicas para cada sabor.</p></div>
            <div className="card"><h3>Guía de materiales y herramientas</h3><p>Qué comprar, para qué sirve y qué podés evitar.</p></div>
            <div className="card"><h3>Método de costos y precios</h3><p>Calculá cuánto cuesta cada alfajor y cuánto cobrar.</p></div>
            <div className="card"><h3>Certificado</h3><p>Avalado por Hotmart y Seminarios Online.</p></div>
          </div>
          <h3 style={{ textAlign: 'center', fontSize: '1.5rem', margin: '48px 0 8px' }}>¿Cómo lo vas a lograr?</h3>
          <p className="lead">A través del siguiente contenido, estructurado paso a paso. Tocá cada módulo para ver qué incluye.</p>
          <Accordion id="mods" items={moduloItems} />
        </div>
      </section>

      {/* LO QUE APRENDERÁS */}
      <section className="alt">
        <div className="wrap">
          <h2>Lo que aprenderás</h2>
          <p className="lead">Seis cosas que cambian cuando terminás el programa.</p>
          <div className="grid g3">
            {aprendes.map(([t, d], i) => (
              <div className="card" key={t}>
                <div className="ic"><svg viewBox="0 0 24 24">{iconos[i]}</svg></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACERCA DE LA PRODUCTORA */}
      <section>
        <div className="wrap about" style={{ maxWidth: 760, gridTemplateColumns: '1fr' }}>
          <div>
            <h2 style={{ textAlign: 'left' }}>Acerca de la productora</h2>
            <p>Desarrollado por <b>Paola Costales</b>, ama de casa, apasionada por los alfajores, emprendedora, Ing. Comercial y Diseñadora Gráfica de profesión.</p>
            <p>Ha creado este curso con el principal objetivo de brindar recetas prácticas, sencillas y ganadoras. Con mucho amor y entusiasmo ofrece este curso para que le saques el máximo provecho y te animes a empezar con tu negocio desde casa, porque puedes tener un negocio rentable desde casa con la venta de alfajores.</p>
            <p><b>CONVIERTE TU PASIÓN EN NEGOCIO.</b></p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS: de ejemplo, reemplazalos por reales (lib/landing-data.ts) */}
      <section className="alt">
        <div className="wrap">
          <h2>Lo que cuentan quienes ya empezaron</h2>
          <p className="lead">&nbsp;</p>
          <div className="grid g3">
            {testimonios.map(([nombre, ciudad, resultado, frase]) => (
              <div className="card" key={nombre}>
                <div className="t-h">
                  <div className="ini">{nombre[0]}</div>
                  <div><b>{nombre}</b><small>{ciudad}</small></div>
                </div>
                <p>“{frase}”</p>
                <div className="res">{resultado}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO, BONOS Y OFERTA */}
      <section>
        <div className="wrap">
          <h2>Tu acceso, con bonos de regalo</h2>
          <p className="lead">Un solo pago. Acceso inmediato.</p>
          <div className="pwrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kit" width={900} height={900} alt="Kit Emprende Dulce: curso en video, ebook de recetas, tablas en Excel y bonos" src={asset('/media/kit.jpg')} />
            <div className="card price">
              <p><span className="old">$79.99</span><span className="off">-38%</span></p>
              <div className="now">$49.99</div>
              <p>Pago único · Precio en dólares (USD)</p>
              <Countdown />
              <Cta />
              <p className="small">7 días de garantía · Pago seguro por Hotmart</p>
            </div>
          </div>
          <BonusEstrella />
          <div className="bonos">
            <div className="card"><span className="tag">Bono 1</span><h3>5 recetarios en PDF y libro digital</h3><ul><li>Alfajores de maicena</li><li>Alfajores marplatenses</li><li>Alfajores de frutos rojos</li><li>Alfajores de ganache coco limón</li><li>Alfajores de crema Bavaria</li></ul><p style={{ fontSize: '.9rem', marginTop: 6 }}>Con fotografías del proceso.</p></div>
            <div className="card"><span className="tag">Bono 2</span><h3>Rentabilidad y costos</h3><p>Video que justifica la rentabilidad del negocio y tips para calcular precios y costos, con tabla Excel.</p></div>
            <div className="card"><span className="tag">Bono 3</span><h3>Ideas de fotos para tus redes</h3><p>Variedad de fotos para ofrecer tus alfajores en fechas especiales y estaciones del año.</p></div>
            <div className="card"><span className="tag">Bono 4</span><h3>6 mensajes de gracias para imprimir</h3><p>Diseños listos en Adobe Illustrator.</p></div>
            <div className="card"><span className="tag">Bono 5</span><h3>3 tarjetas de mensajes para imprimir</h3><p>Diseños listos en Adobe Illustrator.</p></div>
            <div className="card"><span className="tag">Bono 6</span><h3>Tarjetas y menús editables</h3><ul><li>Tarjeta Día de la Amistad</li><li>Tarjeta de Navidad</li><li>2 menús editables para imprimir</li></ul><p style={{ fontSize: '.9rem', marginTop: 6 }}>Todo en Adobe Illustrator.</p></div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section>
        <div className="wrap">
          <h2>Preguntas frecuentes</h2>
          <p className="lead">&nbsp;</p>
          <Accordion id="faq" items={faqItems} />
        </div>
      </section>

      {/* CIERRE FINAL */}
      <section className="fin">
        <div className="wrap">
          <h2>Aprendé a hacer alfajores perfectos y empezá tu emprendimiento hoy</h2>
          <p className="lead">La oferta de hoy termina en:</p>
          <Countdown />
          <Cta />
          <p className="small">7 días de garantía · Acceso inmediato</p>
        </div>
      </section>

      <footer>
        <p><b>Emprende Dulce</b></p>
        <p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener">Instagram @somosemprendedulce</a> ·{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">WhatsApp</a>
        </p>
        <p>
          Herramientas del curso: <a href={pagina('emprendimiento')}>Mi Emprendimiento Dulce</a> ·{' '}
          <a href={pagina('catalogo')}>Mi Catálogo Dulce</a>
        </p>
        <p style={{ fontSize: '.8rem', opacity: 0.7 }}>© 2026 Emprende Dulce. Todos los derechos reservados.</p>
      </footer>

      <StickyCta />
      <a id="wa" href={WHATSAPP_URL} target="_blank" rel="noopener" aria-label="Consultanos por WhatsApp">
        <svg viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm5.200 13.800c-.2.600-1.300 1.200-1.800 1.200-.5.100-1 .2-3.200-.7-2.700-1.100-4.400-3.800-4.600-4-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.300 0 .5l-.3.500-.4.400c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.200 1.300 2.500 1.500.3.100.5.100.6-.1l.9-1c.2-.3.400-.2.600-.1l1.900.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400z" />
        </svg>
      </a>
      <Popups />
    </>
  );
}
