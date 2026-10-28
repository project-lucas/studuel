/* Service worker Studuel — notifications push (rappels de rétention) et,
 * depuis le 12/10/2026, LE HORS-LIGNE (Lucas : « fais le nécessaire pour le
 * hors ligne » — un cours ouvert dans le bus sans réseau, c'était un écran
 * blanc).
 *
 * Enregistré au chargement par components/HorsLigne.tsx (et toujours par
 * lib/push-client au moment d'activer les rappels : même script, même portée).
 *
 * CE QU'IL MET EN CACHE, ET COMMENT :
 *   · la coquille (`hors-ligne.html`, la tête de Marcel) : précachée à
 *     l'installation — c'est l'écran servi quand une page jamais ouverte est
 *     demandée sans réseau ;
 *   · `/_next/static/*` (code et polices, noms hachés : immuables) : cache
 *     d'abord — sauf en développement, où les chunks changent sous le même nom ;
 *   · les images (`/images`, `/icons`, `/_next/image`) : cache d'abord, réseau
 *     en fond, 400 entrées au plus (les plus anciennes partent) ;
 *   · LES PAGES : réseau d'abord ; la réponse (HTML d'une navigation, charge
 *     RSC d'une navigation client) est gardée, 120 au plus, et resservie
 *     quand le réseau manque. C'est ce qui rend lisibles « les cours déjà
 *     lus ». Jamais `/api`, `/auth`, `/admin`, `/login`, ni une réponse
 *     redirigée ; les préchargements partiels du routeur ne sont pas gardés
 *     (ils ne suffiraient pas à peindre un écran). Jamais en développement
 *     non plus : les chunks n'y sont pas en cache, une page resservie
 *     arriverait en HTML nu (27/10/2026 : un onglet laissé sur un port où
 *     plus rien n'écoutait montrait le garde portrait, l'écran de lancement
 *     et l'avatar à la suite, sans style).
 *   · tout ce qui n'est pas GET, ou pas de cette origine (Supabase, Google
 *     Fonts) : pas touché.
 *
 * Le cache des pages est le journal d'un élève : la page de connexion demande
 * au worker de le VIDER (`vider-pages`) — un autre élève sur le même téléphone
 * ne doit pas y retrouver le dossier du précédent.
 *
 * Changer VERSION jette tous les caches à l'activation. */

const VERSION = 'studuel-v1'
const CACHE_COQUILLE = `${VERSION}-coquille`
const CACHE_STATIQUE = `${VERSION}-statique`
const CACHE_IMAGES = `${VERSION}-images`
const CACHE_PAGES = `${VERSION}-pages`
const PAGE_HORS_LIGNE = '/hors-ligne.html'
const PRECACHE = [PAGE_HORS_LIGNE, '/images/nav/marcel.webp']
const MAX_IMAGES = 400
const MAX_PAGES = 120
// En développement, les chunks de Next changent sous un nom fixe : un cache
// « statique d'abord » servirait du code périmé à chaque modification.
const DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1'
const CHEMINS_SANS_CACHE = ['/api/', '/auth/', '/admin', '/coach', '/messages', '/login', '/reset-password']

// Prend le contrôle immédiatement, sans attendre un rechargement.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_COQUILLE)
      .then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .catch(() => {
        // Sans coquille, le worker sert quand même les pages déjà vues.
      })
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((noms) => Promise.all(noms.filter((n) => !n.startsWith(VERSION)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type
  if (type === 'vider-pages') {
    event.waitUntil(caches.delete(CACHE_PAGES))
  }
})

/* ---------------------------------------------------------------- le cache */

// LE CACHE PEUT MANQUER — navigation privée de Firefox, stockage plein,
// profil abîmé (« Unexpected internal error » vu sur un Chromium headless le
// 12/10/2026). Un worker qui lève dans `respondWith` casse alors la navigation
// ELLE-MÊME, réseau ou pas : l'élève ne pourrait plus ouvrir l'app. Chaque
// opération de cache est donc tolérante, et toute stratégie retombe sur un
// `fetch` nu — le hors-ligne est un bonus, jamais une condition.

async function ouvrir(nomCache) {
  try {
    return await caches.open(nomCache)
  } catch {
    return null
  }
}

async function chercher(cache, request) {
  if (!cache) return undefined
  try {
    return await cache.match(request)
  } catch {
    return undefined
  }
}

// Dans N'IMPORTE QUEL cache — le dernier recours : la tête de Marcel de la
// coquille est précachée là, pas dans le cache des images.
async function chercherPartout(request) {
  try {
    return await caches.match(request)
  } catch {
    return undefined
  }
}

async function elaguer(cache, max) {
  const cles = await cache.keys()
  // `keys()` rend les entrées dans l'ordre d'insertion : les premières sont
  // les plus anciennes.
  for (let i = 0; i < cles.length - max; i += 1) await cache.delete(cles[i])
}

function garder(cache, request, reponse, max) {
  if (!cache) return
  cache
    .put(request, reponse)
    .then(() => (max ? elaguer(cache, max) : undefined))
    .catch(() => {
      // Stockage plein ou refusé : la réponse est quand même servie.
    })
}

function gardable(reponse) {
  return reponse && reponse.ok && !reponse.redirected && reponse.type === 'basic'
}

async function cacheDabord(request, nomCache) {
  const cache = await ouvrir(nomCache)
  const enCache = await chercher(cache, request)
  if (enCache) return enCache
  const reponse = await fetch(request)
  if (gardable(reponse)) garder(cache, request, reponse.clone())
  return reponse
}

async function cachePuisReseau(request, nomCache, max) {
  const cache = await ouvrir(nomCache)
  const enCache = await chercher(cache, request)
  const depuisReseau = fetch(request)
    .then((reponse) => {
      if (gardable(reponse)) garder(cache, request, reponse.clone(), max)
      return reponse
    })
    .catch(() => null)
  if (enCache) return enCache
  const reponse = await depuisReseau
  if (reponse) return reponse
  const ailleurs = await chercherPartout(request)
  if (ailleurs) return ailleurs
  throw new Error('hors connexion')
}

async function reseauDabord(request, { repli }) {
  const cache = await ouvrir(CACHE_PAGES)
  try {
    const reponse = await fetch(request)
    if (gardable(reponse)) garder(cache, request, reponse.clone(), MAX_PAGES)
    return reponse
  } catch (e) {
    const enCache = await chercher(cache, request)
    if (enCache) return enCache
    if (repli) {
      const coquille = await chercher(await ouvrir(CACHE_COQUILLE), PAGE_HORS_LIGNE)
      if (coquille) return coquille
    }
    throw e
  }
}

// La ceinture et les bretelles : si une stratégie lève pour une raison qui
// n'est pas le réseau, on refait la requête telle quelle.
function repondre(event, strategie) {
  event.respondWith(strategie().catch(() => fetch(event.request)))
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (CHEMINS_SANS_CACHE.some((p) => url.pathname.startsWith(p))) return
  if (request.headers.has('range')) return

  if (url.pathname.startsWith('/_next/static/')) {
    if (!DEV) repondre(event, () => cacheDabord(request, CACHE_STATIQUE))
    return
  }

  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/_next/image')
  ) {
    repondre(event, () => cachePuisReseau(request, CACHE_IMAGES, MAX_IMAGES))
    return
  }

  // En développement, les chunks ne sont pas en cache (ci-dessus) : une page
  // resservie du cache arriverait sans style ni script. On laisse la
  // navigation échouer franchement — le navigateur dit « connexion refusée »
  // plutôt que de peindre du HTML nu.
  if (DEV) return

  // Une navigation (l'adresse tapée, un rechargement, un lien hors routeur).
  if (request.mode === 'navigate') {
    repondre(event, () => reseauDabord(request, { repli: true }))
    return
  }

  // Une navigation CLIENT du routeur de Next : la charge RSC de la page. Les
  // préchargements (`Next-Router-Prefetch`) sont partiels : on les laisse
  // passer sans les garder.
  if (request.headers.get('RSC') === '1' && !request.headers.has('Next-Router-Prefetch')) {
    repondre(event, () => reseauDabord(request, { repli: false }))
  }
})

/* ----------------------------------------------------------------- le push */

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
