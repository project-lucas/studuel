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
 * lecture : des gardiens de démonstration dans l'enveloppe réelle
 * (`SheetShell format="popup"`), ouverte à l'arrivée, à rouvrir d'un bouton.
 *
 * Un état par affiche (25/10/2026) : `debusque` (sorti, 42 min), `chasse`
 * (en chasse à 40 %), `indisponible` (pas son jour), `expire` (recouché, la
 * jauge à la moitié), `vide`, et `defaut` qui les montre tous.
 */
export type EtatApercuTraque = 'defaut' | 'vide' | 'debusque' | 'chasse' | 'indisponible' | 'expire'

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
    enChasse: true,
    backOn: null,
    remainingMs: 0,
    endsAt: null,
    hint: '',
    xp: 30,
    gemmes: 5,
    ...extra,
  }
}

const DANS_42_MIN = 42 * 60_000

const DEBUSQUE = () =>
  carte('grammatork', 'Français', 'francais', 100, {
    status: 'debusque',
    rank: 2,
    remainingMs: DANS_42_MIN,
    endsAt: Date.now() + DANS_42_MIN,
    xp: 45,
    gemmes: 8,
  })
/** En chasse à 40 % : cours et quiz tenus pour faits, il reste les cartes. */
const CHASSE = () => carte('plasma', 'Physique-Chimie', 'physique-chimie', 40)
/** En chasse, à peine entamé : les trois gestes à faire. */
const ENTAME = () => carte('chronos', 'HGGSP', 'hggsp', 8)
// INDISPONIBLES aujourd'hui (576) : le ruban sur la scène, pas de jauge.
const NOX = () =>
  carte('nox', "l'Ombre du Bulletin", '', 0, {
    status: 'indisponible',
    enChasse: false,
    backOn: 'dimanche',
    hint: 'Revient dimanche',
    xp: 90,
    gemmes: 20,
  })
const INDISPONIBLE = () =>
  carte('mitochondrix', 'SVT', 'svt', 0, {
    status: 'indisponible',
    enChasse: false,
    backOn: 'jeudi',
    hint: 'Revient jeudi',
    rank: 3,
    xp: 60,
    gemmes: 10,
  })
/** Recouché plus tôt dans la journée : la jauge repart de la moitié. */
const EXPIRE = () => carte('bigben', 'Anglais', 'anglais', 50, { status: 'expire' })

export function cartesDemo(etat: EtatApercuTraque = 'defaut'): TraqueCard[] {
  switch (etat) {
    case 'vide':
      return []
    case 'debusque':
      return [DEBUSQUE()]
    case 'chasse':
      return [CHASSE()]
    case 'indisponible':
      return [INDISPONIBLE()]
    case 'expire':
      return [EXPIRE()]
    default:
      return [DEBUSQUE(), CHASSE(), NOX(), ENTAME(), INDISPONIBLE(), EXPIRE()]
  }
}

export default function ApercuTraque({ etat }: { etat: EtatApercuTraque }) {
  const [ouverte, setOuverte] = useState(true)
  const cards = cartesDemo(etat)

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
