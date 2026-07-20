'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import {
  BookOpen,
  Brain,
  Droplet,
  Moon,
  Pencil,
  type LucideIcon,
} from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { AvatarConfig } from '@/lib/avatar'
import type { DriverKey, DriverScore } from '@/lib/capacite-drivers'

// L'éditeur (et DiceBear) n'est chargé qu'à l'ouverture — même approche que
// l'ancien AvatarBadge : l'avatar affiché est un data-URI pré-rendu serveur.
const AvatarEditor = dynamic(() => import('@/components/AvatarEditor'), {
  ssr: false,
})

const DRIVER_ICONS: Record<DriverKey, LucideIcon> = {
  sommeil: Moon,
  hydratation: Droplet,
  concentration: Brain,
  regularite: BookOpen,
}

// Jauge circulaire de capacité : anneau dégradé menthe → corail, chiffre au
// centre, mini-anneau fantôme (le plafond possible) accroché en haut à droite.
function CapacityRing({
  capacite,
  plafond,
}: {
  capacite: number | null
  plafond: number | null
}) {
  const R = 64
  const C = 2 * Math.PI * R
  const filled = capacite === null ? 0 : (capacite / 100) * C

  return (
    <div className="relative mx-auto w-fit">
      <svg
        viewBox="0 0 160 160"
        className="size-36 sm:size-40"
        role="img"
        aria-label={
          capacite === null
            ? 'Capacité inconnue — active tes leviers pour la mesurer'
            : `Capacité ${capacite} sur 100, plafond possible ${plafond ?? '—'}`
        }
      >
        <defs>
          <linearGradient id="capacite-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-emerald-300)" />
            <stop offset="100%" stopColor="var(--destructive)" />
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r={R}
          fill="none"
          stroke="currentColor"
          className="text-white/15"
          strokeWidth="13"
        />
        {/* Pas d'arc à 0 : le strokeLinecap rond dessinerait un point parasite. */}
        {filled > 0 ? (
          <circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="url(#capacite-grad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${C}`}
            transform="rotate(-90 80 80)"
          />
        ) : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white/85">Capacité</span>
        <span className="font-heading text-4xl leading-none font-extrabold tabular-nums">
          {capacite ?? '—'}
        </span>
      </div>
      {/* Anneau fantôme : le plafond possible, en retrait discret. */}
      {plafond !== null ? (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex size-11 items-center justify-center rounded-full border-2 border-white/45 bg-white/10 font-mono text-sm font-extrabold text-white/90 tabular-nums"
        >
          {plafond}
        </span>
      ) : null}
    </div>
  )
}

// Hero card de « Ma progression » : bonjour + classe, avatar largement
// cliquable (édition), jauge de capacité dominante et les 4 drivers du score.
export default function HeroCard({
  name,
  gradeLabel,
  avatarUri,
  avatarConfig,
  capacite,
  plafond,
  drivers,
}: {
  name: string
  gradeLabel: string | null
  avatarUri: string
  avatarConfig: AvatarConfig
  capacite: number | null
  plafond: number | null
  drivers: DriverScore[]
}) {
  const [editing, setEditing] = useState(false)

  return (
    <section
      aria-label="Ma capacité"
      className="moi-hero moi-card relative overflow-hidden rounded-3xl p-4 text-white"
    >
      <span
        aria-hidden="true"
        className="moi-blob absolute -top-8 -left-10 h-24 w-24 rounded-full"
      />

      <div className="relative">
        <h1 className="font-heading text-2xl leading-tight font-bold text-balance">
          Bonjour {name}
        </h1>
        {gradeLabel ? (
          <span className="mt-1.5 inline-block rounded-full bg-white px-3 py-1 text-xs font-extrabold text-foreground shadow-sm">
            {gradeLabel}
          </span>
        ) : null}
      </div>

      {/* ~40 % avatar / 60 % jauge : la jauge reste dominante. */}
      <div className="relative mt-3 grid grid-cols-[minmax(140px,2fr)_3fr] items-end gap-2">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setEditing(true)
          }}
          aria-label="Personnaliser mon avatar"
          className="group relative mx-auto block w-full max-w-44 min-w-[140px] cursor-pointer self-end transition-transform active:scale-[0.97]"
        >
          {/* L'avatar porte déjà son disque de fond (DiceBear) — un liseré
              doux suffit pour le décoller du violet. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUri}
            alt=""
            className="relative mx-auto w-full rounded-full ring-4 ring-white/25 drop-shadow-md"
          />
          <span className="absolute right-1 bottom-1 flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform group-hover:scale-110">
            <Pencil className="size-4" strokeWidth={2.6} aria-hidden="true" />
          </span>
        </button>

        <div className="flex flex-col items-center gap-2">
          <CapacityRing capacite={capacite} plafond={plafond} />
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white/90 ring-1 ring-white/25">
            {capacite !== null && plafond !== null
              ? `Plafond : ${capacite} actuel · ${plafond} possible`
              : 'Active tes leviers pour mesurer ta capacité'}
          </span>
        </div>
      </div>

      {/* Les 4 drivers du score, en tuiles translucides. */}
      <div className="relative mt-3 grid grid-cols-2 gap-2">
        {drivers.map((d) => {
          const Icon = DRIVER_ICONS[d.key]
          return (
            <div
              key={d.key}
              className="flex items-center gap-2 rounded-2xl bg-white/12 px-2.5 py-2 ring-1 ring-white/20"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white/85">{d.label}</p>
                <p className="font-mono text-sm leading-none font-extrabold tabular-nums">
                  {d.score === null ? '—' : `${d.score}%`}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {editing
        ? createPortal(
            <AvatarEditor initial={avatarConfig} onClose={() => setEditing(false)} />,
            document.body,
          )
        : null}
    </section>
  )
}
