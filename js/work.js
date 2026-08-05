(function () {
  var tabs = document.querySelector('[data-work-tabs]');
  var buttons = tabs
    ? Array.prototype.slice.call(tabs.querySelectorAll('[data-filter]'))
    : [];
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-work-section]'));
  var exhibits = Array.prototype.slice.call(document.querySelectorAll('[data-work-exhibit]'));
  var entranceReady = false;

  function typeExhibit(exhibit) {
    window.clearTimeout(exhibit.typingTimer);
    exhibit.classList.remove('work-exhibit-done');
    exhibit.classList.remove('work-exhibit-typing');

    var exhibitText = exhibit.getAttribute('data-text') || '';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      exhibit.textContent = exhibitText;
      exhibit.classList.add('work-exhibit-done');
      return;
    }

    var exhibitIndex = 0;
    exhibit.textContent = '';
    exhibit.classList.add('work-exhibit-typing');

    function typeNextCharacter() {
      exhibitIndex += 1;
      exhibit.textContent = exhibitText.slice(0, exhibitIndex);
      if (exhibitIndex < exhibitText.length) {
        exhibit.typingTimer = window.setTimeout(typeNextCharacter, 28);
      } else {
        exhibit.classList.add('work-exhibit-done');
      }
    }

    typeNextCharacter();
  }

  function clearExhibits() {
    exhibits.forEach(function (exhibit) {
      window.clearTimeout(exhibit.typingTimer);
      exhibit.textContent = '';
      exhibit.classList.remove('work-exhibit-typing', 'work-exhibit-done');
    });
  }

  function typeActiveExhibit() {
    exhibits.forEach(function (exhibit) {
      var isActive = !exhibit.hidden;
      if (!isActive) {
        window.clearTimeout(exhibit.typingTimer);
        return;
      }
      typeExhibit(exhibit);
    });
  }

  function setFilter(filter, options) {
    options = options || {};
    buttons.forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-filter') === filter);
    });
    sections.forEach(function (section) {
      section.hidden = section.getAttribute('data-work-section') !== filter;
    });
    exhibits.forEach(function (exhibit) {
      var isActive = exhibit.getAttribute('data-work-exhibit') === filter;
      if (!isActive) window.clearTimeout(exhibit.typingTimer);
      exhibit.hidden = !isActive;
      if (!isActive) {
        exhibit.textContent = '';
        exhibit.classList.remove('work-exhibit-typing', 'work-exhibit-done');
      }
    });

    if (options.skipType) {
      clearExhibits();
      return;
    }

    if (!entranceReady && options.waitForEntrance) {
      clearExhibits();
      return;
    }

    typeActiveExhibit();
  }

  if (tabs) {
    tabs.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button) return;
      setFilter(button.getAttribute('data-filter'));
    });

    var hash = (window.location.hash || '').replace('#', '');
    if (hash === 'research') {
      setFilter('research', { waitForEntrance: true });
    } else {
      setFilter('art', { waitForEntrance: true });
    }
  }

  window.addEventListener('sophie:start-work-exhibit', function () {
    entranceReady = true;
    typeActiveExhibit();
  });

  window.addEventListener('sophie:reset-work-exhibit', function () {
    entranceReady = false;
    clearExhibits();
  });

  var lightbox = document.createElement('div');
  lightbox.className = 'art-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = [
    '<div class="art-lightbox-inner">',
    '  <button type="button" class="art-lightbox-close" aria-label="Close">×</button>',
    '  <img alt="">',
    '  <p class="art-lightbox-caption"></p>',
    '</div>'
  ].join('');
  document.body.appendChild(lightbox);

  var lightboxImg = lightbox.querySelector('img');
  var lightboxCaption = lightbox.querySelector('.art-lightbox-caption');
  var closeButton = lightbox.querySelector('.art-lightbox-close');

  function openLightbox(img) {
    var piece = img.closest('.art-piece');
    var shortCaption = piece
      ? piece.getAttribute('data-lightbox-caption') || ''
      : '';
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = shortCaption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = 'auto';
  }

  // Same hover enlarge behavior as the tab buttons (transform: scale).
  function bindScaleHover(selector, amount) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
      el.addEventListener('mouseenter', function () {
        el.classList.add('is-scaled');
        el.style.transform = 'scale(' + amount + ')';
        el.style.zIndex = '8';
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('is-scaled');
        el.style.transform = '';
        el.style.zIndex = '';
      });
    });
  }

  bindScaleHover('.art-piece', '1.08');
  bindScaleHover('.research-card', '1.06');

  document.querySelectorAll('.art-piece img').forEach(function (img) {
    var piece = img.closest('.art-piece');
    var label = piece && piece.getAttribute('data-lightbox-caption');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'View larger: ' + (label || img.alt || 'artwork'));
    img.addEventListener('click', function () {
      openLightbox(img);
    });
    img.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();
