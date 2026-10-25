'use server'

import { createClient } from '@/lib/supabase/server'
import { gainsDepuis, gainsEnListe, type SourceLettre } from '@/lib/courrier'
import type { Gain } from '@/lib/gains'

// -----------------------------------------------------------------------------
// LE COURRIER — les gestes (25/10/2026, migration 602). Le serveur seul décide
// des gains : `courrier_encaisser` verse UNE fois et rend ce qu'il a VRAIMENT
// versé ; l'écran fait voler exactement cela. Aucune revalidation ici : la
// boîte tient son état à l'écran, et le vol des récompenses rafraîchit la page
// quand la volée est rentrée (RecompensesProvider).
// -----------------------------------------------------------------------------

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/** Au-delà, une diffusion de plus n'est pas marquée : la liste de la boîte en rend 50 au plus. */
const ANNONCES_MAX = 50

export type ReponseEncaissement = {
  ok: boolean
  /** Ce que le serveur a versé — l'XP après multiplicateur. */
  gains: Gain[]
  raison: 'ok' | 'deja' | 'rien' | 'inconnue' | 'expiree' | 'anonyme' | 'absent' | 'erreur'
}

export type ReponseToutRecuperer = ReponseEncaissement & { lettres: number }

/** Marquer une lettre lue — une diffusion (588) se range par `annonce_marquer`. */
export async function lireLettreAction(id: string, source: SourceLettre): Promise<boolean> {
  if (!UUID.test(id ?? '') || source === 'defi') return false
  const supabase = await createClient()
  const { data, error } =
    source === 'annonce'
      ? await supabase.rpc('annonce_marquer', { p_annonce: id, p_quoi: 'fermee' })
      : await supabase.rpc('courrier_lire', { p_id: id })
  return !error && data === true
}

/** « Tout lire » : les lettres d'un coup, les diffusions une à une. */
export async function toutLireAction(annonces: readonly string[]): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('courrier_tout_lire')
  await marquerAnnonces(supabase, annonces)
  return !error
}

/** « Récupérer » : le serveur verse une fois, l'écran fait voler ce qu'il rend. */
export async function encaisserLettreAction(id: string): Promise<ReponseEncaissement> {
  if (!UUID.test(id ?? '')) return { ok: false, gains: [], raison: 'inconnue' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('courrier_encaisser', { p_id: id })
  if (error) return { ok: false, gains: [], raison: error.code === 'PGRST202' ? 'absent' : 'erreur' }
  return reponseDepuis(data)
}

/** « Tout lire et récupérer » : chaque cadeau en attente, puis tout lu. */
export async function toutRecupererAction(annonces: readonly string[]): Promise<ReponseToutRecuperer> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('courrier_tout_encaisser')
  if (error) return { ok: false, gains: [], raison: error.code === 'PGRST202' ? 'absent' : 'erreur', lettres: 0 }
  await marquerAnnonces(supabase, annonces)
  const r = data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
  const lettres = Number(r.lettres)
  return {
    ok: true,
    gains: gainsEnListe(gainsDepuis(r)),
    raison: 'ok',
    lettres: Number.isFinite(lettres) && lettres > 0 ? Math.floor(lettres) : 0,
  }
}

function reponseDepuis(data: unknown): ReponseEncaissement {
  const r = data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
  const raison = r.raison
  const connue: ReponseEncaissement['raison'] =
    raison === 'ok' || raison === 'deja' || raison === 'rien' || raison === 'inconnue' || raison === 'expiree' || raison === 'anonyme'
      ? raison
      : 'erreur'
  return { ok: connue === 'ok', gains: connue === 'ok' ? gainsEnListe(gainsDepuis(r)) : [], raison: connue }
}

async function marquerAnnonces(supabase: Awaited<ReturnType<typeof createClient>>, annonces: readonly string[]): Promise<void> {
  const ids = (Array.isArray(annonces) ? annonces : []).filter((id) => typeof id === 'string' && UUID.test(id)).slice(0, ANNONCES_MAX)
  await Promise.all(ids.map((id) => supabase.rpc('annonce_marquer', { p_annonce: id, p_quoi: 'fermee' })))
}
