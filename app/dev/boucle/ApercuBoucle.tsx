'use client'

import QuizPlayer from '@/components/QuizPlayer'
import RepriseManche from '@/components/quiz/RepriseManche'
import { CarteBoucle } from '@/components/reviser/BoucleOuverte'
import { creerBrouillon } from '@/lib/quiz-brouillon'
import type { QuizQuestion } from '@/lib/types'

const QUIZ_ID = '00000000-0000-4000-8000-0000000000de'

const QUESTIONS = [
  ['Capitale de l’Italie ?', ['Rome', 'Milan', 'Naples', 'Turin']],
  ['7 × 8 ?', ['56', '54', '64', '48']],
  ['Le symbole chimique du fer ?', ['Fe', 'Fr', 'F', 'Ir']],
  ['Qui a écrit « Les Misérables » ?', ['Victor Hugo', 'Émile Zola', 'Balzac', 'Flaubert']],
  ['La racine carrée de 81 ?', ['9', '8', '7', '81']],
  ['L’océan le plus vaste ?', ['Pacifique', 'Atlantique', 'Indien', 'Arctique']],
].map(([question, options], i) => ({
  id: `dev-q${i + 1}`,
  quiz_id: QUIZ_ID,
  question: question as string,
  kind: 'mcq' as const,
  options: options as string[],
  correct_index: 0,
  explanation: 'La première réponse était la bonne.',
  position: i,
})) satisfies QuizQuestion[]

const brouillon = (fait: number, total: number) =>
  creerBrouillon({
    quizId: QUIZ_ID,
    titre: 'Le théorème de Thalès',
    matiere: 'Mathématiques',
    subjectSlug: 'maths',
    questionIds: Array.from({ length: total }, (_, i) => `q${i}`),
    choix: Array.from({ length: fait }, () => 0),
    secondes: 42,
    maintenant: new Date('2026-10-28T10:00:00.000Z'),
  })

export default function ApercuBoucle({ reprise, jouer }: { reprise: boolean; jouer: boolean }) {
  if (jouer) {
    return (
      <QuizPlayer
        quizId={QUIZ_ID}
        title="Culture générale (aperçu)"
        questions={QUESTIONS}
        subject="Culture générale"
        subjectSlug="maths"
        backHref="/dev/boucle"
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-4 pt-8">
      <section>
        <h2 className="titre-section mb-2 px-1">Tu t’étais arrêté là · quiz passé la moitié</h2>
        <CarteBoucle boucle={{ genre: 'quiz', brouillon: brouillon(6, 10) }} />
      </section>
      <section>
        <h2 className="titre-section mb-2 px-1">· quiz à peine commencé</h2>
        <CarteBoucle boucle={{ genre: 'quiz', brouillon: brouillon(2, 10) }} />
      </section>
      <section>
        <h2 className="titre-section mb-2 px-1">· cours entamé</h2>
        <CarteBoucle
          boucle={{
            genre: 'lecture',
            lecture: {
              lessonId: 'l1',
              titre: 'La Révolution française',
              matiere: 'Histoire-Géographie',
              subjectSlug: 'histoire-geo',
              href: '/reviser/histoire-geo/c1/l1/cours',
              part: 0.62,
              at: '2026-10-28T10:00:00.000Z',
            },
          }}
        />
      </section>
      {reprise ? (
        <RepriseManche brouillon={brouillon(6, 10)} onReprendre={() => {}} onRecommencer={() => {}} />
      ) : null}
    </div>
  )
}
