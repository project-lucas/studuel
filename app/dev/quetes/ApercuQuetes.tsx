'use client'

import { useEffect, useState } from 'react'
import FeuilleQuetes from '@/components/quetes/FeuilleQuetes'
import PastilleQuetes from '@/components/quetes/PastilleQuetes'
import { poserEncaisseurDemo, semerQuetes } from '@/components/quetes/store'
import XpIcon from '@/components/ui/XpIcon'
import { ecouterGains } from '@/lib/hud-gains'
import { ALL_DONE_XP, BONUS_STEP_ID, QUEST_CATALOG, queteServie, questView, type QuetesDuJour } from '@/lib/quests'

const IDS = ['connexion1', 'lecon1', 'reponses10', 'partie1'] as const

/** Les trois états de démonstration : mixte (la connexion et un cours faits), tout fini, tout encaissé. */
function exemple(e: string): QuetesDuJour {
  const avancement: Record<string, number> =
    e === 'toutes' || e === 'payees'
      ? { connexion1: 1, lecon1: 1, reponses10: 10, partie1: 1 }
      : { connexion1: 1, lecon1: 1, reponses10: 4, partie1: 0 }
  const quetes = IDS.map((id) => queteServie(questView(QUEST_CATALOG.find((d) => d.id === id)!, avancement)))
  return {
    jour: '2026-10-03',
    quetes,
    encaissees: e === 'payees' ? [...IDS, BONUS_STEP_ID] : [],
  }
}

/** L'encaissement sans compte : la réponse du serveur, après un temps de réponse simulé. */
async function encaisserDemo(cible: string) {
  await new Promise((r) => setTimeout(r, 380))
  const xp = cible === BONUS_STEP_ID ? ALL_DONE_XP : (QUEST_CATALOG.find((d) => d.id === cible)?.xp ?? 0)
  return { claimed: true, gems: 0, xp, allDone: cible === BONUS_STEP_ID }
}

export default function ApercuQuetes({ e, feuille }: { e: string; feuille: boolean }) {
  useEffect(() => {
    semerQuetes(exemple(e), feuille)
    poserEncaisseurDemo(encaisserDemo)
    return () => {
      semerQuetes(null)
      poserEncaisseurDemo(null)
    }
  }, [e, feuille])

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pt-20">
      <BarreDemo />
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-muted-foreground">Pastille du bandeau :</span>
        <PastilleQuetes />
      </div>
      <FeuilleQuetes />
    </div>
  )
}

/**
 * Une barre de niveau de démonstration, à la place du vrai bandeau (absent
 * sans compte) : c'est la CIBLE des éclairs (`data-hud-cible="xp"`), et elle
 * avance jeton après jeton comme la vraie.
 */
function BarreDemo() {
  const [xp, setXp] = useState(120)
  useEffect(
    () =>
      ecouterGains((g) => {
        if (g.unite === 'xp') setXp((v) => v + g.montant)
      }),
    [],
  )
  const part = (xp % 400) / 400
  return (
    <div className="hud-gelule fixed inset-x-3 top-2 z-50 flex items-center gap-2 rounded-full bg-secondary px-3 py-2 [html.hud-volee_&]:z-[80]">
      <span className="font-heading text-sm font-extrabold">Niveau {Math.floor(xp / 400) + 7}</span>
      <XpIcon className="size-4" />
      <span data-hud-cible="xp" className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-card">
        <span
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary transition-transform duration-200"
          style={{ transform: `scaleX(${part})` }}
        />
      </span>
      <span className="font-heading text-xs font-extrabold tabular-nums">{xp} XP</span>
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
