'use client'

import Image from 'next/image'
import { aEncaisser, coffreDuJourPret } from '@/lib/quests'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { ouvrirFeuilleQuetes, useQuetesDuJour } from './store'

const R = 19
const TOUR = 2 * Math.PI * R

/**
 * LES QUÊTES DU JOUR, DANS LE BANDEAU (03/10/2026, Lucas : « les quêtes
 * journalières sont centrales, on ne veut pas les rater » ; maquette « D ·
 * Lavande douce »). Le parchemin dans un disque, cerclé d'un anneau en TROIS
 * TRONÇONS — un par quête, doré quand elle est faite — et un point corail
 * quand il y a quelque chose à encaisser. Un toucher ouvre la feuille
 * (FeuilleQuetes). Rien tant que les quêtes ne sont pas lues.
 */
export default function PastilleQuetes({ dark = false }: { dark?: boolean }) {
  const etat = useQuetesDuJour()
  if (!etat || etat.quetes.length === 0) return null
  const total = etat.quetes.length
  const faites = etat.quetes.filter((q) => q.done).length
  const du = aEncaisser(etat).length > 0 || coffreDuJourPret(etat)
  const troncon = TOUR / total
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        ouvrirFeuilleQuetes()
      }}
      aria-haspopup="dialog"
      aria-label={`Quêtes du jour : ${faites} sur ${total}${du ? ', une récompense à encaisser' : ''}`}
      className={cn(
        'pointer-events-auto relative grid size-11 shrink-0 place-items-center rounded-full transition active:scale-95',
        dark ? 'olympe-glass' : 'bg-card shadow-sm',
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
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${troncon - 6} ${TOUR}`}
            strokeDashoffset={-i * troncon}
            style={{ stroke: q.done ? 'var(--highlight)' : dark ? 'rgb(255 255 255 / 0.2)' : 'var(--secondary)' }}
          />
        ))}
      </svg>
      <Image
        src="/images/defi/icones/quetes-v3.webp"
        alt=""
        aria-hidden="true"
        width={72}
        height={72}
        className="size-7 object-contain"
      />
      {du ? (
        <span
          aria-hidden="true"
          className={cn('absolute -top-0.5 -right-0.5 size-3 rounded-full bg-destructive ring-2', dark ? 'ring-black/40' : 'ring-background')}
        />
      ) : null}
    </button>
  )
}
