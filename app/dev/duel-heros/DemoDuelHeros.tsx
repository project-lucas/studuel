'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import WorldBackdrop from '@/components/WorldBackdrop'
import QuestionCard from '@/components/duel/QuestionCard'
import ArenaHeros, { type CoupDate } from '@/components/duel/heros/ArenaHeros'
import CinematiqueVictoire, { PrechargeVictoire } from '@/components/duel/heros/CinematiqueVictoire'
import VictoiresHeros from '@/components/duel/heros/VictoiresHeros'
import { Button } from '@/components/ui/button'
import styles from '@/components/duel/Course.module.css'
import { COURSE_MAX_MS, GOAL_POINTS, courseClock, goldenIndex, pointsForAnswer } from '@/lib/duel/course'
import { botOpponent, opponentTimeline } from '@/lib/duel/opponent'
import { rivalStateAt } from '@/lib/duel/rival'
import { TEMPLIER, type CinematiqueVictoire as Cinematique } from '@/lib/heros/catalogue'
import { coupDeReponse, pvRestants, victoireJouee } from '@/lib/heros/combat'
import { cn } from '@/lib/utils'
import { QUESTIONS_DEMO } from './questions'

// LA DÉMO DU DUEL DES HÉROS (29/10/2026) — un duel jouable de bout en bout
// avec le Templier, pour juger le rendu sur téléphone avant de brancher la
// vraie course. Les RÈGLES sont celles de la course classée (lib/duel :
// points, série, question dorée, rival rejoué sur sa ligne de temps) ; seule
// la PEAU change. Rien n'est envoyé au serveur, rien n'est écrit.

type Phase = 'vs' | 'combat' | 'ko' | 'victoire' | 'bilan'
type Camp = 'moi' | 'rival'

const MS_VS = 2600
const MS_SUIVANTE = 650
const MS_AVANT_KO = 450
const MS_KO = 1900
const BOT = 'malo'

type Moi = { score: number; combo: number; answered: number; correct: number }
const MOI_ZERO: Moi = { score: 0, combo: 0, answered: 0, correct: 0 }

export default function DemoDuelHeros() {
  const [partie, setPartie] = useState(1)
  return <Partie key={partie} partie={partie} onRejouer={() => setPartie((p) => p + 1)} />
}

function Partie({ partie, onRejouer }: { partie: number; onRejouer: () => void }) {
  const seed = `demo-heros-${partie}`
  const adversaire = useMemo(() => botOpponent(BOT, 0), [])
  const timeline = useMemo(
    () => (adversaire ? opponentTimeline(adversaire, seed) : null) ?? { events: [], finalScore: 0, goalAtMs: null },
    [adversaire, seed],
  )
  const doree = useMemo(() => goldenIndex(seed), [seed])
  // Une partie ne commence pas toujours par la même question.
  const depart = (partie * 7) % QUESTIONS_DEMO.length

  const [phase, setPhase] = useState<Phase>('vs')
  const [maintenant, setMaintenant] = useState(0)
  const [moi, setMoi] = useState<Moi>(MOI_ZERO)
  const [rivalScore, setRivalScore] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [shake, setShake] = useState(0)
  const [coup, setCoup] = useState<CoupDate | null>(null)
  const [ko, setKo] = useState<Camp | null>(null)
  const [gagnant, setGagnant] = useState<Camp | null>(null)
  const [fin, setFin] = useState<'ko' | 'temps'>('ko')
  const [possedees, setPossedees] = useState<string[]>([])
  const [choisie, setChoisie] = useState('serment')
  const [apercu, setApercu] = useState<Cinematique | null>(null)

  const departRef = useRef(0)
  const montreeRef = useRef(0)
  const verrouRef = useRef(false)
  const finiRef = useRef(false)
  const moiRef = useRef<Moi>(MOI_ZERO)
  const rivalRef = useRef(0)
  const idRef = useRef(0)

  const horloge = () => performance.now() - departRef.current

  const finir = useCallback((vainqueur: Camp, cause: 'ko' | 'temps' = 'ko') => {
    if (finiRef.current) return
    finiRef.current = true
    verrouRef.current = true
    setFin(cause)
    setKo(vainqueur === 'moi' ? 'rival' : 'moi')
    setGagnant(vainqueur)
    setPhase('ko')
    window.setTimeout(() => setPhase(vainqueur === 'moi' ? 'victoire' : 'bilan'), MS_KO)
  }, [])

  // L'écran VS, puis le coup d'envoi.
  useEffect(() => {
    const t = window.setTimeout(() => {
      departRef.current = performance.now()
      montreeRef.current = departRef.current
      setPhase('combat')
    }, MS_VS)
    return () => window.clearTimeout(t)
  }, [])

  // L'horloge : le rival frappe quand sa ligne de temps le dit.
  useEffect(() => {
    if (phase !== 'combat' && phase !== 'ko') return
    const id = window.setInterval(() => {
      const t = horloge()
      setMaintenant(t)
      if (finiRef.current) return
      const etat = rivalStateAt(timeline, t)
      if (etat.total > rivalRef.current) {
        const frappe = coupDeReponse({
          id: ++idRef.current,
          camp: 'rival',
          points: etat.total - rivalRef.current,
          golden: false,
          pvCible: pvRestants(rivalRef.current),
        })
        rivalRef.current = etat.total
        setRivalScore(etat.total)
        if (frappe) setCoup({ ...frappe, atMs: t })
        if (etat.total >= GOAL_POINTS) window.setTimeout(() => finir('rival'), MS_AVANT_KO)
      }
      if (t >= COURSE_MAX_MS) finir(moiRef.current.score >= rivalRef.current ? 'moi' : 'rival', 'temps')
    }, 100)
    return () => window.clearInterval(id)
  }, [phase, timeline, finir])

  const question = QUESTIONS_DEMO[(depart + qIndex) % QUESTIONS_DEMO.length]

  const repondre = (index: number) => {
    if (verrouRef.current || phase !== 'combat') return
    verrouRef.current = true
    const t = horloge()
    const bonne = index === question.correctIndex
    const avant = moiRef.current
    const points = pointsForAnswer({
      good: bonne,
      comboBefore: avant.combo,
      answerMs: performance.now() - montreeRef.current,
      golden: qIndex === doree,
    })
    const apres: Moi = {
      score: avant.score + points,
      combo: bonne ? avant.combo + 1 : 0,
      answered: avant.answered + 1,
      correct: avant.correct + (bonne ? 1 : 0),
    }
    moiRef.current = apres
    setMoi(apres)
    setSelected(index)
    setRevealed(true)
    if (!bonne) setShake((n) => n + 1)
    const frappe = coupDeReponse({
      id: ++idRef.current,
      camp: 'moi',
      points,
      golden: qIndex === doree,
      pvCible: pvRestants(avant.score),
    })
    if (frappe) setCoup({ ...frappe, atMs: t })
    setMaintenant(t)

    if (apres.score >= GOAL_POINTS) {
      window.setTimeout(() => finir('moi'), MS_AVANT_KO)
      return
    }
    window.setTimeout(() => {
      if (finiRef.current) return
      setQIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
      montreeRef.current = performance.now()
      verrouRef.current = false
    }, MS_SUIVANTE)
  }

  const victoire = victoireJouee(TEMPLIER, choisie, possedees)
  const msRestantes = Math.max(0, COURSE_MAX_MS - maintenant)

  return (
    <div className="course-scene robe-purple" data-teinte="violet">
      <WorldBackdrop className={styles.fond} teinte="violet" />
      <PrechargeVictoire victoire={victoire} />

      <header className="course-entete">
        <Link href="/defi" aria-label="Retour à l’arène" className="course-retour">
          <ArrowLeft className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </Link>
        <span className="course-matiere min-w-0 truncate">Duel des héros · démo</span>
        <span role="timer" className={cn('course-chrono', msRestantes <= 10_000 && phase === 'combat' && 'course-chrono--urgent')}>
          {courseClock(msRestantes)}
        </span>
      </header>

      <div className="course-corps">
        <ArenaHeros
          moi={{ nom: 'Toi', heros: TEMPLIER, score: moi.score }}
          rival={{ nom: adversaire?.identity.name ?? 'Rival', heros: TEMPLIER, score: rivalScore }}
          coup={coup}
          maintenant={maintenant}
          ko={ko}
          fin={fin}
          entree={phase === 'vs'}
        />

        {phase === 'vs' ? (
          <div className="course-carte text-center">
            <p className="font-heading text-lg font-extrabold">Le Templier entre en lice</p>
            <p className="mt-1 text-sm opacity-80">
              Chaque bonne réponse lance sa <strong>Charge du bouclier</strong>. La question dorée frappe en critique.
            </p>
          </div>
        ) : phase === 'combat' ? (
          <QuestionCard
            question={question}
            number={qIndex + 1}
            combo={moi.combo}
            golden={qIndex === doree}
            selected={selected}
            revealed={revealed}
            shake={shake}
            onAnswer={repondre}
          />
        ) : phase === 'ko' ? (
          <div className="course-gel" role="status">
            <span className={cn('course-gel-mot', gagnant !== 'moi' && 'course-gel-mot--perdu')}>
              {fin === 'temps'
                ? gagnant === 'moi'
                  ? 'Temps ! Tu mènes'
                  : 'Temps ! Il mène'
                : gagnant === 'moi'
                  ? 'K.O. ! Bien joué'
                  : 'Tu es K.O.'}
            </span>
          </div>
        ) : phase === 'bilan' ? (
          <Bilan
            gagne={gagnant === 'moi'}
            moi={moi}
            possedees={possedees}
            choisie={choisie}
            onVoir={setApercu}
            onChoisir={setChoisie}
            onDebloquer={(id) => {
              setPossedees((p) => (p.includes(id) ? p : [...p, id]))
              setChoisie(id)
            }}
            onRejouer={onRejouer}
          />
        ) : null}
      </div>

      {phase === 'victoire' ? (
        <CinematiqueVictoire heros={TEMPLIER} victoire={victoire} onFin={() => setPhase('bilan')} />
      ) : null}
      {apercu ? <CinematiqueVictoire heros={TEMPLIER} victoire={apercu} onFin={() => setApercu(null)} /> : null}
    </div>
  )
}

function Bilan({
  gagne,
  moi,
  possedees,
  choisie,
  onVoir,
  onChoisir,
  onDebloquer,
  onRejouer,
}: {
  gagne: boolean
  moi: Moi
  possedees: readonly string[]
  choisie: string
  onVoir: (v: Cinematique) => void
  onChoisir: (id: string) => void
  onDebloquer: (id: string) => void
  onRejouer: () => void
}) {
  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="flex items-center gap-3 rounded-3xl bg-card p-3 text-foreground">
        <div className="relative size-20 shrink-0">
          <Image
            unoptimized
            src={gagne ? TEMPLIER.poses.face : TEMPLIER.poses.ko}
            alt=""
            fill
            sizes="80px"
            className="object-contain object-bottom"
          />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-xl leading-tight font-extrabold">
            {gagne ? 'Victoire !' : 'Le Templier se relève…'}
          </p>
          <p className="text-sm text-muted-foreground">
            {moi.correct} bonne{moi.correct > 1 ? 's' : ''} réponse{moi.correct > 1 ? 's' : ''} sur {moi.answered}
            {gagne ? '' : ' — la revanche t’attend.'}
          </p>
        </div>
      </div>

      <Button size="xl" onClick={onRejouer}>
        {gagne ? 'Rejouer' : 'Revanche'}
      </Button>

      <section className="rounded-3xl bg-card p-3 text-foreground">
        <h2 className="font-heading text-base font-extrabold">Tes cinématiques de victoire</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Elles fêtent la victoire, elles ne la donnent jamais. Démo : débloquer ne débite aucune gemme.
        </p>
        <VictoiresHeros
          heros={TEMPLIER}
          possedees={possedees}
          choisie={choisie}
          onVoir={onVoir}
          onChoisir={onChoisir}
          onDebloquer={onDebloquer}
        />
      </section>
    </div>
  )
}
