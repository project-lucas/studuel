/* Service worker Studuel — notifications push (rappels de rétention).
 * Volontairement minimal : pas de cache offline ici, seulement le push.
 * Enregistré côté client par components/ServiceWorkerRegister.tsx. */

// Prend le contrôle immédiatement, sans attendre un rechargement.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Réception d'un push : affiche la notification décrite par le serveur.
self.addEventListener('push', (event) => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = {}
  }

  const title = payload.title || 'Studuel'
  const options = {
    body: payload.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: payload.kind || 'studuel',
    renotify: true,
    data: { url: payload.url || '/' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Clic sur la notification : ouvre (ou refocalise) l'app sur la bonne page.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data && event.notification.data.url) || '/'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }
        return undefined
      }),
  )
})
