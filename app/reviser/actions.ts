'use server'

import { refresh, revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { validateRevisionToday, validateCommuteToday } from '@/lib/habits'
import { normaliserPrioritaires } from '@/lib/matieres-prioritaires'
import type { EtatBilan } from '@/lib/quiz-bilan'
import {
  sanitizeReviewAnswers,
  REVANCHE_CLEAR_COINS,
  type ReviewAnswer,
} from '@/lib/srs'
import { enregistrerReponsesRevision } from '@/lib/srs-server'
import type { Gain } from '@/lib/gains'
import {
  awardChapterCrowns,
  gainsVerses,
  awardQuizProgression,
  awardXp,
} from '@/lib/wallet-server'
import {
  creditTraque,
  creditTraqueFromAnswers,
  lessonContext,
} from '@/lib/traque-server'
import { apparitionOf, type TraqueApparition } from '@/lib/traque'

// Marque une leçon comme terminée : le chapitre progresse (plancher 30 %)
// et la journée est validée dans la série.
export async function completeLesson(
  lessonId: string,
): Promise<{ saved: boolean; gains: Gain[] }> {
  const user = await getCurrentUser()
  if (!user) return { saved: false, gains: [] }
  // Même garde que markLessonActivity : un id non-UUID ferait échouer le cast
  // Postgres (saved:false silencieux) — on refuse tôt et proprement.
  if (!UUID_RE.test(String(lessonId))) return { saved: false, gains: [] }

  const supabase = await createClient()
  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
    )

  // Coche « Révision quotidienne » du jour tout de suite si le seuil est atteint.
  // Et nourrit La Traque (212) : une leçon terminée vaut 15 points sur la jauge
  // du gardien de sa matière — le boss sort en révisant, jamais autrement.
  let gains: Gain[] = []
  if (!error) {
    const [, award, [, couronnes]] = await Promise.all([
      validateRevisionToday(supabase, user.id),
      // LES DEUX SEULES SOURCES D'XP DE CE GESTE. La leçon elle-même vaut 5,
      // une fois pour toutes (clé = la leçon) ; et comme une leçon terminée
      // pose le plancher de 0,30 sur son chapitre, elle peut allumer la
      // PREMIÈRE couronne — que le serveur recalcule seul.
      awardXp(supabase, 'lecon', lessonId),
      lessonContext(supabase, lessonId).then((ctx) =>
        Promise.all([
          creditTraque(supabase, {
            subject: ctx.subject,
            event: { lecon: 1 },
            chapterIds: ctx.chapterId ? [ctx.chapterId] : [],
          }),
          ctx.chapterId
            ? awardChapterCrowns(supabase, ctx.chapterId)
            : Promise.resolve(0),
        ]),
      ),
    ])
    // Relire la MÊME leçon ne rend rien : les deux versements portent une clé
    // (la leçon, puis « chapitre:palier »). Le pied de cours n'annonce alors
    // rien du tout, ce qui est exact.
    gains = gainsVerses(award, { xp: couronnes })
  }

  revalidatePath('/reviser')
  revalidatePath('/moi')
  revalidatePath('/defi')
  return { saved: !error, gains }
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
  const user = await getCurrentUser()
  if (!user) return { saved: false }

  const { error } = await supabase
    .from('lesson_activities')
    .upsert(
      { user_id: user.id, lesson_id: lessonId, activity },
      { onConflict: 'user_id,lesson_id,activity', ignoreDuplicates: true },
    )

  // PAS de revalidation : cette action part toute seule à l'ouverture d'une
  // fiche (MarkLessonActivity). Revalider vidait le cache de TOUS les onglets
  // préchargés à chaque fiche ouverte (Next 16) ; l'anneau d'avancement se
  // mettra à jour au prochain rendu de la page matière.
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
  /**
   * Les identifiants du QUIZ ENTIER, quand l'appelant veut le bilan en retour.
   * Sans eux, la fonction se comporte exactement comme avant : elle enregistre
   * et ne rend que `saved`.
   */
  scopeIds?: readonly string[],
): Promise<{ saved: boolean; etats?: EtatBilan[] }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { saved: false }

  // L'écriture vit dans lib/srs-server (partagée avec la fin de course, qui ne
  // revalide pas) ; cette action, elle, rafraîchit Réviser.
  const aEcrire = sanitizeReviewAnswers(answers).length > 0
  const saved = await enregistrerReponsesRevision(supabase, user.id, answers)
  if (!saved) return { saved: false }
  if (!aEcrire) {
    return {
      saved: true,
      etats: await lireEtatsBilan(supabase, user.id, scopeIds),
    }
  }

  revalidatePath('/reviser')
  // Le bilan est relu APRÈS l'écriture : c'est le seul moment où l'état reflète
  // la session qui vient de se terminer. Le relire avant afficherait à l'élève
  // l'avancement d'hier.
  return {
    saved: true,
    etats: await lireEtatsBilan(supabase, user.id, scopeIds),
  }
}

/**
 * Les états des questions d'un quiz, réduits à ce dont le bilan de fin a besoin
 * (`lib/quiz-bilan`). Rend `undefined` si l'appelant n'a pas demandé de bilan —
 * et un tableau VIDE plutôt qu'une erreur si la lecture échoue : un bilan
 * manquant se traduit par « 0 % », jamais par un écran de fin cassé.
 */
async function lireEtatsBilan(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  scopeIds: readonly string[] | undefined,
): Promise<EtatBilan[] | undefined> {
  if (!scopeIds || scopeIds.length === 0) return undefined
  const { data, error } = await supabase
    .from('review_items')
    .select('box, times_seen')
    .eq('user_id', userId)
    .in('item_id', [...scopeIds].slice(0, 500))
  if (error) {
    console.error('[srs] bilan de fin illisible:', error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    box: Number(r.box ?? 1),
    timesSeen: Number(r.times_seen ?? 0),
  }))
}

// Fin d'une session « À revoir » (/reviser/revoir) : enregistre les réponses,
// crédite l'XP (session de révision = test_sessions sans quiz), et si la
// Revanche vient d'être vidée, verse le bonus en pièces (une fois par jour,
// vérifié en SQL). Renvoie ce qui s'est réellement passé pour l'écran de fin.
export async function finishReviewSession(answers: ReviewAnswer[]): Promise<{
  saved: boolean
  revancheCleared: boolean
  coins: number
  apparition: TraqueApparition | null
}> {
  const vide = {
    saved: false,
    revancheCleared: false,
    coins: 0,
    apparition: null,
  }
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return vide

  const { saved } = await recordReviewAnswers(answers)
  if (!saved) return vide

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
  let apparition: TraqueApparition | null = null
  if (!error) {
    // La Traque (212) : chaque carte révisée remplit la jauge du gardien de
    // SA matière — une carte de Maths ne fait pas sortir le boss de Français.
    // Son résultat est attendu : c'est lui qui dit si un gardien vient de
    // sortir, donc si l'écran de fin ouvre le rideau.
    const traqueCredits = creditTraqueFromAnswers(supabase, clean, 'carte')
    await Promise.all([
      validateRevisionToday(supabase, user.id),
      validateCommuteToday(supabase, user.id),
      // Une session « À revoir » paye comme un quiz (portefeuille 192).
      awardQuizProgression(supabase),
      traqueCredits,
    ])
    apparition = apparitionOf(await traqueCredits, Date.now())
  }

  // Bonus Revanche : la fonction SQL revérifie que la Revanche est vide et
  // qu'aucun bonus n'a été versé aujourd'hui.
  const { data: cleared } = await supabase.rpc('claim_revanche_bonus', {
    p_coins: REVANCHE_CLEAR_COINS,
  })

  revalidatePath('/reviser')
  revalidatePath('/moi')
  revalidatePath('/coffre')
  // L'arène doit montrer la jauge qui vient de monter (et le boss qui sort).
  revalidatePath('/defi')
  return {
    saved: !error,
    revancheCleared: cleared === true,
    coins: cleared === true ? REVANCHE_CLEAR_COINS : 0,
    apparition,
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
  const user = await getCurrentUser()
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
            typeof row.chapterId === 'string'
              ? row.chapterId.slice(0, 40)
              : null,
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
    await Promise.all([
      validateRevisionToday(supabase, user.id),
      validateCommuteToday(supabase, user.id),
      // L'examen blanc paye comme un gros quiz (portefeuille 192).
      awardQuizProgression(supabase),
    ])
  }

  revalidatePath('/reviser')
  revalidatePath('/moi')
  return { saved: !examError && !xpError }
}

// Persiste la sélection de matières de l'élève (bouton « Éditer »).
// Lève sur échec : l'UI (SubjectsHome) enveloppe l'appel dans un try/catch et
// affiche un toast d'erreur — sans remontée, une sélection perdue passerait
// pour un succès silencieux.
export async function saveSelectedSubjects(slugs: string[]): Promise<void> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('non authentifié')

  const clean = Array.from(
    new Set(slugs.filter((s) => typeof s === 'string' && s.length < 64)),
  )

  const { error } = await supabase
    .from('profiles')
    .update({ selected_subjects: clean })
    .eq('id', user.id)
  if (error) {
    console.error(
      '[reviser] sélection de matières non enregistrée:',
      error.message,
    )
    throw new Error(error.message)
  }

  // `refresh()` et non `revalidatePath` : le réglage ne change que l'écran
  // courant (la grille de Réviser), et `refresh()` garde les autres onglets
  // préchargés là où `revalidatePath` les jette tous.
  refresh()
}

// Persiste les MATIÈRES PRIORITAIRES de l'élève (l'étoile sur chaque dossier
// de matière de Réviser, colonne `profiles.matieres_prioritaires`, migration
// 359). Même contrat que `saveSelectedSubjects` : lève sur échec, l'UI affiche
// un toast et remet l'étoile comme elle était. Tant que la 359 n'est pas
// passée, Postgres refuse la colonne (42703) : le toast le dit, la grille
// garde son ordre, rien ne casse.
export async function saveMatieresPrioritaires(slugs: string[]): Promise<void> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('non authentifié')

  const clean = normaliserPrioritaires(slugs)

  const { error } = await supabase
    .from('profiles')
    .update({ matieres_prioritaires: clean })
    .eq('id', user.id)
  if (error) {
    console.error(
      '[reviser] matières prioritaires non enregistrées:',
      error.message,
    )
    throw new Error(error.message)
  }

  // Écran courant seulement : les onglets préchargés restent (cf. plus haut).
  refresh()
}

// Marque le tour guidé comme vu (colonne tutorial_completed, migration 188) :
// il ne se relancera plus automatiquement. Échec silencieux si la migration
// n'est pas passée — le tour se représentera, sans rien casser.
export async function completeTutorial(): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { saved: false }

  const { error } = await supabase
    .from('profiles')
    .update({ tutorial_completed: true })
    .eq('id', user.id)
  if (error) {
    console.error('[reviser] tour guidé non enregistré:', error.message)
    return { saved: false }
  }
  // L'écran courant seulement : le tour ne concerne que Réviser, et `refresh()`
  // garde les autres onglets préchargés.
  refresh()
  return { saved: true }
}
