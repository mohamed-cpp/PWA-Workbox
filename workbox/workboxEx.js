importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
if (workbox) {
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({
  prefix: 'thn-sw',
  suffix: 'v22',
  precache: 'install-time',
  runtime: 'run-time'
});

const FALLBACK_HTML_URL = '/offline.html';
const version = workbox.core.cacheNames.suffix;
workbox.precaching.precacheAndRoute([{url: FALLBACK_HTML_URL, revision: null},{url: '/manifest.json', revision: null},{url: '/favicon.ico', revision: null},{url: '/css/roboto.css', revision: null}]);

workbox.routing.setDefaultHandler(new workbox.strategies.NetworkOnly());

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-live-' + version,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 365 * 24 * 60 * 60,
                maxEntries:30,
                purgeOnQuotaError: true
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200],
            })
        ],
    }),'GET'
);

workbox.routing.registerRoute(
    new RegExp('https://site.com/fonts/(.*)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-hosted-' + version,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 365 * 24 * 60 * 60,
                maxEntries:30,
                purgeOnQuotaError: true
            })
        ],
    }),'GET'
);

workbox.routing.registerRoute(
    new RegExp('https://(?:ajax.cloudflare|www.google-analytics|cdnjs.cloudflare|cdn.doubleverify|pagead2.googlesyndication|cdn3.doubleverify).com/(.*)'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'third-party-files-' + version,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxEntries:200,
                purgeOnQuotaError: true
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200],
            })
        ],
    }),'GET'
);

workbox.routing.registerRoute(
    new RegExp('.(?:css|png|gif|jpg|svg|woff|woff2|ico)$'),
    new workbox.strategies.CacheFirst({
        cacheName: 'images-js-css-' + version,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 24 * 60 * 60,
                maxEntries:200,
                purgeOnQuotaError: true
            })
        ],
    }),'GET'
);

workbox.routing.setCatchHandler(({event}) => {
      switch (event.request.destination) {
        case 'document':
        return caches.match(FALLBACK_HTML_URL);
      break;
      default:
        return Response.error();
  }
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => !key.endsWith(version)))
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
});

}
else {
    console.log('Boo! Workbox didnt load ');
}