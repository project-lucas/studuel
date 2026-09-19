'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { Check, Crown } from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  groupSupports,
  type SupportChip,
  type SupportKind,
} from '@/lib/subject-template'
import coursIcone from '@/public/images/supports/cours.webp'
import quizIcone from '@/public/images/supports/quiz.webp'
import flashcardsIcone from '@/public/images/supports/flashcards.webp'
import carteIcone from '@/public/images/supports/carte.webp'
import exerciceIcone from '@/public/images/supports/exercice.webp'
import iaIcone from '@/public/images/supports/ia.webp'
import erreursIcone from '@/public/images/supports/erreurs.webp'

/**
 * L'ILLUSTRATION DE CHAQUE SUPPORT — du même atelier que la barre d'onglets et
 * les vignettes de matières : objet peint, contour prune épais, violet et or.
 *
 * Ces icônes étaient des pictogrammes **Lucide** (`BookOpen`, `ListChecks`,
 * `Layers`, `FileText`, `Swords`, `Undo2`). Or cette rangée EST l'offre du
 * produit, et elle est rendue à trois endroits : c'est, après la barre
 * d'onglets, ce que l'élève voit le plus. Une bibliothèque gratuite installée en
 * une commande, c'est une identité que n'importe qui recopie en trois minutes.
 * Le chrome système du fichier (la coche, la gemme, la couronne) reste en
 * trait : personne ne reconnaît une app à son pictogramme de validation, et un
 * dessin à 12 px ne se lirait pas.
 *
 * DEUX DESSINS SONT DES REPRISES, PAS DES CRÉATIONS (16/09/2026) :
 * - `exercice` porte le parchemin à coches de l'arène (les quêtes) : une copie
 *   qu'on rend, dans la palette du lot ;
 * - `ia` (« Moi vs IA ») porte le bouclier à l'éclair qui était celui du Défi
 *   solo de leçon, retiré ce jour-là : l'affrontement, sans doublonner les
 *   épées de l'onglet Défi.
 * Cf. scripts/supports-icones.mjs.
 *
 * LES DESSINS SONT IMPORTÉS, PAS DÉSIGNÉS PAR LEUR CHEMIN, pour la même raison
 * que dans `components/Navigation.tsx` : un chemin littéral est une URL STABLE,
 * donc remplacer le fichier laisserait l'optimiseur d'images de Next et le cache
 * des navigateurs servir l'ANCIEN dessin — on croirait l'intégration ratée.
 * L'import statique donne une URL à empreinte de contenu.
 */
const ICONES: Record<SupportKind, StaticImageData> = {
  cours: coursIcone,
  quiz: quizIcone,
  flashcards: flashcardsIcone,
  // `carte` est le support « Fiche » (SUPPORT_LABELS) ; son dessin est une
  // fiche — c'est le nom qu'il a porté, et l'illustration n'a pas été refaite
  // quand il a repris celui de sa page.
  carte: carteIcone,
  exercice: exerciceIcone,
  ia: iaIcone,
  erreurs: erreursIcone,
}

/**
 * PLUS DE PASTILLE SOUS L'ILLUSTRATION — et c'est le corollaire du passage au
 * dessin, pas un choix de goût. Le disque teinté existait pour porter un
 * PICTOGRAMME DE TRAIT : monochrome, sans silhouette propre, un glyphe n'a ni
 * présence ni couleur d'état sans contenant. Une illustration a déjà tout cela.
 * L'état ne se perd pas : « fait », « verrouillé » et « Studuel+ » sont dits
 * par les pastilles de COIN (coche, gemme, couronne), qui portent une
 * information.
 */

/**
 * Un support VERROUILLÉ se voyait à son pictogramme grisé — un réglage de
 * couleur de texte, qui n'a plus de prise sur une illustration. Le dessin est
 * donc désaturé et affaibli : même signal, sur un objet peint. Il sert aussi
 * bien au verrou par gemme (la fiche) qu'au verrou par abonnement (l'exercice)
 * et au bloc réservé « Bientôt ».
 */
const VERROUILLE = 'opacity-45 grayscale'

/**
 * Les supports d'un chapitre, en boutons cliquables.
 *
 * Rendu à TROIS endroits, avec la même règle de choix (`buildChapterSupports`) :
 * - `layout="grid"` sur l'écran de chapitre et en pied de cours — des tuiles
 *   CARRÉES, en grille centrée, RANGÉES SOUS TROIS VERBES : Apprendre ·
 *   Mémoriser · Se tester (`groupSupports`). C'est l'écran de choix, et les
 *   titres de groupe sont ce qui dit à l'élève la différence entre trois tuiles
 *   qui, sans eux, jouaient le même contenu ;
 * - `layout="row"` : des pastilles compactes en ligne, sans groupes ;
 * - `layout="fiche"` sous une fiche dépliée du programme : les supports sur UNE
 *   rangée horizontale, le cours en premier (cf. `FicheSupports`).
 *
 * Le bloc réservé « Moi vs IA » (`bientot`) ne se montre QUE sur la grille :
 * c'est là qu'on regarde l'offre. En ligne et sous une fiche, une tuile qui ne
 * mène nulle part serait un raccourci mort.
 */
export default function SupportChips({
  chips,
  layout = 'row',
  label,
}: {
  chips: SupportChip[]
  layout?: 'row' | 'grid' | 'fiche'
  /** Intitulé lu par les lecteurs d'écran (le groupe n'a pas de titre visible). */
  label: string
}) {
  if (chips.length === 0) return null
  if (layout === 'fiche') return <FicheSupports chips={chips} label={label} />
  if (layout === 'grid') return <GrilleGroupee chips={chips} label={label} />

  const enLigne = chips.filter((c) => !c.bientot)
  if (enLigne.length === 0) return null
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {enLigne.map((chip) => (
        <li key={chip.kind}>
          <Tuile chip={chip} grid={false} />
        </li>
      ))}
    </ul>
  )
}

/**
 * LA GRILLE EN TROIS GROUPES. Un titre par verbe, une grille de deux colonnes
 * dessous. Les titres sont petits et en capitales : ce sont des étiquettes de
 * rayon, pas des titres de page — l'écran a déjà le sien (« Par quoi tu
 * commences ? »).
 */
function GrilleGroupee({
  chips,
  label,
}: {
  chips: SupportChip[]
  label: string
}) {
  const groupes = groupSupports(chips)
  return (
    <div aria-label={label} role="group" className="mx-auto flex max-w-xs flex-col gap-5">
      {groupes.map((groupe) => {
        // Nombre impair : la dernière tuile se centre sous les autres au lieu
        // de rester échouée à gauche. Elle garde la largeur d'une colonne (la
        // moitié, moins la moitié de la gouttière) — une tuile carrée reste
        // carrée.
        const centerLast = groupe.chips.length % 2 === 1
        return (
          <section key={groupe.groupe} aria-labelledby={`groupe-${groupe.groupe}`}>
            <h3
              id={`groupe-${groupe.groupe}`}
              className="mb-2.5 flex items-center gap-2.5 text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase"
            >
              {groupe.label}
              <span aria-hidden="true" className="h-px flex-1 bg-black/8" />
            </h3>
            <ul className="grid grid-cols-2 gap-3.5">
              {groupe.chips.map((chip, i) => {
                const alone = centerLast && i === groupe.chips.length - 1
                return (
                  <li
                    key={chip.kind}
                    className={
                      alone
                        ? 'col-span-2 w-[calc(50%-0.4375rem)] justify-self-center'
                        : undefined
                    }
                  >
                    <Tuile chip={chip} grid />
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

/**
 * Une tuile (carrée sur la grille, en ligne ailleurs). Le bloc réservé n'est
 * pas un lien : il n'y a rien derrière, et un lien vers `''` renverrait à la
 * page courante avec un rechargement pour rien.
 */
function Tuile({ chip, grid }: { chip: SupportChip; grid: boolean }) {
  const icone = ICONES[chip.kind]
  const eteinte = Boolean(chip.locked || chip.bientot)
  const classes = cn(
    'relative border bg-card shadow-sm transition-all',
    grid
      ? 'flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl p-3 text-center'
      : 'flex h-full items-center gap-2.5 rounded-2xl px-3 py-2',
    chip.done ? 'border-primary/30' : null,
    chip.bientot
      ? 'cursor-default border-dashed'
      : 'hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
  )

  const contenu = (
    <>
      {/* LA COURONNE, dans l'angle : ce support est de l'offre Studuel+. Elle
          se montre même à l'abonné — c'est l'offre qu'elle nomme, pas
          l'accès. Petite, en or sur blanc, comme la gemme du coin des fiches. */}
      {chip.premium ? (
        <span
          aria-hidden="true"
          title="Studuel+"
          className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-card shadow-sm ring-1 ring-black/10"
        >
          <Crown className="size-3 fill-highlight text-highlight" strokeWidth={2.5} />
        </span>
      ) : null}

      {/* L'icône et son état : la pastille chevauche le bas du carré, elle se
          lit comme une étiquette posée dessus. */}
      <span className={cn('relative', grid ? 'mb-2' : null)}>
        <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
          <Image
            src={icone}
            alt=""
            sizes={grid ? '64px' : '32px'}
            className={cn('h-auto', grid ? 'w-16' : 'w-8', eteinte ? VERROUILLE : null)}
          />
        </span>

        {grid && (chip.done || chip.badge) ? (
          <span
            className={cn(
              'absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] leading-tight font-bold whitespace-nowrap',
              // Vert pour « fait », comme la coche des fiches dépliées : le
              // violet est la couleur de l'action, pas de l'acquis.
              chip.done ? 'bg-success text-white' : 'bg-muted text-muted-foreground',
            )}
          >
            {chip.done ? (
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            ) : null}
            {/* La gemme ne vaut que pour le verrou par gemme (la fiche) ; un
                verrou par abonnement a déjà sa couronne dans l'angle. */}
            {chip.locked && !chip.premium ? (
              <GemIcon className="size-3 shrink-0" aria-hidden="true" />
            ) : null}
            {chip.done ? 'Fait' : chip.badge}
          </span>
        ) : null}
      </span>

      <span className={grid ? 'w-full' : 'min-w-0 flex-1'}>
        <span
          className={cn(
            'block leading-tight font-bold',
            grid ? 'text-[15px]' : 'text-sm',
            chip.bientot ? 'text-muted-foreground' : null,
          )}
        >
          {chip.label}
        </span>
        {/* En ligne, l'état complet tient à côté du nom ; en tuile il est déjà
            dans la pastille, on ne le répète pas. */}
        {grid ? null : (
          <span className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight font-semibold text-muted-foreground">
            {chip.locked && !chip.premium ? (
              <GemIcon className="size-3 shrink-0" aria-hidden="true" />
            ) : null}
            {chip.done ? (
              <Check className="size-3 shrink-0" strokeWidth={3} aria-hidden="true" />
            ) : null}
            <span className="truncate">{chip.meta}</span>
          </span>
        )}
      </span>
    </>
  )

  if (chip.bientot) {
    return (
      <div className={classes} aria-disabled="true">
        {contenu}
        <span className="sr-only">{chip.meta}</span>
      </div>
    )
  }
  return (
    <Link href={chip.href} onClick={() => sfx.tap()} className={classes}>
      {contenu}
    </Link>
  )
}

/**
 * LES SUPPORTS SOUS UNE FICHE DÉPLIÉE — une rangée d'icônes, le cours en tête.
 *
 * Tout tient sur UNE ligne : c'est ce qui garde la fiche suivante à portée de
 * regard, et c'est la raison d'être du dépliage (avant, ouvrir un chapitre
 * coûtait une page entière). Autant de colonnes que de supports, de largeur
 * égale, jamais de retour à la ligne.
 *
 * LE COURS EST PREMIER, toujours : c'est la porte d'entrée du chapitre — le
 * texte qu'on vient lire — et les autres sont l'entraînement qu'on choisit
 * ensuite. L'ordre porte donc l'information que la taille ne porte pas.
 *
 * Le bloc réservé « Moi vs IA » n'y figure pas : un raccourci qui ne mène
 * nulle part n'est pas un raccourci.
 */
function FicheSupports({
  chips,
  label,
}: {
  chips: SupportChip[]
  label: string
}) {
  const visibles = chips.filter((c) => !c.bientot)
  // Le cours d'abord, le reste dans l'ordre du catalogue. Trié ici plutôt que
  // supposé : `buildChapterSupports` peut réordonner un jour, la règle de cet
  // écran ne doit pas en dépendre.
  const ordonnes = [
    ...visibles.filter((c) => c.kind === 'cours'),
    ...visibles.filter((c) => c.kind !== 'cours'),
  ]
  if (ordonnes.length === 0) return null

  return (
    <ul
      aria-label={label}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${ordonnes.length}, minmax(0, 1fr))` }}
    >
      {ordonnes.map((chip) => (
        <li key={chip.kind}>
          <Raccourci chip={chip} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Un raccourci : icône de 44 px (le minimum tactile, atteint par l'icône seule),
 * son nom, son état. Sans bordure ni ombre — il est posé sur le bandeau de la
 * fiche, qui porte déjà la séparation. Une carte dans une carte dans une carte,
 * l'œil ne hiérarchise plus rien.
 */
function Raccourci({ chip }: { chip: SupportChip }) {
  const icone = ICONES[chip.kind]
  return (
    <Link
      href={chip.href}
      onClick={() => sfx.tap()}
      className="flex min-h-[68px] cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-0.5 py-2 text-center transition-colors duration-200 hover:bg-muted/50 focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
    >
      <span className="relative">
        <span className="grid size-11 place-items-center" aria-hidden="true">
          <Image
            src={icone}
            alt=""
            sizes="44px"
            className={cn('h-auto w-11', chip.locked ? VERROUILLE : null)}
          />
        </span>
        {/* L'ÉTAT EN COIN, ET EN VERT. Il était VIOLET — la couleur de l'action
            dans toute l'app. Une coche violette se lit comme « va ici »,
            l'inverse de « c'est fait ». Le vert de `success` est celui des
            bonnes réponses du quiz : la couleur que l'élève associe à la
            réussite. */}
        {chip.done ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -bottom-1 grid size-4.5 place-items-center rounded-full bg-success text-white ring-2 ring-background"
          >
            <Check className="size-3" strokeWidth={3.5} />
          </span>
        ) : chip.premium ? (
          /* LA COURONNE : le support est de l'offre Studuel+. Même jeton blanc
             cerné que la gemme, pour que les deux verrous se lisent pareil. */
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-card shadow-sm ring-1 ring-black/10"
          >
            <Crown className="size-3 fill-highlight text-highlight" strokeWidth={2.5} />
          </span>
        ) : chip.locked ? (
          /* La GEMME ILLUSTRÉE : c'est la monnaie qui ouvre ce support, et
             elle porte ses propres couleurs. Le jeton est BLANC, cerné d'un
             filet sombre : il se détache aussi bien de la tuile beige que de
             la carte blanche. */
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-card shadow-sm ring-1 ring-black/10"
          >
            <CristalIcon className="size-3.5" />
          </span>
        ) : null}
      </span>
      <span className="block text-[11px] leading-tight font-bold text-balance">
        {chip.label}
      </span>

      {/* LE CHIFFRE D'AVANCEMENT — seulement pour les supports qui portent un
          NOMBRE : le quiz (« 7/10 », « --/8 »), l'exercice (« 14/20 »), les
          flashcards (« 4 à revoir ») et les erreurs. Le cours et la fiche n'en
          ont pas — leur état tient dans la coche du coin. Un support
          VERROUILLÉ n'affiche rien non plus : le coin dit déjà « débloquer ». */}
      {chip.badge && !chip.locked ? (
        <span className="font-mono text-[10px] leading-none font-bold text-muted-foreground tabular-nums">
          {chip.badge}
        </span>
      ) : null}
    </Link>
  )
}
