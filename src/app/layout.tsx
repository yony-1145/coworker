import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NextAuthProvider } from '@/lib/NextAuthProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    icon: [
      { url: '/coworker.jpg', type: 'image/jpeg', sizes: '512x512' },
    ],
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

const themeInitScript = `
(function(){
  var k='coworker-theme';
  try {
    var s=localStorage.getItem(k);
    var t=s==='dark'||s==='light'?s:'light';
    var r=document.documentElement;
    r.classList.remove('light','dark');
    r.classList.add(t);
  }catch(e){}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/coworker.jpg" type="image/jpeg" sizes="512x512" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextAuthProvider>
          <div className="flex min-h-screen bg-white dark:bg-gray-900">
            <div className="fixed right-4 top-4 z-50 md:right-6 md:top-6">
              <ThemeToggle />
            </div>
            <main className="flex-1 p-6 overflow-hidden text-gray-900 dark:text-gray-100">
              {children}
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
