'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import type { AvatarConfig } from '@/lib/avatar'
import { cn } from '@/lib/utils'

export type VsCamp = {
  name: string
  avatar: AvatarConfig
  trophies: number
  /** Ce qu'on lit sous le nom : la légende de l'appariement, la devise du robot. */
  caption: string
  isBot?: boolean
}

/**
 * L'ÉCRAN VS — la rencontre, puis le décompte. LE moment auteur de la course.
 *
 * Les deux fiches CLAQUENT depuis les bords, légèrement penchées, et se
 * redressent en se posant ; le mot VS tombe dessus comme un tampon, une onde
 * dorée part de lui et un éclair traverse la scène. C'est le geste de Clash
 * Royale au moment où les deux tours se font face : on ne sait pas encore qui
 * va gagner, mais on sait déjà que ça compte.
 *
 * Puis le 3 · 2 · 1 · GO prend la place du VS, au même endroit, à la même
 * taille : la rencontre devient le départ sans changer d'écran.
 */
export default function VsScreen({
  me,
  rival,
  subject,
  subjectEmoji,
  count,
  counting,
}: {
  me: VsCamp
  rival: VsCamp
  subject: string
  subjectEmoji: string
  /** Le chiffre du décompte (3, 2, 1, 0 = GO). */
  count: number
  /** Vrai pendant le décompte, faux pendant la rencontre. */
  counting: boolean
}) {
  const reduce = useReducedMotion()
  const slam = (from: number, tilt: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : {
          initial: { x: from, rotate: tilt, opacity: 0, scale: 1.08 },
          animate: { x: 0, rotate: 0, opacity: 1, scale: 1 },
          transition: { type: 'spring' as const, stiffness: 300, damping: 20, delay: 0.08 },
        }

  return (
    <div className="course-vs" role="status" aria-live="polite">
      {!reduce && !counting ? <span className="course-vs-flash" aria-hidden="true" /> : null}

      <p className="course-vs-matiere">
        <span aria-hidden="true">{subjectEmoji}</span> {subject} · Duel classé
      </p>

      <div className="course-vs-rangee">
        <motion.div className="course-vs-camp" {...slam(-140, -7)}>
          <Fiche camp={me} tone="moi" label="Toi" />
        </motion.div>

        <div className="course-vs-centre" aria-hidden="true">
          {counting ? (
            <span key={count} className={cn('course-vs-compte', count === 0 && 'course-vs-compte--go')}>
              {count > 0 ? count : 'GO'}
            </span>
          ) : (
            <>
              {!reduce ? <span className="course-onde" /> : null}
              <motion.span
                className="course-vs-mot"
                initial={reduce ? { opacity: 0 } : { scale: 3, opacity: 0, rotate: -18 }}
                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 15, delay: 0.42 }}
              >
                VS
              </motion.span>
            </>
          )}
        </div>

        <motion.div className="course-vs-camp" {...slam(140, 7)}>
          <Fiche camp={rival} tone="rival" label={rival.name} />
        </motion.div>
      </div>

      <p className="course-vs-regle">
        {counting ? 'Première barre pleine gagne.' : 'Adversaire trouvé !'}
      </p>
    </div>
  )
}

function Fiche({ camp, tone, label }: { camp: VsCamp; tone: 'moi' | 'rival'; label: string }) {
  return (
    <div className={cn('course-vs-fiche', `course-vs-fiche--${tone}`)}>
      <div className="course-vs-avatar">
        <AvatarRender config={camp.avatar} className="size-full" />
        {camp.isBot ? (
          <span className="course-robot course-robot--grand" aria-label="Rival d’entraînement (robot)">
            IA
          </span>
        ) : null}
      </div>
      <p className="course-vs-nom">{label}</p>
      <p className="course-vs-trophees">
        <Trophy className="size-3.5" aria-hidden="true" /> {camp.trophies}
      </p>
      <p className="course-vs-legende">{camp.caption}</p>
    </div>
  )
}
