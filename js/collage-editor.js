(function () {
  var storageKey = 'sophie-portfolio-collage-layout-v2';
  var collage = document.querySelector('.collage-bg');
  if (!collage) return;

  var active = false;
  var selected = null;
  var dragState = null;
  var state = loadState();
  var historyPast = [];
  var historyFuture = [];
  var historyLimit = 60;
  var applyingHistory = false;
  var restoreOnLoad = [
    'detail-tennis-rackets',
    'detail-graph-paper',
    'detail-kraft-paper',
    'landscape-mountain',
    'nature-canyon',
    'nature-mountain-scrap',
    'grid-a',
    'grid-b',
    'paper-a',
    'paper-b',
    'kraft-strip'
  ];
  var restoredOnLoad = false;
  restoreOnLoad.forEach(function (id) {
    if (state.pieces[id] && state.pieces[id].display === 'none') {
      state.pieces[id].display = '';
      restoredOnLoad = true;
    }
  });
  if (restoredOnLoad) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  var toggle = document.createElement('button');
  toggle.className = 'collage-editor-toggle';
  toggle.type = 'button';
  toggle.textContent = 'ARRANGE COLLAGE';

  var panel = document.createElement('aside');
  panel.className = 'collage-editor-panel';
  panel.innerHTML = [
    '<h2>Collage editor</h2>',
    '<p class="collage-editor-help">Drag a highlighted piece. Changes are saved in this browser. Undo / redo with the buttons or ⌘Z / ⌘⇧Z.</p>',
    '<div class="collage-selected-name">No piece selected</div>',
    '<div class="collage-history-controls">',
    '  <button type="button" class="collage-undo" disabled>↶ UNDO</button>',
    '  <button type="button" class="collage-redo" disabled>↷ REDO</button>',
    '</div>',
    '<div class="collage-controls">',
    '  <button type="button" data-action="smaller">− SIZE</button>',
    '  <button type="button" data-action="larger">+ SIZE</button>',
    '  <button type="button" data-action="left">↶ ROTATE</button>',
    '  <button type="button" data-action="right">↷ ROTATE</button>',
    '  <button type="button" data-action="back">SEND BACK</button>',
    '  <button type="button" data-action="front">BRING FRONT</button>',
    '  <button type="button" data-action="hide">HIDE</button>',
    '</div>',
    '<button type="button" class="collage-add-image">ADD YOUR IMAGE</button>',
    '<button type="button" class="collage-copy-layout">COPY LAYOUT JSON</button>',
    '<button type="button" class="collage-download-layout">DOWNLOAD BACKUP</button>',
    '<button type="button" class="collage-import-layout">IMPORT BACKUP</button>',
    '<button type="button" class="collage-screenshot-start">LOAD SCREENSHOT START</button>',
    '<button type="button" class="collage-restore-hidden">RESTORE HIDDEN</button>',
    '<button type="button" class="collage-reset-layout">RESET LAYOUT</button>',
    '<input class="collage-file-input" type="file" accept="image/*" hidden>',
    '<input class="collage-layout-input" type="file" accept="application/json,.json" hidden>',
    '<p class="collage-editor-note">Edits save in this browser. Download a backup often, or copy the layout JSON into Cursor to make it permanent.</p>'
  ].join('');

  var bottomDock = document.querySelector('.bottom-dock');
  if (bottomDock) {
    bottomDock.appendChild(toggle);
  } else {
    document.body.appendChild(toggle);
  }
  document.body.appendChild(panel);

  var selectedName = panel.querySelector('.collage-selected-name');
  var fileInput = panel.querySelector('.collage-file-input');
  var layoutInput = panel.querySelector('.collage-layout-input');
  var undoButton = panel.querySelector('.collage-undo');
  var redoButton = panel.querySelector('.collage-redo');
  var panelTitle = panel.querySelector('h2');
  var panelDrag = null;

  if (state.panel) {
    panel.style.left = state.panel.left + 'px';
    panel.style.top = state.panel.top + 'px';
  }

  function loadState() {
    try {
      var saved = localStorage.getItem(storageKey);
      var parsed = saved
        ? JSON.parse(saved)
        : (window.sophieCollageDefaultLayout || {});
      return {
        pieces: parsed.pieces || {},
        users: parsed.users || [],
        panel: parsed.panel
      };
    } catch (error) {
      return { pieces: {}, users: [] };
    }
  }

  function persist() {
    try {
      var payload = JSON.stringify(state);
      localStorage.setItem(storageKey, payload);
      // Keep rotating backups in this browser
      var backups = [];
      try {
        backups = JSON.parse(localStorage.getItem(storageKey + '-backups') || '[]');
      } catch (error) {
        backups = [];
      }
      if (!Array.isArray(backups)) backups = [];
      backups.unshift({ savedAt: new Date().toISOString(), layout: cloneLayout(state) });
      localStorage.setItem(storageKey + '-backups', JSON.stringify(backups.slice(0, 8)));
    } catch (error) {
      window.alert('The browser could not save this layout. Download a backup now.');
    }
  }

  function downloadLayoutBackup() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'collage-layout-backup.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importLayoutBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid file');
        pushHistory();
        applyLayout({
          pieces: parsed.pieces || {},
          users: parsed.users || []
        });
        window.alert('Layout imported.');
      } catch (error) {
        window.alert('Could not import that backup file.');
      }
    };
    reader.readAsText(file);
  }

  function screenshotStartLayout() {
    var referenceWidth = 1024;
    var referenceHeight = 555;
    var scaleX = window.innerWidth / referenceWidth;
    var scaleY = window.innerHeight / referenceHeight;
    var sizeScale = Math.min(scaleX, scaleY);
    var pieces = {};
    var visible = {
      'chip-main': [-18, 350, 178, 250, -7, 3],
      'floorplan-main': [900, 45, 160, 225, 7, 1],
      'nature-tuscany': [102, 414, 315, 210, -4, 3],
      'landscape-mountain': [694, 100, 300, 210, 2.5, 6],
      'nature-canyon': [780, 300, 205, 285, 3, 4],
      'nature-flower-field': [520, 390, 280, 185, 3, 4],
      'detail-tennis-rackets': [520, 265, 165, 175, -5, 3],
      'detail-paint-brushes': [650, 285, 175, 225, 5, 4],
      'detail-matcha-poster': [122, 50, 120, 135, 4, 3],
      'detail-wax-leaf': [500, 42, 92, 92, -7, 4],
      'detail-autumn-flowers': [-18, 43, 140, 130, -4, 4],
      'detail-orange-stamp': [38, 82, 98, 132, -7, 5],
      'detail-vintage-ticket': [220, 82, 165, 92, -4, 4],
      'detail-torn-music': [360, 40, 150, 180, 4, 2],
      'detail-paper-butterfly': [495, 160, 100, 78, -12, 5],
      'detail-balloon-stamp': [720, 450, 125, 100, -4, 7],
      'detail-ticket': [445, 500, 175, 68, 4, 7],
      'detail-white-florals': [918, 360, 100, 105, -4, 7],
      'detail-graph-paper-b': [815, 35, 155, 150, 6, 1],
      'detail-music-page': [535, 42, 185, 225, -4, 1],
      'detail-sheet-music-scrap': [365, 35, 130, 150, 6, 1],
      'detail-postmark-solid': [570, 55, 105, 105, -10, 4],
      'detail-script-butterfly': [350, 455, 125, 95, -7, 6],
      'detail-leaf-sprig': [72, 405, 115, 125, -8, 5],
      'detail-meadow-flowers': [260, 420, 115, 190, 3, 5],
      'flower-bouquet': [945, 330, 145, 300, -3, 7],
      'postmark': [570, 50, 118, 118, 10, 3],
      'butterfly': [345, 455, 125, 110, 5, 6],
      'dried-flowers': [82, 390, 118, 175, -7, 5],
      'tickets': [205, 90, 165, 120, 5, 3],
      'branch-drawing': [400, 35, 145, 175, -5, 2],
      'sunflower-stamp': [928, 235, 100, 145, 5, 7],
      'wax-seal': [515, 450, 100, 100, -4, 7],
      'grid-b': [790, 35, 195, 150, -5, 0],
      'paper-a': [375, 72, 220, 150, 5, 0],
      'kraft-strip': [28, 175, 500, 58, -1, 2]
    };

    collage.querySelectorAll('.collage-piece').forEach(function (piece, index) {
      var id = pieceId(piece);
      var target = visible[id];
      var width = piece.offsetWidth || 100;
      var height = piece.offsetHeight || 100;

      if (!target) {
        var fit = Math.min(1, 210 / width, 130 / height);
        width *= fit;
        height *= fit;
        target = [
          205 + (index % 6) * 24,
          235 + (index % 5) * 18,
          width,
          height,
          (index % 5) * 2 - 4,
          0
        ];
      }

      pieces[id] = {
        left: Math.round(target[0] * scaleX) + 'px',
        top: Math.round(target[1] * scaleY) + 'px',
        right: 'auto',
        bottom: 'auto',
        width: Math.max(24, Math.round(target[2] * sizeScale)) + 'px',
        height: Math.max(24, Math.round(target[3] * sizeScale)) + 'px',
        transform: 'rotate(' + target[4] + 'deg)',
        zIndex: String(target[5]),
        display: ''
      };
    });

    return { pieces: pieces, users: [] };
  }

  function cloneLayout(layout) {
    return JSON.parse(JSON.stringify({
      pieces: layout.pieces || {},
      users: layout.users || []
    }));
  }

  function snapshotLayout() {
    return cloneLayout(state);
  }

  function updateHistoryButtons() {
    undoButton.disabled = !historyPast.length;
    redoButton.disabled = !historyFuture.length;
  }

  function pushHistory() {
    if (applyingHistory) return;
    historyPast.push(snapshotLayout());
    if (historyPast.length > historyLimit) historyPast.shift();
    historyFuture = [];
    updateHistoryButtons();
  }

  function syncUserPieces() {
    var known = {};
    (state.users || []).forEach(function (user) {
      known[user.id] = user;
    });

    collage.querySelectorAll('.user-collage-image').forEach(function (piece) {
      var id = pieceId(piece);
      if (!known[id]) {
        if (selected === piece) {
          selected.classList.remove('collage-piece-selected');
          selected = null;
          selectedName.textContent = 'No piece selected';
        }
        piece.remove();
      }
    });

    (state.users || []).forEach(function (user) {
      var existing = collage.querySelector('[data-collage-id="' + user.id + '"]');
      if (existing) {
        existing.style.backgroundImage = 'url("' + user.dataUrl + '")';
        return;
      }
      var piece = document.createElement('div');
      piece.className = 'collage-piece photo-scrap user-collage-image';
      piece.dataset.collageId = user.id;
      piece.style.backgroundImage = 'url("' + user.dataUrl + '")';
      collage.appendChild(piece);
      registerPiece(piece);
    });
  }

  function applyLayout(layout) {
    applyingHistory = true;
    state.pieces = cloneLayout(layout).pieces;
    state.users = cloneLayout(layout).users;
    persist();
    syncUserPieces();
    document.querySelectorAll('.collage-piece').forEach(function (piece) {
      var id = pieceId(piece);
      var snapshot = state.pieces[id];
      if (snapshot) {
        applySnapshot(piece, snapshot);
        if (snapshot.transform) {
          var rotationMatch = snapshot.transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
          if (rotationMatch) piece.dataset.rotation = rotationMatch[1];
        }
      } else if (!piece.classList.contains('user-collage-image')) {
        piece.style.left = '';
        piece.style.top = '';
        piece.style.right = '';
        piece.style.bottom = '';
        piece.style.width = '';
        piece.style.height = '';
        piece.style.transform = '';
        piece.style.zIndex = '';
        piece.style.display = '';
        delete piece.dataset.rotation;
      }
    });
    if (selected && selected.style.display === 'none') {
      selected.classList.remove('collage-piece-selected');
      selected = null;
      selectedName.textContent = 'No piece selected';
    }
    applyingHistory = false;
    updateHistoryButtons();
  }

  function undo() {
    if (!historyPast.length) return;
    historyFuture.push(snapshotLayout());
    applyLayout(historyPast.pop());
  }

  function redo() {
    if (!historyFuture.length) return;
    historyPast.push(snapshotLayout());
    applyLayout(historyFuture.pop());
  }

  panelTitle.addEventListener('pointerdown', function (event) {
    var rect = panel.getBoundingClientRect();
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    panelDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top
    };
    panelTitle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  panelTitle.addEventListener('pointermove', function (event) {
    if (!panelDrag || panelDrag.pointerId !== event.pointerId) return;
    var nextLeft = panelDrag.left + event.clientX - panelDrag.startX;
    var nextTop = panelDrag.top + event.clientY - panelDrag.startY;
    panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, nextLeft)) + 'px';
    panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, nextTop)) + 'px';
  });

  panelTitle.addEventListener('pointerup', function (event) {
    if (!panelDrag || panelDrag.pointerId !== event.pointerId) return;
    panelDrag = null;
    state.panel = {
      left: parseFloat(panel.style.left),
      top: parseFloat(panel.style.top)
    };
    persist();
  });

  function pieceId(piece) {
    return piece.dataset.collageId;
  }

  function styleSnapshot(piece) {
    return {
      left: piece.style.left,
      top: piece.style.top,
      right: piece.style.right,
      bottom: piece.style.bottom,
      width: piece.style.width,
      height: piece.style.height,
      transform: piece.style.transform,
      zIndex: piece.style.zIndex,
      display: piece.style.display
    };
  }

  function applySnapshot(piece, snapshot) {
    if (!snapshot) return;
    Object.keys(snapshot).forEach(function (property) {
      piece.style[property] = snapshot[property] || '';
    });
  }

  function savePiece(piece, options) {
    if (!(options && options.skipHistory)) pushHistory();
    state.pieces[pieceId(piece)] = styleSnapshot(piece);
    persist();
  }

  function rotationFor(piece) {
    if (piece.dataset.rotation) return Number(piece.dataset.rotation);
    var transform = getComputedStyle(piece).transform;
    var rotation = 0;
    if (transform && transform !== 'none') {
      var values = transform.match(/matrix\(([^)]+)\)/);
      if (values) {
        var parts = values[1].split(',').map(Number);
        rotation = Math.round(Math.atan2(parts[1], parts[0]) * 180 / Math.PI);
      }
    }
    piece.dataset.rotation = String(rotation);
    return rotation;
  }

  function registerPiece(piece) {
    applySnapshot(piece, state.pieces[pieceId(piece)]);
    piece.addEventListener('pointerdown', function (event) {
      if (!active) return;
      event.preventDefault();
      event.stopPropagation();
      selectPiece(piece);

      var layoutLeft = piece.offsetLeft;
      var layoutTop = piece.offsetTop;
      var layoutWidth = piece.offsetWidth;
      var layoutHeight = piece.offsetHeight;
      piece.style.left = layoutLeft + 'px';
      piece.style.top = layoutTop + 'px';
      piece.style.right = 'auto';
      piece.style.bottom = 'auto';
      piece.style.width = layoutWidth + 'px';
      piece.style.height = layoutHeight + 'px';

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: parseFloat(piece.style.left),
        top: parseFloat(piece.style.top),
        before: snapshotLayout(),
        moved: false
      };
      piece.setPointerCapture(event.pointerId);
    });

    piece.addEventListener('pointermove', function (event) {
      if (!dragState || dragState.pointerId !== event.pointerId || selected !== piece) return;
      var nextLeft = dragState.left + event.clientX - dragState.startX;
      var nextTop = dragState.top + event.clientY - dragState.startY;
      if (Math.abs(nextLeft - dragState.left) > 1 || Math.abs(nextTop - dragState.top) > 1) {
        dragState.moved = true;
      }
      piece.style.left = nextLeft + 'px';
      piece.style.top = nextTop + 'px';
    });

    piece.addEventListener('pointerup', function (event) {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      var moved = dragState.moved;
      var before = dragState.before;
      dragState = null;
      if (moved) {
        historyPast.push(before);
        if (historyPast.length > historyLimit) historyPast.shift();
        historyFuture = [];
        updateHistoryButtons();
        savePiece(piece, { skipHistory: true });
      } else {
        savePiece(piece, { skipHistory: true });
      }
    });
  }

  function selectPiece(piece) {
    if (selected) selected.classList.remove('collage-piece-selected');
    selected = piece;
    selected.classList.add('collage-piece-selected');
    selectedName.textContent = pieceId(piece);
    rotationFor(piece);
  }

  function resizeSelected(multiplier) {
    if (!selected) return;
    pushHistory();
    selected.style.width = Math.max(50, selected.offsetWidth * multiplier) + 'px';
    selected.style.height = Math.max(50, selected.offsetHeight * multiplier) + 'px';
    savePiece(selected, { skipHistory: true });
  }

  function rotateSelected(delta) {
    if (!selected) return;
    pushHistory();
    var rotation = rotationFor(selected) + delta;
    selected.dataset.rotation = String(rotation);
    selected.style.transform = 'rotate(' + rotation + 'deg)';
    savePiece(selected, { skipHistory: true });
  }

  function layerSelected(direction) {
    if (!selected) return;
    var pieces = Array.prototype.slice.call(collage.querySelectorAll('.collage-piece'));
    var zValues = pieces.map(function (piece) {
      var value = Number(getComputedStyle(piece).zIndex);
      return Number.isFinite(value) ? value : 0;
    });
    var extreme = direction < 0
      ? Math.min.apply(null, zValues)
      : Math.max.apply(null, zValues);
    selected.style.zIndex = String(extreme + direction);
    if (direction < 0) {
      collage.insertBefore(selected, collage.firstChild);
    } else {
      collage.appendChild(selected);
    }
  }

  function restoreUserImages() {
    state.users.forEach(function (user) {
      var piece = document.createElement('div');
      piece.className = 'collage-piece photo-scrap user-collage-image';
      piece.dataset.collageId = user.id;
      piece.style.backgroundImage = 'url("' + user.dataUrl + '")';
      collage.appendChild(piece);
      registerPiece(piece);
    });
  }

  function addImage(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var image = new Image();
      image.onload = function () {
        var maxSize = 1000;
        var scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

        pushHistory();
        var id = 'user-' + Date.now();
        state.users.push({
          id: id,
          dataUrl: canvas.toDataURL('image/jpeg', 0.82)
        });
        state.pieces[id] = {
          left: '42%',
          top: '35%',
          right: 'auto',
          bottom: 'auto',
          width: '260px',
          height: '190px',
          transform: 'rotate(-2deg)',
          zIndex: '5',
          display: ''
        };
        persist();

        var piece = document.createElement('div');
        piece.className = 'collage-piece photo-scrap user-collage-image';
        piece.dataset.collageId = id;
        piece.style.backgroundImage = 'url("' + state.users[state.users.length - 1].dataUrl + '")';
        collage.appendChild(piece);
        registerPiece(piece);
        selectPiece(piece);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  toggle.addEventListener('click', function () {
    active = !active;
    document.body.classList.toggle('collage-editor-active', active);
    toggle.classList.toggle('active', active);
    panel.classList.toggle('visible', active);
    toggle.textContent = active ? 'EXIT ARRANGE MODE' : 'ARRANGE COLLAGE';
    if (active) {
      var mountain = collage.querySelector('[data-collage-id="landscape-mountain"]');
      if (mountain) {
        mountain.style.display = '';
        mountain.style.visibility = 'visible';
        mountain.style.pointerEvents = 'auto';
        if (state.pieces['landscape-mountain']) {
          state.pieces['landscape-mountain'].display = '';
        }
        persist();
      }
    }
    if (!active && selected) {
      selected.classList.remove('collage-piece-selected');
      selected = null;
      selectedName.textContent = 'No piece selected';
    }
  });

  panel.querySelector('.collage-controls').addEventListener('click', function (event) {
    var action = event.target.dataset.action;
    if (!action || !selected) return;
    if (action === 'smaller') resizeSelected(0.9);
    if (action === 'larger') resizeSelected(1.1);
    if (action === 'left') rotateSelected(-3);
    if (action === 'right') rotateSelected(3);
    if (action === 'back') {
      pushHistory();
      layerSelected(-1);
      savePiece(selected, { skipHistory: true });
    }
    if (action === 'front') {
      pushHistory();
      layerSelected(1);
      savePiece(selected, { skipHistory: true });
    }
    if (action === 'hide') {
      pushHistory();
      selected.style.display = 'none';
      savePiece(selected, { skipHistory: true });
      selected.classList.remove('collage-piece-selected');
      selected = null;
      selectedName.textContent = 'No piece selected';
    }
  });

  panel.querySelector('.collage-add-image').addEventListener('click', function () {
    fileInput.click();
  });

  fileInput.addEventListener('change', function () {
    if (fileInput.files[0]) addImage(fileInput.files[0]);
    fileInput.value = '';
  });

  panel.querySelector('.collage-copy-layout').addEventListener('click', function (event) {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    event.target.textContent = 'LAYOUT COPIED';
  });

  panel.querySelector('.collage-download-layout').addEventListener('click', function () {
    downloadLayoutBackup();
  });

  panel.querySelector('.collage-import-layout').addEventListener('click', function () {
    layoutInput.click();
  });

  layoutInput.addEventListener('change', function () {
    if (layoutInput.files[0]) importLayoutBackup(layoutInput.files[0]);
    layoutInput.value = '';
  });

  panel.querySelector('.collage-screenshot-start').addEventListener('click', function () {
    var ok = window.confirm('Load the screenshot starting layout? Your current layout will download as a backup first.');
    if (!ok) return;
    downloadLayoutBackup();
    pushHistory();
    applyLayout(screenshotStartLayout());
  });

  panel.querySelector('.collage-restore-hidden').addEventListener('click', function () {
    pushHistory();
    document.querySelectorAll('.collage-piece').forEach(function (piece) {
      piece.style.display = '';
      if (state.pieces[pieceId(piece)]) {
        state.pieces[pieceId(piece)].display = '';
      }
    });
    persist();
  });

  panel.querySelector('.collage-reset-layout').addEventListener('click', function () {
    var ok = window.confirm('Reset collage to defaults? Download a backup first if you want to keep this arrangement.');
    if (!ok) return;
    downloadLayoutBackup();
    localStorage.removeItem(storageKey);
    window.location.reload();
  });

  undoButton.addEventListener('click', undo);
  redoButton.addEventListener('click', redo);

  document.addEventListener('keydown', function (event) {
    if (!active) return;
    var key = event.key.toLowerCase();
    var mod = event.metaKey || event.ctrlKey;
    if (!mod) return;
    if (key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if (key === 'z' && event.shiftKey || key === 'y') {
      event.preventDefault();
      redo();
    }
  });

  document.querySelectorAll('.collage-piece').forEach(registerPiece);
  restoreUserImages();
  updateHistoryButtons();
})();
