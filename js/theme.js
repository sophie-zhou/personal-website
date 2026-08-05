(function () {
  var storageKey = 'sophie-portfolio-theme';
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-choice]'));
  if (!buttons.length) return;

  function applyTheme(theme) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(storageKey, next);
    } catch (error) {
      // Ignore storage failures.
    }
    buttons.forEach(function (button) {
      var isActive = button.getAttribute('data-theme-choice') === next;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  var saved = 'dark';
  try {
    saved = localStorage.getItem(storageKey) || 'dark';
  } catch (error) {
    saved = 'dark';
  }
  applyTheme(saved);

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(button.getAttribute('data-theme-choice'));
    });
  });
})();
