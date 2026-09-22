'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  desabonnerPush,
  pushConfigure,
  pushDisponible,
  souscrirePush,
} from '@/lib/push-client'

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
// la permission et enregistre l'abonnement côté serveur. Tout est côté client,
// et la mécanique vit dans `lib/push-client` — la même que l'écran
// « Notifications » de l'onboarding.
export default function NotificationsOptIn() {
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!pushDisponible()) {
        if (!cancelled) setStatus(estIOS() ? 'ios-a-installer' : 'unsupported')
        return
      }
      if (!pushConfigure()) {
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
    const resultat = await souscrirePush()
    switch (resultat) {
      case 'on':
        setStatus('on')
        return
      case 'refuse':
        setStatus(Notification.permission === 'denied' ? 'bloque' : 'off')
        // Tutoiement : c'est la règle partout dans l'app côté élève, et ce
        // composant tutoie déjà dans tous ses autres textes.
        setError('Autorisation refusée. Active les notifications dans ton navigateur.')
        return
      default:
        setStatus('off')
        setError('Impossible d’activer les rappels pour le moment.')
    }
  }

  async function disable() {
    setError(null)
    setStatus('busy')
    if (await desabonnerPush()) {
      setStatus('off')
    } else {
      setStatus('on')
      setError('Impossible de désactiver les rappels pour le moment.')
    }
  }

  // Sans clé VAPID (`unconfigured`), la section disparaît comme sur un
  // navigateur qui ne sait pas faire : un bloc « Rappels » qui n'annonce
  // qu'un « bientôt » est une promesse de plus dans les réglages, pas un réglage.
  if (
    status === 'loading' ||
    status === 'unsupported' ||
    status === 'unconfigured'
  )
    return null

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

      {status === 'ios-a-installer' ? (
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
          <BellOff className="size-4" aria-hidden="true" /> Désactiver les
          rappels
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
