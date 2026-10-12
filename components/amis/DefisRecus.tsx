'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import { Button } from '@/components/ui/button'
import { releverDefi } from '@/app/amis/defi-actions'
import { lienDirect, type DefiRecu } from '@/lib/amis/defi-ami'
import { epreuve, formatScore } from '@/lib/palmares/epreuves'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'

/**
 * « LÉA TE DÉFIE ! » — les défis qu'on m'a lancés, en tête de l'onglet Amis
 * (05/10/2026, migration 558). « Relever » pose le défi en cours et m'emmène
 * sur le mode que Léa a choisi ; mon score s'y déposera en fin de partie.
 */
export default function DefisRecus({ defis }: { defis: readonly DefiRecu[] }) {
  const router = useRouter()
  const [enCours, setEnCours] = useState<string | null>(null)
  const [, start] = useTransition()
  if (defis.length === 0) return null

  const relever = (d: DefiRecu) => {
    if (enCours || !d.mode) return
    sfx.tap()
    setEnCours(d.id)
    const mode = d.mode
    start(async () => {
      const r = await releverDefi(d.id)
      if (!r.ok) {
        setEnCours(null)
        toast('Ce défi n’est plus ouvert.', 'error')
        return
      }
      router.push(lienDirect(mode))
    })
  }

  return (
    <section aria-label="Défis reçus" data-teinte="bleu" className="flex flex-col gap-2">
      {defis.map((d) => (
        <article key={d.id} className="carte flex items-center gap-3 p-3 ring-2 ring-[var(--outil)]">
          <span className="relative shrink-0">
            <PortraitJoueur id={d.de} portrait={d.portrait} className="size-12" />
            <Image
              src="/images/amis/defier.webp"
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              className="absolute -right-2.5 -bottom-2 size-7 select-none"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading truncate text-base leading-tight font-extrabold">{d.nom} te défie !</p>
            <p className="truncate text-xs font-semibold text-muted-foreground">
              {d.mode ? epreuve(d.mode).nom : 'Défi du jour'}
              {d.mode && d.sonScore !== null ? ` · son score : ${formatScore(d.mode, d.sonScore)}` : ' · à toi de jouer'}
            </p>
          </div>
          <Button type="button" size="sm" disabled={!d.mode || enCours !== null} onClick={() => relever(d)}>
            Relever
          </Button>
        </article>
      ))}
    </section>
  )
}
