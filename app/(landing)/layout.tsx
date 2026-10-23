import type { Metadata } from 'next';
import './landing.css';

export const metadata: Metadata = {
  title: 'Alfajores Irresistibles | Aprendé a hacer alfajores y emprendé desde casa',
  description:
    'Programa online para preparar alfajores de distintos sabores desde tu casa y empezar tu emprendimiento. 5 recetas, bonos, certificado y 7 días de garantía.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍪</text></svg>",
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Poppins:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
