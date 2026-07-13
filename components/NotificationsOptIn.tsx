'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { urlBase64ToUint8Array } from '@/lib/notifications'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

type Status = 'loading' | 'unsupported' | 'unconfigured' | 'off' | 'on' | 'busy'

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
        if (!cancelled) setStatus('unsupported')
        return
      }
      if (!VAPID_PUBLIC_KEY) {
        if (!cancelled) setStatus('unconfigured')
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
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('off')
        setError('Autorisation refusée. Activez les notifications dans le navigateur.')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const applicationServerKey = urlBase64ToUint8Array(
        VAPID_PUBLIC_KEY,
      ) as BufferSource
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })
      if (!res.ok) throw new Error('save failed')
      setStatus('on')
    } catch {
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
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
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
