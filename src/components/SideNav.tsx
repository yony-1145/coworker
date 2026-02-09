'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Map, User, MapPinPlus, LogOut, Menu, X } from 'lucide-react';

/**
 * サイドナブバー
 * - マップ、投稿、ユーザー、ログアウト
 */
const navItems = [
  {
    type: 'link',
    href: '/map',
    label: 'マップ',
    icon: <Map size={18} />,
    activePrefix: '/map',
  },
  {
    type: 'link',
    href: '/posts/new',
    label: '投稿',
    icon: <MapPinPlus size={18} />,
    activePrefix: '/posts',
  },
  {
    type: 'link',
    href: '/users',
    label: 'ユーザー',
    icon: <User size={18} />,
    activePrefix: '/users',
  },
  {
    type: 'action',
    label: 'ログアウト',
    icon: <LogOut size={18} />,
  },
] as const;

export default function SideNav() {
  // 現在表示中のパス（/map, /post/new, /users/xxx など）を取得
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-full bg-white p-2 shadow-md border border-gray-200 md:hidden"
        aria-label="ナビゲーションを開く"
      >
        <Menu size={18} />
      </button>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white p-4 transition-transform md:static md:z-auto md:w-56 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/coworker.jpg"
              alt="Coworker"
              className="h-6 w-6 rounded-md object-cover"
            />
            <h2 className="text-lg font-semibold text-gray-900">Coworker</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="ナビゲーションを閉じる"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col space-y-2">
          {navItems.map((item) => {
            const baseClass =
              'flex items-center space-x-2 p-2 rounded-md w-full text-left hover:bg-gray-100';

            // ログアウトは遷移ではなく action として処理
            if (item.type === 'action') {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className={baseClass}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            }

            // prefix マッチで active 判定（例: /users/* → ユーザー）
            const isActive = pathname.startsWith(item.activePrefix);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClass} ${
                  isActive ? 'bg-gray-200 font-medium' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
