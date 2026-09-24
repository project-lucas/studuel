import { notFound, redirect } from 'next/navigation'
import EnTetePage from '@/components/reviser/EnTetePage'
import SupportChips from '@/components/reviser/SupportChips'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'
import { loadChapterSupports } from './supports'

export const dynamic = 'force-dynamic'

// L'écran de chapitre : on choisit AVANT d'entrer.
//
// Ouvrir un chapitre menait droit au cours, sans rien demander. C'était rapide
// pour qui venait lire, et fermé pour tous les autres — celui qui voulait ses
// flashcards tombait sur trois écrans de leçon rédigée et devait repartir en
// arrière. L'écran rend le choix, et le RANGE (16/09/2026) sous trois verbes :
// Apprendre (Cours, Fiche) · Mémoriser (Flashcards) · Se tester (Quiz,
// Exercice, Moi vs IA). Cinq tuiles en vrac, dont trois jouaient les mêmes
// questions, ne disaient pas la différence ; les groupes la disent.
//
// Plus de lavis bleu ciel ni de « Chapitre N » en surtitre (audit du
// 23/09/2026, docs/template-matiere.md) : l'en-tête est celui de toutes les
// pages de Réviser, sur le mur crème de l'app, et la matière se dit dessous.
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Slug vérifié par la jointure : un chapitre atteint sous la mauvaise matière
  // n'existe pas.
  type Row = Chapter & { subject: Subject | null }
  const { data: row } = await supabase
    .from('chapters')
    .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
    .eq('id', chapterId)
    .eq('subjects.slug', slug)
    .maybeSingle<Row>()
  if (!row?.subject) notFound()

  const { subject, ...chapter } = row
  const supports = await loadChapterSupports(
    supabase,
    user.id,
    subject.slug,
    chapter as Chapter,
  )

  // Chapitre encore vide (ni leçon, ni quiz) : retour à la matière plutôt qu'un
  // écran de choix qui n'en propose aucun.
  if (supports.length === 0) redirect(`/reviser/${slug}`)

  return (
    <div className="mx-auto w-full max-w-2xl">
      <EnTetePage
        retour={{ fallback: `/reviser/${subject.slug}` }}
        titre={chapter.title}
        sousTitre={subject.name}
      />

      <div className="mt-6">
        <h2 className="titre-section text-center">
          Par quoi tu commences ?
        </h2>
        <p className="mt-0.5 mb-5 text-center text-sm text-muted-foreground">
          Tout ce chapitre, dans le format qui te va.
        </p>
        <SupportChips
          chips={supports}
          layout="grid"
          label={`Travailler ${chapter.title}`}
        />
      </div>
    </div>
  )
}
