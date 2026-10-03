import type { SupabaseClient } from '@supabase/supabase-js'
import { after } from 'next/server'
import { PREMIUM_TIERS } from '@/lib/gems'
import { contentLevelFor } from '@/lib/grades'
import {
  applyEvent,
  contexteQuetes,
  dailyQuests,
  normalizeProgress,
  questViews,
  type QuestContext,
  type QuestEvent,
  type QuestProgress,
  type QuestView,
} from '@/lib/quests'
import { toDayKey } from '@/lib/streak'
import type { Tier } from '@/lib/subscription'

// Accès serveur aux quêtes du jour (migrations 205, puis 555 pour le catalogue
// des trois gestes).
//
// Les règles (catalogue, tirage, avancement) vivent dans `lib/quests.ts`, pur et
// testé ; les montants réellement versés sont fixés dans les fonctions SQL
// SECURITY DEFINER. Ce module ne fait que relier les deux depuis les Server
// Actions — et TOLÈRE une base où la migration n'est pas encore passée :
// l'avancement échoue en silence journalisé, jamais en cassant la partie qui
// l'a déclenché. Même contrat que lib/wallet-server.

/** Le contexte de tirage de l'élève : abonnement et classe (le cahier
 *  d'exercices n'est tiré que s'il peut l'ouvrir). Une lecture du profil. */
export async function fetchQuestContext(supabase: SupabaseClient, userId: string): Promise<QuestContext> {
  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier, grade_level')
    .eq('id', userId)
    .maybeSingle<{ subscription_tier: string | null; grade_level: string | null }>()
  const premium = PREMIUM_TIERS.includes((data?.subscription_tier ?? 'free') as Tier)
  return contexteQuetes(premium, data?.grade_level ? contentLevelFor(data.grade_level) : null)
}

/** Lit la progression du jour. Objet vide si la migration n'est pas passée ou
 *  si l'élève n'a encore rien fait aujourd'hui. */
export async function fetchQuestProgress(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string = toDayKey(new Date()),
): Promise<QuestProgress> {
  const { data, error } = await supabase
    .from('daily_quests')
    .select('progress')
    .eq('user_id', userId)
    .eq('day_key', dayKey)
    .maybeSingle<{ progress: unknown }>()
  if (error || !data) return {}
  return normalizeProgress(data.progress)
}

/** Les trois quêtes du jour prêtes à afficher, avec leur avancement. */
export async function fetchQuestViews(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string = toDayKey(new Date()),
  ctx?: QuestContext,
): Promise<QuestView[]> {
  const [contexte, progress] = await Promise.all([
    ctx ?? fetchQuestContext(supabase, userId),
    fetchQuestProgress(supabase, userId, dayKey),
  ])
  return questViews(dayKey, userId, progress, contexte)
}

/** Les quêtes DÉJÀ encaissées aujourd'hui. Une quête payée ne peut plus l'être
 *  (PK en base) : l'UI la coche au lieu de proposer un bouton qui ne ferait
 *  rien. L'id réservé '__jour__' marque le bonus de journée complète. */
export async function fetchClaimedQuestIds(
  supabase: SupabaseClient,
  userId: string,
  dayKey: string = toDayKey(new Date()),
): Promise<string[]> {
  const { data, error } = await supabase
    .from('daily_quest_claims')
    .select('quest_id')
    .eq('user_id', userId)
    .eq('day_key', dayKey)
    .returns<{ quest_id: string }[]>()
  if (error || !data) return []
  return data.map((r) => r.quest_id)
}

export type QuestAdvance = {
  /** Avancement après l'événement (déjà écrêté par le serveur). */
  progress: QuestProgress
  /** Quêtes terminées PAR cet événement — de quoi célébrer au bon moment. */
  justCompleted: string[]
  /** Les trois quêtes du jour sont bouclées. */
  allDone: boolean
}

/**
 * Applique un événement de jeu aux quêtes du jour et persiste le résultat.
 * Appelé depuis les Server Actions (fin de course, cours, quiz, révision,
 * cahier, parties de l'arène).
 *
 * L'avancement est recalculé ICI depuis la progression lue en base — le client
 * n'envoie que ce qui vient de se passer, jamais un total.
 */
export async function advanceQuests(
  supabase: SupabaseClient,
  userId: string,
  event: QuestEvent,
  dayKey: string = toDayKey(new Date()),
): Promise<QuestAdvance> {
  const [ctx, before] = await Promise.all([
    fetchQuestContext(supabase, userId),
    fetchQuestProgress(supabase, userId, dayKey),
  ])
  const after = applyEvent(dayKey, userId, before, event, ctx)
  const defs = dailyQuests(dayKey, userId, ctx)
  const wasDone = (p: QuestProgress, id: string, goal: number) => (p[id] ?? 0) >= goal
  const justCompleted = defs
    .filter((d) => !wasDone(before, d.id, d.goal) && wasDone(after, d.id, d.goal))
    .map((d) => d.id)

  // Rien de tiré aujourd'hui ne bouge : pas d'écriture.
  if (defs.every((d) => (after[d.id] ?? 0) === (before[d.id] ?? 0))) {
    return { progress: before, justCompleted: [], allDone: defs.every((d) => wasDone(before, d.id, d.goal)) }
  }

  const { data, error } = await supabase.rpc('quest_save_progress', {
    p_progress: after,
  })
  if (error) {
    // Migration pas encore passée : la partie reste valide, seules les
    // quêtes n'avancent pas. On ne fait jamais échouer le jeu pour ça.
    console.error('[quetes] progression non enregistrée:', error.message)
    return { progress: before, justCompleted: [], allDone: false }
  }

  const saved = normalizeProgress(data)
  return {
    progress: saved,
    justCompleted,
    allDone: defs.every((d) => (saved[d.id] ?? 0) >= d.goal),
  }
}

/**
 * Fait avancer les quêtes APRÈS la réponse (`after`) : l'écran de fin n'attend
 * rien de cette écriture (règle « une écriture dont l'écran n'attend rien part
 * dans after() », docs/latence.md). Le bandeau relit les quêtes au changement
 * d'écran (components/quetes/QuetesVeille) et annonce « Quête accomplie ».
 * Réservé aux Server Actions et routes : `after` y garde l'accès aux cookies.
 */
export function avancerQuetesApres(supabase: SupabaseClient, userId: string, event: QuestEvent): void {
  after(async () => {
    try {
      await advanceQuests(supabase, userId, event)
    } catch (e) {
      console.error('[quetes] avancement :', e instanceof Error ? e.message : e)
    }
  })
}
