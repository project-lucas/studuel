'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, Timer, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { examHeroUrgency } from '@/lib/next-exam'
import { removeUpcomingExam } from '@/app/moi/actions'
import type { Subject } from '@/lib/types'

// Pulsation du badge d'urgence : boucle lente en jaune, ~30 % plus rapide en
// corail (le seul élément animé de la carte — la richesse visuelle reste
// réservée aux moments de récompense).
const PULSE_DURATION_YELLOW = 2
const PULSE_DURATION_CORAL = 1.4

// Carte héro « Pour ton prochain contrôle » : LA carte focale de l'accueil
// Réviser. Pleine largeur, fond violet dégradé (seule carte de la page à fond
// coloré plein), badge d'urgence gradué (jaune → corail selon la date), CTA
// jaune élargi. Le badge est recalculé côté client en jours calendaires à
// partir de la date enregistrée par l'élève.
export default function NextControleHeroCard({
  subject,
  chapterId,
  chapterTitle,
  date,
  minutes,
  today,
}: {
  subject: Subject
  chapterId: string
  chapterTitle: string
  date: string | null // clé UTC 'YYYY-MM-DD' du contrôle, ou null
  minutes: number
  /**
   * Clé UTC du jour, calculée PAR LE SERVEUR. Elle ne peut pas l'être ici :
   * ce composant est rendu côté serveur puis hydraté, et un `new Date()` au
   * rendu donne deux résultats différents de part et d'autre (horloges
   * décalées, ou simplement le passage de minuit entre les deux) — donc un
   * badge d'urgence qui saute, et un avertissement d'hydratation React.
   */
  today: string
}) {
  const reduceMotion = useReducedMotion()
  const [removing, startRemove] = useTransition()
  const { label, tone } = examHeroUrgency(date, today)
  const isCoral = tone === 'coral'

  // Croix « je me suis trompé » : retire ce contrôle de la liste (RPC
  // remove_upcoming_exam) — la carte disparaît au revalidate.
  function handleRemove() {
    if (removing) return
    sfx.tap()
    startRemove(async () => {
      const res = await removeUpcomingExam(chapterId)
      if (res.ok) toast('Contrôle retiré ✓')
      else toast('Impossible de retirer ce contrôle. Réessaie.')
    })
  }

  return (
    <div className={cn('relative', removing && 'opacity-60')}>
      {/* Croix de retrait — sœur du lien (pas imbriquée dedans : un bouton
          dans un <a> est invalide), posée au-dessus dans le coin supérieur
          droit. */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        aria-label="Retirer ce contrôle"
        className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/10 text-[#FAF6EF]/80 transition-colors hover:bg-white/20 hover:text-white active:scale-90"
      >
        <X className="size-4" strokeWidth={2.6} aria-hidden="true" />
      </button>

      <Link
        href={`/reviser/${subject.slug}/${chapterId}`}
        onClick={() => sfx.tap()}
        className="group flex min-h-[140px] w-full flex-col justify-between gap-3 rounded-[24px] border-4 border-[#2D2A4A] bg-gradient-to-br from-[#7B4FD8] to-[#2D2A4A] p-4 text-[#FAF6EF] shadow-[6px_6px_0_#2D2A4A] transition-transform hover:-translate-y-0.5 sm:max-h-[160px] sm:flex-row sm:items-center sm:gap-6 sm:p-5"
      >
        <div className="min-w-0 flex-1 pr-8 sm:pr-0">
          {/* 1. Badge urgence — l'info n°1, lisible avant le titre. */}
          <motion.span
            animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={{
              duration: isCoral ? PULSE_DURATION_CORAL : PULSE_DURATION_YELLOW,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'inline-flex w-fit items-center rounded-full border-2 border-[#2D2A4A] px-3 py-1 text-xs font-extrabold',
              isCoral
                ? 'bg-[#F87171] text-white'
                : 'bg-[#F9B233] text-[#2D2A4A]',
            )}
          >
            ⏰ {label}
          </motion.span>

          {/* 2. Titre du chapitre — plus grand que les titres des cartes de la
              grille (text-sm là-bas). */}
          <p className="font-heading mt-2 line-clamp-2 text-lg leading-tight font-bold sm:text-xl">
            {chapterTitle}
          </p>

          {/* 3. Matière + durée, ligne secondaire. */}
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-[#FAF6EF]/75">
            {subject.name}
            <span aria-hidden="true">·</span>
            <Timer className="size-3.5 shrink-0" aria-hidden="true" />
            {minutes} min
          </p>
        </div>

        {/* 4. CTA jaune — pleine largeur sur mobile, élargi sur desktop, effet
            press au tap (toute la carte est le lien, le bouton est visuel). */}
        <span className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#2D2A4A] bg-[#F9B233] px-6 py-2.5 text-base font-extrabold text-[#2D2A4A] shadow-[0_4px_0_#2D2A4A] transition-all group-active:translate-y-[3px] group-active:shadow-[0_1px_0_#2D2A4A] sm:w-auto sm:shrink-0">
          <Play className="size-4 fill-current" aria-hidden="true" />
          Préparer le contrôle
        </span>
      </Link>
    </div>
  )
}
