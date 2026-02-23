(function() {
  var key = 'coworker-theme';
  try {
    var stored = localStorage.getItem(key);
    var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.add('light');
  } catch (e) {}
})();
