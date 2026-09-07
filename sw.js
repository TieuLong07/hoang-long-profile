/* =====================================================
   Hoàng Long Profile — Service Worker
   Cache-first cho assets tĩnh, network-first cho cùng path.
   ===================================================== */
const CACHE_NAME = 'hl-profile-v3';
const RUNTIME_CACHE = 'hl-runtime-v3';

const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap'
];

// ---------- Install: precache shell ----------
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll for same-origin; for cross-origin (Google Fonts) catch individually
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] failed to cache', url, err);
          })
        )
      );
    })
  );
});

// ---------- Activate: cleanup old caches ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ---------- Fetch: cache-first with network fallback ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  // Skip non-http(s) (chrome-extension, etc.)
  const url = new URL(req.url);
  if (!/^https?:$/.test(url.protocol)) return;

  // For navigations (HTML), use network-first so user gets updates
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(req)) || (await cache.match('./index.html')) || Response.error();
        }
      })()
    );
    return;
  }

  // For everything else: cache-first, fallback to network, then runtime cache
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200 && fresh.type === 'basic') {
          const rc = await caches.open(RUNTIME_CACHE);
          rc.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        const rc = await caches.open(RUNTIME_CACHE);
        const fallback = await rc.match(req);
        if (fallback) return fallback;
        throw err;
      }
    })()
  );
});

// ---------- Message: skip waiting on update ----------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
