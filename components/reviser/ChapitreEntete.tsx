'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown, Crown, ListChecks } from 'lucide-react'
import AnneauProgression from '@/components/reviser/AnneauProgression'
import ChapterProgressBar from '@/components/reviser/ChapterProgressBar'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { ChapterStatus, SubjectProgress } from '@/lib/subject-template'

/** L'état d'un chapitre du programme, tel que sa carte le porte (`data-etat`). */
export type EtatChapitre = 'vierge' | 'entame' | 'termine'

export function etatChapitre(avancement: SubjectProgress): EtatChapitre {
  if (avancement.total > 0 && avancement.done >= avancement.total) return 'termine'
  return avancement.pct > 0 ? 'entame' : 'vierge'
}

/** Au-delà, les pastilles d'une fiche par fiche deviennent un tapis : la barre reprend. */
export const MAX_PIPS = 24

/**
 * LA ROBE DE LA CARTE D'UN CHAPITRE — ce qui l'habille selon son état.
 *
 * Vierge : la carte crème du dossier, telle quelle. Entamée : la même carte,
 * cernée de jaune solaire (la couleur de la progression dans toute l'app).
 * Terminée : la carte passe au VIOLET plein, texte blanc, socle sombre — la
 * même plaque que l'examen blanc et les boutons d'action. Un chapitre fini
 * n'est plus une ligne de programme, c'est un trophée sur l'étagère.
 */
export const ROBES: Record<EtatChapitre, string> = {
  vierge: 'rev-card border bg-card',
  entame: 'rev-card border border-highlight/70 bg-card ring-2 ring-highlight/35',
  termine:
    'border-transparent border-b-4 border-b-black/25 bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] text-white shadow-md',
}

/**
 * L'EN-TÊTE D'UN CHAPITRE DU PROGRAMME — la carte qu'on voit avant de déplier.
 *
 * Elle a été un titre en gras sur une barre fine : quatre cartes identiques,
 * que des heures de travail ne changeaient pas. Elle porte maintenant, de
 * gauche à droite :
 *
 *   · un MÉDAILLON — l'anneau du pourcentage, comme celui du header, en plus
 *     petit ; une fois le chapitre fini, un disque d'or à la couronne ;
 *   · le TITRE, seul, en Baloo — et dessous, UNE PASTILLE PAR FICHE :
 *     éteinte, jaune (entamée), violette (terminée). Six pastilles disent
 *     « six fiches, deux faites » avant même qu'on ait lu le compte ;
 *   · le QUIZ du chapitre, en plaque violette (or sur une carte finie) ;
 *   · le CHEVRON, à sa place.
 *
 * Le titre est LE bouton qui plie et déplie ; le quiz est un lien VOISIN, pas
 * un enfant — un lien dans un bouton n'existe pas.
 */
export default function ChapitreEntete({
  titre,
  cle,
  fiches,
  avancement,
  unit,
  deplie,
  onToggle,
  quizHref,
  cherche,
  loupe = null,
}: {
  titre: string
  /** Clé du bloc (`aria-controls`). */
  cle: string
  /** Les fiches du chapitre, dans l'ordre — pour les pastilles. */
  fiches: { status: ChapterStatus }[]
  avancement: SubjectProgress
  unit: 'fiche' | 'chapitre'
  deplie: boolean
  onToggle: () => void
  /** L'adresse du quiz du chapitre, ou `null` s'il n'en a pas. */
  quizHref: string | null
  /** Sous recherche : ni médaillon, ni pastilles, ni quiz — le compte des trouvailles. */
  cherche: boolean
  /** La loupe, sur le bloc unique qui la porte. */
  loupe?: ReactNode
}) {
  const etat = etatChapitre(avancement)
  const termine = etat === 'termine'
  const pips = fiches.length > 0 && fiches.length <= MAX_PIPS

  return (
    <div className="flex items-center gap-3.5">
      {/* LE MÉDAILLON */}
      {cherche ? null : termine ? (
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-full bg-highlight text-foreground shadow-[0_3px_0_rgba(0,0,0,0.25)] ring-4 ring-white/25"
        >
          <Crown className="size-7 fill-current" strokeWidth={2.25} />
        </span>
      ) : (
        <AnneauProgression
          pct={avancement.pct}
          size={56}
          className={cn(
            'text-[13px]',
            etat === 'vierge' ? 'text-muted-foreground' : 'text-foreground',
          )}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {/* Le titre plie et déplie le bloc. La loupe et le quiz sont ses
              VOISINS, pas ses enfants. */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={deplie}
            aria-controls={`bloc-${cle}`}
            className="min-w-0 flex-1 cursor-pointer py-1 text-left"
          >
            {/* Le titre du chapitre, SEUL, sans numéro : chaque professeur
                suit l'ordre qu'il choisit. */}
            <span className="font-heading block text-xl leading-tight font-bold text-balance">
              {titre}
            </span>
          </button>
          {loupe}
          {/* Le chevron : jumeau visuel du titre, muet pour les lecteurs
              d'écran qui ne doivent pas entendre deux fois le même pli. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onToggle}
            className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-full"
          >
            <ChevronDown
              className={cn(
                'size-5 transition-transform',
                termine ? 'text-white/70' : 'text-muted-foreground',
                deplie ? 'rotate-180' : null,
              )}
            />
          </button>
        </div>

        {cherche ? (
          /* Sous recherche, le bloc ne contient que des trouvailles : une
             jauge y parlerait d'un autre chapitre. Juste le compte. */
          fiches.length === 0 ? null : (
            <span className="block text-xs font-semibold text-muted-foreground tabular-nums">
              {fiches.length} {unit}
              {fiches.length > 1 ? 's' : ''}
            </span>
          )
        ) : (
          <div className="mt-1.5 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              {pips ? (
                <span
                  className="flex flex-wrap items-center gap-1.5"
                  aria-hidden="true"
                >
                  {fiches.map((f, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-2.5 w-5 rounded-full transition-colors',
                        f.status === 'complete'
                          ? termine
                            ? 'bg-highlight'
                            : 'bg-primary'
                          : f.status === 'en_cours'
                            ? 'bg-highlight'
                            : termine
                              ? 'bg-white/25'
                              : 'bg-black/10',
                      )}
                    />
                  ))}
                </span>
              ) : (
                <ChapterProgressBar
                  done={avancement.done}
                  total={avancement.total}
                  pct={avancement.pct}
                  unit={unit}
                  className="mt-0"
                />
              )}
              {pips ? (
                <span
                  className={cn(
                    'mt-1.5 block text-xs font-bold tabular-nums',
                    termine ? 'text-white/80' : 'text-muted-foreground',
                  )}
                >
                  {avancement.done}/{avancement.total} {unit}
                  {avancement.total > 1 ? 's' : ''}
                  {termine ? ' · Terminé' : null}
                </span>
              ) : null}
            </div>
            {/* LE QUIZ, en plaque : violette (l'action), or sur une carte
                finie où le violet ne ressortirait pas. */}
            {quizHref ? (
              <Link
                href={quizHref}
                onClick={() => sfx.tap()}
                aria-label={`Quiz du chapitre ${titre}`}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full border-b-[3px] px-3.5 py-2 text-sm font-extrabold transition-transform hover:-translate-y-px active:translate-y-[2px] active:border-b-0',
                  termine
                    ? 'border-b-black/30 bg-highlight text-foreground'
                    : 'border-b-black/25 bg-primary text-primary-foreground',
                )}
              >
                <ListChecks className="size-4.5" strokeWidth={2.75} aria-hidden="true" />
                Quiz
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
