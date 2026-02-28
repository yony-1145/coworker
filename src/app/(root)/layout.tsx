import type { Metadata } from 'next';
import '../globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import SideNav from '@/components/SideNav';
import { NextAuthProvider } from '@/lib/NextAuthProvider';

const siteDescription =
  '作業に最適な場所をもっと簡単に見つけよう。Coworkerは「みんなで作る」作業場所を見つけるための地図アプリです。';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  title: 'Coworker',
  description: siteDescription,
  applicationName: 'Coworker',
  keywords: ['Coworker', '作業場所', 'カフェ', 'コワーキング', '地図アプリ'],
  icons: {
    icon: '/coworker.jpg',
  },
  openGraph: {
    type: 'website',
    title: 'Coworker',
    description: siteDescription,
    siteName: 'Coworker',
    images: [
      { url: '/coworker.jpg', width: 512, height: 512, alt: 'Coworker' },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Coworker',
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        <SideNav />
        <main className="flex-1 p-6 overflow-hidden text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </NextAuthProvider>
  );
}
