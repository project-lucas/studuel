'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import { completeTutorial } from '@/app/reviser/actions'
import { marquerDecouverte } from '@/app/decouverte-actions'
import { CLE_PREMIERS_PAS } from '@/lib/decouverte/etat'
import { marquerVueEnLocal } from '@/components/decouverte/store'
import {
  lireTourVu,
  marquerTourVu,
  tourDoitDemarrer,
  type EtatTourEnBase,
} from '@/lib/tour-local'
import {
  TOUR_STEPS,
  bubblePosition,
  nextAvailableStep,
  spotlightRect,
  type Rect,
  type TourStep,
} from '@/lib/tour'

// Cherche l'élément data-tour VISIBLE (la bottom nav mobile et la sidebar
// desktop portent la même ancre ; l'une des deux est display:none — et un
// onglet gardé vivant mais caché par <Activity> a un rectangle nul).
function findTargetRect(target: string): Rect | null {
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-tour="${target}"]`,
  )
  for (const node of nodes) {
    const r = node.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) {
      return { top: r.top, left: r.left, width: r.width, height: r.height }
    }
  }
  return null
}

const hasTarget = (target: string) => findTargetRect(target) !== null

/**
 * LES BULLES D'UN TOUR : spotlight sur l'élément + bulle explicative +
 * Suivant / Passer. Le moteur commun du tour « premiers pas » (ci-dessous) et
 * des mini-tours de la découverte progressive (components/decouverte/
 * DecouverteVeille). Le parent ne le monte qu'au moment de partir ; la
 * première étape disponible est cherchée au montage, et les étapes dont la
 * cible est absente de l'écran sont sautées (nextAvailableStep). `onFin`
 * reçoit `true` si l'élève est allé au bout, `false` s'il a passé.
 */
export function BullesTour({
  etapes,
  onFin,
}: {
  etapes: TourStep[]
  onFin: (complet: boolean) => void
}) {
  // null = en attente de la première étape. L'étape courante pilote tout le rendu.
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [bubbleSize, setBubbleSize] = useState({ width: 300, height: 160 })
  const bubbleRef = useRef<HTMLDivElement>(null)
  // La bulle EST le panneau du dialogue : c'est elle qui porte les boutons
  // « Suivant » / « Passer ». Sans piège, la tabulation partait explorer la
  // page assombrie derrière le spotlight.
  useDialogFocus(bubbleRef, stepIndex !== null)

  // `onFin` par une référence : la recherche de la première étape ne dépend
  // que des étapes, pas de l'identité du rappel du parent.
  const onFinRef = useRef(onFin)
  useEffect(() => {
    onFinRef.current = onFin
  }, [onFin])

  // La première étape se cherche À L'IMAGE SUIVANTE : les ancres sont alors
  // mesurables (mise en page faite), et l'état se pose depuis un rappel, pas
  // depuis le corps de l'effet.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const first = nextAvailableStep(etapes, hasTarget, 0)
      if (first === null) onFinRef.current(false)
      else setStepIndex(first)
    })
    return () => window.cancelAnimationFrame(id)
  }, [etapes])

  const finish = useCallback(
    (completed: boolean) => {
      sfx.tap()
      setStepIndex(null)
      onFin(completed)
      if (completed) sfx.complete()
    },
    [onFin],
  )

  const goNext = useCallback(() => {
    if (stepIndex === null) return
    sfx.tap()
    const next = nextAvailableStep(etapes, hasTarget, stepIndex + 1)
    if (next === null) finish(true)
    else setStepIndex(next)
  }, [etapes, stepIndex, finish])

  // Mesure de la cible de l'étape courante, re-calculée au resize/scroll.
  useEffect(() => {
    if (stepIndex === null) return
    const measure = () => {
      const target = etapes[stepIndex].target
      setTargetRect(target ? findTargetRect(target) : null)
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [etapes, stepIndex])

  // Taille réelle de la bulle (sa hauteur dépend du texte de l'étape).
  useLayoutEffect(() => {
    if (stepIndex === null) return
    const el = bubbleRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.width && r.height) setBubbleSize({ width: r.width, height: r.height })
  }, [stepIndex])

  // Échap = passer le tour.
  useEffect(() => {
    if (stepIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepIndex, finish])

  if (stepIndex === null || typeof document === 'undefined') return null

  const step = etapes[stepIndex]
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const spot = step.target && targetRect ? spotlightRect(targetRect, viewport) : null
  const bubble = bubblePosition(spot, bubbleSize, viewport)
  const isLast = nextAvailableStep(etapes, hasTarget, stepIndex + 1) === null
  const stepNumber = stepIndex + 1

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tour guidé, étape ${stepNumber} sur ${etapes.length} : ${step.title}`}
      className="fixed inset-0 z-[95]"
    >
      {/* Spotlight : un trou transparent, l'ombre géante assombrit le reste.
          Sans cible (bienvenue), simple voile plein écran. */}
      {spot ? (
        <div
          aria-hidden="true"
          className="absolute rounded-2xl transition-all duration-300"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: '0 0 0 9999px oklch(0.22 0.05 300 / 0.62)',
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[oklch(0.22_0.05_300_/_0.62)]"
        />
      )}

      {/* La bulle. */}
      <div
        ref={bubbleRef}
        className="absolute w-[19rem] max-w-[calc(100vw-1.5rem)] rounded-3xl bg-card p-5 shadow-2xl ring-1 ring-foreground/10 outline-none transition-all duration-300"
        style={{ top: bubble.top, left: bubble.left }}
      >
        <p className="text-xs font-bold text-muted-foreground tabular-nums">
          {stepNumber}/{etapes.length}
        </p>
        <h2 className="font-heading mt-1 text-xl font-extrabold text-foreground">
          {step.title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => finish(false)}
            className="rounded-full px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            Passer
          </button>
          <button
            type="button"
            onClick={goNext}
            className="font-heading rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-sm transition-transform active:scale-95"
          >
            {isLast ? 'C’est parti !' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * LE TOUR « PREMIERS PAS » (monté dans Réviser) : Réviser, la série, les
 * quêtes, Marcel — quatre bulles après la bienvenue (lib/tour). Se lance à la
 * première connexion — d'après la colonne `profiles.tutorial_completed`
 * (migration 188) quand elle existe, sinon d'après la mémoire locale du
 * navigateur (cf. lib/tour-local, qui explique pourquoi ce repli existe : sans
 * lui, le tour ne partait jamais) — ou via `?tour=1` (bouton « Revoir le
 * tutoriel » du compte).
 *
 * Depuis le 25/10/2026 il est aussi LE mini-tour de la découverte « reviser »
 * (catalogue) : en finissant, il la marque comme vue, et l'annonce
 * automatique de DecouverteVeille ne la relance jamais par-dessus.
 */
export default function TourGuide({
  etatEnBase,
}: {
  // `undefined` = la colonne `tutorial_completed` (188) n'existe pas encore.
  etatEnBase: EtatTourEnBase
}) {
  const params = useSearchParams()
  const forced = params.get('tour') === '1'
  const [actif, setActif] = useState(false)

  // Lancement : petit délai pour laisser la page s'installer.
  //
  // La décision se prend DANS le minuteur, pas au rendu : elle consulte la
  // mémoire locale (`lireTourVu`), qui n'existe que dans le navigateur. La
  // calculer pendant le rendu ferait diverger le HTML du serveur de celui du
  // client — et la calculer dans un `setState` d'effet déclencherait un rendu
  // en cascade pour rien.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!forced && !tourDoitDemarrer(etatEnBase, lireTourVu())) return
      setActif(true)
    }, 600)
    return () => clearTimeout(timer)
  }, [etatEnBase, forced])

  const finir = useCallback(() => {
    setActif(false)
    // Deux mémoires, et c'est voulu : la base (qui suit l'élève d'un appareil
    // à l'autre) et le navigateur (qui prend le relais tant que la 188 dort).
    // Sans la seconde, l'échec silencieux de la première faisait revenir le
    // tour à CHAQUE visite.
    marquerTourVu()
    completeTutorial().catch(() => {})
    marquerVueEnLocal(CLE_PREMIERS_PAS)
    marquerDecouverte(CLE_PREMIERS_PAS).catch(() => {})
  }, [])

  if (!actif) return null
  return <BullesTour etapes={TOUR_STEPS} onFin={finir} />
}
