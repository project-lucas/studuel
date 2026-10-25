// LA SUPPRESSION DU COMPTE (25/10/2026, migration 596) — les règles pures :
// le mot de confirmation et les messages montrés à l'élève pour chaque réponse
// de `compte_supprimer`.

export const MOT_SUPPRESSION = 'SUPPRIMER'

/** L'élève a bien écrit le mot (casse et espaces autour pardonnés). */
export function motConfirme(saisie: string): boolean {
  return saisie.trim().toUpperCase() === MOT_SUPPRESSION
}

const MESSAGES: Record<string, string> = {
  confirmation: `Écris ${MOT_SUPPRESSION} pour confirmer.`,
  anonyme: 'Ta session a expiré : reconnecte-toi, puis recommence.',
  admin: 'Un compte administrateur ne se supprime pas depuis l’app.',
  coach: 'Archive d’abord tes groupes dans l’espace coach : sinon tes joueurs perdraient leur groupe.',
  panne: 'Impossible pour le moment. Réessaie dans un instant.',
}

/** Le message d'une réponse de `compte_supprimer` (ou d'une panne). */
export function messageSuppression(code: string): string {
  return MESSAGES[code] ?? MESSAGES.panne
}
