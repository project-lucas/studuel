// Stats du profil — agrégation PURE, prête à l'affichage.
//
// Ce module ne touche pas la base : la Server Action récupère les compteurs
// bruts (parties, victoires, minutes, séries, XP, trophées, parties par
// matière) et les passe ici. On calcule les valeurs dérivées (taux de
// victoire, matière préférée) et on formate ce qui doit l'être, en réutilisant
// `formatDuration` (lib/time) et `rankFor` (lib/rank) pour rester cohérent
// avec le reste de l'app.

import { formatDuration } from './time'
import { rankFor, type Rank } from './rank'

// Les compteurs bruts tels que fournis par le serveur.
export type ProfileStatInputs = {
  /** Défis + duels + matchs joués (toutes issues confondues). */
  gamesPlayed: number
  /** Parties gagnées (duels/classé où le gagnant est déterminé). */
  wins: number
  /** Série quotidienne courante. */
  currentStreak: number
  /** Meilleure série quotidienne atteinte. */
  bestStreak: number
  /** XP total cumulé. */
  totalXp: number
  /** Niveau courant (déjà calculé par lib/xp). */
  level: number
  /** Trophées courants et record. */
  trophies: number
  bestTrophies: number
  /** Minutes de travail cumulées. */
  studyMinutes: number
  /** Parties jouées par matière (matière -> nombre). */
  subjectCounts: Readonly<Record<string, number>>
}

// Taux de victoire dans [0, 1]. 0 quand aucune partie (jamais NaN).
export function winRate(wins: number, gamesPlayed: number): number {
  if (gamesPlayed <= 0) return 0
  return Math.max(0, Math.min(1, wins / gamesPlayed))
}

// Formate un ratio [0,1] en pourcentage entier français : « 73 % ».
export function formatPercent(ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio))
  return `${Math.round(clamped * 100)} %`
}

// La matière la plus jouée, ou null si aucune donnée. Départage déterministe :
// à égalité de parties, ordre alphabétique (stable d'un rendu à l'autre).
export function preferredSubject(
  counts: Readonly<Record<string, number>>,
): string | null {
  let best: string | null = null
  let bestCount = 0
  for (const subject of Object.keys(counts).sort()) {
    const c = counts[subject]
    if (c > bestCount) {
      best = subject
      bestCount = c
    }
  }
  return bestCount > 0 ? best : null
}

// Le résumé prêt à l'affichage : chaque champ « brut » garde sa valeur
// numérique (pour aria/tris) ET sa version formatée quand il y a lieu.
export type ProfileSummary = {
  gamesPlayed: number
  wins: number
  winRatio: number
  winRateLabel: string
  currentStreak: number
  bestStreak: number
  totalXp: number
  level: number
  trophies: number
  bestTrophies: number
  rank: Rank
  studyMinutes: number
  studyTimeLabel: string
  preferredSubject: string | null
}

// Assemble le résumé à partir des compteurs bruts. Pur : mêmes entrées ->
// mêmes sorties, testable sans base ni horloge.
export function buildProfileSummary(input: ProfileStatInputs): ProfileSummary {
  const ratio = winRate(input.wins, input.gamesPlayed)
  return {
    gamesPlayed: input.gamesPlayed,
    wins: input.wins,
    winRatio: ratio,
    winRateLabel: formatPercent(ratio),
    currentStreak: input.currentStreak,
    bestStreak: Math.max(input.currentStreak, input.bestStreak),
    totalXp: input.totalXp,
    level: input.level,
    trophies: input.trophies,
    bestTrophies: Math.max(input.trophies, input.bestTrophies),
    rank: rankFor(input.trophies),
    studyMinutes: input.studyMinutes,
    studyTimeLabel: formatDuration(input.studyMinutes),
    preferredSubject: preferredSubject(input.subjectCounts),
  }
}
