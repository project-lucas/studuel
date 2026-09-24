'use client'

import Link from 'next/link'
import { LibraryBig } from 'lucide-react'
import { hrefRayon } from '@/lib/bibliotheque'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

/**
 * LA porte d'entrée de « Ma bibliothèque » (ex-« Mon carnet », 24/09/2026) —
 * les cours que l'élève écrit lui-même, ses capsules et ses fiches achetées.
 *
 * TROISIÈME FORME, ET LA PREMIÈRE QUI SE LIT. Elle a d'abord été une tuile
 * pleine largeur en bas de page : elle doublait visuellement les dossiers de
 * matières et vivait sous le pli. Elle est ensuite devenue un bouton-icône rond
 * dans la rangée de commandes, entre le crayon et la loupe : plus discret, mais
 * MUET — un carnet dessiné à 18 px, sans un mot, au milieu de deux autres
 * icônes rondes, ne dit pas ce qu'il ouvre. Le carnet est pourtant la seule
 * fonction de l'app où l'élève PRODUIT au lieu de consommer.
 *
 * D'où ce bouton-ci : **libellé**. Il a vécu sur la ligne du titre « Réviser »
 * ; depuis le 17/09/2026 (Lucas : « Mon carnet va dans le bloc semaine »), il
 * est posé EN PIED de la carte de série, sous les sept jours, en pleine
 * largeur (`pleineLargeur`) : le carnet est ce qu'on ouvre après avoir vu où
 * l'on en est.
 *
 * Depuis le 15/09/2026, le carnet est UNE PAGE À PART ENTIÈRE (`/carnet`),
 * plus un volet de Réviser derrière `?espace=carnet` : ce bouton est un lien.
 *
 * Le résumé (n cours · n questions) reste dans l'`aria-label` : le bouton doit
 * garder la même largeur qu'il y ait zéro ou quarante cours.
 *
 * ⚠️ `data-tour="carnet-switch"` EST UNE CIBLE DU TOUR GUIDÉ (`lib/tour.ts`,
 * étape « Ma bibliothèque »). Sans cet attribut sur un élément monté, l'étape est
 * silencieusement SAUTÉE — `nextAvailableStep` la considère hors écran. Elle
 * suit donc le bouton partout où il déménage.
 */
export default function CarnetButton({
  coursesCount,
  questionsCount,
  capsulesNouvelles = 0,
  pleineLargeur = false,
}: {
  coursesCount: number
  questionsCount: number
  /**
   * Capsules achetées dans la Boutique et jamais ouvertes : une pastille
   * rouge sur le bouton, qui s'éteint à la première ouverture (366).
   */
  capsulesNouvelles?: number
  /**
   * En pied de la carte de série : toute la largeur, centré, sur un voile
   * violet très léger (la marque, en lavis) — le gris chaud du fond crème se
   * lisait comme une zone inactive sous les sept jours.
   */
  pleineLargeur?: boolean
}) {
  const summary =
    coursesCount > 0
      ? `${coursesCount} cours · ${questionsCount} question${questionsCount > 1 ? 's' : ''}`
      : 'Tes cours, tes capsules et tes fiches.'
  const nouvelles =
    capsulesNouvelles > 0
      ? ` — ${capsulesNouvelles} nouvelle${capsulesNouvelles > 1 ? 's' : ''} capsule${capsulesNouvelles > 1 ? 's' : ''}`
      : ''

  return (
    <Link
      // Une capsule neuve attend : on arrive sur son rayon, pas sur les
      // Dossiers — sinon la pastille promettait du neuf qu'on ne voyait pas.
      href={capsulesNouvelles > 0 ? hrefRayon('capsules') : hrefRayon('dossiers')}
      onClick={() => sfx.tap()}
      data-tour="carnet-switch"
      aria-label={`Ma bibliothèque — ${summary}${nouvelles}`}
      // Robe des commandes blanches de l'accueil (crayon, loupe, agenda) :
      // blanc, filet noir à 5 %, ombre courte. L'ICÔNE porte le violet, le
      // libellé reste à l'encre : un aplat violet ici entrerait en concurrence
      // avec le « + Contrôle » situé juste dessous, qui est l'action principale
      // de la carte de série. Le carnet se met en avant par les MOTS, pas en
      // criant plus fort que son voisin.
      className={cn(
        'font-heading relative flex min-h-11 shrink-0 items-center gap-2 rounded-full text-sm font-extrabold text-foreground transition active:translate-y-px',
        pleineLargeur
          ? 'w-full justify-center bg-primary/10 px-4 text-primary ring-1 ring-primary/15 ring-inset'
          : 'bg-white pr-4 pl-3 shadow-sm ring-1 ring-black/5',
      )}
    >
      {/* EN TRAIT, ET C'EST VOULU (24/09/2026). Une étagère dessinée (le lot des
          onglets de la bibliothèque) a été essayée ici : à la taille réelle du
          bouton, ses quatre dos et sa planche se fondaient en une tache violet
          et or, et elle volait la vedette au « + Nouveau contrôle » — alors que
          ses voisins de la carte de série sont en trait. Le dessin ne vaut qu'à
          partir de ~30 px (onglets de la bibliothèque, tuiles de chapitre). */}
      <LibraryBig
        className="size-4.5 text-primary"
        strokeWidth={2.4}
        aria-hidden="true"
      />
      Ma bibliothèque
      {capsulesNouvelles > 0 ? (
        // Même pastille que l'onglet Boutique (NavBoutiqueBadge) : un point
        // rouge et son halo — on voit qu'il y a du neuf, on ne compte pas.
        <span aria-hidden="true" className="absolute -top-1 -right-0.5 flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/60" />
          <span className="relative inline-flex size-3 rounded-full bg-destructive ring-2 ring-white" />
        </span>
      ) : null}
    </Link>
  )
}
