import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BackButton from '@/components/BackButton'
import MindMap from '@/components/MindMap'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, canAccessMindMaps } from '@/lib/subscription'
import { mindMapPlaceholder } from '@/lib/mind-map'
import { chapterHasMindMap, fetchMindMap } from '@/lib/mind-map-access'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import { CHAPTER_COLUMNS, type Subject, type Chapter, type MindMapData } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Carte mentale du chapitre — réservée aux abonnés (Offre 1+). Les gratuits
// qui arrivent ici (URL directe) voient un aperçu flouté et l'invitation à
// s'abonner, cohérent avec la tuile verrouillée de la page chapitre.
export default async function MindMapPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Colonnes explicites : le CONTENU de la carte ne se lit plus par requête
  // directe (révoqué, migration 182) mais par la RPC `chapter_mind_map`, qui
  // revérifie l'abonnement côté serveur. On ne le charge donc QUE pour un
  // abonné — un non-abonné voit un aperçu générique, jamais le vrai contenu.
  type Row = Chapter & { subject: Subject }
  const [{ data: row }, tier, hasMindMap] = await Promise.all([
    supabase
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
      .eq('id', chapterId)
      .eq('subjects.slug', slug)
      .maybeSingle<Row>(),
    getUserTier(),
    chapterHasMindMap(supabase, chapterId),
  ])
  if (!row) notFound()

  const { subject, ...chapter } = row
  const theme = subjectTheme(subject.color)
  const unlocked = canAccessMindMaps(tier)

  let mindMap: MindMapData | null = null
  if (hasMindMap && unlocked) mindMap = await fetchMindMap(supabase, chapterId)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-6 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-4xl">
          <BackButton
            fallback={`/reviser/${subject.slug}/${chapter.id}`}
            label={`Retour — ${chapter.title}`}
            className="mb-4"
          />
          <h1 className="font-heading text-2xl font-bold text-balance md:text-3xl">
            Carte mentale
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium opacity-70">
            <SubjectIcon slug={subject.slug} className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {subject.name} · {chapter.level} · {chapter.title}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
        {!hasMindMap ? (
          <p className="text-sm text-muted-foreground">
            La carte mentale de ce chapitre arrive bientôt.
          </p>
        ) : mindMap ? (
          <MindMap data={mindMap} />
        ) : unlocked ? (
          // Abonné, carte existante, mais contenu injoignable : ne JAMAIS lui
          // servir l'écran « Débloquer l'Offre 1 », il a déjà payé.
          <p className="text-sm text-muted-foreground">
            La carte mentale n&apos;a pas pu être chargée. Réessaie dans un instant.
          </p>
        ) : (
          <div className="relative">
            {/* LEURRE, pas la vraie carte : le flou n'est que du CSS, le texte
                partait quand même dans le HTML (« afficher le code source »
                suffisait à lire le contenu payant). L'aperçu est une silhouette
                générique — le serveur n'a même pas chargé la vraie carte. */}
            <div aria-hidden="true">
              <MindMap
                data={mindMapPlaceholder()}
                className="pointer-events-none blur-sm select-none opacity-50"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <span className="bg-card flex size-14 items-center justify-center rounded-2xl border shadow-md">
                <Lock className="text-muted-foreground size-6" aria-hidden="true" />
              </span>
              <p className="font-heading max-w-xs font-semibold text-balance">
                Les cartes mentales sont réservées à l&apos;Offre 1.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/compte">Débloquer avec l&apos;Offre 1</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
