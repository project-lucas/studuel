'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import ModeTicket from '@/components/defi/ModeTicket'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import { choisirModeDuDefi } from '@/app/amis/defi-actions'
import { modesDuDefi } from '@/lib/amis/defi-ami'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// DÉFIER UN AMI — le bouton de l'angle et le panneau des modes (05/10/2026).
// Le parcours entier est décrit dans lib/amis/defi-ami.ts.
//
// LE BLEU EST UNE IDENTITÉ, pas une action (Lucas : « une belle illustration
// avec le côté bleu — confiance = amis — insérée dans l'angle ») : il ne
// touche que le dessin du bouclier ; les boutons d'action restent violets.
// -----------------------------------------------------------------------------

/** Le bouton de l'angle du bloc « Mes amis » : il passe l'onglet en mode défi. */
export function BoutonDefierCoin({ actif, onClick }: { actif: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onClick()
      }}
      aria-pressed={actif}
      aria-label={actif ? 'Annuler le défi' : 'Défier un ami'}
      className={cn(
        'relative -my-2 -mr-1 flex shrink-0 flex-col items-center transition-transform active:scale-90',
        actif && 'scale-110',
      )}
    >
      <Image
        src="/images/amis/defier.webp"
        alt=""
        width={96}
        height={96}
        className={cn('size-14 select-none object-contain drop-shadow-[0_3px_3px_rgba(30,40,110,0.3)]', actif && 'animate-pulse')}
      />
      <span
        data-teinte="bleu"
        className="font-heading -mt-1 rounded-full bg-[var(--outil)] px-2 text-[11px] leading-[18px] font-extrabold text-white shadow-sm"
      >
        {actif ? 'Annuler' : 'Défier'}
      </span>
    </button>
  )
}

/**
 * Le panneau des modes, ouvert une fois l'invitation partie : l'ami est
 * prévenu, l'élève choisit sur quoi il le défie, et la partie se lance.
 */
export function PanneauDefi({
  cible,
  dayKey,
  premium,
  onClose,
}: {
  cible: { id: string; nom: string; portrait: string } | null
  dayKey: string
  premium: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [enCours, setEnCours] = useState<string | null>(null)
  const [, start] = useTransition()
  const modes = modesDuDefi(dayKey, premium)

  const lancer = (mode: (typeof modes)[number]) => {
    if (!cible || enCours) return
    setEnCours(mode.mode)
    start(async () => {
      const r = await choisirModeDuDefi(cible.id, mode.mode)
      if (!r.ok) {
        setEnCours(null)
        toast('Impossible de lancer ce défi pour le moment.', 'error')
        return
      }
      if (mode.ticket.href) router.push(mode.ticket.href)
    })
  }

  return (
    <Feuille open={cible !== null} onClose={onClose} label="Choisis le défi">
      {cible ? (
        <div className="flex flex-col gap-4 px-1 pt-8 pb-4">
          <div data-teinte="bleu" className="carte flex items-center gap-3 p-3">
            <PortraitJoueur id={cible.id} portrait={cible.portrait} className="size-12 ring-[3px] ring-[var(--outil)]" />
            <div className="min-w-0 flex-1">
              <p className="font-heading truncate text-lg leading-tight font-extrabold">Invitation envoyée à {cible.nom}</p>
              <p className="text-xs font-semibold text-muted-foreground">
                {cible.nom} est prévenu. Choisis le mode : il devra battre ton score.
              </p>
            </div>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
            </span>
          </div>
          <h2 className="titre-section">Sur quoi tu le défies ?</h2>
          <ul className="flex flex-col gap-3">
            {modes.map((m) => (
              <li
                key={m.mode}
                // Le billet est un lien : on le retient le temps de fixer le
                // mode du duel, puis on part sur sa page.
                onClickCapture={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  lancer(m)
                }}
                className={cn('transition-opacity', enCours && enCours !== m.mode && 'opacity-50')}
              >
                <ModeTicket ticket={m.ticket} format="compact" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Feuille>
  )
}
