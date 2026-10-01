'use client'

import { ArrowRight } from 'lucide-react'
import XpIcon from '@/components/ui/XpIcon'
import { sfx } from '@/lib/sounds'
import { minutesLabel } from '@/lib/subject-template'
import type { Reprise } from '@/lib/reviser/programme'

/**
 * LA CARTE « REPRENDRE » — la seule plaque violette de l'onglet Programme.
 *
 * Une carte d'entrée a déjà existé ici (« On commence par ça », retirée le
 * 17/09/2026 avec les plaques violettes des chapitres : sept blocs violets
 * empilés, aucun ne ressortait). Elle revient avec la grille de tuiles
 * blanches (Lucas, 01/10/2026 : « la suggestion du bloc Reprendre est bonne, à
 * garder ») : sur un écran clair, c'est la seule chose violette, donc la seule
 * qui dise « par ici ».
 *
 * Elle annonce CE QU'IL Y A À GAGNER, avec l'éclair jaune de l'XP : le montant
 * de base qui reste sur la fiche (leçon à lire, couronnes à décrocher). Le
 * multiplicateur d'amis s'applique au versement, côté serveur.
 *
 * C'est un bouton, pas un lien : il conduit à la fiche DANS le programme (son
 * thème s'ouvre, la fiche se déplie), il ne court-circuite pas la liste.
 */
export default function CarteReprendre({
  reprise,
  onReprendre,
}: {
  reprise: Reprise
  onReprendre: () => void
}) {
  const { fiche, libelle, rang } = reprise
  const details = [
    libelle,
    rang !== null ? `Fiche ${rang}` : null,
    fiche.minutes !== null ? minutesLabel(fiche.minutes) : null,
  ].filter(Boolean)

  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onReprendre()
      }}
      className="flex w-full cursor-pointer items-center gap-3 rounded-carte border-b-4 border-b-black/25 bg-primary px-4 py-3.5 text-left text-primary-foreground shadow-carte transition-transform active:translate-y-0.5 active:border-b-2"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-extrabold tracking-wide text-primary-foreground/80 uppercase">
          {details.join(' · ')}
        </span>
        <span className="font-heading mt-0.5 block text-lg leading-tight font-extrabold text-balance">
          {fiche.title}
        </span>
        {fiche.xpRestant > 0 ? (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-0.5 text-xs font-extrabold text-foreground">
            <XpIcon className="size-3.5" />
            +{fiche.xpRestant} XP à gagner
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-primary"
      >
        <ArrowRight className="size-5" strokeWidth={3} />
      </span>
    </button>
  )
}
