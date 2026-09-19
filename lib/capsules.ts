// -----------------------------------------------------------------------------
// LES CAPSULES — des mini-formations qu'on débloque dans la Boutique et qu'on
// retrouve dans « Mon carnet » (Lucas, 18/09/2026).
//
// Une capsule, ce sont QUATRE éléments, toujours dans cet ordre :
//   1. un COURS court,
//   2. une FICHE récap,
//   3. un QUIZ (réussi → la capsule est terminée, un badge rejoint le profil),
//   4. un OUTIL pratique — une liste à cocher, un planning ou un calculateur,
//      selon le thème.
//
// Elles se paient en GEMMES. Certaines coûtent volontairement très cher : la
// carte bancaire est alors le raccourci (`prixEuros`). Les prix vivent en base
// (table `capsules`, migration 366) et se règlent sans toucher au code.
//
// Ce module est PUR (convention projet) : il lit et valide ce que rend la base
// — jamais de confiance aveugle dans un JSON — et décide de ce que l'écran
// montre. Aucune requête ici.
// -----------------------------------------------------------------------------

export type ThemeCapsule = 'bien-etre' | 'methode' | 'vie-pratique' | 'avenir'

/** Les rayons de la Boutique, dans l'ordre de l'écran. */
export const THEMES_CAPSULES: readonly {
  id: ThemeCapsule
  label: string
  accroche: string
}[] = [
  { id: 'bien-etre', label: 'Bien-être', accroche: 'Ton corps, ta tête, ta forme.' },
  { id: 'methode', label: 'Méthode', accroche: 'Travailler malin, pas plus.' },
  { id: 'vie-pratique', label: 'Vie pratique', accroche: 'Ce que l’école n’apprend pas.' },
  { id: 'avenir', label: 'Avenir', accroche: 'Préparer la suite, dès maintenant.' },
]

/** Teinte d'emballage d'une capsule — une clé, résolue en CSS (`.capsule-teinte-*`). */
export type TeinteCapsule = 'violet' | 'soleil' | 'corail' | 'prune' | 'ocean' | 'menthe'

const TEINTES: readonly TeinteCapsule[] = ['violet', 'soleil', 'corail', 'prune', 'ocean', 'menthe']

export type Capsule = {
  id: string
  theme: ThemeCapsule
  titre: string
  /** La promesse en une ligne. */
  accroche: string
  emoji: string
  teinte: TeinteCapsule
  /** Prix en gemmes. 0 = offerte. */
  prixGemmes: number
  /** Prix du raccourci par carte bancaire ; `null` = pas de paiement par carte. */
  prixEuros: number | null
  /** Durée annoncée, en minutes. */
  dureeMin: number
  /** Ce qu'on y apprend — les puces de la fiche produit. */
  auProgramme: string[]
  /** Le nom du badge gagné en terminant la capsule. */
  badge: string
  ordre: number
}

/**
 * Un achat de l'élève (table `capsule_achats`). `attente_paiement` : l'élève a
 * demandé le paiement par carte, la capsule n'est pas encore à lui — elle le
 * devient quand le paiement est confirmé (`accorder_capsule`, migration 366).
 */
export type AchatCapsule = {
  capsuleId: string
  statut: 'active' | 'attente_paiement'
  acheteeLe: string
  /** `null` tant que l'élève ne l'a pas ouverte : c'est la pastille du carnet. */
  ouverteLe: string | null
  /** `null` tant que le quiz n'est pas réussi. */
  termineeLe: string | null
}

// ------------------------------------------------------------------ contenu

export type CapsuleCours = {
  intro: string
  sections: { titre: string; texte: string[]; astuce?: string }[]
}

export type CapsuleFiche = {
  points: { titre: string; texte: string }[]
  /** La phrase à garder en tête, en bas de la fiche. */
  aRetenir: string
}

export type CapsuleQuestion = {
  question: string
  choix: string[]
  /** Index de la bonne réponse dans `choix`. */
  bonne: number
  explication: string
}

export type CapsuleQuiz = { questions: CapsuleQuestion[] }

export type ModeleCalculateur = 'sommeil' | 'budget'

export type CapsuleOutil =
  | { kind: 'checklist'; intro: string; items: string[] }
  | {
      kind: 'planning'
      intro: string
      jours: string[]
      moments: string[]
      activites: string[]
    }
  | { kind: 'calculateur'; modele: ModeleCalculateur; intro: string }

export type ContenuCapsule = {
  cours: { titre: string; contenu: CapsuleCours }
  fiche: { titre: string; contenu: CapsuleFiche }
  quiz: { titre: string; contenu: CapsuleQuiz }
  outil: { titre: string; contenu: CapsuleOutil }
}

export type TypeElement = keyof ContenuCapsule

/** Les quatre éléments, dans l'ordre du lecteur. */
export const ELEMENTS_CAPSULE: readonly { type: TypeElement; label: string }[] = [
  { type: 'cours', label: 'Cours' },
  { type: 'fiche', label: 'Fiche récap' },
  { type: 'quiz', label: 'Quiz' },
  { type: 'outil', label: 'Outil' },
]

/** Part de bonnes réponses qui termine la capsule (et donne le badge). */
export const SEUIL_QUIZ_REUSSI = 0.6

export function quizReussi(bonnes: number, total: number): boolean {
  if (!Number.isFinite(bonnes) || !Number.isFinite(total) || total <= 0) return false
  return bonnes / total >= SEUIL_QUIZ_REUSSI
}

// -------------------------------------------------------------- lecture base

const texte = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() ? v.trim() : null

const textes = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(texte).filter((s): s is string => s !== null) : []

const entier = (v: unknown): number | null => {
  const n = typeof v === 'string' ? Number(v) : v
  return typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : null
}

const THEMES = new Set<string>(THEMES_CAPSULES.map((t) => t.id))

/** Une ligne de `capsules`, validée. `null` si elle est inutilisable. */
export function lireCapsule(raw: unknown): Capsule | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = texte(o.id)
  const titre = texte(o.titre)
  const theme = texte(o.theme)
  const prixGemmes = entier(o.prix_gemmes)
  if (!id || !titre || !theme || !THEMES.has(theme) || prixGemmes === null || prixGemmes < 0) {
    return null
  }
  const euros = o.prix_euros === null || o.prix_euros === undefined ? null : Number(o.prix_euros)
  const teinte = texte(o.teinte)
  return {
    id,
    theme: theme as ThemeCapsule,
    titre,
    accroche: texte(o.accroche) ?? '',
    emoji: texte(o.emoji) ?? '✨',
    teinte: TEINTES.includes(teinte as TeinteCapsule) ? (teinte as TeinteCapsule) : 'violet',
    prixGemmes,
    prixEuros: euros !== null && Number.isFinite(euros) && euros > 0 ? euros : null,
    dureeMin: Math.max(1, entier(o.duree_min) ?? 10),
    auProgramme: textes(o.au_programme),
    badge: texte(o.badge) ?? titre,
    ordre: entier(o.ordre) ?? 0,
  }
}

/** Le catalogue, validé et trié (ordre, puis titre). */
export function lireCatalogue(rows: unknown): Capsule[] {
  if (!Array.isArray(rows)) return []
  return rows
    .map(lireCapsule)
    .filter((c): c is Capsule => c !== null)
    .sort((a, b) => a.ordre - b.ordre || a.titre.localeCompare(b.titre, 'fr'))
}

export function lireAchats(rows: unknown): AchatCapsule[] {
  if (!Array.isArray(rows)) return []
  return rows.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return []
    const o = raw as Record<string, unknown>
    const capsuleId = texte(o.capsule_id)
    if (!capsuleId) return []
    return [
      {
        capsuleId,
        statut: o.statut === 'attente_paiement' ? 'attente_paiement' : 'active',
        acheteeLe: texte(o.achetee_le) ?? '',
        ouverteLe: texte(o.ouverte_le),
        termineeLe: texte(o.terminee_le),
      },
    ]
  })
}

function lireCours(v: unknown): CapsuleCours | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const sections = Array.isArray(o.sections)
    ? o.sections.flatMap((s) => {
        if (!s || typeof s !== 'object') return []
        const r = s as Record<string, unknown>
        const titre = texte(r.titre)
        const paragraphes = textes(r.texte)
        if (!titre || paragraphes.length === 0) return []
        const astuce = texte(r.astuce)
        return [{ titre, texte: paragraphes, ...(astuce ? { astuce } : {}) }]
      })
    : []
  return sections.length > 0 ? { intro: texte(o.intro) ?? '', sections } : null
}

function lireFiche(v: unknown): CapsuleFiche | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const points = Array.isArray(o.points)
    ? o.points.flatMap((p) => {
        if (!p || typeof p !== 'object') return []
        const r = p as Record<string, unknown>
        const titre = texte(r.titre)
        const t = texte(r.texte)
        return titre && t ? [{ titre, texte: t }] : []
      })
    : []
  return points.length > 0 ? { points, aRetenir: texte(o.aRetenir) ?? '' } : null
}

function lireQuiz(v: unknown): CapsuleQuiz | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const questions = Array.isArray(o.questions)
    ? o.questions.flatMap((q) => {
        if (!q || typeof q !== 'object') return []
        const r = q as Record<string, unknown>
        const question = texte(r.question)
        const choix = textes(r.choix)
        const bonne = entier(r.bonne)
        if (!question || choix.length < 2 || bonne === null || bonne < 0 || bonne >= choix.length) {
          return []
        }
        return [{ question, choix, bonne, explication: texte(r.explication) ?? '' }]
      })
    : []
  return questions.length > 0 ? { questions } : null
}

function lireOutil(v: unknown): CapsuleOutil | null {
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const intro = texte(o.intro) ?? ''
  switch (o.kind) {
    case 'checklist': {
      const items = textes(o.items)
      return items.length > 0 ? { kind: 'checklist', intro, items } : null
    }
    case 'planning': {
      const jours = textes(o.jours)
      const moments = textes(o.moments)
      const activites = textes(o.activites)
      return jours.length > 0 && moments.length > 0 && activites.length > 0
        ? { kind: 'planning', intro, jours, moments, activites }
        : null
    }
    case 'calculateur':
      return o.modele === 'sommeil' || o.modele === 'budget'
        ? { kind: 'calculateur', modele: o.modele, intro }
        : null
    default:
      return null
  }
}

/**
 * Les lignes de `capsule_elements` d'une capsule, validées. `null` si un des
 * quatre éléments manque ou ne se lit pas : une capsule à trois pieds ne
 * s'affiche pas (le lecteur dit alors qu'elle est en préparation).
 */
export function lireContenu(rows: unknown): ContenuCapsule | null {
  if (!Array.isArray(rows)) return null
  const parType = new Map<string, { titre: string; contenu: unknown }>()
  for (const raw of rows) {
    if (!raw || typeof raw !== 'object') continue
    const o = raw as Record<string, unknown>
    const type = texte(o.type)
    if (type) parType.set(type, { titre: texte(o.titre) ?? '', contenu: o.contenu })
  }
  const el = (type: TypeElement) => parType.get(type)
  const cours = lireCours(el('cours')?.contenu)
  const fiche = lireFiche(el('fiche')?.contenu)
  const quiz = lireQuiz(el('quiz')?.contenu)
  const outil = lireOutil(el('outil')?.contenu)
  if (!cours || !fiche || !quiz || !outil) return null
  return {
    cours: { titre: el('cours')?.titre || 'Le cours', contenu: cours },
    fiche: { titre: el('fiche')?.titre || 'La fiche récap', contenu: fiche },
    quiz: { titre: el('quiz')?.titre || 'Le quiz', contenu: quiz },
    outil: { titre: el('outil')?.titre || 'L’outil', contenu: outil },
  }
}

// ------------------------------------------------------------------- états

export type EtatCapsule =
  /** Déjà à l'élève : elle vit dans son carnet. */
  | { kind: 'possedee'; ouverte: boolean; terminee: boolean }
  /** Paiement par carte demandé, pas encore confirmé. Les gemmes restent possibles. */
  | { kind: 'en-attente'; manque: number }
  /** Assez de gemmes : un geste suffit. */
  | { kind: 'achetable' }
  /** Pas assez de gemmes : on dit combien il manque, et la carte si elle existe. */
  | { kind: 'trop-chere'; manque: number }

export function etatCapsule(
  capsule: Capsule,
  achat: AchatCapsule | null | undefined,
  gemmes: number,
): EtatCapsule {
  if (achat?.statut === 'active') {
    return { kind: 'possedee', ouverte: achat.ouverteLe !== null, terminee: achat.termineeLe !== null }
  }
  const solde = Number.isFinite(gemmes) ? Math.max(0, Math.floor(gemmes)) : 0
  const manque = Math.max(0, capsule.prixGemmes - solde)
  if (achat?.statut === 'attente_paiement') return { kind: 'en-attente', manque }
  if (manque === 0) return { kind: 'achetable' }
  return { kind: 'trop-chere', manque }
}

/** « 2,99 € » — le prix carte, à la française. */
export function libelleEuros(prix: number): string {
  return `${prix.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

/** Les capsules achetées mais jamais ouvertes : la pastille du bouton « Mon carnet ». */
export function capsulesNonOuvertes(achats: readonly AchatCapsule[]): number {
  return achats.filter((a) => a.statut === 'active' && a.ouverteLe === null).length
}

/**
 * Les rayons de la Boutique : un par thème qui a au moins une capsule, dans
 * l'ordre de THEMES_CAPSULES. Un thème vide ne prend pas de place.
 */
export function rayonsParTheme(
  capsules: readonly Capsule[],
): { theme: (typeof THEMES_CAPSULES)[number]; capsules: Capsule[] }[] {
  return THEMES_CAPSULES.flatMap((theme) => {
    const liste = capsules.filter((c) => c.theme === theme.id)
    return liste.length > 0 ? [{ theme, capsules: liste }] : []
  })
}

/**
 * L'étagère « Mes capsules » du carnet : les capsules achetées, les jamais
 * ouvertes d'abord (ce sont elles que la pastille signale), puis les autres
 * de la plus récente à la plus ancienne.
 */
export function etagereCarnet(
  catalogue: readonly Capsule[],
  achats: readonly AchatCapsule[],
): { capsule: Capsule; achat: AchatCapsule }[] {
  const parId = new Map(catalogue.map((c) => [c.id, c]))
  return achats
    .filter((achat) => achat.statut === 'active')
    .flatMap((achat) => {
      const capsule = parId.get(achat.capsuleId)
      return capsule ? [{ capsule, achat }] : []
    })
    .sort((a, b) => {
      const na = a.achat.ouverteLe === null ? 0 : 1
      const nb = b.achat.ouverteLe === null ? 0 : 1
      return na - nb || b.achat.acheteeLe.localeCompare(a.achat.acheteeLe)
    })
}
