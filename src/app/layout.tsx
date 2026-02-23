import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NextAuthProvider } from '@/lib/NextAuthProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Coworker',
  description: 'MVP版',
  icons: {
    icon: '/coworker.jpg',
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
