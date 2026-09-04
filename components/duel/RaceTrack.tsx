'use client'

import { Crown, Flag } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import type { AvatarConfig } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { fillRatio, type Camp } from '@/lib/duel/course'
import type { Bulle } from '@/components/duel/useCourse'

/**
 * LA PISTE — deux couloirs, un par camp, qui se remplissent vers le drapeau.
 *
 * C'est l'objet central de la course : tout ce que l'élève a besoin de savoir
 * pendant qu'il répond tient ici, d'un coup d'œil, sans lire un chiffre — qui
 * mène (la couronne, le couloir le plus long), de combien (l'écart des deux
 * pointes), et s'il reste loin (le drapeau). Les scores sont là, en petit,
 * pour qui veut.
 *
 * Le couloir de l'élève est OR — l'or est la couleur du gain, et la barre qui
 * monte est un gain en train de se faire ; un reflet y court en permanence,
 * comme sur une jauge de Clash Royale. Le rival est violet clair : la couleur
 * de la marque, jamais une couleur d'alerte (le rival n'est pas un danger,
 * c'est quelqu'un).
 *
 * Quand la tête change de camp, le couloir du nouveau leader S'ALLUME une
 * fraction de seconde (`flash`) : l'œil voit le dépassement avant de lire le
 * bandeau.
 */
export type Runner = {
  name: string
  avatar: AvatarConfig
  score: number
  isBot?: boolean
}

export default function RaceTrack({
  me,
  rival,
  bulle,
  floater,
  sprint,
  thinking,
  flash,
  className,
}: {
  me: Runner
  rival: Runner
  /** La bulle du rival (✓, ✗, ou ce qu'il dit). */
  bulle: Bulle | null
  /** Les points qui viennent de tomber dans mon couloir. */
  floater: { id: number; points: number } | null
  /** Le sprint final est engagé : les bords battent. */
  sprint: boolean
  /** Le rival réfléchit (entre deux frappes). */
  thinking: boolean
  /** Le couloir qui vient de prendre la tête, le temps d'un éclair. */
  flash: Camp | null
  className?: string
}) {
  const mine = fillRatio(me.score)
  const theirs = fillRatio(rival.score)
  const lead: Camp | null =
    me.score === rival.score ? null : me.score > rival.score ? 'moi' : 'rival'

  return (
    <div
      className={cn('course-piste', sprint && 'course-piste--sprint', className)}
      role="group"
      aria-label={`Course : toi ${me.score} points, ${rival.name} ${rival.score} points`}
    >
      <Lane
        runner={me}
        ratio={mine}
        camp="moi"
        leading={lead === 'moi'}
        flashing={flash === 'moi'}
        label="Toi"
        floater={floater}
      />
      <Lane
        runner={rival}
        ratio={theirs}
        camp="rival"
        leading={lead === 'rival'}
        flashing={flash === 'rival'}
        label={rival.name}
        bulle={bulle}
        thinking={thinking}
      />
      <span className="course-drapeau" aria-hidden="true">
        <Flag className="size-4" strokeWidth={2.6} />
      </span>
    </div>
  )
}

function Lane({
  runner,
  ratio,
  camp,
  leading,
  flashing,
  label,
  floater,
  bulle,
  thinking,
}: {
  runner: Runner
  ratio: number
  camp: Camp
  leading: boolean
  flashing: boolean
  label: string
  floater?: { id: number; points: number } | null
  bulle?: Bulle | null
  thinking?: boolean
}) {
  const pct = Math.round(ratio * 1000) / 10
  return (
    <div
      className={cn(
        'course-couloir',
        `course-couloir--${camp}`,
        leading && 'course-couloir--tete',
        flashing && `course-couloir--flash-${camp}`,
      )}
    >
      <div className="course-tete">
        <AvatarRender config={runner.avatar} className="course-avatar" />
        {leading && runner.score > 0 ? (
          <span className="course-couronne" aria-label="En tête">
            <Crown className="size-4" strokeWidth={2.6} fill="currentColor" />
          </span>
        ) : null}
        {runner.isBot ? (
          <span className="course-robot" aria-label="Rival d’entraînement (robot)">
            IA
          </span>
        ) : null}
        {bulle ? (
          <span
            key={bulle.id}
            className={cn('course-bulle', `course-bulle--${bulle.humeur}`)}
            aria-live="polite"
          >
            {bulle.texte}
          </span>
        ) : thinking ? (
          <span className="course-bulle course-bulle--pense" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : null}
      </div>

      <div className="course-rail">
        <div
          className={cn('course-remplissage', `course-remplissage--${camp}`)}
          style={{ width: `${pct}%` }}
        >
          <span className="course-pointe" aria-hidden="true" />
        </div>
        {floater ? (
          <span key={floater.id} className="course-flotteur" aria-hidden="true">
            +{floater.points}
          </span>
        ) : null}
      </div>

      <div className="course-legende">
        <span className="course-nom">{label}</span>
        <span
          key={runner.score}
          className="course-score course-score--pop"
          aria-label={`${runner.score} points`}
        >
          {runner.score}
        </span>
      </div>
    </div>
  )
}
