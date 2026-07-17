// Les boss du Défi — un personnage par famille de matières, façon Brawl Stars.
// Logique pure (catalogue, matching, rangs) ; la persistance des victoires
// vit en localStorage, comme les records des autres modes.

import type { ModeQuestion } from '@/lib/defi-modes'

export type Boss = {
  id: string
  name: string
  epithet: string // « le Golem du Calcul » — affiché sous le nom
  emoji: string
  intro: string // punchline à l'entrée de l'arène
  defeat: string // ce qu'il dit quand l'élève le bat
  victory: string // ce qu'il dit quand il gagne
}

type BossEntry = Boss & { match: RegExp }

// L'ordre compte : « Sciences économiques et sociales » et « Enseignement
// scientifique » contiennent tous deux « scient » — les matchs les plus
// spécifiques passent d'abord, « scient » sert de filet en fin de liste.
const CATALOG: BossEntry[] = [
  {
    id: 'delta',
    name: 'Delta',
    epithet: 'le Golem du Calcul',
    emoji: '🗿',
    intro: 'Tes probabilités de victoire ? Proches de zéro.',
    defeat: 'Impossible… mes calculs étaient parfaits !',
    victory: 'CQFD. Reviens quand tu sauras compter.',
    match: /math/,
  },
  {
    id: 'grammatork',
    name: 'Grammatork',
    epithet: "l'Ogre des Accords",
    emoji: '👹',
    intro: 'Un participe mal accordé et je te dévore.',
    defeat: 'Incroyable… pas une seule faute…',
    victory: 'Dévoré. Comme prévu, sans accord.',
    match: /franc/,
  },
  {
    id: 'imperator',
    name: 'Imperator',
    epithet: "l'Aigle de Rome",
    emoji: '🦅',
    intro: 'Ave. Ceux qui vont réviser te saluent.',
    defeat: 'Tu quoque… tu m’as vaincu.',
    victory: 'Veni, vidi, vici.',
    match: /latin/,
  },
  {
    id: 'chronos',
    name: 'Chronos',
    epithet: 'le Gardien des Siècles',
    emoji: '⏳',
    intro: 'Je t’attends depuis 1515.',
    defeat: 'Mon heure est venue…',
    victory: 'Bienvenue dans l’Histoire… des vaincus.',
    match: /hist|geo|gsp/,
  },
  {
    id: 'bigben',
    name: 'Big Ben',
    epithet: 'le Dragon d’Albion',
    emoji: '🐉',
    intro: 'You shall not pass… ton contrôle.',
    defeat: 'Well played, mate…',
    victory: 'Game over. Try again, rookie.',
    match: /angl/,
  },
  {
    id: 'eltoro',
    name: 'El Toro',
    epithet: 'le Taureau de l’Arène',
    emoji: '🐂',
    intro: '¿Listo? Cette arène est à moi.',
    defeat: 'Olé… tu m’as eu.',
    victory: '¡Adiós! Reviens réviser tes conjugaisons.',
    match: /espa/,
  },
  {
    id: 'plasma',
    name: 'Dr Plasma',
    epithet: 'le Savant Instable',
    emoji: '⚡',
    intro: 'Tu vas fondre avant moi.',
    defeat: 'Mes atomes… se dispersent !',
    victory: 'Réaction terminée : tu t’es fait oxyder.',
    match: /phys|chim/,
  },
  {
    id: 'mitochondrix',
    name: 'Mitochondrix',
    epithet: 'la Créature des Profondeurs',
    emoji: '🦠',
    intro: 'Je suis la centrale énergétique de ce donjon.',
    defeat: 'Mes mitochondries… s’éteignent…',
    victory: 'La sélection naturelle a parlé.',
    match: /svt|vie|terre|biol/,
  },
  {
    id: 'bugzilla',
    name: 'Bugzilla',
    epithet: 'le Monstre du Code',
    emoji: '🐛',
    intro: 'Erreur ligne 1 : toi.',
    defeat: 'Segmentation fault… core dumped…',
    victory: 'Il te reste des bugs à corriger.',
    match: /nsi|info|numer/,
  },
  {
    id: 'mecatron',
    name: 'Mécatron',
    epithet: 'la Machine Impitoyable',
    emoji: '🤖',
    intro: 'Analyse terminée : adversaire obsolète.',
    defeat: 'Erreur… système… corrompu…',
    victory: 'Mise à jour requise. Reviens patché.',
    match: /techno/,
  },
  {
    id: 'krach',
    name: 'Krach',
    epithet: 'le Loup des Marchés',
    emoji: '🐺',
    intro: 'Tes actions sont en chute libre.',
    defeat: 'Mon empire… fait faillite !',
    victory: 'Liquidé. L’offre a dépassé la demande.',
    match: /econom|social|\bses\b/,
  },
  {
    id: 'sphinx',
    name: 'Le Sphinx',
    epithet: 'le Poseur d’Énigmes',
    emoji: '🦁',
    intro: 'Réponds, ou doute à jamais.',
    defeat: 'Enfin… quelqu’un qui pense.',
    victory: 'Tu connais désormais l’étendue de ton ignorance.',
    match: /philo/,
  },
  {
    id: 'nova',
    name: 'Nova',
    epithet: 'la Supernova Savante',
    emoji: '🌌',
    intro: 'Je brille depuis le Big Bang. Et toi ?',
    defeat: 'Mon éclat… faiblit…',
    victory: 'Retourne graviter autour de tes leçons.',
    match: /scient/,
  },
]

// Filet de sécurité : matière inconnue ou pool sans matière.
export const FALLBACK_BOSS: Boss = {
  id: 'nox',
  name: 'Nox',
  epithet: "l'Ombre du Bulletin",
  emoji: '🌑',
  intro: 'Toutes les matières m’appartiennent.',
  defeat: 'La lumière… non !',
  victory: 'Retourne réviser, petit mortel.',
}

// Tous les boss (catalogue + Nox), sans leur regexp de matching — pour la
// rotation hebdomadaire et les catalogues dérivés (trophées du Trésor).
// ⚠️ L'ORDRE et les ids sont dupliqués dans supabase/165 (claim_weekly_trophy
// recalcule le trophée de la semaine en SQL) : tout changement ici exige une
// nouvelle migration miroir.
const stripMatch = ({ match, ...boss }: BossEntry): Boss => {
  void match
  return boss
}

export const ALL_BOSSES: Boss[] = [...CATALOG.map(stripMatch), FALLBACK_BOSS]

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export function bossForSubject(subject: string | null): Boss {
  if (!subject) return FALLBACK_BOSS
  const n = normalize(subject)
  return CATALOG.find((b) => b.match.test(n)) ?? FALLBACK_BOSS
}

// Le pool du boss est classé chapitre fragile en tête mais mélange plusieurs
// matières : le boss incarne la matière la plus représentée (= la priorité).
export function dominantSubject(pool: ModeQuestion[]): string | null {
  const counts = new Map<string, number>()
  let best: string | null = null
  let bestCount = 0
  for (const q of pool) {
    if (!q.subject) continue
    const c = (counts.get(q.subject) ?? 0) + 1
    counts.set(q.subject, c)
    if (c > bestCount) {
      best = q.subject
      bestCount = c
    }
  }
  return best
}

// ------------------------------------------------------------------- rangs
// Chaque victoire fait monter le boss d'un rang (jusqu'à III) : plus de PV,
// moins de cœurs pour toi. Le rang est un trophée — le battre au rang III,
// c'est le vrai flex.

export type BossRank = 1 | 2 | 3
export const MAX_BOSS_RANK: BossRank = 3

export const RANK_STATS: Record<BossRank, { hp: number; lives: number }> = {
  1: { hp: 10, lives: 3 },
  2: { hp: 14, lives: 3 },
  3: { hp: 18, lives: 2 },
}

export const RANK_LABELS: Record<BossRank, string> = {
  1: 'Rang I',
  2: 'Rang II',
  3: 'Rang III',
}

export function rankFromVictories(victories: number): BossRank {
  return Math.min(1 + Math.max(0, victories), MAX_BOSS_RANK) as BossRank
}

const VICTORIES_STORAGE_KEY = 'scolaria-boss-victories'

function readVictories(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(VICTORIES_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, number>)
      : {}
  } catch {
    return {}
  }
}

export function bossVictories(bossId: string): number {
  const v = readVictories()[bossId]
  return typeof v === 'number' && v > 0 ? Math.floor(v) : 0
}

export function currentBossRank(bossId: string): BossRank {
  return rankFromVictories(bossVictories(bossId))
}

// -------------------------------------------------------- boss de la semaine
// Événement hebdomadaire : chaque semaine (lundi UTC), un boss du catalogue
// devient le « boss de la semaine » — plus coriace que le rang III, toutes
// matières confondues, avec un trophée de collection exclusif à la clé.
// Rotation déterministe sur le numéro de semaine : tout le monde affronte le
// même boss, il change lundi. Parfait pour s'entraîner le week-end avant
// qu'il ne disparaisse.

export const WEEKLY_BOSS_STATS = { hp: 22, lives: 2 }
export const WEEKLY_TROPHY_COINS = 80 // pièces versées avec le trophée

// Lundi (clé UTC 'YYYY-MM-DD') de la semaine du jour donné.
export function mondayKeyOf(dayKey: string): string {
  const d = new Date(`${dayKey}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

// Le boss de la semaine pour un jour donné.
export function weeklyBoss(dayKey: string): Boss {
  const days = Math.floor(Date.parse(`${dayKey}T00:00:00Z`) / 86_400_000)
  // 1970-01-01 était un jeudi : +3 aligne les semaines sur le lundi.
  const week = Math.floor((days + 3) / 7)
  const n = ALL_BOSSES.length
  return ALL_BOSSES[((week % n) + n) % n]
}

// Id de la carte de collection exclusive du boss (catalogue lib/tresor.ts).
export function weeklyTrophyId(bossId: string): string {
  return `trophee-${bossId}`
}

// Victoire de la semaine : mémorisée en localStorage (clé = lundi) pour
// l'affichage « déjà vaincu » — le trophée, lui, vit dans collection_unlocks.
const WEEKLY_WIN_STORAGE_KEY = 'scolaria-weekly-boss-win'

export function weeklyBossBeaten(dayKey: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return (
      window.localStorage.getItem(WEEKLY_WIN_STORAGE_KEY) ===
      mondayKeyOf(dayKey)
    )
  } catch {
    return false
  }
}

export function recordWeeklyBossWin(dayKey: string): void {
  try {
    window.localStorage.setItem(WEEKLY_WIN_STORAGE_KEY, mondayKeyOf(dayKey))
  } catch {
    // stockage bloqué : l'écran « déjà vaincu » repartira du serveur
  }
}

// Enregistre la victoire et renvoie le nouveau rang du boss.
export function recordBossVictory(bossId: string): BossRank {
  const all = readVictories()
  all[bossId] = (typeof all[bossId] === 'number' ? all[bossId] : 0) + 1
  try {
    window.localStorage.setItem(VICTORIES_STORAGE_KEY, JSON.stringify(all))
  } catch {
    // stockage plein ou bloqué : le rang repartira de l'existant, sans casser le jeu
  }
  return rankFromVictories(all[bossId])
}
