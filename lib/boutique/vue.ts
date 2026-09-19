// -----------------------------------------------------------------------------
// LA PASTILLE DE L'ONGLET BOUTIQUE — « il y a du neuf cette semaine ».
//
// Elle signalait le coffre du jour, retiré avec la refonte du 18/09/2026. Elle
// appelle désormais les OFFRES DU MOMENT, qui changent chaque lundi
// (lib/boutique/offres) : la pastille s'allume en début de semaine et
// s'éteint dès que l'élève a vu la Boutique. La semaine vue est retenue dans
// un cookie (lu par le serveur au rendu de la barre d'onglets).
// -----------------------------------------------------------------------------

export const COOKIE_BOUTIQUE_VUE = 'studuel_boutique_vue'

/** Émis par la Boutique quand elle est vue : la pastille s'éteint sans recharger. */
export const EVENEMENT_BOUTIQUE_VUE = 'studuel:boutique-vue'

/** Le lundi (UTC) de la semaine de `maintenant`, « YYYY-MM-DD » : la clé de la vitrine. */
export function cleSemaineVitrine(maintenant: Date): string {
  const t = maintenant.getTime()
  if (!Number.isFinite(t)) return ''
  const jour = (maintenant.getUTCDay() + 6) % 7
  const lundi = new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate() - jour))
  return lundi.toISOString().slice(0, 10)
}

/** Vrai tant que la vitrine de cette semaine n'a pas été vue. */
export function vitrineAVoir(vue: string | null | undefined, maintenant: Date): boolean {
  return vue !== cleSemaineVitrine(maintenant)
}
