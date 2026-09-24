import { notFound } from 'next/navigation'
import EnTetePage from '@/components/reviser/EnTetePage'
import MarkLessonActivity from '@/components/MarkLessonActivity'
import { loadLessonContext } from '../data'

export const dynamic = 'force-dynamic'

// Support « Studygram » : le visuel mémorisable de la leçon (une image type
// fiche décorée). Sa consultation compte dans l'anneau d'avancement.
// En-tête commun de Réviser, image posée sur le mur crème de l'app — plus de
// lavis de matière ni de feuille opaque (audit du 23/09/2026).
export default async function StudygramPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject: slug, chapter: chapterId, lesson: lessonId } = await params
  const { subject, chapter, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )
  if (!lesson.studygram_url) notFound()

  return (
    <div className="mx-auto w-full max-w-2xl">
      <MarkLessonActivity lessonId={lesson.id} activity="studygram" />
      <EnTetePage
        retour={{
          fallback: `/reviser/${subject.slug}/${chapter.id}/${lesson.id}/cours`,
        }}
        titre={lesson.title}
        sousTitre={`Studygram · ${subject.name}`}
      />

      {/* Image libre (URL en base) : next/image exigerait de connaître le
          domaine à l'avance — on reste sur <img> volontairement. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lesson.studygram_url}
        alt={`Studygram — ${lesson.title}`}
        className="mt-6 w-full rounded-3xl border shadow-sm"
      />
    </div>
  )
}
