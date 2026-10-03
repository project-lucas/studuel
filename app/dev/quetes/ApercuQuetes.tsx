'use client'

import { useEffect } from 'react'
import FeuilleQuetes from '@/components/quetes/FeuilleQuetes'
import PastilleQuetes from '@/components/quetes/PastilleQuetes'
import { semerQuetes } from '@/components/quetes/store'
import { BONUS_STEP_ID, QUEST_CATALOG, queteServie, questView, type QuetesDuJour } from '@/lib/quests'

const IDS = ['lecon1', 'quiz80', 'partie2'] as const

/** Les trois états de démonstration : mixte, tout fini, tout encaissé. */
function exemple(e: string): QuetesDuJour {
  const avancement: Record<string, number> =
    e === 'toutes' || e === 'payees' ? { lecon1: 1, quiz80: 1, partie2: 2 } : { lecon1: 1, quiz80: 0, partie2: 1 }
  const quetes = IDS.map((id) => queteServie(questView(QUEST_CATALOG.find((d) => d.id === id)!, avancement)))
  return {
    jour: '2026-10-03',
    quetes,
    encaissees: e === 'payees' ? [...IDS, BONUS_STEP_ID] : [],
  }
}

export default function ApercuQuetes({ e, feuille }: { e: string; feuille: boolean }) {
  useEffect(() => {
    semerQuetes(exemple(e), feuille)
    return () => semerQuetes(null)
  }, [e, feuille])

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pt-20">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-muted-foreground">Pastille du bandeau :</span>
        <PastilleQuetes />
      </div>
      <FeuilleQuetes />
    </div>
  )
}

/** Sème les quêtes d'exemple sans rien rendre (aperçu du bandeau, /dev/bandeau). */
export function SemeurQuetes({ e = 'mixte' }: { e?: string }) {
  useEffect(() => {
    semerQuetes(exemple(e))
    return () => semerQuetes(null)
  }, [e])
  return null
}
