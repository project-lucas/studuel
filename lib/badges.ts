// Badges (hauts-faits) — logique pure d'évaluation et d'équipement.
//
// Le CATALOGUE des badges vit en base (table `badges`, seedée par les
// migrations 010/014/015) : chaque badge porte une `condition` JSONB évaluée
// « côté application » — c'est CE module qui l'évalue. Rien n'attribuait les
// badges jusqu'ici ; `earnedBadgeSlugs` calcule, à partir des stats réelles de
// l'élève, l'ensemble des badges mérités. Le serveur reste seul juge de
// l'écriture (RPC), le client ne fait qu'afficher.
//
// L'élève met en avant jusqu'à MAX_EQUIPPED badges sur sa carte de profil
// (façon Clash Royale) ; `normalizeEquipped` borne et nettoie ce choix.

// Nombre de badges mis en avant sur la carte de profil.
export const MAX_EQUIPPED = 3

// Les types de conditions présents dans les seeds. Chaque variante ne lit que
// les champs dont elle a besoin dans `BadgeStats`.
export type BadgeCondition =
  | { type: 'streak'; days: number }
  | { type: 'commute_streak'; days: number }
  | { type: 'habit_anchored'; days: number }
  | { type: 'habits_count'; count: number }
  | { type: 'quiz_count'; count: number }
  | { type: 'commute_quizzes'; count: number }
  | { type: 'study_minutes'; minutes: number }
  | { type: 'perfect_quiz' }

// L'instantané des stats de l'élève contre lequel on évalue les conditions.
// Tous les compteurs sont des cumuls « au meilleur » (le record, pas la valeur
// courante) là où c'est un jalon : une fois atteint, le badge reste acquis.
export type BadgeStats = {
  /** Meilleure série quotidienne atteinte (records, pas la série courante). */
  bestStreak: number
  /** Meilleure série de trajets studieux d'affilée. */
  bestCommuteStreak: number
  /** Jours consécutifs de l'habitude la plus tenue. */
  bestHabitStreak: number
  /** Nombre d'habitudes créées. */
  habitsCount: number
  /** Quiz/défis terminés, toutes matières confondues. */
  quizCount: number
  /** Sessions jouées pendant un trajet. */
  commuteQuizzes: number
  /** Minutes de travail cumulées sur l'app. */
  studyMinutes: number
  /** L'élève a déjà réussi au moins un quiz à 100 %. */
  hasPerfectQuiz: boolean
}

// Un badge tel que lu en base (le catalogue), condition déjà typée.
export type Badge = {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  condition: BadgeCondition
}

// Un badge côté UI : le badge + s'il est acquis + sa date de déblocage.
export type BadgeState = Badge & {
  earned: boolean
  unlockedAt: string | null
}

// Vrai si la condition est satisfaite par les stats. Une seule source de
// vérité pour « ce badge est-il mérité ? », côté serveur comme côté client.
export function isBadgeEarned(
  condition: BadgeCondition,
  stats: BadgeStats,
): boolean {
  switch (condition.type) {
    case 'streak':
      return stats.bestStreak >= condition.days
    case 'commute_streak':
      return stats.bestCommuteStreak >= condition.days
    case 'habit_anchored':
      return stats.bestHabitStreak >= condition.days
    case 'habits_count':
      return stats.habitsCount >= condition.count
    case 'quiz_count':
      return stats.quizCount >= condition.count
    case 'commute_quizzes':
      return stats.commuteQuizzes >= condition.count
    case 'study_minutes':
      return stats.studyMinutes >= condition.minutes
    case 'perfect_quiz':
      return stats.hasPerfectQuiz
    default:
      // Type inconnu (catalogue plus récent que le code) : jamais mérité,
      // plutôt que d'attribuer un badge par erreur.
      return false
  }
}

// Les slugs des badges mérités d'après les stats — l'ensemble que le serveur
// doit garantir dans `user_badges`. Ordre stable : celui du catalogue reçu.
export function earnedBadgeSlugs(
  badges: readonly Badge[],
  stats: BadgeStats,
): string[] {
  return badges
    .filter((b) => isBadgeEarned(b.condition, stats))
    .map((b) => b.slug)
}

// Parse une condition JSONB brute (base) en `BadgeCondition` typée, ou null si
// elle est malformée / d'un type inconnu. Ne jette jamais : une ligne de
// catalogue corrompue ne doit pas faire tomber tout le profil.
export function parseCondition(raw: unknown): BadgeCondition | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  const type = r.type
  const num = (v: unknown): number | null =>
    typeof v === 'number' && Number.isFinite(v) ? v : null

  switch (type) {
    case 'streak':
    case 'commute_streak':
    case 'habit_anchored': {
      const days = num(r.days)
      return days === null ? null : { type, days }
    }
    case 'habits_count':
    case 'quiz_count':
    case 'commute_quizzes': {
      const count = num(r.count)
      return count === null ? null : { type, count }
    }
    case 'study_minutes': {
      const minutes = num(r.minutes)
      return minutes === null ? null : { type, minutes }
    }
    case 'perfect_quiz':
      return { type: 'perfect_quiz' }
    default:
      return null
  }
}

// Nettoie le choix de badges équipés : garde l'ordre, retire les doublons,
// exclut tout badge non acquis, et borne à MAX_EQUIPPED. Utilisé côté client
// (rendu) ET repris par la validation serveur.
export function normalizeEquipped(
  requested: readonly string[],
  earnedIds: ReadonlySet<string>,
): string[] {
  const out: string[] = []
  for (const id of requested) {
    if (out.length >= MAX_EQUIPPED) break
    if (!earnedIds.has(id)) continue
    if (out.includes(id)) continue
    out.push(id)
  }
  return out
}

// Les badges à afficher sur la carte compacte : les équipés dans l'ordre
// choisi, complétés par les badges acquis les plus « rares » si l'élève n'en a
// pas encore équipé 3 (pour que la carte ne soit jamais vide quand il a gagné
// des badges). `order` donne l'ordre du catalogue (déjà trié par la base).
export function cardBadges(
  states: readonly BadgeState[],
  equippedIds: readonly string[],
): BadgeState[] {
  const byId = new Map(states.map((s) => [s.id, s]))
  const chosen: BadgeState[] = []
  const used = new Set<string>()

  for (const id of equippedIds) {
    const s = byId.get(id)
    if (s && s.earned && !used.has(id)) {
      chosen.push(s)
      used.add(id)
    }
    if (chosen.length >= MAX_EQUIPPED) return chosen
  }

  // Complète avec les badges acquis restants, dans l'ordre du catalogue.
  for (const s of states) {
    if (chosen.length >= MAX_EQUIPPED) break
    if (s.earned && !used.has(s.id)) {
      chosen.push(s)
      used.add(s.id)
    }
  }
  return chosen
}
