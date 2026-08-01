'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import { completeTutorial } from '@/app/reviser/actions'
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
} from '@/lib/tour'

// Cherche l'élément data-tour VISIBLE (la bottom nav mobile et la sidebar
// desktop portent la même ancre ; l'une des deux est display:none).
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
 * Tour guidé post-onboarding : spotlight sur l'élément + bulle explicative +
 * Suivant / Passer. Se lance à la première connexion — d'après la colonne
 * `profiles.tutorial_completed` (migration 188) quand elle existe, sinon
 * d'après la mémoire locale du navigateur (cf. lib/tour-local, qui explique
 * pourquoi ce repli existe : sans lui, le tour ne partait jamais) — ou via
 * `?tour=1` (bouton « Revoir le tutoriel » du compte). Les étapes dont la
 * cible est absente (ex. file du jour vide) sont sautées automatiquement.
 */
export default function TourGuide({
  etatEnBase,
}: {
  // `undefined` = la colonne `tutorial_completed` (188) n'existe pas encore.
  etatEnBase: EtatTourEnBase
}) {
  const params = useSearchParams()
  const forced = params.get('tour') === '1'

  // null = tour inactif. L'étape courante pilote tout le rendu.
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [bubbleSize, setBubbleSize] = useState({ width: 300, height: 160 })
  const bubbleRef = useRef<HTMLDivElement>(null)
  // La bulle EST le panneau du dialogue : c'est elle qui porte les boutons
  // « Suivant » / « Passer ». Sans piège, la tabulation partait explorer la
  // page assombrie derrière le spotlight.
  useDialogFocus(bubbleRef, stepIndex !== null)

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
      const first = nextAvailableStep(TOUR_STEPS, hasTarget, 0)
      if (first !== null) setStepIndex(first)
    }, 600)
    return () => clearTimeout(timer)
  }, [etatEnBase, forced])

  const finish = useCallback((completed: boolean) => {
    sfx.tap()
    setStepIndex(null)
    // Deux mémoires, et c'est voulu : la base (qui suit l'élève d'un appareil
    // à l'autre) et le navigateur (qui prend le relais tant que la 188 dort).
    // Sans la seconde, l'échec silencieux de la première faisait revenir le
    // tour à CHAQUE visite.
    marquerTourVu()
    completeTutorial().catch(() => {})
    if (completed) sfx.complete()
  }, [])

  const goNext = useCallback(() => {
    if (stepIndex === null) return
    sfx.tap()
    const next = nextAvailableStep(TOUR_STEPS, hasTarget, stepIndex + 1)
    if (next === null) finish(true)
    else setStepIndex(next)
  }, [stepIndex, finish])

  // Mesure de la cible de l'étape courante, re-calculée au resize/scroll.
  useEffect(() => {
    if (stepIndex === null) return
    const measure = () => {
      const target = TOUR_STEPS[stepIndex].target
      setTargetRect(target ? findTargetRect(target) : null)
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [stepIndex])

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

  const step = TOUR_STEPS[stepIndex]
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const spot = step.target && targetRect ? spotlightRect(targetRect, viewport) : null
  const bubble = bubblePosition(spot, bubbleSize, viewport)
  const isLast =
    nextAvailableStep(TOUR_STEPS, hasTarget, stepIndex + 1) === null
  const stepNumber = stepIndex + 1

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tour guidé, étape ${stepNumber} sur ${TOUR_STEPS.length} : ${step.title}`}
      data-no-swipe
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
          {stepNumber}/{TOUR_STEPS.length}
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
            className="font-heading rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-95"
          >
            {isLast ? 'C’est parti !' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
