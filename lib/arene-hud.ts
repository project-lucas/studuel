// HUD de l'arène (/defi) — logique pure des compteurs et minuteurs.
//
// Les libellés du menu ne se replient plus passé un niveau : depuis que le
// second rang vit dans un PANNEAU façon Clash Royale (une plaque large par
// entrée), le libellé EST la plaque — le masquer laissait des rangées muettes.

/**
 * Pastille du burger : combien d'entrées du menu réclament quelque chose
 * MAINTENANT. On compte les ENTRÉES en alerte (un coffre à ouvrir, une école à
 * rejoindre), pas la somme de leurs compteurs : le menu étant fermé, le chiffre
 * répond à « combien de portes ont un dû derrière elles ». Ton `neutral`
 * (avancement en cours) ne réclame rien : il ne compte pas.
 */
export function menuAlertCount(
  items: readonly { badge?: string; badgeTone?: 'alert' | 'neutral' }[],
): number {
  return items.filter((i) => i.badge && (i.badgeTone ?? 'alert') === 'alert')
    .length
}

// ------------------------------------------------- tuiles des rails latéraux

/**
 * Minuteur de la tuile Boss : jours restants avant la rotation du lundi
 * (lib/bosses.weeklyBoss change chaque lundi). Le lundi même affiche « 7j » —
 * le boss vient d'arriver, il reste la semaine entière.
 */
export function bossTimerLabel(dayKey: string): string {
  const weekday = new Date(`${dayKey}T00:00:00Z`).getUTCDay() // dimanche = 0
  const mondayIndex = (weekday + 6) % 7 // lundi = 0 (convention du projet)
  return `${7 - mondayIndex}j`
}

/** Pastille d'une tuile de rail : compteur + ton (corail = à réclamer). */
export type TileBadge = {
  count: number
  /** `alert` (corail) = un dû à encaisser ; `neutral` (violet) = avancement. */
  tone: 'alert' | 'neutral'
}

/**
 * Pastille de la tuile Quêtes. Priorité au dû : s'il y a des quêtes finies non
 * réclamées, on les compte en corail. Sinon, les quêtes restantes en neutre.
 * Tout fait et réclamé (ou aucune quête) → pas de pastille.
 */
export function questTileBadge(
  views: readonly { id: string; done: boolean }[],
  claimedIds: readonly string[],
): TileBadge | null {
  const claimed = new Set(claimedIds)
  const claimable = views.filter((v) => v.done && !claimed.has(v.id)).length
  if (claimable > 0) return { count: claimable, tone: 'alert' }
  const remaining = views.filter((v) => !v.done).length
  if (remaining > 0) return { count: remaining, tone: 'neutral' }
  return null
}
