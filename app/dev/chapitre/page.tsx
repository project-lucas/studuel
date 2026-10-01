import { notFound } from 'next/navigation'
import SupportChips from '@/components/reviser/SupportChips'
import { buildChapterSupports, type SupportLesson } from '@/lib/chapter-supports'

export const dynamic = 'force-dynamic'

// L'APERÇU DES SUPPORTS D'UN CHAPITRE — en développement seulement.
//
// Les tuiles de l'écran de chapitre (grille rangée sous ses verbes) et la
// rangée posée sous une fiche dépliée du programme, sans compte : les mêmes
// `buildChapterSupports` et `SupportChips` que l'app, sur des données de
// démonstration.
//
//   /dev/chapitre             la fiche à débloquer, rien à revoir
//   /dev/chapitre?erreurs=3   avec la tuile « Mes erreurs »
//   /dev/chapitre?ouvert=1    fiche débloquée, abonné Studuel+

const LECON: SupportLesson = {
  id: 'lecon',
  title: 'Utiliser le théorème de Thalès',
  quizId: 'quiz',
  questionCount: 12,
  best: { score: 9, total: 12, ratio: 0.75 },
  ownQuiz: true,
  read: true,
}

export default async function ApercuChapitre({
  searchParams,
}: {
  searchParams: Promise<{ erreurs?: string; ouvert?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { erreurs, ouvert } = await searchParams
  const abonne = ouvert === '1'

  const supports = buildChapterSupports({
    subjectSlug: 'maths',
    chapterId: 'chapitre',
    lessons: [LECON],
    carte: { available: true, locked: !abonne },
    exercice: { best: null, premium: abonne, cahier: { reussis: 1, total: 3 } },
    erreurs: Math.max(0, Number.parseInt(erreurs ?? '0', 10) || 0),
  })

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 pb-16">
      <section>
        <h2 className="titre-section mb-4 text-center">Par quoi tu commences ?</h2>
        <SupportChips chips={supports} layout="grid" label="Les supports du chapitre" />
      </section>

      <section className="carte p-3">
        <p className="mb-2 text-sm font-bold">Sous une fiche dépliée du programme</p>
        <SupportChips chips={supports} layout="fiche" label="Les supports de la fiche" />
      </section>
    </div>
  )
}
