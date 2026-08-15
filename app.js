(function () {
  'use strict';

  var grid = document.getElementById('grid');
  var search = document.getElementById('search');
  var clearSearchButton = document.getElementById('clear-search');
  var empty = document.getElementById('empty');
  var errorBox = document.getElementById('error');
  var toggle = document.getElementById('theme-toggle');
  var selectedBookmark = null;

  /* ---------------- theme ---------------- */

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
    toggle.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }

  applyTheme(document.documentElement.dataset.theme);

  toggle.addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('startpage-theme', next);
    } catch (e) { /* storage blocked */ }
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
