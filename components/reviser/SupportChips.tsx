'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { SupportChip, SupportKind } from '@/lib/subject-template'
import coursIcone from '@/public/images/supports/cours.webp'
import quizIcone from '@/public/images/supports/quiz.webp'
import flashcardsIcone from '@/public/images/supports/flashcards.webp'
import carteIcone from '@/public/images/supports/carte.webp'
import defiIcone from '@/public/images/supports/defi.webp'
import erreursIcone from '@/public/images/supports/erreurs.webp'

/**
 * L'ILLUSTRATION DE CHAQUE SUPPORT — du même atelier que la barre d'onglets et
 * les vignettes de matières : objet peint, contour prune épais, violet et or.
 *
 * Ces six-là étaient des pictogrammes **Lucide** (`BookOpen`, `ListChecks`,
 * `Layers`, `FileText`, `Swords`, `Undo2`). Or cette rangée EST l'offre du
 * produit, et elle est rendue à quatre endroits : c'est, après la barre
 * d'onglets, ce que l'élève voit le plus. Une bibliothèque gratuite installée en
 * une commande, c'est une identité que n'importe qui recopie en trois minutes.
 * Le chrome système du fichier (la coche, la gemme) reste en trait : personne ne
 * reconnaît une app à son pictogramme de validation, et un dessin à 12 px ne se
 * lirait pas.
 *
 * LE DÉFI PORTE LES ÉPÉES DE SON ONGLET — c'est le même dessin, repris et non
 * redessiné (`scripts/supports-icones.mjs`) : le support mène au Défi, un
 * cousin y aurait brouillé le lien.
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
  // `carte` est le support « Carte mentale » (SUPPORT_LABELS) ; son dessin est
  // une fiche — c'est le nom qu'il a porté, et l'illustration n'a pas été
  // refaite quand il a repris celui de sa page.
  carte: carteIcone,
  defi: defiIcone,
  erreurs: erreursIcone,
}

/**
 * PLUS DE PASTILLE SOUS L'ILLUSTRATION — et c'est le corollaire du passage au
 * dessin, pas un choix de goût.
 *
 * Le disque teinté (`bg-primary/10`, `bg-muted` quand c'était verrouillé)
 * existait pour porter un PICTOGRAMME DE TRAIT : monochrome, sans silhouette
 * propre, un glyphe n'a ni présence ni couleur d'état sans contenant. Une
 * illustration a déjà tout cela — son contour prune, ses couleurs, sa forme.
 * Le disque n'ajoutait donc plus qu'une SECONDE forme, muette, par-dessus une
 * première qui parle, et rétrécissait le dessin à 32 px dans un cercle de 44.
 * C'est le défaut que ce fichier dénonce déjà plus bas : « une carte dans une
 * carte dans une carte, l'œil ne hiérarchise plus rien ».
 *
 * Le dessin est donc posé à même le fond et prend toute la place — exactement
 * ce que fait la barre d'onglets, où les six illustrations reposent sur le
 * socle crème. L'état ne se perd pas : « fait » et « verrouillé » sont dits par
 * les pastilles de COIN (coche, gemme), qui étaient déjà là et qui, elles,
 * portent une information.
 *
 * Le Cours perd au passage son disque violet plein, qui disait « commence par
 * là ». L'ordre le dit toujours : il est premier de la rangée, et c'est déjà
 * l'argument retenu pour le rendu « fiche » (cf. FicheSupports).
 */

/**
 * Un support VERROUILLÉ se voyait à son pictogramme grisé (`text-foreground/40`)
 * — un réglage de couleur de texte, qui n'a plus de prise sur une illustration.
 * Le dessin est donc désaturé et affaibli : même signal, sur un objet peint.
 */
const VERROUILLE = 'opacity-45 grayscale'

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
        const icone = ICONES[chip.kind]
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
                  className="flex shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <Image
                    src={icone}
                    alt=""
                    sizes={isGrid ? '64px' : '32px'}
                    className={cn(
                      'h-auto',
                      isGrid ? 'w-16' : 'w-8',
                      chip.locked ? VERROUILLE : null,
                    )}
                  />
                </span>

                {isGrid && (chip.done || chip.badge) ? (
                  <span
                    className={cn(
                      'absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] leading-tight font-bold whitespace-nowrap',
                      // Vert pour « fait », comme la coche des fiches dépliées :
                      // le violet est la couleur de l'action, pas de l'acquis.
                      chip.done
                        ? 'bg-success text-white'
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
        {/* L'ÉTAT EN COIN, ET EN VERT.
            Il était VIOLET — la couleur de l'action dans toute l'app, celle des
            boutons sur lesquels on tape. Une coche violette se lit comme « va
            ici », exactement l'inverse de « c'est fait ». Le vert de `success`
            est déjà celui des bonnes réponses du quiz et du bouton « Revoir mes
            erreurs » : c'est la couleur que l'élève associe à la réussite. */}
        {chip.done ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -bottom-1 grid size-4.5 place-items-center rounded-full bg-success text-white ring-2 ring-background"
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
      <span className="block text-[11px] leading-tight font-bold text-balance">
        {chip.label}
      </span>

      {/* LE CHIFFRE D'AVANCEMENT, REVENU — mais pas pour tout le monde.
          Une ligne d'état grise a déjà vécu ici et en est partie : elle
          affichait cinq colonnes de texte minuscule (« À lire », « 8 cartes »)
          sous cinq icônes déjà parlantes, deux fois la même information dont
          une illisible. Le défaut inverse s'est révélé pire : sous une fiche
          dépliée, plus RIEN ne disait où l'on en était — ni si le quiz avait
          été tenté, ni combien de cartes attendaient.

          Seuls reviennent les supports qui portent un NOMBRE : le quiz
          (« 7/10 », « --/8 » tant qu'on n'a pas essayé), les flashcards
          (« 4 à revoir ») et les erreurs. Le cours, les fiches et le défi n'en
          ont pas — leur état tient dans la coche du coin, et c'est justement
          ce qui rendait l'ancienne ligne bavarde.

          Un support VERROUILLÉ n'affiche rien non plus : la gemme du coin dit
          déjà « débloquer », l'écrire une seconde fois ne l'ouvre pas. */}
      {chip.badge && !chip.locked ? (
        <span className="font-mono text-[10px] leading-none font-bold text-muted-foreground tabular-nums">
          {chip.badge}
        </span>
      ) : null}
    </Link>
  )
}
