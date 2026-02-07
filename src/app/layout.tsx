import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NextAuthProvider } from '@/lib/NextAuthProvider';

export const metadata: Metadata = {
  title: 'Coworker',
  description: 'MVP版',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <NextAuthProvider>
          <div className="flex min-h-screen">
            <main className="flex-1 p-6 overflow-hidden">{children}</main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
