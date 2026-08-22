'use client'

import Link from 'next/link'
import { sfx } from '@/lib/sounds'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import { duelTarget, rankedBlockedReason } from '@/lib/defi/duel-board'
import { duelGoalSentence, type DuelGoal } from '@/lib/duel-cta'

/**
 * LE BOUTON COMBAT — l'unique appel à l'action de l'arène, et le seul objet
 * doré de l'écran.
 *
 * Il n'ouvre pas d'écran de sélection : la matière se choisit sur la plaque
 * voisine, et le bouton LANCE. Un bouton de combat qui ouvre un menu de combat
 * n'est pas un bouton de combat, c'est un onglet déguisé.
 *
 * IL NE PORTE QU'UN MOT. Il a longtemps affiché en plus sa matière et la jauge
 * de clan, empilées sous le titre : trois messages sur la surface qui reçoit le
 * pouce, et le mot COMBAT réduit à la taille d'une légende pour leur faire de
 * la place. Tout ce contexte vit maintenant sur la ligne d'information, 8 px
 * au-dessus (CombatMeta) — assez près pour rester rattaché au bouton, assez
 * dehors pour ne plus lui disputer sa surface. Ce que le pixel a perdu,
 * l'`aria-label` le garde en entier : destination, gain, présence d'un ami,
 * pourquoi du jour, objectif de clan.
 *
 * Écart ASSUMÉ au design system (« l'or est réservé aux récompenses »), limité
 * à ce bouton : sur l'arène, tout le décor est violet profond — un bouton
 * violet ne sortirait pas du fond. En contrepartie l'or est ici EXCLUSIF : plus
 * un seul liseré doré ailleurs sur l'écran d'action.
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

  // Le gabarit commun aux deux états (jouable / muet) : la barre ne doit pas
  // changer de géométrie quand la plaque voisine tombe sur une matière fermée.
  const shell =
    'arena-plate relative isolate flex min-w-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden px-1'

  // Rien de jouable dans cette matière : le bouton s'éteint plutôt que de
  // briller pour rien. Il garde la plaque de la barre, en robe sombre — un
  // bouton mort reste un objet de la rangée, pas un trou dedans — et il DIT
  // lequel des deux verrous tient. Le mot COMBAT reste, en sourdine : sans lui,
  // l'élève ne saurait pas ce qui est fermé.
  if (!active || !target) {
    return (
      <div className={`${shell} arena-plate--dark text-center`} role="status">
        <span className="font-heading text-[22px] leading-none font-extrabold tracking-[1px] text-white/45">
          COMBAT
        </span>
        <span className="arena-plate-label line-clamp-2 normal-case">
          {active ? rankedBlockedReason(active) : 'Choisis une matière'}
        </span>
      </div>
    )
  }

  // L'étiquette dit la destination en toutes lettres, puis TOUT ce que le pixel
  // ne porte plus : la présence, le pourquoi du jour, l'objectif de clan.
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
      className={`${shell} arena-plate--gold arena-plate--press attract-sheen cursor-pointer focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:outline-none ${
        hasPresence ? 'duel-pulse' : ''
      }`}
    >
      <span className="combat-word font-heading">COMBAT</span>
    </Link>
  )
}
