import type { Metadata } from 'next';
import './apps.css';

export const metadata: Metadata = {
  title: 'Emprende Dulce | Herramientas del curso Alfajores Irresistibles',
  description: 'Herramientas de gestión y catálogo para tu emprendimiento de alfajores.',
};

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=DM+Sans:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
