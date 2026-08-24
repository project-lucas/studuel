'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  libelleSerie,
  phraseSerie,
  type Celebration,
} from '@/lib/serie-celebration'
import { COMPANION_CELEBRATION_IMAGE, stageForStreak } from '@/lib/compagnon'

// Lundi → dimanche, en une lettre : c'est une bande de sept pastilles, pas un
// calendrier. Le jour complet vit dans l'`aria-label`.
const LETTRE = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const JOUR_ENTIER = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
]

/** Le temps mort avant que la case du jour ne se remplisse, en ms. */
const DELAI_REMPLISSAGE = 550

/**
 * LA CÉLÉBRATION DE SÉRIE — l'écran qui suit la première session du jour.
 *
 * La série se remplissait EN SILENCE : l'élève finissait son quiz, voyait son
 * score, et la case du lundi passait au vert quelque part derrière lui, sur un
 * écran qu'il ne regardait pas. Le principal mécanisme de rétention du produit
 * ne se voyait jamais au moment où il se déclenche.
 *
 * L'écran s'ouvre donc sur la semaine TELLE QU'ELLE ÉTAIT — case du jour vide —
 * puis la remplit sous les yeux de l'élève, avec le son. C'est tout le geste :
 * montrer le AVANT une demi-seconde, pour que le APRÈS soit un événement.
 *
 * Il n'apparaît qu'UNE FOIS PAR JOUR (`preparerCelebration` s'en assure) : à la
 * cinquième session, la même fête ne serait plus une récompense mais un
 * obstacle entre l'élève et le quiz suivant.
 */
export default function SerieCelebration({
  celebration,
  onContinue,
}: {
  celebration: Celebration
  onContinue: () => void
}) {
  // On démarre sur l'AVANT, puis on bascule : c'est ce décalage qui fait
  // l'animation. Sans lui, la case serait déjà verte à l'ouverture.
  const [rempli, setRempli] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setRempli(true)
      sfx.complete()
    }, DELAI_REMPLISSAGE)
    return () => window.clearTimeout(t)
  }, [])

  const jours = rempli ? celebration.apres : celebration.avant

  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background px-5 py-8">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 text-center">
        {/* La phrase, en bulle — elle change avec le palier. */}
        <p className="relative rounded-3xl border-2 border-black/10 bg-card px-5 py-3.5 text-base font-semibold text-balance text-foreground">
          {phraseSerie(celebration.serie)}
          <span
            aria-hidden="true"
            className="absolute -bottom-[9px] left-1/2 size-4 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-black/10 bg-card"
          />
        </p>

        {/* LA FLAMME DU COMPAGNON — celle de son palier, pas une icône.
            Le projet a ses six illustrations d'évolution (`lib/compagnon`) et
            une flamme de fête : les réutiliser garde une seule voix visuelle
            d'un bout à l'autre de l'app, et évite d'inventer un dessin de plus.
            Avant remplissage on montre le palier ATTEINT, après on bascule sur
            la célébration — le changement d'image fait partie de l'événement. */}
        <div className="flex items-center justify-center">
          <Image
            src={
              rempli
                ? COMPANION_CELEBRATION_IMAGE
                : stageForStreak(Math.max(0, celebration.serie - 1)).image
            }
            alt=""
            aria-hidden="true"
            width={512}
            height={512}
            sizes="176px"
            priority
            className={cn(
              'h-auto w-44 max-w-full transition-all duration-500',
              rempli ? 'scale-100' : 'scale-90 opacity-80',
            )}
          />
        </div>

        {/* LE COMPTE. `key` sur la valeur : quand elle change, React remonte le
            nœud et l'animation d'entrée rejoue — sinon le chiffre changerait
            sans que rien ne bouge. */}
        <p
          key={rempli ? 'apres' : 'avant'}
          className={cn(
            'font-heading text-6xl leading-none font-extrabold text-[#ff9500] tabular-nums transition-all duration-300',
            rempli ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
          aria-live="polite"
        >
          {libelleSerie(celebration.serie)}
        </p>

        {/* LA SEMAINE — sept pastilles, celle du jour se remplit. */}
        <ul className="flex w-full items-end justify-between gap-1">
          {jours.map((jour, i) => {
            const cestAujourdhui = i === celebration.indexDuJour
            const vientDeSeRemplir = cestAujourdhui && rempli
            return (
              <li key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    'text-xs font-extrabold transition-colors',
                    cestAujourdhui
                      ? 'text-[#ff9500]'
                      : 'text-muted-foreground/60',
                  )}
                >
                  {LETTRE[i]}
                </span>
                <span
                  role="img"
                  aria-label={`${JOUR_ENTIER[i]} — ${jour.done ? 'fait' : 'à faire'}`}
                  className={cn(
                    'flex aspect-square w-full max-w-9 items-center justify-center rounded-full transition-all duration-300',
                    jour.done
                      ? 'bg-[#ff9500] text-white'
                      : 'bg-muted text-transparent',
                    // Le petit sursaut du jour qu'on vient de cocher : c'est
                    // ce que l'élève est venu voir.
                    vientDeSeRemplir && 'scale-110 ring-4 ring-[#ff9500]/25',
                  )}
                >
                  <Check className="size-4" strokeWidth={3.5} aria-hidden="true" />
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* La sortie, en bas — sous le pouce, comme les réponses du quiz. */}
      <div className="mx-auto w-full max-w-sm pt-6">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onContinue()
          }}
          className="quiz-pilule h-12 w-full text-sm font-extrabold text-white [--pilule-bas:color-mix(in_oklab,var(--primary),black_6%)] [--pilule-bord:color-mix(in_oklab,var(--primary),black_32%)] [--pilule-haut:color-mix(in_oklab,var(--primary),white_8%)]"
        >
          Continuer
        </button>
      </div>
    </div>
  )
}
