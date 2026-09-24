'use client'

import { Swords, Zap } from 'lucide-react'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import { DUEL_XP_BONUS } from '@/lib/social'
import { useDuelLaunch } from '@/components/amis/useDuelLaunch'

/**
 * Le rival direct — LA action du jour de l'onglet : l'ami juste devant moi au
 * classement de la SEMAINE (« Rayan a 40 XP d'avance »), et un bouton
 * « Défier » qui lance le duel réel (create_duel, 1/jour, +XP). L'onglet
 * compte en XP depuis la ligue de la semaine (24/09/2026) : les trophées
 * restent au duel classé.
 */
export default function RivalCard({
  rival,
  ecartXp,
  onDuelBlocked,
}: {
  rival: { id: string; nom: string; portrait: string }
  ecartXp: number
  onDuelBlocked: () => void
}) {
  const { launch, launching } = useDuelLaunch(onDuelBlocked)
  // À égalité, l'ami passe devant (il faut le DÉPASSER) : on le dit, sans
  // inventer « 1 XP d'avance ».
  const egalite = ecartXp <= 0
  const ecart = Math.max(0, ecartXp)

  return (
    <section
      aria-label="Ton rival de la semaine"
      className="flex items-center gap-3 rounded-carte bg-highlight/20 p-3.5 ring-1 ring-highlight/40"
    >
      <PortraitJoueur id={rival.id} portrait={rival.portrait} className="size-11 ring-2 ring-highlight/60" />
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-[0.95rem] leading-tight font-extrabold text-balance text-foreground">
          {egalite ? `À égalité avec ${rival.nom}` : `${rival.nom} a ${ecart} XP d’avance`}
        </span>
        <span className="block text-xs font-semibold text-muted-foreground">
          {egalite || ecart <= DUEL_XP_BONUS
            ? 'Gagne ton duel du jour pour le doubler'
            : 'Ton duel du jour te rapproche'}
        </span>
      </span>
      <button
        type="button"
        disabled={launching}
        onClick={() => launch(rival.id)}
        aria-label={`Défier ${rival.nom} (+${DUEL_XP_BONUS} XP)`}
        className="font-heading flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
      >
        <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
        Défier
        <span className="flex items-center font-mono text-[11px] font-bold text-highlight tabular-nums">
          <Zap className="size-3" aria-hidden="true" />+{DUEL_XP_BONUS}
        </span>
      </button>
    </section>
  )
}
