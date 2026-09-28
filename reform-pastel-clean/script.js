(function () {
  'use strict';

  /* ---------- Burger menu ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
  }

  /* ---------- In-page anchors ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (nav) {
      nav.classList.remove('is-open');
      if (toggle) { toggle.classList.remove('is-active'); toggle.setAttribute('aria-expanded', 'false'); }
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Header stick / hide ---------- */
  var header = document.querySelector('[data-header]');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (!header) return;
    header.classList.toggle('is-stuck', y > 20);
    if (y > lastY && y > 320) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });
})();
