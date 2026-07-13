// Trophées & classement compétitif du Défi — logique pure, sans React ni
// Supabase. C'est le cœur de la rétention « façon Clash Royale » : chaque match
// classé fait bouger un compteur de trophées, qui situe l'élève dans une
// ARÈNE scolaire et, surtout, face à ses amis. Tout est testable ici ; les
// composants et le serveur ne font qu'orchestrer.

// ------------------------------------------------------------------- arènes
// Paliers de trophées, thème « ascension scolaire ». On monte d'arène en
// gagnant des matchs — le nom devient un flex (« je suis Major de promo »).
// L'ordre est croissant ; `min` est le seuil d'entrée (le premier est à 0).

export type Arena = {
  id: string
  name: string
  emoji: string
  min: number
  // Teinte de la tuile (token .tile-* réutilisé de l'Arène), pour le badge.
  tile: string
}

export const ARENAS: Arena[] = [
  { id: 'recre', name: 'Cour de récré', emoji: '🎒', min: 0, tile: 'tile-subject-green' },
  { id: 'etude', name: "Salle d'étude", emoji: '📚', min: 300, tile: 'tile-subject-teal' },
  { id: 'honneur', name: "Tableau d'honneur", emoji: '⭐', min: 700, tile: 'tile-subject-blue' },
  { id: 'conseil', name: 'Conseil de classe', emoji: '🎓', min: 1200, tile: 'tile-subject-indigo' },
  { id: 'brevet', name: 'Brevet en poche', emoji: '📜', min: 1800, tile: 'tile-subject-purple' },
  { id: 'bac', name: 'Bac blanc', emoji: '✍️', min: 2500, tile: 'tile-survie' },
  { id: 'mention', name: 'Mention Très Bien', emoji: '🏅', min: 3300, tile: 'tile-blitz' },
  { id: 'major', name: 'Major de promo', emoji: '👑', min: 4200, tile: 'tile-boss' },
]

// L'arène courante pour un total de trophées donné (le plus haut seuil atteint).
export function arenaFor(trophies: number): Arena {
  const t = Math.max(0, Math.floor(trophies))
  let current = ARENAS[0]
  for (const a of ARENAS) {
    if (t >= a.min) current = a
    else break
  }
  return current
}

export type ArenaProgress = {
  arena: Arena
  next: Arena | null // null si arène max
  // Progression 0..1 dans l'arène courante (1 si arène max).
  progress: number
  // Trophées restants avant la prochaine arène (0 si arène max).
  toNext: number
  // Bornes de l'arène courante, pratiques pour l'affichage.
  floor: number
  ceiling: number | null
}

export function arenaProgress(trophies: number): ArenaProgress {
  const t = Math.max(0, Math.floor(trophies))
  const arena = arenaFor(t)
  const idx = ARENAS.findIndex((a) => a.id === arena.id)
  const next = ARENAS[idx + 1] ?? null
  if (!next) {
    return { arena, next: null, progress: 1, toNext: 0, floor: arena.min, ceiling: null }
  }
  const span = next.min - arena.min
  const progress = span > 0 ? Math.min(1, Math.max(0, (t - arena.min) / span)) : 0
  return {
    arena,
    next,
    progress,
    toNext: Math.max(0, next.min - t),
    floor: arena.min,
    ceiling: next.min,
  }
}

// -------------------------------------------------------------- gain / perte
// Barème Elo-lite : battre plus fort que soi rapporte gros, perdre contre plus
// faible coûte cher, et l'inverse est amorti. Les pertes sont volontairement
// plus douces que les gains (K asymétrique) — on récompense l'envie de jouer,
// on ne punit pas l'échec au point de faire fuir un collégien.

export const TROPHY_K = 40
export const WIN_MIN = 12 // on gagne toujours au moins ça
export const WIN_MAX = 40
export const LOSS_MIN = 6 // on perd au moins ça…
export const LOSS_MAX = 30 // …et jamais plus que ça

function expectedScore(myTrophies: number, oppTrophies: number): number {
  return 1 / (1 + Math.pow(10, (oppTrophies - myTrophies) / 400))
}

// Variation de trophées d'un match classé. `won` = victoire du joueur.
// Renvoie un entier signé : positif si victoire, négatif si défaite.
export function trophyDelta(
  won: boolean,
  myTrophies: number,
  oppTrophies: number,
): number {
  const expected = expectedScore(myTrophies, oppTrophies)
  const raw = TROPHY_K * ((won ? 1 : 0) - expected)
  if (won) {
    return Math.max(WIN_MIN, Math.min(WIN_MAX, Math.round(raw)))
  }
  return Math.min(-LOSS_MIN, Math.max(-LOSS_MAX, Math.round(raw)))
}

// Applique une variation, borné à 0 (on ne descend jamais sous zéro trophée).
export function applyTrophyDelta(current: number, delta: number): number {
  return Math.max(0, Math.floor(current) + Math.round(delta))
}

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
