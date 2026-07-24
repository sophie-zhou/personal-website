(function () {
  var projectRoot = '/Users/sophiezhou/Development/personal-website/';
  var active = false;
  var hovered = null;

  var toggle = document.createElement('button');
  toggle.className = 'code-inspector-toggle';
  toggle.type = 'button';
  toggle.textContent = 'EDIT CODE';

  var panel = document.createElement('aside');
  panel.className = 'code-inspector-panel';
  panel.setAttribute('aria-live', 'polite');

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var sourceCache = {};

  function loadSource(path) {
    if (!sourceCache[path]) {
      sourceCache[path] = fetch(path).then(function (response) {
        return response.text();
      });
    }
    return sourceCache[path];
  }

  function lineNumber(source, needle) {
    var index = source.indexOf(needle);
    if (index < 0) return null;
    return source.slice(0, index).split('\n').length;
  }

  function selectorFor(element) {
    if (element.id) return '#' + element.id;
    var classes = Array.from(element.classList).filter(function (className) {
      return className !== 'code-inspector-hover';
    });
    if (classes.length) {
      return '.' + classes.join('.');
    }
    return element.tagName.toLowerCase();
  }

  function sourceFor(element) {
    if (element.closest('.collage-bg')) return 'js/site.js';
    return currentPage;
  }

  function matchingRules(element) {
    var matches = [];

    Array.from(document.styleSheets).forEach(function (sheet) {
      var rules;
      try {
        rules = sheet.cssRules;
      } catch (error) {
        return;
      }

      Array.from(rules || []).forEach(function (rule) {
        if (!rule.selectorText) return;
        if (rule.selectorText.indexOf('code-inspector') >= 0) return;
        try {
          if (element.matches(rule.selectorText)) matches.push(rule);
        } catch (error) {
          // Ignore unsupported selectors.
        }
      });
    });

    return matches.slice(-6);
  }

  function addCodeBlock(container, label, code) {
    var heading = document.createElement('div');
    heading.className = 'inspector-code-label';
    heading.textContent = label;

    var pre = document.createElement('pre');
    pre.textContent = code;

    container.appendChild(heading);
    container.appendChild(pre);
  }

  function showElement(element) {
    var selector = selectorFor(element);
    var sourcePath = sourceFor(element);
    var rules = matchingRules(element);

    Promise.all([
      loadSource(sourcePath),
      loadSource('css/styles.css')
    ]).then(function (sources) {
      var sourceText = sources[0];
      var cssText = sources[1];
      var sourceNeedle = element.classList.length
        ? element.classList.item(0)
        : element.textContent.trim().slice(0, 40);
      var htmlLine = lineNumber(sourceText, sourceNeedle);

      panel.replaceChildren();
      panel.classList.add('visible');

      var title = document.createElement('h2');
      title.textContent = selector;
      panel.appendChild(title);

      var source = document.createElement('p');
      source.className = 'inspector-source';
      source.textContent = projectRoot + sourcePath + (htmlLine ? ':' + htmlLine : '');
      panel.appendChild(source);

      addCodeBlock(panel, 'ELEMENT', element.outerHTML.slice(0, 900));

      rules.forEach(function (rule) {
        var cssLine = lineNumber(cssText, rule.selectorText);
        addCodeBlock(
          panel,
          'CSS · css/styles.css' + (cssLine ? ':' + cssLine : ''),
          rule.cssText
        );
      });

      var copy = document.createElement('button');
      copy.className = 'inspector-copy';
      copy.type = 'button';
      copy.textContent = 'COPY FILE + SELECTOR';
      copy.addEventListener('click', function () {
        navigator.clipboard.writeText(
          projectRoot + sourcePath + '\n' + selector
        );
        copy.textContent = 'COPIED';
      });
      panel.appendChild(copy);
    });
  }

  toggle.addEventListener('click', function () {
    active = !active;
    document.body.classList.toggle('code-inspector-active', active);
    toggle.classList.toggle('active', active);
    toggle.textContent = active ? 'EXIT EDIT MODE' : 'EDIT CODE';
    if (!active) {
      panel.classList.remove('visible');
      if (hovered) hovered.classList.remove('code-inspector-hover');
      hovered = null;
    }
  });

  document.addEventListener('mouseover', function (event) {
    if (!active || event.target.closest('.code-inspector-panel, .code-inspector-toggle')) return;
    if (hovered) hovered.classList.remove('code-inspector-hover');
    hovered = event.target;
    hovered.classList.add('code-inspector-hover');
  }, true);

  document.addEventListener('click', function (event) {
    if (!active || event.target.closest('.code-inspector-panel, .code-inspector-toggle')) return;
    event.preventDefault();
    event.stopPropagation();
    showElement(event.target);
  }, true);
})();
