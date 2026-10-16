// -----------------------------------------------------------------------------
// LES DEMANDES DE BILAN DU SITE SCOLARIA (16/10/2026, migration 592) — ce que
// la console en dit, en logique pure : le libellé d'un statut, son étape
// suivante, et le compte par statut pour l'en-tête de la page.
// -----------------------------------------------------------------------------

export type StatutDemande = 'nouvelle' | 'contactee' | 'close'

export type DemandeScolaria = {
  id: number
  cree_le: string
  parent_nom: string
  email: string
  telephone: string | null
  eleve_prenom: string | null
  classe: string | null
  besoin: string | null
  message: string | null
  creneaux: string | null
  source: string | null
  statut: StatutDemande
  note: string | null
  traitee_le: string | null
}

export const LIBELLE_STATUT: Record<StatutDemande, string> = {
  nouvelle: 'À rappeler',
  contactee: 'Contactée',
  close: 'Close',
}

/** L'étape qui suit, pour le bouton principal d'une demande (null : rien à faire). */
export function statutSuivant(statut: StatutDemande): StatutDemande | null {
  if (statut === 'nouvelle') return 'contactee'
  if (statut === 'contactee') return 'close'
  return null
}

export function compterParStatut(demandes: readonly Pick<DemandeScolaria, 'statut'>[]): Record<StatutDemande, number> {
  const compte: Record<StatutDemande, number> = { nouvelle: 0, contactee: 0, close: 0 }
  for (const d of demandes) compte[d.statut]++
  return compte
}

/** Les demandes à traiter d'abord : les nouvelles (les plus anciennes en tête — elles attendent), puis le reste du plus récent au plus ancien. */
export function trierDemandes<T extends Pick<DemandeScolaria, 'statut' | 'cree_le'>>(demandes: readonly T[]): T[] {
  const nouvelles = demandes.filter((d) => d.statut === 'nouvelle').sort((a, b) => a.cree_le.localeCompare(b.cree_le))
  const autres = demandes.filter((d) => d.statut !== 'nouvelle').sort((a, b) => b.cree_le.localeCompare(a.cree_le))
  return [...nouvelles, ...autres]
}
