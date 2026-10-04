import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActiviteXp, Epreuve } from '@/lib/economie'
import type { Gain } from '@/lib/gains'
import { walletLevelInfo, type XpSource } from '@/lib/wallet'
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

/**
 * Verse l'XP d'une ACQUISITION. Renvoie l'état après coup, null sur échec.
 *
 * ⚠️ LA CLÉ EST OBLIGATOIRE, et c'est tout le système : l'index
 * `xp_events_once_per_key` (migration 192) fait qu'une même acquisition ne se
 * paye qu'une fois, à jamais. Une leçon relue, un chapitre re-maîtrisé, une
 * carte qui repasse le seuil : zéro. C'est ce qui distingue l'XP — qui mesure
 * l'acquis — des trophées, couronnes et écus, qui mesurent le geste.
 */
export async function awardXp(
  supabase: SupabaseClient,
  source: XpSource,
  key: string,
): Promise<WalletAward | null> {
  const { data, error } = await supabase.rpc('wallet_award_xp', {
    p_source: source,
    p_key: key,
    p_amount: null,
  })
  if (error) {
    // Migration absente ou panne : la session reste enregistrée, seul le
    // versement saute — on le voit dans les logs au lieu de le deviner.
    console.error('[wallet] XP non versée:', error.message)
    return null
  }
  return (data as WalletAward | null) ?? null
}

/**
 * Marque une ACTIVITÉ sans verser d'XP de barème : la série stockée avance, et
 * le palier de 7 jours paie ses 50 XP (557 — ses 20 gemmes d'avant).
 *
 * ⚠️ CETTE FONCTION EXISTE PARCE QUE LA SÉRIE ÉTAIT ACCROCHÉE À L'XP. Avant,
 * `wallet_award_xp` faisait les deux : verser l'XP ET faire avancer la série.
 * Le jour où l'XP a cessé de payer le jeu (quiz rejoué, duel, arène), la série
 * serait morte avec — un élève qui ne fait que jouer n'aurait plus jamais
 * touché sa gemme des 7 jours. La série n'est pas de l'XP : c'est un compteur
 * d'assiduité, et il se nourrit de TOUTE activité.
 */
export async function walletTouch(
  supabase: SupabaseClient,
): Promise<WalletAward | null> {
  const { data, error } = await supabase.rpc('wallet_touch')
  if (error) {
    console.error('[wallet] activité non enregistrée:', error.message)
    return null
  }
  return (data as WalletAward | null) ?? null
}

/**
 * L'XP D'UNE ACTIVITÉ FINIE (migration 557, barème `lib/economie`) : quiz,
 * révision, capsule, fiche d'encyclopédie, flashcards, jeu, mode de l'arène,
 * défi du jour, duel, première partie. Le SERVEUR fixe le montant (barème et
 * plafond du jour) et fait avancer la série ; on ne lui envoie que le score.
 *
 * `cle` rend la partie unique : la même clé ne paie qu'une fois. Choisir une
 * clé qui dit l'acquisition — « quiz:<id>:<jour> » paie un quiz une fois par
 * jour, un identifiant de session paie chaque partie (dans le plafond).
 *
 * Tolère une base sans la 557 : rien n'est versé, rien ne casse.
 */
export async function xpActivite(
  supabase: SupabaseClient,
  activite: ActiviteXp,
  cle: string,
  points = 0,
  total = 0,
): Promise<WalletAward | null> {
  const { data, error } = await supabase.rpc('xp_activite', {
    p_source: activite,
    p_cle: cle.slice(0, 70),
    p_points: Math.max(0, Math.floor(points) || 0),
    p_total: Math.max(0, Math.floor(total) || 0),
  })
  if (error) {
    console.error(`[wallet] XP de ${activite} non versée:`, error.message)
    return null
  }
  return (data as WalletAward | null) ?? null
}

/** Ce que rend une épreuve récompensée (et, pour l'annale, pourquoi pas encore). */
export type EpreuveAward = WalletAward & { raison?: 'pas_commencee' | 'trop_tot'; minutes?: number }

/**
 * L'XP ET LES GEMMES D'UNE ÉPREUVE (557) — dictée, contrôle blanc, examen
 * blanc, annale. Le serveur relit la note EN BASE (la tentative, la copie, la
 * session) : on ne lui envoie que l'identifiant. Les gemmes ne tombent qu'au-
 * dessus du seuil de `lib/economie.gemmesEpreuve`, dans un plafond par semaine.
 */
export async function recompenserEpreuve(
  supabase: SupabaseClient,
  epreuve: Epreuve,
  id: string,
): Promise<EpreuveAward | null> {
  const { data, error } = await supabase.rpc('epreuve_recompenser', { p_type: epreuve, p_id: id })
  if (error) {
    console.error(`[wallet] épreuve ${epreuve} non récompensée:`, error.message)
    return null
  }
  return (data as EpreuveAward | null) ?? null
}

/**
 * Verse l'XP des paliers de couronne franchis sur un chapitre. Renvoie l'XP
 * réellement versée (0 si aucun palier neuf).
 *
 * ⚠️ ON N'ENVOIE QUE L'ID DU CHAPITRE. La valeur (meilleur quiz, plancher 0,30
 * si une leçon est terminée) est RECALCULÉE EN SQL : un client ne peut pas
 * s'attribuer une couronne qu'il n'a pas. Chaque palier porte sa clé
 * « chapitre:palier », donc se paye une fois pour toutes — un chapitre qui
 * retombe puis remonte ne repaye rien.
 */
export async function awardChapterCrowns(
  supabase: SupabaseClient,
  chapterId: string,
): Promise<number> {
  const { data, error } = await supabase.rpc('wallet_award_chapter_crowns', {
    p_chapter: chapterId,
  })
  if (error) {
    console.error('[wallet] couronnes non versées:', error.message)
    return 0
  }
  return Number(data ?? 0)
}

/**
 * CE QUI A RÉELLEMENT ÉTÉ VERSÉ, mis en forme pour l'écran de fin.
 *
 * ⚠️ « RÉELLEMENT » EST LE MOT. Tous les montants viennent des RPC, jamais du
 * barème : une acquisition déjà payée rend 0, un plafond quotidien rend 0, une
 * migration absente rend 0. L'écran de fin ne peut donc pas annoncer un gain
 * que le solde ne montrerait pas — un « +30 XP » suivi d'un compteur immobile
 * serait pire que le silence, il ferait douter du compteur.
 */
export function gainsVerses(
  award: WalletAward | null,
  extra: { xp?: number; gemmes?: number; couronnes?: number } = {},
): Gain[] {
  const gains: Gain[] = [
    { unite: 'xp', montant: (award?.awarded ?? 0) + (extra.xp ?? 0) },
    // Les gemmes ne sortent plus que d'une ÉPREUVE réussie (557) : dictée,
    // contrôle blanc, examen blanc, annale — `gems_gained` les porte.
    { unite: 'gemme', montant: (award?.gems_gained ?? 0) + (extra.gemmes ?? 0) },
    { unite: 'couronne', montant: extra.couronnes ?? 0 },
  ]
  // Les montants nuls sont écartés à l'affichage (cf. lib/gains.agregerGains) :
  // on les laisse passer ici pour que l'appelant n'ait rien à filtrer.
  return gains
}

/** La clé du jour UTC (« 2026-10-04 ») : un quiz se paie une fois par jour. */
export function jourUtc(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

/**
 * Progression d'un quiz terminé (557) : l'XP du quiz lui-même — 10 + 2 par
 * bonne réponse, +10 si tout est juste, une fois par quiz et par jour, dans le
 * plafond du jour — PLUS l'XP des couronnes qu'il allume (30 · 40 · 60, une
 * fois pour toutes, seuil recalculé en SQL). Plus de gemme : le chapitre à
 * trois couronnes paie en XP.
 *
 * Renvoie les gains à faire voler vers le bandeau, en plus de l'état du
 * portefeuille.
 */
export async function awardQuizProgression(
  supabase: SupabaseClient,
  quizId: string,
  score: number,
  total: number,
): Promise<{ award: WalletAward | null; gains: Gain[] }> {
  const [award, couronnes] = await Promise.all([
    xpActivite(supabase, 'quiz', `${quizId}:${jourUtc()}`, score, total),
    supabase
      .rpc('wallet_award_crowns_by_quiz', { p_quiz: quizId })
      .then(({ data, error }) => {
        if (error) {
          console.error('[wallet] couronnes du quiz non versées:', error.message)
          return 0
        }
        return Number(data ?? 0)
      }),
  ])

  return { award, gains: gainsVerses(award, { xp: couronnes }) }
}
