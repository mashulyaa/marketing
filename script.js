(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  root.classList.add('is-loading');
  function finishPreload() {
    if (preloader) preloader.classList.add('is-done');
    root.classList.remove('is-loading');
    setTimeout(function () { if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 1000);
  }
  window.addEventListener('load', function () { setTimeout(finishPreload, reduce ? 0 : 700); });
  setTimeout(finishPreload, 3200);

  /* ---------- Smooth scroll (Lenis, progressive) ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  function scrollToTarget(id) {
    var el = document.querySelector(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

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
    if (!document.querySelector(id)) return;
    e.preventDefault();
    if (nav) {
      nav.classList.remove('is-open');
      if (toggle) { toggle.classList.remove('is-active'); toggle.setAttribute('aria-expanded', 'false'); }
    }
    scrollToTarget(id);
  });

  /* ---------- Header hide / stick ---------- */
  var header = document.querySelector('[data-header]');
  var lastY = 0;
  function onScroll(y) {
    if (!header) return;
    header.classList.toggle('is-stuck', y > 20);
    if (y > lastY && y > 320) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');
    lastY = y;
  }
  if (lenis) lenis.on('scroll', function (e) { onScroll(e.scroll); });
  else window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  // stagger delay inside a group
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal-group]'), function (group) {
    Array.prototype.forEach.call(group.querySelectorAll(':scope > [data-reveal]'), function (el, i) {
      el.style.setProperty('--d', (i * 0.09) + 's');
    });
  });

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Live chat ---------- */
  var chat = document.querySelector('[data-chat]');
  if (chat) {
    if (reduce || !('IntersectionObserver' in window)) {
      chat.classList.add('is-live');
    } else {
      var chatIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { chat.classList.add('is-live'); chatIO.disconnect(); }
        });
      }, { threshold: 0.4 });
      chatIO.observe(chat);
    }
  }

  /* ---------- Parallax ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduce) {
    var raf2 = null;
    function applyParallax() {
      raf2 = null;
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var speed = parseFloat(el.getAttribute('data-speed')) || 0.08;
        var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + (-offset).toFixed(2) + 'px,0)';
      });
    }
    function requestParallax() { if (!raf2) raf2 = requestAnimationFrame(applyParallax); }
    if (lenis) lenis.on('scroll', requestParallax);
    else window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
    requestParallax();
  }

  /* ---------- Custom cursor ---------- */
  var cursor = document.getElementById('cursor');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursor && finePointer && !reduce) {
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [data-cursor], .work__item, .lang-row')) cursor.classList.add('is-hover');
      else cursor.classList.remove('is-hover');
    });
  }
})();
