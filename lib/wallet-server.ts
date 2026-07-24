import type { SupabaseClient } from '@supabase/supabase-js'
import { quizXpSource, walletLevelInfo, type XpSource } from '@/lib/wallet'
import { levelFor, type LevelInfo } from '@/lib/xp'

// Accès serveur au portefeuille de progression (migration 192).
//
// Les règles (barème, formule de niveau, montants de gemmes) vivent dans
// `lib/wallet.ts`, pur et testé ; les montants réellement versés sont fixés
// dans les fonctions SQL SECURITY DEFINER — ce module ne fait qu'appeler les
// RPC depuis les Server Actions. Il TOLÈRE une base où la migration 192 n'est
// pas encore passée : l'attribution échoue en silence journalisé, jamais en
// cassant l'enregistrement de la session qui l'a déclenchée.

export type WalletAward = {
  awarded: number
  xp: number
  level: number
  level_up: boolean
  streak_days: number
  gems_gained: number
}

/** Ligne du portefeuille telle que lue en base (null si 192 pas passée). */
export type WalletRow = {
  xp: number
  level: number
  streak_days: number
  last_activity_date: string | null
}

/** Lit le portefeuille de l'élève. Null si la migration 192 n'est pas passée
 *  OU si l'élève n'a encore rien gagné (le portefeuille s'ouvre au premier
 *  versement) — l'appelant retombe alors sur l'XP dérivée (lib/xp.computeXp). */
export async function fetchWallet(
  supabase: SupabaseClient,
  userId: string,
): Promise<WalletRow | null> {
  const { data, error } = await supabase
    .from('user_wallet')
    .select('xp, level, streak_days, last_activity_date')
    .eq('user_id', userId)
    .maybeSingle<WalletRow>()
  if (error) return null
  return data
}

/**
 * Le niveau/XP à AFFICHER pour l'élève, source unique de vérité.
 *
 * Dès que le portefeuille existe (migration 192), c'est LUI qui fait foi —
 * exactement comme le bandeau du haut (TopHudLoader). Sinon on retombe sur le
 * niveau dérivé de l'activité récente (`fallbackXp`, via lib/xp.levelFor),
 * strictement comme l'ancien calcul, pour que le repli reste identique partout.
 *
 * Centralisé ici pour que TOUS les écrans (bandeau, arène Défi, Réviser)
 * affichent le MÊME niveau : fini le « Niveau 4 » en haut vs « Niv. 1 » sur
 * l'écran de duel, qui venaient de deux calculs concurrents.
 */
export async function fetchDisplayLevel(
  supabase: SupabaseClient,
  userId: string,
  fallbackXp: number,
): Promise<LevelInfo> {
  const wallet = await fetchWallet(supabase, userId)
  if (wallet && wallet.xp != null) {
    return walletLevelInfo(Math.max(0, Number(wallet.xp) || 0))
  }
  return levelFor(fallbackXp)
}

/** Verse l'XP d'une activité. Renvoie l'état après coup, null sur échec. */
export async function awardXp(
  supabase: SupabaseClient,
  source: XpSource,
  key?: string,
  amount?: number,
): Promise<WalletAward | null> {
  const { data, error } = await supabase.rpc('wallet_award_xp', {
    p_source: source,
    p_key: key ?? null,
    p_amount: amount ?? null,
  })
  if (error) {
    // Migration 192 absente ou panne : la session reste enregistrée, seul le
    // versement saute — on le voit dans les logs au lieu de le deviner.
    console.error('[wallet] XP non versée:', error.message)
    return null
  }
  return (data as WalletAward | null) ?? null
}

/** Tente un versement de gemmes de jeu. Renvoie les gemmes versées (0 sinon). */
export async function awardGems(
  supabase: SupabaseClient,
  source: 'chapter_crowns' | 'defi_win',
  key: string,
): Promise<number> {
  const { data, error } = await supabase.rpc('wallet_award_gems', {
    p_source: source,
    p_key: key,
  })
  if (error) {
    console.error('[wallet] gemmes non versées:', error.message)
    return 0
  }
  return Number(data ?? 0)
}

/**
 * Progression complète d'un quiz terminé : XP (forfait, bonus à 8/10) puis
 * gemme des 3 couronnes si ce quiz vient de compléter son chapitre (le seuil
 * est re-vérifié en SQL — quizId absent pour les sessions sans quiz :
 * « À revoir », examen blanc).
 */
export async function awardQuizProgression(
  supabase: SupabaseClient,
  score: number,
  total: number,
  quizId?: string,
): Promise<WalletAward | null> {
  const award = await awardXp(supabase, quizXpSource(score, total))
  if (quizId) await awardGems(supabase, 'chapter_crowns', quizId)
  return award
}
