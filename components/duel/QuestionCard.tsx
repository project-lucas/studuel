'use client'

import { Flame, Sparkles } from 'lucide-react'
import AnswerBoard from '@/components/jeux/AnswerBoard'
import EnonceATrou from '@/components/quiz/EnonceATrou'
import { cn } from '@/lib/utils'
import { estTexteATrou } from '@/lib/quiz-trous'
import { comboMultiplier } from '@/lib/duel90'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { GameLayout } from '@/lib/jeux/formats'

/**
 * LA CARTE DE QUESTION de la course.
 *
 * Elle change de FORME avec la question, parce que huit cartes identiques
 * d'affilée se comptent, et qu'une course ne doit pas se compter :
 *   · vrai/faux → deux grandes plaques, on tranche ;
 *   · réponses courtes → une grille 2×2, le regard balaye ;
 *   · réponses longues → une liste, on lit ligne par ligne ;
 *   · texte à trou → LA PHRASE avec son creux, l'option touchée vient s'y poser.
 *
 * Elle porte en tête ce qui pèse sur CETTE question : son numéro, la série en
 * cours et son multiplicateur, et — une fois par course — la promesse dorée
 * « ×2 ». La carte dorée est la même carte, en or : un liseré, un halo qui
 * respire ; elle ne se manque pas, et elle ne dure qu'une question.
 *
 * Une erreur la fait TREMBLER (`shake`) : le corps de la carte encaisse, comme
 * les tables de jeu de salon.
 */
export default function QuestionCard({
  question,
  number,
  combo,
  golden,
  selected,
  revealed,
  shake,
  onAnswer,
}: {
  question: ModeQuestion
  /** Le rang de la question dans la course (1 = première). */
  number: number
  /** La série en cours AVANT cette question. */
  combo: number
  golden: boolean
  selected: number | null
  revealed: boolean
  /** Compteur de secousses : chaque incrément rejoue l'animation. */
  shake: number
  onAnswer: (index: number) => void
}) {
  const trou = estTexteATrou(question.prompt)
  const layout = layoutFor(question, trou)
  const multiplier = comboMultiplier(combo)

  return (
    <div
      key={question.id}
      className={cn('course-carte', golden && 'course-carte--doree')}
      data-doree={golden ? 'true' : undefined}
    >
      {/* La secousse vit sur un enfant à part, clé sur le compteur : elle se
          rejoue à chaque erreur sans remonter la carte (ni rejouer son entrée). */}
      <div key={shake} className={cn(shake > 0 && 'jeu-secousse')}>
      <div className="course-carte-tete">
        <span className="course-chip">Question {number}</span>
        {combo >= 3 ? (
          <span className="course-chip course-chip--feu">
            <Flame className="size-3.5" aria-hidden="true" /> Série de {combo} · ×{multiplier}
          </span>
        ) : null}
        {golden ? (
          <span className="course-chip course-chip--or">
            <Sparkles className="size-3.5" aria-hidden="true" /> Dorée · ×2
          </span>
        ) : null}
      </div>

      {trou ? (
        <EnonceATrou
          enonce={question.prompt}
          options={question.options}
          choisi={selected}
          correctIndex={question.correctIndex}
          revele={revealed}
          className="course-enonce"
        />
      ) : (
        <h2 className="course-enonce">{question.prompt}</h2>
      )}

      <div className="mt-4">
        <AnswerBoard
          options={question.options}
          correctIndex={question.correctIndex}
          selected={selected}
          revealed={revealed}
          layout={layout}
          onAnswer={onAnswer}
        />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {revealed
          ? selected === question.correctIndex
            ? 'Bonne réponse'
            : 'Mauvaise réponse'
          : ''}
      </p>
      </div>
    </div>
  )
}

/** La disposition des réponses, déduite de la question. */
export function layoutFor(question: ModeQuestion, trou = false): GameLayout {
  if (trou) return question.options.every((o) => o.length <= 14) ? 'grille' : 'liste'
  if (question.kind === 'true_false' || question.options.length === 2) return 'duo'
  if (question.options.length === 4 && question.options.every((o) => o.length <= 16)) {
    return 'grille'
  }
  return 'liste'
}
