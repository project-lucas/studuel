'use client'

import { RotateCcw, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { XP_RULES } from '@/lib/xp'
import type { GameFormat } from '@/lib/jeux/formats'
import { runAchieved, runTarget, type GameRun } from '@/lib/jeux/run'

/**
 * L'écran de fin d'un jeu de salon. Il raconte la partie DANS LA LANGUE DU JEU
 * (« Tour du monde bouclé ! », « La machine a calé ») plutôt qu'avec un « Bravo »
 * interchangeable — c'est la dernière chose que l'élève voit, et donc ce qui
 * décide s'il relance.
 *
 * Une défaite ne se moque jamais : elle affiche ce qui a été fait, pas ce qui a
 * manqué, et le bouton « Rejouer » est le plus gros de l'écran.
 */
export default function GameOutcome({
  format,
  run,
  best,
  isRecord,
  saved,
  awardedXp,
  onReplay,
  onExit,
}: {
  format: GameFormat
  run: GameRun
  /** Meilleur score local sur ce jeu (0 s'il n'y en a pas encore). */
  best: number
  isRecord: boolean
  /** Partie enregistrée côté serveur : null tant que la réponse n'est pas là. */
  saved: boolean | null
  /** XP réellement versée, telle que renvoyée par le serveur (null en attente). */
  awardedXp: number | null
  onReplay: () => void
  onExit: () => void
}) {
  const won = run.status === 'won'
  // Le serveur fait foi dès qu'il a répondu : lui seul connaît le bonus de
  // trajet et l'écrêtage. L'estimation locale ne sert qu'à ne pas laisser un
  // trou à l'écran pendant l'aller-retour.
  const xp =
    awardedXp ??
    run.correct * XP_RULES.challengePerCorrect + XP_RULES.challengeBonus
  const target = runTarget(format)
  // `runAchieved` et non `runProgress` : la case porte un libellé de RÉUSSITE
  // (« drapeau planté », « organe localisé »), pas d'avancement.
  const achieved = runAchieved(format, run)

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 pt-6 text-center">
      <div
        className={cn(
          'grid size-24 place-items-center rounded-3xl text-5xl',
          won
            ? 'bg-[color:var(--jeu-accent)] shadow-lg'
            : 'bg-black/6 grayscale',
        )}
      >
        <span className="animate-in zoom-in duration-500" aria-hidden="true">
          {won ? format.emoji : '💤'}
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-extrabold text-balance">
          {won ? format.lexicon.win : format.lexicon.lose}
        </h2>
        {isRecord ? (
          <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-highlight">
            <Trophy className="size-4" aria-hidden="true" /> Nouveau record
            personnel !
          </p>
        ) : null}
      </div>

      <p className="font-mono text-5xl font-extrabold tabular-nums">
        {run.score}
      </p>

      {/* Le détail de la partie, dans le vocabulaire du jeu. */}
      <dl className="grid w-full grid-cols-3 gap-2 text-xs">
        <Stat
          label={format.lexicon.hit}
          value={target !== null ? `${achieved}/${target}` : String(run.correct)}
        />
        <Stat label="meilleure série" value={`×${run.bestStreak}`} />
        {/* `best` a déjà été remonté au nouveau score par la table de jeu. */}
        <Stat label="record" value={String(best)} />
      </dl>

      <div className="animate-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-mono text-2xl font-bold text-foreground shadow-lg duration-500 tabular-nums">
        <Zap className="size-6" aria-hidden="true" /> +{xp} XP
      </div>

      <p className="min-h-5 text-sm text-muted-foreground">
        {saved === true
          ? '✓ Journée validée — ta série continue 🔥'
          : saved === false
            ? 'Partie non enregistrée (connecte-toi pour garder ton XP).'
            : ''}
      </p>

      <div className="flex w-full flex-col gap-2">
        {/* `shine` : l'écran de fin n'a qu'UNE action qui compte — relancer.
            Le balayage de lumière la désigne sans un mot. */}
        <Button size="lg" shine onClick={onReplay} className="w-full">
          <RotateCcw className="size-4" aria-hidden="true" /> Rejouer
        </Button>
        <Button variant="ghost" onClick={onExit}>
          Retour à l&apos;arène
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card px-2 py-2.5 shadow-sm">
      <dd className="font-mono text-lg font-bold tabular-nums">{value}</dd>
      <dt className="mt-0.5 leading-tight text-muted-foreground">{label}</dt>
    </div>
  )
}
