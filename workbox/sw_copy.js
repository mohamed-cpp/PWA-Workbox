importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded`);
} else {
  console.log(`Workbox didn't load`);
}


workbox.routing.registerRoute(
  /\.(?:css|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    "cacheName": "assets",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      })
    ]
  })
)

workbox.routing.registerRoute(
  /\.(?:jpg|png)$/,
  new workbox.strategies.CacheFirst({
    "cacheName": "images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      })
    ]
  })
)
