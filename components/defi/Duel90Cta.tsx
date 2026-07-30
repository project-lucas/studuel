'use client'

import Link from 'next/link'
import { sfx } from '@/lib/sounds'
import { DUEL_SECONDS } from '@/lib/duel90'
import { duelGoalSentence, type DuelGoal } from '@/lib/duel-cta'

/**
 * Le CTA « DUEL 90 s » — LE bouton de l'app, en OR ciselé (`.olympe-gold`), au
 * centre de la rangée de combat, encadré par Classé et Modes (deux tuiles
 * sombres). C'est le bouton Combat de la home Clash Royale : un seul objet
 * brillant en bas de l'écran, deux satellites éteints autour.
 *
 * Écart ASSUMÉ au design system (« l'or est réservé aux récompenses ») et
 * limité à cette rangée : sur l'arène, tout le décor est violet profond — un
 * bouton violet ne sortait pas du fond, alors que l'or y est la seule couleur
 * qui claque. Ailleurs dans l'app, l'or reste la couleur du gain.
 *
 * Il lance la boucle centrale : 90 secondes, sur le chapitre le plus utile de
 * l'élève, contre un rival dont le score monte en direct. Aucun choix à faire
 * avant de jouer — chaque écran intermédiaire coûte des joueurs.
 *
 * Sa sous-ligne dit le POURQUOI de ce chapitre (« Contrôle dans 3 jours ») —
 * c'est elle qui transforme « un quiz de plus » en « le quiz dont j'ai
 * besoin ». Quand un ami est en session, elle lui cède la place (la présence
 * sociale tire plus fort qu'une raison pédagogique, et le bouton n'a pas la
 * largeur pour les deux) et le bouton respire (pulse léger, coupé par
 * prefers-reduced-motion). Le détail complet reste dans l'`aria-label`.
 *
 * Il porte enfin SON COMPTEUR ET SON ÉCHÉANCE, comme le bouton Combat de Clash
 * Royale (« 60/700 · Fin dans 3j 23h ») : la contribution de clan de la semaine
 * et le temps qu'il reste avant dimanche. La décision est dans lib/duel-cta.
 */
export default function Duel90Cta({
  reason,
  onlineFriendName,
  goal,
}: {
  reason?: string
  /** Prénom d'un ami actuellement en session (RPC friends_live), s'il y en a. */
  onlineFriendName?: string
  /** Objectif de la semaine (lib/duel-cta) — absent si la 204 n'est pas là. */
  goal?: DuelGoal | null
}) {
  const hasPresence = Boolean(onlineFriendName)
  const why = reason ?? 'Sur ton chapitre en cours'
  const baseLabel = `Lancer un duel amical de ${DUEL_SECONDS} secondes — ${why.toLowerCase()}${
    hasPresence ? `. ${onlineFriendName} est en ligne` : ''
  }`

  return (
    <Link
      href="/defi/duel"
      onClick={() => sfx.battle()}
      className={`olympe-gold olympe-press attract-sheen relative isolate flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg px-3 py-2 focus-visible:ring-4 focus-visible:ring-primary/60 focus-visible:outline-none ${
        hasPresence ? 'duel-pulse' : ''
      }`}
      aria-label={goal ? `${baseLabel}. ${duelGoalSentence(goal)}` : baseLabel}
    >
      <span className="font-heading text-[1.55rem] leading-none font-extrabold tracking-wide">
        DUEL {DUEL_SECONDS} s
      </span>

      {/* La sous-ligne : la raison du chapitre, ou l'ami en ligne quand il y en
          a un (une seule ligne, jamais les deux — le bouton ne fait plus la
          largeur de l'écran depuis qu'il est encadré). */}
      <span className="flex max-w-full items-center gap-1.5 text-[0.72rem] font-bold">
        {hasPresence ? (
          <span
            className="size-2 shrink-0 rounded-full bg-green-700 motion-safe:animate-pulse"
            aria-hidden="true"
          />
        ) : null}
        <span className="truncate">
          {hasPresence ? `${onlineFriendName} est en ligne` : why}
        </span>
      </span>

      {/* LE COMPTEUR ET L'ÉCHÉANCE, dans le bouton — barre courte à gauche,
          chiffre et date à droite. Sur l'or, la part déjà apportée au clan se
          lit en ENCRE (le doré sur doré ne se voyait pas). Absent tant que la
          semaine de clan n'existe pas : un « 0/50 » sans base derrière ne
          bougerait jamais. */}
      {goal ? (
        <span className="mt-0.5 flex w-full items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-foreground/25">
            <span
              className="block h-full rounded-full bg-foreground transition-[width] duration-500"
              style={{ width: `${Math.round(goal.ratio * 100)}%` }}
            />
          </span>
          <span className="min-w-0 flex-1 truncate text-[0.6rem] leading-none font-bold tracking-wide tabular-nums">
            {goal.label} · {goal.deadline}
          </span>
        </span>
      ) : null}
    </Link>
  )
}
