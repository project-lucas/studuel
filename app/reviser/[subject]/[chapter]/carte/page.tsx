import { notFound, redirect } from 'next/navigation'
import EnTetePage from '@/components/reviser/EnTetePage'
import MindMap from '@/components/MindMap'
import UnlockChapterCard from '@/components/UnlockChapterCard'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTierFor } from '@/lib/subscription'
import { chapterAccess } from '@/lib/gems'
import { fetchGems, fetchUnlockedChapters } from '@/lib/gems-access'
import { mindMapPlaceholder } from '@/lib/mind-map'
import { mindMapFromLessons, type LessonForMap } from '@/lib/mind-map-auto'
import { chapterHasMindMap, fetchMindMap } from '@/lib/mind-map-access'
import SubjectIcon from '@/components/SubjectIcon'
import GemIcon from '@/components/ui/GemIcon'
import { CHAPTER_COLUMNS, type Subject, type Chapter, type MindMapData } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Carte mentale du chapitre — ouverte par l'ABONNEMENT ou par une GEMME
// (migration 183 : une gemme = un chapitre, à vie). Les élèves qui arrivent ici
// sans l'un ni l'autre voient un aperçu leurre et les deux portes de sortie,
// la gratuite d'abord. Cohérent avec la tuile verrouillée de la page chapitre.
export default async function MindMapPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Colonnes explicites : le CONTENU de la carte ne se lit plus par requête
  // directe (révoqué, migration 182) mais par la RPC `chapter_mind_map`, qui
  // revérifie l'accès côté serveur. On ne le charge donc QUE pour quelqu'un qui
  // y a droit — sinon l'élève voit un aperçu générique, jamais le vrai contenu.
  type Row = Chapter & { subject: Subject }
  const [{ data: row }, tier, hasMindMap, unlockedChapters, gems] =
    await Promise.all([
      supabase
        .from('chapters')
        .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
        .eq('id', chapterId)
        .eq('subjects.slug', slug)
        .maybeSingle<Row>(),
      // Le user est déjà validé ci-dessus : pas de second aller-retour Auth.
      getUserTierFor(supabase, user.id),
      chapterHasMindMap(supabase, chapterId),
      fetchUnlockedChapters(supabase, user.id),
      fetchGems(supabase, user.id),
    ])
  if (!row) notFound()

  const { subject, ...chapter } = row
  const access = chapterAccess(tier, chapterId, unlockedChapters)
  const unlocked = access !== 'locked'

  // Carte rédigée à la main d'abord. À défaut — c'est le cas de la quasi-
  // totalité des chapitres — on la DÉRIVE du cours : le chapitre au centre, une
  // branche par leçon, un rameau par titre de section (cf. lib/mind-map-auto).
  // Une carte mentale n'est rien d'autre que la structure du cours, et cette
  // structure existe déjà : mieux vaut la montrer que promettre « bientôt ».
  //
  // Le verrou payant ne bouge pas : on ne dérive que pour un élève qui a le
  // droit d'ouvrir la carte. Les autres gardent le leurre.
  let mindMap: MindMapData | null = null
  let derivee = false
  if (unlocked) {
    if (hasMindMap) mindMap = await fetchMindMap(supabase, chapterId)
    if (!mindMap) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('title, content')
        .eq('chapter_id', chapterId)
        .order('position', { ascending: true })
        .returns<LessonForMap[]>()
      mindMap = mindMapFromLessons(chapter.title, lessons ?? [])
      derivee = mindMap !== null
    }
  }
  // « Il y a quelque chose à ouvrir » : une carte rédigée OU dérivable. Sert
  // aussi à l'élève non débloqué, pour qui on ne charge aucun contenu.
  const carteExiste = hasMindMap || derivee || !unlocked

  return (
    // La carte est large : elle prend toute la largeur de lecture du gabarit
    // (max-w-4xl). L'en-tête est celui de toutes les pages de Réviser, sur le
    // mur crème de l'app — plus de lavis de matière (audit du 23/09/2026).
    <div>
      <EnTetePage
        retour={{ fallback: `/reviser/${subject.slug}`, label: `Retour — ${subject.name}` }}
        titre="Fiche de révision"
        sousTitre={
          <span className="flex items-center gap-1.5">
            <SubjectIcon slug={subject.slug} className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {subject.name} · {chapter.level} · {chapter.title}
          </span>
        }
      >
        {access === 'unlocked' ? (
          // Badge réservé au déblocage à la gemme : il rappelle que CE
          // chapitre appartient à l'élève (un abonné, lui, a déjà tout).
          <p className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-bold">
            <GemIcon className="size-3.5" aria-hidden="true" />
            Débloquée
          </p>
        ) : null}
      </EnTetePage>

      <div className="mt-6">
        {!carteExiste ? (
          <p className="text-sm text-muted-foreground">
            Ce chapitre n&apos;a pas encore de cours écrit : il n&apos;y a rien à
            cartographier pour l&apos;instant.
          </p>
        ) : mindMap ? (
          <>
            <MindMap data={mindMap} />
            {derivee ? (
              <p className="text-muted-foreground mt-4 text-center text-xs">
                Carte construite à partir du cours du chapitre.
              </p>
            ) : null}
          </>
        ) : unlocked ? (
          // Accès légitime (abonnement ou gemme déjà dépensée) mais contenu
          // injoignable : ne JAMAIS lui servir l'écran « Débloque », il a payé.
          <p className="text-sm text-muted-foreground">
            La fiche n&apos;a pas pu être chargée. Réessaie dans un instant.
          </p>
        ) : (
          <UnlockChapterCard chapterId={chapterId} gems={gems}>
            {/* LEURRE, pas la vraie carte : le flou n'est que du CSS, le texte
                partait quand même dans le HTML (« afficher le code source »
                suffisait à lire le contenu payant). L'aperçu est une silhouette
                générique — le serveur n'a même pas chargé la vraie carte. */}
            <MindMap
              data={mindMapPlaceholder()}
              className="pointer-events-none blur-sm select-none opacity-50"
            />
          </UnlockChapterCard>
        )}
      </div>
    </div>
  )
}
