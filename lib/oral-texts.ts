// -----------------------------------------------------------------------------
// « Liste des textes du bac de français ORAL » — le *descriptif* : la liste des
// textes étudiés en classe que l'élève de 1re présente à l'oral. L'élève y suit
// chacun de ses textes avec un statut de préparation (À faire → En cours →
// Maîtrisé). Stockée dans profiles.oral_texts (migration 156). Logique pure et
// testable (convention projet : pas de logique dans les composants).
// -----------------------------------------------------------------------------

// Garde-fou anti-abus : un descriptif de bac fait ~16-24 textes, on borne large.
export const MAX_ORAL_TEXTS = 30

export type OralTextStatus = 'a_faire' | 'en_cours' | 'maitrise'

export type OralText = {
  id: string // identifiant stable (uuid généré en base à l'ajout)
  title: string // titre du texte / extrait
  work: string | null // œuvre ou auteur (facultatif)
  status: OralTextStatus
}

// Ordre du cycle de statut, aussi utilisé pour valider une valeur brute.
export const ORAL_STATUSES: readonly OralTextStatus[] = [
  'a_faire',
  'en_cours',
  'maitrise',
]

export const ORAL_STATUS_LABEL: Record<OralTextStatus, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  maitrise: 'Maîtrisé',
}

const isNonEmpty = (v: unknown, max = 200): v is string =>
  typeof v === 'string' && v.trim().length > 0 && v.length <= max

export function isOralStatus(v: unknown): v is OralTextStatus {
  return typeof v === 'string' && ORAL_STATUSES.includes(v as OralTextStatus)
}

// Valide/normalise une valeur brute (JSON de la base ou d'un formulaire) en
// OralText, ou null si la forme est invalide. Le titre est rogné ; un statut
// inconnu retombe sur « À faire ».
export function normalizeOralText(raw: unknown): OralText | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (!isNonEmpty(o.id, 100) || !isNonEmpty(o.title)) return null
  return {
    id: o.id,
    title: (o.title as string).trim(),
    work: isNonEmpty(o.work) ? (o.work as string).trim() : null,
    status: isOralStatus(o.status) ? o.status : 'a_faire',
  }
}

// Normalise une valeur brute (JSONB de la base) en liste de textes valides :
// on jette les entrées invalides, on dédoublonne par id (dernière gagne), et on
// borne la taille (les plus récents gagnent, cohérent avec addOralText).
export function normalizeOralList(raw: unknown): OralText[] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, OralText>()
  for (const entry of raw) {
    const t = normalizeOralText(entry)
    if (t) byId.set(t.id, t)
  }
  return [...byId.values()].slice(-MAX_ORAL_TEXTS)
}

// Ajoute (ou remplace, par id) un texte dans la liste : dédoublonné, borné.
// Retourne une NOUVELLE liste (immutabilité).
export function addOralText(list: OralText[], text: OralText): OralText[] {
  const withoutDup = list.filter((t) => t.id !== text.id)
  return [...withoutDup, text].slice(-MAX_ORAL_TEXTS)
}

// Retire un texte de la liste. Nouvelle liste.
export function removeOralText(list: OralText[], id: string): OralText[] {
  return list.filter((t) => t.id !== id)
}

// Change le statut d'un texte. Nouvelle liste (les autres inchangés).
export function setOralStatus(
  list: OralText[],
  id: string,
  status: OralTextStatus,
): OralText[] {
  return list.map((t) => (t.id === id ? { ...t, status } : t))
}

// Statut suivant dans le cycle À faire → En cours → Maîtrisé → À faire.
export function nextOralStatus(status: OralTextStatus): OralTextStatus {
  const i = ORAL_STATUSES.indexOf(status)
  return ORAL_STATUSES[(i + 1) % ORAL_STATUSES.length]
}

// Progression du descriptif, 0..1 : maîtrisé = 1, en cours = 0,5, à faire = 0.
export function oralProgress(list: OralText[]): number {
  if (list.length === 0) return 0
  const score = list.reduce(
    (s, t) =>
      s + (t.status === 'maitrise' ? 1 : t.status === 'en_cours' ? 0.5 : 0),
    0,
  )
  return score / list.length
}

// Décompte par statut, pour l'en-tête de la carte.
export function oralCounts(list: OralText[]): Record<OralTextStatus, number> {
  const counts: Record<OralTextStatus, number> = {
    a_faire: 0,
    en_cours: 0,
    maitrise: 0,
  }
  for (const t of list) counts[t.status] += 1
  return counts
}
