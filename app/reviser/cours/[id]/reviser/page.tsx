import { notFound, redirect } from 'next/navigation'
import ReviewSession, {
  type PlayableQuestion,
} from '@/components/carnet/ReviewSession'
import WorkTimer from '@/components/WorkTimer'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
  type CourseChapter,
  type CourseQuestionType,
} from '@/lib/carnet-cours'
import { composerFile, grainsDuJour } from '@/lib/carnet/planification'
import { chargerEtats } from '@/lib/carnet/etats-server'
import {
  filtrerPourSession,
  longueurEffective,
  modePlanifie,
  normalizeOptions,
  resumeOptions,
  type CarteCandidate,
  type Portee,
} from '@/lib/carnet/session-options'
import { toDayKey } from '@/lib/streak'

export const metadata = { title: 'Réviser — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * Session de révision d'un cours du carnet.
 *
 * Les réglages voyagent dans l'URL (`?mode=`, `?sens=`, `?types=`, `?long=`,
 * `?chapitre=`, `?portee=erreurs`, `?tag=`) : une session se partage, se met en
 * favori et se relance à l'identique. C'est la feuille « Comment tu veux
 * réviser ? » qui les pose ; ici on les relit et on les honore.
 *
 * La file n'est plus « toutes les questions dans l'ordre de la liste » :
 * filtrée par les options, composée par le planificateur (dû, plafonné,
 * mélangé, révisions avant nouveautés), puis coupée à la longueur demandée.
 */
export default async function CourseReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const lire = (cle: string): string | undefined => {
    const v = sp[cle]
    return Array.isArray(v) ? v[0] : v
  }

  const { data: course } = await supabase
    .from('carnet_courses')
    .select('id, title, new_per_day, reviews_per_day')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!course) notFound()

  const [{ data: chapterRows }, { data: questionRows }, { data: tagRows }] =
    await Promise.all([
      supabase
        .from('carnet_chapters')
        .select('id, parent_chapter_id, title, position')
        .eq('course_id', id),
      supabase
        .from('carnet_questions')
        .select('id, chapter_id, type, position, content')
        .eq('course_id', id),
      // Les étiquettes des questions de CE cours (migration 316). La table peut
      // être absente : la lecture est isolée et son échec ne casse rien.
      supabase
        .from('carnet_question_tags')
        .select('question_id, tag_id'),
    ])

  const chapters: CourseChapter[] = (chapterRows ?? []).map((r) => ({
    id: String(r.id),
    parentChapterId: r.parent_chapter_id ? String(r.parent_chapter_id) : null,
    title: String(r.title ?? 'Nouveau chapitre'),
    position: Number(r.position ?? 0),
  }))

  // Les ancêtres de chaque chapitre : réviser « Chapitre 1 » doit emporter ses
  // sous-chapitres, et le filtre travaille sur des listes plates.
  const parentDe = new Map(chapters.map((c) => [c.id, c.parentChapterId]))
  const ancetres = (chapterId: string | null): string[] => {
    const liste: string[] = []
    let curseur = chapterId === null ? null : parentDe.get(chapterId) ?? null
    const vus = new Set<string>()
    while (curseur !== null && !vus.has(curseur)) {
      vus.add(curseur)
      liste.push(curseur)
      curseur = parentDe.get(curseur) ?? null
    }
    return liste
  }

  const tagsParQuestion = new Map<string, string[]>()
  for (const r of tagRows ?? []) {
    const qid = String(r.question_id)
    const liste = tagsParQuestion.get(qid)
    if (liste) liste.push(String(r.tag_id))
    else tagsParQuestion.set(qid, [String(r.tag_id)])
  }

  // Les questions JOUABLES (brouillons exclus).
  const jouables = (questionRows ?? []).flatMap((r) => {
    if (!isQuestionType(r.type)) return []
    const content = normalizeQuestionContent(r.type, r.content)
    if (!isQuestionReady(r.type, content)) return []
    return [
      {
        id: String(r.id),
        chapterId: r.chapter_id ? String(r.chapter_id) : null,
        type: r.type as CourseQuestionType,
        position: Number(r.position ?? 0),
        content,
      },
    ]
  })
  jouables.sort((a, b) => a.position - b.position)

  // --- Les réglages, relus depuis l'URL ---------------------------------------
  const chapitre = lire('chapitre')
  const porteeBrute = lire('portee')
  const tag = lire('tag')
  let portee: Portee = { kind: 'tout' }
  if (porteeBrute === 'erreurs') portee = { kind: 'erreurs' }
  else if (porteeBrute === 'etiquette' && tag) {
    portee = { kind: 'etiquette', tagId: tag }
  } else if (chapitre) portee = { kind: 'chapitre', chapterId: chapitre }

  const typesBrut = lire('types')
  const longBrut = lire('long')
  const options = normalizeOptions({
    portee,
    sens: lire('sens'),
    types: typesBrut ? typesBrut.split(',') : [],
    longueur: longBrut ? Number(longBrut) : null,
    // `?tout=1` reste compris : c'est l'ancien lien « entraînement libre ».
    mode: lire('tout') === '1' ? 'entrainement' : lire('mode'),
  })

  const nowIso = new Date().toISOString()

  const candidats: CarteCandidate[] = []
  const etats = await chargerEtats(
    supabase,
    user.id,
    jouables.map((q) => q.id),
    nowIso,
  )
  for (const q of jouables) {
    const state = etats.get(q.id)
    if (!state) continue
    candidats.push({
      id: q.id,
      type: q.type,
      chapterId: q.chapterId,
      chapitresParents: ancetres(q.chapterId),
      tagIds: tagsParQuestion.get(q.id) ?? [],
      state,
    })
  }

  const retenus = filtrerPourSession(candidats, options, nowIso)

  // En mode apprentissage, le planificateur plafonne et mélange. Dans les deux
  // autres modes, l'élève a demandé à TOUT repasser : plafonner irait contre.
  const ordre = modePlanifie(options.mode)
    ? composerFile(
        retenus.map((c) => ({ id: c.id, state: c.state })),
        {
          nouvelles: Number(course.new_per_day ?? 15),
          revisions: Number(course.reviews_per_day ?? 80),
        },
        nowIso,
        grainsDuJour(
          retenus.map((c) => c.id),
          toDayKey(new Date()),
        ),
      )
    : retenus.map((c) => c.id)

  const coupe = ordre.slice(0, longueurEffective(ordre.length, options.longueur))

  const parId = new Map(jouables.map((q) => [q.id, q]))
  const queue: PlayableQuestion[] = coupe.flatMap((qid) => {
    const q = parId.get(qid)
    return q ? [{ id: q.id, type: q.type, content: q.content }] : []
  })

  // Extrait dans une constante : TypeScript ne garde pas l'affinement de
  // `options.portee` d'une expression à l'autre.
  const porteeFinale = options.portee
  const chapitreVise =
    porteeFinale.kind === 'chapitre' ? porteeFinale.chapterId : null
  const nomChapitre =
    chapitreVise !== null
      ? chapters.find((c) => c.id === chapitreVise)?.title
      : undefined

  return (
    <>
      {/* Réviser son propre carnet est du travail : sans ce compteur, un élève
          qui s'appuie surtout sur ses notes n'existait pas dans le temps de
          travail affiché sur /moi ni chez ses parents. */}
      <WorkTimer />
      <ReviewSession
        courseId={id}
        chapterId={chapitreVise}
        courseTitle={String(course.title ?? 'Sans titre')}
        scopeLabel={resumeOptions(options, nomChapitre)}
        questions={queue}
        planifie={modePlanifie(options.mode)}
      />
    </>
  )
}
