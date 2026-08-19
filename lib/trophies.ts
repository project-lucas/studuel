// CLASSEMENT du Défi — logique pure, sans React ni Supabase : le classement
// des amis, le rival juste devant, ceux qu'on vient de doubler.
//
// CE FICHIER NE FIXE PLUS LE BARÈME. Il portait l'Elo-lite du « match classé »
// (K=40, gains 12→40, filet de perte Bronze) ; ce mode a fusionné dans le
// bouton COMBAT, et les trophées se gagnent désormais par (matière × jeu) sur
// une courbe par bandes — `lib/trophy-road.ts`, migration 238. Les fonctions
// de l'ancien barème ont été SUPPRIMÉES plutôt que laissées en place : ce
// dépôt a déjà payé le prix de deux échelles concurrentes (le bug « Bronze III »
// d'un côté et « Salle d'étude » de l'autre pour le même total), et un barème
// mort que rien n'appelle finit toujours par être rappelé par erreur.
//
// L'échelle d'affichage (palier + division, façon LoL) reste dans `lib/rank.ts`,
// qui traduit le TOTAL — désormais la somme de tous les jeux.

// -------------------------------------------------- adversaire du mode classé
// En solo, le match classé se joue contre un fantôme. Son « niveau » de
// trophées est tiré DE FAÇON DÉTERMINISTE autour de celui du joueur (matchmaking
// équitable : ±120 trophées), à partir d'une graine — même graine, même
// adversaire. Sert à la fois au scoring (trophyDelta) et à la difficulté.

export function matchmakeOpponentTrophies(
  myTrophies: number,
  seed: string,
): number {
  // Hash FNV-1a → offset dans [-120, +120].
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  const offset = ((h >>> 0) % 241) - 120
  return Math.max(0, Math.floor(myTrophies) + offset)
}

// --------------------------------------------------------------- classement
// Le classement live : moi + mes amis, triés par trophées. C'est ce que
// l'élève voit sur le Défi — sa place, et l'écart avec le rival juste devant.

export type RankPlayer = {
  id: string
  name: string
  emoji: string
  trophies: number
  isMe?: boolean
}

export type RankRow = RankPlayer & { rank: number }

// Trie par trophées décroissants et attribue les rangs (1 = premier).
// Départage stable : à trophées égaux, l'ordre d'entrée est conservé, mais
// « moi » passe devant à égalité (l'app est de mon côté).
export function rankPlayers(players: RankPlayer[]): RankRow[] {
  const sorted = [...players].sort((a, b) => {
    if (b.trophies !== a.trophies) return b.trophies - a.trophies
    if (a.isMe) return -1
    if (b.isMe) return 1
    return 0
  })
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }))
}

// Le rival juste devant moi (rang - 1), ou null si je suis premier.
export function rivalAhead(rows: RankRow[]): RankRow | null {
  const meIdx = rows.findIndex((r) => r.isMe)
  if (meIdx <= 0) return null
  return rows[meIdx - 1]
}

// Le poursuivant juste derrière moi, ou null si je suis dernier.
export function rivalBehind(rows: RankRow[]): RankRow | null {
  const meIdx = rows.findIndex((r) => r.isMe)
  if (meIdx === -1 || meIdx >= rows.length - 1) return null
  return rows[meIdx + 1]
}

// Amis DÉPASSÉS par ce match : ceux dont le total est dans ]avant, après].
// C'est la ligne « tu viens de doubler Léa 🎉 » — le petit shot de dopamine
// qui donne envie d'enchaîner. Rendus du plus proche (dernier doublé) au plus
// loin, pour n'annoncer que le plus savoureux si besoin.
export function friendsPassed(
  before: number,
  after: number,
  friends: RankPlayer[],
): RankPlayer[] {
  if (after <= before) return []
  return friends
    .filter((f) => !f.isMe && f.trophies > before && f.trophies <= after)
    .sort((a, b) => b.trophies - a.trophies)
}

// Amis qui m'ont RATTRAPÉ/dépassé après une défaite : total dans ]après, avant].
export function friendsLostTo(
  before: number,
  after: number,
  friends: RankPlayer[],
): RankPlayer[] {
  if (after >= before) return []
  return friends
    .filter((f) => !f.isMe && f.trophies <= before && f.trophies > after)
    .sort((a, b) => a.trophies - b.trophies)
}

// Record personnel de trophées — trophée d'or « meilleur classement atteint ».
export function bestTrophies(current: number, peak: number): number {
  return Math.max(Math.floor(current), Math.floor(peak))
}
