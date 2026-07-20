import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'
import LessonRichContent from '@/components/LessonRichContent'
import MarkLessonActivity from '@/components/MarkLessonActivity'
import UnlockChapterCard from '@/components/UnlockChapterCard'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import { getUserTierFor } from '@/lib/subscription'
import { chapterAccess } from '@/lib/gems'
import { fetchGems, fetchUnlockedChapters } from '@/lib/gems-access'
import { fetchRevisionSheet, lessonHasRevisionSheet } from '@/lib/revision-access'
import { loadLessonContext } from '../data'

export const dynamic = 'force-dynamic'

// Support « Révision » : la fiche condensée de la leçon. Sa simple lecture
// compte dans l'anneau d'avancement (lesson_activities).
//
// La fiche est du CONTENU PAYANT : elle s'ouvre par l'abonnement ou par une
// gemme (qui déverrouille tout le chapitre, donc les fiches de toutes ses
// leçons). Le contenu n'est chargé QUE si l'accès est établi — un élève sans
// droit ne reçoit jamais le texte, pas même caché dans le HTML.
export default async function RevisionPage({
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

  // L'existence de la fiche se lit sur la colonne générée, jamais sur le texte.
  const hasSheet = await lessonHasRevisionSheet(supabase, lesson.id)
  if (!hasSheet) notFound()

  const [tier, unlockedChapters, gems] = await Promise.all([
    // Le user vient de loadLessonContext : pas de second aller-retour Auth.
    getUserTierFor(supabase, user.id),
    fetchUnlockedChapters(supabase, user.id),
    fetchGems(supabase, user.id),
  ])
  const unlocked = chapterAccess(tier, chapter.id, unlockedChapters) !== 'locked'

  // Le contenu ne quitte le serveur que si l'accès est acquis. La RPC
  // revérifie de son côté : même en trafiquant le client, rien ne sort.
  const sheet = unlocked ? await fetchRevisionSheet(supabase, lesson.id) : null

  const theme = subjectTheme(subject.color)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* L'anneau d'avancement ne se remplit que si la fiche a été RÉELLEMENT
          lue — la marquer « consultée » depuis l'écran de déblocage
          fausserait la progression de l'élève. */}
      {sheet ? (
        <MarkLessonActivity lessonId={lesson.id} activity="revision" />
      ) : null}

      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-10 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          <BackButton
            fallback={`/reviser/${subject.slug}/${chapter.id}/${lesson.id}`}
          />
          <p className="mt-4 text-center text-sm font-semibold opacity-70">
            Fiche de révision
          </p>
          <h1 className="font-heading mt-1 text-center text-2xl font-bold text-balance md:text-3xl">
            {lesson.title}
          </h1>
        </div>
      </header>

      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 md:px-8">
          {sheet ? (
            <LessonRichContent content={sheet} />
          ) : unlocked ? (
            // Accès légitime mais contenu injoignable : ne JAMAIS lui servir
            // l'écran « Débloque », il y a droit.
            <p className="text-muted-foreground text-sm">
              La fiche n&apos;a pas pu être chargée. Réessaie dans un instant.
            </p>
          ) : (
            <UnlockChapterCard chapterId={chapter.id} gems={gems}>
              {/* LEURRE : des barres grises, pas la vraie fiche. Le serveur ne
                  l'a même pas chargée — « afficher le code source » ne révèle
                  rien, contrairement à un simple flou CSS. */}
              <div className="flex flex-col gap-3 blur-[3px] select-none">
                {[
                  'w-3/4', 'w-full', 'w-5/6', 'w-2/3',
                  'w-full', 'w-4/5', 'w-1/2', 'w-full',
                  'w-3/5', 'w-5/6',
                ].map((width, i) => (
                  <span
                    key={i}
                    className={cn(
                      'bg-muted-foreground/25 h-4 rounded-full',
                      width,
                      // Un « titre » tous les quatre blocs : la silhouette d'une
                      // fiche, pas un pavé uniforme.
                      i % 4 === 0 && 'bg-muted-foreground/40 h-5',
                    )}
                  />
                ))}
              </div>
            </UnlockChapterCard>
          )}
        </div>
      </div>
    </div>
  )
}
