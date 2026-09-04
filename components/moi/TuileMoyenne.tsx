'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import CompteurVerre from '@/components/moi/CompteurVerre'
import { SaisieMoyennesSheet } from '@/components/moi/SaisieMoyennes'
import { formatMoyenne, phraseDelta, type BilanMoyenne } from '@/lib/moi/moyenne'
import type { TermPoint } from '@/lib/trajectoire-bac'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA TUILE « TES NOTES » — le seul compteur de la carte qui ouvre quelque chose.
//
// La tuile ENTIÈRE est le bouton, de la taille d'un doigt, et elle le reste une
// fois la moyenne connue : voir « 13,4 » sans pouvoir corriger ni ajouter le
// trimestre suivant serait une impasse. Sans moyenne, elle ne montre pas un
// tiret : elle dit ce qu'il y a à faire (« Ajoute tes notes »). La flèche est
// collée au chiffre, le delta en détail dessous — on sait qu'on monte avant
// d'avoir lu de combien.
//
// Elle vit DANS la carte de joueur, en verre comme ses trois voisines
// (CompteurVerre), sur la même rangée : elle a été une tuile blanche sous la
// carte, à côté de deux chiffres que la carte disait déjà. Sans moyenne, un
// « + » en or dit qu'il y a quelque chose à ajouter.
// -----------------------------------------------------------------------------

type Tendance = 'hausse' | 'baisse' | 'stable' | null

function sensDe(bilan: BilanMoyenne): Tendance {
  if (bilan.delta === null || bilan.precedent === null) return null
  if (bilan.delta > 0) return 'hausse'
  if (bilan.delta < 0) return 'baisse'
  return 'stable'
}

/** Vert qui monte, ambre qui descend — jamais le corail des alertes. */
function Fleche({ tendance }: { tendance: Exclude<Tendance, null> }) {
  const Icon =
    tendance === 'hausse' ? ArrowUpRight : tendance === 'baisse' ? ArrowDownRight : Minus
  return (
    <Icon
      className={cn(
        'ml-0.5 inline size-4 shrink-0 align-middle',
        tendance === 'hausse'
          ? 'text-success'
          : tendance === 'baisse'
            ? 'text-warning'
            : 'text-white/70',
      )}
      strokeWidth={3}
      aria-hidden="true"
    />
  )
}

export default function TuileMoyenne({
  bilan,
  terms,
  disabled = false,
}: {
  bilan: BilanMoyenne
  terms: readonly TermPoint[]
  /** La migration 187 n'est pas passée : la saisie n'a nulle part où aller. */
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const moyenne = formatMoyenne(bilan)
  const tendance = sensDe(bilan)

  if (disabled) {
    return (
      <CompteurVerre
        valeur={<span className="text-sm text-white/70">Bientôt</span>}
        legende="notes"
      />
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-label={
          moyenne
            ? `Moyenne générale : ${moyenne} sur 20. Modifier mes moyennes.`
            : 'Ajouter mes moyennes de trimestre'
        }
        title={moyenne ? phraseDelta(bilan) ?? undefined : 'Ajoute tes notes'}
        className="block h-full w-full min-w-0 cursor-pointer rounded-2xl text-left transition hover:bg-white/5 active:scale-[0.97]"
      >
        <CompteurVerre
          className="h-full"
          valeur={
            moyenne ? (
              <>
                {moyenne}
                {tendance ? <Fleche tendance={tendance} /> : null}
              </>
            ) : (
              <Plus
                className="inline size-5 text-highlight"
                strokeWidth={3}
                aria-hidden="true"
              />
            )
          }
          legende={moyenne ? 'moyenne' : 'notes'}
        />
      </button>
      <SaisieMoyennesSheet open={open} onClose={() => setOpen(false)} terms={terms} />
    </>
  )
}
