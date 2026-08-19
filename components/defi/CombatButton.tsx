'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import { duelTarget, rankedBlockedReason } from '@/lib/defi/duel-board'
import { duelGoalSentence, type DuelGoal } from '@/lib/duel-cta'

/**
 * LE BOUTON COMBAT — l'unique appel à l'action de l'arène, en or ciselé.
 *
 * Il n'ouvre plus d'écran de sélection : la matière se choisit à côté, sur la
 * roulette, et le bouton LANCE. C'est le geste que promettait l'arène depuis le
 * début — un bouton de combat qui ouvre un menu de combat n'est pas un bouton
 * de combat, c'est un onglet déguisé.
 *
 * IL DIT TOUJOURS CE QU'IL LANCE (« Maths · Duel classé », « Maths · Calcul
 * mental »). La destination dépend d'un objet voisin — la roulette — donc la
 * taire aurait fait du bouton une loterie. C'est aussi ce qui permet au repli
 * d'être honnête : quand le classé n'est pas encore ouvert, COMBAT lance le jeu
 * le plus rentable de la matière et le NOMME, au lieu de laisser croire au
 * classé (cf. `duelTarget`).
 *
 * Écart ASSUMÉ au design system (« l'or est réservé aux récompenses »), limité
 * à cette rangée : sur l'arène tout le décor est violet profond, un bouton
 * violet ne sortirait pas du fond.
 */
export default function CombatButton({
  reason,
  onlineFriendName,
  goal,
}: {
  /** Le pourquoi pédagogique du jour (chapitre en cours, contrôle qui vient). */
  reason?: string
  /** Prénom d'un ami actuellement en session (RPC friends_live), s'il y en a. */
  onlineFriendName?: string
  /** Objectif de la semaine (lib/duel-cta) — absent si la 204 n'est pas là. */
  goal?: DuelGoal | null
}) {
  const { active } = useDuelSubject()
  const target = active ? duelTarget(active) : null

  const hasPresence = Boolean(onlineFriendName)

  const shell =
    'relative isolate flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-2'

  // Rien de jouable dans cette matière : le bouton se tait plutôt que de
  // briller pour rien. Il garde le gabarit de la rangée (l'écran ne doit pas
  // sauter quand la roulette tourne) et dit LEQUEL des deux verrous tient.
  if (!active || !target) {
    return (
      <div
        className={`${shell} border-2 border-dashed border-white/25 bg-black/25 text-center text-white/70`}
        role="status"
      >
        <Lock className="size-5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
        <span className="line-clamp-2 text-[0.72rem] font-bold">
          {active ? rankedBlockedReason(active) : 'Choisis une matière'}
        </span>
      </div>
    )
  }

  // LA SOUS-LIGNE DIT LA MATIÈRE, et rien d'autre. C'est la seule information
  // que le geste voisin fait varier : on tourne la roulette, ce mot change, et
  // le lien du bouton avec elle devient évident sans qu'aucune flèche ne le
  // dessine. Le nom du jeu y était avant — mais il changeait sans qu'on l'ait
  // demandé (selon que le classé soit ouvert ou non), et un libellé qui bouge
  // tout seul sous un bouton d'action est un bruit, pas une information. Il
  // vit maintenant dans l'étiquette, avec le reste du contexte.
  const line = active.subject

  // L'étiquette dit la destination en toutes lettres, puis TOUT ce que le pixel
  // n'a pas la place de porter : le pourquoi du jour et l'objectif de clan.
  const label = [
    `Combat — ${target.label} en ${active.subject}, la victoire rapporte ${target.nextWin} trophées`,
    hasPresence ? `${onlineFriendName} est en ligne` : null,
    reason,
    goal ? duelGoalSentence(goal) : null,
  ]
    .filter(Boolean)
    .join('. ')

  return (
    <Link
      href={target.href}
      onClick={() => sfx.battle()}
      aria-label={label}
      title={reason ? `${target.label} · ${active.subject} — ${reason}` : undefined}
      className={`olympe-gold olympe-press attract-sheen cursor-pointer focus-visible:ring-4 focus-visible:ring-primary/60 focus-visible:outline-none ${shell} ${
        hasPresence ? 'duel-pulse' : ''
      }`}
    >
      <span className="font-heading text-[1.55rem] leading-none font-extrabold tracking-wide">
        COMBAT
      </span>

      {/* La matière, en cartouche : elle se lit comme la FENTE où la roulette
          dépose son choix, et non comme une légende de plus. La clé la
          remonte à chaque changement, ce qui rejoue son apparition — le mot
          arrive juste après que le tambour se soit posé. */}
      <span
        key={active.slug}
        className="subject-swap font-heading flex max-w-full items-center gap-1.5 rounded-full bg-foreground/12 px-2.5 py-0.5 text-[0.78rem] leading-none font-extrabold tracking-wide"
      >
        {hasPresence ? (
          <span
            className="size-1.5 shrink-0 rounded-full bg-green-700 motion-safe:animate-pulse"
            aria-hidden="true"
          />
        ) : null}
        <span className="truncate">{line}</span>
      </span>

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
