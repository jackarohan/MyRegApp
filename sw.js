/*  MyRegApp Service Worker — v7.0.1
    NetworkFirst for HTML + data (fresh content on every online load)
    CacheFirst for CDN scripts + fonts (versioned/stable URLs)
    Bump CACHE_VERSION on every content update. */

const CACHE_VERSION = 'mra-v7.0.8';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/regulations.js',
  '/data/glossary.js',
  '/data/whatschanging.js',
  '/data/basel3explorer.js'
];

const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
const CDN_ORIGINS  = ['https://unpkg.com'];

/* Install: pre-cache the app shell */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

/* Activate: clean old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch routing */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // CDN scripts (React, Babel): cache-first (versioned URLs are immutable)
  if (CDN_ORIGINS.some(o => url.origin === o)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Google Fonts: cache-first (stable)
  if (FONT_ORIGINS.some(o => url.origin === o)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Same-origin (HTML + assets): network-first (fresh content when online)
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(event.request));
    return;
  }
});

/* Strategies */

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}
