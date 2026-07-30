'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
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
export async function recordTestSession(
  quizId: string,
  score: number,
  total: number,
): Promise<{ saved: boolean; apparition: TraqueApparition | null }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { saved: false, apparition: null }

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
      awardQuizProgression(supabase, cleanScore, cleanTotal, quizId),
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

  return { saved: !error, apparition }
}
