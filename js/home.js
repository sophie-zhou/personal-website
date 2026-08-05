(function () {
  var card = document.querySelector('.layout-home > .scrap');
  var title = document.querySelector('.hero-title-type');
  if (!card || !title) return;

  var fullText = title.getAttribute('data-text') || "Hello, I'm Sophie Zhou!";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var typingStarted = false;

  function typeTitle() {
    if (typingStarted) return;
    typingStarted = true;
    var index = 0;
    title.textContent = '';
    card.classList.add('hero-typing');

    function tick() {
      index += 1;
      title.textContent = fullText.slice(0, index);
      if (index < fullText.length) {
        window.setTimeout(tick, 34);
      } else {
        card.classList.add('hero-typed');
      }
    }

    tick();
  }

  if (reduceMotion) {
    title.textContent = fullText;
    card.classList.add('hero-settled', 'hero-typed');
    return;
  }

  card.classList.add('hero-enter');
  // Start typing almost immediately while the card is still bouncing in.
  window.setTimeout(typeTitle, 180);
  card.addEventListener('animationend', function onBounce(event) {
    if (event.animationName !== 'heroCardBounce') return;
    card.removeEventListener('animationend', onBounce);
    card.classList.remove('hero-enter');
    card.classList.add('hero-settled');
    typeTitle();
  });
})();
