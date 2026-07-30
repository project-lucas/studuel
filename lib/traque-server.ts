import type { SupabaseClient } from '@supabase/supabase-js'
import { bossById, bossForSubject, type Boss } from '@/lib/bosses'
import { toDayKey } from '@/lib/streak'
import {
  emptyGauge,
  normalizeGauge,
  pointsFor,
  poolChapters,
  sortCards,
  traqueCard,
  type TraqueCard,
  type TraqueEvent,
  type TraqueGauge,
} from '@/lib/traque'

// Accès serveur à « La Traque » (migration 212).
//
// Les règles (barème, seuil, fenêtre d'une heure, calendrier de la chasse,
// gemmes) vivent dans `lib/traque.ts`, pur et testé, et sont MIROITÉES en SQL —
// c'est le serveur qui décide du débusquage et du montant versé. Ce module ne
// fait que relier les deux depuis les Server Actions, et TOLÈRE une base où la
// 212 n'est pas encore passée : la traque n'avance pas, la révision qui l'a
// déclenchée reste valide. Même contrat que lib/quests-server.

/** Ce qu'une activité vient de produire, pour UNE matière. */
export type TraqueContribution = {
  /** Matière travaillée (le gardien en est déduit). */
  subject: string | null
  /** Les gestes réalisés (cartes, bonnes réponses, leçons, quiz). */
  event: TraqueEvent
  /** Chapitres travaillés — ils composeront le pool du combat. */
  chapterIds?: readonly string[]
}

export type TraqueCredit = {
  boss: Boss
  /** La matière créditée — le rideau d'apparition l'affiche telle quelle. */
  subject: string
  points: number
  /** Le boss vient de SORTIR à l'instant : de quoi déclencher l'éclair. */
  justDebusque: boolean
  /** Heure de sortie (ms epoch), d'où se déduit la fin de la fenêtre. */
  debusqueAt: number | null
}

/**
 * Crédite la jauge du gardien d'une matière. Le client n'envoie que des gestes ;
 * les points sont calculés ici et re-bornés par la RPC (plafond quotidien).
 * Renvoie null si rien n'a été crédité (visiteur, matière inconnue, 212 absente).
 */
export async function creditTraque(
  supabase: SupabaseClient,
  contribution: TraqueContribution,
): Promise<TraqueCredit | null> {
  const points = pointsFor(contribution.event)
  if (points <= 0) return null

  const boss = bossForSubject(contribution.subject)
  const { data, error } = await supabase.rpc('traque_credit', {
    p_boss_id: boss.id,
    p_points: points,
    p_chapters: poolChapters(contribution.chapterIds ?? [], 5),
  })
  if (error) {
    // Migration 212 pas encore passée : la session reste valide, seule la
    // traque n'avance pas. On ne fait jamais échouer le travail pour ça.
    console.error('[traque] jauge non créditée:', error.message)
    return null
  }
  const row = data as {
    points?: unknown
    just_debusque?: unknown
    debusque_at?: unknown
  } | null
  const debusqueAt =
    typeof row?.debusque_at === 'string' ? Date.parse(row.debusque_at) : NaN
  return {
    boss,
    subject: contribution.subject ?? '',
    points: Math.max(0, Number(row?.points) || 0),
    justDebusque: row?.just_debusque === true,
    debusqueAt: Number.isFinite(debusqueAt) ? debusqueAt : null,
  }
}

/**
 * Crédite plusieurs matières d'un coup (une session « À revoir » brasse
 * volontiers trois matières). Les appels partent en parallèle : chaque jauge
 * est une ligne distincte, elles ne se bloquent pas entre elles.
 */
export async function creditTraqueMany(
  supabase: SupabaseClient,
  contributions: readonly TraqueContribution[],
): Promise<TraqueCredit[]> {
  const results = await Promise.all(
    contributions.map((c) => creditTraque(supabase, c)),
  )
  return results.filter((r): r is TraqueCredit => r !== null)
}

/**
 * Regroupe des réponses par matière et crédite chaque gardien. Sert aux
 * sessions qui mélangent les matières (file « À revoir », examen blanc) : une
 * carte révisée en Maths ne doit pas remplir la jauge du boss de Français.
 */
export async function creditTraqueFromAnswers(
  supabase: SupabaseClient,
  answers: readonly { subject: string | null; good: boolean }[],
  geste: 'carte' | 'bonne_reponse' = 'carte',
): Promise<TraqueCredit[]> {
  const bySubject = new Map<string, number>()
  for (const a of answers) {
    const subject = a.subject ?? ''
    if (!subject) continue
    bySubject.set(subject, (bySubject.get(subject) ?? 0) + 1)
  }
  return creditTraqueMany(
    supabase,
    [...bySubject].map(([subject, count]) => ({
      subject,
      event: { [geste]: count } as TraqueEvent,
    })),
  )
}

// --------------------------------------------- de quoi savoir QUELLE matière
// Les gestes arrivent avec un id de leçon ou de quiz, pas avec une matière.
// Deux résolveurs, une requête chacun : sans matière, on ne saurait pas quel
// gardien nourrir, et sans chapitre, le combat ne porterait pas sur ce qui
// vient d'être révisé. Un échec ne casse rien — la traque n'avance pas.

export type TraqueContext = { subject: string | null; chapterId: string | null }

const EMPTY_CONTEXT: TraqueContext = { subject: null, chapterId: null }

/** Matière + chapitre d'une leçon. */
export async function lessonContext(
  supabase: SupabaseClient,
  lessonId: string,
): Promise<TraqueContext> {
  type Row = {
    chapter_id: string | null
    chapters: { subjects: { name: string | null } | null } | null
  }
  const { data } = await supabase
    .from('lessons')
    .select('chapter_id, chapters!inner(subjects!inner(name))')
    .eq('id', lessonId)
    .maybeSingle<Row>()
  if (!data) return EMPTY_CONTEXT
  return {
    subject: data.chapters?.subjects?.name ?? null,
    chapterId: data.chapter_id ?? null,
  }
}

/** Matière + chapitre d'un quiz (la matière est portée par le quiz lui-même). */
export async function quizContext(
  supabase: SupabaseClient,
  quizId: string,
): Promise<TraqueContext> {
  type Row = { subject: string | null; lessons: { chapter_id: string | null } | null }
  const { data } = await supabase
    .from('quizzes')
    .select('subject, lessons(chapter_id)')
    .eq('id', quizId)
    .maybeSingle<Row>()
  if (!data) return EMPTY_CONTEXT
  return {
    subject: data.subject ?? null,
    chapterId: data.lessons?.chapter_id ?? null,
  }
}

/**
 * Toutes les jauges de l'élève, indexées par id de boss. `null` quand la
 * migration 212 n'est pas passée — et c'est une distinction qui compte : une
 * carte vide veut dire « personne n'a encore commencé à traquer », tandis que
 * `null` veut dire « le système n'existe pas ». Afficher des jauges qui ne
 * monteront jamais serait un mensonge poli.
 */
export async function fetchGauges(
  supabase: SupabaseClient,
  userId: string,
): Promise<Map<string, TraqueGauge> | null> {
  const BASE = 'boss_id, points, chapters, victories, debusque_at'
  const read = (columns: string) =>
    supabase
      .from('boss_gauges')
      .select(columns)
      .eq('user_id', userId)
      .returns<Record<string, unknown>[]>()

  // `attempts` arrive avec la 213. Tant qu'elle n'est pas exécutée, la colonne
  // n'existe pas et la lecture échouerait : on relit sans elle plutôt que de
  // faire disparaître toute la traque pour un compteur d'affichage.
  let { data, error } = await read(`${BASE}, attempts`)
  if (error) ({ data, error } = await read(BASE))
  if (error) return null
  if (!data) return new Map()
  const out = new Map<string, TraqueGauge>()
  for (const row of data) {
    const g = normalizeGauge(row)
    if (g) out.set(g.bossId, g)
  }
  return out
}

/**
 * La feuille Boss, prête à afficher : une carte par matière suivie par l'élève,
 * triée (ce qui se joue maintenant d'abord). Les matières sans gardien
 * identifiable retombent sur Nox — on les écarte plutôt que d'afficher dix
 * fois la même carte.
 */
export async function fetchTraqueBoard(
  supabase: SupabaseClient,
  userId: string,
  subjects: readonly { name: string; slug: string }[],
  dayKey: string = toDayKey(new Date()),
  nowMs: number = Date.now(),
): Promise<TraqueCard[]> {
  return buildTraqueBoard(
    await fetchGauges(supabase, userId),
    subjects,
    dayKey,
    nowMs,
  )
}

/** Le plateau, ou [] tant que la migration 212 n'a pas été exécutée. */

/**
 * La composition seule, sans requête : l'arène lit déjà les jauges dans sa
 * première vague (elles ne dépendent pas de la classe), et son catalogue de
 * matières est servi par le cache. Rien ne justifierait une vague de plus.
 */
export function buildTraqueBoard(
  gauges: Map<string, TraqueGauge> | null,
  subjects: readonly { name: string; slug: string }[],
  dayKey: string = toDayKey(new Date()),
  nowMs: number = Date.now(),
): TraqueCard[] {
  if (gauges === null) return []

  // Une matière par gardien : deux matières qui partagent un boss (Physique et
  // Chimie) ne doivent pas produire deux cartes concurrentes sur la même jauge.
  type Entry = { boss: Boss; name: string; slug: string }
  const byBoss = new Map<string, Entry>()
  for (const { name, slug } of subjects) {
    const boss = bossForSubject(name)
    if (boss.id === 'nox') continue // filet de sécurité, pas une matière
    if (!byBoss.has(boss.id)) byBoss.set(boss.id, { boss, name, slug })
  }

  // Une jauge déjà entamée sur un gardien absent de la sélection reste visible :
  // l'élève a travaillé cette matière, sa traque ne doit pas disparaître.
  for (const [bossId] of gauges) {
    if (byBoss.has(bossId)) continue
    const boss = bossById(bossId)
    if (boss) byBoss.set(bossId, { boss, name: boss.epithet, slug: '' })
  }

  return sortCards(
    [...byBoss.values()].map(({ boss, name, slug }) =>
      traqueCard(
        gauges.get(boss.id) ?? emptyGauge(boss.id),
        boss,
        name,
        dayKey,
        nowMs,
        slug,
      ),
    ),
  )
}
