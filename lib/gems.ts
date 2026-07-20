// Les gemmes 💎 — la seconde monnaie de Studuel, celle du CONTENU.
//
// Deux monnaies, deux rôles, aucun recouvrement :
//   • les pièces 🪙 (lib/tresor) achètent du COSMÉTIQUE (fonds, skins, boosts) ;
//   • les gemmes 💎 (ici) déverrouillent les SUPPORTS ÉCRITS d'un chapitre —
//     sa carte mentale et les fiches de révision de ses leçons — à vie.
//
// Ce que la gemme n'ouvre PAS, volontairement : les quiz et flashcards premium.
// Ils restent la contrepartie de l'abonnement, et ils sont gatés au niveau RLS
// (`quiz_questions_select_gated`). Les ouvrir à une monnaie qui se gagne
// gratuitement en invitant des amis reviendrait à distribuer Studuel+ — la
// gemme doit faire goûter au contenu, pas s'y substituer.
//
// Elles remplacent les anciens « crédits de cartes mentales » du Coffre, qui
// s'achetaient en pièces : mélanger les deux économies revenait à laisser le
// grind cosmétique acheter du contenu payant, ce qui vidait l'offre Studuel+ de
// sa contrepartie. Les gemmes ne s'achètent PAS avec des pièces — elles se
// gagnent, essentiellement en faisant venir des amis.
//
// Logique PURE et testable. La base (migration 183) ne stocke que des compteurs
// et des ids ; toutes les règles de prix et de plafond vivent ici.

import type { Tier } from '@/lib/subscription'

// --------------------------------------------------------------- les montants

/** Gemmes offertes à la création du compte : de quoi goûter 3 chapitres. */
export const STARTING_GEMS = 3

/** Coût du déverrouillage d'un chapitre — tous supports compris, à vie. */
export const GEM_COST_CHAPTER = 1

/** Gemmes versées au parrain ET au filleul quand le parrainage s'active. */
export const REFERRAL_GEM_REWARD = 1

// Plafond de gemmes gagnables par parrainage. Ce n'est pas une punition : sans
// borne, un élève motivé (ou un script) débloque le catalogue entier et l'offre
// payante ne vaut plus rien. 20 filleuls activés = 20 chapitres offerts, c'est
// déjà énorme, et c'est bien au-delà de ce qu'un élève atteint réellement.
export const REFERRAL_GEM_CAP = 20

/** Taille maximale du groupe privé (« squad »). */
export const MAX_SQUAD_SIZE = 10

/**
 * Cookie qui transporte le code du parrain du lien d'invitation (/parrain/CODE)
 * jusqu'à la création du compte. Il vit ICI et non dans le route handler :
 * Next.js valide les exports d'un `route.ts` et n'y tolère que les méthodes
 * HTTP et ses options de configuration.
 */
export const REFERRAL_COOKIE = 'studuel_parrain'

// ------------------------------------------------------------------- l'accès

/**
 * Pourquoi un chapitre est ouvert (ou non).
 *   'premium'  — l'abonnement ouvre tout, aucune gemme n'est consommée ;
 *   'unlocked' — déverrouillé une fois pour toutes avec une gemme ;
 *   'locked'   — encore fermé.
 */
export type ChapterAccess = 'premium' | 'unlocked' | 'locked'

// SOURCE UNIQUE de la liste des paliers payants, côté TypeScript.
//
// Elle vit ICI et non dans lib/subscription.ts, alors que ce serait le foyer
// naturel : `lib/subscription.ts` importe le client Supabase SERVEUR, et ce
// module-ci est consommé par des composants client (ParrainageCard,
// SquadSection, UnlockChapterCard). Réexporter depuis subscription y
// entraînerait tout le code serveur dans le bundle navigateur. La dépendance
// va donc dans l'autre sens : subscription importe d'ici.
//
// Restent deux miroirs SQL assumés et documentés comme tels (les fonctions de
// la migration 183). Toute évolution doit les toucher aussi.
export const PREMIUM_TIERS: readonly Tier[] = ['tier1', 'tier2', 'tier3']

export function isPremiumTier(tier: Tier): boolean {
  return PREMIUM_TIERS.includes(tier)
}

/**
 * Statut d'accès d'un chapitre. L'abonnement PRIME toujours : un abonné ne
 * dépense jamais de gemme, et s'il se désabonne il retrouve ses chapitres
 * déverrouillés — ceux-là lui appartiennent.
 */
export function chapterAccess(
  tier: Tier,
  chapterId: string,
  unlockedChapterIds: Iterable<string>,
): ChapterAccess {
  if (isPremiumTier(tier)) return 'premium'
  const unlocked =
    unlockedChapterIds instanceof Set
      ? unlockedChapterIds
      : new Set(unlockedChapterIds)
  return unlocked.has(chapterId) ? 'unlocked' : 'locked'
}

/** Raccourci : le contenu payant du chapitre est-il lisible ? */
export function canOpenChapter(
  tier: Tier,
  chapterId: string,
  unlockedChapterIds: Iterable<string>,
): boolean {
  return chapterAccess(tier, chapterId, unlockedChapterIds) !== 'locked'
}

// ------------------------------------------------------- la dépense de gemme

/**
 * Ce que donne une tentative de déverrouillage. Miroir exact des valeurs
 * renvoyées par la RPC `unlock_chapter_with_gem` (migration 183) : toute
 * évolution doit toucher LES DEUX, sinon l'UI affiche un message à côté.
 */
export type UnlockResult =
  | 'unlocked' // gemme dépensée, chapitre ouvert
  | 'already' // déjà ouvert, rien n'a été débité
  | 'premium' // abonné : tout est déjà ouvert, rien n'a été débité
  | 'no_gems' // solde insuffisant
  | 'not_found' // chapitre inexistant
  | 'error' // panne technique

/**
 * Peut-on tenter la dépense ? Court-circuite l'appel réseau quand la réponse
 * est connue d'avance (déjà ouvert, abonné, solde vide).
 */
export function canSpendGem(
  tier: Tier,
  gems: number,
  chapterId: string,
  unlockedChapterIds: Iterable<string>,
): boolean {
  if (chapterAccess(tier, chapterId, unlockedChapterIds) !== 'locked') {
    return false
  }
  return gems >= GEM_COST_CHAPTER
}

/** Solde après une dépense réussie (jamais négatif). */
export function gemsAfterSpend(gems: number): number {
  return Math.max(0, Math.floor(gems) - GEM_COST_CHAPTER)
}

const UNLOCK_MESSAGES: Record<UnlockResult, string> = {
  unlocked: 'Chapitre débloqué ! Tous ses supports sont à toi, pour toujours.',
  already: 'Tu as déjà débloqué ce chapitre.',
  premium: 'Ton abonnement t’ouvre déjà tous les chapitres.',
  no_gems: 'Il te faut une gemme. Invite un ami pour en gagner une !',
  not_found: 'Ce chapitre est introuvable.',
  error: 'Impossible de débloquer pour le moment. Réessaie.',
}

export function unlockMessage(result: UnlockResult): {
  ok: boolean
  message: string
} {
  return {
    ok: result === 'unlocked' || result === 'already' || result === 'premium',
    message: UNLOCK_MESSAGES[result] ?? UNLOCK_MESSAGES.error,
  }
}

// ---------------------------------------------------------------- parrainage

/**
 * État d'un parrainage.
 *   'pending'   — le filleul a créé son compte avec le code, mais n'a pas
 *                 encore révisé : personne n'a touché de gemme ;
 *   'activated' — le filleul a bouclé sa première session : les deux camps ont
 *                 été payés.
 * Ce délai est l'anti-triche : fabriquer un faux compte ne rapporte rien tant
 * qu'on n'a pas fait le travail d'un vrai élève.
 */
export type ReferralStatus = 'pending' | 'activated'

export type ReferralSummary = {
  /** Filleuls inscrits mais pas encore actifs. */
  pending: number
  /** Filleuls actifs — ceux qui ont rapporté. */
  activated: number
  /** Gemmes déjà gagnées grâce au parrainage. */
  gemsEarned: number
  /** Gemmes encore gagnables avant le plafond. */
  gemsRemaining: number
  /** Le plafond est atteint. */
  capped: boolean
}

/** Gemmes versées au parrain pour `activated` filleuls, plafond compris. */
export function referralGemsEarned(activated: number): number {
  const safe = Math.max(0, Math.floor(activated))
  return Math.min(safe * REFERRAL_GEM_REWARD, REFERRAL_GEM_CAP)
}

export function referralSummary(
  pending: number,
  activated: number,
): ReferralSummary {
  const safePending = Math.max(0, Math.floor(pending))
  const safeActivated = Math.max(0, Math.floor(activated))
  const gemsEarned = referralGemsEarned(safeActivated)
  return {
    pending: safePending,
    activated: safeActivated,
    gemsEarned,
    gemsRemaining: Math.max(0, REFERRAL_GEM_CAP - gemsEarned),
    capped: gemsEarned >= REFERRAL_GEM_CAP,
  }
}

/** Phrase d'accroche du bloc parrainage, adaptée à l'avancement. */
export function referralHeadline(summary: ReferralSummary): string {
  if (summary.capped) {
    return 'Tu as atteint le maximum de gemmes par parrainage. Chapeau !'
  }
  if (summary.activated === 0 && summary.pending === 0) {
    return 'Invite un ami : vous gagnez chacun une gemme.'
  }
  if (summary.activated === 0) {
    return summary.pending === 1
      ? 'Un ami t’a rejoint ! Il doit finir une révision pour que vous gagniez vos gemmes.'
      : `${summary.pending} amis t’ont rejoint ! Ils doivent finir une révision pour déclencher vos gemmes.`
  }
  const gems = summary.gemsEarned === 1 ? 'gemme' : 'gemmes'
  return `${summary.gemsEarned} ${gems} gagnées grâce à tes amis. Continue !`
}

// ------------------------------------------------------- relations vs squad

/**
 * Deux cercles distincts, volontairement :
 *   • une RELATION, c'est tout élève ajouté — elle compte pour le parrainage,
 *     les classements et les duels. On veut qu'il y en ait beaucoup ;
 *   • le SQUAD, c'est le cercle intime, choisi à la main et plafonné à
 *     MAX_SQUAD_SIZE. On n'y entre pas parce qu'on a scanné un QR code.
 * Sans cette séparation, accepter un inconnu pour gagner une gemme polluerait
 * le classement entre vrais copains — et les élèves cesseraient d'ajouter.
 */
export type FriendCircle = 'relation' | 'squad'

export function isSquadFull(squadSize: number): boolean {
  return Math.max(0, Math.floor(squadSize)) >= MAX_SQUAD_SIZE
}

export function squadSlotsLeft(squadSize: number): number {
  return Math.max(0, MAX_SQUAD_SIZE - Math.max(0, Math.floor(squadSize)))
}

/** Peut-on faire entrer cette relation dans le squad ? */
export function canJoinSquad(
  circle: FriendCircle,
  squadSize: number,
): boolean {
  return circle === 'relation' && !isSquadFull(squadSize)
}

// ------------------------------------------------------------------ libellés

/** « 3 gemmes », « 1 gemme », « 0 gemme ». */
export function gemsLabel(gems: number): string {
  const n = Math.max(0, Math.floor(gems))
  return `${n} ${n === 1 || n === 0 ? 'gemme' : 'gemmes'}`
}
