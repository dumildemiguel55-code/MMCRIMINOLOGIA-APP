// IMPORTANTE: muda este número sempre que publicares uma atualização
// (novo CSS, novo HTML, etc.). É o que obriga o service worker a
// instalar-se de novo e a limpar a cache antiga.
const CACHE_NAME = "m-criminologia-v5";
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

// Ficheiros que devem SEMPRE tentar ir à rede primeiro (código que muda com frequência).
// Só cai para a cache se não houver internet.
const NETWORK_FIRST = [".html", ".css", ".js"];

function isNetworkFirst(url) {
  return NETWORK_FIRST.some((ext) => url.pathname.endsWith(ext)) || url.pathname === "/" || url.pathname.endsWith("/");
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ignorar pedidos de outros domínios (ex: Firebase, fontes externas)
  if (url.origin !== self.location.origin) return;

  if (isNetworkFirst(url)) {
    // REDE PRIMEIRO: tenta buscar a versão mais recente; se falhar (offline), usa a cache.
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // CACHE PRIMEIRO: para imagens/ícones, que raramente mudam (mais rápido e poupa dados).
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

// Este script garante que o app funcione offline depois de ser aberto pela primeira vez,
// mas prioriza sempre a versão mais recente quando há internet (ver isNetworkFirst acima).
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
  self.skipWaiting();
});

// Ativação do Service Worker: remove caches antigos (v1, v2, v3...) e assume o controle
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
