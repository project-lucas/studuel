'use client'

import Image from 'next/image'
import { aEncaisser, coffreDuJourPret } from '@/lib/quests'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { ouvrirFeuilleQuetes, useQuetesDuJour } from './store'

const R = 19
const TOUR = 2 * Math.PI * R

/**
 * LES QUÊTES DU JOUR, EN ROND (03/10/2026, Lucas : « les quêtes journalières
 * sont centrales, on ne veut pas les rater »). Le parchemin dans un disque,
 * cerclé d'un anneau en TRONÇONS — un par quête, doré quand elle est faite.
 * Un toucher ouvre la feuille (FeuilleQuetes). Rien tant que les quêtes ne
 * sont pas lues.
 *
 * `grand` (15/10/2026, l'écusson central) : le grand rond de 64 px sous l'aile
 * droite du bandeau, et sous Classement sur l'arène — cerclé de violet sur
 * socle, le NOMBRE de récompenses à encaisser en pastille corail, « Quêtes »
 * écrit dessous. Sans `grand`, la petite pastille de 44 px et son point.
 */
export default function PastilleQuetes({ dark = false, grand = false }: { dark?: boolean; grand?: boolean }) {
  const etat = useQuetesDuJour()
  if (!etat || etat.quetes.length === 0) return null
  const total = etat.quetes.length
  const faites = etat.quetes.filter((q) => q.done).length
  const nbDus = aEncaisser(etat).length + (coffreDuJourPret(etat) ? 1 : 0)
  const troncon = TOUR / total
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        ouvrirFeuilleQuetes()
      }}
      aria-haspopup="dialog"
      aria-label={`Quêtes du jour : ${faites} sur ${total}${nbDus > 0 ? `, ${nbDus} à encaisser` : ''}`}
      className={cn(
        'pointer-events-auto relative shrink-0 transition active:scale-95',
        grand ? 'flex flex-col items-center' : 'grid size-11 place-items-center rounded-full',
        !grand && (dark ? 'olympe-glass' : 'bg-card shadow-sm'),
      )}
    >
      <span
        className={cn(
          'relative grid place-items-center rounded-full',
          grand
            ? 'size-16 bg-card shadow-[0_0_0_3px_var(--primary),0_5px_0_3px_color-mix(in_oklch,var(--primary),black_42%),0_12px_16px_-8px_color-mix(in_oklch,var(--primary),transparent_50%)]'
            : 'size-11',
        )}
      >
        <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true">
          {etat.quetes.map((q, i) => (
            <circle
              key={q.id}
              cx="22"
              cy="22"
              r={R}
              fill="none"
              strokeWidth={grand ? 3 : 3.5}
              strokeLinecap="round"
              strokeDasharray={`${troncon - 6} ${TOUR}`}
              strokeDashoffset={-i * troncon}
              style={{ stroke: q.done ? 'var(--highlight)' : dark && !grand ? 'rgb(255 255 255 / 0.2)' : 'var(--secondary)' }}
            />
          ))}
        </svg>
        <Image
          src="/images/defi/icones/quetes-v3.webp"
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          className={cn('object-contain', grand ? 'size-11' : 'size-7')}
        />
        {nbDus > 0 && grand ? (
          <span
            aria-hidden="true"
            className="font-heading absolute -top-1 -right-1 grid h-5.5 min-w-5.5 place-items-center rounded-full bg-destructive px-1.5 text-[13px] leading-none font-extrabold text-white tabular-nums ring-[2.5px] ring-card"
          >
            {nbDus}
          </span>
        ) : null}
        {nbDus > 0 && !grand ? (
          <span
            aria-hidden="true"
            className={cn('absolute -top-0.5 -right-0.5 size-3 rounded-full bg-destructive ring-2', dark ? 'ring-black/40' : 'ring-background')}
          />
        ) : null}
      </span>
      {grand ? (
        <span
          aria-hidden="true"
          className="font-heading relative -mt-2 rounded-full bg-primary px-2.5 py-0.5 text-[12px] leading-tight font-extrabold text-primary-foreground ring-2 ring-card"
        >
          Quêtes
        </span>
      ) : null}
    </button>
  )
}
