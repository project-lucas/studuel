'use client'

import { useEffect, useState } from 'react'
import { leaguePalier, type Palier } from '@/lib/palier'
import PalierCelebration from '@/components/PalierCelebration'

// Dernier palier de ligue VU par l'élève sur cet appareil. La promotion est
// appliquée par le cron du lundi : on la détecte donc à la visite suivante,
// en comparant le palier courant à celui mémorisé.
const SEEN_KEY = 'studuel-ligue-tier-vu'

/**
 * Vigie de promotion de ligue (montée sur /defi quand la ligue est réelle) :
 * si le palier a monté depuis la dernière visite, la bulle de célébration
 * éclate. Première visite : on mémorise sans fêter. La relégation passe en
 * silence (le classement parle de lui-même).
 */
export default function LeaguePromotionWatch({ tier }: { tier: number }) {
  const [palier, setPalier] = useState<Palier | null>(null)

  useEffect(() => {
    // setState dans le callback du timer (jamais synchrone dans l'effet),
    // même motif que SubjectMasteryCelebration.
    const timer = setTimeout(() => {
      const raw = window.localStorage.getItem(SEEN_KEY)
      const parsed = raw === null ? Number.NaN : Number(raw)
      const previous = Number.isFinite(parsed) ? parsed : null
      window.localStorage.setItem(SEEN_KEY, String(tier))
      const found = leaguePalier(previous, tier)
      if (found) setPalier(found)
    }, 0)
    return () => clearTimeout(timer)
  }, [tier])

  if (!palier) return null
  // once=false : une re-promotion vers un palier déjà fêté (après relégation)
  // mérite sa fête — la vigie garantit déjà l'absence de re-tir au re-rendu.
  return <PalierCelebration palier={palier} once={false} />
}
