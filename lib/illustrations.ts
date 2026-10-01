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
export const BADGES_ILLUSTRES: ReadonlySet<string> = new Set<string>([])

/** Ids des objets de profil (`avatar_items`) qui ont leur vignette dessinée. */
export const OBJETS_ILLUSTRES: ReadonlySet<string> = new Set<string>([])

export function imageBadge(slug: string): string | null {
  return BADGES_ILLUSTRES.has(slug) ? `/images/badges/${slug}.webp` : null
}

export function imageObjet(id: string): string | null {
  return OBJETS_ILLUSTRES.has(id) ? `/images/boutique/objets/${id}.webp` : null
}
