import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { AUCUN_GEL, parseGelsSerie, type GelsSerie } from '@/lib/streak'
import { AUCUN_BOOST, finBoostXp, normaliserBoosts, type BoostsActifs } from './offres'
import { normaliserObjetsProfil, type ObjetProfil } from './objets-profil'
import { lireObjetsBoutique } from '@/lib/vitrines-server'

// Lectures de la boutique en gemmes (migration 368).
//
// TOUTES TOLÉRANTES, comme toute lecture « tardive » du projet : le code est
// déployé AVANT que Lucas n'exécute la 368 à la main. Colonne ou table absente
// → la valeur neutre (aucun boost, aucun gel, aucun objet), sans bruit dans les
// logs ; toute AUTRE erreur est journalisée, et rend la même valeur neutre —
// une vitrine sans boost vaut mieux qu'un Trésor qui plante.

function signaler(contexte: string, error: { code?: string | null; message: string }): void {
  if (!isMissingSchemaObject(error)) {
    console.error(`[boutique] ${contexte} :`, error.message)
  }
}

/**
 * Les boosts du Marché que l'élève a en cours (boost XP, boost trophées).
 *
 * `select('*')` et non la liste des deux colonnes : la colonne du boost
 * trophées n'existe qu'après la migration 370, et la nommer ferait échouer
 * TOUTE la lecture avant son exécution — le boost XP (368) disparaîtrait de la
 * vitrine alors qu'il court. La ligne est petite, et c'est celle de l'élève.
 */
export async function lireBoosts(
  supabase: SupabaseClient,
  userId: string,
): Promise<BoostsActifs> {
  const [{ data, error }, acheteLe] = await Promise.all([
    supabase.from('user_wallet').select('*').eq('user_id', userId).maybeSingle(),
    lireDernierBoostXp(supabase, userId),
  ])
  if (error) {
    signaler('boosts illisibles', error)
    return AUCUN_BOOST
  }
  // Pas de ligne = portefeuille jamais ouvert : aucun boost, c'est exact.
  return normaliserBoosts(data, acheteLe)
}

/**
 * L'instant du dernier Boost XP acheté (journal `boutique_achats`, 368) : un
 * par jour, la carte du Marché dit « Demain » une fois celui du jour parti.
 * Illisible → null : la carte reste achetable, et la RPC tranche (elle refuse
 * alors avec `deja_aujourdhui`, qui a sa phrase).
 */
async function lireDernierBoostXp(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('boutique_achats')
    .select('created_at')
    .eq('user_id', userId)
    .eq('nature', 'offre')
    .eq('article', 'double-xp-2h')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    signaler('dernier boost XP illisible', error)
    return null
  }
  const instant = (data as { created_at?: unknown } | null)?.created_at
  return typeof instant === 'string' ? instant : null
}

/**
 * La fin du Boost XP en cours, pour le bandeau du haut (« ×2 XP »). Une seule
 * colonne, isolée : sa lecture ne doit jamais coûter le niveau ni les gemmes.
 * Colonne absente (368 pas exécutée), ligne absente ou boost fini → null.
 */
export async function lireFinBoostXp(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_wallet')
    .select('double_xp_jusqua')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    signaler('fin du boost XP illisible', error)
    return null
  }
  const fin = finBoostXp(normaliserBoosts(data).doubleXpJusqua, new Date())
  return fin === null ? null : fin.toISOString()
}

/**
 * Les gels de série de l'élève, pour la flamme (`computeStreak`, lib/streak) :
 * les jours déjà gelés et la réserve. Une seule ligne lue par clé primaire —
 * le prix d'un aller-retour, partagé avec la vague de la page qui l'appelle.
 */
export async function lireGelsSerie(
  supabase: SupabaseClient,
  userId: string,
): Promise<GelsSerie> {
  const { data, error } = await supabase
    .from('user_wallet')
    .select('jours_geles, gels_serie')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    signaler('gels de série illisibles', error)
    return AUCUN_GEL
  }
  return parseGelsSerie(data)
}

/** Les objets de profil vendus en gemmes, et ceux que l'élève possède déjà. */
export async function lireObjetsProfil(
  supabase: SupabaseClient,
  userId: string,
): Promise<ObjetProfil[]> {
  // La vitrine (identique pour tous) vient du cache serveur — lib/vitrines-server,
  // repli sur la lecture par élève tant que la 374 n'ouvre pas la lecture anon.
  const [objets, possedes] = await Promise.all([
    lireObjetsBoutique(supabase),
    supabase.from('user_avatar_items').select('item_id').eq('user_id', userId),
  ])
  if (objets === null) {
    console.error('[boutique] objets de profil illisibles')
    return []
  }
  // Possession illisible : on n'affiche pas la vitrine comme si l'élève ne
  // possédait rien — il pourrait payer deux fois ce qu'il a (la RPC refuserait,
  // mais l'écran aurait menti). Mieux vaut ne rien proposer.
  if (possedes.error) {
    signaler('objets possédés illisibles', possedes.error)
    return []
  }
  const ids = new Set(
    (possedes.data ?? [])
      .map((r) => (r as { item_id?: unknown }).item_id)
      .filter((id): id is string => typeof id === 'string'),
  )
  return normaliserObjetsProfil(objets, ids)
}
