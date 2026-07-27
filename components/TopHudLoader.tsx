import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { computeXp, levelFor } from '@/lib/xp'
import { walletLevelInfo } from '@/lib/wallet'
import { activityCutoff } from '@/lib/streak'
import { isHudHidden } from '@/lib/top-hud-routes'
import TopHud from './TopHud'

type WalletRow = { xp: number | null; level: number | null }

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

  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])

  if (!user) {
    return <TopHud coins={null} level={null} levelTitle={null} progress={0} userLabel={null} />
  }

  // Solde + niveau du PORTEFEUILLE (user_wallet, migration 192) : c'est LA
  // source de vérité de l'XP/niveau depuis la 192, la même que la carte et la
  // modale de profil (RPC profile_stats). On la lit ici pour que le « Niveau »
  // du bandeau et le niveau du profil affichent TOUJOURS le même nombre — fini
  // le « Niveau 4 » en haut vs « Niv. 1 » sur la carte, qui venaient de deux
  // calculs concurrents (fenêtre d'activité récente ici, XP cumulée là-bas).
  //
  // Les deux lectures tiennent en UNE requête : `user_wallet` est joint au
  // profil par PostgREST (relation `user_id`), au lieu de deux allers-retours
  // pour deux lignes qui parlent du même élève.
  const { data: hudRow } = await supabase
    .from('profiles')
    .select('coins, user_wallet(xp, level)')
    .eq('id', user.id)
    .maybeSingle<{
      coins: number | null
      // PostgREST renvoie un objet quand il détecte une relation 1-1, un
      // tableau sinon : on accepte les deux formes.
      user_wallet: WalletRow | WalletRow[] | null
    }>()

  const walletRow = Array.isArray(hudRow?.user_wallet)
    ? (hudRow.user_wallet[0] ?? null)
    : (hudRow?.user_wallet ?? null)
  const coins = Math.max(0, Number(hudRow?.coins) || 0)
  const userLabel = user.user_metadata?.full_name || user.email || null

  // Portefeuille présent (cas normal d'un compte actif) → niveau du portefeuille.
  if (walletRow && walletRow.xp != null) {
    const info = walletLevelInfo(Math.max(0, Number(walletRow.xp) || 0))
    return (
      <TopHud
        coins={coins}
        level={info.level}
        levelTitle={info.title}
        progress={info.progress}
        userLabel={userLabel}
      />
    )
  }

  // Repli : le portefeuille n'existe pas encore (migration pas passée, ou compte
  // sans activité) → ancien calcul dérivé de l'activité récente, comme avant.
  // La RPC profile_stats crée le portefeuille au premier passage sur le profil,
  // donc ce repli reste marginal.
  const cutoff = activityCutoff()
  const [
    { data: tests },
    { data: studies },
    { data: lessons },
    { data: challenges },
  ] = await Promise.all([
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

  const xp = computeXp({
    quizzes: (tests ?? []).map((t) => ({ score: Number(t.score ?? 0) })),
    decks: (studies ?? []).map((s) => ({ cards_count: Number(s.cards_count ?? 0) })),
    lessonsCount: (lessons ?? []).length,
    challengesXp: (challenges ?? []).reduce((s, c) => s + Number(c.xp ?? 0), 0),
  })
  const level = levelFor(xp)

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
