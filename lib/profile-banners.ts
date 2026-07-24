// Bannières de profil illustrées (onglet Défi) — catalogue client.
//
// Miroir de rendu des items `avatar_items` catégorie 'banner' seedés en
// migration 200. Chaque bannière porte un dégradé de repli (affiché tant que le
// visuel webp n'est pas généré — phase 5) et sa rareté. Précédent assumé :
// `components/avatar/vestiaire-assets.tsx` dessine déjà ses bannières avec des
// hex décoratifs — c'est une couche illustrative, hors tokens sémantiques.

export type BannerRarity = 'common' | 'rare' | 'legendary'

export type ProfileBanner = {
  /** asset_key en base (avatar_items). */
  key: string
  name: string
  rarity: BannerRarity
  /** Dégradé de repli, du haut au bas. */
  from: string
  to: string
  /** Visuel illustré (généré en phase 5) ; superposé au dégradé s'il existe. */
  image: string
}

// L'ordre suit le `sort` du seed. La première (gratuite) est le défaut.
export const PROFILE_BANNERS: readonly ProfileBanner[] = [
  { key: 'arene-crepuscule', name: 'Arène au crépuscule', rarity: 'common', from: '#4c1d95', to: '#7c3aed', image: '/banners/arene-crepuscule.webp' },
  { key: 'cour-recre',       name: 'Cour de récré',       rarity: 'common', from: '#5b8def', to: '#2f6fed', image: '/banners/cour-recre.webp' },
  { key: 'flamme-serie',     name: 'Flamme de série',     rarity: 'rare',   from: '#f97316', to: '#dc2626', image: '/banners/flamme-serie.webp' },
  { key: 'podium-or',        name: 'Podium d’or',         rarity: 'rare',   from: '#fbbf24', to: '#d97706', image: '/banners/podium-or.webp' },
  { key: 'cosmos',           name: 'Cosmos studieux',     rarity: 'rare',   from: '#312e81', to: '#0f172a', image: '/banners/cosmos.webp' },
  { key: 'vitrail',          name: 'Vitrail savant',      rarity: 'rare',   from: '#7e22ce', to: '#1e3a8a', image: '/banners/vitrail.webp' },
  { key: 'couronne-royale',  name: 'Couronne royale',     rarity: 'legendary', from: '#facc15', to: '#7c3aed', image: '/banners/couronne-royale.webp' },
  { key: 'dragon-savoir',    name: 'Dragon du savoir',    rarity: 'legendary', from: '#059669', to: '#064e3b', image: '/banners/dragon-savoir.webp' },
] as const

export const DEFAULT_PROFILE_BANNER = PROFILE_BANNERS[0].key

const BY_KEY: ReadonlyMap<string, ProfileBanner> = new Map(
  PROFILE_BANNERS.map((b) => [b.key, b]),
)

// La bannière d'une clé, ou la bannière par défaut si inconnue/nulle. Ne jette
// jamais : un profil sans bannière (ou avec une clé retirée du catalogue) rend
// quand même un fond propre.
export function bannerFor(key: string | null | undefined): ProfileBanner {
  if (key) {
    const found = BY_KEY.get(key)
    if (found) return found
  }
  return BY_KEY.get(DEFAULT_PROFILE_BANNER) as ProfileBanner
}
