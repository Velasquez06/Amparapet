import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ampara Pet',
  description: 'Marketplace de serviços para pets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
