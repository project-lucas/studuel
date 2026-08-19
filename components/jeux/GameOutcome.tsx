'use client'

import { Ghost, RotateCcw, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { XP_RULES } from '@/lib/xp'
import type { GameFormat } from '@/lib/jeux/formats'
import { runAchieved, runTarget, type GameRun } from '@/lib/jeux/run'
import type { GameTrophyOutcome } from '@/app/defi/actions'
import { trophyBand } from '@/lib/trophy-road'
import type { GameGhost } from '@/lib/jeux/ghost-server'

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
  trophies,
  ghost,
  onReplay,
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
  /**
   * Mouvement de trophées sur la Route (null en attente, ou quand le serveur
   * n'a rien accordé : visiteur, couple hors catalogue, borne de rythme).
   */
  trophies?: GameTrophyOutcome
  /** Le meilleur score d'un ami sur ce jeu, s'il y en a un. */
  ghost?: GameGhost | null
  onReplay: () => void
  /**
   * Sortie du jeu. Désormais portée par la flèche retour du header ModeStage :
   * la prop reste acceptée pour compat avec les appelants, mais l'écran de fin
   * n'affiche plus son propre bouton de retour (seul « Rejouer » subsiste).
   */
  onExit?: () => void
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

      <TrophyLine trophies={trophies} />
      <GhostLine ghost={ghost} score={run.score} />

      <p className="min-h-5 text-sm text-muted-foreground">
        {saved === true
          ? '✓ Journée validée — ta série continue 🔥'
          : saved === false
            ? 'Partie non enregistrée (connecte-toi pour garder ton XP).'
            : ''}
      </p>

      {/* `shine` : l'écran de fin n'a qu'UNE action qui compte — relancer.
          Le balayage de lumière la désigne sans un mot. Le retour à l'arène
          vit dans la flèche flottante (ArenaBackButton). */}
      <Button size="lg" shine onClick={onReplay} className="w-full">
        <RotateCcw className="size-4" aria-hidden="true" /> Rejouer
      </Button>
    </div>
  )
}

/**
 * Le mouvement de trophées sur la Route. Trois choses, dans cet ordre : ce que
 * la partie a rapporté, le compteur du jeu, et CE QUE VAUDRA LA PROCHAINE
 * VICTOIRE.
 *
 * Cette dernière ligne est le cœur du système et non une décoration : c'est en
 * lisant « +10 » ici et « +3 » sur son jeu habituel que l'élève arbitre tout
 * seul, et va vers la compétence qu'il n'a jamais travaillée. Brawl Stars ne
 * l'affiche pas ; une app scolaire le doit — on ne veut pas que l'arbitrage
 * reste réservé à ceux qui devinent la courbe.
 *
 * La perte ne prend JAMAIS la couleur d'alerte : un trophée perdu n'est pas une
 * erreur à corriger, et la doctrine du Défi est de ne pas punir l'échec au
 * point de faire fuir un collégien.
 */
function TrophyLine({ trophies }: { trophies?: GameTrophyOutcome }) {
  if (!trophies) return null

  const gained = trophies.delta > 0
  const shielded = trophies.delta === 0
  const nextWin = trophyBand(trophies.after).win

  return (
    <div className="w-full space-y-1.5 rounded-2xl bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Trophy className="size-4" aria-hidden="true" /> Trophées
        </span>
        <span
          className={cn(
            'font-mono text-xl font-extrabold tabular-nums',
            gained ? 'text-highlight' : 'text-muted-foreground',
          )}
        >
          {gained ? '+' : ''}
          {trophies.delta}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {shielded && !gained
            ? 'Rien perdu — tu débutes sur ce jeu'
            : `Total sur ce jeu : ${trophies.after}`}
        </span>
        <span>
          Prochaine victoire{' '}
          <strong className="font-mono font-bold text-foreground tabular-nums">
            +{nextWin}
          </strong>
        </span>
      </div>
    </div>
  )
}

/**
 * LE FANTÔME — le meilleur score d'un ami sur ce jeu.
 *
 * Il tient la place des dix « adversaires » en dur du mode classé supprimé
 * (Maxou, BrainZ, La Taupe…), tirés par une graine. Un collégien repère vite
 * un adversaire scripté, et la ladder devient alors une machine à sous. Une
 * ligne qui appartient à quelqu'un de réel, elle, continue de mordre.
 *
 * Le dépassement se célèbre ; l'échec ne se commente pas au-delà du chiffre —
 * on affiche l'écart, jamais un jugement.
 */
function GhostLine({
  ghost,
  score,
}: {
  ghost?: GameGhost | null
  score: number
}) {
  if (!ghost) return null

  const beaten = score > ghost.score

  return (
    <p
      className={cn(
        'flex w-full items-center justify-center gap-1.5 rounded-2xl px-4 py-2 text-sm',
        beaten
          ? 'bg-highlight/20 font-bold text-foreground'
          : 'text-muted-foreground',
      )}
    >
      <Ghost className="size-4 shrink-0" aria-hidden="true" />
      {beaten ? (
        <span>
          Tu viens de battre {ghost.name} ({ghost.score}) !
        </span>
      ) : (
        <span>
          {ghost.name} tient le record : {ghost.score}
        </span>
      )}
    </p>
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
