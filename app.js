(function () {
  'use strict';

  var grid = document.getElementById('grid');
  var search = document.getElementById('search');
  var clearSearchButton = document.getElementById('clear-search');
  var empty = document.getElementById('empty');
  var errorBox = document.getElementById('error');
  var settingsDialog = document.getElementById('settings');
  var settingsOpenButton = document.getElementById('settings-open');
  var selectedBookmark = null;

  search.focus();

  /* ---------------- settings ---------------- */

  var FONT_SIZES = {
    category: { variable: '--category-font-size', storageKey: 'startpage-category-font-size', fallback: 1.1, output: document.getElementById('category-size') },
    bookmark: { variable: '--bookmark-font-size', storageKey: 'startpage-bookmark-font-size', fallback: 0.9, output: document.getElementById('bookmark-size') }
  };
  var FONT_STEP = 0.05;
  var FONT_MIN = 0.6;
  var FONT_MAX = 2.5;

  var COLUMNS_KEY = 'startpage-grid-columns';
  var COLUMNS_FALLBACK = 4;
  var columnsOutput = document.getElementById('columns-value');
  var currentColumns = COLUMNS_FALLBACK;

  var ANGLE_KEY = 'startpage-shadow-angle';
  var ANGLE_FALLBACK = 60;
  var ANGLE_STEP = 15;
  var angleOutput = document.getElementById('shadow-angle-value');
  var currentAngle = ANGLE_FALLBACK;

  var SHADOW_SIZE_KEY = 'startpage-shadow-size';
  var SHADOW_SIZE_FALLBACK = 12;
  var SHADOW_SIZE_STEP = 2;
  var SHADOW_SIZE_MIN = 0;
  var SHADOW_SIZE_MAX = 40;
  var shadowSizeOutput = document.getElementById('shadow-size-value');
  var currentShadowSize = SHADOW_SIZE_FALLBACK;

  var TOOLTIP_ENABLED_KEY = 'startpage-tooltip-enabled';
  var tooltipEnabledInput = document.getElementById('tooltip-enabled');
  var tooltipEnabled = readStored(TOOLTIP_ENABLED_KEY) !== 'false';

  function readStored(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null; // storage blocked
    }
  }

  function writeStored(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) { /* storage blocked */ }
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-value]'), function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.themeValue === theme));
    });
  }

  function applyFontSize(target, size) {
    var config = FONT_SIZES[target];
    var clamped = Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(size / FONT_STEP) * FONT_STEP));
    document.documentElement.style.setProperty(config.variable, clamped.toFixed(2) + 'rem');
    config.current = clamped;
    config.output.textContent = clamped.toFixed(2) + 'rem';
    Array.prototype.forEach.call(document.querySelectorAll('[data-size-target="' + target + '"]'), function (button) {
      var step = Number(button.dataset.sizeStep);
      button.disabled = step < 0 ? clamped <= FONT_MIN : clamped >= FONT_MAX;
    });
    return clamped;
  }

  Object.keys(FONT_SIZES).forEach(function (target) {
    var config = FONT_SIZES[target];
    var stored = parseFloat(readStored(config.storageKey));
    applyFontSize(target, isNaN(stored) ? config.fallback : stored);
  });

  function applyColumns(count) {
    currentColumns = Math.max(1, Math.round(count) || 1);
    document.documentElement.style.setProperty('--grid-columns', String(currentColumns));
    columnsOutput.textContent = String(currentColumns);
    Array.prototype.forEach.call(document.querySelectorAll('[data-columns-step="-1"]'), function (button) {
      button.disabled = currentColumns <= 1;
    });
    return currentColumns;
  }

  applyColumns(parseInt(readStored(COLUMNS_KEY), 10) || COLUMNS_FALLBACK);

  function applyShadowAngle(angle) {
    currentAngle = ((Math.round(angle) % 360) + 360) % 360;
    document.documentElement.style.setProperty('--shadow-angle', currentAngle + 'deg');
    angleOutput.textContent = currentAngle + '\u00b0';
    return currentAngle;
  }

  var storedAngle = parseInt(readStored(ANGLE_KEY), 10);
  applyShadowAngle(isNaN(storedAngle) ? ANGLE_FALLBACK : storedAngle);

  function applyShadowSize(size) {
    currentShadowSize = Math.min(SHADOW_SIZE_MAX, Math.max(SHADOW_SIZE_MIN, Math.round(size)));
    document.documentElement.style.setProperty('--shadow-distance', currentShadowSize + 'px');
    shadowSizeOutput.textContent = currentShadowSize + 'px';
    Array.prototype.forEach.call(document.querySelectorAll('[data-shadow-size-step]'), function (button) {
      var step = Number(button.dataset.shadowSizeStep);
      button.disabled = step < 0 ? currentShadowSize <= SHADOW_SIZE_MIN : currentShadowSize >= SHADOW_SIZE_MAX;
    });
    return currentShadowSize;
  }

  var storedShadowSize = parseInt(readStored(SHADOW_SIZE_KEY), 10);
  applyShadowSize(isNaN(storedShadowSize) ? SHADOW_SIZE_FALLBACK : storedShadowSize);

  applyTheme(document.documentElement.dataset.theme);

  settingsOpenButton.addEventListener('click', function () {
    settingsDialog.showModal();
  });

  settingsDialog.addEventListener('click', function (event) {
    var themeButton = event.target.closest('[data-theme-value]');
    if (themeButton) {
      applyTheme(themeButton.dataset.themeValue);
      writeStored('startpage-theme', themeButton.dataset.themeValue);
      return;
    }

    var columnsButton = event.target.closest('[data-columns-step]');
    if (columnsButton) {
      writeStored(COLUMNS_KEY, String(applyColumns(currentColumns + Number(columnsButton.dataset.columnsStep))));
      return;
    }

    var angleButton = event.target.closest('[data-angle-step]');
    if (angleButton) {
      writeStored(ANGLE_KEY, String(applyShadowAngle(currentAngle + Number(angleButton.dataset.angleStep) * ANGLE_STEP)));
      return;
    }

    var shadowSizeButton = event.target.closest('[data-shadow-size-step]');
    if (shadowSizeButton) {
      writeStored(SHADOW_SIZE_KEY, String(applyShadowSize(currentShadowSize + Number(shadowSizeButton.dataset.shadowSizeStep) * SHADOW_SIZE_STEP)));
      return;
    }

    var sizeButton = event.target.closest('[data-size-target]');
    if (!sizeButton) return;
    var target = sizeButton.dataset.sizeTarget;
    var config = FONT_SIZES[target];
    var next = applyFontSize(target, config.current + Number(sizeButton.dataset.sizeStep) * FONT_STEP);
    writeStored(config.storageKey, next.toFixed(2));
  });

  settingsDialog.addEventListener('change', function (event) {
    if (event.target !== tooltipEnabledInput) return;
    writeStored(TOOLTIP_ENABLED_KEY, String(applyTooltipEnabled(tooltipEnabledInput.checked)));
  });

  /* ---------------- render ---------------- */

  // Bloqueia esquemas perigosos como javascript: vindos do YAML.
  function isSafeUrl(url) {
    return typeof url === 'string' && /^https?:\/\//i.test(url.trim());
  }

  function renderBookmark(bookmark, categoryName) {
    var title = String(bookmark && bookmark.title ? bookmark.title : '').trim();
    var url = bookmark && bookmark.url ? String(bookmark.url).trim() : '';
    if (!title && !url) return null;

    var li = document.createElement('li');
    li.className = 'bookmark';
    li.dataset.haystack = (categoryName + ' ' + title + ' ' + url).toLowerCase();

    if (isSafeUrl(url)) {
      var a = document.createElement('a');
      a.href = url;
      a.rel = 'noopener noreferrer';
      a.textContent = title || url;
      li.appendChild(a);
    } else {
      var span = document.createElement('span');
      span.className = 'invalid';
      span.textContent = (title || '(untitled)') + ' — Invalid URL';
      li.appendChild(span);
    }

    return li;
  }

  function renderCategory(category) {
    var categoryName = String(category && category.name ? category.name : 'Uncategorized');
    var bookmarks = Array.isArray(category && category.bookmarks) ? category.bookmarks : [];
    var items = bookmarks.map(function (bookmark) {
      return renderBookmark(bookmark, categoryName);
    }).filter(Boolean);
    if (!items.length) return null;

    var section = document.createElement('section');
    section.className = 'category';

    var heading = document.createElement('h2');
    heading.textContent = categoryName;
    section.appendChild(heading);

    var ul = document.createElement('ul');
    items.forEach(function (li) { ul.appendChild(li); });
    section.appendChild(ul);

    return section;
  }

  function render(data) {
    var categories = Array.isArray(data && data.categories) ? data.categories : [];
    grid.textContent = '';
    categories.forEach(function (category) {
      var section = renderCategory(category);
      if (section) grid.appendChild(section);
    });
    if (!grid.children.length) {
      showError('No valid categories found in bookmarks.yaml.');
    }
  }

  /* ---------------- tooltip ---------------- */

  var tooltip = document.createElement('div');
  tooltip.className = 'url-tooltip';
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  function applyTooltipEnabled(enabled) {
    tooltipEnabled = Boolean(enabled);
    tooltipEnabledInput.checked = tooltipEnabled;
    if (!tooltipEnabled) tooltip.hidden = true;
    return tooltipEnabled;
  }

  applyTooltipEnabled(tooltipEnabled);

  var TOOLTIP_OFFSET = 28;

  function positionTooltip(x, y) {
    var rect = tooltip.getBoundingClientRect();
    var left = x - rect.width / 2;
    var top = y + TOOLTIP_OFFSET;
    // Keep it within the viewport horizontally and flip above the cursor if it would overflow below.
    left = Math.min(Math.max(0, left), window.innerWidth - rect.width);
    if (top + rect.height > window.innerHeight) top = y - rect.height - TOOLTIP_OFFSET;
    tooltip.style.left = Math.max(0, left) + 'px';
    tooltip.style.top = Math.max(0, top) + 'px';
  }

  grid.addEventListener('mouseover', function (event) {
    if (!tooltipEnabled) return;
    var link = event.target.closest('a');
    if (!link || !grid.contains(link)) return;
    tooltip.textContent = link.href;
    tooltip.hidden = false;
    positionTooltip(event.clientX, event.clientY);
  });

  grid.addEventListener('mousemove', function (event) {
    if (!tooltipEnabled || tooltip.hidden) return;
    positionTooltip(event.clientX, event.clientY);
  });

  grid.addEventListener('mouseout', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    if (event.relatedTarget && link.contains(event.relatedTarget)) return;
    tooltip.hidden = true;
  });

  /* ---------------- busca ---------------- */

  function filter(term) {
    var queries = term.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var anyVisible = false;

    clearSelection();

    Array.prototype.forEach.call(grid.children, function (section) {
      var visibleInSection = 0;
      Array.prototype.forEach.call(section.querySelectorAll('.bookmark'), function (li) {
        var match = !queries.length || queries.every(function (query) {
          return li.dataset.haystack.indexOf(query) !== -1;
        });
        li.hidden = !match;
        if (match) visibleInSection++;
      });
      section.hidden = visibleInSection === 0;
      if (visibleInSection) anyVisible = true;
    });

    if (queries.length && anyVisible) selectBookmark(visibleBookmarks()[0]);
    empty.hidden = anyVisible || !grid.children.length;
    clearSearchButton.hidden = !search.value;
  }

  function visibleBookmarks() {
    return Array.prototype.filter.call(grid.querySelectorAll('.bookmark'), function (bookmark) {
      return !bookmark.hidden && !bookmark.closest('[hidden]');
    });
  }

  function clearSelection() {
    if (!selectedBookmark) return;
    selectedBookmark.classList.remove('selected');
    selectedBookmark.removeAttribute('aria-current');
    selectedBookmark = null;
  }

  function selectBookmark(bookmark) {
    clearSelection();
    if (!bookmark) return;
    selectedBookmark = bookmark;
    selectedBookmark.classList.add('selected');
    selectedBookmark.setAttribute('aria-current', 'true');
    selectedBookmark.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function moveSelection(direction) {
    var bookmarks = visibleBookmarks();
    if (!bookmarks.length) return;
    if (!selectedBookmark || bookmarks.indexOf(selectedBookmark) === -1) {
      selectBookmark(direction === 'up' || direction === 'left' ? bookmarks[bookmarks.length - 1] : bookmarks[0]);
      return;
    }

    var current = selectedBookmark.getBoundingClientRect();
    var candidates = bookmarks.filter(function (bookmark) {
      if (bookmark === selectedBookmark) return false;
      var rect = bookmark.getBoundingClientRect();
      if (direction === 'left') return rect.right <= current.left + 1;
      if (direction === 'right') return rect.left >= current.right - 1;
      if (direction === 'up') return rect.bottom <= current.top + 1;
      return rect.top >= current.bottom - 1;
    });

    if (!candidates.length) {
      var index = bookmarks.indexOf(selectedBookmark);
      var step = direction === 'up' || direction === 'left' ? -1 : 1;
      selectBookmark(bookmarks[(index + step + bookmarks.length) % bookmarks.length]);
      return;
    }

    candidates.sort(function (first, second) {
      var firstRect = first.getBoundingClientRect();
      var secondRect = second.getBoundingClientRect();
      var firstDistance = Math.abs(firstRect.left - current.left) + Math.abs(firstRect.top - current.top);
      var secondDistance = Math.abs(secondRect.left - current.left) + Math.abs(secondRect.top - current.top);
      return firstDistance - secondDistance;
    });
    selectBookmark(candidates[0]);
  }

  function openSelection() {
    if (!selectedBookmark) {
      selectBookmark(visibleBookmarks()[0]);
    }
    var link = selectedBookmark && selectedBookmark.querySelector('a');
    if (link) link.click();
  }

  search.addEventListener('input', function () {
    filter(search.value);
  });

  clearSearchButton.addEventListener('click', function () {
    search.value = '';
    filter('');
    search.focus();
  });

  document.addEventListener('keydown', function (event) {
    if (settingsDialog.open) return;
    if (event.key === 'Escape') {
      search.value = '';
      filter('');
      search.blur();
      return;
    }
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    var navigationKeys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (navigationKeys[event.key]) {
      var active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable) && active !== search) return;
      event.preventDefault();
      search.focus();
      moveSelection(navigationKeys[event.key]);
      return;
    }
    if (event.key === 'Enter' && (document.activeElement === search || selectedBookmark)) {
      event.preventDefault();
      openSelection();
      return;
    }
    var isSlash = event.key === '/';
    var isLetter = event.key.length === 1 && /\p{L}/u.test(event.key);
    if (!isSlash && !isLetter) return;
    var active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
    if (isSlash) {
      event.preventDefault();
      search.select();
    }
    // Do not preventDefault for letters: the typed character goes into the newly focused input.
    search.focus();
  });

  /* ---------------- carga ---------------- */

  function showError(message, detail) {
    errorBox.textContent = '';

    var p = document.createElement('p');
    p.textContent = message;
    errorBox.appendChild(p);

    if (detail) {
      var pre = document.createElement('p');
      var code = document.createElement('code');
      code.textContent = detail;
      pre.appendChild(code);
      errorBox.appendChild(pre);
    }

    errorBox.hidden = false;
  }

  function showLoadError(detail) {
    showError(
      'Could not load bookmarks.yaml. When opening the page via file://, ' +
      'the browser blocks local file access by default. Start Chrome with ' +
      '--allow-file-access-from-files, or set privacy.file_unique_origin to false in ' +
      'Firefox about:config.',
      detail
    );
  }

  // Query param + no-store evitam que o navegador sirva um YAML em cache.
  fetch('bookmarks.yaml?t=' + Date.now(), { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    })
    .then(function (text) {
      render(jsyaml.load(text));
      filter(search.value);
    })
    .catch(function (err) {
      showLoadError(String(err && err.message ? err.message : err));
    });
})();
