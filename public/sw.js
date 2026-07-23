/* Service worker Studuel — notifications push (rappels de rétention).
 * Volontairement minimal : pas de cache offline ici, seulement le push.
 * Enregistré côté client par components/NotificationsOptIn.tsx. */

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
    payload = (event.data && event.data.json()) || {}
  } catch {
    // Corps absent ou non-JSON : on récupère au moins le texte brut plutôt que
    // d'afficher une notification vide.
    payload = { body: event.data ? event.data.text() : '' }
  }
  // `JSON.parse('null')` réussit : sans ce garde-fou, `payload.title` lèverait
  // hors du try, showNotification ne serait jamais appelé, et le navigateur
  // (abonnement `userVisibleOnly`) afficherait à la place son propre
  // « Ce site a été mis à jour en arrière-plan ».
  if (!payload || typeof payload !== 'object') payload = {}

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
  const targetUrl =
    (event.notification.data && event.notification.data.url) || '/'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(async (clientList) => {
        // On préfère un onglet DÉJÀ sur la cible : sinon un élève en pleine
        // session de quiz se fait arracher de sa partie par le rappel.
        const target = new URL(targetUrl, self.location.origin).href
        const already = clientList.find((c) => c.url === target)
        if (already) return already.focus()

        for (const client of clientList) {
          if (!('focus' in client)) continue
          try {
            // Focus D'ABORD, navigation ensuite, et on attend la promesse :
            // `navigate()` rejette sur un client non contrôlé par ce service
            // worker (`includeUncontrolled`), et le rejet non rattrapé faisait
            // perdre la navigation en silence.
            const focused = await client.focus()
            await focused.navigate(target)
            return focused
          } catch {
            // Ce client refuse la navigation : on ouvre une fenêtre à la place.
            break
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(target)
        return undefined
      }),
  )
})

// Le navigateur a fait tourner l'abonnement (expiration, longue inactivité,
// mise à jour). Sans ce gestionnaire, l'ancien endpoint répond 410, le serveur
// le purge, et l'élève ne reçoit plus JAMAIS rien — pendant que l'écran
// continue d'afficher « rappels activés ». C'est le mode de panne classique du
// push, et il est totalement silencieux.
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Certains navigateurs se sont déjà réabonnés quand l'événement part.
        let subscription = await self.registration.pushManager.getSubscription()
        if (!subscription) {
          const key =
            event.oldSubscription &&
            event.oldSubscription.options &&
            event.oldSubscription.options.applicationServerKey
          if (!key) return // sans clé serveur, impossible de se réabonner
          subscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key,
          })
        }
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })
      } catch {
        // Rien à faire de plus ici : la session peut avoir expiré. L'élève
        // réactivera depuis /compte, et l'ancien endpoint sera purgé sur 410.
      }
    })(),
  )
})
