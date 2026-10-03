// -----------------------------------------------------------------------------
// LES ILLUSTRATIONS « FAMILLE NAV » — ce qui remplace, au fil des livraisons,
// les emojis et les pictogrammes au trait qui tenaient lieu d'image dans Moi,
// Amis et la Boutique (chantier d'homogénéité du 24/09/2026).
//
// La référence est la barre d'onglets (public/images/nav/) et les icônes de
// l'arène (public/images/defi/icones/*-v3) : objets de jeu mobile dessinés,
// épais cerne prune, volumes brillants, palette violet · or · crème. Un badge
// en emoji 🌱 ou une paire de lunettes au trait lucide à côté d'eux se lisent
// comme deux applications différentes.
//
// On ne déclare ici que ce qui est LIVRÉ : le chemin s'en déduit, et
// lib/assets.test.ts vérifie que chaque fichier existe. Tant qu'un badge ou un
// objet n'est pas dans la liste, l'écran garde son repli (l'emoji du badge, le
// dessin du vestiaire) — jamais d'image cassée.
//
// Fabriquées par `node scripts/illustrations-famille.mjs` depuis
// assets-sources/famille/<dossier>/<id>.png.
//
// Pur, sans dépendance : importable par un composant client.
// -----------------------------------------------------------------------------

/** Slugs des badges (table `badges`) qui ont leur médaille dessinée. */
// Les 22 médailles, générées le 03/10/2026 (Nano Banana 2 Lite, références :
// la barre d'onglets) depuis assets-sources/famille/commande-icones.json.
export const BADGES_ILLUSTRES: ReadonlySet<string> = new Set<string>([
  'capsule-argent',
  'capsule-methode',
  'capsule-nutrition',
  'capsule-orientation',
  'capsule-sommeil',
  'capsule-stress',
  'habitude-ancree',
  'premiere-habitude',
  'quiz-10',
  'sans-faute',
  'serie-100',
  'serie-30',
  'serie-7',
  'temps-1000h',
  'temps-100h',
  'temps-10h',
  'temps-1h',
  'trajet-1',
  'trajet-serie-20',
  'trajet-serie-5',
  'trajets-10',
  'trajets-50',
])

/** Ids des objets de profil (`avatar_items`) qui ont leur vignette dessinée. */
// Livrés le 04/10/2026 : les deux accessoires (scripts/illustrations-famille.mjs
// objets) et les vignettes des trois bannières en vente, recadrées sur leur
// bannière (scripts/illustrations-lot-1004.mjs).
export const OBJETS_ILLUSTRES: ReadonlySet<string> = new Set<string>([
  'banner-couronne-royale',
  'banner-dragon-savoir',
  'banner-vitrail',
  'equip-casque',
  'equip-lunettes',
])

export function imageBadge(slug: string): string | null {
  return BADGES_ILLUSTRES.has(slug) ? `/images/badges/${slug}.webp` : null
}

export function imageObjet(id: string): string | null {
  return OBJETS_ILLUSTRES.has(id) ? `/images/boutique/objets/${id}.webp` : null
}
