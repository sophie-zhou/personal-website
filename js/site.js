/* Collage background + shared layout — injected on every page */
(function () {
  var collage = document.createElement('div');
  collage.className = 'collage-bg';
  collage.setAttribute('aria-hidden', 'true');
  collage.innerHTML = [
    '<div class="collage-piece grid-scrap grid-scrap-a" data-collage-id="grid-a"></div>',
    '<div class="collage-piece grid-scrap grid-scrap-b" data-collage-id="grid-b"></div>',
    '<div class="collage-piece old-paper old-paper-a" data-collage-id="paper-a"></div>',
    '<div class="collage-piece old-paper old-paper-b" data-collage-id="paper-b"></div>',
    '<div class="collage-piece tape-strip tape-1" data-collage-id="tape-a"></div>',
    '<div class="collage-piece tape-strip tape-2" data-collage-id="tape-b"></div>',
    '<div class="collage-piece tape-strip tape-3" data-collage-id="tape-c"></div>',
    '<div class="collage-piece torn-kraft-strip" data-collage-id="kraft-strip"></div>',
    '<div class="collage-piece photo-scrap photo-chip" data-collage-id="chip-main"></div>',
    '<div class="collage-piece photo-scrap photo-floorplan" data-collage-id="floorplan-main"></div>',
    '<div class="collage-piece nature-photo nature-tuscany" data-collage-id="nature-tuscany"></div>',
    '<div class="collage-piece collage-landscape scrap-torn" data-collage-id="landscape-mountain"><div class="landscape-hills"></div></div>',
    '<div class="collage-piece nature-photo nature-canyon" data-collage-id="nature-canyon"></div>',
    '<div class="collage-piece nature-photo nature-flower-field" data-collage-id="nature-flower-field"></div>',
    '<div class="collage-piece circuit-lines circuit-lines-a" data-collage-id="circuit-lines-a"></div>',
    '<div class="collage-piece detail-photo detail-tennis-rackets" data-collage-id="detail-tennis-rackets"></div>',
    '<div class="collage-piece detail-cutout detail-graph-paper" data-collage-id="detail-graph-paper"></div>',
    '<div class="collage-piece detail-cutout detail-kraft-paper" data-collage-id="detail-kraft-paper"></div>',
    '<div class="collage-piece detail-photo detail-paint-brushes" data-collage-id="detail-paint-brushes"></div>',
    '<div class="collage-piece detail-photo detail-piano" data-collage-id="detail-piano"></div>',
    '<div class="collage-piece detail-photo detail-matcha-poster" data-collage-id="detail-matcha-poster"></div>',
    '<div class="collage-piece detail-cutout detail-wax-leaf" data-collage-id="detail-wax-leaf"></div>',
    '<div class="collage-piece detail-cutout detail-wax-flower" data-collage-id="detail-wax-flower"></div>',
    '<div class="collage-piece detail-cutout detail-line-bouquet" data-collage-id="detail-line-bouquet"></div>',
    '<div class="collage-piece detail-cutout detail-autumn-flowers" data-collage-id="detail-autumn-flowers"></div>',
    '<div class="collage-piece detail-cutout detail-meadow-flowers" data-collage-id="detail-meadow-flowers"></div>',
    '<div class="collage-piece detail-cutout detail-balloon-stamp" data-collage-id="detail-balloon-stamp"></div>',
    '<div class="collage-piece detail-cutout detail-orange-stamp" data-collage-id="detail-orange-stamp"></div>',
    '<div class="collage-piece detail-cutout detail-torn-music" data-collage-id="detail-torn-music"></div>',
    '<div class="collage-piece detail-cutout detail-script-butterfly" data-collage-id="detail-script-butterfly"></div>',
    '<div class="collage-piece detail-cutout detail-tape-butterfly" data-collage-id="detail-tape-butterfly"></div>',
    '<div class="collage-piece detail-cutout detail-art-collage" data-collage-id="detail-art-collage"></div>',
    '<div class="collage-piece detail-cutout detail-leaf-sprig" data-collage-id="detail-leaf-sprig"></div>',
    '<div class="collage-piece detail-cutout detail-ticket" data-collage-id="detail-ticket"></div>',
    '<div class="collage-piece detail-cutout detail-vintage-ticket" data-collage-id="detail-vintage-ticket"></div>',
    '<div class="collage-piece detail-cutout detail-postage-blank" data-collage-id="detail-postage-blank"></div>',
    '<div class="collage-piece detail-cutout detail-graph-paper-extra" data-collage-id="detail-graph-paper-extra"></div>',
    '<div class="collage-piece detail-cutout detail-graph-paper-b" data-collage-id="detail-graph-paper-b"></div>',
    '<div class="collage-piece detail-cutout detail-gold-wax-seal" data-collage-id="detail-gold-wax-seal"></div>',
    '<div class="collage-piece detail-cutout detail-postmark-solid" data-collage-id="detail-postmark-solid"></div>',
    '<div class="collage-piece detail-cutout detail-postmark-solid-b" data-collage-id="detail-postmark-solid-b"></div>',
    '<div class="collage-piece detail-cutout detail-watercolor-leaf" data-collage-id="detail-watercolor-leaf"></div>',
    '<div class="collage-piece detail-cutout detail-paper-butterfly" data-collage-id="detail-paper-butterfly"></div>',
    '<div class="collage-piece detail-cutout detail-austria-stamp" data-collage-id="detail-austria-stamp"></div>',
    '<div class="collage-piece nature-photo nature-beach-scrap" data-collage-id="nature-beach-scrap"></div>',
    '<div class="collage-piece nature-photo nature-mountain-scrap" data-collage-id="nature-mountain-scrap"></div>',
    '<div class="collage-piece nature-photo detail-gear-sketch" data-collage-id="detail-gear-sketch"></div>',
    '<div class="collage-piece detail-cutout detail-graph-paper-c" data-collage-id="detail-graph-paper-c"></div>',
    '<div class="collage-piece detail-cutout detail-peach-cascade" data-collage-id="detail-peach-cascade"></div>',
    '<div class="collage-piece detail-cutout detail-pressed-tape-flower" data-collage-id="detail-pressed-tape-flower"></div>',
    '<div class="collage-piece detail-cutout detail-white-blossom-branch" data-collage-id="detail-white-blossom-branch"></div>',
    '<div class="collage-piece detail-cutout detail-vintage-clock" data-collage-id="detail-vintage-clock"></div>',
    '<div class="collage-piece detail-cutout detail-italy-stamp" data-collage-id="detail-italy-stamp"></div>',
    '<div class="collage-piece detail-cutout detail-royal-postal" data-collage-id="detail-royal-postal"></div>',
    '<div class="collage-piece detail-cutout detail-wax-botanical" data-collage-id="detail-wax-botanical"></div>',
    '<div class="collage-piece detail-cutout detail-paper-butterfly-b" data-collage-id="detail-paper-butterfly-b"></div>',
    '<div class="collage-piece detail-cutout detail-script-butterfly-b" data-collage-id="detail-script-butterfly-b"></div>',
    '<div class="collage-piece detail-cutout detail-gold-flower-seal" data-collage-id="detail-gold-flower-seal"></div>',
    '<div class="collage-piece detail-cutout detail-olive-branch" data-collage-id="detail-olive-branch"></div>',
    '<div class="collage-piece detail-cutout detail-indigo-ticket" data-collage-id="detail-indigo-ticket"></div>',
    '<div class="collage-piece detail-cutout detail-sheet-music-scrap" data-collage-id="detail-sheet-music-scrap"></div>',
    '<div class="collage-piece detail-cutout detail-vangogh-stamp" data-collage-id="detail-vangogh-stamp"></div>',
    '<div class="collage-piece detail-cutout detail-white-florals" data-collage-id="detail-white-florals"></div>',
    '<div class="collage-piece detail-cutout detail-circuit-copper" data-collage-id="detail-circuit-copper"></div>',
    '<div class="collage-piece detail-cutout detail-circuit-lines" data-collage-id="detail-circuit-lines"></div>',
    '<div class="collage-piece detail-paper detail-music-page" data-collage-id="detail-music-page"></div>',
    '<div class="collage-piece archive-cutout cutout-flower-bouquet" data-collage-id="flower-bouquet"></div>',
    '<div class="collage-piece archive-cutout cutout-tuscany-stamp" data-collage-id="tuscany-stamp"></div>',
    '<div class="collage-piece archive-cutout cutout-postmark" data-collage-id="postmark"></div>',
    '<div class="collage-piece archive-cutout cutout-butterfly" data-collage-id="butterfly"></div>',
    '<div class="collage-piece archive-cutout cutout-leafy-branch" data-collage-id="leafy-branch"></div>',
    '<div class="collage-piece archive-cutout cutout-dried-flowers" data-collage-id="dried-flowers"></div>',
    '<div class="collage-piece archive-cutout cutout-antique-moth" data-collage-id="antique-moth"></div>',
    '<div class="collage-piece archive-cutout cutout-pressed-rose" data-collage-id="pressed-rose"></div>',
    '<div class="collage-piece archive-cutout cutout-tickets" data-collage-id="tickets"></div>',
    '<div class="collage-piece archive-cutout cutout-branch-drawing" data-collage-id="branch-drawing"></div>',
    '<div class="collage-piece archive-cutout cutout-sunflower-stamp" data-collage-id="sunflower-stamp"></div>',
    '<div class="collage-piece archive-cutout cutout-wax-seal" data-collage-id="wax-seal"></div>'
  ].join('');

  document.body.insertBefore(collage, document.body.firstChild);

  // Default mountain placement only when no saved layout exists
  (function placeLandscapeMountain() {
    var piece = collage.querySelector('[data-collage-id="landscape-mountain"]');
    if (!piece) return;
    var storageKey = 'sophie-portfolio-collage-layout-v2';
    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (error) {
      saved = { pieces: {} };
    }
    if (!saved.pieces) saved.pieces = {};
    if (saved.pieces['landscape-mountain']) return;

    function applyPlacement() {
      var ref = document.querySelector('.landscape-size-ref');
      if (ref) {
        var rect = ref.getBoundingClientRect();
        if (rect.width > 20 && rect.height > 20) {
          piece.style.left = rect.left + 'px';
          piece.style.top = rect.top + 'px';
          piece.style.width = rect.width + 'px';
          piece.style.height = rect.height + 'px';
          piece.style.right = 'auto';
          piece.style.bottom = 'auto';
          piece.style.transform = 'rotate(2.5deg)';
          return;
        }
      }
      piece.style.top = '14%';
      piece.style.right = '3%';
      piece.style.width = '320px';
      piece.style.height = '230px';
      piece.style.transform = 'rotate(2.5deg)';
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(applyPlacement);
    });
  })();

  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  function loadCollageEditor() {
    var collageEditor = document.createElement('script');
    collageEditor.src = 'js/collage-editor.js?v=20';
    document.body.appendChild(collageEditor);
  }

  fetch('collage-layout-default.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Could not load default collage');
      return response.json();
    })
    .then(function (layout) {
      window.sophieCollageDefaultLayout = layout;
    })
    .catch(function () {
      window.sophieCollageDefaultLayout = null;
    })
    .then(loadCollageEditor);
})();
