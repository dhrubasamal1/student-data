// Service Worker for Campus Saathi (VIT Bhopal Timetable & Squad Sync PWA)
const CACHE_NAME = 'vitb-timetable-v98';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './manifest-dark.json',
  './vendor/tailwind.css',
  './vendor/fontawesome/css/all.min.css',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './vendor/fontawesome/webfonts/fa-regular-400.woff2',
  './vendor/fontawesome/webfonts/fa-brands-400.woff2',
  './vendor/firebase/firebase-app-compat.js',
  './vendor/firebase/firebase-auth-compat.js',
  './vendor/firebase/firebase-firestore-compat.js',
  './delivery/index.html',
  './delivery/delivery.js',
  './teacher_review/index.html',
  './teacher_review/teacher_review.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/icon.svg',
  './icons/favicon.png'
];

async function verifyCompleteHtmlResponse(res) {
  if (!res || !res.ok) return null;
  try {
    const text = await res.clone().text();
    if (!text.includes('</html>') || !text.includes('initAppImmediate')) {
      return null;
    }
    return res;
  } catch (e) {
    return null;
  }
}

async function fetchNoCache(url) {
  return fetch(new Request(url, { cache: 'no-cache' }));
}

// Install: Pre-cache complete offline shell + vendor assets bypassing stale HTTP caches
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Fetch and validate complete index.html before committing cache (prevents partial CDN deploy corruption)
    const indexRes = await verifyCompleteHtmlResponse(await fetchNoCache('./index.html'));
    if (!indexRes) {
      throw new Error('Incomplete or unavailable index.html during SW install');
    }
    await cache.put('./index.html', indexRes.clone());
    await cache.put('./', indexRes);

    const otherAssets = STATIC_ASSETS.filter(a => a !== './' && a !== './index.html');
    await Promise.all(otherAssets.map(async (asset) => {
      const res = await fetchNoCache(asset);
      if (!res || !res.ok) {
        throw new Error('Failed pre-cache asset: ' + asset);
      }
      await cache.put(asset, res);
    }));

    await self.skipWaiting();
  })());
});

// Activate: Clean up older cache versions only after new cache is verified complete
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function getCachedNavigationFallback(req) {
  return (
    (await caches.match(req, { ignoreSearch: true })) ||
    (await caches.match('./index.html', { ignoreSearch: true })) ||
    (await caches.match('./', { ignoreSearch: true }))
  );
}

// Fetch: Atomic validated HTML + cache-first local vendor assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept Firebase / Google APIs (Firestore, Auth, Mess REST API); still cache fonts.googleapis.com CSS
  if (
    (url.hostname.endsWith('.googleapis.com') && url.hostname !== 'fonts.googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('firebaseapp.com')
  ) {
    return;
  }

  // HTML navigation requests: Network-first with no-cache, integrity check, 3.5s stall guard, and multi-key offline fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cachedFallback = await getCachedNavigationFallback(req);
      const isMainEntry = !url.pathname.includes('/delivery/') && !url.pathname.includes('/teacher_review/');

      const networkFetch = (async () => {
        const networkRes = await fetchNoCache(req.url);
        if (!networkRes || !networkRes.ok) return null;
        if (isMainEntry) {
          const valid = await verifyCompleteHtmlResponse(networkRes);
          if (!valid) return null;
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', valid.clone());
          await cache.put('./', valid.clone());
          return valid;
        }
        const cache = await caches.open(CACHE_NAME);
        await cache.put(req, networkRes.clone());
        return networkRes;
      })().catch(() => null);

      if (cachedFallback) {
        const timeoutFallback = new Promise((resolve) => setTimeout(() => resolve(cachedFallback), 3500));
        const winner = await Promise.race([networkFetch.then(r => r || cachedFallback), timeoutFallback]);
        return winner || cachedFallback;
      }

      const fresh = await networkFetch;
      return fresh || Response.error();
    })());
    return;
  }

  // Same-origin local files (vendor CSS/JS/woff2, icons, manifests): Cache-first for instant atomic matching with shell
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cachedRes) => {
        if (cachedRes) return cachedRes;
        return fetchNoCache(req.url)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || Response.error()));
      })
    );
    return;
  }

  // External GET assets (optional fonts): Stale-while-revalidate with safe error fallback
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cachedRes || Response.error());

      return cachedRes || fetchPromise;
    })
  );
});

// Client Message Listener: Post notifications from page and handle keep-alive
self.addEventListener('message', (event) => {
  if (!event.data) return;

  // Trigger notification natively from the Service Worker thread
  if (event.data.action === 'show_notification') {
    const { title, options } = event.data;
    const finalOptions = {
      icon: './icons/icon-192.png',
      badge: './icons/favicon.png',
      vibrate: [200, 100, 200],
      renotify: true,
      tag: 'cs_notif_' + Date.now(),
      data: { url: './?tab=parcel', tab: 'parcel' },
      ...options
    };
    event.waitUntil(self.registration.showNotification(title, finalOptions));
  } else if (event.data.action === 'skip_waiting') {
    self.skipWaiting();
  } else if (event.data.action === 'ping') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ status: 'alive', cache: CACHE_NAME });
    }
  }
});

// Web Push Event: Display push notifications sent via Web Push / FCM
self.addEventListener('push', (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload = { title: 'Campus Saathi Alert', body: event.data.text() };
    }
  }
  const title = payload.title || 'Campus Saathi Alert';
  const targetTab = payload.tab || (payload.data && payload.data.tab) || 'parcel';
  const targetUrl = payload.url || (payload.data && payload.data.url) || (`./?tab=${targetTab}`);

  const options = {
    body: payload.body || payload.note || 'New squad update available',
    icon: payload.icon || './icons/icon-192.png',
    badge: payload.badge || './icons/favicon.png',
    vibrate: payload.vibrate || [200, 100, 200],
    tag: payload.tag || ('cs_push_' + Date.now()),
    renotify: true,
    data: {
      url: targetUrl,
      tab: targetTab
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click: Focus or open window and navigate to the requested tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetTab = data.tab || 'parcel';
  const targetUrl = data.url || (`./?tab=${targetTab}`);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.postMessage({ action: 'navigate_tab', tab: targetTab });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Background Sync / Periodic Background Sync handlers
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-updates' || event.tag === 'parcel-sync') {
    event.waitUntil(Promise.resolve());
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates' || event.tag === 'parcel-sync') {
    event.waitUntil(Promise.resolve());
  }
});
