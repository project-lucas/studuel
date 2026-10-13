'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { BookOpenCheck, Check } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { completeLesson } from '@/app/reviser/actions'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { relireQuetes } from '@/components/quetes/store'
import { secondesDeLecture } from '@/lib/lecture'

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

  // Le temps de lecture : une seconde à la fois, écran visible seulement.
  useEffect(() => {
    if (done || secondes >= requis) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setSecondes((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [done, secondes, requis])

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

  if (done) {
    return (
      <span
        ref={ref}
        className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success dark:text-green-400"
      >
        <Check className="size-4" strokeWidth={3} /> Leçon terminée
      </span>
    )
  }

  const reste = Math.max(0, requis - secondes)
  return (
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
  )
}
