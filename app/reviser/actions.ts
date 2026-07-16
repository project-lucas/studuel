'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateRevisionToday, validateCommuteToday } from '@/lib/habits'
import { toDayKey } from '@/lib/streak'
import {
  reviewAfterAnswer,
  sanitizeReviewAnswers,
  REVANCHE_CLEAR_COINS,
  type ReviewAnswer,
} from '@/lib/srs'
import {
  normalizeOralList,
  isOralStatus,
  type OralText,
  type OralTextStatus,
} from '@/lib/oral-texts'

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
  const clean = sanitizeReviewAnswers(answers)
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
  // On repart de la MÊME liste assainie que le SRS (dédup + entrées valides),
  // sinon des doublons côté client gonfleraient le total sans correspondre aux
  // items réellement suivis.
  const clean = sanitizeReviewAnswers(answers)
  const score = clean.filter((a) => a.good).length
  const { error } = await supabase.from('test_sessions').insert({
    user_id: user.id,
    quiz_id: null,
    score,
    total: clean.length,
  })
  if (!error) {
    await validateRevisionToday(supabase, user.id)
    await validateCommuteToday(supabase, user.id)
  }

  // Bonus Revanche : la fonction SQL revérifie que la Revanche est vide et
  // qu'aucun bonus n'a été versé aujourd'hui.
  const { data: cleared } = await supabase.rpc('claim_revanche_bonus', {
    p_coins: REVANCHE_CLEAR_COINS,
  })

  revalidatePath('/reviser')
  revalidatePath('/moi')
  revalidatePath('/coffre')
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
  if (!xpError) {
    await validateRevisionToday(supabase, user.id)
    await validateCommuteToday(supabase, user.id)
  }

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

// --- Textes du bac oral (le descriptif) — migration 156 ----------------------
// Les 3 écritures passent par des RPC atomiques (read-modify-write sûr sous
// FOR UPDATE, cf. add_upcoming_exam). Chacune renvoie { ok, texts } : la liste
// normalisée revient à l'UI pour rester synchro sans re-fetch. Si 156 n'est pas
// passée, la RPC est absente → { ok: false } (pas de faux succès), texts = [].
type OralResult = { ok: boolean; texts: OralText[] }

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

// Ajoute un texte au descriptif (titre + œuvre facultative). L'id et le statut
// initial sont posés en base.
export async function addOralTextAction(
  title: string,
  work: string | null,
): Promise<OralResult> {
  const supabase = await createClient()
  if (!(await requireUserId())) return { ok: false, texts: [] }

  const cleanTitle = typeof title === 'string' ? title.trim() : ''
  if (cleanTitle.length === 0) return { ok: false, texts: [] }
  const cleanWork =
    typeof work === 'string' && work.trim().length > 0 ? work.trim() : null

  const { data, error } = await supabase.rpc('add_oral_text', {
    p_title: cleanTitle,
    p_work: cleanWork,
  })
  if (error) {
    console.error('[reviser] texte oral non ajouté:', error.message)
    return { ok: false, texts: [] }
  }
  revalidatePath('/reviser')
  return { ok: true, texts: normalizeOralList(data) }
}

// Change le statut d'un texte (À faire ↔ En cours ↔ Maîtrisé).
export async function setOralTextStatusAction(
  id: string,
  status: OralTextStatus,
): Promise<OralResult> {
  const supabase = await createClient()
  if (!(await requireUserId())) return { ok: false, texts: [] }
  if (typeof id !== 'string' || id.length === 0 || !isOralStatus(status))
    return { ok: false, texts: [] }

  const { data, error } = await supabase.rpc('set_oral_text_status', {
    p_id: id,
    p_status: status,
  })
  if (error) {
    console.error('[reviser] statut texte oral non changé:', error.message)
    return { ok: false, texts: [] }
  }
  revalidatePath('/reviser')
  return { ok: true, texts: normalizeOralList(data) }
}

// Retire un texte du descriptif.
export async function removeOralTextAction(id: string): Promise<OralResult> {
  const supabase = await createClient()
  if (!(await requireUserId())) return { ok: false, texts: [] }
  if (typeof id !== 'string' || id.length === 0)
    return { ok: false, texts: [] }

  const { data, error } = await supabase.rpc('remove_oral_text', { p_id: id })
  if (error) {
    console.error('[reviser] texte oral non retiré:', error.message)
    return { ok: false, texts: [] }
  }
  revalidatePath('/reviser')
  return { ok: true, texts: normalizeOralList(data) }
}
