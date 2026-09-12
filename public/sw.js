// Service Worker EPM LMS Salvatagem (M13)
const CACHE_NAME = 'epm-salvatagem-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/Guia_Técnico_de_Sobrevivência_Pessoal.webp',
  '/assets/Guia_de_Sobrevivência_Marítima.webp',
  '/assets/Guia_de_Sobrevivência_e_Emergência.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[EPM SW] Pré-armazenando ativos táticos em cache...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[EPM SW] Falha ao pré-armazenar alguns ativos:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[EPM SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Apenas métodos GET para recursos locais estáticos
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Não faz cache de chamadas Firebase RTDB ou Supabase Realtime
  if (url.hostname.includes('firebaseio.com') || url.hostname.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Se a resposta for válida, armazena em cache para offline
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Se estiver offline e o recurso não estiver no cache
        return caches.match('/');
      });
    })
  );
});
