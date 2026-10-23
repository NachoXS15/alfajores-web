// Genera la versión "artifact" del sitio en ./artifact:
//  - build estático con rutas relativas (NEXT_PUBLIC_REL=1)
//  - la portada pasa a inicio.html y index.html queda como entrada que redirige
//  - se renombra _next a next-assets y se quitan archivos que el artifact no usa
import { execSync } from 'node:child_process';
import { cpSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync, renameSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const run = (c, env = {}) => execSync(c, { stdio: 'inherit', env: { ...process.env, ...env } });

rmSync('.next', { recursive: true, force: true });
rmSync('out', { recursive: true, force: true });
rmSync('artifact', { recursive: true, force: true });
run('npx next build', { NEXT_PUBLIC_REL: '1' });
cpSync('out', 'artifact', { recursive: true });

// 1. Portada
renameSync('artifact/index.html', 'artifact/inicio.html');
rmSync('artifact/index.txt', { force: true });
rmSync('artifact/404.html', { force: true });
for (const f of readdirSync('artifact')) if (f.endsWith('.txt')) rmSync(join('artifact', f));

// 2. _next -> next-assets
if (existsSync('artifact/_next')) renameSync('artifact/_next', 'artifact/next-assets');
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
for (const f of walk('artifact')) {
  if (!['.html', '.js', '.css', '.json'].includes(extname(f))) continue;
  if (f.includes(join('artifact', 'apps'))) continue; // las herramientas no usan _next
  const s = readFileSync(f, 'utf8');
  if (s.includes('_next/')) writeFileSync(f, s.replaceAll('_next/', 'next-assets/'));
}

// 2b. Sin paréntesis en las rutas: (landing) -> landing, (apps) -> apps
const appDir = 'artifact/next-assets/static/chunks/app';
if (existsSync(appDir)) for (const d of readdirSync(appDir)) if (d.includes('(')) renameSync(join(appDir, d), join(appDir, d.replace(/[()]/g, '')));
for (const f of walk('artifact')) {
  if (!['.html', '.js', '.css', '.json'].includes(extname(f))) continue;
  if (f.includes(join('artifact', 'apps'))) continue;
  const s = readFileSync(f, 'utf8');
  if (/\((landing|apps)\)/.test(s)) writeFileSync(f, s.replace(/\((landing|apps)\)/g, '$1'));
}

// 2c. polyfills (solo navegadores muy viejos): contienen caracteres que el artifact rechaza
for (const f of walk('artifact')) {
  if (/polyfills-[^/]*\.js$/.test(f)) rmSync(f);
  else if (f.endsWith('.html') && !f.includes(join('artifact', 'apps'))) {
    const s = readFileSync(f, 'utf8');
    writeFileSync(f, s.replace(/<script src="[^"]*polyfills-[^"]*"[^>]*><\/script>/g, ''));
  }
}

// 3. Entrada: redirige a la portada
writeFileSync('artifact/index.html', `<title>Alfajores Irresistibles</title>
<meta name="description" content="Curso de alfajores artesanales con herramientas para tu emprendimiento: gestión, costos y catálogo.">
<meta http-equiv="refresh" content="0;url=inicio.html">
<style>
:root{--bg:#fbf3e2;--fg:#4e3c1d;--ac:#c04d28}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#241a10;--fg:#f1e6d1;--ac:#ee8a62;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#241a10;--fg:#f1e6d1;--ac:#ee8a62;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:16px/1.5 Nunito,system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding-inline:max(16px,env(safe-area-inset-left,0px))}
a{color:var(--ac);font-weight:700}
</style>
<p>Cargando Alfajores Irresistibles… <a href="inicio.html">Entrar</a></p>
<script>location.replace('inicio.html')</script>
`);
console.log('Artifact listo en ./artifact');
