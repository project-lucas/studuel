'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sfx } from '@/lib/sounds'
import { ACTIVE_DUEL_KEY } from '@/lib/social'
import { createDuel } from '@/app/amis/actions'

/**
 * Le geste « défier cet ami » partagé par toutes les entrées de l'onglet Amis
 * (rangée stories, carte rival, lignes du classement) : crée le duel
 * (create_duel, 1/jour garanti côté SQL), retient son id pour que la fin de
 * partie du Défi y dépose le score, puis ouvre le Défi. Refus (duel du jour
 * déjà lancé, plus ami) → `onBlocked` au lieu d'un échec silencieux.
 */
export function useDuelLaunch(onBlocked: () => void) {
  const router = useRouter()
  const [launching, startLaunch] = useTransition()

  const launch = (friendId: string) => {
    if (launching) return
    sfx.correct()
    startLaunch(async () => {
      const res = await createDuel(friendId, 'Défi du jour')
      if (res.id) {
        try {
          sessionStorage.setItem(ACTIVE_DUEL_KEY, res.id)
        } catch {
          /* sessionStorage indispo : le score ne sera pas déposé */
        }
        router.push('/defi')
      } else {
        onBlocked()
      }
    })
  }

  return { launch, launching }
}
