import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { computeXp, levelFor } from '@/lib/xp'
import { activityCutoff } from '@/lib/streak'
import { isHudHidden } from '@/lib/top-hud-routes'
import TopHud from './TopHud'

/**
 * Chargeur serveur du bandeau du haut : lit le solde de pièces et calcule le
 * niveau (XP dérivée de l'activité récente, comme /defi et /reviser), puis rend
 * le TopHud client. Rendu SOUS un <Suspense> dans le layout : il diffuse en
 * flux et ne bloque jamais le rendu de la page (perf de navigation préservée).
 * Chaque `select` de colonne « tardive » est isolé pour tolérer une migration
 * pas encore passée (discipline colonnes tardives du projet).
 */
export default async function TopHudLoader() {
  // Parcours plein écran : on sort AVANT toute requête (le `x-pathname` est
  // posé par proxy.ts). TopHud garde sa propre garde côté client, indispensable
  // en navigation client où ce layout n'est pas re-rendu.
  const pathname = (await headers()).get('x-pathname') ?? ''
  if (isHudHidden(pathname)) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <TopHud coins={null} level={null} levelTitle={null} progress={0} userLabel={null} />
  }

  const cutoff = activityCutoff()
  const [
    { data: coinsRow },
    { data: tests },
    { data: studies },
    { data: lessons },
    { data: challenges },
  ] = await Promise.all([
    supabase.from('profiles').select('coins').eq('id', user.id).maybeSingle(),
    supabase
      .from('test_sessions')
      .select('score')
      .eq('user_id', user.id)
      .gte('created_at', cutoff),
    supabase
      .from('study_sessions')
      .select('cards_count')
      .eq('user_id', user.id)
      .gte('created_at', cutoff),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', cutoff),
    supabase
      .from('challenge_sessions')
      .select('xp')
      .eq('user_id', user.id)
      .gte('created_at', cutoff),
  ])

  const coins = Math.max(0, Number(coinsRow?.coins) || 0)
  const xp = computeXp({
    quizzes: (tests ?? []).map((t) => ({ score: Number(t.score ?? 0) })),
    decks: (studies ?? []).map((s) => ({ cards_count: Number(s.cards_count ?? 0) })),
    lessonsCount: (lessons ?? []).length,
    challengesXp: (challenges ?? []).reduce((s, c) => s + Number(c.xp ?? 0), 0),
  })
  const level = levelFor(xp)
  const userLabel = user.user_metadata?.full_name || user.email || null

  return (
    <TopHud
      coins={coins}
      level={level.level}
      levelTitle={level.title}
      progress={level.progress}
      userLabel={userLabel}
    />
  )
}
