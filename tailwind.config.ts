import type { Config } from 'tailwindcss';

/**
 * ダークモードは class 方式（html に .dark を付与して切り替え）。
 * Tailwind v4 では globals.css の @custom-variant dark が実際の挙動を制御する。
 */
const config: Config = {
  darkMode: 'class',
};

export default config;
