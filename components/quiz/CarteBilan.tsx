'use client'

import { useState, type ReactNode } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

/**
 * UNE CASE DE BILAN de l'écran de fin.
 *
 * C'est la carte « Réussite » du bloc des trois lectures, remontée en tête
 * d'écran et généralisée aux deux autres cases. Elle a gagné contre la boîte à
 * bandeau de couleur (façon Duolingo) parce qu'elle porte trois choses de plus,
 * et chacune sert :
 *
 *   · une PASTILLE d'icône teintée, qui dit le sujet avant le mot ;
 *   · un « i » qui explique ce que le chiffre mesure — sans lui, « ancrage »
 *     n'était qu'un mot, et « justesse » n'en est pas beaucoup plus ;
 *   · une JAUGE sous le nombre, pour les valeurs qui vont de 0 à 100 : un
 *     pourcentage se compare à son plein bien plus vite en barre qu'en chiffres.
 *
 * Les teintes sont des rôles de la DA, pas des couleurs choisies ici : `success`
 * pour la réussite, `primary` pour l'effort (temps, série), `highlight` pour le
 * gain.
 */
export type TonBilan = 'gain' | 'effort' | 'reussite'

const TONS: Record<TonBilan, { pastille: string; chiffre: string; barre: string }> =
  {
    gain: {
      pastille:
        'bg-highlight/25 text-[color-mix(in_oklch,var(--highlight),black_25%)]',
      // Le jaune solaire pur ne passe pas le contraste en TEXTE sur du clair :
      // on le fonce pour le chiffre seulement. Même or, lisible.
      chiffre: 'text-[color-mix(in_oklch,var(--highlight),black_20%)]',
      barre: 'bg-highlight',
    },
    effort: {
      pastille: 'bg-primary/12 text-primary',
      chiffre: 'text-primary',
      barre: 'bg-primary',
    },
    reussite: {
      pastille: 'bg-success/15 text-success',
      chiffre: 'text-success',
      barre: 'bg-success',
    },
  }

export default function CarteBilan({
  ton,
  titre,
  aide,
  icone,
  jauge,
  children,
  ref,
}: {
  ton: TonBilan
  /** Le nom de la lecture, court : la case fait un tiers de la largeur. */
  titre: string
  /** Ce que le chiffre mesure, déplié par le « i ». */
  aide: string
  /** L'icône de la pastille, déjà dimensionnée par l'appelant. */
  icone: ReactNode
  /**
   * Le remplissage de la jauge, en pourcentage. Absent = pas de barre : une
   * durée ou une série n'ont pas de plein auquel se comparer, et une barre à
   * ras bord sous « 4 min » ne voudrait rien dire.
   */
  jauge?: number
  /** La valeur, en grand. */
  children: ReactNode
  /** La case de gain sert de point de DÉPART au vol des jetons. */
  ref?: React.Ref<HTMLLIElement>
}) {
  const [ouvert, setOuvert] = useState(false)
  const t = TONS[ton]

  return (
    <li
      ref={ref}
      // `flex-1` et non une colonne de grille : la rangée n'a pas toujours
      // trois cases (un quiz de la bibliothèque n'enregistre rien, donc ni
      // gain ni temps). En grille, la seule case restante aurait gardé son
      // tiers de largeur, collée à gauche.
      className="flex min-w-0 flex-1 flex-col rounded-2xl bg-card p-2.5 text-left ring-1 ring-black/5"
    >
      <div className="flex items-start gap-1.5">
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full',
            t.pastille,
          )}
          aria-hidden="true"
        >
          {icone}
        </span>
        <span className="font-heading min-w-0 flex-1 text-[11px] leading-tight font-extrabold text-foreground">
          {titre}
        </span>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOuvert((o) => !o)
          }}
          aria-expanded={ouvert}
          aria-label={`Que veut dire « ${titre} » ?`}
          className="-mt-0.5 -mr-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground/60 transition hover:text-foreground"
        >
          <Info className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div
        className={cn(
          'font-heading mt-1.5 flex flex-wrap items-baseline gap-x-1.5 text-3xl leading-none font-extrabold tabular-nums',
          t.chiffre,
        )}
      >
        {children}
      </div>

      {/* `mt-auto` : la jauge se colle au BAS de la case. Les cases sont
          étirées à la même hauteur par la rangée ; sans ça, la seule qui porte
          une barre l'aurait posée à mi-hauteur, sous un nombre plus court. */}
      {jauge === undefined ? null : (
        <div
          className="mt-auto pt-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(jauge)}
          aria-label={titre}
        >
          <div className="h-1 overflow-hidden rounded-full bg-black/5">
            <div
              className={cn('h-full rounded-full transition-all', t.barre)}
              // Un filet minimal à partir du premier pour cent : une barre vide
              // et une barre à 1 % doivent se distinguer.
              style={{ width: `${Math.max(jauge, jauge > 0 ? 3 : 0)}%` }}
            />
          </div>
        </div>
      )}

      {ouvert ? (
        <p className="mt-2 text-[10px] leading-snug text-pretty text-muted-foreground">
          {aide}
        </p>
      ) : null}
    </li>
  )
}
