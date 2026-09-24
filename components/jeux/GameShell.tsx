'use client'

import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { gameScene } from '@/lib/defi/modes-catalog'
import { cn } from '@/lib/utils'
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
}: {
  format: GameFormat
  /** Meilleur score local sur ce jeu (0 s'il n'y en a pas encore). */
  best: number
  /** Aucune question disponible : on n'ouvre pas une table vide. */
  empty: boolean
  onStart: () => void
  /**
   * Sortie du jeu. Désormais portée par la flèche retour du header ModeStage
   * (qui enveloppe toutes les tables) : la prop reste acceptée pour compat avec
   * les appelants, mais l'intro n'affiche plus son propre bouton de retour.
   */
  onExit?: () => void
}) {
  // Le rappel de l'illustration : la MÊME bannière que le billet de l'arène sur
  // lequel on vient de taper. C'est elle qui relie l'écran de lancement au jeu
  // choisi — la table tient enfin la promesse de l'image. Repli sur la pastille
  // emoji (posée sur un halo d'ambiance de la robe) pour les jeux qui n'ont pas
  // encore leur scène : bland, mais jamais nu.
  const scene = gameScene(format.id)
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-5 pt-6 text-center">
      {scene ? (
        <div className="relative w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
            <Image
              src={scene}
              alt=""
              fill
              sizes="(max-width: 448px) 92vw, 384px"
              className="object-cover"
              priority
            />
            {/* Léger voile bas : assoit la pastille qui déborde sans ternir la
                scène. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"
            />
          </div>
          {/* La pastille emoji, à cheval sur le bas de la scène — le même code
              couleur (robe du jeu) que partout ailleurs. */}
          <span
            aria-hidden="true"
            className="absolute -bottom-6 left-1/2 grid size-16 -translate-x-1/2 place-items-center rounded-2xl bg-[color:var(--jeu-accent)] text-3xl shadow-lg ring-4 ring-[color:var(--jeu-surface)]"
          >
            {format.emoji}
          </span>
        </div>
      ) : (
        <span className="relative grid size-24 place-items-center">
          {/* Halo d'ambiance de la robe, posé en radial derrière la pastille. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-150 rounded-full blur-2xl"
            style={{ background: 'var(--jeu-glow)' }}
          />
          <span
            aria-hidden="true"
            className="grid size-24 place-items-center rounded-3xl bg-[color:var(--jeu-accent)] text-5xl shadow-lg"
          >
            {format.emoji}
          </span>
        </span>
      )}

      <p
        className={cn(
          'text-base leading-snug font-semibold text-balance',
          scene && 'pt-6',
        )}
      >
        {format.rule}
      </p>

      {best > 0 ? (
        <p className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
          <Trophy className="size-4 text-highlight" aria-hidden="true" /> Record
          à battre : <span className="font-mono tabular-nums">{best}</span>
        </p>
      ) : null}

      {/* LE bouton de l'écran, celui de la maison : violet plein, large, avec
          le balayage de lumière réservé à l'action unique. Il a été un rond
          « GO » à la teinte du jeu — la robe d'un jeu habille sa pièce et son
          icône, jamais ce qui se clique, et « GO » n'est pas un mot français. */}
      <Button type="button" size="xl" shine onClick={onStart} disabled={empty} className="w-full">
        C&apos;est parti
      </Button>

      {empty ? (
        <p className="text-sm text-muted-foreground">
          Pas encore de questions pour ce jeu — reviens bientôt !
        </p>
      ) : null}
    </div>
  )
}

/** Le décompte 3 · 2 · 1 · Partez ! — la respiration avant la partie. */
export function GameCountdown({ n }: { n: number }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <span
        key={n}
        className={cn(
          'font-heading animate-in zoom-in-50 fade-in font-extrabold text-primary duration-300',
          // Un chiffre tient en 8xl ; « Partez ! » déborderait d'un téléphone.
          n > 0 ? 'text-8xl' : 'text-5xl',
        )}
      >
        {n > 0 ? n : 'Partez !'}
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
