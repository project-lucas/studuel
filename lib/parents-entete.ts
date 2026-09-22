// La phrase de l'en-tête de l'espace parents : « 2 enfants suivis · dernière
// activité hier ». Pure, testée.
//
// Elle répond en une ligne à la question qu'un parent se pose avant même de
// faire défiler : est-ce que ça bouge ? Le nombre d'enfants, et la trace
// d'activité la plus récente parmi eux, en mots relatifs (« aujourd'hui »,
// « hier », « il y a 4 jours ») — jamais une date à convertir de tête.

export type EnfantEntete = {
  nom: string
  /** Clé UTC du dernier jour d'activité, ou null. */
  lastActivity: string | null
}

export function derniereActiviteLabel(day: string | null, today: string): string | null {
  if (!day) return null
  const a = Date.parse(`${day}T00:00:00Z`)
  const b = Date.parse(`${today}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  const jours = Math.round((b - a) / 86_400_000)
  if (jours <= 0) return 'aujourd’hui'
  if (jours === 1) return 'hier'
  if (jours < 7) return `il y a ${jours} jours`
  if (jours < 14) return 'il y a une semaine'
  return `il y a ${Math.round(jours / 7)} semaines`
}

export function sousTitreParents(enfants: readonly EnfantEntete[], today: string): string {
  if (enfants.length === 0) {
    return 'Le temps de travail, la régularité et les progrès par matière de votre enfant — mis à jour à chaque session.'
  }
  // « Vous suivez Léa » et non « Léa est suivi(e) » : on n'accorde pas un
  // participe sur un prénom qu'on ne sait pas genrer.
  const compte =
    enfants.length === 1
      ? `Vous suivez ${enfants[0].nom} ici`
      : `Vous suivez ${enfants.length} enfants ici`
  const plusRecent = enfants
    .map((e) => e.lastActivity)
    .filter((d): d is string => typeof d === 'string')
    .sort()
    .at(-1)
  const activite = derniereActiviteLabel(plusRecent ?? null, today)
  return activite
    ? `${compte} · dernière activité ${activite}.`
    : `${compte} · aucune activité pour l’instant.`
}
