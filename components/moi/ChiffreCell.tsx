import type { ComponentType, ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// UNE CELLULE DE « MES CHIFFRES ».
//
// Extraite de MesChiffres pour une seule raison : la tuile des notes est
// devenue CLIQUABLE (elle ouvre la saisie des moyennes), donc cliente, alors
// que les cinq autres restent rendues par le serveur. Sans fichier commun, il
// aurait fallu deux dessins de la même cellule — et deux dessins d'une même
// chose finissent toujours par diverger d'un pixel, puis d'une police.
//
// Ce fichier n'a PAS de directive 'use client' : il est neutre, et se laisse
// donc importer des deux côtés de la frontière.
//
// LA COULEUR NE DÉCORE PAS, ELLE REDIT LE DÉCOUPAGE DU BLOC. Les six chiffres
// se lisaient en gris sur blanc, tous du même poids : l'œil n'avait pas de
// porte d'entrée, et la rangée du bas — en encre grise — se lisait comme
// désactivée. Chaque icône reçoit maintenant une pastille teintée, et il n'y a
// que TROIS teintes, exactement les trois familles que le bloc raconte déjà :
//
//   • FLAMME — la série, et elle seule. C'est la règle de la charte, et c'est
//     ici la vraie flamme du bandeau (l'image, pas une icône de trait) : le
//     même objet doit avoir le même visage d'un écran à l'autre.
//   • VIOLET — le travail (temps cumulé, notes). La couleur de la marque.
//   • OR — l'arène (parties, victoires, trophées). Dans la charte, l'or est la
//     couleur du gain ; les trois chiffres qui se gagnent et se perdent la
//     portent ensemble.
//
// Six couleurs auraient fait un tableau de bord d'avion. Trois font une phrase.
// -----------------------------------------------------------------------------

/** La famille de la cellule — cf. l'en-tête : flamme / violet / or. */
export type TonChiffre = 'serie' | 'travail' | 'arene'

/**
 * Le sens d'une évolution. `null` = rien d'honnête à dire (pas de point de
 * comparaison) ; on n'affiche alors AUCUNE flèche plutôt qu'une flèche plate
 * qui prétendrait à la stabilité.
 */
export type Tendance = 'hausse' | 'baisse' | 'stable' | null

const PASTILLE: Record<TonChiffre, string> = {
  serie: 'moi-chiffre-pastille--serie',
  travail: 'moi-chiffre-pastille--travail',
  arene: 'moi-chiffre-pastille--arene',
}

/**
 * La flèche de tendance, collée au chiffre.
 *
 * VERT QUI MONTE, AMBRE QUI DESCEND — et non le corail des alertes. Une moyenne
 * qui baisse d'un dixième n'est pas une panne : c'est une information. Le rouge
 * de la charte est réservé à ce qui doit alarmer, et une carte de profil n'est
 * pas l'endroit où alarmer un élève sur ses résultats scolaires.
 */
function Fleche({ tendance }: { tendance: Exclude<Tendance, null> }) {
  const Icon =
    tendance === 'hausse'
      ? ArrowUpRight
      : tendance === 'baisse'
        ? ArrowDownRight
        : Minus
  return (
    <Icon
      className={cn(
        'size-4 shrink-0',
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

export function Chiffre({
  Icon,
  illustration,
  illustrationEteinte = false,
  ton,
  valeur,
  unite,
  legende,
  note,
  tendance = null,
}: {
  Icon?: ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>
  /** Une image à la place de l'icône de trait (la flamme de série). */
  illustration?: string
  /**
   * L'illustration est ÉTEINTE (désaturée). Même règle que le bandeau du haut :
   * une série à zéro montre une flamme grise, pas une flamme absente — la place
   * reste, à rallumer. Une flamme en pleine couleur au-dessus d'un « 0 » se
   * lirait, elle, comme une célébration de rien.
   */
  illustrationEteinte?: boolean
  ton: TonChiffre
  valeur: ReactNode
  unite?: string
  legende: string
  note?: ReactNode
  tendance?: Tendance
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full',
          'moi-chiffre-pastille',
          // Halo éteint avec la flamme : un cercle ambré autour d'une flamme
          // grise aurait gardé la fête allumée après le départ des invités.
          illustrationEteinte ? 'moi-chiffre-pastille--eteinte' : PASTILLE[ton],
        )}
      >
        {illustration ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={illustration}
            alt=""
            width={64}
            height={64}
            className={cn(
              'size-5 object-contain',
              illustrationEteinte ? 'opacity-45 grayscale' : null,
            )}
          />
        ) : Icon ? (
          <Icon className="size-4" strokeWidth={2.4} aria-hidden={true} />
        ) : null}
      </span>
      <p className="font-heading mt-1 flex items-baseline gap-0.5 leading-none font-extrabold whitespace-nowrap text-foreground">
        <span className="text-[24px] tabular-nums">{valeur}</span>
        {unite ? <span className="text-sm text-muted-foreground">{unite}</span> : null}
        {tendance ? (
          <span className="ml-0.5 self-center">
            <Fleche tendance={tendance} />
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-[11px] leading-tight font-bold text-foreground/70">
        {legende}
      </p>
      {note ? (
        <p className="mt-0.5 text-[10px] leading-tight font-bold text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  )
}

/** Le filet vertical entre deux cellules. */
export function Filet() {
  return <span aria-hidden="true" className="w-px shrink-0 self-stretch bg-border" />
}
