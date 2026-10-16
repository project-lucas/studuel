// -----------------------------------------------------------------------------
// LA DIFFUSION ET LES SONDAGES — la logique pure (16/10/2026, migration 588).
//
// Lucas : « une icône messagerie pour envoyer des messages à tous mes users —
// mes coachés, les users de Studuel (freemium…), ou tout le monde » et « des
// sondages de temps en temps pour mieux connaître les users ». Ici : les
// publics, la vérification d'un brouillon (miroir de `annonce_publier`), la
// vérification des réponses (miroir de `sondage_repondre`) et l'agrégation des
// résultats. Sans réseau, testé.
// -----------------------------------------------------------------------------

export type Segment = 'tous' | 'eleves' | 'parents' | 'gratuit' | 'plus' | 'coaches' | 'groupe'
export type TypeAnnonce = 'message' | 'sondage'
export type TypeQuestion = 'choix' | 'multiple' | 'note' | 'texte'

export type Question = {
  id: string
  type: TypeQuestion
  libelle: string
  options?: string[]
}

export type SegmentInfo = {
  id: Segment
  libelle: string
  aide: string
  /** Réservé à l'admin (un coach ne parle qu'à ses élèves). */
  admin: boolean
  /** Le filtre par classe a-t-il un sens ? */
  classes: boolean
}

export const SEGMENTS: readonly SegmentInfo[] = [
  { id: 'coaches', libelle: 'Mes coachés', aide: 'Les élèves de tous tes groupes.', admin: false, classes: true },
  { id: 'groupe', libelle: 'Un de mes groupes', aide: 'Les élèves d’un seul groupe.', admin: false, classes: true },
  { id: 'gratuit', libelle: 'Élèves gratuits', aide: 'Les élèves sans Studuel+.', admin: true, classes: true },
  { id: 'plus', libelle: 'Abonnés Studuel+', aide: 'Les comptes abonnés.', admin: true, classes: true },
  { id: 'eleves', libelle: 'Tous les élèves', aide: 'Gratuits et abonnés.', admin: true, classes: true },
  { id: 'parents', libelle: 'Les parents', aide: 'Les comptes parents.', admin: true, classes: false },
  { id: 'tous', libelle: 'Tout le monde', aide: 'Élèves, parents et coachs.', admin: true, classes: true },
]

export function segmentsPour(admin: boolean): SegmentInfo[] {
  return SEGMENTS.filter((s) => admin || !s.admin)
}

export function libelleSegment(s: string): string {
  return SEGMENTS.find((x) => x.id === s)?.libelle ?? s
}

export const CLASSES = ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle'] as const

export const LIBELLE_QUESTION: Record<TypeQuestion, string> = {
  choix: 'Choix unique',
  multiple: 'Choix multiple',
  note: 'Note de 1 à 5',
  texte: 'Réponse libre',
}

export type Brouillon = {
  type: TypeAnnonce
  titre: string
  corps: string
  lien: string
  lienLibelle: string
  segment: Segment
  groupeId: string | null
  classes: string[]
  questions: Question[]
  anonyme: boolean
  push: boolean
  jours: number
}

export const BROUILLON_VIDE: Brouillon = {
  type: 'message',
  titre: '',
  corps: '',
  lien: '',
  lienLibelle: '',
  segment: 'coaches',
  groupeId: null,
  classes: [],
  questions: [],
  anonyme: false,
  push: true,
  jours: 14,
}

export type PayloadAnnonce = {
  type: TypeAnnonce
  titre: string
  corps: string
  lien: string | null
  lien_libelle: string | null
  segment: Segment
  groupe_id: string | null
  classes: string[]
  questions: Question[] | null
  anonyme: boolean
  push: boolean
  jours: number
}

// Jamais « //site.com » : une adresse externe déguisée en lien interne (588).
const LIEN_INTERNE = /^\/([A-Za-z0-9_?=&#.-][A-Za-z0-9/_?=&#.-]*)?$/

/** Vérifie un brouillon : le payload pour `annonce_publier`, ou la liste des erreurs en français. */
export function verifierBrouillon(
  b: Brouillon,
  admin: boolean,
): { ok: true; payload: PayloadAnnonce } | { ok: false; erreurs: string[] } {
  const erreurs: string[] = []
  const titre = b.titre.trim()
  const corps = b.corps.trim()
  const lien = b.lien.trim()
  if (titre.length === 0) erreurs.push('Donne un titre.')
  if (titre.length > 90) erreurs.push('Le titre dépasse 90 caractères.')
  if (corps.length > 2000) erreurs.push('Le texte dépasse 2 000 caractères.')
  if (b.type === 'message' && corps.length === 0) erreurs.push('Écris le message.')
  if (lien && (!LIEN_INTERNE.test(lien) || lien.length > 200))
    erreurs.push('Le lien doit être une page de l’app, qui commence par « / » (ex. /reviser).')

  const seg = SEGMENTS.find((s) => s.id === b.segment)
  if (!seg) erreurs.push('Choisis un public.')
  else if (seg.admin && !admin) erreurs.push('Ce public est réservé à l’administration.')
  if (b.segment === 'groupe' && !b.groupeId) erreurs.push('Choisis le groupe.')

  let questions: Question[] | null = null
  if (b.type === 'sondage') {
    if (b.questions.length === 0) erreurs.push('Ajoute au moins une question.')
    if (b.questions.length > 10) erreurs.push('Dix questions au plus.')
    questions = b.questions.map((q, i) => {
      const libelle = q.libelle.trim()
      if (libelle.length === 0) erreurs.push(`Question ${i + 1} : écris la question.`)
      if (libelle.length > 200) erreurs.push(`Question ${i + 1} : 200 caractères au plus.`)
      if (q.type === 'choix' || q.type === 'multiple') {
        const options = [...new Set((q.options ?? []).map((o) => o.trim()).filter(Boolean))]
        if (options.length < 2) erreurs.push(`Question ${i + 1} : deux réponses possibles au moins.`)
        if (options.length > 8) erreurs.push(`Question ${i + 1} : huit réponses possibles au plus.`)
        if (options.some((o) => o.length > 80)) erreurs.push(`Question ${i + 1} : une réponse dépasse 80 caractères.`)
        return { id: `q${i + 1}`, type: q.type, libelle, options }
      }
      return { id: `q${i + 1}`, type: q.type, libelle }
    })
  }

  if (erreurs.length > 0) return { ok: false, erreurs }
  return {
    ok: true,
    payload: {
      type: b.type,
      titre,
      corps,
      lien: lien || null,
      lien_libelle: lien ? b.lienLibelle.trim().slice(0, 40) || null : null,
      segment: b.segment,
      groupe_id: b.segment === 'groupe' ? b.groupeId : null,
      classes: seg?.classes ? b.classes.filter((c) => (CLASSES as readonly string[]).includes(c)) : [],
      questions,
      anonyme: b.type === 'sondage' && b.anonyme,
      push: b.push,
      jours: Math.max(1, Math.min(60, Math.round(b.jours) || 14)),
    },
  }
}

/** Une question vide, prête à remplir. */
export function nouvelleQuestion(type: TypeQuestion, rang: number): Question {
  return type === 'choix' || type === 'multiple'
    ? { id: `q${rang}`, type, libelle: '', options: ['', ''] }
    : { id: `q${rang}`, type, libelle: '' }
}

// ---------------------------------------------------- côté destinataire ---
export type AnnonceRecue = {
  id: string
  type: TypeAnnonce
  titre: string
  corps: string
  lien: string | null
  lienLibelle: string | null
  questions: Question[]
  anonyme: boolean
  auteur: string
  auteurCoach: boolean
  creeLe: string
}

function questionsDepuis(v: unknown): Question[] {
  if (!Array.isArray(v)) return []
  return v.flatMap((q) => {
    if (!q || typeof q !== 'object') return []
    const r = q as Record<string, unknown>
    const type = r.type
    if (type !== 'choix' && type !== 'multiple' && type !== 'note' && type !== 'texte') return []
    return [{
      id: String(r.id ?? ''),
      type,
      libelle: String(r.libelle ?? ''),
      options: Array.isArray(r.options) ? r.options.map(String) : undefined,
    }]
  })
}

export function annonceRecueDepuis(r: Record<string, unknown>): AnnonceRecue {
  return {
    id: String(r.id ?? ''),
    type: r.type === 'sondage' ? 'sondage' : 'message',
    titre: String(r.titre ?? ''),
    corps: String(r.corps ?? ''),
    lien: typeof r.lien === 'string' && LIEN_INTERNE.test(r.lien) ? r.lien : null,
    lienLibelle: typeof r.lien_libelle === 'string' ? r.lien_libelle : null,
    questions: questionsDepuis(r.questions),
    anonyme: r.anonyme === true,
    auteur: String(r.auteur ?? 'Studuel'),
    auteurCoach: r.auteur_coach === true,
    creeLe: String(r.cree_le ?? ''),
  }
}

export type Reponse = string | string[] | number

/** Les réponses prêtes pour `sondage_repondre` (même nettoyage que la base) — null si rien n'est rempli. */
export function reponsesPropres(questions: readonly Question[], brutes: Record<string, Reponse | undefined>): Record<string, Reponse> | null {
  const propres: Record<string, Reponse> = {}
  for (const q of questions) {
    const r = brutes[q.id]
    if (r === undefined) continue
    if (q.type === 'choix' && typeof r === 'string' && q.options?.includes(r)) propres[q.id] = r
    if (q.type === 'multiple' && Array.isArray(r)) {
      const v = [...new Set(r.filter((x) => q.options?.includes(x)))]
      if (v.length > 0) propres[q.id] = v
    }
    if (q.type === 'note' && typeof r === 'number' && [1, 2, 3, 4, 5].includes(r)) propres[q.id] = r
    if (q.type === 'texte' && typeof r === 'string' && r.trim()) propres[q.id] = r.trim().slice(0, 1000)
  }
  return Object.keys(propres).length > 0 ? propres : null
}

/** La première annonce à montrer : les sondages et messages d'un coach passent avant ceux de Studuel. */
export function prochaineAnnonce(annonces: readonly AnnonceRecue[], deja: ReadonlySet<string>): AnnonceRecue | null {
  const restantes = annonces.filter((a) => !deja.has(a.id))
  restantes.sort((a, b) => Number(b.auteurCoach) - Number(a.auteurCoach) || a.creeLe.localeCompare(b.creeLe))
  return restantes[0] ?? null
}

// ---------------------------------------------------- côté auteur ---
export type AnnonceAuteur = {
  id: string
  type: TypeAnnonce
  titre: string
  corps: string
  lien: string | null
  segment: Segment
  classes: string[]
  groupe: string | null
  questions: Question[]
  anonyme: boolean
  push: boolean
  pushEnvoyeLe: string | null
  auteur: string | null
  moi: boolean
  creeLe: string
  expireLe: string
  archiveLe: string | null
  vues: number
  fermees: number
  clics: number
  reponses: number
}

export function annonceAuteurDepuis(r: Record<string, unknown>): AnnonceAuteur {
  const n = (v: unknown) => Math.max(0, Number(v ?? 0) || 0)
  return {
    id: String(r.id ?? ''),
    type: r.type === 'sondage' ? 'sondage' : 'message',
    titre: String(r.titre ?? ''),
    corps: String(r.corps ?? ''),
    lien: typeof r.lien === 'string' ? r.lien : null,
    segment: (SEGMENTS.find((s) => s.id === r.segment)?.id ?? 'tous') as Segment,
    classes: Array.isArray(r.classes) ? r.classes.map(String) : [],
    groupe: typeof r.groupe === 'string' ? r.groupe : null,
    questions: questionsDepuis(r.questions),
    anonyme: r.anonyme === true,
    push: r.push === true,
    pushEnvoyeLe: typeof r.push_envoye_le === 'string' ? r.push_envoye_le : null,
    auteur: typeof r.auteur === 'string' ? r.auteur : null,
    moi: r.moi === true,
    creeLe: String(r.cree_le ?? ''),
    expireLe: String(r.expire_le ?? ''),
    archiveLe: typeof r.archive_le === 'string' ? r.archive_le : null,
    vues: n(r.vues),
    fermees: n(r.fermees),
    clics: n(r.clics),
    reponses: n(r.reponses),
  }
}

export type EtatAnnonce = 'active' | 'expiree' | 'archivee'
export function etatAnnonce(a: Pick<AnnonceAuteur, 'expireLe' | 'archiveLe'>, maintenant: Date): EtatAnnonce {
  if (a.archiveLe) return 'archivee'
  return Date.parse(a.expireLe) <= maintenant.getTime() ? 'expiree' : 'active'
}

// ---------------------------------------------------- les résultats ---
export type ReponseBrute = { reponses: Record<string, unknown>; creeLe: string; prenom: string | null; classe: string | null }

export type ResultatQuestion =
  | { question: Question; type: 'choix' | 'multiple'; repondants: number; options: { option: string; n: number; part: number }[] }
  | { question: Question; type: 'note'; repondants: number; moyenne: number | null; repartition: number[] }
  | { question: Question; type: 'texte'; repondants: number; textes: { texte: string; prenom: string | null; classe: string | null; creeLe: string }[] }

/** Agrège les réponses d'un sondage, question par question. */
export function agregerResultats(questions: readonly Question[], reponses: readonly ReponseBrute[]): ResultatQuestion[] {
  return questions.map((q) => {
    const valeurs = reponses.map((r) => ({ v: r.reponses[q.id], r })).filter((x) => x.v !== undefined && x.v !== null)
    if (q.type === 'choix' || q.type === 'multiple') {
      const options = q.options ?? []
      const comptes = new Map(options.map((o) => [o, 0]))
      for (const { v } of valeurs) {
        const liste = Array.isArray(v) ? v : [v]
        for (const o of liste) if (typeof o === 'string' && comptes.has(o)) comptes.set(o, (comptes.get(o) ?? 0) + 1)
      }
      const repondants = valeurs.length
      return {
        question: q,
        type: q.type,
        repondants,
        options: options.map((o) => ({ option: o, n: comptes.get(o) ?? 0, part: repondants ? (comptes.get(o) ?? 0) / repondants : 0 })),
      }
    }
    if (q.type === 'note') {
      const notes = valeurs.map((x) => Number(x.v)).filter((n) => n >= 1 && n <= 5)
      const repartition = [1, 2, 3, 4, 5].map((k) => notes.filter((n) => n === k).length)
      return {
        question: q,
        type: 'note',
        repondants: notes.length,
        moyenne: notes.length ? Math.round((notes.reduce((a, b) => a + b, 0) / notes.length) * 10) / 10 : null,
        repartition,
      }
    }
    return {
      question: q,
      type: 'texte',
      repondants: valeurs.length,
      textes: valeurs
        .filter((x) => typeof x.v === 'string')
        .map((x) => ({ texte: String(x.v), prenom: x.r.prenom, classe: x.r.classe, creeLe: x.r.creeLe })),
    }
  })
}

/** Le taux de réponse en pour cent (0 si personne n'a vu). */
export function tauxReponse(a: Pick<AnnonceAuteur, 'vues' | 'reponses'>): number {
  return a.vues > 0 ? Math.round((a.reponses / a.vues) * 100) : 0
}

/** Les erreurs de la base (588), en français. */
export function messageErreurAnnonce(brut: string | undefined | null): string {
  const m = brut ?? ''
  if (m.includes('segment_interdit')) return 'Ce public est réservé à l’administration.'
  if (m.includes('groupe_inconnu')) return 'Ce groupe n’est pas à toi.'
  if (m.includes('sondage_invalide')) return 'Le sondage est mal formé : vérifie les questions.'
  if (m.includes('trop_d_annonces')) return 'Dix envois par jour au plus.'
  if (m.includes('coach_seulement')) return 'Réservé aux coachs.'
  return 'L’envoi a échoué. Réessaie.'
}
