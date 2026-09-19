// -----------------------------------------------------------------------------
// Les objets de profil vendus EN GEMMES à la boutique (migration 368).
//
// Ce sont des lignes du vestiaire (`avatar_items`, migrations 189/200/240) qui
// portent un `prix_gemmes`. Le prix affiché vient de la base, le prix DÉBITÉ
// aussi (RPC `acheter_objet_profil`) : rien ne vient du client. Acheté, l'objet
// entre dans `user_avatar_items` et s'équipe comme tous les autres — au
// vestiaire (/moi/avatar) pour une tenue ou un accessoire, sur la carte de
// profil (/defi) pour une bannière.
//
// L'IMAGE. Aucun de ces objets n'a aujourd'hui de visuel matriciel dans
// /public : les bannières de profil (200) pointent vers /banners/<clé>.webp, que
// personne n'a encore générés (ProfileBannerArt les pose en FOND CSS pour que
// leur absence ne se voie pas — une <img> afficherait l'icône cassée) ; les
// tenues sont une couleur (asset_key hexadécimal, lib/avatar) ; les accessoires
// sont des SVG dessinés en code (components/avatar/vestiaire-assets.tsx).
// `image` vaut donc `null` tant qu'aucun fichier n'existe — l'écran dessine
// alors son repli, jamais une image cassée.
//
// Pur et testable : la lecture vit dans boosts-server.ts.
// -----------------------------------------------------------------------------

export type CategorieObjet = 'banniere' | 'tenue' | 'accessoire'

export type ObjetProfil = {
  id: string
  categorie: 'banniere' | 'tenue' | 'accessoire'
  nom: string
  image: string | null
  /**
   * La clé de dessin du vestiaire (`avatar_items.asset_key`) : le slug d'une
   * bannière ou d'un accessoire, « forme|couleur » pour une tenue. La vitrine
   * s'en sert pour montrer l'objet tant qu'il n'a pas d'image.
   */
  cle: string | null
  prixGemmes: number
  possede: boolean
}

/** Catégorie du vestiaire (`avatar_items.category`) → rayon de la boutique.
 *  Les autres catégories (peau, coiffure) ne se vendent pas en gemmes. */
const RAYONS: ReadonlyMap<string, CategorieObjet> = new Map([
  ['banner', 'banniere'],
  ['outfit', 'tenue'],
  ['equipment', 'accessoire'],
])

export function categorieObjet(category: unknown): CategorieObjet | null {
  return typeof category === 'string' ? (RAYONS.get(category) ?? null) : null
}

/**
 * Lignes `avatar_items` (avec `prix_gemmes`) + ids possédés → objets sûrs,
 * du moins cher au plus cher. Une ligne illisible (id ou nom manquant, rayon
 * inconnu, prix absent ou négatif) est ÉCARTÉE : mieux vaut un objet de moins
 * dans la vitrine qu'un objet qu'on ne pourrait pas acheter.
 */
export function normaliserObjetsProfil(
  rows: unknown,
  possedes: ReadonlySet<string>,
): ObjetProfil[] {
  if (!Array.isArray(rows)) return []
  const objets: ObjetProfil[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const r = row as Record<string, unknown>
    const id = typeof r.id === 'string' ? r.id : ''
    const nom = typeof r.name === 'string' ? r.name.trim() : ''
    const categorie = categorieObjet(r.category)
    const prix = typeof r.prix_gemmes === 'number' ? r.prix_gemmes : Number.NaN
    if (!id || !nom || !categorie || !Number.isFinite(prix) || prix < 0) continue
    objets.push({
      id,
      categorie,
      nom,
      image: null,
      cle: typeof r.asset_key === 'string' && r.asset_key.trim() ? r.asset_key.trim() : null,
      prixGemmes: Math.round(prix),
      possede: possedes.has(id),
    })
  }
  return objets.sort(
    (a, b) => a.prixGemmes - b.prixGemmes || a.nom.localeCompare(b.nom, 'fr'),
  )
}
