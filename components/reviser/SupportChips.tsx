'use client'

import Link from 'next/link'
import {
  BookOpen,
  Check,
  Layers,
  ListChecks,
  FileText,
  Swords,
  Undo2,
} from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { SupportChip, SupportKind } from '@/lib/subject-template'

const ICONS: Record<SupportKind, typeof ListChecks> = {
  cours: BookOpen,
  quiz: ListChecks,
  flashcards: Layers,
  // Une FEUILLE, pas un graphe de nœuds : ce support est la fiche de révision
  // du chapitre. Le pictogramme de carte mentale promettait un schéma à
  // ramifications, ce que l'élève n'appelle pas une fiche.
  carte: FileText,
  defi: Swords,
  // La flèche qui revient : on repasse sur ce qu'on a raté.
  erreurs: Undo2,
}

/**
 * Les supports d'un chapitre, en boutons cliquables.
 *
 * Rendu à QUATRE endroits, avec la même règle de choix (`buildChapterSupports`) :
 * - `layout="grid"` sur l'écran de chapitre et en pied de cours — des tuiles
 *   CARRÉES, en grille centrée qui ne touche pas les bords de l'écran : une
 *   icône, son état en pastille, son nom. C'est l'écran de choix ;
 * - `layout="row"` dans l'onglet « Mode de jeu », où 28 chapitres se suivent :
 *   des pastilles compactes en ligne, sinon la page ferait dix écrans ;
 * - `layout="fiche"` sous une fiche dépliée du programme : les cinq supports
 *   sur UNE rangée horizontale, le cours en premier (cf. `FicheSupports`).
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
  const isGrid = layout === 'grid'
  // Nombre impair : la dernière tuile se centre sous les autres au lieu de
  // rester échouée à gauche. Elle garde la largeur d'une colonne (la moitié,
  // moins la moitié de la gouttière) — une tuile carrée reste carrée.
  const centerLast = isGrid && chips.length % 2 === 1

  return (
    <ul
      aria-label={label}
      className={cn(
        isGrid
          ? 'mx-auto grid max-w-xs grid-cols-2 gap-3.5'
          : 'flex flex-wrap gap-2',
      )}
    >
      {chips.map((chip, i) => {
        const Icon = ICONS[chip.kind]
        const alone = centerLast && i === chips.length - 1
        return (
          <li
            key={chip.kind}
            className={
              alone
                ? 'col-span-2 w-[calc(50%-0.4375rem)] justify-self-center'
                : undefined
            }
          >
            <Link
              href={chip.href}
              onClick={() => sfx.tap()}
              className={cn(
                'border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
                isGrid
                  ? 'flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl p-3 text-center'
                  : 'flex h-full items-center gap-2.5 rounded-2xl px-3 py-2',
                chip.done ? 'border-primary/30' : null,
              )}
            >
              {/* L'icône et son état : la pastille chevauche le bas du carré,
                  elle se lit comme une étiquette posée dessus. */}
              <span className={cn('relative', isGrid ? 'mb-2' : null)}>
                <span
                  className={cn(
                    'flex shrink-0 items-center justify-center',
                    isGrid ? 'size-16 rounded-2xl' : 'size-8 rounded-xl',
                    chip.done
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary',
                  )}
                  aria-hidden="true"
                >
                  <Icon className={isGrid ? 'size-8' : 'size-4'} strokeWidth={2.2} />
                </span>

                {isGrid && (chip.done || chip.badge) ? (
                  <span
                    className={cn(
                      'absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] leading-tight font-bold whitespace-nowrap',
                      chip.done
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {chip.done ? (
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    ) : null}
                    {chip.locked ? (
                      <GemIcon className="size-3 shrink-0" aria-hidden="true" />
                    ) : null}
                    {chip.done ? 'Fait' : chip.badge}
                  </span>
                ) : null}
              </span>

              <span className={isGrid ? 'w-full' : 'min-w-0 flex-1'}>
                <span
                  className={cn(
                    'block leading-tight font-bold',
                    isGrid ? 'text-[15px]' : 'text-sm',
                  )}
                >
                  {chip.label}
                </span>
                {/* En ligne, l'état complet tient à côté du nom ; en tuile il
                    est déjà dans la pastille, on ne le répète pas. */}
                {isGrid ? null : (
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight font-semibold text-muted-foreground">
                    {chip.locked ? (
                      <GemIcon className="size-3 shrink-0" aria-hidden="true" />
                    ) : null}
                    {chip.done ? (
                      <Check className="size-3 shrink-0" strokeWidth={3} aria-hidden="true" />
                    ) : null}
                    <span className="truncate">{chip.meta}</span>
                  </span>
                )}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * LES SUPPORTS SOUS UNE FICHE DÉPLIÉE — une rangée d'icônes, le cours en tête.
 *
 * Tout tient sur UNE ligne : c'est ce qui garde la fiche suivante à portée de
 * regard, et c'est la raison d'être du dépliage (avant, ouvrir un chapitre
 * coûtait une page entière). Cinq colonnes de largeur égale, jamais de retour à
 * la ligne dans le cas courant.
 *
 * LE COURS EST PREMIER, toujours : c'est la porte d'entrée du chapitre — le
 * texte qu'on vient lire — et les quatre autres sont l'entraînement qu'on
 * choisit ensuite. L'ordre porte donc l'information que la taille ne porte pas.
 */
function FicheSupports({
  chips,
  label,
}: {
  chips: SupportChip[]
  label: string
}) {
  // Le cours d'abord, le reste dans l'ordre du catalogue. Trié ici plutôt que
  // supposé : `buildChapterSupports` peut réordonner un jour, la règle de cet
  // écran ne doit pas en dépendre.
  const ordonnes = [
    ...chips.filter((c) => c.kind === 'cours'),
    ...chips.filter((c) => c.kind !== 'cours'),
  ]

  return (
    <ul aria-label={label} className="grid grid-cols-5 gap-1.5">
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
  const Icon = ICONS[chip.kind]
  // Le cours porte l'icône PLEINE dès le départ : première de la rangée et
  // seule en violet franc, elle dit par où commencer sans un mot de plus.
  const entree = chip.kind === 'cours'
  return (
    <Link
      href={chip.href}
      onClick={() => sfx.tap()}
      className="flex min-h-[68px] cursor-pointer flex-col items-center gap-1.5 rounded-2xl px-0.5 py-2 text-center transition-colors duration-200 hover:bg-muted/50 focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
    >
      <span className="relative">
        <span
          className={cn(
            'grid size-11 place-items-center rounded-2xl transition-colors duration-200',
            chip.done || entree
              ? 'bg-primary text-primary-foreground'
              : chip.locked
                ? 'bg-muted text-foreground/40'
                : 'bg-primary/10 text-primary',
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" strokeWidth={2.2} />
        </span>
        {/* L'état en COIN, pas en couleur seule : « fait » ne se voyait qu'à un
            liseré violet qu'on ne remarquait pas. */}
        {chip.done ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -bottom-1 grid size-4.5 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-background"
          >
            <Check className="size-3" strokeWidth={3.5} />
          </span>
        ) : chip.locked ? (
          /* La GEMME ILLUSTRÉE : c'est la monnaie qui ouvre ce support, et
             elle porte ses propres couleurs. Le pictogramme monochrome de 10 px
             posé sur un disque jaune ne se lisait pas — et il ne ressemblait pas
             à la monnaie que l'élève voit dans son solde.
             Le jeton est BLANC, cerné d'un filet sombre : l'anneau crème d'avant
             se posait sur la tuile crème d'un support verrouillé, deux beiges
             l'un sur l'autre qui bavaient. Le blanc, lui, détache la gemme aussi
             bien de la tuile beige que de la carte blanche. */
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-card shadow-sm ring-1 ring-black/10"
          >
            <CristalIcon className="size-3.5" />
          </span>
        ) : null}
      </span>
      {/* Le NOM, et rien d'autre. La ligne d'état grise qui vivait dessous
          (« À lire », « --/8 », « 8 cartes ») faisait cinq colonnes de texte
          minuscule sous cinq icônes déjà parlantes : deux fois l'information,
          dont une illisible. Ce qui compte vraiment — fait, verrouillé — est
          passé en pastille de coin sur l'icône, là où l'œil va d'abord.
          L'état complet reste écrit en toutes lettres sur l'écran de chapitre
          et en pied de cours, qui ont la place. */}
      <span className="block text-[11px] leading-tight font-bold text-balance">
        {chip.label}
      </span>
    </Link>
  )
}
