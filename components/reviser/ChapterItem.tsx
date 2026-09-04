'use client'

import { Check, Clock3, Crown, Plus, Timer } from 'lucide-react'
import SupportChips from '@/components/reviser/SupportChips'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  CROWN_THRESHOLDS,
  STATUS_LABELS,
  minutesLabel,
  type ChapterRow,
  type SupportChip,
} from '@/lib/subject-template'

// Une SEULE entrée par chapitre : numéro + titre, durée estimée, couronnes
// gagnées, état. Le clic DÉPLIE la fiche et découvre ses supports dessous.
//
// AVANT, il ouvrait une page : un rendu serveur entier, un écran de chargement,
// puis cinq tuiles — et un retour en arrière pour qui s'était trompé de fiche.
// Trois gestes et deux écrans pour choisir « Quiz ». Les tuiles sont maintenant
// DANS la liste : on tape la fiche, elles se dépliENT, on tape ce qu'on veut.
// La page de chapitre existe toujours (liens profonds, pied de cours) ; elle
// n'est simplement plus le passage obligé.
//
// `resumeLabel` : la fiche à reprendre garde son repère jaune — mais sur le
// « + », pas sur un bouton-texte. C'est le même geste que partout ailleurs dans
// la liste ; seule la couleur dit « c'est ici qu'on reprend ».
//
// `rank` : non nul quand la liste est rangée sous les chapitres du programme
// (colonne `theme`). La ligne n'est alors plus un chapitre mais une FICHE de
// celui qui la coiffe : elle prend son numéro DANS le chapitre et laisse le mot
// « Chapitre » à l'en-tête du groupe, seul endroit où il est vrai.
//
// Les couronnes ne s'affichent qu'à partir de la première GAGNÉE : trois
// couronnes éteintes sur chacune des 28 lignes, c'est un mur d'échecs pour
// quelqu'un qui n'a encore rien fait de mal.
export default function ChapterItem({
  chapter,
  resumeLabel = null,
  rank = null,
  open = false,
  supports = null,
  loading = false,
  onToggle,
}: {
  chapter: ChapterRow
  resumeLabel?: string | null
  rank?: number | null
  /** La fiche est dépliée : ses supports sont montrés dessous. */
  open?: boolean
  /** Les supports chargés, ou null tant qu'on ne les a jamais demandés. */
  supports?: SupportChip[] | null
  loading?: boolean
  onToggle: () => void
}) {
  const started = chapter.status !== 'non_commence'
  const panneau = `fiche-${chapter.id}`
  // Le rang affiché : celui du programme quand la liste est rangée sous ses
  // chapitres, sinon la position dans la matière.
  const numero = rank ?? chapter.position

  return (
    <div
      className={cn(
        'rounded-2xl border bg-card shadow-sm transition-shadow',
        open ? 'shadow-md' : null,
        resumeLabel ? 'border-highlight ring-2 ring-highlight/40' : null,
      )}
    >
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onToggle()
      }}
      aria-expanded={open}
      aria-controls={panneau}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-2xl text-left transition-transform active:scale-[0.99]',
        // Une ligne encore vierge n'a rien à raconter : elle se fait discrète
        // pour laisser respirer celles qui portent un vrai avancement.
        started ? 'p-4' : 'px-4 py-3',
      )}
    >
      {/* LE NUMÉRO DE LA FICHE — écrit en Baloo 2 dans sa pastille violet
          pâle. Il a été PEINT un temps (une illustration par nombre, 1 à 19,
          `public/images/chiffres/`) : les chiffres dorés à contour prune
          pesaient plus lourd que l'en-tête du chapitre au-dessus d'eux, et
          Lucas a demandé le retour aux chiffres écrits, pour toutes les
          matières, tous les chapitres et toutes les classes (04/09/2026). La
          pastille de largeur fixe garde les titres alignés d'une ligne à
          l'autre.

          LA FICHE TERMINÉE porte SA pastille pleine : ce n'est plus un numéro
          qu'elle affiche mais une coche — un état, pas un rang. */}
      {chapter.status === 'complete' ? (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground',
            started ? 'size-11' : 'size-9',
          )}
          aria-hidden="true"
        >
          <Check className="size-5.5" strokeWidth={3} />
        </span>
      ) : (
        <span
          className={cn(
            'font-heading flex shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary',
            started ? 'size-11 text-lg' : 'size-9 text-base',
          )}
          aria-hidden="true"
        >
          {numero}
        </span>
      )}

      <span className="min-w-0 flex-1">
        {chapter.examHint ? (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold',
              chapter.examHint.proximity === 'imminent'
                ? 'bg-destructive text-white'
                : 'bg-highlight text-foreground',
            )}
          >
            <Timer className="size-3" aria-hidden="true" />
            {chapter.examHint.label}
          </span>
        ) : null}
        {/* LE TITRE, NU. Il portait « Chapitre 3 · » en préfixe sur les listes
            à plat. Ce numéro promettait un ORDRE que personne ne suit : le
            professeur traite le programme dans la progression qu'il choisit, et
            l'élève qui commence par le dernier chapitre n'est pas en retard de
            sept. Il volait en plus la place du titre, seul mot qui dise ce
            qu'on va réviser. La règle valait déjà pour la philosophie, dont le
            programme est une liste de notions ; elle vaut en fait pour toutes
            les matières. */}
        <span className="block font-semibold text-balance">{chapter.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-muted-foreground">
          {chapter.minutes !== null ? (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {minutesLabel(chapter.minutes)}
            </span>
          ) : null}
          {/* Les couronnes n'apparaissent qu'une fois la première décrochée. */}
          {chapter.crowns > 0 ? (
            <span
              className="inline-flex items-center gap-0.5"
              role="img"
              aria-label={`${chapter.crowns} couronne${chapter.crowns > 1 ? 's' : ''} sur ${CROWN_THRESHOLDS.length}`}
            >
              {CROWN_THRESHOLDS.map((threshold, i) => (
                <Crown
                  key={threshold}
                  className={cn(
                    'size-3.5',
                    i < chapter.crowns
                      ? 'fill-highlight text-highlight'
                      : 'text-foreground/20',
                  )}
                  aria-hidden="true"
                />
              ))}
            </span>
          ) : null}
          {started ? <span>{STATUS_LABELS[chapter.status]}</span> : null}
        </span>
      </span>

      {/* LE « + » : la même cible sur toutes les lignes, qui pivote en croix
          une fois dépliée. Il remplace le bouton « Commencer » — un bouton-texte
          promettait une page, celui-ci promet ce qu'il fait : ouvrir la fiche
          sur place. La fiche à reprendre le porte en JAUNE : le repère de
          reprise survit au changement de geste. */}
      <span
        aria-hidden="true"
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full transition-all duration-200',
          open ? 'rotate-45' : null,
          resumeLabel
            ? 'border-b-4 border-b-black/20 bg-highlight text-foreground'
            : 'bg-primary/10 text-primary',
        )}
      >
        <Plus className="size-5" strokeWidth={3} />
      </span>
    </button>

    {open ? (
      /* LE DÉPLIÉ, À MÊME LA FICHE. Pas de bandeau teinté : un bloc beige
         dans un bloc blanc fait deux cartes empilées là où il n'y a qu'une
         fiche. Les supports prennent TOUTE la largeur de la carte — c'est ce
         qui donne à chaque icône la place de respirer — et un filet d'un pixel
         suffit à les séparer du titre. L'ouverture est ANIMÉE (200 ms) pour que
         la liste ne saute pas. */
      <div
        id={panneau}
        className="animate-in fade-in slide-in-from-top-2 mx-3 mb-3 border-t border-black/5 pt-2.5 duration-200 motion-reduce:animate-none"
      >
        {loading || supports === null ? (
          <SupportsSquelette />
        ) : supports.length === 0 ? (
          <p className="py-2 text-center text-xs font-semibold text-muted-foreground">
            Cette fiche n’a pas encore de contenu.
          </p>
        ) : (
          /* `fiche` : le cours en tête, les autres en raccourcis dessous. Ni
             `grid` (cinq tuiles carrées poussaient la fiche suivante à un écran
             de distance) ni `row` (cinq pastilles égales qu'il fallait relire
             en entier pour retrouver par où commencer). */
          <SupportChips
            chips={supports}
            layout="fiche"
            label={`Supports de ${chapter.title}`}
          />
        )}
      </div>
    ) : null}
    </div>
  )
}

/**
 * L'attente, en tuiles grises à la place exacte des vraies.
 *
 * Un simple tourniquet aurait fait sauter la liste deux fois : une fois pour
 * l'ouvrir, une fois quand les tuiles arrivent. Ici la place est réservée du
 * premier rendu — c'est la même grille, aux mêmes dimensions.
 */
function SupportsSquelette() {
  // La FORME de ce qui arrive, pas un tourniquet : cinq colonnes à la place
  // exacte des vraies. Réservée dès le premier rendu, la liste ne saute pas
  // quand les icônes arrivent.
  return (
    <div
      className="flex flex-col gap-2.5"
      role="status"
      aria-label="Chargement des supports"
    >
      <span className="grid grid-cols-5 gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="flex h-[68px] animate-pulse flex-col items-center justify-center gap-1.5 motion-reduce:animate-none"
          >
            <span className="size-11 rounded-2xl bg-muted" />
            <span className="h-2 w-10 rounded-full bg-muted" />
          </span>
        ))}
      </span>
    </div>
  )
}
