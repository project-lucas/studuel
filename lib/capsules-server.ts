import type { SupabaseClient } from '@supabase/supabase-js'
import {
  lireAchats,
  lireCapsule,
  lireCatalogue,
  lireContenu,
  type AchatCapsule,
  type Capsule,
  type ContenuCapsule,
} from '@/lib/capsules'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { capsulesPublieesEnCache } from '@/lib/vitrines-server'

// -----------------------------------------------------------------------------
// Lectures des capsules (migration 366). Séparées de lib/capsules.ts, qui reste
// pur et importable par les composants clients sans embarquer supabase-js.
//
// TOLÉRANTES : tant que la 366 n'est pas exécutée, tout rend vide — la
// Boutique n'affiche pas de rayon, le carnet pas d'étagère, et rien ne casse.
// -----------------------------------------------------------------------------

const COLONNES_CATALOGUE =
  'id, theme, titre, accroche, emoji, teinte, prix_gemmes, prix_euros, duree_min, au_programme, badge, ordre'

function signaler(contexte: string, error: { code?: string | null; message?: string } | null) {
  if (error && !isMissingSchemaObject(error)) {
    console.error(`[capsules] ${contexte} :`, error.message)
  }
}

export async function lireCatalogueCapsules(supabase: SupabaseClient): Promise<Capsule[]> {
  // Le catalogue est le même pour tous et lisible en anon (366) : servi par le
  // cache serveur. Vide = cache froid sans la 366 → lecture par élève.
  const enCache = await capsulesPublieesEnCache(COLONNES_CATALOGUE)
  if (enCache.length > 0) return lireCatalogue(enCache)
  const { data, error } = await supabase
    .from('capsules')
    .select(COLONNES_CATALOGUE)
    .eq('publiee', true)
    .order('ordre')
  signaler('catalogue illisible', error)
  return error ? [] : lireCatalogue(data)
}

export async function lireMesAchats(
  supabase: SupabaseClient,
  userId: string,
): Promise<AchatCapsule[]> {
  const { data, error } = await supabase
    .from('capsule_achats')
    .select('capsule_id, statut, achetee_le, ouverte_le, terminee_le')
    .eq('user_id', userId)
  signaler('achats illisibles', error)
  return error ? [] : lireAchats(data)
}

/**
 * Le nombre de capsules achetées et jamais ouvertes : la pastille du bouton
 * « Mon carnet ». Un compte en tête de requête, sans rapatrier de ligne.
 */
export async function compterCapsulesNonOuvertes(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from('capsule_achats')
    .select('capsule_id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('statut', 'active')
    .is('ouverte_le', null)
  signaler('pastille illisible', error)
  return error ? 0 : (count ?? 0)
}

/**
 * Une capsule, son achat et son contenu. Le contenu n'est rendu par la base
 * QUE si l'achat est actif (RLS de `capsule_elements`) : sans achat, il vaut
 * `null` même si la capsule existe.
 */
export async function lireCapsuleComplete(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<{ capsule: Capsule | null; achat: AchatCapsule | null; contenu: ContenuCapsule | null }> {
  const [{ data: ligne, error: e1 }, { data: achats, error: e2 }, { data: elements, error: e3 }] =
    await Promise.all([
      supabase.from('capsules').select(COLONNES_CATALOGUE).eq('id', id).maybeSingle(),
      supabase
        .from('capsule_achats')
        .select('capsule_id, statut, achetee_le, ouverte_le, terminee_le')
        .eq('user_id', userId)
        .eq('capsule_id', id),
      supabase.from('capsule_elements').select('type, titre, contenu').eq('capsule_id', id),
    ])
  signaler('capsule illisible', e1 ?? e2 ?? e3)
  return {
    capsule: e1 ? null : lireCapsule(ligne),
    achat: e2 ? null : (lireAchats(achats)[0] ?? null),
    contenu: e3 ? null : lireContenu(elements),
  }
}
