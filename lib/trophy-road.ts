// La ROUTE DES TROPHÉES — logique pure, sans React ni Supabase.
//
// Remplace l'Elo-lite de `lib/trophies.ts` comme moteur de la ladder. Le
// changement de modèle est délibéré : on ne classe plus l'élève sur UN compteur
// global alimenté par un mode « Classé » toutes matières, mais sur un compteur
// PAR JEU — le couple (matière × jeu). « Maths · Calcul mental » se monte comme
// un personnage de Brawl Stars, et les totaux se somment :
//
//     trophées du jeu   →  montent match par match, sur une courbe qui ralentit
//     total matière     =  somme de ses jeux
//     total global      =  somme des matières
//
// POURQUOI DES BANDES ET PAS DE L'ELO. Deux raisons.
//
// 1. L'Elo est invisible pour un collégien : il ne sait pas ce qu'il va gagner
//    avant de jouer, donc il ne peut pas arbitrer. Ici le gain est affiché sur
//    la tuile du jeu (« +10 ») et il ne dépend que de SON compteur à lui.
//
// 2. Surtout : la courbe fabrique toute seule l'incitation à étaler. Un jeu à
//    700 rapporte +3 et coûte −7 ; un jeu jamais touché rapporte +10 et ne
//    coûte rien. Sur dix matchs à 55 % de réussite, l'écart est de 70 trophées.
//    L'élève fait le calcul sans qu'on lui demande — et il va vers la compétence
//    qu'il n'a JAMAIS travaillée, ce qui est exactement ce qu'une app de
//    révision veut. Aucune quête, aucun rappel : c'est l'arithmétique qui pousse.
//
// Le plafond n'est donc pas une barrière mais un niveau de jeu : à chaque bande
// correspond un taux de victoire nécessaire pour s'y maintenir (colonne
// `holdRate`). Un élève moyen se stabilise vers 500, un bon vers 700.
//
// MIROIR : le SQL `apply_game_trophies` rejoue cette table à l'identique — le
// serveur reste la source de persistance. Toute évolution ici doit toucher les
// deux, comme la règle qui liait déjà `lib/trophies.ts` à `apply_ranked_match`.

// ------------------------------------------------------------------- la table
// Largeur d'une bande. Ronde à dessein : l'élève lit son compteur et sait dans
// quelle tranche il est sans calculer.
export const BAND_SPAN = 100

export type TrophyBand = {
  /** Borne basse de la bande (incluse). */
  floor: number
  /** Borne haute (exclue), ou null pour la dernière bande, ouverte. */
  ceiling: number | null
  /** Trophées gagnés en cas de victoire. */
  win: number
  /** Trophées perdus en cas de défaite (valeur POSITIVE ; le signe est appliqué
   *  par `trophyDeltaFor`). */
  loss: number
}

/**
 * Le barème, bande par bande. Écrit en toutes lettres plutôt que dérivé d'une
 * formule (`win = 10 - i`) : c'est une table d'ÉQUILIBRAGE, elle est faite pour
 * être relue et retouchée à la main. Une formule aurait caché le geste de game
 * design derrière une astuce d'implémentation.
 *
 * La première bande ne coûte RIEN : c'est le filet du débutant, et il reprend
 * la doctrine déjà posée dans `lib/trophies.ts` — on récompense l'envie de
 * jouer, on ne punit pas l'échec au point de faire fuir un collégien.
 */
export const TROPHY_BANDS: readonly TrophyBand[] = [
  { floor: 0, ceiling: 100, win: 10, loss: 0 },
  { floor: 100, ceiling: 200, win: 9, loss: 1 },
  { floor: 200, ceiling: 300, win: 8, loss: 2 },
  { floor: 300, ceiling: 400, win: 7, loss: 3 },
  { floor: 400, ceiling: 500, win: 6, loss: 4 },
  { floor: 500, ceiling: 600, win: 5, loss: 5 },
  { floor: 600, ceiling: 700, win: 4, loss: 6 },
  { floor: 700, ceiling: 800, win: 3, loss: 7 },
  { floor: 800, ceiling: null, win: 2, loss: 8 },
]

/** La bande d'un compteur de trophées (jamais null : 0 et l'infini sont couverts). */
export function trophyBand(trophies: number): TrophyBand {
  const t = Math.max(0, Math.floor(trophies))
  const index = Math.min(
    TROPHY_BANDS.length - 1,
    Math.floor(t / BAND_SPAN),
  )
  return TROPHY_BANDS[index]
}

// ------------------------------------------------------------------ le calcul

/**
 * Variation de trophées d'une partie sur CE jeu. Entier signé : positif en
 * victoire, négatif ou nul en défaite.
 *
 * Ne dépend que du compteur du joueur sur ce jeu — pas de l'adversaire. C'est
 * volontaire : le gain doit être annonçable AVANT la partie (la pastille « +10 »
 * de la tuile), sinon l'élève ne peut pas arbitrer entre ses jeux, et c'est
 * précisément cet arbitrage qui fait tourner le système.
 */
export function trophyDeltaFor(trophies: number, won: boolean): number {
  const band = trophyBand(trophies)
  if (won) return band.win
  // `-band.loss` vaudrait `-0` sur la bande du débutant : un zéro négatif se
  // propage jusqu'à l'écran de fin, où il s'affiche « −0 ».
  return band.loss === 0 ? 0 : -band.loss
}

export type TrophyChange = {
  before: number
  after: number
  /** Entier signé, déjà borné à 0 par le bas (cf. `after`). */
  delta: number
  /** La bande d'où l'on partait — sert à annoncer « +10 » avant la partie. */
  band: TrophyBand
  /** Vrai quand la partie fait changer de bande (dans un sens ou l'autre). */
  crossedBand: boolean
}

/**
 * Applique le résultat d'une partie au compteur d'un jeu. On ne descend jamais
 * sous zéro. `delta` est recalculé après écrêtage pour que l'écran de fin
 * annonce le mouvement RÉEL du compteur, et non le barème théorique.
 */
export function applyGameResult(before: number, won: boolean): TrophyChange {
  const start = Math.max(0, Math.floor(before))
  const band = trophyBand(start)
  const after = Math.max(0, start + trophyDeltaFor(start, won))
  return {
    before: start,
    after,
    delta: after - start,
    band,
    crossedBand: trophyBand(after).floor !== band.floor,
  }
}

// ------------------------------------------------------------- l'équilibre
// À quoi sert une bande : elle fixe le taux de victoire nécessaire pour s'y
// MAINTENIR. C'est la traduction honnête du « plafond » — personne n'est
// bloqué, mais plus on monte, plus il faut gagner souvent pour rester.

/**
 * Taux de victoire (0..1) qui rend la bande neutre : en dessous on redescend,
 * au-dessus on monte. Vaut 0 sur la bande du débutant (elle ne coûte rien, donc
 * on ne peut que monter).
 */
export function holdRate(band: TrophyBand): number {
  const total = band.win + band.loss
  return total === 0 ? 0 : band.loss / total
}

/**
 * Où se stabilise un joueur à ce taux de victoire : la borne basse de la
 * dernière bande qu'il peut tenir. Sert à l'équilibrage (les tests vérifient
 * qu'un élève moyen atterrit bien vers 500) plutôt qu'à l'affichage.
 *
 * Comparaison LARGE : un taux exactement égal au `holdRate` rend la bande
 * neutre, donc on s'y maintient — on ne la quitte pas.
 */
export function restingTrophies(winRate: number): number {
  const rate = Math.max(0, Math.min(1, winRate))
  let resting = 0
  for (const band of TROPHY_BANDS) {
    if (rate >= holdRate(band)) resting = band.floor
  }
  return resting
}

// ------------------------------------------------------------- la saison
// Sans remise à zéro périodique, un élève qui a plafonné ses 21 jeux n'a plus
// rien à gagner : la Route devient un musée. Mais un reset complet détruirait
// exactement ce que le système construit — l'identité (« je suis fort en calcul
// mental »). D'où un reset PARTIEL, aligné sur la saison mensuelle qui existe
// déjà (lib/saison), et non sur un second cycle inventé pour l'occasion.

/**
 * Plancher protégé : en dessous, la saison ne reprend RIEN. La grande majorité
 * des élèves ne verra donc jamais de remise à zéro — seuls ceux qui ont poussé
 * un jeu haut redescendent, et c'est précisément à eux qu'il faut rendre de la
 * marge de progression.
 */
export const SEASON_KEEP_FLOOR = 500

/**
 * Le compteur d'un jeu après une bascule de saison. On garde le plancher, plus
 * la MOITIÉ de ce qui le dépasse : 600 → 550, 900 → 700.
 *
 * Volontairement doux. La règle du Défi est de ne pas punir, et l'élève qui
 * redescend n'a rien fait de mal — on lui rend surtout le droit de regagner
 * vite (redescendre de 900 à 700, c'est repasser de +2 à +3 par victoire).
 */
export function seasonReset(trophies: number): number {
  const t = Math.max(0, Math.floor(trophies))
  if (t <= SEASON_KEEP_FLOOR) return t
  return SEASON_KEEP_FLOOR + Math.floor((t - SEASON_KEEP_FLOOR) / 2)
}

// ------------------------------------------------------------- l'agrégation
// Les totaux ne sont JAMAIS stockés : ce sont des sommes. Un total en base
// serait une seconde source de vérité à garder synchronisée, et l'app a déjà
// payé ce prix une fois (les deux échelles concurrentes trophées → palier,
// cf. l'en-tête de `lib/rank.ts`).

export type GameTrophyRow = {
  subject: string
  gameId: string
  trophies: number
}

/** Total d'une matière : la somme de ses jeux. */
export function subjectTotal(rows: readonly GameTrophyRow[], subject: string): number {
  return rows
    .filter((r) => r.subject === subject)
    .reduce((sum, r) => sum + Math.max(0, Math.floor(r.trophies)), 0)
}

/** Les totaux de toutes les matières présentes, matière → total. */
export function subjectTotals(rows: readonly GameTrophyRow[]): Map<string, number> {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const value = Math.max(0, Math.floor(row.trophies))
    totals.set(row.subject, (totals.get(row.subject) ?? 0) + value)
  }
  return totals
}

/** Total global : la somme de tout. */
export function globalTotal(rows: readonly GameTrophyRow[]): number {
  return rows.reduce((sum, r) => sum + Math.max(0, Math.floor(r.trophies)), 0)
}

/**
 * Le jeu le plus RENTABLE à lancer maintenant : celui dont la victoire vaut le
 * plus. À gain égal, le compteur le plus bas gagne (on pousse vers le jeu le
 * moins travaillé) ; à égalité parfaite, l'ordre d'entrée est conservé pour que
 * l'affichage soit stable d'un rendu à l'autre.
 *
 * C'est la ligne de conseil de la Route des trophées. L'élève peut la
 * retrouver seul en lisant les pastilles — on ne fait que lui épargner le
 * balayage des sept matières.
 */
export function mostRewarding(
  rows: readonly GameTrophyRow[],
): GameTrophyRow | null {
  let best: GameTrophyRow | null = null
  let bestWin = -1
  for (const row of rows) {
    const win = trophyBand(row.trophies).win
    if (win > bestWin || (win === bestWin && best !== null && row.trophies < best.trophies)) {
      best = row
      bestWin = win
    }
  }
  return best
}
