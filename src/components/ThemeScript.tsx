/**
 * 初期表示のチラつき防止のため、HTML 解析直後に実行するインラインスクリプト。
 * localStorage のテーマを読んで html に class を付与する。
 */
export function ThemeScript() {
  const script = `
(function() {
  var key = 'coworker-theme';
  var stored = localStorage.getItem(key);
  var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  var root = document.documentElement;
  root.classList.remove('light', 'dark');
  if (theme === 'dark') root.classList.add('dark');
  else if (theme === 'light') root.classList.add('light');
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
