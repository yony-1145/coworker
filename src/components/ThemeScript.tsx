import Script from 'next/script';

/**
 * 初期表示のチラつき防止のため、beforeInteractive でテーマを適用。
 * localStorage のテーマを読んで html に class を付与する。
 */
export function ThemeScript() {
  return (
    <Script
      src="/theme-init.js"
      strategy="beforeInteractive"
    />
  );
}
