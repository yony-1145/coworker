'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Map, User, Search, MapPinPlus, LogOut } from 'lucide-react';

/**
 * サイドナビに表示するメニュー定義
 * - href: 遷移先URL
 * - activePrefix: 現在のパスがこのprefixで始まる場合に active 扱いする
 *
 * href と activePrefix を分けることで、
 * /post 配下や /users 配下をそれぞれまとめて active 判定できる
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
    href: '/search',
    label: '検索',
    icon: <Search size={18} />,
    activePrefix: '/search',
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

  return (
    <aside className="w-56 h-screen border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Coworker</h2>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const baseClass =
            'flex items-center space-x-2 p-2 rounded-md w-full text-left hover:bg-gray-100';

          // ログアウトは遷移ではなく action として処理
          if (item.type === 'action') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
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
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
