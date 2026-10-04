'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import Sparkline from '@/components/moi/Sparkline'
import { SaisieMoyennesSheet } from '@/components/moi/SaisieMoyennes'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { formatMoyenne, phraseDelta, type BilanMoyenne } from '@/lib/moi/moyenne'
import type { TermPoint } from '@/lib/trajectoire-bac'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/TableauDeBord.module.css'

// -----------------------------------------------------------------------------
// LA TUILE « MOYENNE » du tableau de bord — la tuile ENTIÈRE est le bouton, et
// elle le reste une fois la moyenne connue : voir « 13,4 » sans pouvoir
// corriger ni ajouter le trimestre suivant serait une impasse. Sans moyenne,
// elle ne montre pas un tiret : elle dit ce qu'il y a à faire (« Ajoute tes
// notes »). La flèche est collée au chiffre, la courbe des trimestres dessous —
// on sait qu'on monte avant d'avoir lu de combien.
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
        'ml-0.5 inline size-5 shrink-0 align-baseline',
        tendance === 'hausse'
          ? 'text-success'
          : tendance === 'baisse'
            ? 'text-warning'
            : 'text-muted-foreground',
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
  nu = false,
}: {
  bilan: BilanMoyenne
  terms: readonly TermPoint[]
  /** La migration 187 n'est pas passée : la saisie n'a nulle part où aller. */
  disabled?: boolean
  /** Sans carte : une case d'une rangée qui porte déjà la sienne. */
  nu?: boolean
}) {
  const [open, setOpen] = useState(false)
  // L'onglet reste monté : on ne retrouve pas la saisie ouverte au retour.
  useFermeAuMasquage(setOpen, false)
  const moyenne = formatMoyenne(bilan)
  const tendance = sensDe(bilan)
  const courbe = terms.flatMap((t) => (t.avg === null ? [] : [t.avg]))

  if (disabled) {
    return (
      <div className={cn(!nu && 'carte', styles.tuile)}>
        <span className="surtitre">Moyenne</span>
        <span className="mt-2 text-sm font-bold text-muted-foreground">Bientôt</span>
      </div>
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
        aria-haspopup="dialog"
        aria-label={
          moyenne
            ? `Moyenne générale : ${moyenne} sur 20. Modifier mes moyennes.`
            : 'Ajouter mes moyennes de trimestre'
        }
        className={cn(!nu && 'carte', styles.tuile)}
      >
        <span className="surtitre">Moyenne</span>
        {moyenne ? (
          <>
            <span className={cn(styles.grand, 'mt-1.5')}>
              {moyenne}
              {tendance ? <Fleche tendance={tendance} /> : null}
            </span>
            {courbe.length >= 2 ? (
              <Sparkline valeurs={courbe} className="mt-1.5 text-primary" titre="Mes moyennes par trimestre" />
            ) : (
              <span className="mt-1.5 text-xs font-semibold text-muted-foreground">
                {phraseDelta(bilan) ?? 'sur 20'}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="mt-1.5 grid size-9 place-items-center rounded-xl bg-secondary text-primary">
              <Plus className="size-5" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="mt-1.5 text-xs font-semibold text-muted-foreground">Ajoute tes notes</span>
          </>
        )}
      </button>
      <SaisieMoyennesSheet open={open} onClose={() => setOpen(false)} terms={terms} />
    </>
  )
}
