import { unstable_cache } from 'next/cache'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// -----------------------------------------------------------------------------
// LES VITRINES — les catalogues identiques pour TOUS les élèves (badges,
// bannières gratuites, objets de la Boutique, capsules), servis depuis le cache
// serveur (Vercel Data Cache, TTL 5 min) au lieu d'un aller-retour Supabase à
// chaque rendu d'onglet (19/09/2026, chantier latence : une requête PostgREST
// coûte ~60 ms depuis cdg1, même minuscule).
//
// Même règle que lib/catalog : client SANS cookies (rôle anon), donc jamais de
// donnée personnelle ici. Les badges et les objets ne sont lisibles en anon
// qu'après la migration 374 ; d'ici là le cache rend une liste vide et chaque
// lecteur retombe sur la lecture par élève — exactement le comportement
// d'avant, rien ne casse.
// -----------------------------------------------------------------------------

const TTL_SECONDES = 300

function anon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

type Ligne = Record<string, unknown>

async function lignes(requete: PromiseLike<{ data: unknown; error: unknown }>): Promise<Ligne[]> {
  const { data, error } = await requete
  return error || !Array.isArray(data) ? [] : (data as Ligne[])
}

const COLONNES_BADGES = 'id, slug, title, description, icon, condition'

const badgesEnCache = unstable_cache(
  () => lignes(anon().from('badges').select(COLONNES_BADGES)),
  ['vitrine-badges'],
  { revalidate: TTL_SECONDES, tags: ['catalog'] },
)

const bannieresGratuitesEnCache = unstable_cache(
  () =>
    lignes(
      anon()
        .from('avatar_items')
        .select('asset_key')
        .eq('category', 'banner')
        .is('price', null)
        .is('unlock_condition', null),
    ),
  ['vitrine-bannieres-gratuites'],
  { revalidate: TTL_SECONDES, tags: ['catalog'] },
)

const COLONNES_OBJETS = 'id, category, name, prix_gemmes, asset_key'

const objetsBoutiqueEnCache = unstable_cache(
  () => lignes(anon().from('avatar_items').select(COLONNES_OBJETS).not('prix_gemmes', 'is', null)),
  ['vitrine-objets-boutique'],
  { revalidate: TTL_SECONDES, tags: ['catalog'] },
)

/** Le catalogue des badges (condition brute, à typer par l'appelant). */
export async function lireCatalogueBadges(supabase: SupabaseClient): Promise<Ligne[]> {
  const cache = await badgesEnCache()
  if (cache.length > 0) return cache
  return lignes(supabase.from('badges').select(COLONNES_BADGES))
}

/** Les bannières équipables d'office (gratuites, sans condition). */
export async function lireBannieresGratuites(supabase: SupabaseClient): Promise<Ligne[]> {
  const cache = await bannieresGratuitesEnCache()
  if (cache.length > 0) return cache
  return lignes(
    supabase
      .from('avatar_items')
      .select('asset_key')
      .eq('category', 'banner')
      .is('price', null)
      .is('unlock_condition', null),
  )
}

/**
 * Les objets de profil vendus en gemmes. `null` quand même la lecture par
 * élève échoue : l'appelant ne doit alors rien proposer (il pourrait vendre
 * deux fois un objet déjà possédé si la vitrine mentait).
 */
export async function lireObjetsBoutique(supabase: SupabaseClient): Promise<Ligne[] | null> {
  const cache = await objetsBoutiqueEnCache()
  if (cache.length > 0) return cache
  const { data, error } = await supabase
    .from('avatar_items')
    .select(COLONNES_OBJETS)
    .not('prix_gemmes', 'is', null)
  if (error) return null
  return Array.isArray(data) ? (data as Ligne[]) : []
}

/**
 * Les capsules publiées — lisibles en anon depuis leur migration (366) :
 * servies du cache sans repli nécessaire. La colonne `select` est celle du
 * lecteur de lib/capsules-server.
 */
export function capsulesPublieesEnCache(colonnes: string): Promise<Ligne[]> {
  return unstable_cache(
    () => lignes(anon().from('capsules').select(colonnes).eq('publiee', true).order('ordre')),
    ['vitrine-capsules', colonnes],
    { revalidate: TTL_SECONDES, tags: ['catalog'] },
  )()
}
