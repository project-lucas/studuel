'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { preload } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Swords } from 'lucide-react'
import ArenaCombat, { type JoueurCombat, type Replique } from '@/components/combat/ArenaCombat'
import QuestionCard from '@/components/duel/QuestionCard'
import FinDuelHeros from '@/components/duel/heros/FinDuelHeros'
import { coeursDuDuel, PV_DUEL } from '@/lib/combat/coeurs'
import { combattantHeros, imagesDuCombat, type Combattant } from '@/lib/combat/combattants'
import { coupDuDuel, coupRate, type Camp, type Coup } from '@/lib/combat/coup'
import { COURSE_MAX_MS, GOAL_POINTS, courseClock, goldenIndex, pointsForAnswer } from '@/lib/duel/course'
import { botOpponent, opponentTimeline } from '@/lib/duel/opponent'
import { rivalStateAt } from '@/lib/duel/rival'
import { BAREME_XP } from '@/lib/economie'
import type { Gain } from '@/lib/gains'
import { ARENE_HEROS } from '@/lib/heros/catalogue'
import type { HerosKey } from '@/lib/heros/eleves'
import { portraitSrc } from '@/lib/portraits'
import { applyGameResult } from '@/lib/trophy-road'
import { cn } from '@/lib/utils'
import { QUESTIONS_DEMO } from './questions'
import s from '@/components/combat/Lice.module.css'

// LA DÉMO DU DUEL DES HÉROS (29/10/2026, refaite le 02/11/2026 sur l'arène
// commune `ArenaCombat` — docs/CADRAGE-COMBAT-HEROS.md). Un duel jouable de
// bout en bout pour juger le rendu sur téléphone avant de brancher la vraie
// course. Les RÈGLES sont celles de la course classée (lib/duel : points,
// série, question dorée, rival rejoué sur sa ligne de temps) ; seule la PEAU
// change : les 1 000 points de la course sont CINQ CŒURS (un quart = 50
// points), chaque bonne réponse lance l'attaque fétiche du héros, la troisième
// d'affilée en SUPER, la question dorée en critique ; une réponse fausse du
// rival, c'est moi qui esquive ; une des miennes, c'est lui. Rien n'est envoyé
// au serveur, rien n'est écrit.
//
// « Comme Brawl Stars » : Rejouer cherche une nouvelle partie (un autre
// adversaire), Quitter ramène à l'arène. L'XP et les trophées de la démo
// s'additionnent d'une partie à l'autre, sans rien verser.

type Phase = 'recherche' | 'vs' | 'combat' | 'ko' | 'bilan'

const MS_RECHERCHE = 2200
const MS_VS = 2600
const MS_SUIVANTE = 900
const MS_AVANT_KO = 700
const MS_KO = 2300
/** Les robots de la démo, un nouveau à chaque partie (les plus abordables). */
const BOTS_DEMO = ['malo', 'tom', 'naim', 'rayan', 'gabriel', 'ilyes'] as const
/** Démo : les trophées du duel avant la première partie. */
const TROPHEES_DEPART = 86

type Moi = { score: number; combo: number; answered: number; correct: number }
const MOI_ZERO: Moi = { score: 0, combo: 0, answered: 0, correct: 0 }

/** L'adversaire robot : les héros qu'il peut incarner (un nouveau à chaque
 *  partie) et le rang de l'élève (un robot est réglé sur lui). */
export type RivalDemo = Omit<JoueurCombat, 'nom' | 'photo'> & { heros: readonly HerosKey[] }
/** La matière du duel (démo) : les trophées se comptent par matière. */
export type MatiereDemo = { nom: string; vignette: string | null }

export default function DemoDuelHeros({
  moi,
  herosCle,
  rival,
  matiere,
  xpDepart,
}: {
  moi: JoueurCombat
  /** Mon héros (celui de mon avatar, ou celui choisi dans l'adresse). */
  herosCle: HerosKey
  rival: RivalDemo
  matiere: MatiereDemo
  /** L'XP cumulée de l'élève (ou de l'élève de démonstration). */
  xpDepart: number
}) {
  const [partie, setPartie] = useState(1)
  const [xp, setXp] = useState(xpDepart)
  const [trophees, setTrophees] = useState(TROPHEES_DEPART)

  const monHeros = combattantHeros(herosCle)
  const sonHerosCle = rival.heros[(partie - 1) % rival.heros.length]
  const sonHeros = combattantHeros(sonHerosCle)

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
      monHeros={monHeros}
      sonHeros={sonHeros}
      sonHerosCle={sonHerosCle}
      images={imagesDuCombat(monHeros, sonHeros)}
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
  monHeros,
  sonHeros,
  sonHerosCle,
  images,
  rivalDemo,
  matiere,
  xpAvant,
  tropheesAvant,
  onRejouer,
}: {
  partie: number
  moi: JoueurCombat
  monHeros: Combattant
  /** Le héros que le robot incarne pour cette partie. */
  sonHeros: Combattant
  sonHerosCle: HerosKey
  /** Ce qui se charge pendant la recherche d'un adversaire. */
  images: readonly string[]
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
  const monNom = monHeros.nom
  const rivalJoueur: JoueurCombat = {
    nom: rivalNom,
    photo: { src: portraitSrc(sonHerosCle), visage: true },
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
  const [coup, setCoup] = useState<Coup | null>(null)
  const [replique, setReplique] = useState<Replique | null>(null)
  const [ko, setKo] = useState<Camp | null>(null)
  const [fin, setFin] = useState<'ko' | 'temps'>('ko')
  const [gagnant, setGagnant] = useState<Camp | null>(null)

  const departRef = useRef(0)
  const montreeRef = useRef(0)
  const verrouRef = useRef(false)
  const finiRef = useRef(false)
  const moiRef = useRef<Moi>(MOI_ZERO)
  const rivalRef = useRef({ total: 0, answered: 0 })
  const idRef = useRef(0)

  // Pendant la recherche, tout le combat se charge : les poses des deux
  // héros, leurs attaques, les cœurs. Au coup d'envoi, rien n'attend.
  if (phase === 'recherche') {
    for (const src of images) preload(src, { as: 'image', fetchPriority: 'low' })
  }

  const horloge = () => performance.now() - departRef.current

  const finir = useCallback(
    (vainqueur: Camp, cause: 'ko' | 'temps' = 'ko') => {
      if (finiRef.current) return
      finiRef.current = true
      verrouRef.current = true
      const perdant: Camp = vainqueur === 'moi' ? 'rival' : 'moi'
      setFin(cause)
      setKo(perdant)
      setGagnant(vainqueur)
      setPhase('ko')
      setReplique({
        id: ++idRef.current,
        texte:
          perdant === 'rival'
            ? `${rivalNom} est K.O. ! Tu remportes le duel.`
            : `${monNom} est K.O. ! ${rivalNom} remporte le duel.`,
      })
      window.setTimeout(() => setPhase('bilan'), MS_KO)
    },
    [rivalNom, monNom],
  )

  // La recherche d'un adversaire, l'écran VS (sa réplique), puis le coup d'envoi.
  useEffect(() => {
    const trouve = window.setTimeout(() => {
      setPhase('vs')
      setReplique({ id: 1, texte: `${rivalNom} veut se battre !` })
    }, MS_RECHERCHE)
    const envoi = window.setTimeout(() => {
      departRef.current = performance.now()
      montreeRef.current = departRef.current
      setReplique(null)
      setPhase('combat')
    }, MS_RECHERCHE + MS_VS)
    return () => {
      window.clearTimeout(trouve)
      window.clearTimeout(envoi)
    }
  }, [rivalNom])

  // L'horloge : le rival frappe (ou rate, et j'esquive) quand sa ligne de temps le dit.
  useEffect(() => {
    if (phase !== 'combat') return
    const id = window.setInterval(() => {
      const t = horloge()
      setMaintenant(t)
      if (finiRef.current) return
      const etat = rivalStateAt(timeline, t)
      const avant = rivalRef.current
      if (etat.answered > avant.answered) {
        rivalRef.current = { total: etat.total, answered: etat.answered }
        if (etat.total > avant.total) {
          const frappe = coupDuDuel({
            id: ++idRef.current,
            camp: 'rival',
            points: etat.total - avant.total,
            pvCible: PV_DUEL - avant.total,
            golden: false,
            serieApres: etat.combo,
            atMs: t,
          })
          setRivalScore(etat.total)
          if (frappe) setCoup(frappe)
          if (etat.total >= GOAL_POINTS) window.setTimeout(() => finir('rival'), MS_AVANT_KO)
        } else {
          // Il s'est trompé : son attaque part, et j'esquive.
          setCoup(coupRate({ id: ++idRef.current, camp: 'rival', atMs: t }))
        }
      }
      if (t >= COURSE_MAX_MS) finir(moiRef.current.score >= rivalRef.current.total ? 'moi' : 'rival', 'temps')
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
    const golden = qIndex === doree
    const points = pointsForAnswer({
      good: bonne,
      comboBefore: avant.combo,
      answerMs: performance.now() - montreeRef.current,
      golden,
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
    if (bonne) {
      const frappe = coupDuDuel({
        id: ++idRef.current,
        camp: 'moi',
        points,
        pvCible: PV_DUEL - avant.score,
        golden,
        serieApres: apres.combo,
        atMs: t,
      })
      if (frappe) setCoup(frappe)
    } else {
      // Mon attaque part… et il l'esquive.
      setShake((n) => n + 1)
      setCoup(coupRate({ id: ++idRef.current, camp: 'moi', atMs: t }))
    }
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
          sur l'écran — sinon les héros se battaient devant le château. */}
      <div className={s.lice}>
        <div className={s.fond} aria-hidden="true">
          <Image unoptimized src={ARENE_HEROS} alt="" width={900} height={1613} priority className={s.decor} />
        </div>
        <ArenaCombat
          moi={{ joueur: moiJoueur, combattant: monHeros, coeurs: coeursDuDuel(PV_DUEL - rivalScore) }}
          rival={{ joueur: rivalJoueur, combattant: sonHeros, coeurs: coeursDuDuel(PV_DUEL - moi.score) }}
          coup={coup}
          ko={ko}
          fin={fin}
          entree={phase === 'recherche' || phase === 'vs'}
          recherche={phase === 'recherche'}
          serie={moi.combo}
          replique={replique}
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
              {matiere.nom} · {monHeros.nom}
            </p>
          </div>
        ) : phase === 'vs' ? (
          <div className="course-carte text-center">
            <p className="mt-1 text-sm opacity-80">
              Chaque bonne réponse lance ta <strong>{monHeros.attaque.nom}</strong>. Trois d’affilée : le super. La
              question dorée frappe en critique.
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
    </div>
  )
}
