'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { BookOpenCheck, Check } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { completeLesson } from '@/app/reviser/actions'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { relireQuetes } from '@/components/quetes/store'
import { secondesDeLecture } from '@/lib/lecture'
import { cn } from '@/lib/utils'
import styles from './LessonCompleteButton.module.css'

// LA LECTURE COMPTE TOUTE SEULE (13/10/2026, Lucas : « j'en ai lu un et rien
// ne s'est activé » ; « les missions doivent pouvoir être vérifiées sans
// erreur »). Il y avait ici un bouton « J'ai terminé cette leçon », sous le
// texte : personne ne le pressait — zéro cours terminé sur toute l'app en sept
// jours — et la quête « Lire 1 cours » ne s'allumait jamais.
//
// Un cours est lu quand l'élève a ATTEINT LA FIN du texte (ce bloc est posé
// juste dessous) ET y a passé un temps minimum proportionnel à sa longueur
// (lib/lecture : une seconde pour dix mots, de 20 s à 2 min, comptée écran
// visible). Alors le serveur enregistre la leçon et fait avancer la quête
// dans la même réponse ; les jetons d'XP jaillissent d'ici vers l'écusson, et
// le bandeau relit les quêtes pour s'allumer tout de suite. Pas de bouton :
// une intention à deviner est une quête qu'on rate.
//
// LE CHRONO DE LECTURE (26/10/2026, Lucas : « dès qu'un user ouvre le cours un
// petit chrono joli doit apparaître discrètement pour mesurer le temps de
// lecture, lié à la mission journalière et comptabilisé dans son temps de
// travail de la semaine ») : la même seconde qui fait avancer la quête se LIT,
// dans une pilule posée en bas à gauche (en face du bouton des quêtes). Un
// anneau se remplit jusqu'au temps attendu, puis la coche verte dit que la
// leçon est validée — et le chrono continue, puisqu'on lit encore. Le temps de
// travail de la semaine, lui, est versé par le compteur invisible du layout de
// la leçon (WorkTimer → /api/work-time), qui compte dès l'ouverture : la
// pilule n'ajoute rien au serveur, elle montre ce qui compte déjà.
export default function LessonCompleteButton({
  lessonId,
  initialDone,
  mots,
}: {
  lessonId: string
  initialDone: boolean
  /** Le nombre de mots du cours : il règle le temps de lecture attendu. */
  mots: number
}) {
  const [done, setDone] = useState(initialDone)
  const [finAtteinte, setFinAtteinte] = useState(false)
  const [secondes, setSecondes] = useState(0)
  const [pending, startTransition] = useTransition()
  const { celebrer } = useRecompenses()
  const ref = useRef<HTMLDivElement>(null)
  const declenche = useRef(initialDone)
  const requis = secondesDeLecture(mots)

  // La fin du texte : ce bloc entre dans l'écran.
  useEffect(() => {
    const el = ref.current
    if (!el || done) return
    const obs = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) setFinAtteinte(true)
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [done])

  // Le temps de lecture : une seconde à la fois, écran visible seulement. Il ne
  // s'arrête plus au temps requis : le chrono mesure toute la lecture.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setSecondes((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  // Les deux conditions réunies : on enregistre, une seule fois.
  useEffect(() => {
    if (done || declenche.current || !finAtteinte || secondes < requis) return
    declenche.current = true
    startTransition(async () => {
      const { saved, gains } = await completeLesson(lessonId)
      if (!saved) {
        declenche.current = false
        return
      }
      sfx.complete()
      const origines = origineUnique(ref.current, gains)
      setDone(true)
      celebrer(gains, origines)
      // La pastille du bandeau et « Quête accomplie », sans attendre l'écran suivant.
      void relireQuetes()
    })
  }, [done, finAtteinte, secondes, requis, lessonId, celebrer])

  const reste = Math.max(0, requis - secondes)
  const chrono = <ChronoLecture secondes={secondes} requis={requis} valide={done} />

  if (done) {
    return (
      <>
        {chrono}
        <span
          ref={ref}
          className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success dark:text-green-400"
        >
          <Check className="size-4" strokeWidth={3} /> Leçon terminée
        </span>
      </>
    )
  }

  return (
    <>
      {chrono}
      <div ref={ref} className="flex items-center gap-3" aria-live="polite">
        <span className="bg-secondary text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
          <BookOpenCheck className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-extrabold">
            {pending ? 'Un instant…' : finAtteinte && reste > 0 ? `Encore ${reste} s de lecture` : 'La lecture compte toute seule'}
          </p>
          <p className="text-muted-foreground text-xs">
            {finAtteinte && reste > 0
              ? 'Le temps de relire ce qui compte, et la leçon est validée.'
              : 'Lis jusqu’en bas : la leçon se valide et la quête du jour avance.'}
          </p>
        </div>
      </div>
    </>
  )
}

/** « 0:42 », « 12:05 » — le temps de lecture, à la seconde. */
function formatChrono(s: number): string {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r < 10 ? '0' : ''}${r}`
}

/**
 * LA PILULE DU CHRONO — fixe en bas à gauche, en face du bouton des quêtes
 * (même retrait du bord que lui ; sur PC, à droite de la barre latérale de
 * 16 rem), petite et claire. L'anneau se remplit
 * jusqu'au temps attendu (transform seulement : un `stroke-dashoffset` est
 * posé en style, pas animé en continu), puis passe au vert de la réussite avec
 * la coche. Le texte qui change chaque seconde est tenu hors du lecteur d'écran
 * (`aria-hidden`) : le bloc de fin de cours annonce déjà ce qui compte.
 */
function ChronoLecture({ secondes, requis, valide }: { secondes: number; requis: number; valide: boolean }) {
  const part = valide ? 1 : Math.min(1, secondes / requis)
  // Un anneau de rayon 10 : circonférence ≈ 62,8.
  const circ = 2 * Math.PI * 10
  return (
    <div
      className={cn(
        styles.pilule,
        'sans-papier fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-full bg-card py-1.5 pr-3.5 pl-1.5 shadow-md ring-1 ring-black/5 md:bottom-8 md:left-[17rem]',
      )}
      aria-label={valide ? `Leçon validée, ${formatChrono(secondes)} de lecture` : 'Chrono de lecture'}
    >
      <span className="relative grid size-7 shrink-0 place-items-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="absolute inset-0 size-7 -rotate-90">
          <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" className="stroke-black/10" />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - part)}
            className={valide ? 'stroke-success' : 'stroke-primary'}
          />
        </svg>
        {valide ? (
          <Check className="size-3.5 text-success" strokeWidth={3.5} />
        ) : (
          <BookOpenCheck className="size-3.5 text-primary" strokeWidth={2.6} />
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn('font-mono text-sm font-extrabold tabular-nums', valide ? 'text-success' : 'text-foreground')}
      >
        {formatChrono(secondes)}
      </span>
    </div>
  )
}
