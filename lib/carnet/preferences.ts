// -----------------------------------------------------------------------------
// LES PRÉFÉRENCES DU CARNET — ce que l'élève règle pour LUI, et qui ne dépend
// d'aucun cours en particulier.
//
// Le carnet avait des réglages PAR COURS (plafonds, tolérance, date de
// contrôle, matière — migration 315/316) et rien pour l'ensemble : l'ordre des
// dossiers, la forme de la liste, l'objectif de cartes du jour, la façon de
// lancer une session. Un étudiant de master en droit et une élève de 6e n'ont
// pas le même carnet ; ils avaient exactement le même écran.
//
// Tout est ici, PUR : la forme, les bornes, les défauts, et la relecture
// tolérante d'un JSON venu de la base (`profiles.carnet_prefs`, migration 356)
// ou d'un formulaire. Une valeur inconnue retombe sur le défaut ; le carnet ne
// doit jamais refuser de s'afficher parce qu'un réglage a mal voyagé.
// -----------------------------------------------------------------------------

import {
  LONGUEURS,
  MODES,
  OPTIONS_DEFAUT,
  SENS,
  type Mode,
  type Sens,
} from './session-options'

/**
 * Comment ranger les dossiers. L'ordre « Urgence » (score de cartes dues et de
 * contrôle proche) a été retiré le 10/09/2026 (Lucas : « supprime urgence ») :
 * l'urgence reste le critère de LA SUGGESTION (`coursPrioritaire`), pas un
 * rangement de la grille. Une préférence `'urgence'` encore en base retombe
 * sur le défaut.
 */
export const ORDRES = ['alphabetique', 'recents'] as const
export type OrdreCarnet = (typeof ORDRES)[number]

export const ORDRE_LABEL: Record<OrdreCarnet, string> = {
  alphabetique: 'A → Z',
  recents: 'Récents',
}

/** Grille de dossiers (deux par rangée) ou liste dense. */
export const AFFICHAGES = ['grille', 'liste'] as const
export type AffichageCarnet = (typeof AFFICHAGES)[number]

/** Les objectifs proposés d'un tap. La saisie libre reste bornée par OBJECTIF_*. */
export const OBJECTIFS_PROPOSES = [10, 20, 30, 50, 100] as const
export const OBJECTIF_MIN = 10
export const OBJECTIF_MAX = 200
export const OBJECTIF_DEFAUT = 30

/** Comment une session se lance depuis le carnet quand on ne précise rien. */
export type SessionDefaut = {
  mode: Mode
  sens: Sens
  /** `null` = tout ce qui est dû. */
  longueur: number | null
}

export type PreferencesCarnet = {
  /** Cartes à revoir par jour, tous cours confondus. */
  objectifCartes: number
  ordre: OrdreCarnet
  affichage: AffichageCarnet
  /** Les cours sans question restent visibles (repliés) ou disparaissent. */
  afficherBrouillons: boolean
  sessionDefaut: SessionDefaut
}

export const PREFERENCES_DEFAUT: PreferencesCarnet = {
  objectifCartes: OBJECTIF_DEFAUT,
  ordre: 'recents',
  affichage: 'grille',
  afficherBrouillons: true,
  sessionDefaut: {
    mode: OPTIONS_DEFAUT.mode,
    sens: OPTIONS_DEFAUT.sens,
    longueur: OPTIONS_DEFAUT.longueur,
  },
}

/** Un objectif borné et entier, ou le défaut si ce n'est pas un nombre. */
export function normaliserObjectif(raw: unknown): number {
  const n = Number(raw)
  if (!Number.isFinite(n)) return OBJECTIF_DEFAUT
  return Math.min(OBJECTIF_MAX, Math.max(OBJECTIF_MIN, Math.round(n)))
}

function normaliserSessionDefaut(raw: unknown): SessionDefaut {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const longueurBrute = o.longueur
  const longueur =
    typeof longueurBrute === 'number' && (LONGUEURS as readonly (number | null)[]).includes(longueurBrute)
      ? longueurBrute
      : null
  return {
    mode: (MODES as readonly unknown[]).includes(o.mode) ? (o.mode as Mode) : PREFERENCES_DEFAUT.sessionDefaut.mode,
    sens: (SENS as readonly unknown[]).includes(o.sens) ? (o.sens as Sens) : PREFERENCES_DEFAUT.sessionDefaut.sens,
    longueur,
  }
}

/**
 * Relit des préférences venues de la base ou d'un formulaire. Chaque champ
 * est jugé séparément : un `ordre` inconnu ne fait pas perdre l'objectif.
 */
export function normaliserPreferences(raw: unknown): PreferencesCarnet {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  return {
    objectifCartes: 'objectifCartes' in o ? normaliserObjectif(o.objectifCartes) : OBJECTIF_DEFAUT,
    ordre: (ORDRES as readonly unknown[]).includes(o.ordre) ? (o.ordre as OrdreCarnet) : PREFERENCES_DEFAUT.ordre,
    affichage: (AFFICHAGES as readonly unknown[]).includes(o.affichage)
      ? (o.affichage as AffichageCarnet)
      : PREFERENCES_DEFAUT.affichage,
    afficherBrouillons:
      typeof o.afficherBrouillons === 'boolean' ? o.afficherBrouillons : PREFERENCES_DEFAUT.afficherBrouillons,
    sessionDefaut: normaliserSessionDefaut(o.sessionDefaut),
  }
}

/**
 * Les paramètres d'URL d'une session lancée avec ces préférences — le même
 * contrat que `SessionOptionsSheet` (`?mode=&sens=&long=`), relu par
 * `app/carnet/cours/[id]/reviser`. Rien n'est écrit quand c'est le défaut :
 * un lien propre vaut mieux qu'un lien qui redit ce que la page suppose.
 */
export function parametresSession(s: SessionDefaut): string {
  const p = new URLSearchParams()
  if (s.mode !== OPTIONS_DEFAUT.mode) p.set('mode', s.mode)
  if (s.sens !== OPTIONS_DEFAUT.sens) p.set('sens', s.sens)
  if (s.longueur !== null) p.set('long', String(s.longueur))
  const q = p.toString()
  return q ? `?${q}` : ''
}
