'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown, Crown, Info, ListChecks, Lock } from 'lucide-react'
import AnneauProgression from '@/components/reviser/AnneauProgression'
import ChapterProgressBar from '@/components/reviser/ChapterProgressBar'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  phraseAccesQuiz,
  type AccesQuizChapitre,
  type ChapterStatus,
  type SubjectProgress,
} from '@/lib/subject-template'

/** L'état d'un chapitre du programme, tel que sa carte le porte (`data-etat`). */
export type EtatChapitre = 'vierge' | 'entame' | 'termine'

export function etatChapitre(avancement: SubjectProgress): EtatChapitre {
  if (avancement.total > 0 && avancement.done >= avancement.total) return 'termine'
  return avancement.pct > 0 ? 'entame' : 'vierge'
}

/** Au-delà, les pastilles d'une fiche par fiche deviennent un tapis : la barre reprend. */
export const MAX_PIPS = 24

/**
 * LA ROBE DE LA CARTE D'UN CHAPITRE — LA PLAQUE VIOLETTE, pour tous.
 *
 * Elle a dit l'effort par la couleur : carte crème vierge, cernée de jaune
 * une fois entamée, VIOLET plein une fois finie. Lucas a choisi la plaque
 * violette pour TOUS les chapitres (16/09/2026, « je veux ce style pour mes
 * chapitres ») : texte blanc, dégradé, socle sombre, quadrillage en filigrane
 * — la plaque de l'examen blanc et des boutons d'action. Trois cartes
 * violettes empilées font un programme qui a de la tenue, là où une crème,
 * une jaune et une violette faisaient trois objets différents.
 *
 * L'ÉTAT NE SE PERD PAS, il change de porteur : le médaillon (anneau du
 * pourcentage, ou disque d'or à la couronne une fois fini), les pastilles
 * (blanches à 25 % éteintes, jaunes en marche, or pleines terminées) et le
 * compte (« 2/2 fiches · Terminé »). `data-etat` reste posé sur la carte.
 */
const PLAQUE =
  'border-transparent border-b-4 border-b-black/25 bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] text-white shadow-md'
export const ROBES: Record<EtatChapitre, string> = {
  vierge: PLAQUE,
  entame: PLAQUE,
  termine: PLAQUE,
}

/**
 * LE QUIZ DU CHAPITRE, avec sa bulle d'explication.
 *
 * Deux choses à faire comprendre d'un coup d'œil, et c'est pour ça que ce
 * bouton existe séparément :
 *   1. ce quiz-là est GLOBAL — il reprend toutes les fiches du chapitre, quand
 *      celui d'une fiche ne porte que sur elle ;
 *   2. il s'OUVRE — après avoir testé chaque fiche au moins une fois.
 *
 * Le (i) ouvre une bulle qui le dit en toutes lettres, avec ce qui reste à
 * faire. Fermée au clic ailleurs et à Échap : sur un téléphone, une bulle
 * qu'on ne sait pas fermer est une bulle qui reste.
 */
function QuizDuChapitre({
  titre,
  href,
  acces,
}: {
  titre: string
  href: string
  acces: AccesQuizChapitre
}) {
  const [ouverte, setOuverte] = useState(false)
  const bulleId = useId()
  const boite = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ouverte) return
    const dehors = (e: PointerEvent) => {
      if (!boite.current?.contains(e.target as Node)) setOuverte(false)
    }
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuverte(false)
    }
    document.addEventListener('pointerdown', dehors)
    document.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('pointerdown', dehors)
      document.removeEventListener('keydown', echap)
    }
  }, [ouverte])

  const label = 'Quiz du chapitre'
  const plaque =
    'inline-flex items-center gap-1.5 rounded-full border-b-[3px] px-3 py-2 text-[13px] font-extrabold transition-transform sm:text-sm'

  return (
    <div ref={boite} className="relative flex shrink-0 items-center gap-1">
      {acces.debloque ? (
        <Link
          href={href}
          onClick={() => sfx.tap()}
          aria-label={`${label} ${titre}`}
          className={cn(
            plaque,
            'border-b-black/30 bg-highlight text-foreground hover:-translate-y-px active:translate-y-[2px] active:border-b-0',
          )}
        >
          <ListChecks className="size-4.5" strokeWidth={2.75} aria-hidden="true" />
          {label}
        </Link>
      ) : (
        /* Fermé : un bouton, pas un lien mort — il explique au lieu de ne rien
           faire (une porte qui ne s'ouvre pas sans un mot, le projet l'a déjà
           refusé ailleurs). */
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOuverte((v) => !v)
          }}
          aria-expanded={ouverte}
          aria-controls={bulleId}
          className={cn(plaque, 'border-b-black/20 bg-white/15 text-white/75')}
        >
          <Lock className="size-4" strokeWidth={2.75} aria-hidden="true" />
          {label}
        </button>
      )}

      <button
        type="button"
        onClick={() => setOuverte((v) => !v)}
        aria-expanded={ouverte}
        aria-controls={bulleId}
        aria-label={`À quoi sert le quiz du chapitre ${titre} ?`}
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
      >
        <Info className="size-4" strokeWidth={2.75} aria-hidden="true" />
      </button>

      {ouverte ? (
        <div
          id={bulleId}
          role="note"
          className="bg-background text-foreground absolute top-full right-0 z-30 mt-2 w-64 rounded-2xl p-3 text-left text-[13px] leading-snug font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.25)] ring-1 ring-black/10"
        >
          <p className="font-heading text-sm font-extrabold">{label}</p>
          <p className="mt-1">
            Il reprend <strong>toutes les fiches du chapitre</strong> d’un coup, en
            conditions de contrôle — les quiz au-dessous, eux, ne portent que sur
            leur fiche.
          </p>
          <p className="text-muted-foreground mt-1.5">
            Il s’ouvre quand chaque fiche a été testée au moins une fois.{' '}
            {phraseAccesQuiz(acces)}
          </p>
        </div>
      ) : null}
    </div>
  )
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
  accesQuiz,
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
  /** Où en est l'élève de son ouverture (lib/subject-template.accesQuizChapitre). */
  accesQuiz: AccesQuizChapitre
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
        /* Sur la plaque violette, l'anneau se dessine en blanc : rail blanc à
           25 %, jauge jaune, chiffre blanc — en retrait tant que rien n'est
           commencé. */
        <AnneauProgression
          pct={avancement.pct}
          size={56}
          className={cn(
            'text-[13px]',
            etat === 'vierge' ? 'text-white/70' : 'text-white',
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
                'size-5 text-white/70 transition-transform',
                deplie ? 'rotate-180' : null,
              )}
            />
          </button>
        </div>

        {cherche ? (
          /* Sous recherche, le bloc ne contient que des trouvailles : une
             jauge y parlerait d'un autre chapitre. Juste le compte. */
          fiches.length === 0 ? null : (
            <span className="block text-xs font-semibold text-white/80 tabular-nums">
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
                  {/* Une pastille par fiche, sur la plaque : éteinte (blanc à
                      25 %), en marche (jaune à 55 %), terminée (or plein). */}
                  {fiches.map((f, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-2.5 w-5 rounded-full transition-colors',
                        f.status === 'complete'
                          ? 'bg-highlight'
                          : f.status === 'en_cours'
                            ? 'bg-highlight/55'
                            : 'bg-white/25',
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
                  sombre
                  className="mt-0"
                />
              )}
              {pips ? (
                <span className="mt-1.5 block text-xs font-bold text-white/80 tabular-nums">
                  {avancement.done}/{avancement.total} {unit}
                  {avancement.total > 1 ? 's' : ''}
                  {termine ? ' · Terminé' : null}
                </span>
              ) : null}
            </div>
            {/* LE QUIZ DU CHAPITRE, en plaque D'OR : sur une carte violette, le
                violet ne ressort pas — l'or, si (la dérogation de l'arène, cf.
                CLAUDE.md). Il DIT son nom en entier : « Quiz » tout court se
                confondait avec le quiz d'une fiche, juste en dessous. Fermé, il
                passe en plaque éteinte, cadenassée. */}
            {quizHref ? (
              <QuizDuChapitre titre={titre} href={quizHref} acces={accesQuiz} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
