'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateRevisionToday } from '@/lib/habits'
import { toDayKey } from '@/lib/streak'
import {
  reviewAfterAnswer,
  REVANCHE_CLEAR_COINS,
  type ReviewAnswer,
  type ReviewKind,
} from '@/lib/srs'

// Marque une leçon comme terminée : le chapitre progresse (plancher 30 %)
// et la journée est validée dans la série.
export async function completeLesson(
  lessonId: string,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
    )

  // Coche « Révision quotidienne » du jour tout de suite si le seuil est atteint.
  if (!error) await validateRevisionToday(supabase, user.id)

  revalidatePath('/reviser')
  revalidatePath('/moi')
  return { saved: !error }
}

// Trace la consultation d'un support de leçon (fiche de révision, studygram) :
// l'anneau d'avancement de la leçon se remplit sur la page matière.
export async function markLessonActivity(
  lessonId: string,
  activity: 'revision' | 'studygram',
): Promise<{ saved: boolean }> {
  if (
    !UUID_RE.test(String(lessonId)) ||
    !['revision', 'studygram'].includes(activity)
  ) {
    return { saved: false }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const { error } = await supabase.from('lesson_activities').upsert(
    { user_id: user.id, lesson_id: lessonId, activity },
    { onConflict: 'user_id,lesson_id,activity', ignoreDuplicates: true },
  )

  if (!error) revalidatePath('/reviser')
  return { saved: !error }
}

// -----------------------------------------------------------------------------
// SRS + Revanche : chaque réponse (quiz, flashcards, Défi) met à jour l'état
// de répétition espacée de l'item — succès = prochaine révision plus lointaine,
// erreur = retour à demain + entrée dans la Revanche. Appelé en fin de session
// par les players, en « fire and forget ».
// -----------------------------------------------------------------------------

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const KINDS: ReviewKind[] = ['question', 'card']

export async function recordReviewAnswers(
  answers: ReviewAnswer[],
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  // Assainissement : formes valides seulement, dernière réponse par item,
  // volume borné (une session ne dépasse jamais quelques dizaines d'items).
  const byKey = new Map<string, ReviewAnswer>()
  for (const a of (Array.isArray(answers) ? answers : []).slice(0, 120)) {
    if (!a || !KINDS.includes(a.kind) || !UUID_RE.test(String(a.id))) continue
    byKey.set(`${a.kind}:${a.id}`, {
      kind: a.kind,
      id: String(a.id),
      subject:
        typeof a.subject === 'string' ? a.subject.slice(0, 80) : null,
      good: a.good === true,
    })
  }
  const clean = [...byKey.values()].slice(0, 60)
  if (clean.length === 0) return { saved: true }

  // État actuel des items touchés (pour prolonger la série de succès).
  const { data: existing } = await supabase
    .from('review_items')
    .select('item_kind, item_id, streak, lapses')
    .eq('user_id', user.id)
    .in('item_id', clean.map((a) => a.id))
  const prevByKey = new Map(
    (existing ?? []).map((r) => [`${r.item_kind}:${r.item_id}`, r]),
  )

  const today = toDayKey(new Date())
  const rows = clean.map((a) => {
    const prev = prevByKey.get(`${a.kind}:${a.id}`) ?? null
    const next = reviewAfterAnswer(prev, a.good, today)
    return {
      user_id: user.id,
      item_kind: a.kind,
      item_id: a.id,
      subject: a.subject,
      ...next,
      updated_at: new Date().toISOString(),
    }
  })

  const { error } = await supabase
    .from('review_items')
    .upsert(rows, { onConflict: 'user_id,item_kind,item_id' })
  if (error) {
    console.error('[srs] enregistrement des réponses impossible:', error.message)
    return { saved: false }
  }

  revalidatePath('/reviser')
  return { saved: true }
}

// Fin d'une session « À revoir » (/reviser/revoir) : enregistre les réponses,
// crédite l'XP (session de révision = test_sessions sans quiz), et si la
// Revanche vient d'être vidée, verse le bonus en pièces (une fois par jour,
// vérifié en SQL). Renvoie ce qui s'est réellement passé pour l'écran de fin.
export async function finishReviewSession(
  answers: ReviewAnswer[],
): Promise<{ saved: boolean; revancheCleared: boolean; coins: number }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false, revancheCleared: false, coins: 0 }

  const { saved } = await recordReviewAnswers(answers)
  if (!saved) return { saved: false, revancheCleared: false, coins: 0 }

  // XP et série : une session de révision est une session de test sans quiz.
  const list = (Array.isArray(answers) ? answers : []).slice(0, 60)
  const score = list.filter((a) => a?.good === true).length
  const { error } = await supabase.from('test_sessions').insert({
    user_id: user.id,
    quiz_id: null,
    score,
    total: list.length,
  })
  if (!error) await validateRevisionToday(supabase, user.id)

  // Bonus Revanche : la fonction SQL revérifie que la Revanche est vide et
  // qu'aucun bonus n'a été versé aujourd'hui.
  const { data: cleared } = await supabase.rpc('claim_revanche_bonus', {
    p_coins: REVANCHE_CLEAR_COINS,
  })

  revalidatePath('/reviser')
  revalidatePath('/moi')
  revalidatePath('/tresor')
  return {
    saved: !error,
    revancheCleared: cleared === true,
    coins: cleared === true ? REVANCHE_CLEAR_COINS : 0,
  }
}

// Fin d'un examen blanc : historique (exam_blanc_sessions) + XP et série
// (test_sessions, comme un gros quiz). Score et bilan sont bornés côté
// serveur — le client n'écrit jamais de valeur libre.
export async function finishExamBlanc(
  score: number,
  total: number,
  report: unknown,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const clean = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0
  const cleanTotal = clean(total, 40)
  const cleanScore = clean(score, cleanTotal)

  // Bilan : uniquement des lignes à la forme attendue, tronquées.
  const cleanReport = (Array.isArray(report) ? report : [])
    .slice(0, 40)
    .flatMap((r) => {
      if (!r || typeof r !== 'object') return []
      const row = r as Record<string, unknown>
      return [
        {
          chapterId:
            typeof row.chapterId === 'string' ? row.chapterId.slice(0, 40) : null,
          chapterTitle:
            typeof row.chapterTitle === 'string'
              ? row.chapterTitle.slice(0, 120)
              : null,
          subject:
            typeof row.subject === 'string' ? row.subject.slice(0, 80) : '',
          correct: clean(Number(row.correct), 40),
          total: clean(Number(row.total), 40),
          verdict: ['solide', 'fragile', 'a_revoir'].includes(
            String(row.verdict),
          )
            ? String(row.verdict)
            : 'a_revoir',
        },
      ]
    })

  const [{ error: examError }, { error: xpError }] = await Promise.all([
    supabase.from('exam_blanc_sessions').insert({
      user_id: user.id,
      score: cleanScore,
      total: cleanTotal,
      report: cleanReport,
    }),
    supabase.from('test_sessions').insert({
      user_id: user.id,
      quiz_id: null,
      score: cleanScore,
      total: cleanTotal,
    }),
  ])
  if (!xpError) await validateRevisionToday(supabase, user.id)

  revalidatePath('/reviser')
  revalidatePath('/moi')
  return { saved: !examError && !xpError }
}

// Persiste la sélection de matières de l'élève (bouton « Éditer »).
export async function saveSelectedSubjects(slugs: string[]): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const clean = Array.from(
    new Set(slugs.filter((s) => typeof s === 'string' && s.length < 64)),
  )

  await supabase
    .from('profiles')
    .update({ selected_subjects: clean })
    .eq('id', user.id)

  revalidatePath('/reviser')
}
