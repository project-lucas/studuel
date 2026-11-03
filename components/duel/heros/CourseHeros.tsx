'use client'

import { useState } from 'react'
import { preload } from 'react-dom'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import ArenaCombat, { type JoueurCombat, type Replique } from '@/components/combat/ArenaCombat'
import QuestionCard from '@/components/duel/QuestionCard'
import { LAST_SECONDS, type CourseView } from '@/components/duel/useCourse'
import { coeursDuDuel, PV_DUEL } from '@/lib/combat/coeurs'
import { combattantHeros, imagesDuCombat } from '@/lib/combat/combattants'
import { coupDeLaCourse, type Camp, type Coup, type InstantCourse } from '@/lib/combat/coup'
import { courseClock, GOAL_POINTS } from '@/lib/duel/course'
import { ARENE_HEROS } from '@/lib/heros/catalogue'
import type { HerosKey } from '@/lib/heros/eleves'
import { cn } from '@/lib/utils'
import s from '@/components/combat/Lice.module.css'

// LA COURSE CLASSÉE, EN COMBAT DE HÉROS (02/11/2026) —
// docs/CADRAGE-COMBAT-HEROS.md § 1 et § 11, étape 4.
//
// Le MOTEUR ne change pas : `useCourse` (dans DuelCourse) fait la course à
// 1 000 points, le rival rejoué ou le robot, la question dorée, et le serveur
// juge à la fin (`/api/duel/fin`). Cet écran n'est que la PEAU : les 1 000
// points de chacun sont ses cinq cœurs, et chaque réponse qui fait bouger un
// compteur devient un coup (`coupDeLaCourse`) — l'attaque fétiche du héros,
// l'esquive quand l'autre se trompe, le critique à la dorée, le super à la
// troisième d'affilée. Le verdict, lui, garde son écran (DuelResult).

export type CampHeros = { joueur: JoueurCombat; heros: HerosKey }

function instant(view: CourseView): InstantCourse {
  return {
    moi: { score: view.me.score, answered: view.me.answered, combo: view.me.combo },
    rival: { total: view.rival.total, answered: view.rival.answered, combo: view.rival.combo },
    golden: view.golden,
  }
}

/**
 * Le dernier coup de la course : déduit des compteurs pendant le rendu (la
 * recette « état du rendu précédent » de React) — ni effet ni minuterie.
 */
function useCoupDeLaCourse(view: CourseView): Coup | null {
  // `view.golden` parle encore de la question qu'on vient de jouer : la
  // suivante n'arrive qu'après NEXT_QUESTION_MS.
  const [suivi, setSuivi] = useState(() => ({ avant: instant(view), coup: null as Coup | null, id: 0 }))
  const maintenant = instant(view)
  if (
    maintenant.moi.answered !== suivi.avant.moi.answered ||
    maintenant.rival.answered !== suivi.avant.rival.answered
  ) {
    const id = suivi.id + 1
    const coup = coupDeLaCourse(suivi.avant, maintenant, id, view.elapsedMs)
    setSuivi({ avant: maintenant, coup: coup ?? suivi.coup, id })
  }
  return suivi.coup
}

/** Le camp mis à terre à l'arrivée : la barre pleine, ou le chrono à zéro. */
function campKo(view: CourseView): { ko: Camp | null; fin: 'ko' | 'temps' } {
  if (view.phase !== 'finish') return { ko: null, fin: 'ko' }
  if (view.me.score >= GOAL_POINTS) return { ko: 'rival', fin: 'ko' }
  if (view.rival.total >= GOAL_POINTS) return { ko: 'moi', fin: 'ko' }
  if (view.outcome === 'draw') return { ko: null, fin: 'temps' }
  return { ko: view.outcome === 'loss' ? 'moi' : 'rival', fin: 'temps' }
}

export default function CourseHeros({
  view,
  moi,
  rival,
  subject,
  onQuitter,
}: {
  view: CourseView
  moi: CampHeros
  rival: CampHeros
  subject: string
  onQuitter: () => void
}) {
  const monHeros = combattantHeros(moi.heros)
  const sonHeros = combattantHeros(rival.heros)
  const coup = useCoupDeLaCourse(view)
  const enCourse = view.phase === 'playing' || view.phase === 'finish'
  const urgent = enCourse && view.msLeft <= LAST_SECONDS * 1000
  const { ko, fin } = campKo(view)

  // Pendant le VS et le décompte, tout le combat se charge : à la première
  // question, aucune pose ni attaque n'attend le réseau.
  if (!enCourse) {
    for (const src of imagesDuCombat(monHeros, sonHeros)) preload(src, { as: 'image', fetchPriority: 'low' })
  }

  const replique: Replique | null =
    view.phase === 'vs'
      ? { id: 1, texte: `${rival.joueur.nom} veut se battre !` }
      : view.phase === 'finish'
        ? {
            id: 2,
            texte:
              ko === 'rival'
                ? `${rival.joueur.nom} est K.O. ! Tu remportes le duel.`
                : ko === 'moi'
                  ? `${monHeros.nom} est K.O. ! ${rival.joueur.nom} remporte le duel.`
                  : 'Temps écoulé !',
          }
        : null

  return (
    <div className={s.scene}>
      <header className={s.entete}>
        <button type="button" onClick={onQuitter} aria-label="Retour à l’arène" className={s.retour}>
          <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </button>
        <span className={cn(s.titre, 'font-heading font-extrabold')}>Duel · {subject}</span>
        <span
          role="timer"
          className={cn(s.chrono, 'font-heading tabular-nums')}
          data-urgent={urgent ? 'true' : undefined}
        >
          {enCourse ? courseClock(view.msLeft) : '1:30'}
        </span>
      </header>

      <div className={s.lice}>
        <div className={s.fond} aria-hidden="true">
          <Image unoptimized src={ARENE_HEROS} alt="" width={900} height={1613} priority className={s.decor} />
        </div>
        <ArenaCombat
          moi={{ joueur: moi.joueur, combattant: monHeros, coeurs: coeursDuDuel(PV_DUEL - view.rival.total) }}
          rival={{ joueur: rival.joueur, combattant: sonHeros, coeurs: coeursDuDuel(PV_DUEL - view.me.score) }}
          coup={coup}
          ko={ko}
          fin={fin}
          entree={view.phase === 'vs' || view.phase === 'countdown'}
          serie={view.me.combo}
          replique={replique}
        />
      </div>

      <div className={s.bas}>
        {view.phase === 'vs' || view.phase === 'countdown' ? (
          <div className="course-carte text-center">
            {view.phase === 'countdown' ? (
              <p
                key={view.count}
                className={cn(s.decompte, 'font-heading font-extrabold tabular-nums')}
                aria-live="assertive"
              >
                {view.count > 0 ? view.count : 'Go !'}
              </p>
            ) : null}
            <p className="mt-1 text-sm opacity-80">
              Chaque bonne réponse lance ta <strong>{monHeros.attaque.nom}</strong>. Trois d’affilée : le super. La
              question dorée frappe en critique.
            </p>
          </div>
        ) : view.phase === 'playing' && view.question ? (
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
        ) : view.phase === 'playing' ? (
          <div className="course-carte text-center text-sm text-muted-foreground">
            Pas encore de questions dans cette matière — reviens bientôt !
          </div>
        ) : null}
        {view.phase === 'playing' ? (
          <button type="button" onClick={onQuitter} className={s.abandon}>
            Abandonner
          </button>
        ) : null}
      </div>
    </div>
  )
}
