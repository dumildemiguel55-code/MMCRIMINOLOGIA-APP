const CACHE_NAME = "m-criminologia-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./questions.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

// Intercepção de requisições: responde com o cache se estiver offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});

// Este script garante que o jogo funcione 100% sem internet depois de ser aberto pela primeira vez.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
// Ativação do Service Worker sem apagar caches antigos
self.addEventListener("activate", (event) => {
  // Assume o controle das páginas imediatamente
  event.waitUntil(self.clients.claim());
});