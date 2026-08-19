// L'APPARIEMENT DU DUEL CLASSÉ — logique pure, sans React ni Supabase.
//
// On n'apparie pas sur un niveau général mais sur le COUPLE (matière, trophées).
// C'est la conséquence directe du cloisonnement : un élève Diamant en maths et
// Bronze en histoire ne doit pas se voir servir un adversaire « de son niveau »
// calculé sur une moyenne — il gagnerait tout en maths et perdrait tout en
// histoire, et les deux matchs seraient également inintéressants.
//
// L'ADVERSAIRE EST UN FANTÔME, pas un joueur en direct. La partie rejoue le
// meilleur score enregistré de quelqu'un sur cette matière (`game_matches`),
// exactement comme le fantôme des jeux de salon (`lib/jeux/ghost-server`). Deux
// raisons, et aucune n'est la paresse :
//
//   · un duel en direct exige que DEUX élèves soient en ligne sur LA MÊME
//     matière dans LA MÊME tranche de trophées. À l'échelle d'une classe, la
//     file d'attente serait vide presque tout le temps, et l'écran passerait
//     son temps à s'excuser ;
//   · un score enregistré appartient à quelqu'un de réel. C'est ce qui manquait
//     aux dix robots scriptés du mode classé supprimé : on repérait vite qu'ils
//     étaient scriptés, et la ladder devenait une machine à sous.
//
// Quand personne n'est dans la fourchette, on ÉLARGIT plutôt que de refuser la
// partie. Et si le vivier reste vide, on fabrique un adversaire calibré — mais
// on le DIT (`isBot`), et l'écran l'affiche comme tel.

/** Fourchette d'appariement initiale, en trophées. */
export const MATCH_RANGE = 150

/**
 * Les élargissements successifs, en trophées. La fourchette double à chaque
 * échec puis s'ouvre entièrement.
 *
 * Écrit en toutes lettres plutôt que calculé (`range × 2^n`) : c'est une table
 * de réglage, faite pour être retouchée quand on saura combien d'élèves
 * peuplent réellement une matière. Le dernier palier (`null`) veut dire « tout
 * le monde » — mieux vaut un adversaire mal apparié qu'un écran vide, à
 * condition que ce soit le DERNIER recours.
 */
export const MATCH_WIDENING: readonly (number | null)[] = [150, 300, 600, null]

/** Un adversaire candidat, réduit à ce dont l'appariement a besoin. */
export type MatchCandidate = {
  userId: string
  /** Prénom seul — c'est déjà la règle de tout le social de l'app. */
  name: string
  /** Son compteur sur CETTE matière. */
  trophies: number
  /** Le score qu'il a posé, que l'élève devra battre. */
  score: number
}

export type MatchOpponent = MatchCandidate & {
  /** Fourchette dans laquelle il a été trouvé (null = appariement ouvert). */
  range: number | null
  /** Vrai quand aucun élève réel n'était disponible. */
  isBot: boolean
}

/**
 * Les candidats à portée dans une fourchette donnée. `null` veut dire « aucune
 * limite ».
 */
export function withinRange(
  candidates: readonly MatchCandidate[],
  trophies: number,
  range: number | null,
): MatchCandidate[] {
  if (range === null) return [...candidates]
  return candidates.filter((c) => Math.abs(c.trophies - trophies) <= range)
}

/**
 * L'adversaire d'un match classé. On monte les paliers d'élargissement un par
 * un et on s'arrête au PREMIER qui donne du monde : la fourchette la plus
 * serrée gagne toujours, l'élargissement n'est jamais un raccourci.
 *
 * À l'intérieur d'un palier, on retient le candidat le plus PROCHE en trophées
 * (et non le meilleur score) : c'est l'écart de niveau qui rend un duel
 * intéressant, pas la performance brute de l'adversaire.
 */
export function pickOpponent(
  candidates: readonly MatchCandidate[],
  trophies: number,
  fallback?: (trophies: number) => MatchCandidate,
): MatchOpponent | null {
  for (const range of MATCH_WIDENING) {
    const portee = withinRange(candidates, trophies, range)
    if (portee.length === 0) continue

    const best = portee.reduce((closest, c) => {
      const dc = Math.abs(c.trophies - trophies)
      const db = Math.abs(closest.trophies - trophies)
      // Départage par identifiant : deux adversaires à écart égal doivent
      // toujours sortir dans le même ordre d'un rendu à l'autre.
      if (dc !== db) return dc < db ? c : closest
      return c.userId < closest.userId ? c : closest
    })

    return { ...best, range, isBot: false }
  }

  if (!fallback) return null
  return { ...fallback(trophies), range: null, isBot: true }
}

/**
 * L'adversaire de repli : un score calibré sur le compteur de l'élève.
 *
 * Le score visé suit `BOT_HIT_RATE` du total : assez pour que la victoire se
 * mérite, assez peu pour qu'un débutant ne se fasse pas balayer à sa première
 * partie. La règle du Défi reste de ne pas punir.
 *
 * Le nom est neutre et ASSUMÉ comme tel (« L'entraîneur ») : on n'invente pas
 * un pseudo d'élève pour un adversaire qui n'existe pas — c'était l'erreur des
 * dix robots du mode classé supprimé.
 */
export const BOT_HIT_RATE = 0.6
export const BOT_NAME = 'L’entraîneur'

export function calibratedBot(questionCount: number) {
  return (trophies: number): MatchCandidate => ({
    userId: 'bot',
    name: BOT_NAME,
    trophies: Math.max(0, Math.floor(trophies)),
    score: Math.max(1, Math.round(questionCount * BOT_HIT_RATE)),
  })
}

/**
 * La phrase affichée sous le nom de l'adversaire. Elle nomme honnêtement ce
 * qu'on a trouvé : un vrai élève apparié serré, un vrai élève trouvé au large,
 * ou l'entraîneur.
 */
export function opponentCaption(opponent: MatchOpponent): string {
  if (opponent.isBot) return 'Aucun adversaire trouvé — entraînement calibré'
  if (opponent.range === null) return `${opponent.trophies} trophées · hors fourchette`
  if (opponent.range > MATCH_RANGE) {
    return `${opponent.trophies} trophées · fourchette élargie`
  }
  return `${opponent.trophies} trophées · à ta portée`
}
