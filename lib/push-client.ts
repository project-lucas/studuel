// L'abonnement aux rappels push, côté NAVIGATEUR — partagé par l'écran
// « Notifications » de l'onboarding et la carte « Rappels » du compte.
//
// POURQUOI CE MODULE. L'onboarding demandait la permission de l'OS
// (`Notification.requestPermission()`) et s'arrêtait là : aucun service
// worker enregistré, aucun abonnement envoyé au serveur. L'élève répondait
// « Activer les rappels », l'app notait `notify_opt_in = true`… et ne pouvait
// rien lui envoyer. Le vrai chemin — worker, `pushManager.subscribe`, POST
// `/api/push/subscribe`, défaire l'abonnement si le serveur refuse — vivait
// dans `NotificationsOptIn`, et lui seul. Il est ici, une seule fois.
//
// Client uniquement (Service Worker, PushManager). Aucun import Supabase :
// l'abonnement part par la route API, qui connaît la session.

import { urlBase64ToUint8Array } from '@/lib/notifications'

export type PushResultat =
  /** Abonné, et le serveur l'a enregistré. */
  | 'on'
  /** Le navigateur ne sait pas faire (ou l'app n'est pas installée sur iOS). */
  | 'indisponible'
  /** Pas de clé VAPID publique : l'infra n'est pas configurée. */
  | 'non_configure'
  /** L'élève a refusé l'invite de l'OS (ou l'avait déjà bloquée). */
  | 'refuse'
  /** Permission accordée mais l'abonnement n'a pas pu être enregistré. */
  | 'erreur'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

export function pushDisponible(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function pushConfigure(): boolean {
  return VAPID_PUBLIC_KEY.length > 0
}

/**
 * Demande la permission, abonne le navigateur et enregistre l'abonnement
 * côté serveur. Ne lève jamais : le résultat dit ce qui s'est passé.
 */
export async function souscrirePush(): Promise<PushResultat> {
  if (!pushDisponible()) return 'indisponible'
  if (!pushConfigure()) return 'non_configure'
  if (Notification.permission === 'denied') return 'refuse'

  // Gardé hors du try : en cas d'échec côté serveur, il faut pouvoir défaire
  // l'abonnement NAVIGATEUR (cf. le catch).
  let subscription: PushSubscription | null = null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return 'refuse'

    const reg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource
    // `subscribe()` renvoie l'abonnement EXISTANT si le navigateur en a déjà
    // un pour cette origine. On note donc s'il préexistait : le défaire dans
    // le `catch` couperait alors les rappels d'un autre onglet — ou du même
    // élève — qui, lui, marchait.
    const deja = await reg.pushManager.getSubscription()
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
    const aEnvoyer = subscription
    if (deja) subscription = null // pas le nôtre : on n'y touchera pas

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aEnvoyer),
    })
    if (!res.ok) throw new Error('save failed')
    return 'on'
  } catch {
    // Panne silencieuse évitée : l'abonnement navigateur pouvait rester en
    // place alors que le serveur ne le connaissait pas — l'élève n'aurait
    // JAMAIS rien reçu. On défait donc l'abonnement, mais SEULEMENT celui
    // qu'on vient de créer.
    if (subscription) {
      try {
        await subscription.unsubscribe()
      } catch {
        // désabonnement impossible : rien de plus à tenter ici
      }
    }
    return 'erreur'
  }
}

/** Retire l'abonnement du serveur puis du navigateur. */
export async function desabonnerPush(): Promise<boolean> {
  if (!pushDisponible()) return false
  try {
    const reg = await navigator.serviceWorker.ready
    const subscription = await reg.pushManager.getSubscription()
    if (subscription) {
      const res = await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      })
      // Sans ce test, un 401/500 passait inaperçu et l'écran annonçait
      // « désactivé » alors que le serveur gardait la ligne.
      if (!res.ok) throw new Error('delete failed')
      await subscription.unsubscribe()
    }
    return true
  } catch {
    return false
  }
}
