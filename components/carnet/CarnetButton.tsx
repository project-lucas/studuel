'use client'

import { NotebookPen } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * LA porte d'entrée de « Mon carnet » — les cours que l'élève écrit lui-même.
 *
 * TROISIÈME FORME, ET LA PREMIÈRE QUI SE LIT. Elle a d'abord été une tuile
 * pleine largeur en bas de page : elle doublait visuellement les dossiers de
 * matières et vivait sous le pli. Elle est ensuite devenue un bouton-icône rond
 * dans la rangée de commandes, entre le crayon et la loupe : plus discret, mais
 * MUET — un carnet dessiné à 18 px, sans un mot, au milieu de deux autres
 * icônes rondes, ne dit pas ce qu'il ouvre. Le carnet est pourtant la seule
 * fonction de l'app où l'élève PRODUIT au lieu de consommer.
 *
 * D'où ce bouton-ci : **libellé**, et posé sur la ligne du titre « Réviser »,
 * la bande la plus haute de l'écran — juste au-dessus du « + Contrôle » de la
 * carte de série. C'est la seule commande de l'accueil visible sans défiler
 * d'un pixel.
 *
 * Le résumé (n cours · n questions) reste dans l'`aria-label` : le bouton doit
 * garder la même largeur qu'il y ait zéro ou quarante cours.
 *
 * ⚠️ `data-tour="carnet-switch"` EST UNE CIBLE DU TOUR GUIDÉ (`lib/tour.ts`,
 * étape « Mon carnet »). Sans cet attribut sur un élément monté, l'étape est
 * silencieusement SAUTÉE — `nextAvailableStep` la considère hors écran. Elle
 * suit donc le bouton partout où il déménage.
 *
 * Le volet actif vit dans l'URL (`?espace=carnet`), même mécanique que
 * ReviserSpaces.
 */
export default function CarnetButton({
  coursesCount,
  questionsCount,
}: {
  coursesCount: number
  questionsCount: number
}) {
  const open = () => {
    sfx.tap()
    const url = new URL(window.location.href)
    url.searchParams.set('espace', 'carnet')
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0 })
  }

  const summary =
    coursesCount > 0
      ? `${coursesCount} cours · ${questionsCount} question${questionsCount > 1 ? 's' : ''}`
      : 'Crée tes cours et révise-les.'

  return (
    <button
      type="button"
      onClick={open}
      data-tour="carnet-switch"
      aria-label={`Mon carnet — ${summary}`}
      // Robe des commandes blanches de l'accueil (crayon, loupe, agenda) :
      // blanc, filet noir à 5 %, ombre courte. L'ICÔNE porte le violet, le
      // libellé reste à l'encre : un aplat violet ici entrerait en concurrence
      // avec le « + Contrôle » situé juste dessous, qui est l'action principale
      // de la carte de série. Le carnet se met en avant par les MOTS, pas en
      // criant plus fort que son voisin.
      className="font-heading flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-white pr-4 pl-3 text-sm font-extrabold text-foreground shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
    >
      <NotebookPen
        className="size-4.5 text-primary"
        strokeWidth={2.4}
        aria-hidden="true"
      />
      Mon carnet
    </button>
  )
}
