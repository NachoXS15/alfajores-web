// Exportación estática: `npm run build` genera la carpeta /out, lista para subir a cualquier hosting.
//
// Variables opcionales (solo al compilar):
//   BASE_PATH=/tienda   si el sitio va a vivir en una subcarpeta (https://midominio.com/tienda)
//   NEXT_PUBLIC_REL=1   rutas relativas; lo usa scripts/build-artifact.mjs
const rel = process.env.NEXT_PUBLIC_REL === '1';
const base = rel ? '' : (process.env.BASE_PATH || '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  // /emprendimiento/ => out/emprendimiento/index.html (funciona en cualquier hosting sin reglas extra)
  trailingSlash: !rel,
  ...(base ? { basePath: base } : {}),
  ...(rel ? { assetPrefix: './' } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: base },
};

export default nextConfig;
