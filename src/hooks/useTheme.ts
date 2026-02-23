'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type Theme,
} from '@/lib/theme';

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setStoredTheme(next);
    setThemeState(next);
  }, [theme]);

  return { theme, toggle };
}
