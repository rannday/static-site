/// <reference lib="webworker" />

const CACHE_NAME = 'worker-cache-v1';
const CACHE_TIMEOUT_SECONDS = 30 * 24 * 60 * 60; // 30 days
const MAX_CACHE_ITEMS = 50;
const UNSUPPORTED_SCHEMES = [
  'chrome-extension:',
  'moz-extension:',
  'ms-browser-extension:',
  'about:',
  'data:',
];

const PRECACHE_ASSETS = [
  '/css/highlight.css',
  '/js/highlight.js',
];

/**
 * Validates whether a request is safe and cacheable.
 * @param {Request} request
 * @param {Response} response
 * @returns {boolean}
 */
function isCacheableRequest(request, response) {
  const url = new URL(request.url);

  if (UNSUPPORTED_SCHEMES.includes(url.protocol)) return false;
  if (!response || response.status !== 200 || response.type !== 'basic') {
    console.warn(`[SW] Not cacheable: ${request.url} (status: ${response?.status}, type: ${response?.type})`);
    return false;
  }

  return true;
}

/**
 * Checks if a cached response is expired.
 * @param {Response} cachedResponse
 * @returns {boolean}
 */
function isCacheExpired(cachedResponse) {
  if (!cachedResponse) return true;

  const timestamp = cachedResponse.headers.get('x-timestamp');
  if (!timestamp) return true;

  const ageInSeconds = (Date.now() - parseInt(timestamp, 10)) / 1000;
  return ageInSeconds > CACHE_TIMEOUT_SECONDS;
}

/**
 * Updates the cache with a fresh response and metadata.
 * @param {Cache} cache
 * @param {Request} request
 * @param {Response} response
 */
async function updateCache(cache, request, response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('x-timestamp', Date.now().toString());

  const responseWithMetadata = new Response(response.body, {
    headers: newHeaders,
  });

  await cache.put(request, responseWithMetadata);
  await limitCacheSize(cache, MAX_CACHE_ITEMS);
}

/**
 * Limits the cache to a maximum number of entries.
 * @param {Cache} cache
 * @param {number} maxItems
 */
async function limitCacheSize(cache, maxItems) {
  const keys = await cache.keys();

  while (keys.length > maxItems) {
    const removed = keys.shift();
    const deleted = await cache.delete(removed);
    if (deleted) {
      console.log(`[SW] Removed from cache: ${removed.url}`);
    }
  }
}

/**
 * Install the service worker and pre-cache highlight assets.
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

/**
 * Activate the service worker and clean up old caches.
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cache) => {
          if (!cache.startsWith(CACHE_NAME)) {
            console.log(`[SW] Clearing old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    })().then(() => self.clients.claim())
  );
});

/**
 * Intercept fetch requests and serve from cache.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    console.warn(`[SW] Ignoring non-GET request: ${event.request.url}`);
    return;
  }

  event.respondWith(handleAssetFetch(event));
});

/**
 * Handles asset fetch requests.
 * @param {FetchEvent} event
 * @returns {Promise<Response>}
 */
async function handleAssetFetch(event) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const url = new URL(event.request.url);
    const normalizedUrl = url.origin + url.pathname;

    let requestToMatch;
    if (event.request.mode === 'navigate') {
      // Navigation requests (like `/`) can’t be re-constructed like this
      requestToMatch = event.request;
    } else {
      // Normalize for other asset types (remove query string)
      const normalizedUrl = new URL(event.request.url);
      normalizedUrl.search = '';

      requestToMatch = new Request(normalizedUrl.href, {
        method: event.request.method,
        headers: event.request.headers,
        mode: event.request.mode,
        credentials: event.request.credentials,
        redirect: event.request.redirect,
      });
    }

    const cachedResponse = await cache.match(requestToMatch);

    if (cachedResponse && !isCacheExpired(cachedResponse)) {
      console.log(`[SW] Serving from cache: ${event.request.url}`);
      return cachedResponse;
    }

    const response = await fetch(event.request);

    if (response.status === 404) {
      console.error(`[SW] Resource not found: ${event.request.url}`);
      return new Response('Resource not found.', { status: 404 });
    }

    if (isCacheableRequest(event.request, response)) {
      console.log(`[SW] Caching response: ${event.request.url}`);
      await updateCache(cache, event.request, response.clone());
    }

    return response;
  } catch (err) {
    console.error(`[SW] Fetch failed for ${event.request.url}:`, err);
    return new Response('Network error occurred.', { status: 503 });
  }
}
