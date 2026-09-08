const CACHE_NAME = "m-criminologia-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./treino.html",
  "./admin.html",
  "./pontuacoes.html",
  "./sugestoes.html",
  "./styles.css",
  "./app.js",
  "./firebase-config.js",
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

// Ativação do Service Worker: remove caches antigos (v1, etc.) e assume o controle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nomes) => {
        return Promise.all(
          nomes
            .filter((nome) => nome !== CACHE_NAME)
            .map((nome) => caches.delete(nome)),
        );
      })
      .then(() => self.clients.claim()),
  );
});
