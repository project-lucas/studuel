'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Chiffre, type Tendance } from '@/components/moi/ChiffreCell'
import { SaisieMoyennesSheet } from '@/components/moi/SaisieMoyennes'
import { formatMoyenne, phraseDelta, type BilanMoyenne } from '@/lib/moi/moyenne'
import type { TermPoint } from '@/lib/trajectoire-bac'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// LA TUILE « TES NOTES » — la seule des trois preuves qui ouvre quelque chose.
//
// La tuile ENTIÈRE est le bouton, de la taille d'un doigt, et elle le reste une
// fois la moyenne connue : voir « 13,4 » sans pouvoir corriger ni ajouter le
// trimestre suivant serait une impasse. Sans moyenne, elle ne montre pas un
// tiret : elle dit ce qu'il y a à faire (« Ajoute tes notes »). La flèche est
// collée au chiffre, le delta en note dessous — on sait qu'on monte avant
// d'avoir lu de combien.
// -----------------------------------------------------------------------------

function sensDe(bilan: BilanMoyenne): Tendance {
  if (bilan.delta === null || bilan.precedent === null) return null
  if (bilan.delta > 0) return 'hausse'
  if (bilan.delta < 0) return 'baisse'
  return 'stable'
}

/** Le delta en pastille verte / ambre, à côté du chiffre. */
function Delta({ bilan }: { bilan: BilanMoyenne }) {
  if (bilan.delta === null || bilan.precedent === null || bilan.delta === 0) return null
  const monte = bilan.delta > 0
  return (
    <span
      className={
        monte
          ? 'ml-1 rounded-full bg-success/12 px-1.5 py-px text-[10px] font-extrabold text-success'
          : 'ml-1 rounded-full bg-warning/12 px-1.5 py-px text-[10px] font-extrabold text-warning'
      }
    >
      {monte ? '+' : ''}
      {bilan.delta.toFixed(1).replace('.', ',')}
    </span>
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

  if (disabled) {
    return (
      <Chiffre
        ton="travail"
        Icon={TrendingUp}
        valeur={<span className="text-base text-muted-foreground">Bientôt</span>}
        legende="tes notes"
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
        className="moi-chiffre-bouton flex w-full min-w-0 flex-1 cursor-pointer rounded-2xl text-left transition active:scale-[0.97]"
      >
        <Chiffre
          ton="travail"
          Icon={TrendingUp}
          valeur={
            moyenne ? (
              <>
                {moyenne}
                <Delta bilan={bilan} />
              </>
            ) : (
              <span className="text-[15px] leading-tight text-primary">Ajoute tes notes</span>
            )
          }
          unite={moyenne ? '/20' : undefined}
          legende={moyenne ? 'moyenne du trimestre' : 'ta moyenne, ton delta'}
          note={moyenne ? phraseDelta(bilan) : null}
          tendance={sensDe(bilan)}
        />
      </button>
      <SaisieMoyennesSheet open={open} onClose={() => setOpen(false)} terms={terms} />
    </>
  )
}
