// Modes de jeu du Défi — logique pure, sans React ni Supabase.
// Le moteur de duel (manches, fantôme) et le scoring du Blitz vivent ici
// pour être testables ; les composants ne font que de l'affichage.

// ------------------------------------------------------------------ catalogue

// Le décor de l'Arène (hub Défi, écran VS, résultats de duel).
export const ARENA_IMAGE = '/images/arene/arene.webp'

export type GameModeId = 'duel' | 'blitz' | 'chrono' | 'survie' | 'boss'

// Affiches illustrées des tuiles de mode (style cartoon des vignettes
// matières, fond transparent). Ajouter l'id ici dès que l'image est déposée
// dans public/images/defi/modes/<id>.webp — repli sur l'icône filigrane sinon.
const MODE_IMAGE_IDS: GameModeId[] = [
  'duel',
  'blitz',
  'chrono',
  'survie',
  'boss',
]

export function modeImage(id: GameModeId): string | undefined {
  return MODE_IMAGE_IDS.includes(id)
    ? `/images/defi/modes/${id}.webp`
    : undefined
}

export type GameMode = {
  id: GameModeId
  name: string
  tagline: string
  // Niveau requis pour jouer (promesse concrète : « débloqué au niveau X »).
  unlockLevel: number
  // Un mode du catalogue peut être annoncé avant d'être construit.
  implemented: boolean
}

// Tous les modes sont ouverts : on récompense l'envie de jouer, pas l'attente.
export const GAME_MODES: GameMode[] = [
  {
    id: 'duel',
    name: 'Duel',
    tagline: 'Premier à 2 manches gagnées',
    unlockLevel: 1,
    implemented: true,
  },
  {
    id: 'blitz',
    name: 'Blitz 60s',
    tagline: 'Enchaîne les combos avant la fin du chrono',
    unlockLevel: 1,
    implemented: true,
  },
  {
    id: 'chrono',
    name: 'Contre-la-montre',
    tagline: 'Chaque bonne réponse ajoute du temps',
    unlockLevel: 1,
    implemented: true,
  },
  {
    id: 'survie',
    name: 'Survie',
    tagline: 'Une erreur et c’est terminé',
    unlockLevel: 1,
    implemented: true,
  },
  {
    id: 'boss',
    name: 'Boss de la semaine',
    tagline: 'Ton chapitre le plus faible contre-attaque',
    unlockLevel: 1,
    implemented: true,
  },
]

// Bonus d'XP par mode, ajouté côté serveur au barème du défi. Les modes les
// plus exigeants (et les plus utiles : le boss vise ton chapitre faible)
// paient plus — jouer ses priorités doit être le choix le plus rentable.
export const MODE_XP_BONUS: Record<GameModeId, number> = {
  blitz: 10,
  chrono: 10,
  duel: 20,
  survie: 20,
  boss: 60,
}

// ------------------------------------------------------------- mode du jour
// Rotation façon Brawl Stars : chaque jour (clé UTC 'YYYY-MM-DD'), un mode de
// l'Arène est mis en avant et son bonus d'XP est doublé. Cycle déterministe
// sur le numéro de jour : serveur et client voient le même mode, jamais deux
// jours de suite le même, et l'élève peut anticiper le retour de son préféré.

export const FEATURED_XP_MULTIPLIER = 2

export function featuredModeId(dayKey: string): GameModeId {
  const days = Math.floor(Date.parse(`${dayKey}T00:00:00Z`) / 86_400_000)
  const n = GAME_MODES.length
  return GAME_MODES[((days % n) + n) % n].id
}

// Bonus d'XP effectif d'un mode ce jour-là (doublé s'il est mis en avant).
export function modeXpBonus(mode: GameModeId, dayKey: string): number {
  const base = MODE_XP_BONUS[mode]
  return featuredModeId(dayKey) === mode
    ? base * FEATURED_XP_MULTIPLIER
    : base
}

export type ModeStatus = 'playable' | 'locked' | 'soon'

// Verrouillé par le niveau d'abord (la promesse reste affichée), « bientôt »
// ensuite si le mode n'est pas encore construit.
export function modeStatus(mode: GameMode, level: number): ModeStatus {
  if (level < mode.unlockLevel) return 'locked'
  return mode.implemented ? 'playable' : 'soon'
}

// Question de jeu partagée par les modes (le sous-ensemble QCM du Défi).
export type ModeQuestion = {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string | null
  subject: string | null
}

// ------------------------------------------------------------------- duel BO3

export const ROUND_SIZE = 5 // questions par manche
export const ROUNDS_TO_WIN = 2 // premier à 2 manches (BO3)

export type RoundResult = {
  me: number // bonnes réponses dans la manche
  them: number
  myTimeMs: number // départage à la vitesse en cas d'égalité
  theirTimeMs: number
}

export type RoundWinner = 'me' | 'them'

// Une manche a toujours un vainqueur : plus de bonnes réponses, sinon le plus
// rapide. Égalité parfaite (rarissime) : au joueur — l'app est de son côté.
export function roundWinner(r: RoundResult): RoundWinner {
  if (r.me !== r.them) return r.me > r.them ? 'me' : 'them'
  return r.myTimeMs <= r.theirTimeMs ? 'me' : 'them'
}

export function duelScore(rounds: RoundResult[]): { me: number; them: number } {
  let me = 0
  let them = 0
  for (const r of rounds) {
    if (roundWinner(r) === 'me') me++
    else them++
  }
  return { me, them }
}

// Vainqueur du duel, ou null tant qu'aucun camp n'a ROUNDS_TO_WIN manches.
export function duelWinner(rounds: RoundResult[]): RoundWinner | null {
  const s = duelScore(rounds)
  if (s.me >= ROUNDS_TO_WIN) return 'me'
  if (s.them >= ROUNDS_TO_WIN) return 'them'
  return null
}

// ------------------------------------------------------------------- fantôme
// L'adversaire asynchrone : ses manches sont générées de façon DÉTERMINISTE
// à partir d'une clé (id d'adversaire + départ du duel). Rejouer la même clé
// redonne le même duel — testable, et cohérent si le composant re-render.

// FNV-1a 32 bits : hachage stable d'une chaîne vers un entier.
function hashSeed(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// mulberry32 : PRNG rapide et suffisant pour du jeu.
export function seededRng(key: string): () => number {
  let a = hashSeed(key)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type GhostRound = { correct: number; timeMs: number }

// Manche réellement jouée par un ami (table duel_recordings) : son dernier
// duel devient son fantôme.
export type RecordedRound = { correct: number; timeMs: number }

// Manche du fantôme : l'enregistrement RÉEL de l'ami s'il couvre cette manche
// (bornes revalidées — la donnée vient du réseau), sinon la simulation
// déterministe. Le duel reste jouable même face à un enregistrement court.
export function ghostRoundFrom(
  recorded: RecordedRound[] | null,
  key: string,
  roundIndex: number,
  opponentLevel: number,
  myLevel: number,
): GhostRound {
  const r = recorded?.[roundIndex]
  if (r && Number.isFinite(r.correct) && Number.isFinite(r.timeMs)) {
    return {
      correct: Math.max(0, Math.min(Math.round(r.correct), ROUND_SIZE)),
      timeMs: Math.max(1000, Math.min(Math.round(r.timeMs), 600_000)),
    }
  }
  return ghostRound(key, roundIndex, opponentLevel, myLevel)
}

// Score du fantôme pour une manche : précision de base ~60 %, modulée par
// l'écart de niveau (un ami plus fort vise plus juste), bornée pour que le
// duel reste gagnable — et perdable.
export function ghostRound(
  key: string,
  roundIndex: number,
  opponentLevel: number,
  myLevel: number,
): GhostRound {
  const rng = seededRng(`${key}#${roundIndex}`)
  const accuracy = Math.min(
    0.85,
    Math.max(0.35, 0.6 + 0.04 * (opponentLevel - myLevel)),
  )
  let correct = 0
  let timeMs = 0
  for (let i = 0; i < ROUND_SIZE; i++) {
    if (rng() < accuracy) correct++
    timeMs += 4000 + Math.round(rng() * 6000) // 4 à 10 s par question
  }
  return { correct, timeMs }
}

// ------------------------------------------------------------------ blitz 60s

export const BLITZ_SECONDS = 60
export const BLITZ_BASE_POINTS = 100
export const BLITZ_MAX_MULTIPLIER = 4

// Multiplicateur selon la série de bonnes réponses EN COURS (avant la
// réponse) : ×1 puis ×2 à partir de 3 d'affilée, ×3 à 6, ×4 à 9 (plafond).
export function blitzMultiplier(comboBefore: number): number {
  return Math.min(BLITZ_MAX_MULTIPLIER, 1 + Math.floor(comboBefore / 3))
}

export function blitzPoints(comboBefore: number): number {
  return BLITZ_BASE_POINTS * blitzMultiplier(comboBefore)
}

// Meilleur score local (le record à battre — moteur du « encore une »).
export const BLITZ_BEST_STORAGE_KEY = 'scolaria-blitz-best'

// --------------------------------------------------------- contre-la-montre
// On part avec peu de temps ; chaque bonne réponse en rend, chaque erreur en
// coûte. La précision prolonge la partie — l'inverse du Blitz.

export const CHRONO_START_SECONDS = 20
export const CHRONO_GAIN_SECONDS = 5
export const CHRONO_LOSS_SECONDS = 3
export const CHRONO_MAX_SECONDS = 45
export const CHRONO_BEST_STORAGE_KEY = 'scolaria-chrono-best'

export function chronoAfterAnswer(seconds: number, good: boolean): number {
  const next = good
    ? seconds + CHRONO_GAIN_SECONDS
    : seconds - CHRONO_LOSS_SECONDS
  return Math.max(0, Math.min(CHRONO_MAX_SECONDS, next))
}

// ------------------------------------------------------------------- survie
// Mort subite : la série s'arrête à la première erreur. Le score est la
// longueur de la série.

export const SURVIE_BEST_STORAGE_KEY = 'scolaria-survie-best'

// --------------------------------------------------------------------- boss
// Le boss a des points de vie ; chaque bonne réponse le frappe, chaque
// erreur coûte un cœur. Vaincu avant de perdre ses 3 cœurs = victoire.

export const BOSS_HP = 10
export const BOSS_LIVES = 3

export type BossState = { hp: number; lives: number }

export function bossAfterAnswer(state: BossState, good: boolean): BossState {
  return good
    ? { ...state, hp: Math.max(0, state.hp - 1) }
    : { ...state, lives: Math.max(0, state.lives - 1) }
}

export function bossOutcome(state: BossState): 'won' | 'lost' | null {
  if (state.hp === 0) return 'won'
  if (state.lives === 0) return 'lost'
  return null
}

// Horloge du jeu : les durées de manche et les clés de duel sont des données
// d'événement (l'instant où le joueur agit), jamais utilisées pendant le rendu.
export function nowMs(): number {
  return Date.now()
}
