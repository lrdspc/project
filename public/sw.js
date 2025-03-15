const CACHE_NAME = 'brasilit-cache-v2';
const RUNTIME_CACHE = 'runtime-cache-v2';
const STATIC_CACHE = 'static-cache-v2';

// Lista de recursos essenciais que devem ser cacheados imediatamente
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html'
];

// Lista de recursos que podem ser cacheados em segundo plano
const SECONDARY_ASSETS = [
  // Adicione aqui arquivos CSS, JS e imagens comuns
  // que não são críticos para o carregamento inicial
];

// Variáveis para monitoramento
let networkRequestCount = 0;
let cacheHitCount = 0;
let totalOfflineTime = 0;
let lastOfflineStart = null;
let isOnline = true;

// Função para limitar operações de log
const logDebug = (message) => {
  if (self.ENABLE_DEBUG_LOGS) {
    console.log(`[ServiceWorker] ${message}`);
  }
};

// Instalação do service worker - pré-cachear recursos essenciais
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a ativação imediata
  
  logDebug('Instalando...');
  
  // Estratégia: Primeiro cache os recursos essenciais (bloqueante)
  const cacheEssentialAssets = caches.open(STATIC_CACHE)
    .then((cache) => {
      logDebug('Cacheando recursos essenciais');
      return cache.addAll(CORE_ASSETS);
    });
    
  event.waitUntil(cacheEssentialAssets);
  
  // Em segundo plano, após a instalação, cache recursos secundários
  self.addEventListener('activate', () => {
    caches.open(STATIC_CACHE)
      .then((cache) => {
        logDebug('Cacheando recursos secundários');
        return cache.addAll(SECONDARY_ASSETS);
      })
      .catch(err => logDebug(`Erro ao cachear recursos secundários: ${err}`));
  });
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  logDebug('Ativando...');
  
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];

  // Limpar caches antigos
  const cleanupCaches = caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (!currentCaches.includes(cacheName)) {
          logDebug(`Removendo cache antigo: ${cacheName}`);
          return caches.delete(cacheName);
        }
      })
    );
  });

  event.waitUntil(
    Promise.all([
      cleanupCaches,
      self.clients.claim() // Toma controle de clientes abertos
    ])
  );
});

// Monitoramento de estado online/offline
self.addEventListener('online', () => {
  logDebug('Dispositivo está online');
  isOnline = true;
  
  if (lastOfflineStart) {
    const offlineDuration = Date.now() - lastOfflineStart;
    totalOfflineTime += offlineDuration;
    lastOfflineStart = null;
    
    logDebug(`Tempo offline: ${offlineDuration/1000}s, Total: ${totalOfflineTime/1000}s`);
  }
  
  // Sincronizar dados quando voltar a ficar online
  self.registration.sync.register('sync-data');
});

self.addEventListener('offline', () => {
  logDebug('Dispositivo está offline');
  isOnline = false;
  lastOfflineStart = Date.now();
});

// Estratégia de cache: Stale-While-Revalidate
// Retorna o cache imediatamente (mesmo que antigo) e depois atualiza em segundo plano
const staleWhileRevalidate = (cacheName, request) => {
  return caches.open(cacheName).then((cache) => {
    return cache.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Só armazena no cache se for uma resposta válida
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Falha silenciosa se a rede estiver indisponível
          logDebug(`Falha ao buscar ${request.url}`);
        });

      // Retorna o cache imediatamente, mesmo que antigo
      return cachedResponse || fetchPromise;
    });
  });
};

// Estratégia de cache: Cache-First
// Tenta o cache primeiro, depois a rede
const cacheFirst = (cacheName, request) => {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      cacheHitCount++;
      return cachedResponse;
    }
    
    return fetch(request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseToCache = networkResponse.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    });
  });
};

// Estratégia de cache: Network-First
// Tenta a rede primeiro, depois o cache
const networkFirst = (cacheName, request) => {
  return fetch(request)
    .then((networkResponse) => {
      networkRequestCount++;
      
      if (networkResponse && networkResponse.status === 200) {
        const responseToCache = networkResponse.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    })
    .catch(() => {
      return caches.match(request);
    });
};

// Interceptar requisições e aplicar estratégias de cache apropriadas
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorar requisições para o Chrome Extension ou outras origens
  if (url.origin !== location.origin && !url.hostname.includes('brasilit.com.br')) {
    return;
  }
  
  // Para navegação (HTML), use Network-First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      networkFirst(STATIC_CACHE, event.request)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
  // Para recursos estáticos (CSS, JS, imagens), use Cache-First
  if (
    event.request.destination === 'style' || 
    event.request.destination === 'script' ||
    event.request.destination === 'image'
  ) {
    event.respondWith(cacheFirst(STATIC_CACHE, event.request));
    return;
  }
  
  // Para API e outros recursos, use Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(RUNTIME_CACHE, event.request));
});

// Simplificando a interceptação de mensagens
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_STATS') {
    // Envia estatísticas básicas para o cliente
    event.ports[0].postMessage({
      networkRequests: networkRequestCount,
      cacheHits: cacheHitCount,
      isOnline: isOnline,
      totalOfflineTime: totalOfflineTime
    });
  } else if (event.data && event.data.type === 'ENABLE_DEBUG') {
    self.ENABLE_DEBUG_LOGS = event.data.value;
  }
});

// Sincronização em segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    logDebug('Sincronizando dados em segundo plano');
    // Implementar lógica de sincronização aqui
  }
});

// Auto-limpeza de cache periódica (a cada 7 dias)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      Promise.all([
        caches.open(RUNTIME_CACHE).then(cleanOldCache),
        caches.open(STATIC_CACHE).then(cleanOldCache)
      ])
    );
  }
});

// Função para limpar entradas antigas do cache
function cleanOldCache(cache) {
  // Remove entradas mais antigas que 7 dias
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  return cache.keys().then((requests) => {
    return Promise.all(
      requests.map((request) => {
        return cache.match(request).then((response) => {
          if (response && response.headers.get('date')) {
            const dateHeader = response.headers.get('date');
            const responseDate = new Date(dateHeader).getTime();
            
            if (responseDate < oneWeekAgo) {
              return cache.delete(request);
            }
          }
        });
      })
    );
  });
}