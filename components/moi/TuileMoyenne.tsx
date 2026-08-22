'use client'

import { useState } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import { Chiffre, type Tendance } from '@/components/moi/ChiffreCell'
import { SaisieMoyennesSheet } from '@/components/moi/SaisieMoyennes'
import { formatMoyenne, phraseDelta, type BilanMoyenne } from '@/lib/moi/moyenne'
import type { TermPoint } from '@/lib/trajectoire-bac'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// LA TUILE « TES NOTES » — la seule cellule cliquable du bloc.
//
// CE QU'ELLE RÉPARE. Le bouton « + Ajouter » de la saisie avait été dessiné du
// temps où ces chiffres vivaient sur le violet : encre blanche, fond blanc à
// 20 %. Le bloc a déménagé sur la plaque BLANCHE de la carte de joueur, et le
// bouton est parti avec — invisible, blanc sur blanc. La cellule affichait donc
// une icône, le mot « tes notes », et RIEN entre les deux : un trou au milieu
// d'une rangée de chiffres, que l'élève ne pouvait pas lire autrement que comme
// une panne.
//
// CE QU'ELLE CHANGE. Ce n'est plus un bouton POSÉ DANS la cellule, c'est la
// cellule ENTIÈRE qui est le bouton — pleine, remplie, et de la taille d'un
// doigt. Et elle reste cliquable une fois la moyenne connue : voir « 13,4 » sans
// pouvoir la corriger ni ajouter le trimestre suivant, ce serait une impasse.
// Un chiffre que l'élève a saisi lui-même doit rester à sa main.
//
// LA FLÈCHE DIT LE SENS AVANT QUE LA PHRASE NE LE DISE. « +0,4 vs T1 » vit en
// note de 10 px sous la légende : c'est la dernière chose lue, quand elle est
// lue. La flèche, elle, est collée au chiffre — on sait qu'on monte avant
// d'avoir lu de combien.
// -----------------------------------------------------------------------------

function sensDe(bilan: BilanMoyenne): Tendance {
  if (bilan.delta === null || bilan.precedent === null) return null
  if (bilan.delta > 0) return 'hausse'
  if (bilan.delta < 0) return 'baisse'
  return 'stable'
}

/** L'appel à l'action quand aucune moyenne n'est connue. */
function PastilleAjouter() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1.5 text-[13px] leading-none font-extrabold text-primary ring-1 ring-primary/25">
      <Plus className="size-3.5" strokeWidth={3} aria-hidden="true" />
      Ajouter
    </span>
  )
}

export default function TuileMoyenne({
  bilan,
  terms,
  disabled = false,
}: {
  bilan: BilanMoyenne
  /** Les trois trimestres fusionnés, pour la feuille de saisie. */
  terms: readonly TermPoint[]
  /** La migration 187 n'est pas passée : la saisie n'a nulle part où aller. */
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const moyenne = formatMoyenne(bilan)

  // Sans la table des moyennes, la cellule reste muette plutôt que de proposer
  // un geste qui échouerait. Mieux vaut une case vide qu'un bouton menteur.
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
        className="moi-chiffre-bouton flex min-w-0 flex-1 cursor-pointer rounded-xl transition active:scale-[0.97]"
      >
        <Chiffre
          ton="travail"
          Icon={TrendingUp}
          valeur={moyenne ?? <PastilleAjouter />}
          unite={moyenne ? '/20' : undefined}
          legende={moyenne ? 'de moyenne' : 'tes notes'}
          note={phraseDelta(bilan)}
          tendance={sensDe(bilan)}
        />
      </button>
      <SaisieMoyennesSheet
        open={open}
        onClose={() => setOpen(false)}
        terms={terms}
      />
    </>
  )
}
