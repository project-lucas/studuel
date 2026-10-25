// LE CANAL DE L'APP (25/10/2026, voie A de Lucas) — l'app Android du Play
// Store ne vend RIEN en euros : Google exige son propre paiement (Play
// Billing) pour tout contenu numérique. La version Play cache donc Studuel+,
// les packs de gemmes, les recharges de Marcel et le paiement des capsules
// par carte — sans dire où les acheter ailleurs (interdit aussi).
//
// Comment l'app sait qu'elle est la version Play : l'app Android démarre sur
// `/lancement.html?canal=play`, et Chrome y pose `document.referrer =
// android-app://<paquet>/`. L'écran de lancement (public/lancement.html, qui
// RECOPIE `doitMarquerPlay` : il ne peut rien importer) écrit alors un cookie
// d'un an que le serveur lit (`lib/canal-server.ts`).
//
// Le cookie vit dans Chrome, que l'app Android partage : sur un téléphone où
// l'app Play est installée, le site ouvert dans Chrome cache aussi les euros.
// C'est le sens prudent — jamais l'inverse.

export const COOKIE_CANAL = 'studuel_canal'
export const CANAL_PLAY = 'play'

/** Le lancement vient-il de l'app Android du Play Store ? */
export function doitMarquerPlay(search: string, referrer: string): boolean {
  return /(?:^|[?&])canal=play(?:&|$)/.test(search) || referrer.startsWith('android-app://')
}

/** La valeur du cookie dit-elle « version Play » ? */
export function estCanalPlay(valeur: string | undefined): boolean {
  return valeur === CANAL_PLAY
}

/** Un catalogue sans prix en euros : la carte disparaît, les gemmes restent. */
export function sansPrixEuros<T extends { prixEuros: number | null }>(items: readonly T[]): T[] {
  return items.map((item) => ({ ...item, prixEuros: null }))
}
