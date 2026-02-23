import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NextAuthProvider } from '@/lib/NextAuthProvider';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { ThemeScript } from '@/components/ThemeScript';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Coworker',
  description: 'MVP版',
  icons: {
    icon: '/coworker.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <ThemeProvider>
          <NextAuthProvider>
            <div className="flex min-h-screen">
              <div className="fixed right-4 top-4 z-50 md:right-6 md:top-6">
                <ThemeToggle />
              </div>
              <main className="flex-1 p-6 overflow-hidden">{children}</main>
            </div>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
