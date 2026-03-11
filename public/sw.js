const CACHE_NAME = "macho-v1";
const STATIC_ASSETS = [
  "/",
  "/feed",
  "/map",
  "/submit",
  "/profile",
  "/dashboard",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests (POST uploads handled by offline queue)
  if (request.method !== "GET") return;

  // Network first for API calls, cache first for static
  if (request.url.includes("/rest/v1/") || request.url.includes("/auth/")) {
    // Network first for Supabase API
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
