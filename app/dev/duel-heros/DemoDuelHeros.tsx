'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Swords } from 'lucide-react'
import QuestionCard from '@/components/duel/QuestionCard'
import ArenaHeros, { type CoupDate, type JoueurDuel } from '@/components/duel/heros/ArenaHeros'
import CinematiqueVictoire, { PrechargeVictoire } from '@/components/duel/heros/CinematiqueVictoire'
import FinDuelHeros from '@/components/duel/heros/FinDuelHeros'
import { COURSE_MAX_MS, GOAL_POINTS, courseClock, goldenIndex, pointsForAnswer } from '@/lib/duel/course'
import { botOpponent, opponentTimeline } from '@/lib/duel/opponent'
import { rivalStateAt } from '@/lib/duel/rival'
import { BAREME_XP } from '@/lib/economie'
import type { Gain } from '@/lib/gains'
import { ARENE_HEROS, TEMPLIER } from '@/lib/heros/catalogue'
import { coupDeReponse, pvRestants, victoireParDefaut } from '@/lib/heros/combat'
import { applyGameResult } from '@/lib/trophy-road'
import { cn } from '@/lib/utils'
import { QUESTIONS_DEMO } from './questions'
import s from './DemoDuelHeros.module.css'

// LA DÉMO DU DUEL DES HÉROS (29/10/2026) — un duel jouable de bout en bout
// avec le Templier, pour juger le rendu sur téléphone avant de brancher la
// vraie course. Les RÈGLES sont celles de la course classée (lib/duel :
// points, série, question dorée, rival rejoué sur sa ligne de temps) ; seule
// la PEAU change. Rien n'est envoyé au serveur, rien n'est écrit.
//
// Retours de Lucas le soir même : plus de fond violet, la lice de l'académie
// derrière le combat (le SABLE sous les héros, pas le château) ; l'avatar et
// le rang de l'élève sur sa plaque ; une fin de partie gamifiée dont les
// barres montent en direct ; « comme Brawl Stars » : Rejouer cherche une
// nouvelle partie (un autre adversaire), Quitter ramène à l'arène. L'XP et les
// trophées de la démo s'additionnent d'une partie à l'autre, sans rien verser.

type Phase = 'recherche' | 'vs' | 'combat' | 'ko' | 'victoire' | 'bilan'
type Camp = 'moi' | 'rival'

const MS_RECHERCHE = 2200
const MS_VS = 2600
const MS_SUIVANTE = 650
const MS_AVANT_KO = 450
const MS_KO = 1900
/** Les robots de la démo, un nouveau à chaque partie (les plus abordables). */
const BOTS_DEMO = ['malo', 'tom', 'naim', 'rayan', 'gabriel', 'ilyes'] as const
/** Démo : les trophées du duel avant la première partie. */
const TROPHEES_DEPART = 86

type Moi = { score: number; combo: number; answered: number; correct: number }
const MOI_ZERO: Moi = { score: 0, combo: 0, answered: 0, correct: 0 }

/** L'adversaire robot : ses portraits possibles et le rang de l'élève (un robot est réglé sur lui). */
export type RivalDemo = Omit<JoueurDuel, 'nom' | 'photo'> & { portraits: readonly string[] }
/** La matière du duel (démo) : les trophées se comptent par matière. */
export type MatiereDemo = { nom: string; vignette: string | null }

export default function DemoDuelHeros({
  moi,
  rival,
  matiere,
  xpDepart,
}: {
  moi: JoueurDuel
  rival: RivalDemo
  matiere: MatiereDemo
  /** L'XP cumulée de l'élève (ou de l'élève de démonstration). */
  xpDepart: number
}) {
  const [partie, setPartie] = useState(1)
  const [xp, setXp] = useState(xpDepart)
  const [trophees, setTrophees] = useState(TROPHEES_DEPART)

  const rejouer = useCallback((gainXp: number, deltaTrophees: number) => {
    setXp((v) => v + gainXp)
    setTrophees((v) => Math.max(0, v + deltaTrophees))
    setPartie((p) => p + 1)
  }, [])

  return (
    <Partie
      key={partie}
      partie={partie}
      moi={moi}
      rivalDemo={rival}
      matiere={matiere}
      xpAvant={xp}
      tropheesAvant={trophees}
      onRejouer={rejouer}
    />
  )
}

function Partie({
  partie,
  moi: moiJoueur,
  rivalDemo,
  matiere,
  xpAvant,
  tropheesAvant,
  onRejouer,
}: {
  partie: number
  moi: JoueurDuel
  rivalDemo: RivalDemo
  matiere: MatiereDemo
  xpAvant: number
  tropheesAvant: number
  onRejouer: (gainXp: number, deltaTrophees: number) => void
}) {
  const seed = `demo-heros-${partie}`
  const botId = BOTS_DEMO[(partie - 1) % BOTS_DEMO.length]
  const adversaire = useMemo(() => botOpponent(botId, tropheesAvant), [botId, tropheesAvant])
  const timeline = useMemo(
    () => (adversaire ? opponentTimeline(adversaire, seed) : null) ?? { events: [], finalScore: 0, goalAtMs: null },
    [adversaire, seed],
  )
  const doree = useMemo(() => goldenIndex(seed), [seed])
  // Une partie ne commence pas toujours par la même question.
  const depart = (partie * 7) % QUESTIONS_DEMO.length
  const rivalNom = adversaire?.identity.name ?? 'Rival'
  const rivalJoueur: JoueurDuel = {
    nom: rivalNom,
    photo: { src: rivalDemo.portraits[(partie - 1) % rivalDemo.portraits.length], visage: true },
    rang: rivalDemo.rang,
    rangLabel: rivalDemo.rangLabel,
  }

  const [phase, setPhase] = useState<Phase>('recherche')
  const [maintenant, setMaintenant] = useState(0)
  const [moi, setMoi] = useState<Moi>(MOI_ZERO)
  const [rivalScore, setRivalScore] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [shake, setShake] = useState(0)
  const [coup, setCoup] = useState<CoupDate | null>(null)
  const [ko, setKo] = useState<Camp | null>(null)
  const [fin, setFin] = useState<'ko' | 'temps'>('ko')
  const [gagnant, setGagnant] = useState<Camp | null>(null)

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

  // La recherche d'un adversaire, l'écran VS, puis le coup d'envoi.
  useEffect(() => {
    const trouve = window.setTimeout(() => setPhase('vs'), MS_RECHERCHE)
    const envoi = window.setTimeout(() => {
      departRef.current = performance.now()
      montreeRef.current = departRef.current
      setPhase('combat')
    }, MS_RECHERCHE + MS_VS)
    return () => {
      window.clearTimeout(trouve)
      window.clearTimeout(envoi)
    }
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

  const victoire = victoireParDefaut(TEMPLIER)
  const msRestantes = Math.max(0, COURSE_MAX_MS - maintenant)
  const gagne = gagnant === 'moi'
  // Une défaite ne retire jamais d'XP : la course rapporte toujours la sienne.
  // Les trophées suivent la route des trophées (lib/trophy-road).
  const xpGagnee = gagne ? BAREME_XP.duel.maxPartie : BAREME_XP.duel.base
  const deltaTrophees = applyGameResult(tropheesAvant, gagne).delta
  const gains: Gain[] = [
    { unite: 'xp', montant: xpGagnee },
    ...(deltaTrophees > 0 ? [{ unite: 'trophee' as const, montant: deltaTrophees }] : []),
  ]

  return (
    <div className={s.scene}>
      <PrechargeVictoire victoire={victoire} />

      <header className={s.entete}>
        <Link href="/defi" aria-label="Retour à l’arène" className={s.retour}>
          <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </Link>
        <span className={cn(s.titre, 'font-heading font-extrabold')}>Duel des héros</span>
        <span
          role="timer"
          className={cn(s.chrono, 'font-heading tabular-nums')}
          data-urgent={msRestantes <= 10_000 && phase === 'combat' ? 'true' : undefined}
        >
          {courseClock(msRestantes)}
        </span>
      </header>

      {/* La lice : le décor est calé sur ELLE (le sable sous les héros), pas
          sur l'écran — sinon les chevaliers se battaient devant le château. */}
      <div className={s.lice}>
        <div className={s.fond} aria-hidden="true">
          <Image unoptimized src={ARENE_HEROS} alt="" width={900} height={1613} priority className={s.decor} />
        </div>
        <ArenaHeros
          moi={{ joueur: moiJoueur, heros: TEMPLIER, score: moi.score }}
          rival={{ joueur: rivalJoueur, heros: TEMPLIER, score: rivalScore }}
          coup={coup}
          maintenant={maintenant}
          ko={ko}
          fin={fin}
          entree={phase === 'recherche' || phase === 'vs'}
          recherche={phase === 'recherche'}
        />
      </div>

      <div className={s.bas}>
        {phase === 'recherche' ? (
          <div className={cn('course-carte', s.recherche)} role="status">
            <span className={s.recherchePicto} aria-hidden="true">
              <Swords className="size-7" strokeWidth={2.4} />
            </span>
            <p className="font-heading text-lg font-extrabold">Recherche d’un adversaire…</p>
            <p className="text-sm font-semibold opacity-75">
              {matiere.nom} · {TEMPLIER.nom}
            </p>
          </div>
        ) : phase === 'vs' ? (
          <div className="course-carte text-center">
            <p className="font-heading text-lg font-extrabold">{rivalNom} entre en lice !</p>
            <p className="mt-1 text-sm opacity-80">
              Chaque bonne réponse lance ta <strong>Charge du bouclier</strong>. La question dorée frappe en critique.
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
          <div className={s.gel} role="status" data-perdu={gagne ? undefined : 'true'}>
            <span className="font-heading font-extrabold">
              {fin === 'temps'
                ? gagne
                  ? 'Temps ! Tu mènes'
                  : `Temps ! ${rivalNom} mène`
                : gagne
                  ? 'K.O. ! Bien joué'
                  : 'Tu es K.O.'}
            </span>
          </div>
        ) : null}
      </div>

      {phase === 'bilan' ? (
        <FinDuelHeros
          gagne={gagne}
          matiere={matiere}
          gains={gains}
          xpAvant={xpAvant}
          tropheesAvant={tropheesAvant}
          onRejouer={() => onRejouer(xpGagnee, deltaTrophees)}
        />
      ) : null}
      {phase === 'victoire' ? (
        <CinematiqueVictoire heros={TEMPLIER} victoire={victoire} onFin={() => setPhase('bilan')} />
      ) : null}
    </div>
  )
}
