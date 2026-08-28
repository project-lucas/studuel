import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * LA JAUGE D'AVANCEMENT d'un chapitre du programme — une barre sous son titre.
 *
 * ELLE REMPLACE UN ANNEAU, et le remplacement vaut d'être expliqué : l'anneau
 * n'était pas mal dessiné, il était mal employé.
 *
 *   · IL RÉPÉTAIT le compte écrit deux centimètres à sa gauche (« 0/8 fiches »),
 *     en plus gros ;
 *   · IL AMPUTAIT LE CHIFFRE de son dénominateur : « 0 » seul ne dit rien, et
 *     la réponse était dans le texte d'à côté — il fallait lire les deux pour
 *     comprendre l'un ;
 *   · SON ÉTAT LE PLUS FRÉQUENT ÉTAIT LE PLUS LAID : au démarrage, une colonne
 *     de cinq ronds gris identiques portant tous « 0 » ;
 *   · IL FAISAIT DEUX RONDS CÔTE À CÔTE à droite de l'en-tête, dont un seul
 *     était cliquable (le chevron).
 *
 * CE QUE LA BARRE FAIT ET QUE L'ANNEAU NE POUVAIT PAS. Empilées, cinq barres
 * s'alignent verticalement : l'œil les compare d'un seul balayage. C'est
 * exactement le reproche que le code se faisait déjà sur le compte en gris
 * — « cette information ne se BALAYE pas » — et que l'anneau avait doublé au
 * lieu de régler, cinq disques n'ayant aucun bord commun à comparer.
 *
 * DEUX COULEURS, CELLES DE LA CHARTE : jaune solaire tant qu'on avance (la
 * couleur de la progression dans toute l'app — barres du header et de la barre
 * collante), violet + coche une fois le chapitre fini. C'est le signe qu'une
 * fiche terminée porte déjà sur sa propre ligne : un chapitre fini et une fiche
 * finie se reconnaissent au même signe.
 *
 * Le compte reste ÉCRIT à côté, avec son dénominateur — une barre dit la
 * proportion, pas le nombre, et « il me reste deux fiches » ne se lit pas sur
 * une longueur.
 */
export default function ChapterProgressBar({
  done,
  total,
  unit,
  className,
}: {
  done: number
  total: number
  /** « fiche » ou « chapitre » — le mot que compte ce bloc. */
  unit: string
  className?: string
}) {
  if (total <= 0) return null
  const fait = Math.max(0, Math.min(done, total))
  const complete = fait >= total
  const ratio = fait / total

  return (
    <span
      // `max-w-sm` : sur un écran large, la ligne du titre fait 1000 px et une
      // jauge étirée sur toute cette largeur devient un trait de séparation, pas
      // un indicateur — le compte partait à l'autre bout de l'écran, à un
      // demi-mètre de la barre qu'il chiffre. Sur mobile, la contrainte ne mord
      // jamais : la colonne y est plus étroite que 24rem.
      className={cn('mt-1 flex max-w-sm items-center gap-2', className)}
      aria-hidden="true"
    >
      {/* Le rail se voit MÊME VIDE : c'est ce qui fait qu'un chapitre pas
          commencé reste une ligne à comparer, et non un trou. */}
      <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/10">
        <span
          className={cn(
            'block h-full rounded-full transition-[width] duration-700 ease-out',
            complete ? 'bg-primary' : 'bg-highlight',
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </span>
      <span
        className={cn(
          'flex shrink-0 items-center gap-1 text-xs font-semibold tabular-nums',
          complete ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {complete ? <Check className="size-3.5" strokeWidth={3} /> : null}
        {fait}/{total} {unit}
        {total > 1 ? 's' : ''}
      </span>
    </span>
  )
}
