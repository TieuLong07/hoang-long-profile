/* =====================================================
   Hoàng Long Profile — main script
   ===================================================== */
(() => {
  'use strict';

  // ---------- Year footer ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Theme toggle (with persistence) ----------
  const THEME_KEY = 'hl-theme';
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  const applyTheme = (t) => {
    if (t === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  };

  const saved = (() => {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  })();
  if (saved) applyTheme(saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch {}
    });
  }

  // ---------- Typed role animation ----------
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      'Sinh viên Khoa học Máy tính · VKU',
      'Front-end & Full-stack Developer',
      'Unity Indie Game Developer',
      'AI Agent Tinkerer',
    ];
    let pi = 0, ci = 0, deleting = false;

    const tick = () => {
      const word = phrases[pi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, ci);

      let delay = deleting ? 35 : 75;
      if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }

      setTimeout(tick, delay);
    };
    tick();
  }

  // ---------- Reveal on scroll ----------
  const revealTargets = document.querySelectorAll('.section, .hero, .project, .skills__group, .about__card');
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  // ---------- Service Worker registration ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('sw.js')
        .then((reg) => {
          console.info('[PWA] service worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] service worker registration failed:', err);
        });
    });
  }
})();
