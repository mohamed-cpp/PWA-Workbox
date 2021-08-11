const workbox = require("workbox-build")

workbox.generateSW({
  cacheId: "pwa_test",
  globDirectory: "./",
  globPatterns: [
    "**/*.{css,js}"
  ],
  globIgnores:[
    "**/generator.js",
    "**/sw.js",
    "**/workboxEx.js",
    "**/sw_copy.js",
    "node_modules/**/*",
  ],
  swDest: "./sw.js",
  runtimeCaching: [
    {
      urlPattern: /\.(?:html|htm)$/,
      handler: "StaleWhileRevalidate",
      options:{
        cacheName: "cache1",
        expiration: {
          maxAgeSeconds: 1800
        }
      }
    }
  ]
})