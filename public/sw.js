const CACHE_NAME = 'iss-tracker-v1';
const STATIC_CACHE = 'static-assets-v1';

// Assets that won't change often - REMOVE /public/ prefix
const staticAssets = [
  '/',
  '/manifest.json?v=2',
  '/icons/ios/16.png',  // Removed /public/
  '/icons/android/android-launchericon-48-48.png',
  '/icons/android/android-launchericon-72-72.png',
  '/icons/android/android-launchericon-96-96.png',
  '/icons/android/android-launchericon-144-144.png',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        //console.log('Caching static assets');
        return cache.addAll(staticAssets);
      }).catch(error => {
        //console.error('Cache addAll error:', error);
      }),
      self.skipWaiting() // Activate immediately
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Skip external resources (YouTube API, Leaflet CSS, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      // For API calls, always try network first
      if (event.request.url.includes('/api/')) {
        try {
          const networkResponse = await fetch(event.request);
          // Cache successful API responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // If API call fails and we have cached data, use it
          return cachedResponse || Response.json({ error: 'Offline' });
        }
      }
      
      // For static assets, use cache-first strategy
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then(networkResponse => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(error => {
          console.log('Background update failed:', error);
        });
        return cachedResponse;
      }
      
      // If not in cache, fetch from network
      return fetch(event.request).then(networkResponse => {
        // Cache the new response
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(error => {
        console.log('Network request failed:', error);
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { 
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim() // Control clients immediately
    ])
  );
  console.log('Service Worker activated and controlling clients.');
});