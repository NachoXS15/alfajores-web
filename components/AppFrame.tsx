import { appSrc, pagina } from '@/lib/paths';

type Props = { actual: 'emprendimiento' | 'catalogo'; titulo: string };

/** Barra del sitio + herramienta cargada a pantalla completa en un marco aislado. */
export default function AppFrame({ actual, titulo }: Props) {
  const links = [
    { r: 'emprendimiento', t: 'Mi Emprendimiento' },
    { r: 'catalogo', t: 'Mi Catálogo' },
  ] as const;
  return (
    <div className="shell">
      <header className="sitebar">
        <a className="back" href={pagina('inicio')}>
          <span aria-hidden="true">←</span> Inicio
        </a>
        <span className="brand">Emprende Dulce</span>
        <nav aria-label="Herramientas del curso">
          {links.map((l) => (
            <a key={l.r} href={pagina(l.r)} aria-current={l.r === actual ? 'page' : undefined}>
              {l.t}
            </a>
          ))}
        </nav>
      </header>
      <iframe className="tool" src={appSrc(actual)} title={titulo} />
    </div>
  );
}
