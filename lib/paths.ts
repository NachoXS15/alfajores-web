// Rutas del sitio.
// - Build normal: absolutas (/emprendimiento/), con prefijo opcional BASE_PATH si va en una subcarpeta.
// - Build "artifact" (NEXT_PUBLIC_REL=1): relativas y apuntando a archivos .html.
const REL = process.env.NEXT_PUBLIC_REL === '1';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const asset = (p: string) => (REL ? '.' + p : BASE + p);

export type Ruta = 'inicio' | 'emprendimiento' | 'catalogo';

export function pagina(r: Ruta): string {
  if (REL) return r === 'inicio' ? 'inicio.html' : `${r}.html`;
  return r === 'inicio' ? `${BASE}/` : `${BASE}/${r}/`;
}

/** Dirección de cada herramienta dentro del marco de su página. */
export function appSrc(r: 'emprendimiento' | 'catalogo'): string {
  return asset(`/apps/${r}/index.html`);
}
