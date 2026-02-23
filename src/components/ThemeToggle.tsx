'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      title={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      <span className="text-sm">{theme === 'dark' ? 'ライト' : 'ダーク'}</span>
    </button>
  );
}
