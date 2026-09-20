// Progressive enhancement only. The site is fully readable with JS disabled.
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'jt-theme';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode, blocked storage */ }
  }
  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function current() {
    return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
  }

  var saved = stored();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var sync = function () { toggle.setAttribute('aria-pressed', String(current() === 'dark')); };
    sync();
    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      sync();
    });
  }

  var print = document.getElementById('print-resume');
  if (print) print.addEventListener('click', function () { window.print(); });
})();
