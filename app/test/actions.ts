'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { weekProgress } from '@/lib/streak'
import type { JourSerie } from '@/lib/serie-celebration'
import { validateRevisionToday, validateCommuteToday } from '@/lib/habits'
import { awardQuizProgression } from '@/lib/wallet-server'
import { creditTraque, quizContext } from '@/lib/traque-server'
import { apparitionOf, type TraqueApparition } from '@/lib/traque'

// Enregistre une session de test terminée (alimente la heatmap Habitude).
// Visiteur non connecté : on n'enregistre rien, sans erreur.
//
// Renvoie aussi l'APPARITION quand ce quiz vient de faire déborder la jauge
// d'un gardien : l'écran de fin ouvre alors le rideau. Le signal ne peut pas
// remonter autrement — un boss débusqué qu'on n'apprend qu'en repassant sur
// l'arène, c'est tout le travail fourni récompensé par un bandeau de 44 px.
/**
 * L'état de la série AVANT l'écriture de la session : la semaine telle qu'elle
 * est encore, et le compte de jours.
 *
 * Lu AVANT l'insertion, et c'est tout le point : après, la case du jour est
 * déjà cochée et l'écran de célébration n'aurait plus rien à remplir. C'est la
 * seule information que le serveur ne peut pas reconstituer plus tard.
 *
 * Les quatre sources sont celles de `current_streak` (migration 170) et de
 * l'accueil Réviser — bornées à la semaine en cours, donc quatre lectures
 * courtes. Un échec quelconque rend `null` : on se prive de la fête, jamais de
 * la session.
 */
async function serieAvantSession(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<{ semaine: JourSerie[]; serie: number } | null> {
  try {
    const now = new Date()
    // Lundi de la semaine en cours (lundi = 0, convention du projet).
    const lundi = new Date(now)
    lundi.setUTCDate(lundi.getUTCDate() - ((now.getUTCDay() + 6) % 7))
    lundi.setUTCHours(0, 0, 0, 0)
    const depuis = lundi.toISOString()

    const jours = async (table: string, colonne = 'created_at') => {
      const { data } = await supabase
        .from(table)
        .select(colonne)
        .eq('user_id', userId)
        .gte(colonne, depuis)
        .limit(400)
      // Le type de `data` dépend de la colonne demandée, inconnue à la
      // compilation : on passe par `unknown` plutôt que d'affirmer une forme.
      return (data ?? []).map((r) =>
        String((r as unknown as Record<string, unknown>)[colonne] ?? '').slice(
          0,
          10,
        ),
      )
    }

    const [t, s, l, c] = await Promise.all([
      jours('test_sessions'),
      jours('study_sessions'),
      jours('lesson_completions'),
      jours('challenge_sessions'),
    ])
    const actifs = new Set([...t, ...s, ...l, ...c].filter((d) => d.length === 10))

    // La SÉRIE, elle, se lit sur toute son étendue — pas seulement la semaine :
    // une série de 40 jours ne tient pas dans sept cases.
    const { data: serieRpc } = await supabase.rpc('my_streak')
    const serie = Number(serieRpc)

    return {
      semaine: weekProgress(actifs, now),
      serie: Number.isFinite(serie) ? Math.max(0, serie) : 0,
    }
  } catch {
    // Une fête ratée n'est pas une panne : la session, elle, est enregistrée.
    return null
  }
}

export async function recordTestSession(
  quizId: string,
  score: number,
  total: number,
): Promise<{
  saved: boolean
  apparition: TraqueApparition | null
  /** L'état de la série JUSTE AVANT cette session (null si illisible). */
  serieAvant: { semaine: JourSerie[]; serie: number } | null
}> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { saved: false, apparition: null, serieAvant: null }

  // AVANT l'écriture : c'est la seule fenêtre où la case du jour est encore
  // vide, donc la seule où l'on peut savoir quoi animer.
  const serieAvant = await serieAvantSession(supabase, user.id)

  // Bornes serveur (le score alimente l'XP et les badges) : total 0..50,
  // score 0..total. Toute valeur aberrante est ramenée dans la plage.
  const clean = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0
  const cleanTotal = clean(total, 50)
  const cleanScore = clean(score, cleanTotal)

  const { error } = await supabase.from('test_sessions').insert({
    user_id: user.id,
    quiz_id: quizId,
    score: cleanScore,
    total: cleanTotal,
  })

  // Coche « Révision quotidienne » (et « Test sur trajets » si on est en
  // créneau) du jour tout de suite si le seuil est atteint, puis verse
  // l'XP du portefeuille (+ la gemme des 3 couronnes si le chapitre vient
  // d'être complété — vérifié en SQL). En parallèle, si ce quiz porte sur un
  // chapitre d'un contrôle à venir, coche la session de préparation du jour
  // (plan de préparation, migration 203) — réviser fait avancer le plan sans
  // détour. Échec silencieux si 203 n'est pas passée (RPC absente).
  let apparition: TraqueApparition | null = null
  if (!error) {
    // La Traque (212) : un quiz de chapitre terminé remplit la jauge du
    // gardien de la matière, et son chapitre entre dans le pool du combat.
    // Nommée à part (mais lancée dans le même souffle que le reste) parce que
    // son résultat, lui, est attendu : c'est lui qui dit si le rideau s'ouvre.
    const traqueCredit = quizContext(supabase, quizId).then((ctx) =>
      creditTraque(supabase, {
        subject: ctx.subject,
        event: { quiz_chapitre: 1, bonne_reponse: cleanScore },
        chapterIds: ctx.chapterId ? [ctx.chapterId] : [],
      }),
    )
    await Promise.all([
      validateRevisionToday(supabase, user.id),
      validateCommuteToday(supabase, user.id),
      awardQuizProgression(supabase, quizId),
      supabase
        .rpc('complete_prep_session_for_quiz', { p_quiz: quizId })
        .then(({ error: prepError }) => {
          if (prepError && prepError.code !== 'PGRST202') {
            console.error('[test] session de prépa non cochée:', prepError.message)
          }
        }),
      traqueCredit,
    ])
    const credit = await traqueCredit
    apparition = apparitionOf(credit ? [credit] : [], Date.now())
    revalidatePath('/moi')
    revalidatePath('/reviser')
    // L'arène doit montrer la jauge qui vient de monter (et le boss qui sort).
    revalidatePath('/defi')
  }

  return { saved: !error, apparition, serieAvant }
}
