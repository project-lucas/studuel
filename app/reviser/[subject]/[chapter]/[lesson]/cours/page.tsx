import LessonCompleteButton from '@/components/LessonCompleteButton'
import LessonPrintButton from '@/components/LessonPrintButton'
import LessonRichContent from '@/components/LessonRichContent'
import EnTetePage from '@/components/reviser/EnTetePage'
import SupportChips from '@/components/reviser/SupportChips'
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

  // Une feuille imprimée quitte l'app : sans la matière sous le titre, l'élève
  // retrouve un titre nu au fond de son classeur, sans savoir d'où il vient. À
  // l'écran, la ligne situe la leçon dans sa fiche — utile par un lien direct.
  const sousTitre =
    lesson.title.trim() !== chapter.title.trim()
      ? `${subject.name} · ${lesson.title}`
      : subject.name

  return (
    // `feuille-impression` : le repère qu'attend le bloc `@media print` de
    // globals.css pour ne garder QUE le cours sur le papier. Le cours est posé
    // sur le mur crème de l'app, sans bandeau coloré ni feuille opaque (audit
    // du 23/09/2026) : l'en-tête est celui de toutes les pages de Réviser.
    <div className="feuille-impression mx-auto w-full max-w-2xl">
      {/* `entete-cours` : sur papier, le bloc print remplace l'en-tête par un
          filet sous le titre. Le retour et l'impression se font face dans la
          rangée `sans-papier` d'EnTetePage : l'un ramène en arrière, l'autre
          emporte la feuille, aucun des deux n'a sa place sur le papier.

          LE TITRE DE LA PAGE EST CELUI DE LA FICHE — le mot sur lequel l'élève
          vient de taper (« Les noms »). Il portait le titre de la leçon
          (« Dénombrables, indénombrables, pluriels irréguliers ») : on
          atterrissait sur un intitulé qu'on n'avait pas choisi. La leçon, elle,
          se dit dessous — quand elle a son propre nom. */}
      <EnTetePage
        className="entete-cours"
        retour={{ fallback: `/reviser/${subject.slug}` }}
        droite={<LessonPrintButton />}
        titre={chapter.title}
        sousTitre={sousTitre}
      />

      <div className="mt-6">
        <LessonRichContent content={lesson.content ?? 'Contenu à venir.'} />

        {/* Le pied de page : une invitation à continuer DANS l'app. Sur
            papier, un bouton qui ne se clique pas n'est qu'une tache. */}
        <div className="sans-papier mt-8 border-t pt-6">
          <LessonCompleteButton
            lessonId={lesson.id}
            initialDone={Boolean(completion)}
          />

          {/* La suite, sur place. Le cours ne se terminait que par « Tester
              mes connaissances » : pour les flashcards, la fiche ou
              l'exercice du MÊME chapitre, il fallait remonter à la page
              matière et changer d'onglet. Les supports sont ici, rangés sous
              leurs trois verbes et calés sur la leçon qu'on vient de lire. */}
          {supports.length > 0 ? (
            <section className="mt-8" aria-labelledby="suite-du-chapitre">
              <h2
                id="suite-du-chapitre"
                className="titre-section text-center"
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
  )
}
