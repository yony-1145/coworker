import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import SideNav from '@/components/SideNav';
import { NextAuthProvider } from '@/lib/NextAuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
            <SideNav />
            <main className="flex-1 p-6 overflow-hidden">{children}</main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
