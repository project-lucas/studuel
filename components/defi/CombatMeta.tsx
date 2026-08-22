'use client'

import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import SubjectIcon from '@/components/SubjectIcon'
import { type DuelGoal } from '@/lib/duel-cta'

/**
 * LA LIGNE D'INFORMATION de la barre d'action — ce que le bouton COMBAT portait
 * à l'intérieur, et qui n'y avait pas sa place.
 *
 * Trois choses y ont déménagé : la matière courante (pastille de gauche), la
 * contribution de clan de la semaine avec son échéance (à droite), et la jauge
 * qui les relie (dessous). Sur la plaque dorée, ces trois messages se battaient
 * avec le mot COMBAT pour 300 px carrés : le seul mot que le bouton devait
 * crier était le plus petit des quatre.
 *
 * ELLE NE PORTE AUCUN RELIEF. Sur cet écran, biseau + ombre portée = « ceci se
 * touche ». Une ligne d'information sculptée aurait ajouté un quatrième bouton
 * apparent juste au-dessus des trois vrais, et la barre aurait recommencé à
 * mentir sur ce qui est cliquable.
 *
 * La jauge et l'échéance disparaissent ENSEMBLE quand la semaine de clan n'est
 * pas disponible (`goal` nul) : un « 0/50 » sans base derrière ne bougerait
 * jamais, et une barre vide qui ne se remplit pas est pire que pas de barre.
 */
export default function CombatMeta({
  goal,
  onlineFriendName,
}: {
  /** L'objectif de clan de la semaine (lib/duel-cta), ou null sans semaine. */
  goal?: DuelGoal | null
  /** Prénom d'un ami en session — le point vert de la pastille de matière. */
  onlineFriendName?: string
}) {
  const { active } = useDuelSubject()
  if (!active) return null

  return (
    <div>
      <div className="flex h-7 items-center justify-between gap-2">
        {/* LA MATIÈRE, en pastille. C'est la seule information de la ligne que
            l'élève fait varier lui-même (par le flanc droit) : elle prend donc
            la place de tête, et le fond sombre la détache du décor comme une
            fente où le choix se dépose. */}
        <span className="combat-meta-pill flex min-w-0 items-center gap-1.5 px-2.5 py-1">
          {onlineFriendName ? (
            <span
              className="size-1.5 shrink-0 rounded-full bg-emerald-400 motion-safe:animate-pulse"
              aria-hidden="true"
            />
          ) : null}
          <SubjectIcon
            slug={active.slug}
            className="size-3.5 shrink-0"
            strokeWidth={2.6}
            aria-hidden="true"
          />
          <span className="truncate text-[12px] leading-none font-bold">
            {active.subject}
          </span>
        </span>

        {goal ? (
          <span className="combat-meta-note shrink-0 text-[12px] leading-none font-semibold tabular-nums">
            {goal.label} · {goal.deadline}
          </span>
        ) : null}
      </div>

      {/* La jauge, en fil de 4 px. Décorative : le chiffre au-dessus la dit déjà
          en clair, et la phrase complète vit dans l'étiquette du bouton. */}
      {goal ? (
        <span
          className="combat-meta-bar mt-1 block h-1 overflow-hidden rounded-[2px]"
          aria-hidden="true"
        >
          <span
            className="block h-full rounded-[2px] transition-[width] duration-500"
            style={{ width: `${Math.round(goal.ratio * 100)}%` }}
          />
        </span>
      ) : null}
    </div>
  )
}
