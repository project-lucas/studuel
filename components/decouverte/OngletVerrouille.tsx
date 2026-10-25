'use client'

import Image, { type StaticImageData } from 'next/image'
import { Lock } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { Decouverte, OngletVerrouillable } from '@/lib/decouverte/catalogue'
import { ouvrirVerrou } from './store'

/**
 * UN ONGLET FERMÉ DANS LA BARRE (25/10/2026, cadrage « le jeu vivant » § E) :
 * le même dessin que l'onglet ouvert, en gris, un petit cadenas sur son coin
 * et « Niv. 2 » dessous. Ce n'est PAS un lien : le toucher ouvre la feuille
 * « Se débloque au niveau 2 » (FeuilleVerrou), jamais l'onglet. Rien n'est
 * préchargé non plus — un écran qu'on ne peut pas ouvrir ne se calcule pas.
 *
 * L'ancre `data-tour="tab-<onglet>"` reste posée : le jour où le niveau
 * l'ouvre, le mini-tour de la découverte la vise, et c'est alors le lien
 * ordinaire de Navigation qui la porte.
 */
type Props = {
  name: string
  onglet: OngletVerrouillable
  icone: StaticImageData
  verrou: Decouverte
}

const libelle = (name: string, niveau: number) => `${name} — se débloque au niveau ${niveau}`

export function OngletVerrouilleMobile({ name, onglet, icone, verrou }: Props) {
  return (
    <button
      type="button"
      aria-label={libelle(name, verrou.niveau)}
      aria-haspopup="dialog"
      data-tour={`tab-${onglet}`}
      onClick={() => {
        sfx.tap()
        ouvrirVerrou(onglet)
      }}
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center transition-transform active:scale-95"
    >
      <span className="relative flex">
        <span className="flex size-11 items-center justify-center opacity-45 saturate-0">
          <Image
            src={icone}
            alt=""
            aria-hidden="true"
            width={80}
            height={80}
            priority
            className="size-full object-contain"
          />
        </span>
        <span
          aria-hidden="true"
          className="absolute -right-1 -bottom-0.5 flex size-4.5 items-center justify-center rounded-full bg-foreground/80 text-background ring-2 ring-card"
        >
          <Lock className="size-2.5" />
        </span>
      </span>
      <span
        aria-hidden="true"
        className="font-heading mt-0.5 text-[10px] leading-none font-extrabold text-muted-foreground"
      >
        Niv. {verrou.niveau}
      </span>
    </button>
  )
}

export function OngletVerrouilleSidebar({ name, onglet, icone, verrou }: Props) {
  return (
    <button
      type="button"
      aria-label={libelle(name, verrou.niveau)}
      aria-haspopup="dialog"
      data-tour={`tab-${onglet}`}
      onClick={() => {
        sfx.tap()
        ouvrirVerrou(onglet)
      }}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/50 transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full">
        <Image
          src={icone}
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          className="size-5 object-contain opacity-60 saturate-0"
        />
      </span>
      <span className="flex-1 text-left">{name}</span>
      <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
        <Lock className="size-3" aria-hidden="true" />
        Niv. {verrou.niveau}
      </span>
    </button>
  )
}
