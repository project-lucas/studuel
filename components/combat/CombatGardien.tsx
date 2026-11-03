'use client'

import { useEffect, useState } from 'react'
import { preload } from 'react-dom'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import ArenaCombat, { type JoueurCombat, type Replique } from '@/components/combat/ArenaCombat'
import QuestionCard from '@/components/duel/QuestionCard'
import { RANK_LABELS, type Boss, type BossRank } from '@/lib/bosses'
import { coeursDeVies, coeursDuBoss } from '@/lib/combat/coeurs'
import { combattantBoss, combattantHeros, imagesDuCombat } from '@/lib/combat/combattants'
import { coupDuGardien, type Camp, type Coup } from '@/lib/combat/coup'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { HerosKey } from '@/lib/heros/eleves'
import { cn } from '@/lib/utils'
import d from './Lice.module.css'
import t from './Taniere.module.css'

// LE COMBAT DE GARDIEN EN COMBAT DE HÉROS (02/11/2026) —
// docs/CADRAGE-COMBAT-HEROS.md § 1 et § 11, étape 5.
//
// La PEAU de la phase de combat de BossMode (la Traque) : BossMode garde ses
// règles, ses PV, ses cœurs, la file « À revoir », et c'est toujours le
// SERVEUR qui paie la victoire (claimTraqueVictory). Ici, on ne fait que
// jouer ce qui change entre deux rendus :
//   · une réponse de plus et ses PV qui baissent → mon attaque fétiche ;
//   · une réponse de plus et mes vies qui baissent → SON attaque ;
//   · ses PV à zéro → K.O., sa réplique de défaite ; mes vies → la sienne.
// L'entrée se joue comme dans Pokémon : « X veut se battre ! », sa punchline,
// puis la première question.

const MS_PREMIERE_REPLIQUE = 400
const MS_PUNCHLINE = 2100
const MS_COMBAT = 4200

/** Le gardien a-t-il ses poses de combat ? Sinon BossMode garde son écran. */
export function gardienCombattable(bossId: string): boolean {
  return combattantBoss(bossId) !== null
}

type Suivi = { repondues: number; pv: number; vies: number; serie: number; erreurs: number; coup: Coup | null }

export default function CombatGardien({
  gardien,
  rang,
  pv,
  pvMax,
  vies,
  viesMax,
  repondues,
  question,
  selected,
  onAnswer,
  onAbandon,
  moi,
  herosCle,
}: {
  gardien: Boss
  rang: BossRank
  pv: number
  pvMax: number
  vies: number
  viesMax: number
  /** Le nombre de réponses données (BossMode) : chaque pas est un coup. */
  repondues: number
  question: ModeQuestion
  selected: number | null
  onAnswer: (index: number) => void
  onAbandon: () => void
  moi: JoueurCombat
  herosCle: HerosKey
}) {
  const monHeros = combattantHeros(herosCle)
  const sonCombattant = combattantBoss(gardien.id)
  const [entree, setEntree] = useState(true)
  const [replique, setReplique] = useState<Replique | null>(null)
  const [suivi, setSuivi] = useState<Suivi>({ repondues, pv, vies, serie: 0, erreurs: 0, coup: null })

  // Le coup du dernier pas, déduit pendant le rendu (« état du rendu précédent »).
  if (repondues !== suivi.repondues) {
    const bonne = pv < suivi.pv
    const serie = bonne ? suivi.serie + 1 : 0
    setSuivi({
      repondues,
      pv,
      vies,
      serie,
      erreurs: suivi.erreurs + (bonne ? 0 : 1),
      coup: coupDuGardien({ id: repondues, bonne, serieApres: serie, atMs: 0 }),
    })
  }

  // L'entrée : il veut se battre, sa punchline, puis la première question.
  useEffect(() => {
    const t1 = window.setTimeout(
      () => setReplique({ id: 1, texte: `${gardien.name}, ${gardien.epithet}, veut se battre !` }),
      MS_PREMIERE_REPLIQUE,
    )
    const t2 = window.setTimeout(() => setReplique({ id: 2, texte: `« ${gardien.intro} »` }), MS_PUNCHLINE)
    const t3 = window.setTimeout(() => {
      setReplique(null)
      setEntree(false)
    }, MS_COMBAT)
    return () => [t1, t2, t3].forEach((x) => window.clearTimeout(x))
  }, [gardien.name, gardien.epithet, gardien.intro])

  if (!sonCombattant) return null
  if (entree) {
    for (const src of imagesDuCombat(monHeros, sonCombattant)) preload(src, { as: 'image', fetchPriority: 'low' })
  }

  const ko: Camp | null = pv <= 0 ? 'rival' : vies <= 0 ? 'moi' : null
  const repliqueKo: Replique | null = ko
    ? { id: 100 + repondues, texte: `« ${ko === 'rival' ? gardien.defeat : gardien.victory} »` }
    : null
  const bossJoueur: JoueurCombat = {
    nom: gardien.name,
    photo: { src: gardien.image ?? sonCombattant.poses.face, visage: false },
    rang: null,
    rangLabel: RANK_LABELS[rang],
  }

  return (
    <div className={cn(d.scene, t.plein)}>
      <header className={d.entete}>
        <button type="button" onClick={onAbandon} aria-label="Abandonner le combat" className={d.retour}>
          <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </button>
        <span className={cn(d.titre, 'font-heading font-extrabold')}>Traque · {gardien.name}</span>
      </header>

      <div className={d.lice}>
        <div className={t.fond} aria-hidden="true">
          {gardien.scene ? (
            <Image unoptimized src={gardien.scene} alt="" fill priority sizes="100vw" className={t.decor} />
          ) : null}
        </div>
        <ArenaCombat
          moi={{ joueur: moi, combattant: monHeros, coeurs: coeursDeVies(vies, viesMax) }}
          rival={{ joueur: bossJoueur, combattant: sonCombattant, coeurs: coeursDuBoss(pv, pvMax) }}
          coup={suivi.coup}
          ko={ko}
          entree={entree}
          serie={suivi.serie}
          replique={repliqueKo ?? replique}
          variante="boss"
        />
      </div>

      <div className={d.bas}>
        {!entree && !ko ? (
          <QuestionCard
            question={question}
            number={repondues + (selected === null ? 1 : 0)}
            combo={suivi.serie}
            golden={false}
            selected={selected}
            revealed={selected !== null}
            shake={suivi.erreurs}
            onAnswer={onAnswer}
          />
        ) : null}
        {!entree && !ko ? (
          <button type="button" onClick={onAbandon} className={d.abandon}>
            Abandonner le combat
          </button>
        ) : null}
      </div>
    </div>
  )
}
