'use client'

import Link from 'next/link'
import { Crown, MoreHorizontal, Play, Star, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { normalizeCourseColor, normalizeCourseIcon } from '@/lib/carnet-cours'
import { COURSE_ICON, COURSE_TINT } from '@/components/carnet/style'
import type { CoursCarnet } from '@/lib/carnet/priorite'

// -----------------------------------------------------------------------------
// UN DOSSIER DU CARNET — la carte (grille) ou la ligne (liste), au choix de
// l'élève (`preferences.affichage`).
//
// LA CARTE REPREND LA SILHOUETTE DES DOSSIERS DE MATIÈRE DE RÉVISER
// (`SubjectRow`, components/SubjectsHome.tsx) — 10/09/2026, Lucas : « je veux
// que les dossiers du carnet s'affichent de la même manière, peut-être en plus
// gros, que les dossiers de matière de Réviser ». Même rangée : la vignette à
// gauche, le nom à droite, les couronnes sous le nom, le même rayon d'angle
// (1.75rem), le même fond blanc, la même pastille posée sur un coin haut
// (« contrôle » là-bas, « n à revoir » ici). Un rien plus grande : 88 px de
// haut contre 76 — ce sont SES dossiers, ils méritent d'être un peu plus
// présents que ceux du programme. La vignette reste à 52 px et le titre à
// 14 px : à deux cartes par rangée, le nom n'a que ~95 px de large, et un
// titre libre (« Maths — mon cours de l'année ») y a besoin de chaque pixel.
//
// TROIS ÉTATS d'un dossier, dits sans un mot de plus qu'il ne faut :
//   · FAVORI — l'étoile (coin haut-droit) est pleine, jaune, ET la carte porte
//     un fin liseré `highlight` à la place du gris (10/09/2026 : l'étoile
//     seule est petite, le liseré se voit d'un coup d'œil en scrollant). On
//     RENFORCE le favori, on n'affaiblit jamais les autres : estomper les
//     non-favoris les confondrait avec les archivés et grisaillerait sept
//     cartes sur huit. C'est l'élève qui l'a touchée ; la grille le met en
//     tête, au-dessus du filet ;
//   · VIDE (brouillon) — « À remplir » à la place des couronnes : il n'y a
//     rien à réviser, mais le dossier existe et se remplit d'un tap ;
//   · ARCHIVÉ — estompé, « Archivé » ; il ferme la marche et se ressort par ⋯.
//
// La carte entière ouvre le cours. L'étoile et le ⋯ sont des boutons VOISINS
// du lien, jamais imbriqués (deux cibles l'une dans l'autre sont invalides).
// En grille, pas de ▶ sur la carte : c'est ce que fait Réviser, et le bouton
// « Réviser » attend en tête du cours. La ligne (liste) le garde : elle a la
// place.
// -----------------------------------------------------------------------------

/** Côté de la vignette (px) — le même que celle de Réviser. */
const ICON_PX = 52

function Couronnes({ count }: { count: 0 | 1 | 2 | 3 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${count} couronne${count > 1 ? 's' : ''} sur 3`}
    >
      {[0, 1, 2].map((i) => (
        <Crown
          key={i}
          className={cn('size-3.5', i < count ? 'fill-highlight text-highlight' : 'text-muted-foreground/25')}
          strokeWidth={2.4}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

/** L'étoile : favori ou non. Pleine et jaune quand c'est oui, creuse sinon. */
function BoutonFavori({
  actif,
  titre,
  onClick,
  className,
}: {
  actif: boolean
  titre: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      aria-label={actif ? `${titre} : retirer des favoris` : `${titre} : mettre en favori`}
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-full transition active:scale-90',
        actif
          ? 'bg-highlight/30 text-highlight'
          : 'bg-black/[0.04] text-muted-foreground/60 ring-1 ring-black/[0.06] hover:bg-highlight/20 hover:text-highlight',
        className,
      )}
    >
      <Star className={cn('size-4', actif && 'fill-current')} strokeWidth={2.4} aria-hidden="true" />
    </button>
  )
}

export default function CarteCours({
  cours,
  affichage,
  hrefRevision,
  onOptions,
  onFavori,
}: {
  cours: CoursCarnet
  affichage: 'grille' | 'liste'
  /** `/carnet/cours/<id>/reviser` + les paramètres de session du carnet. */
  hrefRevision: string
  onOptions: () => void
  /** L'étoile : bascule favori / pas favori. */
  onFavori: () => void
}) {
  const Icone = COURSE_ICON[normalizeCourseIcon(cours.icon)]
  const teinte = COURSE_TINT[normalizeCourseColor(cours.color)]
  const grille = affichage === 'grille'
  const vide = cours.questionCount === 0
  const nbQuestions = `${cours.questionCount} ${cours.questionCount > 1 ? 'questions' : 'question'}`

  const options = (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onOptions()
      }}
      aria-haspopup="dialog"
      aria-label={`Options de ${cours.title}`}
      className={cn(
        'flex items-center justify-center rounded-full text-muted-foreground transition hover:bg-black/5 active:scale-90',
        grille ? 'absolute right-1 bottom-1.5 z-10 size-7' : 'size-9 shrink-0',
      )}
    >
      <MoreHorizontal className="size-4" strokeWidth={2.6} aria-hidden="true" />
    </button>
  )

  const favori = (
    <BoutonFavori
      actif={cours.epingle}
      titre={cours.title}
      onClick={onFavori}
      className={grille ? 'absolute top-1.5 right-1 z-10' : 'shrink-0'}
    />
  )

  // La seconde ligne : les couronnes et le nombre de cartes — ou l'état qui
  // remplace tout ça quand il n'y a rien à réviser.
  const sousTitre = cours.archive ? (
    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">Archivé</span>
  ) : vide ? (
    <span className="rounded-full bg-highlight/30 px-2 py-0.5 text-[10px] font-extrabold text-foreground/80">
      À remplir
    </span>
  ) : (
    <>
      <Couronnes count={cours.crowns} />
      <span aria-hidden="true">·</span>
      {nbQuestions}
    </>
  )

  const objectif = cours.objectif ? (
    <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[10.5px] font-bold text-primary">
      <Target className="size-3 shrink-0" strokeWidth={2.6} aria-hidden="true" />
      <span className="truncate">{cours.objectif}</span>
    </span>
  ) : null

  if (!grille) {
    return (
      <li
        className={cn(
          // Une seule recette de carte (tokens de globals.css, audit du 23/09/2026) ;
          // `.carnet-dossier` garde son enfoncement au toucher.
          'carte carnet-dossier flex items-center gap-2.5 p-2.5',
          cours.epingle && !cours.archive ? 'ring-1 ring-highlight/70' : null,
          cours.archive && 'opacity-60',
        )}
      >
        <Link
          href={`/carnet/cours/${cours.id}`}
          onClick={() => sfx.tap()}
          className="flex min-w-0 flex-1 items-center gap-2.5"
        >
          <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', teinte)}>
            <Icone className="size-6" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-heading truncate text-[15px] leading-tight font-extrabold text-foreground">
              {cours.title}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] font-semibold text-muted-foreground">
              {sousTitre}
              {cours.dueCount > 0 ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary tabular-nums">
                  {cours.dueCount} à revoir
                </span>
              ) : null}
            </span>
            {objectif}
          </span>
        </Link>
        {favori}
        {options}
        {vide || cours.archive ? null : (
          <Link
            href={hrefRevision}
            onClick={() => sfx.tap()}
            aria-label={`Réviser ${cours.title}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:translate-y-px"
          >
            <Play className="size-3.5 fill-current" aria-hidden="true" />
          </Link>
        )}
      </li>
    )
  }

  return (
    <li className={cn('carnet-dossier relative rounded-carte', cours.archive && 'opacity-60')}>
      <Link
        href={`/carnet/cours/${cours.id}`}
        onClick={() => sfx.tap()}
        className={cn(
          // Le rayon et le fond de LA carte ; l'ombre est portée par le <li>.
          'relative flex min-h-[88px] items-center gap-3 rounded-carte bg-card p-2.5 pr-8',
          // Le liseré du favori : jaune solaire, fin — la même teinte que
          // l'étoile, pour que les deux se lisent comme un seul signe.
          cours.epingle && !cours.archive ? 'ring-1 ring-highlight/70' : null,
        )}
      >
        {/* Pastille « n à revoir » : coin haut-GAUCHE, sur la vignette, hors
            du flux — un ÉTAT, pas du texte. Le coin droit est à l'étoile. */}
        {cours.dueCount > 0 ? (
          <span className="absolute -top-2 left-2.5 z-20 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm tabular-nums">
            {cours.dueCount} à revoir
          </span>
        ) : null}

        {/* La vignette : l'icône du dossier dans sa teinte, même boîte d'une
            carte à l'autre. Décorative — le nom porte le sens. */}
        <span
          aria-hidden="true"
          style={{ width: `${ICON_PX}px`, height: `${ICON_PX}px` }}
          className={cn('flex shrink-0 items-center justify-center rounded-2xl', teinte)}
        >
          <Icone className="size-6" strokeWidth={2.2} />
        </span>

        {/* Nom + couronnes. Deux lignes au maximum : au-delà, la rangée se
            déformerait et la grille perdrait son alignement. Pas de
            `text-balance`, contrairement à Réviser : un titre libre s'y
            coupait en « Maths / — mon… », le premier mot seul sur sa ligne. */}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-heading line-clamp-2 text-[14px] leading-tight font-extrabold text-foreground">
            {cours.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] font-semibold text-muted-foreground">
            {sousTitre}
          </span>
          {objectif}
        </span>
      </Link>
      {favori}
      {options}
    </li>
  )
}
