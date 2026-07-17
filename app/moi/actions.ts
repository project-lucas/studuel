'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { habitDays, PLANIFIER_CATALOG_ID } from '@/lib/habits'
import { CAPACITY_QUESTIONS, computeCapacity } from '@/lib/capacity'
import {
  DEBRIEF_REWARD_COINS,
  debriefComplete,
  isDebriefOutcome,
  isDebriefPairId,
  type DebriefOutcome,
} from '@/lib/debrief'
import { normalizeAvatarConfig } from '@/lib/avatar'
import {
  normalizeGrade,
  MAX_GRADE_OUT_OF,
  MAX_GRADE_COEFFICIENT,
  type SchoolGrade,
} from '@/lib/notes'
import { toDayKey } from '@/lib/streak'
import { GRADE_LEVELS } from '@/lib/types'
import { normalizeNextExam } from '@/lib/next-exam'
import {
  normalizeWeeklyGoalsList,
  type WeeklyGoal,
} from '@/lib/weekly-goals'
import type { CommuteSlot, Habit } from '@/lib/types'

// Le client Supabase tel que renvoyé par notre createClient serveur.
type ServerSupabase = Awaited<ReturnType<typeof createClient>>

const isTimeStr = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{2}:\d{2}$/.test(v)

// target.times nettoyé : { '0'..'6' → 'HH:MM' }.
function habitTimes(target: Record<string, unknown>): Record<string, string> {
  const raw = target.times
  const clean: Record<string, string> = {}
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (isTimeStr(v)) clean[k] = v
    }
  }
  return clean
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Durée valide en minutes (1..600), sinon null.
const cleanMinutes = (v: unknown): number | null => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 && n <= 600 ? Math.round(n) : null
}

// Semaine type : ajoute un événement (mission, jour, heure, durée). Active la
// mission si besoin, sinon ajoute le jour + son heure à sa planification.
export async function addEvent(
  catalogId: string,
  day: number,
  time: string | null,
  duration: number | null = null,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !Number.isInteger(day) || day < 0 || day > 6) return
  const cleanTime = isTimeStr(time) ? time : null
  const dur = cleanMinutes(duration)

  const { data: existing } = await supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .eq('user_id', userId)
    .eq('catalog_id', catalogId)
    .maybeSingle<Habit>()

  if (!existing) {
    const { data: entry } = await supabase
      .from('habit_catalog')
      .select('id, default_target')
      .eq('id', catalogId)
      .maybeSingle()
    if (!entry) return
    const target: Record<string, unknown> = {
      ...((entry.default_target as Record<string, unknown> | null) ?? {}),
      days: [day],
    }
    if (cleanTime) target.times = { [String(day)]: cleanTime }
    if (dur !== null) target.duration = dur
    await supabase
      .from('habits')
      .insert({ user_id: userId, catalog_id: catalogId, target })
  } else {
    const target = existing.target as Record<string, unknown>
    const days = Array.from(new Set([...habitDays(existing), day])).sort()
    const times = habitTimes(target)
    if (cleanTime) times[String(day)] = cleanTime
    else delete times[String(day)]
    const next: Record<string, unknown> = { ...target, days, times }
    if (dur !== null) next.duration = dur
    await supabase
      .from('habits')
      .update({ target: next })
      .eq('id', existing.id)
      .eq('user_id', userId)
  }
  revalidatePath('/moi')
}

// Semaine type : change la durée prévue d'un événement (minutes).
export async function setEventDuration(
  habitId: string,
  minutes: number,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  const dur = cleanMinutes(minutes)
  if (!userId || dur === null) return

  const { data: habit } = await supabase
    .from('habits')
    .select('id, target')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle<Habit>()
  if (!habit) return

  const target = (habit.target as Record<string, unknown>) ?? {}
  await supabase
    .from('habits')
    .update({ target: { ...target, duration: dur } })
    .eq('id', habitId)
    .eq('user_id', userId)
  revalidatePath('/moi')
}

// Semaine type : retire un événement (un jour d'une mission). Plus aucun jour
// → la mission est désactivée. La mission fixe Studuel ne bouge pas.
export async function removeEvent(habitId: string, day: number): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !Number.isInteger(day)) return

  const { data: habit } = await supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle<Habit>()
  if (!habit || habit.catalog_id === PLANIFIER_CATALOG_ID) return

  const days = habitDays(habit).filter((d) => d !== day)
  if (days.length === 0) {
    await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId)
  } else {
    const target = habit.target as Record<string, unknown>
    const times = habitTimes(target)
    delete times[String(day)]
    await supabase
      .from('habits')
      .update({ target: { ...target, days, times } })
      .eq('id', habitId)
      .eq('user_id', userId)
  }
  revalidatePath('/moi')
}

// Check manuel du jour (sommeil, sport, lecture…).
export async function toggleHabitLog(
  habitId: string,
  date: string,
  completed: boolean,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return

  // L'habitude doit appartenir à l'utilisateur (la RLS de habit_logs ne
  // contrôle que user_id, pas la propriété de habit_id).
  const { data: habit } = await supabase
    .from('habits')
    .select('id')
    .eq('id', habitId)
    .eq('user_id', userId)
    .maybeSingle()
  if (!habit) return

  await supabase.from('habit_logs').upsert(
    {
      habit_id: habitId,
      user_id: userId,
      date,
      completed,
      auto_validated: false,
    },
    { onConflict: 'habit_id,date' },
  )
  revalidatePath('/moi')
}

// Classe / année scolaire : change le niveau de l'élève (6e → Tle). Pilote tout
// le contenu filtré par niveau (Réviser, Défi, examen blanc…), d'où le
// revalidate global. GRANT UPDATE(grade_level) déjà accordé par 010_moi.sql.
export async function saveGradeLevel(grade: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return
  if (!GRADE_LEVELS.includes(grade as (typeof GRADE_LEVELS)[number])) return

  const { error } = await supabase
    .from('profiles')
    .update({ grade_level: grade })
    .eq('id', userId)
  if (error) console.error('[moi] classe non enregistrée:', error.message)
  // Le niveau conditionne le contenu de tous les onglets : on rafraîchit tout.
  revalidatePath('/', 'layout')
}

// Annonce un contrôle : ajoute (matière+chapitre+date) à la liste. On résout le
// chapitre EN BASE pour ne stocker que des données fiables (titre, niveau, slug),
// pas ce que dit le client. L'écriture passe par la RPC atomique
// add_upcoming_exam (read-modify-write sûr contre la concurrence : deux appareils
// qui annoncent en même temps ne s'écrasent plus). Le Défi pioche ensuite dans
// ces chapitres. Voir supabase/087_upcoming_exams.sql.
// Renvoie { ok } pour que l'UI ne ferme la feuille qu'en cas de succès réel
// (si 087 n'est pas passée, la RPC est absente → { ok: false }, pas un faux OK).
export async function addUpcomingExam(
  chapterId: string,
  date: string | null,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof chapterId !== 'string' || chapterId.length === 0)
    return { ok: false }

  const cleanDate =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null

  // Le chapitre doit exister ; sa matière (slug) vient de la jointure.
  type ChapterRow = {
    id: string
    title: string
    level: string
    subject: { slug: string } | null
  }
  const { data: chapter } = await supabase
    .from('chapters')
    .select('id, title, level, subject:subjects!inner(slug)')
    .eq('id', chapterId)
    .maybeSingle<ChapterRow>()
  if (!chapter?.subject?.slug) return { ok: false }

  const exam = normalizeNextExam({
    subject: chapter.subject.slug,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    level: chapter.level,
    date: cleanDate,
  })
  if (!exam) return { ok: false }

  const { error } = await supabase.rpc('add_upcoming_exam', { p_exam: exam })
  if (error) {
    // RPC absente (087 pas passée) ou échec DB : on signale au client.
    console.error('[moi] contrôle non ajouté:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  revalidatePath('/defi')
  return { ok: true }
}

// Retire un contrôle de la liste (contrôle passé, ou déclaré par erreur).
export async function removeUpcomingExam(
  chapterId: string,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof chapterId !== 'string' || chapterId.length === 0)
    return { ok: false }

  const { error } = await supabase.rpc('remove_upcoming_exam', {
    p_chapter: chapterId,
  })
  if (error) {
    console.error('[moi] contrôle non retiré:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  revalidatePath('/defi')
  return { ok: true }
}

// --- Notes réelles — migration 167 -------------------------------------------
// L'élève saisit les notes de ses vrais contrôles ; la carte « Mes notes » de
// Moi en tire moyennes et évolution par trimestre (lib/notes.ts). Écriture
// directe sur la table (lignes indépendantes, RLS « chacun ses lignes ») —
// chaque action renvoie { ok } pour que l'UI ne confirme qu'un succès réel
// (167 pas passée → table absente → { ok: false }, pas un faux OK).

export async function addGradeAction(input: {
  subject: string
  score: number
  outOf: number
  coefficient: number
  date: string
  label: string | null
}): Promise<{ ok: boolean; grade: SchoolGrade | null }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false, grade: null }

  // Bornes identiques aux CHECK de la base : on refuse ici plutôt que de
  // laisser la contrainte SQL échouer avec un message opaque.
  const score = Number(input.score)
  const outOf = Number(input.outOf)
  const coefficient = Number(input.coefficient)
  if (
    typeof input.subject !== 'string' ||
    input.subject.length === 0 ||
    !Number.isFinite(score) ||
    !Number.isFinite(outOf) ||
    !Number.isFinite(coefficient) ||
    score < 0 ||
    outOf <= 0 ||
    outOf > MAX_GRADE_OUT_OF ||
    score > outOf ||
    coefficient <= 0 ||
    coefficient > MAX_GRADE_COEFFICIENT ||
    typeof input.date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.date)
  ) {
    return { ok: false, grade: null }
  }

  // La matière doit exister au catalogue : on ne stocke que des slugs fiables.
  const { data: subjectRow } = await supabase
    .from('subjects')
    .select('slug')
    .eq('slug', input.subject)
    .maybeSingle()
  if (!subjectRow) return { ok: false, grade: null }

  const label =
    typeof input.label === 'string' && input.label.trim().length > 0
      ? input.label.trim().slice(0, 120)
      : null

  const { data, error } = await supabase
    .from('school_grades')
    .insert({
      user_id: userId,
      subject: input.subject,
      label,
      score,
      out_of: outOf,
      coefficient,
      date: input.date,
    })
    .select('id, subject, label, score, out_of, coefficient, date')
    .single()
  if (error) {
    console.error('[moi] note non enregistrée:', error.message)
    return { ok: false, grade: null }
  }
  revalidatePath('/moi')
  return { ok: true, grade: normalizeGrade(data) }
}

// Retire une note (saisie par erreur). La RLS garantit qu'on ne peut effacer
// que les siennes ; le .eq('user_id') est une ceinture en plus.
export async function removeGradeAction(id: string): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof id !== 'string' || id.length === 0) return { ok: false }

  const { error } = await supabase
    .from('school_grades')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) {
    console.error('[moi] note non retirée:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  return { ok: true }
}

// Bilan de capacités : réponses du questionnaire (0 = Jamais … 3 = Toujours),
// score en % stocké sur le profil. Voir supabase/013_capacite.sql.
export async function saveCapacityQuiz(
  answers: Record<string, number>,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const clean: Record<string, number> = {}
  for (const q of CAPACITY_QUESTIONS) {
    const v = answers[q.id]
    if (Number.isInteger(v) && v >= 0 && v <= 3) clean[q.id] = v
  }
  if (Object.keys(clean).length === 0) return

  const { error } = await supabase
    .from('profiles')
    .update({
      capacity_quiz: {
        answers: clean,
        score: computeCapacity(clean),
        date: toDayKey(new Date()),
      },
    })
    .eq('id', userId)
  // Un GRANT UPDATE manquant (cf. 016_capacite_grant.sql) échoue sans throw :
  // on le loggue pour ne plus jamais perdre un bilan en silence.
  if (error) console.error('[moi] bilan de capacités non enregistré:', error.message)
  revalidatePath('/moi')
}

// Débrief d'habitudes : remplace la sélection des habitudes-freins référencées
// par l'élève (catalogue fermé lib/debrief.ts). Les logs des jours passés
// restent — l'historique n'est pas réécrit. Voir supabase/027_debrief.sql.
export async function saveDebriefHabits(pairIds: string[]): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !Array.isArray(pairIds)) return

  const valid = [...new Set(pairIds.filter((id) => isDebriefPairId(id)))]
  await supabase.from('debrief_habits').delete().eq('user_id', userId)
  if (valid.length > 0) {
    const { error } = await supabase
      .from('debrief_habits')
      .insert(valid.map((pair_id) => ({ user_id: userId, pair_id })))
    if (error) console.error('[moi] débrief non enregistré:', error.message)
  }
  // Modifier la sélection peut compléter le débrief du jour (ex. retirer la
  // seule habitude non répondue) : on tente le crédit ici aussi, sinon l'UI
  // affiche « +10 pièces obtenu » sans que les pièces soient jamais versées.
  // Idempotent (1×/jour UTC), donc sans risque de double crédit avec logDebrief.
  await maybeClaimDebriefReward(supabase, userId)
  revalidatePath('/moi')
}

// Récompense du débrief du jour : si toutes les habitudes référencées ont une
// issue aujourd'hui, on réclame le forfait de pièces. claim_debrief_reward est
// idempotent (une fois par jour UTC), donc on peut l'appeler à chaque tap sans
// risque de double crédit. Toute erreur reste non bloquante (loggée).
async function maybeClaimDebriefReward(
  supabase: ServerSupabase,
  userId: string,
): Promise<void> {
  const date = toDayKey(new Date())
  const [{ data: selRows }, { data: logRows }] = await Promise.all([
    supabase.from('debrief_habits').select('pair_id').eq('user_id', userId),
    supabase
      .from('debrief_logs')
      .select('pair_id, outcome')
      .eq('user_id', userId)
      .eq('date', date),
  ])

  const selected = (selRows ?? []).map((r) => String(r.pair_id))
  const outcomes: Record<string, DebriefOutcome> = {}
  for (const r of logRows ?? []) {
    if (isDebriefOutcome(r.outcome)) outcomes[String(r.pair_id)] = r.outcome
  }
  if (!debriefComplete(selected, outcomes)) return

  const { error } = await supabase.rpc('claim_debrief_reward', {
    p_coins: DEBRIEF_REWARD_COINS,
  })
  // Fonction absente (081 pas encore passée) → on n'en fait pas un plantage.
  if (error) console.error('[moi] récompense débrief non créditée:', error.message)
}

// Débrief du jour : victoire ('good'), rechute ('bad') ou effacement (null).
export async function logDebrief(
  pairId: string,
  outcome: 'good' | 'bad' | null,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !isDebriefPairId(pairId)) return
  const date = toDayKey(new Date())

  if (outcome === null) {
    await supabase
      .from('debrief_logs')
      .delete()
      .match({ user_id: userId, pair_id: pairId, date })
  } else if (isDebriefOutcome(outcome)) {
    await supabase.from('debrief_logs').upsert(
      { user_id: userId, pair_id: pairId, date, outcome },
      { onConflict: 'user_id,pair_id,date' },
    )
    // Créditer dès que le débrief du jour est complet (idempotent, 1×/jour).
    await maybeClaimDebriefReward(supabase, userId)
  }
  revalidatePath('/moi')
}

// Avatar personnalisé : enregistre la config choisie (validée contre le
// catalogue fermé de lib/avatar.ts). Voir supabase/082_avatar.sql.
export async function saveAvatar(config: unknown): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const clean = normalizeAvatarConfig(config)
  const { error } = await supabase
    .from('profiles')
    .update({ avatar: clean })
    .eq('id', userId)
  // GRANT UPDATE(avatar) manquant (082 pas passée) échouerait en silence.
  if (error) console.error('[moi] avatar non enregistré:', error.message)
  revalidatePath('/moi')
}

// Créneaux de trajet (validation auto des quiz en déplacement).
export async function saveCommuteSlots(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const isTime = (v: string) => /^\d{2}:\d{2}$/.test(v)
  const slots: CommuteSlot[] = []
  for (const i of [1, 2]) {
    const start = String(formData.get(`start${i}`) ?? '')
    const end = String(formData.get(`end${i}`) ?? '')
    // Un créneau inversé (fin avant début) ne matcherait jamais rien.
    if (isTime(start) && isTime(end) && start < end) slots.push({ start, end })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ commute_slots: slots })
    .eq('id', userId)
  if (error) console.error('[moi] créneaux de trajet non enregistrés:', error.message)
  revalidatePath('/moi')
}

// --- Objectifs perso de la semaine — migration 157 ---------------------------
// Les 3 écritures passent par des RPC atomiques (read-modify-write sous
// FOR UPDATE, modèle 087/156). Chacune renvoie { ok, goals } : la liste
// normalisée revient à l'UI pour rester synchro sans re-fetch. Si 157 n'est pas
// passée, la RPC est absente → { ok:false } (pas de faux succès), goals = [].
type GoalsResult = { ok: boolean; goals: WeeklyGoal[] }

// Ajoute un objectif à la semaine `week` (clé du lundi 'YYYY-MM-DD'). L'id et
// l'état non coché sont posés en base ; les objectifs des autres semaines sont
// purgés (reset hebdo).
export async function addWeeklyGoalAction(
  text: string,
  week: string,
): Promise<GoalsResult> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false, goals: [] }

  const cleanText = typeof text === 'string' ? text.trim() : ''
  if (cleanText.length === 0 || !/^\d{4}-\d{2}-\d{2}$/.test(week)) {
    return { ok: false, goals: [] }
  }

  const { data, error } = await supabase.rpc('add_weekly_goal', {
    p_text: cleanText,
    p_week: week,
  })
  if (error) {
    console.error('[moi] objectif non ajouté:', error.message)
    return { ok: false, goals: [] }
  }
  revalidatePath('/moi')
  return { ok: true, goals: normalizeWeeklyGoalsList(data) }
}

// Coche / décoche un objectif.
export async function toggleWeeklyGoalAction(id: string): Promise<GoalsResult> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof id !== 'string' || id.length === 0) {
    return { ok: false, goals: [] }
  }

  const { data, error } = await supabase.rpc('toggle_weekly_goal', { p_id: id })
  if (error) {
    console.error('[moi] objectif non basculé:', error.message)
    return { ok: false, goals: [] }
  }
  revalidatePath('/moi')
  return { ok: true, goals: normalizeWeeklyGoalsList(data) }
}

// Retire un objectif.
export async function removeWeeklyGoalAction(id: string): Promise<GoalsResult> {
  const { supabase, userId } = await requireUser()
  if (!userId || typeof id !== 'string' || id.length === 0) {
    return { ok: false, goals: [] }
  }

  const { data, error } = await supabase.rpc('remove_weekly_goal', { p_id: id })
  if (error) {
    console.error('[moi] objectif non retiré:', error.message)
    return { ok: false, goals: [] }
  }
  revalidatePath('/moi')
  return { ok: true, goals: normalizeWeeklyGoalsList(data) }
}
