// -----------------------------------------------------------------------------
// LES DEMANDES DU SITE STUDUEL (16/10/2026, migration 593) — fiches offertes
// (« 10 fiches sur la matière de ton choix ») et « être prévenu » des filières
// du supérieur (matière `sup-<filière>`). Logique pure : les totaux que la
// console affiche.
// -----------------------------------------------------------------------------

export type SiteLead = {
  id: number
  cree_le: string
  email: string
  profil: 'eleve' | 'parent' | 'enseignant' | 'autre'
  classe: string
  matiere: string
  nouvelles: boolean
  source: string | null
}

export const LIBELLE_PROFIL: Record<SiteLead['profil'], string> = {
  eleve: 'Élève',
  parent: 'Parent',
  enseignant: 'Enseignant',
  autre: 'Autre',
}

export function estSuperieur(l: Pick<SiteLead, 'matiere'>): boolean {
  return l.matiere.startsWith('sup-')
}

/** Les comptes « clé → nombre », du plus demandé au moins demandé. */
export function compterPar<T>(lignes: readonly T[], cle: (l: T) => string): { cle: string; n: number }[] {
  const m = new Map<string, number>()
  for (const l of lignes) m.set(cle(l), (m.get(cle(l)) ?? 0) + 1)
  return [...m.entries()].map(([k, n]) => ({ cle: k, n })).sort((a, b) => b.n - a.n || a.cle.localeCompare(b.cle, 'fr'))
}

/** Les e-mails qu'on peut contacter (accord donné), sans doublon. */
export function contactables(lignes: readonly Pick<SiteLead, 'email' | 'nouvelles'>[]): string[] {
  return [...new Set(lignes.filter((l) => l.nouvelles).map((l) => l.email.toLowerCase()))]
}
