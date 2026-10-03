'use client'

import Image from 'next/image'
import { aEncaisser, coffreDuJourPret } from '@/lib/quests'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { ouvrirFeuilleQuetes, useQuetesDuJour } from './store'

/**
 * LA PASTILLE DES QUÊTES DU JOUR, DANS LE BANDEAU (03/10/2026, Lucas : « les
 * quêtes journalières sont centrales, on ne veut pas les rater »). Le
 * parchemin des quêtes et « 1/3 » ; un point corail quand il y a quelque chose
 * à encaisser. Un toucher ouvre la feuille (FeuilleQuetes). Rien tant que les
 * quêtes ne sont pas lues (visiteur, réseau).
 */
export default function PastilleQuetes({ dark = false }: { dark?: boolean }) {
  const etat = useQuetesDuJour()
  if (!etat || etat.quetes.length === 0) return null
  const faites = etat.quetes.filter((q) => q.done).length
  const total = etat.quetes.length
  const du = aEncaisser(etat).length > 0 || coffreDuJourPret(etat)
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
        'pointer-events-auto relative flex h-10 shrink-0 items-center gap-0.5 rounded-full py-0.5 pr-2.5 pl-0.5 text-xs font-extrabold tabular-nums transition active:scale-95',
        dark ? 'olympe-glass text-white' : 'bg-card text-foreground shadow-sm ring-1 ring-black/[0.06]',
      )}
    >
      <Image
        src="/images/defi/icones/quetes-v3.webp"
        alt=""
        aria-hidden="true"
        width={72}
        height={72}
        className="size-8 object-contain"
      />
      {faites}/{total}
      {du ? (
        <span
          aria-hidden="true"
          className={cn('absolute -top-0.5 -right-0.5 size-3 rounded-full bg-destructive ring-2', dark ? 'ring-black/40' : 'ring-card')}
        />
      ) : null}
    </button>
  )
}
