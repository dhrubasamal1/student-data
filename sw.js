// Service Worker for Campus Saathi (VIT Bhopal Timetable & Squad Sync PWA)
const CACHE_NAME = 'vitb-timetable-v66';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './manifest-dark.json',
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

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions and take immediate client control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML, Stale-while-revalidate for assets/CDN
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Allow Firebase API and real-time streams to go direct to network
  if (url.hostname.includes('firestore.googleapis.com') || url.hostname.includes('firebaseio.com')) {
    return;
  }

  // HTML navigation requests: Network first, fall back to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match(req);
        })
    );
    return;
  }

  // All other GET requests (images, CSS, JS, fonts): Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      }).catch((err) => {
        // Network failed; if we have cachedRes it's fine, otherwise ignore
        return cachedRes;
      });

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
