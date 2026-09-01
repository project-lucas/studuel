import BackButton from '@/components/BackButton'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import LessonPrintButton from '@/components/LessonPrintButton'
import LessonRichContent from '@/components/LessonRichContent'
import SupportChips from '@/components/reviser/SupportChips'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import { loadLessonContext } from '../data'
import { loadChapterSupports } from '../../supports'

export const dynamic = 'force-dynamic'

// Support « Cours » : la leçon rédigée, mise en page cahier (parties
// numérotées, puces ✱, idées clés fléchées). Terminer le cours pose le
// plancher de 30 % du chapitre et remplit l'anneau de la leçon.
export default async function CoursPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject: slug, chapter: chapterId, lesson: lessonId } = await params
  const { supabase, user, subject, chapter, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )

  const [{ data: completion }, supports] = await Promise.all([
    supabase
      .from('lesson_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle<{ id: string }>(),
    loadChapterSupports(supabase, user.id, subject.slug, chapter, lesson.id),
  ])

  const theme = subjectTheme(subject.color)

  return (
    // `feuille-impression` : le repère qu'attend le bloc `@media print` de
    // globals.css pour ne garder QUE le cours sur le papier.
    <div className="feuille-impression -mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Header quadrillé façon feuille de cahier, aux couleurs de la matière */}
      <header
        className={cn(
          'entete-cours relative overflow-hidden px-4 pt-20 pb-10 md:px-8 md:pt-12',
          theme.header,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          {/* Le retour et l'impression se font face : l'un ramène en arrière,
              l'autre emporte la feuille. Aucun des deux n'a sa place sur le
              papier — d'où `sans-papier` sur la rangée entière. */}
          <div className="sans-papier flex items-center justify-between">
            <BackButton fallback={`/reviser/${subject.slug}`} />
            <LessonPrintButton />
          </div>
          <h1 className="font-heading mt-4 text-center text-2xl font-bold text-balance md:text-3xl">
            {lesson.title}
          </h1>
          {/* Une feuille imprimée quitte l'app : sans cette ligne, l'élève
              retrouve un titre nu au fond de son classeur, sans savoir de
              quelle matière ni de quel chapitre il vient. À l'écran, elle
              situe la leçon dans son chapitre — utile quand on arrive par un
              lien direct. */}
          <p className="mt-1 text-center text-sm opacity-70">
            {subject.name} · {chapter.title}
          </p>
        </div>
      </header>

      {/* La feuille de cours qui chevauche le header */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 md:px-8">
          <LessonRichContent content={lesson.content ?? 'Contenu à venir.'} />

          {/* Le pied de page : une invitation à continuer DANS l'app. Sur
              papier, un bouton qui ne se clique pas n'est qu'une tache. */}
          <div className="sans-papier mt-8 border-t pt-6">
            <LessonCompleteButton
              lessonId={lesson.id}
              initialDone={Boolean(completion)}
            />

            {/* La suite, sur place. Le cours ne se terminait que par « Tester
                mes connaissances » : pour les flashcards, la carte ou le défi
                du MÊME chapitre, il fallait remonter à la page matière et
                changer d'onglet. Les quatre supports sont ici, calés sur la
                leçon qu'on vient de lire. */}
            {supports.length > 0 ? (
              <section className="mt-8" aria-labelledby="suite-du-chapitre">
                <h2
                  id="suite-du-chapitre"
                  className="font-heading text-center text-lg font-bold"
                >
                  Et maintenant ?
                </h2>
                <p className="mt-0.5 mb-5 text-center text-sm text-muted-foreground">
                  Le cours est lu — voici de quoi le faire tenir.
                </p>
                <SupportChips
                  chips={supports}
                  layout="grid"
                  label={`S’entraîner sur ${chapter.title}`}
                />
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
