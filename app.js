// Langfuse landing replica — interactions
(function () {
  'use strict';

  /* ── Themes ────────────────────────────────────────── */
  var THEMES = [
    { id: 'light',  mode: 'light', label: 'Claro' },
    { id: 'dark',   mode: 'dark',  label: 'Oscuro' },
    { id: 'green',  mode: 'light', label: 'Verde' },
    { id: 'blue',   mode: 'light', label: 'Azul' },
    { id: 'purple', mode: 'light', label: 'Morado' }
  ];

  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('lf-theme'); } catch (e) {}

  function themeById(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return null;
  }

  function currentTheme() {
    return themeById(root.getAttribute('data-theme'));
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme.id);
    root.setAttribute('data-mode', theme.mode);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', getComputedStyle(document.body).backgroundColor);
    if (persist) { try { localStorage.setItem('lf-theme', theme.id); } catch (e) {} }
    syncToggle();
  }

  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(
    currentTheme() ||
    themeById(stored) ||
    (prefersDark ? THEMES[1] : THEMES[0]),
    false
  );

  var toggle = document.getElementById('themeToggle');
  function syncToggle() {
    if (!toggle) return;
    var theme = currentTheme() || THEMES[0];
    var next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    toggle.setAttribute('aria-label', 'Tema: ' + theme.label + ' — cambiar a ' + next.label);
    toggle.setAttribute('title', theme.label);
    toggle.setAttribute('data-theme-name', theme.id);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var i = THEMES.indexOf(currentTheme());
      applyTheme(THEMES[(i + 1) % THEMES.length], true);
    });
  }

  /* ── Sticky header ─────────────────────────────────── */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Announcement close ────────────────────────────── */
  var announce = document.querySelector('.announce');
  var close = announce && announce.querySelector('.announce__close');
  if (close) {
    close.addEventListener('click', function () {
      announce.classList.add('is-hidden');
    });
  }

  /* ── Mobile menu ───────────────────────────────────── */
  var burger = document.getElementById('burger');
  var mobile = document.getElementById('mobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.hasAttribute('hidden');
      if (open) { mobile.removeAttribute('hidden'); mobile.setAttribute('data-open', ''); }
      else { mobile.setAttribute('hidden', ''); mobile.removeAttribute('data-open'); }
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ── Nav mega menus (hover on pointer, click on touch) ─ */
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item'));

  function closeAll(except) {
    items.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var panel = item.querySelector('.mega');
      var btn = item.querySelector('.nav__link');
      if (panel) panel.hidden = true;
      if (btn && btn.tagName === 'BUTTON') btn.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(function (item) {
    var panel = item.querySelector('.mega');
    var btn = item.querySelector('.nav__link');
    if (!panel || !btn || btn.tagName !== 'BUTTON') return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.hidden;
      closeAll(item);
      panel.hidden = !open;
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('mouseenter', function () {
      if (!window.matchMedia('(hover: hover)').matches) return;
      closeAll(item);
      panel.hidden = false;
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function () {
      if (!window.matchMedia('(hover: hover)').matches) return;
      panel.hidden = true;
      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(null); }
  });

  /* ── Animated stat counters ────────────────────────── */
  var counters = document.querySelectorAll('[data-count]');

  function render(el, value) {
    var suffix = el.dataset.suffix || '';
    if (el.dataset.format === 'k') {
      el.textContent = Math.round(value).toLocaleString('en-US') + suffix;
    } else {
      el.textContent = Math.round(value).toLocaleString('en-US') + suffix;
    }
  }

  function animate(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var start = performance.now();
    var dur = 1100;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      render(el, target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { io.observe(el); });
  }

  /* ── FAQ: keep only one open ───────────────────────── */
  var faq = document.getElementById('faqList');
  if (faq) {
    var items2 = faq.querySelectorAll('.faq__item');
    Array.prototype.forEach.call(items2, function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        Array.prototype.forEach.call(items2, function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* ── Reveal on scroll ──────────────────────────────── */
  var targets = document.querySelectorAll('.card, .tool, .stack__col, .reasons li, .stat, .faq__item');
  if ('IntersectionObserver' in window) {
    targets.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(14px)'; });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        el.style.opacity = '1';
        el.style.transform = 'none';
        ro.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(targets, function (el) { ro.observe(el); });
  }
})();