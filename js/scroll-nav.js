(function () {
  var page = document.querySelector('.page-scroll');
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.scroll-nav [data-nav-section]')
  );
  if (!page || !links.length) return;

  var work = document.getElementById('work');
  var sections = links
    .map(function (link) {
      var id = link.getAttribute('data-nav-section');
      return document.getElementById(id);
    })
    .filter(Boolean);

  var mode = 'home';
  var lockUntil = 0;
  var exhibitTimer = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isLocked() {
    return Date.now() < lockUntil;
  }

  function lock(ms) {
    lockUntil = Date.now() + (ms || 350);
  }

  function setActive(id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute('data-nav-section') === id;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function setPanelRevealed(revealed) {
    page.classList.toggle('panel-revealed', revealed);
  }

  function resetWorkEntrance() {
    if (!work) return;
    window.clearTimeout(exhibitTimer);
    work.classList.remove('work-enter', 'work-exhibit-ready', 'work-settled');
  }

  function playWorkEntrance() {
    if (!work) return;
    resetWorkEntrance();

    if (reduceMotion) {
      work.classList.add('work-enter', 'work-exhibit-ready', 'work-settled');
      window.dispatchEvent(new CustomEvent('sophie:start-work-exhibit'));
      return;
    }

    // Reflow so workRiseIn can replay when returning from Home.
    // Parked styles (opacity 0 + translateY) hold until work-enter; fill-mode
    // `both` keeps that from-state through each stagger delay.
    void work.offsetWidth;
    requestAnimationFrame(function () {
      work.classList.add('work-enter');
      // Last stagger ~0.72s + 0.7s duration; then exhibit typing.
      // Drop work-enter on settle so nth-child animation rules (higher
      // specificity than .work-settled) cannot keep fill/transform stuck —
      // needed for research cards that were [hidden] during the rise, and
      // so hover scale (1.04 / 1.02) can apply.
      exhibitTimer = window.setTimeout(function () {
        work.classList.remove('work-enter');
        work.classList.add('work-exhibit-ready', 'work-settled');
        window.dispatchEvent(new CustomEvent('sophie:start-work-exhibit'));
      }, 1500);
    });
  }

  function showContent(sectionId) {
    if (mode === 'content') return;
    if (isLocked()) return;

    mode = 'content';
    lock(500);
    setPanelRevealed(true);

    var targetId = sectionId || 'work';
    var target = document.getElementById(targetId) || work;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (target && targetId !== 'work') {
          window.scrollTo(0, Math.max(0, target.offsetTop));
        } else {
          window.scrollTo(0, 0);
        }
        setActive(targetId);
        history.replaceState(null, '', '#' + targetId);
        playWorkEntrance();
      });
    });
  }

  function showHome() {
    if (mode === 'home') return;
    if (isLocked()) return;

    mode = 'home';
    lock(400);
    resetWorkEntrance();
    window.dispatchEvent(new CustomEvent('sophie:reset-work-exhibit'));
    setPanelRevealed(false);

    requestAnimationFrame(function () {
      window.scrollTo(0, 0);
      setActive('top');
      history.replaceState(null, '', '#top');
    });
  }

  function updateActiveFromScroll() {
    if (mode !== 'content' || isLocked()) return;

    var marker = window.scrollY + window.innerHeight * 0.35;
    var activeId = 'work';
    sections.forEach(function (section) {
      if (section.id === 'top') return;
      if (section.offsetTop <= marker) {
        activeId = section.id;
      }
    });
    setActive(activeId);
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('data-nav-section');
      event.preventDefault();
      lockUntil = 0;
      if (id === 'top') {
        showHome();
        return;
      }
      if (mode !== 'content') {
        showContent(id);
      } else {
        var target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActive(id);
          history.replaceState(null, '', '#' + id);
        }
      }
    });
  });

  window.addEventListener(
    'wheel',
    function (event) {
      if (isLocked()) {
        event.preventDefault();
        return;
      }

      if (mode === 'home' && event.deltaY > 8) {
        event.preventDefault();
        showContent('work');
        return;
      }

      if (mode === 'content' && window.scrollY <= 1 && event.deltaY < -8) {
        event.preventDefault();
        showHome();
      }
    },
    { passive: false }
  );

  var touchStartY = null;
  window.addEventListener(
    'touchstart',
    function (event) {
      if (!event.touches || !event.touches[0]) return;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    function (event) {
      if (touchStartY == null || !event.touches || !event.touches[0]) return;
      if (isLocked()) return;

      var delta = touchStartY - event.touches[0].clientY;
      if (mode === 'home' && delta > 24) {
        showContent('work');
        touchStartY = null;
      } else if (mode === 'content' && window.scrollY <= 1 && delta < -24) {
        showHome();
        touchStartY = null;
      }
    },
    { passive: true }
  );

  window.addEventListener('scroll', updateActiveFromScroll, { passive: true });

  var hash = (window.location.hash || '').replace('#', '');
  if (hash === 'research') {
    showContent('work');
  } else if (hash && hash !== 'top' && document.getElementById(hash)) {
    showContent(hash);
  } else {
    mode = 'home';
    resetWorkEntrance();
    setPanelRevealed(false);
    setActive('top');
    window.scrollTo(0, 0);
  }
})();
