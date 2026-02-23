import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 単体テストでは CSS/PostCSS を扱わないため、PostCSS 読み込みをスキップ
  css: { postcss: { plugins: [] } },
});
