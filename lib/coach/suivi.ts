// -----------------------------------------------------------------------------
// LE SUIVI DU COACH — la logique pure (16/10/2026, migration 591).
//
// La fiche d'entrée (le point de départ d'un élève), l'objectif de la semaine
// et son avancée, la tendance des huit dernières semaines. Sans réseau, testé.
// -----------------------------------------------------------------------------

export type FicheEntree = {
  etablissement: string
  objectif: string
  filiere: string
  moyennes: Record<string, number>
  moyenneGenerale: number | null
  contraintes: string
  pointsForts: string
  pointsFaibles: string
  contactParent: string
  remarques: string
  majLe: string | null
}

export const FICHE_VIDE: FicheEntree = {
  etablissement: '',
  objectif: '',
  filiere: '',
  moyennes: {},
  moyenneGenerale: null,
  contraintes: '',
  pointsForts: '',
  pointsFaibles: '',
  contactParent: '',
  remarques: '',
  majLe: null,
}

/** Les matières proposées dans la fiche d'entrée (la saisie reste libre). */
export const MATIERES_FICHE = [
  'Français', 'Maths', 'Histoire-Géo', 'Anglais', 'Espagnol', 'Allemand', 'SVT', 'Physique-Chimie',
  'Technologie', 'SES', 'Philosophie', 'NSI', 'HGGSP', 'HLP', 'Sport',
] as const

const t = (v: unknown): string => (typeof v === 'string' ? v : '')

export function ficheEntreeDepuis(d: unknown): FicheEntree {
  if (!d || typeof d !== 'object') return FICHE_VIDE
  const r = d as Record<string, unknown>
  const moyennes: Record<string, number> = {}
  if (r.moyennes && typeof r.moyennes === 'object') {
    for (const [k, v] of Object.entries(r.moyennes as Record<string, unknown>)) {
      const n = Number(v)
      if (k && Number.isFinite(n) && n >= 0 && n <= 20) moyennes[k] = n
    }
  }
  const mg = r.moyenne_generale == null ? null : Number(r.moyenne_generale)
  return {
    etablissement: t(r.etablissement),
    objectif: t(r.objectif),
    filiere: t(r.filiere),
    moyennes,
    moyenneGenerale: mg !== null && Number.isFinite(mg) ? mg : null,
    contraintes: t(r.contraintes),
    pointsForts: t(r.points_forts),
    pointsFaibles: t(r.points_faibles),
    contactParent: t(r.contact_parent),
    remarques: t(r.remarques),
    majLe: typeof r.maj_le === 'string' ? r.maj_le : null,
  }
}

/** Le payload de `coach_fiche_entree_enregistrer`. */
export function ficheEntreeVersPayload(f: FicheEntree): Record<string, unknown> {
  const moyennes: Record<string, number> = {}
  for (const [k, v] of Object.entries(f.moyennes)) {
    const cle = k.trim().slice(0, 40)
    if (cle && Number.isFinite(v) && v >= 0 && v <= 20) moyennes[cle] = Math.round(v * 100) / 100
  }
  return {
    etablissement: f.etablissement,
    objectif: f.objectif,
    filiere: f.filiere,
    moyennes,
    moyenne_generale: f.moyenneGenerale,
    contraintes: f.contraintes,
    points_forts: f.pointsForts,
    points_faibles: f.pointsFaibles,
    contact_parent: f.contactParent,
    remarques: f.remarques,
  }
}

/** Une note saisie « 12,5 » ou « 12.5 » → 12.5 ; hors 0..20 ou illisible → null. */
export function lireNote(saisie: string): number | null {
  const s = saisie.trim().replace(',', '.')
  if (s === '') return null
  const n = Number(s)
  return Number.isFinite(n) && n >= 0 && n <= 20 ? Math.round(n * 100) / 100 : null
}

/** La part remplie de la fiche (0..1), pour la pastille « Fiche d'entrée 60 % ». */
export function remplissageFiche(f: FicheEntree): number {
  const champs = [
    f.etablissement, f.objectif, f.filiere, f.contraintes, f.pointsForts, f.pointsFaibles, f.contactParent,
  ].map((x) => x.trim().length > 0)
  champs.push(Object.keys(f.moyennes).length > 0 || f.moyenneGenerale !== null)
  return champs.filter(Boolean).length / champs.length
}

// --------------------------------------------------- l'objectif de la semaine ---
export type Objectif = { minutes: number | null; jours: number | null; quiz: number | null; message: string | null }
export type Avancee = { minutes: number; jours: number; quiz: number }

export function objectifDepuis(d: unknown): Objectif | null {
  if (!d || typeof d !== 'object') return null
  const r = d as Record<string, unknown>
  const num = (v: unknown) => (v == null ? null : Number.isFinite(Number(v)) ? Number(v) : null)
  const o = { minutes: num(r.minutes), jours: num(r.jours), quiz: num(r.quiz), message: typeof r.message === 'string' ? r.message : null }
  return o.minutes === null && o.jours === null && o.quiz === null && !o.message ? null : o
}

export function avanceeDepuis(d: unknown): Avancee {
  const r = (d && typeof d === 'object' ? d : {}) as Record<string, unknown>
  return { minutes: Number(r.minutes ?? 0) || 0, jours: Number(r.jours ?? 0) || 0, quiz: Number(r.quiz ?? 0) || 0 }
}

export type LigneObjectif = { cle: 'minutes' | 'jours' | 'quiz'; libelle: string; fait: number; cible: number; part: number; atteint: boolean }

/** Les jauges de l'objectif (seulement ce qui a une cible), et l'objectif global atteint ou non. */
export function progressionObjectif(o: Objectif | null, a: Avancee): { lignes: LigneObjectif[]; atteint: boolean; part: number } {
  if (!o) return { lignes: [], atteint: false, part: 0 }
  const lignes: LigneObjectif[] = []
  const pousser = (cle: LigneObjectif['cle'], libelle: string, cible: number | null, fait: number) => {
    if (cible === null || cible <= 0) return
    const part = Math.min(1, fait / cible)
    lignes.push({ cle, libelle, fait, cible, part, atteint: fait >= cible })
  }
  pousser('minutes', 'Minutes de travail', o.minutes, a.minutes)
  pousser('jours', 'Jours actifs', o.jours, a.jours)
  pousser('quiz', 'Quiz joués', o.quiz, a.quiz)
  const part = lignes.length ? lignes.reduce((s, l) => s + l.part, 0) / lignes.length : 0
  return { lignes, atteint: lignes.length > 0 && lignes.every((l) => l.atteint), part }
}

/** « 2 h 00 · 4 jours · 5 quiz » — l'objectif en une ligne. */
export function resumeObjectif(o: Objectif | null): string {
  if (!o) return 'Aucun objectif cette semaine'
  const parts: string[] = []
  if (o.minutes) parts.push(o.minutes >= 60 ? `${Math.floor(o.minutes / 60)} h ${String(o.minutes % 60).padStart(2, '0')}` : `${o.minutes} min`)
  if (o.jours) parts.push(`${o.jours} jour${o.jours > 1 ? 's' : ''}`)
  if (o.quiz) parts.push(`${o.quiz} quiz`)
  return parts.length ? parts.join(' · ') : 'Objectif sans cible'
}

/** Des objectifs tout prêts, pour fixer en un clic. */
export const OBJECTIFS_TYPES: { libelle: string; minutes: number; jours: number; quiz: number }[] = [
  { libelle: 'Reprise en douceur', minutes: 60, jours: 3, quiz: 3 },
  { libelle: 'Régulier', minutes: 120, jours: 4, quiz: 6 },
  { libelle: 'Intensif', minutes: 240, jours: 6, quiz: 12 },
  { libelle: 'Avant un contrôle', minutes: 180, jours: 5, quiz: 10 },
]

// --------------------------------------------------- huit semaines ---
export type Semaine = { lundi: string; minutes: number; jours: number; quiz: number; score: number | null }

export function semainesDepuis(d: unknown): Semaine[] {
  if (!Array.isArray(d)) return []
  return d.map((x) => {
    const r = (x ?? {}) as Record<string, unknown>
    return {
      lundi: String(r.lundi ?? ''),
      minutes: Number(r.minutes ?? 0) || 0,
      jours: Number(r.jours ?? 0) || 0,
      quiz: Number(r.quiz ?? 0) || 0,
      score: r.score == null ? null : Number(r.score),
    }
  })
}

/** La tendance du travail : les 2 dernières semaines contre les 4 d'avant. */
export function tendance(semaines: readonly Semaine[]): { sens: 'hausse' | 'baisse' | 'stable' | 'inconnue'; ecartPct: number | null } {
  if (semaines.length < 6) return { sens: 'inconnue', ecartPct: null }
  const recentes = semaines.slice(-2)
  const avant = semaines.slice(-6, -2)
  const moyR = recentes.reduce((s, x) => s + x.minutes, 0) / recentes.length
  const moyA = avant.reduce((s, x) => s + x.minutes, 0) / avant.length
  if (moyA < 10) return { sens: moyR >= 10 ? 'hausse' : 'inconnue', ecartPct: null }
  const ecart = Math.round(((moyR - moyA) / moyA) * 100)
  return { sens: ecart >= 15 ? 'hausse' : ecart <= -15 ? 'baisse' : 'stable', ecartPct: ecart }
}

/** Les libellés des sources de l'activité récente (xp_events), courts. */
export function libelleActivite(source: string): string {
  const L: Record<string, string> = {
    quiz: 'Quiz', revision: 'Révision', examen_blanc: 'Examen blanc', controle: 'Contrôle blanc', dictee: 'Dictée',
    annale: 'Annale', capsule: 'Capsule', encyclo: 'Encyclopédie', flashcards: 'Flashcards', jeu: 'Jeu de salon',
    arene: 'Arène', defi_jour: 'Défi du jour', duel: 'Duel', bienvenue: 'Première partie', serie: 'Série',
    palier: 'Palier', traque: 'Gardien', lecon: 'Leçon lue', exercice: 'Cahier d’exercices', quests: 'Quêtes',
    coffre_equipe: 'Coffre d’équipe', clan_week: 'Clan',
  }
  return L[source] ?? source
}
