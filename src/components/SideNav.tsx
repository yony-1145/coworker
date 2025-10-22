'use client';

import Link from 'next/link';
import { Map, User, Search, MapPinPlus, LogOut } from 'lucide-react';

const navItems = [
  { href: '/map', label: 'マップ', icon: <Map size={18} /> },
  { href: '/search', label: '検索', icon: <Search size={18} /> },
  { href: '/post', label: '投稿', icon: <MapPinPlus size={18} /> },
  { href: '/user', label: 'ユーザー', icon: <User size={18} /> },
  { href: '/logOut', label: 'ログアウト', icon: <LogOut size={18} /> },
];    

export default function SideNav() {
  return (
    <aside className="w-56 h-screen border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Coworker</h2>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
