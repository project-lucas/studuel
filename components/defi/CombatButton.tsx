'use client'

import { useState } from 'react'
import { sfx } from '@/lib/sounds'
import MatchmakingOverlay from '@/components/defi/MatchmakingOverlay'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import { duelTarget, rankedBlockedReason } from '@/lib/defi/duel-board'
import { duelGoalSentence, type DuelGoal } from '@/lib/duel-cta'

/**
 * LE BOUTON DUEL — l'unique appel à l'action de l'arène, et le seul objet doré
 * de l'écran.
 *
 * Il n'ouvre pas d'écran de sélection : la matière se choisit sur la plaque
 * voisine, et le bouton LANCE. Un bouton de duel qui ouvre un menu de duel
 * n'est pas un bouton de duel, c'est un onglet déguisé. Ce qu'il ouvre est un
 * RIDEAU — la recherche d'adversaire — qui navigue de lui-même : une mise en
 * scène, pas un choix de plus à faire.
 *
 * IL PORTE SA MATIÈRE, SOUS LE MOT. Et il en a longtemps porté davantage : la
 * jauge de clan et son échéance y étaient empilées aussi, ce qui faisait trois
 * messages sur la surface qui reçoit le pouce et réduisait le mot du bouton à
 * la taille d'une légende. Tout était alors sorti sur une ligne d'information
 * posée 8 px au-dessus.
 *
 * Cette ligne dehors avait son propre défaut : un bandeau sombre flottant entre
 * le socle du personnage et la barre, dans le seul couloir que l'écran gardait
 * libre — et qui ressemblait à un quatrième bouton juste au-dessus des trois
 * vrais. La matière est donc RENTRÉE, seule : un mot en grand, sa destination
 * en petit dessous. Deux lignes, une hiérarchie, rien qui flotte.
 *
 * Ce que le pixel ne porte pas, l'`aria-label` le garde en entier : destination,
 * gain en trophées, présence d'un ami, pourquoi du jour, objectif de clan.
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
  // Le rideau de recherche d'adversaire est ouvert ?
  const [recherche, setRecherche] = useState(false)

  const hasPresence = Boolean(onlineFriendName)

  // Le gabarit commun aux deux états (jouable / muet) : la barre ne doit pas
  // changer de géométrie quand la plaque voisine tombe sur une matière fermée.
  const shell =
    'arena-plate relative isolate flex min-w-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden px-1'

  // Rien de jouable dans cette matière : le bouton s'éteint plutôt que de
  // briller pour rien. Il garde la plaque de la barre, en robe sombre — un
  // bouton mort reste un objet de la rangée, pas un trou dedans — et il DIT
  // lequel des deux verrous tient. Le mot DUEL reste, en sourdine : sans lui,
  // l'élève ne saurait pas ce qui est fermé.
  if (!active || !target) {
    return (
      <div className={`${shell} arena-plate--dark text-center`} role="status">
        <span className="font-heading text-[22px] leading-none font-extrabold tracking-[1px] text-white/45">
          DUEL
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
    `Duel — ${target.label} en ${active.subject}, la victoire rapporte ${target.nextWin} trophées`,
    hasPresence ? `${onlineFriendName} est en ligne` : null,
    reason,
    goal ? duelGoalSentence(goal) : null,
  ]
    .filter(Boolean)
    .join('. ')

  return (
    <>
      {/* UN BOUTON, PAS UN LIEN. Il ouvrait la route du duel directement ; il
          ouvre maintenant le rideau de recherche d'adversaire, qui navigue
          lui-même une fois la mise en scène jouée. La distinction compte pour
          l'accessibilité : ce qui déclenche un processus est un `button`, ce
          qui mène ailleurs est un `a`. Ici on déclenche. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setRecherche(true)
        }}
        aria-label={label}
        title={reason ? `${target.label} · ${active.subject} — ${reason}` : undefined}
        className={`${shell} arena-plate--gold arena-plate--press duel-lueur cursor-pointer focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:outline-none ${
          hasPresence ? 'duel-pulse' : ''
        }`}
      >
        <span className="combat-word font-heading">DUEL</span>
        {/* LA MATIÈRE, en second rang. Elle est tronquée plutôt que repliée sur
            deux lignes : « Histoire-Géographie » ferait grandir le bouton d'une
            ligne entière et casserait l'alignement des trois plaques, qui
            partagent une hauteur fixe. Le nom complet reste dans
            l'`aria-label`. */}
        <span className="combat-sous-mot font-heading">{active.subject}</span>
      </button>

      {recherche ? (
        <MatchmakingOverlay
          href={target.href}
          subject={active.subject}
          onCancel={() => setRecherche(false)}
        />
      ) : null}
    </>
  )
}
