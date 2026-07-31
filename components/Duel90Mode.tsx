'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Swords,
  Zap,
  Trophy,
  Flame,
  RotateCcw,
  Users,
  Target,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { gameSfx, sfx, buzz } from '@/lib/sounds'
// `nowMs` plutôt que `Date.now` : l'horloge du jeu passe par lib/defi-modes,
// où elle est déclarée comme donnée d'ÉVÉNEMENT (l'instant où le joueur agit)
// et jamais lue pendant le rendu — c'est aussi ce que vérifie react-hooks/purity.
import { MODE_TIMBRE, nowMs, type ModeQuestion } from '@/lib/defi-modes'
import { recordDuel90, type Duel90Outcome } from '@/app/defi/duel90-actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import {
  DUEL_MS,
  DUEL_SECONDS,
  answerPoints,
  buildRival,
  comboMultiplier,
  rivalScoreAt,
  clockLabel,
  outcomeHeadline,
  accuracyLabel,
  duel90Outcome,
  type RivalProfile,
} from '@/lib/duel90'

type Phase = 'playing' | 'done'

/** Cadence de rafraîchissement de la course. 100 ms : la barre du rival bouge
 *  visiblement sans jamais coûter un rendu à chaque frame. */
const TICK_MS = 100

/** Délai avant la question suivante. Court : le duel ne doit jamais donner
 *  l'impression d'attendre — c'est là que se perd le « encore une ». */
const NEXT_QUESTION_MS = 420

export type Duel90Props = {
  pool: ModeQuestion[]
  /** Nom du rival affiché en face. */
  rivalName: string
  /** Niveau du rival et de l'élève : ils règlent la difficulté. */
  rivalLevel: number
  myLevel: number
  /** Graine du duel : deux duels différents = deux rivaux différents. */
  seed: string
  /** Chapitre joué — remonté au serveur pour les quêtes. */
  chapterId?: string
  /** Titre affiché en haut (« Théorème de Thalès »). */
  chapterTitle?: string
  /** Pourquoi ce chapitre (« Contrôle dans 3 jours »). */
  reason?: string
  onExit: () => void
  /** Relancer un duel : la même page recharge une nouvelle graine. */
  onReplay?: () => void
}

/**
 * Duel 90 s — la boucle centrale du jeu.
 *
 * Une seule règle : marquer plus de points que le rival en 90 secondes. Son
 * score monte EN DIRECT à côté du tien, ce qui rend chaque seconde lisible
 * (« il me repasse devant ») sans qu'aucun joueur réel ait à être connecté.
 */
export default function Duel90Mode({
  pool,
  rivalName,
  rivalLevel,
  myLevel,
  seed,
  chapterId,
  chapterTitle,
  reason,
  onExit,
  onReplay,
}: Duel90Props) {
  // Le duel sonne BOIS : chaud et net, à mi-chemin entre la nervosité du Blitz
  // et la gravité du Boss. C'est le timbre de la maison.
  const audio = useMemo(() => gameSfx(MODE_TIMBRE.duel), [])
  const rival: RivalProfile = useMemo(
    () => buildRival(seed, rivalName, rivalLevel, myLevel),
    [seed, rivalName, rivalLevel, myLevel],
  )

  const [phase, setPhase] = useState<Phase>('playing')
  const [msLeft, setMsLeft] = useState(DUEL_MS)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [rivalScore, setRivalScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [floater, setFloater] = useState<{ id: number; points: number } | null>(null)
  const [outcome, setOutcome] = useState<Duel90Outcome | null>(null)
  // L'aller-retour serveur est terminé (avec OU sans résultat). Tant qu'il court,
  // l'écran de fin n'a AUCUN chiffre à annoncer : afficher « +0 XP » en
  // attendant, c'est mentir puis se corriger — le défaut maison n°1.
  const [recorded, setRecorded] = useState(false)

  // Miroirs synchrones : la fin de partie est déclenchée par le chrono, dont le
  // callback ne voit pas les states frais (même contrainte que le Blitz).
  const statsRef = useRef({ score: 0, correct: 0, answered: 0, bestCombo: 0 })
  const startedAtRef = useRef(0)
  const finishedRef = useRef(false)
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Verrou anti-double-tap : la garde `selected` est en retard d'un rendu.
  const lockRef = useRef(false)
  // Instant de l'affichage de la question courante → bonus de vitesse.
  const shownAtRef = useRef(0)
  const floaterIdRef = useRef(0)

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const answered = selected !== null
  const multiplier = comboMultiplier(combo)

  // Le duel démarre SEUL, sans écran d'intro ni bouton « GO » : la page a déjà
  // été ouverte exprès. Chaque écran intermédiaire coûte des joueurs.
  useEffect(() => {
    startedAtRef.current = nowMs()
    shownAtRef.current = nowMs()
    sfx.flip()
  }, [])

  useEffect(() => {
    lockRef.current = false
    shownAtRef.current = nowMs()
  }, [qIndex])

  // La course : chrono + score du rival, dans la même horloge.
  useEffect(() => {
    if (phase !== 'playing') return

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      const s = statsRef.current
      const rivalFinal = rival.finalScore
      const issue = duel90Outcome(s.score, rivalFinal)
      if (issue === 'win') audio.win()
      else audio.lose()
      setPhase('done')

      // Tout est recalculé côté serveur : ces valeurs ne servent qu'à afficher
      // la fin de partie sans attendre le réseau.
      recordDuel90(s.score, s.correct, s.answered, s.bestCombo, rivalFinal, chapterId)
        .then((o) => {
          setOutcome(o)
          setRecorded(true)
        })
        .catch(() => {
          setOutcome(null)
          setRecorded(true)
        })
      recordReviewAnswers(reviewsRef.current).catch(() => {})
    }

    let lastSecond = DUEL_SECONDS
    const id = setInterval(() => {
      // Appli en arrière-plan : on ne touche à rien ici. La compensation se fait
      // sur l'événement `visibilitychange` (effet ci-dessous), qui mesure la
      // durée RÉELLE de l'absence.
      if (document.visibilityState !== 'visible') return
      const elapsed = nowMs() - startedAtRef.current
      const left = Math.max(0, DUEL_MS - elapsed)
      setMsLeft(left)
      setRivalScore(rivalScoreAt(rival, elapsed))

      // Les dix dernières secondes s'entendent : le tic monte en urgence.
      const sec = Math.ceil(left / 1000)
      if (sec !== lastSecond) {
        lastSecond = sec
        if (sec <= 10 && sec > 0) audio.tick(1 - sec / 10)
      }
      if (left === 0) finish()
    }, TICK_MS)
    return () => clearInterval(id)
  }, [phase, rival, audio, chapterId])

  // Le duel ne se consomme PAS pendant que l'appli est en arrière-plan — et ça
  // demande de mesurer l'absence, pas de la deviner. L'ancienne compensation
  // (+TICK_MS par tour de boucle) ne pouvait pas marcher : un onglet caché voit
  // son `setInterval` bridé à ~1 Hz, donc cinq minutes passées ailleurs
  // n'étaient rattrapées que de 30 secondes — on revenait sur un duel perdu.
  // Sur une appli qu'on joue en changeant d'appli sans arrêt, c'était le duel
  // volé au joueur, sans un mot.
  useEffect(() => {
    if (phase !== 'playing') return
    let hiddenAt = document.visibilityState === 'hidden' ? nowMs() : 0
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = nowMs()
        return
      }
      if (hiddenAt === 0) return
      const away = nowMs() - hiddenAt
      hiddenAt = 0
      startedAtRef.current += away
      // Le bonus de vitesse de la question affichée non plus : répondre en
      // revenant ne doit pas être puni du temps passé ailleurs.
      shownAtRef.current += away
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [phase])

  const answer = (i: number) => {
    if (!question || answered || lockRef.current || finishedRef.current) return
    lockRef.current = true
    setSelected(i)

    const good = i === question.correctIndex
    const answerMs = nowMs() - shownAtRef.current
    reviewsRef.current.push({
      kind: 'question',
      id: question.id,
      subject: question.subject,
      good,
    })
    statsRef.current.answered += 1
    setAnsweredCount((n) => n + 1)

    if (good) {
      const points = answerPoints(combo, answerMs)
      audio.correct(combo + 1)
      buzz(true, combo + 1)
      statsRef.current.score += points
      statsRef.current.correct += 1
      setScore((s) => s + points)
      setCorrect((n) => n + 1)
      setCombo((c) => {
        const next = c + 1
        statsRef.current.bestCombo = Math.max(statsRef.current.bestCombo, next)
        setBestCombo((b) => Math.max(b, next))
        return next
      })
      floaterIdRef.current += 1
      setFloater({ id: floaterIdRef.current, points })
    } else {
      // L'erreur ne retire aucun point : elle coûte déjà la série et le temps.
      if (combo >= 3) audio.lifeLost()
      else audio.wrong()
      buzz(false, combo)
      setCombo(0)
    }

    window.setTimeout(() => {
      setQIndex((n) => n + 1)
      setSelected(null)
      setFloater(null)
    }, NEXT_QUESTION_MS)
  }

  // ------------------------------------------------------------------- fin
  if (phase === 'done') {
    const result = outcome?.result ?? null
    const issue = result?.outcome ?? duel90Outcome(score, rival.finalScore)
    const won = issue === 'win'
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-6 text-center">
        <div className="animate-in zoom-in text-6xl duration-500">
          {won ? '🏆' : issue === 'draw' ? '🤝' : '💪'}
        </div>
        <h1 className="font-heading text-3xl font-bold">{outcomeHeadline(issue)}</h1>

        {/* Le face-à-face final : ton score contre le sien, côte à côte. */}
        <div className="flex w-full items-stretch gap-3">
          <ScoreCard label="Toi" score={score} highlight={won} />
          <div className="flex items-center font-heading text-lg text-muted-foreground">
            VS
          </div>
          <ScoreCard label={rival.name} score={rival.finalScore} highlight={!won} />
        </div>

        <p className="text-sm text-muted-foreground">
          {accuracyLabel(correct, answeredCount)} bonnes réponses · meilleure série{' '}
          {bestCombo}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Pill icon={<Zap className="size-4" />} tone="highlight">
            {result ? `+${result.xp} XP` : '… XP'}
          </Pill>
          <Pill
            icon={<Trophy className="size-4" />}
            tone={won ? 'primary' : 'muted'}
          >
            {result
              ? `${result.trophies >= 0 ? '+' : ''}${result.trophies} 🏆`
              : '… 🏆'}
          </Pill>
          {outcome && outcome.crowns > 0 ? (
            <Pill icon={<Crown className="size-4" />} tone="muted">
              +{outcome.crowns} couronnes
            </Pill>
          ) : null}
          {outcome && outcome.clanPoints > 0 ? (
            <Pill icon={<Users className="size-4" />} tone="muted">
              +{outcome.clanPoints} pour ton clan
            </Pill>
          ) : null}
        </div>

        {/* Le serveur a répondu, mais sans résultat : l'appel a échoué (réseau).
            On ne peut pas savoir si l'XP a été versée — le dire vaut mieux que
            d'afficher un zéro qui passerait pour la vérité. */}
        {recorded && !result ? (
          <p className="text-sm text-muted-foreground">
            Résultat non confirmé par le serveur — ton XP apparaîtra au prochain
            chargement.
          </p>
        ) : null}

        {outcome && outcome.questsCompleted.length > 0 ? (
          <p className="animate-in slide-in-from-bottom-2 rounded-full bg-highlight/20 px-4 py-1.5 text-sm font-semibold">
            {outcome.questDayDone
              ? '🎉 Les 3 quêtes du jour sont bouclées !'
              : `✅ ${outcome.questsCompleted.length} quête${
                  outcome.questsCompleted.length > 1 ? 's' : ''
                } terminée${outcome.questsCompleted.length > 1 ? 's' : ''}`}
          </p>
        ) : null}

        {/* Rejouer est le bouton PRINCIPAL et le plus gros de l'écran : la fin
            d'un duel est le meilleur moment pour en lancer un autre. */}
        <div className="flex w-full flex-col gap-2 pt-2">
          {onReplay ? (
            <Button size="lg" onClick={onReplay} className="h-14 text-lg font-bold">
              <RotateCcw className="mr-2 size-5" /> Rejouer
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onExit}>
            Retour à l&apos;arène
          </Button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------- en jeu
  const leading = score >= rivalScore
  // Part de la barre de tir à la corde. À 0-0, le duel démarre à égalité.
  const sum = score + rivalScore
  const myShare = sum === 0 ? 50 : Math.round((score / sum) * 100)
  const urgent = msLeft <= 10_000

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {/* Bandeau de course : les deux scores et le chrono, toujours visibles. */}
      <div className="rounded-2xl border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <Side name="Toi" score={score} leading={leading} />
          <div
            className={cn(
              'font-mono text-2xl font-bold tabular-nums transition-colors',
              urgent && 'animate-pulse text-destructive',
            )}
          >
            {clockLabel(msLeft)}
          </div>
          <Side name={rival.name} score={rivalScore} leading={!leading} mirrored />
        </div>

        {/* Tir à la corde : une seule barre, ta part à gauche. Le point de
            bascule au milieu se lit d'un coup d'œil — mieux que deux jauges
            parallèles qu'il faudrait comparer. */}
        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-destructive/60">
          <div
            className="bg-primary transition-all duration-200 ease-out"
            style={{ width: `${myShare}%` }}
          />
        </div>
      </div>

      {chapterTitle ? (
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Target className="size-3.5" />
          <span className="font-semibold text-foreground">{chapterTitle}</span>
          {reason ? <span>· {reason}</span> : null}
        </p>
      ) : null}

      {/* Série en cours : le multiplicateur doit se voir monter. */}
      {combo >= 3 ? (
        <p className="animate-in zoom-in flex items-center justify-center gap-1.5 text-sm font-bold text-highlight-foreground">
          <Flame className="size-4 text-highlight" /> Série de {combo} · points ×
          {multiplier}
        </p>
      ) : null}

      {question ? (
        <div className="relative rounded-2xl border bg-card p-5 shadow-sm">
          {floater ? (
            <span
              key={floater.id}
              className="animate-in fade-in slide-in-from-bottom-4 pointer-events-none absolute -top-3 right-4 font-mono text-xl font-bold text-primary duration-300"
            >
              +{floater.points}
            </span>
          ) : null}
          <p className="text-center font-heading text-lg font-semibold">
            {question.prompt}
          </p>
          <div className="mt-4 grid gap-2">
            {question.options.map((opt, i) => {
              const isRight = i === question.correctIndex
              const isPicked = selected === i
              return (
                <button
                  key={`${question.id}-${i}`}
                  type="button"
                  onClick={() => answer(i)}
                  disabled={answered}
                  className={cn(
                    'min-h-12 rounded-xl border-2 px-4 py-3 text-left font-medium transition-all',
                    'active:scale-[0.98] disabled:cursor-default',
                    !answered && 'hover:border-primary hover:bg-primary/5',
                    answered && isRight && 'border-primary bg-primary/15',
                    answered && isPicked && !isRight &&
                      'border-destructive bg-destructive/15',
                    answered && !isPicked && !isRight && 'opacity-50',
                  )}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
          Pas encore de questions sur ce chapitre — reviens bientôt !
        </div>
      )}

      <button
        type="button"
        onClick={onExit}
        className="mx-auto text-xs text-muted-foreground underline underline-offset-4"
      >
        Abandonner
      </button>
    </div>
  )
}

// --- Petits blocs d'affichage -------------------------------------------------

function Side({
  name,
  score,
  leading,
  mirrored = false,
}: {
  name: string
  score: number
  leading: boolean
  mirrored?: boolean
}) {
  return (
    <div className={cn('flex-1', mirrored ? 'text-right' : 'text-left')}>
      <p className="truncate text-xs text-muted-foreground">{name}</p>
      <p
        className={cn(
          'font-mono text-xl font-bold tabular-nums transition-colors',
          leading ? 'text-primary' : 'text-foreground',
        )}
      >
        {score}
      </p>
    </div>
  )
}

function ScoreCard({
  label,
  score,
  highlight,
}: {
  label: string
  score: number
  highlight: boolean
}) {
  return (
    <div
      className={cn(
        'flex-1 rounded-2xl border-2 p-4',
        highlight ? 'border-primary bg-primary/10' : 'border-border bg-card',
      )}
    >
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-3xl font-bold tabular-nums">{score}</p>
    </div>
  )
}

function Pill({
  icon,
  tone,
  children,
}: {
  icon: React.ReactNode
  tone: 'highlight' | 'primary' | 'muted'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-sm font-bold tabular-nums shadow-sm',
        tone === 'highlight' && 'bg-highlight text-foreground',
        tone === 'primary' && 'bg-primary text-primary-foreground',
        tone === 'muted' && 'bg-muted text-foreground',
      )}
    >
      {icon}
      {children}
    </span>
  )
}

// Icône exportée pour l'entête de la page de duel (même vocabulaire visuel).
export { Swords as DuelIcon }
