import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import LessonRichContent from '@/components/LessonRichContent'
import EnTetePage from '@/components/reviser/EnTetePage'
import { typographie } from '@/lib/typographie'

export const dynamic = 'force-dynamic'

// L'APERÇU D'UN COURS — en développement seulement.
//
// La vraie page (/reviser/<matière>/<fiche>/<leçon>/cours) exige une session ;
// relire à l'écran la mise en page d'un cours (tableaux, formules, blocs de
// code) ne devrait pas en exiger une. Cette page lit la leçon avec la clé anon
// (le catalogue est public) et la rend avec les MÊMES composants :
//
//   /dev/cours?fiche=<id de la fiche>    le premier cours de la fiche
//   /dev/cours?lecon=<id de la leçon>    une leçon précise
//
// Même garde que `/dev/exercices` : introuvable en production.
function anon() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

type Lecon = { id: string; title: string; content: string | null; chapter_id: string }

export default async function ApercuCours({
  searchParams,
}: {
  searchParams: Promise<{ fiche?: string; lecon?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { fiche, lecon } = await searchParams
  const db = anon()

  const requete = db.from('lessons').select('id, title, content, chapter_id').order('position').limit(1)
  const { data: lecons } = lecon
    ? await requete.eq('id', lecon)
    : fiche
      ? await requete.eq('chapter_id', fiche)
      : { data: null }
  const lesson = (lecons as Lecon[] | null)?.[0]
  if (!lesson) notFound()

  const { data: chapitre } = await db
    .from('chapters')
    .select('title, level, subjects(name)')
    .eq('id', lesson.chapter_id)
    .maybeSingle<{ title: string; level: string; subjects: { name: string } | null }>()
  const titre = typographie(chapitre?.title ?? lesson.title)
  const matiere = chapitre?.subjects?.name ?? ''

  return (
    <div className="feuille-impression mx-auto w-full max-w-2xl">
      <EnTetePage
        className="entete-cours"
        retour={{ fallback: '/dev' }}
        titre={titre}
        sousTitre={[matiere, chapitre?.level, lesson.title.trim() !== titre.trim() ? lesson.title : null]
          .filter(Boolean)
          .join(' · ')}
      />
      <div className="mt-6">
        <LessonRichContent content={lesson.content ?? 'Contenu à venir.'} />
      </div>
    </div>
  )
}
