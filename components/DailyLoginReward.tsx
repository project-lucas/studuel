'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import DialogCloseButton from '@/components/DialogCloseButton'
import { sfx } from '@/lib/sounds'
import { claimLoginReward } from '@/app/tresor/actions'

// Garde locale : évite de rappeler le serveur à chaque rechargement de page.
// La vraie unicité (un crédit par jour, multi-appareils) est garantie en SQL.
const STORAGE_KEY = 'scolaria-login-reward'

const todayKey = () => new Date().toISOString().slice(0, 10)

// Cadeau de connexion : au premier passage de la journée, des pièces tombent
// toutes seules — la popup célèbre, elle ne conditionne pas le crédit.
export default function DailyLoginReward() {
  const [reward, setReward] = useState<{ coins: number; streak: number } | null>(
    null,
  )
  const dismissRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const key = todayKey()
    if (window.localStorage.getItem(STORAGE_KEY) === key) return
    let cancelled = false
    claimLoginReward()
      .then((r) => {
        // claimed=false : déjà réclamé (autre appareil) ou indisponible —
        // dans les deux cas on marque le jour pour ne pas réessayer en boucle.
        window.localStorage.setItem(STORAGE_KEY, key)
        if (!cancelled && r.claimed) setReward({ coins: r.coins, streak: r.streak })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Modale : focus sur « Récupérer » à l'ouverture + fermeture au clavier
  // (Échap) — cohérent avec PalierCelebration / ChestOpenModal.
  useEffect(() => {
    if (!reward) return
    dismissRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sfx.coin()
        setReward(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reward])

  if (!reward) return null

  const collect = () => {
    sfx.coin()
    setReward(null)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Récompense de connexion"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={collect}
    >
      <div
        className="pop-in relative w-full max-w-xs rounded-3xl bg-card p-6 text-center shadow-xl ring-1 ring-foreground/10"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClose={collect} />
        <p className="font-heading text-xs font-bold tracking-wide text-muted-foreground uppercase">
          Cadeau de connexion
        </p>
        <span className="float-slow my-3 block text-6xl" aria-hidden="true">
          🪙
        </span>
        <p className="font-heading text-3xl font-extrabold tabular-nums">
          +{reward.coins} pièces
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {reward.streak > 1 ? (
            <>
              <span className="font-semibold text-foreground">
                Jour {reward.streak} d&apos;affilée
              </span>{' '}
              — chaque jour de suite rapporte plus. 🔥
            </>
          ) : (
            <>Reviens demain : la récompense grossit chaque jour de suite. 🔥</>
          )}
        </p>
        <Button
          ref={dismissRef}
          onClick={collect}
          className="mt-5 w-full rounded-full"
        >
          Récupérer
        </Button>
      </div>
    </div>
  )
}
