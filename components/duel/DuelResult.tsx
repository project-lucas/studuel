'use client'

import Link from 'next/link'
import { RotateCcw, Shuffle, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AvatarRender from '@/components/avatar/AvatarRender'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import type { AvatarConfig } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { outcomeCaption, outcomeTitle, type CourseOutcome } from '@/lib/duel/course'
import type { DuelCourseOutcome } from '@/app/defi/duel-course-actions'

export type ResultCamp = {
  name: string
  avatar: AvatarConfig
  score: number
  goalAtMs: number | null
  isBot?: boolean
}

/**
 * L'ÉCRAN DE FIN de la course. Quatre choses, dans cet ordre : le verdict, le
 * face-à-face final, ce que ça rapporte, et REVANCHE en gros — la fin d'un
 * duel est le meilleur moment pour en lancer un autre, contre la même personne.
 *
 * ON N'AFFICHE QUE CE QUE LE SERVEUR A VERSÉ. Le verdict se calcule des deux
 * côtés avec les mêmes fonctions, donc il s'affiche tout de suite ; les
 * trophées et les gains attendent la réponse — un « +8 » posé avant que la
 * base ne l'ait écrit est le défaut maison n°1, et il n'entre pas ici.
 */
export default function DuelResult({
  outcome,
  server,
  recorded,
  me,
  rival,
  bestCombo,
  correct,
  answered,
  hrefs,
}: {
  outcome: CourseOutcome
  server: DuelCourseOutcome | null
  recorded: boolean
  me: ResultCamp
  rival: ResultCamp
  bestCombo: number
  correct: number
  answered: number
  hrefs: { revanche: string; nouveau: string; arene: string }
}) {
  const verdict = server?.outcome ?? outcome
  const won = verdict !== 'loss'
  const trophies = server?.trophies ?? null
  const rivalFinal = server?.rival ?? { score: rival.score, goalAtMs: rival.goalAtMs }

  return (
    <div className={cn('course-fin', won ? 'course-fin--gagnee' : 'course-fin--perdue')}>
      {won ? <Confettis /> : null}

      <h1 className="course-fin-titre">
        <span className="course-tampon">{outcomeTitle(verdict)}</span>
      </h1>
      <p className="course-fin-legende">
        {outcomeCaption(verdict, rival.name, { score: me.score, goalAtMs: me.goalAtMs }, rivalFinal)}
      </p>

      {/* Le face-à-face final : les deux barres figées, côte à côte. */}
      <div className="course-fin-face">
        <Camp camp={me} label="Toi" tone="moi" gagnant={won} />
        <span className="course-fin-vs" aria-hidden="true">
          VS
        </span>
        <Camp camp={{ ...rival, score: rivalFinal.score }} label={rival.name} tone="rival" gagnant={!won} />
      </div>

      <p className="course-fin-stats">
        {correct}/{answered} bonnes réponses · meilleure série {bestCombo}
      </p>

      {/* LES TROPHÉES — la seule chose qui monte ET descend. */}
      <div className="course-fin-trophees" aria-live="polite">
        {!recorded ? (
          <span className="course-fin-attente">Le serveur compte les trophées…</span>
        ) : trophies ? (
          <>
            <span className={cn('course-fin-delta', trophies.delta >= 0 ? 'course-fin-delta--plus' : 'course-fin-delta--moins')}>
              <Trophy className="size-5" aria-hidden="true" />
              {trophies.delta >= 0 ? '+' : ''}
              {trophies.delta}
            </span>
            <span className="course-fin-compteur">
              {trophies.before} → <strong>{trophies.after}</strong>
              {trophies.after > trophies.before && trophies.after >= trophies.best ? (
                <em> · record</em>
              ) : null}
            </span>
          </>
        ) : (
          <span className="course-fin-attente">
            {server?.rival === null
              ? 'Adversaire non vérifié : course comptée, trophées inchangés.'
              : 'Résultat non confirmé — tes trophées apparaîtront au prochain chargement.'}
          </span>
        )}
      </div>

      {server ? <PanneauRecompenses gains={server.gains} className="w-full" /> : null}

      <div className="course-fin-lignes">
        {server && server.clanPoints > 0 ? (
          <span className="course-fin-pilule">
            <Users className="size-4" aria-hidden="true" /> +{server.clanPoints} pour ton clan
          </span>
        ) : null}
        {server && server.questsCompleted.length > 0 ? (
          <span className="course-fin-pilule course-fin-pilule--or">
            {server.questDayDone
              ? '🎉 Les 3 quêtes du jour sont bouclées !'
              : `✅ ${server.questsCompleted.length} quête${server.questsCompleted.length > 1 ? 's' : ''} terminée${server.questsCompleted.length > 1 ? 's' : ''}`}
          </span>
        ) : null}
        {server?.replaySaved ? (
          <span className="course-fin-note">
            Ta course est enregistrée : elle deviendra l’adversaire d’un autre élève.
          </span>
        ) : null}
      </div>

      <div className="course-fin-boutons">
        <Button asChild size="lg" className="h-14 w-full text-lg font-extrabold">
          <Link href={hrefs.revanche}>
            <RotateCcw className="mr-2 size-5" aria-hidden="true" /> Revanche contre {rival.name}
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="h-12 w-full font-bold">
          <Link href={hrefs.nouveau}>
            <Shuffle className="mr-2 size-4" aria-hidden="true" /> Nouvel adversaire
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full text-muted-foreground">
          <Link href={hrefs.arene}>Retour à l’arène</Link>
        </Button>
      </div>
    </div>
  )
}

function Camp({
  camp,
  label,
  tone,
  gagnant,
}: {
  camp: ResultCamp
  label: string
  tone: 'moi' | 'rival'
  gagnant: boolean
}) {
  return (
    <div className={cn('course-fin-camp', `course-fin-camp--${tone}`, gagnant && 'course-fin-camp--gagnant')}>
      <div className="course-fin-avatar">
        <AvatarRender config={camp.avatar} className="size-full" />
        {camp.isBot ? <span className="course-robot">IA</span> : null}
      </div>
      <p className="course-fin-nom">{label}</p>
      <p className="course-fin-score">{camp.score}</p>
    </div>
  )
}

// Une salve de confettis en CSS (`.defi-confetti`, déjà dans l'app) : vingt-huit
// pièces, aux couleurs de la maison — or, violet, crème.
const PIECES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2
  const dist = 90 + (i % 5) * 26
  return {
    tx: `${Math.round(Math.cos(angle) * dist)}px`,
    ty: `${Math.round(Math.sin(angle) * dist - 60)}px`,
    rot: `${(i * 47) % 360}deg`,
    delay: `${(i % 7) * 35}ms`,
    color: ['#f5b722', '#7a3fe0', '#fffdf7', '#fcd34d', '#b9a6ff'][i % 5],
  }
})

export function Confettis() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 h-0" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="defi-confetti"
          style={
            {
              '--tx': p.tx,
              '--ty': p.ty,
              '--rot': p.rot,
              animationDelay: p.delay,
              background: p.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
