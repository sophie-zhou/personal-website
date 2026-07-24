(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
