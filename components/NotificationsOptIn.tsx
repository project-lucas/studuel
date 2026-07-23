'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { urlBase64ToUint8Array } from '@/lib/notifications'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

type Status =
  | 'loading'
  | 'unsupported'
  /** iPhone/iPad hors écran d'accueil : Safari n'expose le Push qu'une fois
   *  l'app installée. C'est le cas le PLUS fréquent de notre public, et il
   *  faisait disparaître la carte sans un mot. */
  | 'ios-a-installer'
  /** Notifications bloquées au niveau du navigateur : proposer « Activer »
   *  n'ouvrirait aucune invite. */
  | 'bloque'
  | 'unconfigured'
  | 'off'
  | 'on'
  | 'busy'

// iPhone, iPad, et l'iPad qui se fait passer pour un Mac depuis iPadOS 13.
function estIOS(): boolean {
  const ua = navigator.userAgent
  return (
    /iP(hone|ad|od)/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  )
}

// Carte d'activation des rappels push : enregistre le service worker, demande
// la permission et enregistre l'abonnement côté serveur. Tout est côté client.
export default function NotificationsOptIn() {
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      const supported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
      if (!supported) {
        if (!cancelled) setStatus(estIOS() ? 'ios-a-installer' : 'unsupported')
        return
      }
      if (!VAPID_PUBLIC_KEY) {
        if (!cancelled) setStatus('unconfigured')
        return
      }
      // Permission déjà refusée : `requestPermission()` répondrait « denied »
      // sans rien afficher. Autant le dire tout de suite.
      if (Notification.permission === 'denied') {
        if (!cancelled) setStatus('bloque')
        return
      }
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        const existing = await reg.pushManager.getSubscription()
        if (!cancelled) setStatus(existing ? 'on' : 'off')
      } catch {
        if (!cancelled) setStatus('unsupported')
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  async function enable() {
    setError(null)
    setStatus('busy')
    // Gardé hors du try : en cas d'échec côté serveur, il faut pouvoir défaire
    // l'abonnement NAVIGATEUR (cf. le catch).
    let subscription: PushSubscription | null = null
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'bloque' : 'off')
        // Tutoiement : c'est la règle partout dans l'app côté élève, et ce
        // composant tutoie déjà dans tous ses autres textes.
        setError(
          'Autorisation refusée. Active les notifications dans ton navigateur.',
        )
        return
      }
      const reg = await navigator.serviceWorker.ready
      const applicationServerKey = urlBase64ToUint8Array(
        VAPID_PUBLIC_KEY,
      ) as BufferSource
      // `subscribe()` renvoie l'abonnement EXISTANT si le navigateur en a déjà
      // un pour cette origine (il est lié au navigateur, pas à l'onglet). On
      // note donc s'il préexistait : le défaire dans le `catch` couperait alors
      // les rappels d'un autre onglet — ou du même élève — qui, lui, marchait.
      const deja = await reg.pushManager.getSubscription()
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      if (deja) subscription = null // pas le nôtre : on n'y touchera pas
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })
      if (!res.ok) throw new Error('save failed')
      setStatus('on')
    } catch {
      // Panne silencieuse évitée : l'abonnement navigateur pouvait rester en
      // place alors que le serveur ne le connaissait pas. Au rechargement,
      // `getSubscription()` le retrouvait, la carte affichait « Désactiver les
      // rappels »… et l'élève n'aurait JAMAIS rien reçu. On défait donc
      // l'abonnement — mais SEULEMENT celui qu'on vient de créer (cf. plus
      // haut) : défaire un abonnement préexistant casserait ce qui marchait.
      if (subscription) {
        try {
          await subscription.unsubscribe()
        } catch {
          // désabonnement impossible : rien de plus à tenter ici
        }
      }
      setStatus('off')
      setError('Impossible d’activer les rappels pour le moment.')
    }
  }

  async function disable() {
    setError(null)
    setStatus('busy')
    try {
      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.getSubscription()
      if (subscription) {
        const res = await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        // Le pendant du garde-fou d'`enable` : sans ce test, un 401/500 passait
        // inaperçu et l'écran annonçait « désactivé » alors que le serveur
        // gardait la ligne.
        if (!res.ok) throw new Error('delete failed')
        await subscription.unsubscribe()
      }
      setStatus('off')
    } catch {
      setStatus('on')
      setError('Impossible de désactiver les rappels pour le moment.')
    }
  }

  if (status === 'loading' || status === 'unsupported') return null

  return (
    <section className="bg-card mx-auto mt-4 w-full max-w-md rounded-xl border p-4 shadow-sm">
      <h2 className="mb-1 flex items-center gap-2 font-semibold">
        <Bell className="text-primary size-4" aria-hidden="true" />
        Rappels
      </h2>
      <p className="text-muted-foreground mb-3 text-sm">
        Un rappel quand des cartes t’attendent, et un coup de pouce le soir pour
        garder ta série.
      </p>

      {status === 'unconfigured' ? (
        <p className="text-muted-foreground text-sm">
          Les rappels push arrivent très bientôt.
        </p>
      ) : status === 'ios-a-installer' ? (
        <p className="text-muted-foreground text-sm">
          Sur iPhone et iPad, les rappels ne fonctionnent qu’une fois Studuel
          ajouté à ton écran d’accueil : appuie sur <strong>Partager</strong>,
          puis <strong>Sur l’écran d’accueil</strong>. Reviens ici ensuite.
        </p>
      ) : status === 'bloque' ? (
        <p className="text-muted-foreground text-sm">
          Les notifications sont bloquées pour Studuel. Rouvre-les dans les
          réglages de ton navigateur, puis reviens sur cette page.
        </p>
      ) : status === 'on' ? (
        <Button variant="outline" onClick={disable}>
          <BellOff className="size-4" aria-hidden="true" /> Désactiver les rappels
        </Button>
      ) : (
        <Button onClick={enable} disabled={status === 'busy'}>
          <BellRing className="size-4" aria-hidden="true" />
          {status === 'busy' ? 'Activation…' : 'Activer les rappels'}
        </Button>
      )}

      {error ? (
        <p role="alert" className="text-destructive mt-2 text-sm">
          {error}
        </p>
      ) : null}
    </section>
  )
}
