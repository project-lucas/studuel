// -----------------------------------------------------------------------------
// La réponse d'un achat en gemmes (RPC `acheter_offre` / `acheter_objet_profil`,
// migration 368) et ce qu'on en dit à l'élève.
//
// Les deux RPC rendent `{"ok": true, "gemmes": <solde après débit>}` ou
// `{"ok": false, "raison": "..."}`. Chaque refus a SA phrase : « pas assez de
// gemmes » à un élève dont le bonus est simplement déjà actif, c'est l'envoyer
// compter ses gemmes pour rien (même leçon que `PurchaseResult.raison`,
// app/tresor/actions.ts).
//
// Pur et testable : les Server Actions (app/tresor/boutique-actions.ts) ne
// font qu'appeler la RPC et relayer.
// -----------------------------------------------------------------------------

export type ReponseAchat = { ok: true; gemmes: number } | { ok: false; raison: string }

/** JSON de la RPC → réponse sûre. Illisible = refus « panne », jamais un succès. */
export function lireReponseAchat(data: unknown): ReponseAchat {
  if (!data || typeof data !== 'object') return { ok: false, raison: 'panne' }
  const r = data as { ok?: unknown; gemmes?: unknown; raison?: unknown }
  if (r.ok === true) {
    const gemmes = Number(r.gemmes)
    return { ok: true, gemmes: Number.isFinite(gemmes) ? Math.max(0, gemmes) : 0 }
  }
  return { ok: false, raison: typeof r.raison === 'string' ? r.raison : 'panne' }
}

export const MESSAGE_PANNE = 'Achat impossible pour le moment. Réessaie dans un instant.'
export const MESSAGE_ANONYME = 'Connecte-toi pour acheter.'
export const MESSAGE_BOUTIQUE_FERMEE = 'La boutique en gemmes ouvre très bientôt.'
export const MESSAGE_HORS_VITRINE = 'Cette offre n’est plus en vente au Marché.'
const MESSAGE_PAS_ASSEZ = 'Il te manque des gemmes pour cet achat.'
/** Un Boost XP par jour (migration 373, refus `deja_aujourdhui`). */
export const MESSAGE_BOOST_DEMAIN = 'Un Boost XP par jour : le prochain se débloque demain.'

/** Le refus d'une offre du moment, en français. */
export function messageRefusOffre(raison: string): string {
  switch (raison) {
    case 'inconnue':
      return 'Cette offre n’existe pas.'
    case 'deja_actif':
      return 'Ce bonus est déjà actif : profites-en !'
    case 'deja_aujourdhui':
      return MESSAGE_BOOST_DEMAIN
    case 'plein':
      // Au Marché, seul le bouclier a une réserve (les gels ne se vendent plus).
      return 'Tu as déjà un bouclier en réserve : il protège ta prochaine défaite.'
    case 'pas_assez':
      return MESSAGE_PAS_ASSEZ
    case 'anonyme':
      return MESSAGE_ANONYME
    default:
      return MESSAGE_PANNE
  }
}

/** Le refus d'un objet de profil, en français. */
export function messageRefusObjet(raison: string): string {
  switch (raison) {
    case 'inconnu':
      return 'Cet objet n’est pas en vente.'
    case 'deja':
      return 'Tu possèdes déjà cet objet.'
    case 'pas_assez':
      return MESSAGE_PAS_ASSEZ
    case 'anonyme':
      return MESSAGE_ANONYME
    default:
      return MESSAGE_PANNE
  }
}

/** Un id d'objet plausible (forme des ids du vestiaire : « banner-cosmos »). */
export function idObjetValide(id: unknown): id is string {
  return typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(id)
}
