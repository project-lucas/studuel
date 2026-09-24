import type { ReactNode } from 'react'
import BackButton from '@/components/BackButton'

/**
 * L'EN-TÊTE DE PAGE — la seule recette de Réviser (audit du 23/09/2026).
 *
 * L'audit comptait sept recettes d'en-tête dans l'app : bandeau plein aux
 * couleurs de la matière, lavis pastel et titre centré, lien texte « ‹ Réviser »,
 * H1 seul sans retour… Ici il n'y en a plus qu'une, alignée à GAUCHE :
 *
 *   [retour rond blanc]                                  [action de droite]
 *   [médaillon]  Titre en Baloo 2, taille FIXE (3xl)              [écusson]
 *                sous-titre gris
 *   [barre de progression, rangée d'onglets…]
 *
 * PAS DE FOND : le mur crème quadrillé de l'app (`.tab-bg`, posé par
 * `app/layout.tsx`) est le seul fond de Réviser. L'identité de la matière
 * tient au médaillon, aux billets et aux liserés, jamais à un bandeau coloré —
 * c'est ce qui a fait disparaître les marges négatives (`-mx-4 -mt-16`) dont
 * chaque page avait besoin pour peindre le sien sous le bandeau du haut.
 *
 * PAS DE LARGEUR : c'est la page qui pose son conteneur (`max-w-2xl` pour un
 * cours, `max-w-4xl` pour une carte mentale). L'en-tête épouse ce qu'on lui
 * donne.
 *
 * EN LIGNE (`enLigne`, « Ma bibliothèque », Lucas, 24/09/2026 : « aligne Ma
 * bibliothèque à la flèche de retour ») : le titre se pose SUR la rangée du
 * retour, à sa droite — même police, même taille. Une page qui n'a ni médaillon
 * ni écusson y gagne une rangée entière. Réservé à cette page : partout
 * ailleurs, la recette reste celle du dessus.
 *
 * La rangée retour/action porte TOUJOURS `sans-papier` : un bouton retour ou
 * un bouton d'impression n'a rien à faire sur une feuille imprimée (bloc
 * `@media print` de globals.css), sur le cours comme ailleurs.
 */
export default function EnTetePage({
  retour,
  titre,
  sousTitre,
  medaillon,
  droite,
  fin,
  children,
  className,
  enLigne = false,
}: {
  /** Où mène le retour quand l'élève est arrivé par un lien direct. */
  retour: { fallback: string; label?: string }
  titre: string
  /** Une ligne grise sous le titre (matière, programme, classement…). */
  sousTitre?: ReactNode
  /** Le médaillon de la matière (vignette sur plaque blanche), à gauche du titre. */
  medaillon?: ReactNode
  /** L'action posée en face du retour (imprimer le cours, etc.). */
  droite?: ReactNode
  /** Ce qui clôt la ligne du titre (l'écusson du gardien). */
  fin?: ReactNode
  /** Sous le titre : barre de progression, rangée de pilules d'onglets. */
  children?: ReactNode
  className?: string
  /** Le titre sur la rangée du retour (voir plus haut). */
  enLigne?: boolean
}) {
  if (enLigne) {
    return (
      <header className={className}>
        <div className="flex items-center gap-3">
          <span className="sans-papier flex shrink-0">
            <BackButton fallback={retour.fallback} label={retour.label} />
          </span>
          <h1 className="font-heading min-w-0 flex-1 truncate text-3xl font-extrabold">{titre}</h1>
          {droite ? <span className="sans-papier flex shrink-0">{droite}</span> : null}
        </div>
        {sousTitre ? (
          <div className="mt-1 pl-[3.25rem] text-sm font-medium text-muted-foreground">{sousTitre}</div>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </header>
    )
  }

  return (
    <header className={className}>
      <div className="sans-papier flex items-center justify-between gap-3">
        <BackButton fallback={retour.fallback} label={retour.label} />
        {droite ?? null}
      </div>

      <div className="mt-4 flex items-center gap-4">
        {medaillon ?? null}
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-3xl font-extrabold text-balance">
            {titre}
          </h1>
          {sousTitre ? (
            // Un <div>, pas un <p> : le sous-titre peut contenir une ligne de
            // classement (StandingLine) qui est elle-même un paragraphe.
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              {sousTitre}
            </div>
          ) : null}
        </div>
        {fin ? <div className="shrink-0">{fin}</div> : null}
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </header>
  )
}
