var cacheName = 'ProgRSS 11';
var bInstalling = false;

var filesToCache = [
  '/ProgRSS/index.html',
  '/ProgRSS/bundle.js',
  '/ProgRSS/styles/master.css',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
	  bInstalling = true;
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
  
	if (!bInstalling) {
		e.respondWith(
		  caches.match(e.request).then(function(response) {
			return response || fetch(e.request);
		  })
		);
	}
	else {
		e.respondWith(fetch(e.request));
	}
});


