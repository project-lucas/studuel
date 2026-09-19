// L'ACCÈS AUX JEUX DE SALON — ce que la version gratuite ouvre, et ce que
// Studuel+ ajoute.
//
// Lucas, 19/09/2026 : « la version freemium aura au moins un mode de jeu par
// matière, la payante en aura plus ». Règle unique et lisible : dans chaque
// matière, le PREMIER jeu jouable du catalogue (lib/jeux/catalog, SALONS) est
// libre ; les suivants sont réservés à Studuel+. Un jeu « Bientôt » n'ouvre
// rien pour personne.
//
// Pur et testable. Le serveur applique la même règle aux routes du jeu
// (app/defi/jeux/[jeu]/…) : un lien profond ne contourne pas le verrou.

import { SALONS } from '@/lib/jeux/catalog'

/** Où mène un billet verrouillé : la Boutique, dont Studuel+ ouvre la page. */
export const LIEN_STUDUEL_PLUS = '/tresor'

/** Le jeu libre de chaque matière : le premier jeu jouable de son salon. */
export const JEUX_LIBRES: ReadonlySet<string> = new Set(
  SALONS.flatMap((salon) => {
    const premier = salon.games.find((g) => g.implemented)
    return premier ? [premier.id] : []
  }),
)

/** Vrai si ce jeu se joue sans Studuel+. */
export function jeuLibre(gameId: string): boolean {
  return JEUX_LIBRES.has(gameId)
}

/** Vrai si l'élève peut jouer à ce jeu : libre, ou abonné à Studuel+. */
export function jeuOuvert(gameId: string, premium: boolean): boolean {
  return premium || jeuLibre(gameId)
}
