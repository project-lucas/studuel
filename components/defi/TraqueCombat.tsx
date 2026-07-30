'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Gem, Sparkles } from 'lucide-react'
import BossMode from '@/components/BossMode'
import { sfx } from '@/lib/sounds'
import type { Boss, BossRank } from '@/lib/bosses'
import type { ModeQuestion } from '@/lib/defi-modes'
import { GEM_COST_CHAPTER } from '@/lib/gems'
import { attemptLabel, countdownLabel } from '@/lib/traque'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { Hourglass } from 'lucide-react'
import {
  claimTraqueVictory,
  recordTraqueDefeat,
  type TraqueDefeat,
  type TraqueVictory,
} from '@/app/defi/traque-actions'

/**
 * Le combat de LA TRAQUE. La mécanique (PV, cœurs, SRS, XP) est celle de
 * l'Arène — on ne la réécrit pas —, mais l'issue part au SERVEUR : c'est lui
 * qui détient le rang du gardien, vérifie que la fenêtre d'une heure court
 * encore et fixe les gemmes.
 *
 * Et surtout : l'écran de victoire ne propose pas « Continuer ». Il propose
 * d'OUVRIR LA FICHE du chapitre travaillé. C'est là que la boucle se referme —
 * réviser fait sortir le boss, battre le boss paie en gemmes, les gemmes
 * ouvrent de quoi mieux réviser.
 *
 * La fenêtre d'une heure, elle, SURVIT à la défaite (migration 213) : c'est
 * elle qu'on égrène ici, et c'est elle qui décide si l'écran de fin propose la
 * revanche. Un élève qui perd à 3 PV près doit pouvoir reprendre tout de suite.
 */
export default function TraqueCombat({
  boss,
  rank,
  subject,
  pool,
  chapter,
  endsAt,
  attempts,
}: {
  boss: Boss
  rank: BossRank
  subject: string
  pool: ModeQuestion[]
  /** Fin de la fenêtre de combat (ms epoch) — null si le gardien s'est recouché. */
  endsAt: number | null
  /** Combats déjà perdus sur cette sortie de tanière. */
  attempts: number
  /**
   * Le chapitre le plus récemment révisé — celui dont la fiche s'ouvrira. Son
   * lien est composé côté serveur (il lui faut le slug de la matière) : le
   * combat n'a pas à connaître la carte des routes de Réviser.
   */
  chapter: { title: string; href: string } | null
}) {
  const router = useRouter()
  const [result, setResult] = useState<TraqueVictory | null>(null)
  const [defeat, setDefeat] = useState<TraqueDefeat | null>(null)

  // Le compte à rebours rendu par le serveur se périme à la seconde suivante :
  // on repart de la borne de fin et on l'égrène ici (même pattern que l'éclair
  // de l'arène). `null` au premier rendu = pas d'écart d'hydratation.
  const now = useClock(CLOCK_STEP_MS)
  const remaining = endsAt !== null && now !== null ? Math.max(0, endsAt - now) : null
  const windowOpen = endsAt !== null && (now === null || now < endsAt)
  const essais = defeat?.attempts ?? attempts

  const onOutcome = (outcome: 'won' | 'lost') => {
    if (outcome === 'lost') {
      // La défaite ne coûte que le temps : le serveur ne fait que compter
      // l'essai et confirme que la fenêtre court toujours.
      recordTraqueDefeat(boss.id)
        .then(setDefeat)
        .catch(() => {})
      return
    }
    claimTraqueVictory(boss.id)
      .then((r) => {
        setResult(r)
        if (r.gems > 0) sfx.complete()
      })
      .catch(() => {})
  }

  // Le bandeau de récompense de l'écran de fin. Tant que le serveur n'a pas
  // répondu, on n'annonce RIEN : promettre des gemmes puis les retirer serait
  // pire que d'attendre une seconde.
  const rewardSlot = result?.won ? (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <p className="animate-in zoom-in flex items-center gap-2 rounded-full bg-highlight px-5 py-2 text-base font-extrabold text-foreground duration-500">
        <Gem className="size-5" aria-hidden="true" />
        {result.gems > 0
          ? `+${result.gems} gemmes`
          : 'Plafond de gemmes atteint cette semaine'}
      </p>

      {/* LE geste qui referme la boucle : la gemme ouvre les supports écrits
          d'un chapitre, à vie. On le propose là, à chaud, sur le chapitre que
          le combat vient d'interroger. */}
      {chapter ? (
        <Link
          href={chapter.href}
          onClick={() => sfx.tap()}
          className="olympe-press flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-center font-heading text-sm font-extrabold text-primary-foreground shadow-[0_4px_0_#2e1b54]"
        >
          <Sparkles className="size-4 shrink-0" strokeWidth={2.6} aria-hidden="true" />
          Ouvrir « {chapter.title} » — {GEM_COST_CHAPTER} 💎
        </Link>
      ) : null}
    </div>
  ) : null

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      {/* Le sablier de la traque : il reste À L'ÉCRAN pendant tout le combat.
          C'est la règle du jeu (« une heure, autant d'essais que tu veux »)
          rendue visible — sans lui, perdre ressemble à une porte qui se ferme. */}
      {result === null ? (
        <p
          className={
            'traque-sablier mx-auto flex items-center gap-2 rounded-full px-4 py-1.5 ' +
            'text-[0.72rem] font-extrabold tracking-wide'
          }
          role="status"
        >
          <Hourglass className="size-3.5 shrink-0" strokeWidth={2.8} aria-hidden="true" />
          {windowOpen
            ? `${boss.name} reste défiable ${remaining === null ? 'encore un moment' : countdownLabel(remaining)} · ${attemptLabel(essais)}`
            : `${boss.name} s’est recouché — il faudra le redébusquer en révisant.`}
        </p>
      ) : null}

      <BossMode
        variant="traque"
        boss={boss}
        rank={rank}
        pool={pool}
        onOutcome={onOutcome}
        rewardSlot={rewardSlot}
        // Perdre ne consomme plus la fenêtre : tant qu'elle court, la revanche
        // est là, tout de suite, sans repasser par l'arène.
        canRetry={windowOpen && result === null}
        onExit={() => {
          sfx.back()
          router.push('/defi')
        }}
        key={subject}
      />
    </div>
  )
}
