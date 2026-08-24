// Le vocabulaire des niveaux de dictée — partagé par la liste, la présentation
// et la session, pour qu'un même `niveau` s'écrive partout pareil.

export type NiveauDictee = 'debutant' | 'intermediaire' | 'avance'

export const NIVEAUX: readonly NiveauDictee[] = [
  'debutant',
  'intermediaire',
  'avance',
]

export const NIVEAU_LABEL: Record<NiveauDictee, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
}

export function isNiveauDictee(v: unknown): v is NiveauDictee {
  return (NIVEAUX as readonly unknown[]).includes(v)
}

export function normalizeNiveau(raw: unknown): NiveauDictee {
  return isNiveauDictee(raw) ? raw : 'intermediaire'
}

/** Le support d'écriture choisi par l'élève. */
export type SupportDictee = 'telephone' | 'papier'

export const SUPPORT_LABEL: Record<SupportDictee, string> = {
  telephone: 'Sur mon téléphone',
  papier: 'Sur du papier',
}

export const SUPPORT_AIDE: Record<SupportDictee, string> = {
  telephone: 'Tu écris directement dans l’application et on corrige automatiquement.',
  papier: 'Tu écris sur une feuille et tu comptes toi-même tes erreurs.',
}

export function isSupportDictee(v: unknown): v is SupportDictee {
  return v === 'telephone' || v === 'papier'
}
