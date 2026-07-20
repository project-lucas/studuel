'use client'

import { useEffect, useRef, useState } from 'react'
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { playPop } from './onbSound'

// Flèches qui déplacent la sélection dans un groupe de choix exclusif.
const ARROW_KEYS = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']

// Effet d'appui partagé par toutes les cartes de choix : un « pop » sonore +
// un rebond visuel (classe `onb-pop` retirée à la fin de l'animation). À câbler
// sur un élément-feuille (une carte = un composant) pour que chaque instance ait
// son propre état.
export function usePressFx(pitch?: number): {
  pop: boolean
  onPress: () => void
  onAnimationEnd: () => void
} {
  const [pop, setPop] = useState(false)
  return {
    pop,
    onPress: () => {
      playPop(pitch)
      setPop(true)
    },
    onAnimationEnd: () => setPop(false),
  }
}

// En-tête persistant : chevron retour + barre de progression, avec un compteur
// de vies optionnel (écran mini-quiz). Rendu uniquement sur les écrans qui ont
// une progression (voir stepProgress).
export function ProgressHeader({
  progress,
  onBack,
  lives,
}: {
  progress: number
  onBack: () => void
  lives?: number
}) {
  return (
    <header className="flex items-center gap-3 px-[22px] pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2">
      <button
        type="button"
        onClick={onBack}
        aria-label="Étape précédente"
        className="-ml-2 flex size-11 shrink-0 items-center justify-center text-3xl leading-none font-extrabold"
        style={{ color: '#BEB6A0' }}
      >
        ‹
      </button>
      <div
        className="onb-track-bar h-[15px] flex-1 overflow-hidden rounded-[9px]"
        role="progressbar"
        aria-label="Progression de l'inscription"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="onb-fill h-full rounded-[9px] transition-[width] duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {typeof lives === 'number' ? (
        <span
          className="flex items-center gap-1 text-[15px] font-extrabold"
          style={{ color: 'var(--onb-co)' }}
          aria-label={`${lives} vies restantes`}
        >
          <span aria-hidden>♥</span>
          {lives}
        </span>
      ) : null}
    </header>
  )
}

// Bulle de dialogue (le crayon « parle ») : pointe vers le bas.
export function Bubble({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative rounded-[20px] border-2 bg-white px-[18px] py-4 text-center text-[16px] leading-[1.4] font-extrabold"
      style={{ borderColor: 'var(--onb-line)' }}
    >
      {children}
      <span
        aria-hidden
        className="absolute top-full left-1/2 -translate-x-1/2"
        style={{
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '13px solid white',
          marginTop: '-1px',
        }}
      />
    </div>
  )
}

// Groupe de choix EXCLUSIF (une seule réponse). Porte la sémantique
// `radiogroup` et le clavier attendu du motif : flèches pour passer d'une
// option à l'autre, et une seule option tabulable (« tabindex baladeur ») pour
// qu'un Tab traverse le groupe entier au lieu de s'arrêter sur chaque ligne.
//
// Le tabindex est posé sur le DOM plutôt que passé en prop : les appelants
// construisent leurs options par `map()` et n'ont pas à savoir laquelle est
// tabulable — la règle reste ici, en un seul endroit.
export function OptionGroup({
  label,
  children,
  className = 'flex flex-col gap-[11px]',
}: {
  /** Libellé du groupe, annoncé avant les options (ex. « Ton objectif n°1 »). */
  label: string
  children: ReactNode
  /** Mise en page du groupe (par défaut une colonne ; la classe est une grille). */
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const radios = () => [
    ...(ref.current?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []),
  ]

  useEffect(() => {
    const items = radios()
    if (items.length === 0) return
    const checked = items.find((r) => r.getAttribute('aria-checked') === 'true')
    // Rien de coché encore : c'est la PREMIÈRE option qui est tabulable (motif
    // ARIA), sinon l'option cochée.
    const tabbable = checked ?? items[0]
    for (const r of items) r.tabIndex = r === tabbable ? 0 : -1
  })

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (!ARROW_KEYS.includes(e.key)) return
    const items = radios()
    if (items.length === 0) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight'
    // Depuis l'extérieur du groupe (current === -1), on entre par la première.
    const next =
      current === -1
        ? 0
        : (current + (forward ? 1 : -1) + items.length) % items.length
    e.preventDefault()
    items[next].focus()
    // Motif radio : la sélection suit le focus.
    items[next].click()
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={className}
    >
      {children}
    </div>
  )
}

// Grande carte d'option (radio, choix unique) : icône + libellé (+ description),
// pastille de sélection à droite (centrée verticalement). Socle 3D, rebond +
// son au clic. Utilisée sur profil, source, objectif, etc.
export function OptionRow({
  selected,
  onClick,
  icon,
  label,
  description,
  trailing,
}: {
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  label: ReactNode
  description?: ReactNode
  trailing?: ReactNode
}) {
  const { pop, onPress, onAnimationEnd } = usePressFx()
  return (
    <button
      type="button"
      // Choix EXCLUSIF : `radio` (« option 2 sur 4, sélectionnée ») et non
      // `aria-pressed`, qui annonce un interrupteur et ne dit rien du fait que
      // les options s'excluent. À utiliser dans un <OptionGroup>, qui porte le
      // `radiogroup` et le clavier.
      role="radio"
      aria-checked={selected}
      onClick={() => {
        onPress()
        onClick()
      }}
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'onb-card flex w-full items-center gap-3.5 p-[17px] text-left',
        selected && 'onb-card-on',
        pop && 'onb-pop',
      )}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-extrabold">{label}</span>
        {description ? (
          <span
            className="mt-0.5 block text-[13.5px] leading-[1.35] font-semibold"
            style={{ color: 'var(--onb-mut)' }}
          >
            {description}
          </span>
        ) : null}
      </span>
      {trailing ?? (
        <span
          className="shrink-0 rounded-full border-2"
          style={{
            width: 26,
            height: 26,
            borderColor: selected ? 'var(--onb-pp)' : 'var(--onb-line)',
            background: selected ? 'var(--onb-pp)' : '#fff',
            boxShadow: selected ? 'inset 0 0 0 4px #fff' : undefined,
          }}
        />
      )}
    </button>
  )
}

// Médaillon carré coloré qui porte une icône (dans les lignes d'option).
export function OptionIcon({
  color,
  children,
  style,
}: {
  color: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl text-white"
      style={{ width: 44, height: 44, background: color, ...style }}
    >
      {children}
    </span>
  )
}

// Grand cercle d'illustration (placement, notifications, duel).
export function IllustrationCircle({
  size = 130,
  bg = 'var(--onb-pps)',
  children,
}: {
  size?: number
  bg?: string
  children: ReactNode
}) {
  return (
    <span
      className="mx-auto flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: bg }}
    >
      {children}
    </span>
  )
}

// Titre + sous-titre d'écran (Nunito 800).
export function StepHead({
  title,
  subtitle,
  center,
}: {
  title: ReactNode
  subtitle?: ReactNode
  center?: boolean
}) {
  return (
    <div className={center ? 'text-center' : undefined}>
      <h1 className="onb-title text-[23px] leading-[1.18]">{title}</h1>
      {subtitle ? (
        <p
          className="mt-1.5 text-[14px] leading-[1.45] font-semibold"
          style={{ color: 'var(--onb-mut)' }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
