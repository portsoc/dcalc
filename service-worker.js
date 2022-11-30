const CACHE = 'dcalc_v1';
const cacheable = [
  './',
  './manifest.json',
  './index.html',
  './js/rules.js',
  './js/ui.js',
  './js/validity.js',
  './js/service-worker.js',
  './js/service-worker-loader.js',
  './style.css',
  './modules.txt',
  './img/192.png',
  './img/512.png',
];

/* Invoke the default fetch capability to
 * pull a resource over the network and use
 * that to update the cache.
 */
async function updateCache(request) {
  const c = await caches.open(CACHE);
  const response = await fetch(request);
  return c.put(request, response);
}

/* Retrieve a requested resource from the cache
 * or return a resolved promise if its not there.
 */
async function handleFetch(request) {
  const c = await caches.open(CACHE);
  const cachedCopy = await c.match(request);
  return cachedCopy || Promise.reject(new Error('no-match'));
}

/* All GET requests are first served from
 * the cache, before an attempt is made to
 * update the cache.
 */
function interceptFetch(evt) {
  evt.respondWith(handleFetch(evt.request));
  evt.waitUntil(updateCache(evt.request));
}

/* Installing the service worker involves
 * preparing an populating the cache, here.
 */
async function prepareCache() {
  console.log('Cache: preparing');
  const c = await caches.open(CACHE);
  await c.addAll(cacheable);
  console.log('Cache: prepared');
}

// install the event listsner so it can run in the background.
self.addEventListener('install', prepareCache);
self.addEventListener('fetch', interceptFetch);
