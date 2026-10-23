# Alfajores Irresistibles · sitio Next.js

Página de venta del curso más las dos herramientas bonus, todo en un solo proyecto.

| Ruta | Qué es |
| --- | --- |
| `/` | Página de venta (incluye los 2 bonus estrella) |
| `/emprendimiento/` | Mi Emprendimiento Dulce (gestión de costos, precios, pedidos, ventas) |
| `/catalogo/` | Catálogo Dulce (armado de catálogos con fotos y precios) |

## Usarlo en tu máquina

Necesitás [Node.js](https://nodejs.org) 18.18 o superior (se recomienda la versión LTS).

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Los cambios se ven al guardar.

## Generar el sitio para publicar

```bash
npm run build
```

Se crea la carpeta `out/`: es un sitio estático (HTML, CSS, JS e imágenes). No necesita Node ni servidor en el hosting.
Para probarlo antes de subirlo: `npm start` y abrí la dirección que muestra.

## Desplegarlo en un hosting

**Hosting tradicional (cPanel, Hostinger, DonWeb, FTP, etc.)**
Subí el contenido de `out/` (no la carpeta en sí) a `public_html`. Listo.

**Netlify**
Conectá el repositorio, o arrastrá la carpeta `out/` a https://app.netlify.com/drop.
Si lo conectás: comando de build `npm run build`, carpeta a publicar `out`.

**Vercel**
Importá el repositorio. Detecta Next.js solo, sin configuración extra.

**GitHub Pages**
Subí el contenido de `out/` a la rama `gh-pages`, o usá una acción de GitHub que ejecute `npm run build` y publique `out/`.

**Si el sitio va en una subcarpeta** (por ejemplo `https://midominio.com/tienda`):

```bash
BASE_PATH=/tienda npm run build
```

En Windows (PowerShell): `$env:BASE_PATH="/tienda"; npm run build`.
Después subí el contenido de `out/` a esa subcarpeta.

## Dónde editar

- `lib/site.ts`: link de pago de Hotmart, WhatsApp e Instagram.
- `lib/landing-data.ts`: testimonios, avisos de actividad, módulos del programa y texto de los 2 bonus estrella.
- `app/(landing)/page.tsx`: estructura y textos de la página de venta. Estilos en `app/(landing)/landing.css`.
- `components/BonusEstrella.tsx`: bloque de los bonus estrella.
- `public/media/`: imágenes de la página de venta. Podés reemplazarlas conservando el nombre.
- `public/apps/emprendimiento/` y `public/apps/catalogo/`: las dos herramientas con su código original.

Los textos que son de ejemplo (alumnos, testimonios, precios tachados) están marcados con comentarios: cambialos por datos reales antes de publicar.

## Notas

- Las dos herramientas guardan los datos en el navegador de cada persona (localStorage). No hay base de datos ni cuentas.
- Las páginas `/emprendimiento/` y `/catalogo/` son públicas. Si son bonus solo para quienes compran, conviene alojarlas aparte o protegerlas desde el hosting.
- `npm run build:artifact` genera una variante con rutas relativas (carpeta `artifact/`) para publicarla como artifact de Claude. No hace falta para un hosting normal.
