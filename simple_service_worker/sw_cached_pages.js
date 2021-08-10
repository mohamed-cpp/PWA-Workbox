const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  'about.html',
  'offline.html',
  '/css/style.css',
  '/js/main.js'
];

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event


self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
   // e.respondWith(fetch(e.request).catch(() => caches.match('offline.html'))); // For offline page
});


/*
// if a page did not cashed will redi to offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request)            
                .catch(() => {
                  console.log('here')
                return caches.match('offline.html');
                });
            })
            .catch(() => {
                  console.log('here2')
                return caches.match('offline.html');
            })
    )
});
*/