'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import {
  PART_MIN,
  defilementDeReprise,
  lectureDe,
  partAtteinte,
  pourcentLu,
} from '@/lib/lecture-entamee'
import { avancerLecture, oublierLecture, stockLectures } from '@/lib/lecture-entamee-local'

/** On n'écrit dans le navigateur qu'à chaque pas de lecture, pas à chaque pixel. */
const PAS_ECRITURE = 0.05
/** Sous cet écart, la position courante « a rejoint » l'endroit gardé. */
const ECART_REJOINT = 0.04

/**
 * LE COURS ENTAMÉ (effet Zeigarnik, 28/10/2026 — lib/lecture-entamee).
 *
 * Enveloppe le texte du cours et retient, dans le navigateur, jusqu'où l'élève
 * l'a lu (la part du texte atteinte par le bas de l'écran, la plus loin). À la
 * réouverture d'un cours entamé, une bande en tête propose « Reprendre où tu
 * t'étais arrêté » et défile jusqu'à la dernière ligne lue ; elle s'efface
 * d'elle-même quand l'élève y est revenu en défilant.
 *
 * Un cours déjà validé (`dejaLu`) n'est pas suivi, et sa lecture est oubliée :
 * la boucle est bouclée, la carte de Réviser ne doit plus le rappeler.
 *
 * Rien n'est animé en continu ; le défilement est lu à la frame (rAF), écrit
 * par pas de 5 %.
 */
export default function SuiviLecture({
  lecon,
  dejaLu,
  children,
}: {
  lecon: {
    lessonId: string
    titre: string
    matiere: string | null
    subjectSlug: string | null
    href: string
  }
  dejaLu: boolean
  children: ReactNode
}) {
  const bloc = useRef<HTMLDivElement>(null)
  const stock = useSyncExternalStore(stockLectures.abonner, stockLectures.lire, stockLectures.serveur)
  const [maintenant] = useState(() => Date.now())
  const gardee = dejaLu ? null : lectureDe(stock, lecon.lessonId, maintenant)
  // La part atteinte À CETTE VISITE : la bande s'efface quand elle rejoint la
  // part gardée.
  const [partVue, setPartVue] = useState(0)
  const [ecartee, setEcartee] = useState(false)
  const leconRef = useRef(lecon)
  useEffect(() => {
    leconRef.current = lecon
  })

  // Un cours validé : sa lecture entamée n'a plus lieu d'être.
  useEffect(() => {
    if (dejaLu) oublierLecture(lecon.lessonId)
  }, [dejaLu, lecon.lessonId])

  useEffect(() => {
    if (dejaLu) return
    let frame = 0
    let derniereEcrite = 0
    const mesurer = () => {
      frame = 0
      const el = bloc.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const part = partAtteinte({
        defilement: window.scrollY,
        hauteurEcran: window.innerHeight,
        debut: rect.top + window.scrollY,
        hauteur: rect.height,
      })
      setPartVue((avant) => (part > avant + 0.01 ? part : avant))
      if (part >= PART_MIN && part >= derniereEcrite + PAS_ECRITURE) {
        derniereEcrite = part
        avancerLecture({ ...leconRef.current, part, at: new Date().toISOString() })
      }
    }
    const surDefilement = () => {
      if (!frame) frame = window.requestAnimationFrame(mesurer)
    }
    window.addEventListener('scroll', surDefilement, { passive: true })
    return () => {
      window.removeEventListener('scroll', surDefilement)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [dejaLu])

  const reprendre = () => {
    const el = bloc.current
    if (!el || !gardee) return
    sfx.tap()
    setEcartee(true)
    const rect = el.getBoundingClientRect()
    window.scrollTo({
      top: defilementDeReprise({
        part: gardee.part,
        hauteurEcran: window.innerHeight,
        debut: rect.top + window.scrollY,
        hauteur: rect.height,
      }),
      behavior: 'smooth',
    })
  }

  const bande =
    gardee && !ecartee && partVue < gardee.part - ECART_REJOINT ? (
      <button
        type="button"
        onClick={reprendre}
        className="sans-papier carte mb-5 flex w-full items-center gap-3 p-3 text-left ring-2 ring-primary/25 transition-transform active:scale-[0.99]"
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]"
        >
          <ArrowDown className="size-5" strokeWidth={2.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading block text-sm font-extrabold text-foreground">
            Reprendre où tu t’étais arrêté
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
            Tu as déjà lu {pourcentLu(gardee.part)} % de ce cours.
          </span>
        </span>
        <span
          aria-hidden="true"
          className="h-2 w-14 shrink-0 overflow-hidden rounded-full bg-primary/12"
        >
          <span
            className="block h-full origin-left rounded-full bg-primary"
            style={{ transform: `scaleX(${gardee.part})` }}
          />
        </span>
      </button>
    ) : null

  return (
    <>
      {bande}
      <div ref={bloc}>{children}</div>
    </>
  )
}
