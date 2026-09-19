'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import WorldBackdrop from '@/components/WorldBackdrop'
import RaceTrack from '@/components/duel/RaceTrack'
import QuestionCard from '@/components/duel/QuestionCard'
import VsScreen from '@/components/duel/VsScreen'
import DuelResult, { Confettis } from '@/components/duel/DuelResult'
import { useCourse, LAST_SECONDS } from '@/components/duel/useCourse'
import type { AvatarConfig } from '@/lib/avatar'
import type { ModeQuestion } from '@/lib/defi-modes'
import { courseClock } from '@/lib/duel/course'
import { opponentCaption, type Opponent } from '@/lib/duel/opponent'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { subjectVignette } from '@/lib/subject-style'
import { TEINTE_MATIERE } from '@/lib/defi/modes-catalog'
import styles from './Course.module.css'

export type DuelCourseProps = {
  pool: ModeQuestion[]
  subject: string
  subjectSlug: string
  subjectEmoji: string
  seed: string
  opponent: Opponent
  me: { name: string; avatar: AvatarConfig; trophies: number }
  hrefs: { revanche: string; nouveau: string; arene: string }
}

/**
 * LA COURSE — l'écran du duel classé, du VS au verdict.
 *
 * Plein cadre, sur SON fond, opaque (Course.module.css) : le violet de
 * l'arène éclairé dans la teinte de la matière, et la vignette de la matière
 * — celle de son dossier dans Réviser — en filigrane. L'arène ne transparaît
 * plus (Lucas, 19/09/2026 : « on voit le fond d'écran »). Quatre écrans se
 * succèdent au même endroit, sans navigation : la rencontre, le décompte, la
 * course, le résultat.
 *
 * Toute la logique vit dans `useCourse` ; ce composant ne fait que disposer.
 */
export default function DuelCourse({
  pool,
  subject,
  subjectSlug,
  subjectEmoji,
  seed,
  opponent,
  me,
  hrefs,
}: DuelCourseProps) {
  const router = useRouter()
  const view = useCourse({ pool, subjectSlug, seed, opponent })
  const rival = opponent.identity
  const rivalCaption =
    opponent.kind === 'bot' ? rival.tagline : opponentCaption(opponent)
  const urgent = view.msLeft <= LAST_SECONDS * 1000
  const enCourse = view.phase === 'playing' || view.phase === 'finish'
  const won = view.outcome !== null && view.outcome !== 'loss'
  // L'illustration de la matière (son dossier dans Réviser) et sa teinte.
  const vignette = subjectVignette(subjectSlug) ?? null
  const teinte = TEINTE_MATIERE[subject] ?? 'violet'

  const quitter = () => {
    sfx.back()
    router.push(hrefs.arene)
  }

  return (
    <div className="course-scene robe-purple" data-teinte={teinte}>
      <WorldBackdrop className={styles.fond} teinte={teinte}>
        {vignette ? (
          <Image src={vignette} alt="" width={320} height={320} className={styles.filigrane} priority />
        ) : null}
      </WorldBackdrop>

      {/* La vignette du sprint : les bords de l'écran battent en corail. */}
      <div
        aria-hidden="true"
        className={cn('course-vignette', view.sprint && enCourse && 'course-vignette--on')}
      />

      {/* L'en-tête : retour, la matière, le chrono. Fin et constant. */}
      <header className="course-entete">
        <button
          type="button"
          onClick={quitter}
          aria-label="Retour à l’arène"
          className="course-retour"
        >
          <ArrowLeft className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>
        <span className="course-matiere flex items-center gap-2">
          {vignette ? (
            <span className={cn(styles.pastille, 'size-8 p-1')} aria-hidden="true">
              <Image src={vignette} alt="" width={64} height={64} className="size-full object-contain" />
            </span>
          ) : (
            <span aria-hidden="true">{subjectEmoji}</span>
          )}
          <span className="min-w-0 truncate">{subject}</span>
        </span>
        {enCourse ? (
          <span
            role="timer"
            className={cn('course-chrono', urgent && 'course-chrono--urgent')}
          >
            {courseClock(view.msLeft)}
          </span>
        ) : (
          <span className="course-chrono course-chrono--muet" aria-hidden="true">
            1:30
          </span>
        )}
      </header>

      {view.phase === 'vs' || view.phase === 'countdown' ? (
        <VsScreen
          me={{
            name: me.name,
            avatar: me.avatar,
            trophies: me.trophies,
            caption: `${me.trophies} trophées en ${subject}`,
          }}
          rival={{
            name: rival.name,
            avatar: rival.avatar,
            trophies: rival.trophies,
            caption: rivalCaption,
            isBot: rival.isBot,
          }}
          subject={subject}
          subjectEmoji={subjectEmoji}
          vignette={vignette}
          count={view.count}
          counting={view.phase === 'countdown'}
        />
      ) : view.phase === 'result' && view.outcome ? (
        <DuelResult
          outcome={view.outcome}
          server={view.server}
          recorded={view.recorded}
          me={{ name: me.name, avatar: me.avatar, score: view.me.score, goalAtMs: view.me.goalAtMs }}
          rival={{
            name: rival.name,
            avatar: rival.avatar,
            score: view.rivalEndScore,
            goalAtMs: null,
            isBot: rival.isBot,
          }}
          bestCombo={view.me.bestCombo}
          correct={view.me.correct}
          answered={view.me.answered}
          hrefs={hrefs}
          vignette={vignette}
        />
      ) : (
        <div className="course-corps">
          <RaceTrack
            me={{ name: me.name, avatar: me.avatar, score: view.me.score }}
            rival={{ name: rival.name, avatar: rival.avatar, score: view.rival.total, isBot: rival.isBot }}
            bulle={view.bulle}
            floater={view.floater}
            sprint={view.sprint}
            thinking={view.rival.thinking}
            flash={view.flash}
          />

          {/* LE BANDEAU : un seul message à la fois, qui tombe et s'efface. */}
          <div className="course-bandeau-zone" aria-live="polite">
            {view.bandeau ? (
              <span
                key={view.bandeau.id}
                className={cn('course-bandeau', `course-bandeau--${view.bandeau.commentaire.ton}`)}
              >
                {view.bandeau.commentaire.texte}
              </span>
            ) : null}
          </div>

          {view.phase === 'finish' ? (
            <div className="course-gel" role="status">
              {won ? <Confettis /> : null}
              <span className={cn('course-gel-mot', !won && 'course-gel-mot--perdu')}>
                {won ? 'Barre pleine !' : `${rival.name} a fini`}
              </span>
            </div>
          ) : view.question ? (
            <QuestionCard
              question={view.question}
              number={view.me.answered + 1}
              combo={view.me.combo}
              golden={view.golden}
              selected={view.selected}
              revealed={view.revealed}
              shake={view.shake}
              onAnswer={view.answer}
            />
          ) : (
            <div className="course-carte text-center text-sm text-muted-foreground">
              Pas encore de questions dans cette matière — reviens bientôt !
            </div>
          )}

          <div className="course-pied">
            <button type="button" onClick={quitter} className="course-abandon">
              Abandonner
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
