import '../globals.css';
import SideNav from '@/components/SideNav';
import { NextAuthProvider } from '@/lib/NextAuthProvider';

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
