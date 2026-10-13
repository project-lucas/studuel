'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'
import BossSheet from '@/components/defi/BossSheet'
import SheetShell from '@/components/defi/SheetShell'
import { bossById, FALLBACK_BOSS } from '@/lib/bosses'
import type { TraqueCard } from '@/lib/traque'

/**
 * L'APERÇU DU POP-UP DE LA TRAQUE — développement seulement, sans compte ni
 * lecture : cinq gardiens de démonstration dans l'enveloppe réelle
 * (`SheetShell format="popup"`), ouverte à l'arrivée, à rouvrir d'un bouton.
 */
export type EtatApercuTraque = 'defaut' | 'vide'

function carte(
  bossId: string,
  subject: string,
  subjectSlug: string,
  points: number,
  extra: Partial<TraqueCard> = {},
): TraqueCard {
  const boss = bossById(bossId) ?? FALLBACK_BOSS
  const percent = Math.min(100, points)
  return {
    boss,
    subject,
    subjectSlug,
    status: 'traque',
    points,
    ratio: percent / 100,
    percent,
    rank: 1,
    attempts: 0,
    enChasse: false,
    backOn: 'mercredi',
    remainingMs: 0,
    endsAt: null,
    hint: '',
    xp: 30,
    ...extra,
  }
}

const DANS_42_MIN = 42 * 60_000

export function cartesDemo(): TraqueCard[] {
  return [
    carte('grammatork', 'Français', 'francais', 100, {
      status: 'debusque',
      rank: 2,
      remainingMs: DANS_42_MIN,
      endsAt: Date.now() + DANS_42_MIN,
      backOn: null,
      xp: 60,
    }),
    carte('plasma', 'Physique-Chimie', 'physique-chimie', 20, {
      enChasse: true,
      backOn: null,
      xp: 90,
    }),
    carte('nox', "l'Ombre du Bulletin", '', 52, { backOn: 'samedi', xp: 90 }),
    carte('chronos', 'HGGSP', 'hggsp', 50),
    carte('bigben', 'Anglais', 'anglais', 100, {
      status: 'debusque',
      remainingMs: 0,
      endsAt: Date.now() - 60_000,
    }),
  ]
}

export default function ApercuTraque({ etat }: { etat: EtatApercuTraque }) {
  const [ouverte, setOuverte] = useState(true)
  const cards = etat === 'vide' ? [] : cartesDemo()

  return (
    <>
      <button
        type="button"
        onClick={() => setOuverte(true)}
        className="olympe-press inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 font-heading text-sm font-extrabold text-primary-foreground"
      >
        Ouvrir la Traque
      </button>
      <AnimatePresence>
        {ouverte ? (
          <SheetShell
            label="La Traque"
            reduce={false}
            format="popup"
            onClose={() => setOuverte(false)}
            header={
              <>
                <Image
                  src="/images/defi/icones/boss-v3.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0 object-contain"
                  aria-hidden
                />
                <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-foreground">
                  La Traque
                </h2>
              </>
            }
          >
            <BossSheet cards={cards} />
          </SheetShell>
        ) : null}
      </AnimatePresence>
    </>
  )
}
