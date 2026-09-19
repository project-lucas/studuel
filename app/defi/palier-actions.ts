'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import {
  parsePalierStandings,
  type PalierTimeStanding,
} from '@/lib/jeux/palier-standing'
import { isPalierLevel, isPlausibleTime } from '@/lib/jeux/paliers'
import { playableSalonGame } from '@/lib/jeux/catalog'
import {
  lireReclamation,
  type EtoilesParPalier,
} from '@/lib/jeux/palier-gemmes'

/**
 * Fait payer en gemmes les étoiles de ce jeu que le serveur n'a pas encore
 * payées (migration 373 : palier N → N gemmes par étoile, une fois pour
 * toujours). Appelée à la fin d'une partie qui a décroché une étoile, et par
 * la carte du jeu quand le stockage local porte des étoiles jamais payées.
 *
 * Rend les gemmes versées PAR CET APPEL et les étoiles désormais payées, ou
 * `null` sans bruit quand il n'y a rien à dire : visiteur, jeu hors catalogue,
 * migration 373 pas encore exécutée.
 */
export async function reclamerGemmesPalier(
  gameId: string,
  etoiles: readonly number[],
): Promise<{ gemmes: number; etoiles: EtoilesParPalier } | null> {
  if (!playableSalonGame(String(gameId))) return null
  if (!Array.isArray(etoiles) || etoiles.length !== 5) return null
  const propres = etoiles.map((n) => {
    const v = Math.floor(Number(n))
    return Number.isFinite(v) ? Math.min(3, Math.max(0, v)) : 0
  })

  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('palier_gemmes_reclamer', {
    p_game_id: String(gameId),
    p_etoiles: propres,
  })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[defi] gemmes de palier non versées:', error.message)
    }
    return null
  }
  const reponse = lireReclamation(data)
  return reponse.ok ? { gemmes: reponse.gemmes, etoiles: reponse.etoiles } : null
}

/**
 * Enregistre le TEMPS DE BOUCLAGE d'un palier et rend la place qu'il donne
 * (« top 5 % des joueurs »), en un seul aller-retour : l'écran de fin de partie
 * a besoin des deux au même instant.
 *
 * Appelée UNIQUEMENT après une partie gagnée — c'est le hook client qui tient
 * cette règle (lib/jeux/use-palier-run), et la RPC la re-vérifie à sa façon en
 * bornant le chrono. Un temps de partie perdue rendrait le classement absurde :
 * le plus rapide serait celui qui abandonne le plus tôt.
 *
 * Rend `null` sans bruit dans tous les cas où il n'y a rien à dire : visiteur,
 * chrono invraisemblable, jeu hors catalogue, ou migration 313 pas encore
 * exécutée. L'écran affiche alors le chrono local, sans pourcentage.
 */
export async function recordPalierTime(
  gameId: string,
  palier: number,
  elapsedMs: number,
): Promise<PalierTimeStanding | null> {
  if (!isPalierLevel(palier)) return null
  if (!isPlausibleTime(elapsedMs)) return null

  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('record_palier_time', {
    p_game_id: String(gameId).slice(0, 64),
    p_palier: palier,
    p_ms: Math.round(elapsedMs),
  })

  if (error || !data) {
    // Un refus (jeu hors catalogue, borne de chrono) n'est pas une panne : on ne
    // journalise que l'échec technique, et l'écran perd une ligne, pas plus.
    if (error) {
      console.error('[defi] temps de palier non enregistré:', error.message)
    }
    return null
  }

  return parsePalierStandings([data])[palier] ?? null
}
