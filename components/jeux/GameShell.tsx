'use client'

import { Trophy } from 'lucide-react'
import type { GameFormat } from '@/lib/jeux/formats'

/**
 * Les deux écrans que TOUTES les tables de jeu partagent, quelle que soit leur
 * mécanique : l'annonce de la règle, et le décompte de départ.
 *
 * Ils sont ici plutôt que dupliqués dans chaque table, parce que ce sont les
 * seuls moments où deux jeux DOIVENT se ressembler : c'est le rituel commun qui
 * dit « une partie commence ». Tout ce qui suit, en revanche, appartient au jeu.
 */

/**
 * L'intro : la règle en toutes lettres AVANT de lancer. C'est elle qui tient la
 * promesse de l'illustration — l'élève sait à quoi il joue avant que le chrono
 * ne démarre, et découvre que ce n'est pas le jeu d'à côté.
 */
export function GameIntro({
  format,
  best,
  empty,
  onStart,
  onExit,
}: {
  format: GameFormat
  /** Meilleur score local sur ce jeu (0 s'il n'y en a pas encore). */
  best: number
  /** Aucune question disponible : on n'ouvre pas une table vide. */
  empty: boolean
  onStart: () => void
  onExit: () => void
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-5 pt-6 text-center">
      <span
        aria-hidden="true"
        className="grid size-24 place-items-center rounded-3xl bg-[color:var(--jeu-accent)] text-5xl shadow-lg"
      >
        {format.emoji}
      </span>

      <p className="text-base leading-snug font-semibold text-balance">
        {format.rule}
      </p>

      {best > 0 ? (
        <p className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
          <Trophy className="size-4 text-highlight" aria-hidden="true" /> Record
          à battre : <span className="font-mono tabular-nums">{best}</span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={onStart}
        disabled={empty}
        className="go-pulse font-heading relative grid size-28 place-items-center rounded-full bg-[color:var(--jeu-accent)] text-2xl font-extrabold text-[color:var(--jeu-ink)] shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-2 h-10 rounded-full bg-gradient-to-b from-white/25 to-transparent"
        />
        GO
      </button>

      {empty ? (
        <p className="text-sm text-muted-foreground">
          Pas encore de questions pour ce jeu — reviens bientôt !
        </p>
      ) : null}

      <button
        type="button"
        onClick={onExit}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Retour à l&apos;arène
      </button>
    </div>
  )
}

/** Le décompte 3 · 2 · 1 · GO — la respiration avant la partie. */
export function GameCountdown({ n }: { n: number }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <span
        key={n}
        className="font-heading animate-in zoom-in-50 fade-in text-8xl font-extrabold text-[color:var(--jeu-accent)] duration-300"
      >
        {n > 0 ? n : 'GO'}
      </span>
    </div>
  )
}

/** Le lien de sortie en cours de partie, commun à toutes les tables. */
export function GameQuitLink({ onExit }: { onExit: () => void }) {
  return (
    <button
      type="button"
      onClick={onExit}
      className="mt-6 block w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
    >
      Abandonner la partie
    </button>
  )
}
