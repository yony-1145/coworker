'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';
import type { Theme } from '@/lib/theme';

const labels: Record<Theme, string> = {
  light: 'ライト',
  dark: 'ダーク',
  system: 'システム',
};

const icons: Record<Theme, React.ReactNode> = {
  light: <Sun size={18} />,
  dark: <Moon size={18} />,
  system: <Monitor size={18} />,
};

const next: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(next[theme])}
      className="flex items-center gap-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
      aria-label={`テーマ: ${labels[theme]}。クリックで切り替え`}
      title={`テーマ: ${labels[theme]}（クリックで切り替え）`}
    >
      {icons[theme]}
      <span className="text-sm">{labels[theme]}</span>
    </button>
  );
}
