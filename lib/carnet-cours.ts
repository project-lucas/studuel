// -----------------------------------------------------------------------------
// « Mon carnet » façon Wooflash — cours créés par l'élève (carnet_courses,
// migration 186), contenant des chapitres imbriquables (carnet_chapters) et des
// questions de 5 types (carnet_questions, détail dans `content` JSONB).
// Toute la logique est pure et testable ici (convention projet) : validation /
// normalisation des contenus, arbre de chapitres, correction des réponses.
// -----------------------------------------------------------------------------

export type CourseQuestionType =
  | 'qcm'
  | 'flashcard'
  | 'vrai_faux'
  | 'texte_a_trous'
  | 'reponse_libre'

export const QUESTION_TYPES: readonly CourseQuestionType[] = [
  'qcm',
  'flashcard',
  'vrai_faux',
  'texte_a_trous',
  'reponse_libre',
]

export const TYPE_LABEL: Record<CourseQuestionType, string> = {
  qcm: 'QCM',
  flashcard: 'Flashcard',
  vrai_faux: 'Vrai / Faux',
  texte_a_trous: 'Texte à trous',
  reponse_libre: 'Réponse libre',
}

export function isQuestionType(v: unknown): v is CourseQuestionType {
  return (QUESTION_TYPES as readonly unknown[]).includes(v)
}

// --- Bornes (partagées avec les éditeurs) ------------------------------------
export const MAX_TITLE_LEN = 120
export const MAX_DESCRIPTION_LEN = 500
export const MAX_ENONCE_LEN = 1_000
export const MAX_CHOICE_LEN = 300
export const MIN_QCM_CHOICES = 2
export const MAX_QCM_CHOICES = 6
export const MAX_FEEDBACK_LEN = 500
export const MAX_FLASHCARD_FACE_LEN = 1_000
export const MAX_TROUS_LEN = 2_000
export const MAX_LIBRE_ANSWERS = 8
/** Profondeur max de l'arbre de chapitres (1 = racine, 2 = sous-dossier…). */
export const MAX_CHAPTER_DEPTH = 3

// --- Formes de `content` par type --------------------------------------------
export type QcmChoice = { texte: string; correct: boolean }
export type QcmContent = {
  enonce: string
  choix: QcmChoice[]
  feedback: string | null
}
export type FlashcardContent = {
  recto: string
  verso: string
  langue_recto: string | null
  langue_verso: string | null
}
export type VraiFauxContent = {
  enonce: string
  reponse: boolean
  feedback: string | null
}
export type TrousContent = { texte: string }
export type LibreContent = { enonce: string; reponses: string[] }

export type QuestionContent =
  | QcmContent
  | FlashcardContent
  | VraiFauxContent
  | TrousContent
  | LibreContent

export type CourseQuestion = {
  id: string
  chapterId: string | null
  type: CourseQuestionType
  position: number
  content: QuestionContent
}

export type CourseChapter = {
  id: string
  parentChapterId: string | null
  title: string
  position: number
}

// --- Couleurs / icônes des cours ---------------------------------------------
// Identifiants de teintes pastel — le rendu (classes Tailwind sur les jetons
// sémantiques) vit dans les composants. Choisis pour rester dans le monde
// crème & violet.
export const COURSE_COLORS = [
  'violet',
  'jaune',
  'corail',
  'menthe',
  'ciel',
  'sable',
] as const
export type CourseColor = (typeof COURSE_COLORS)[number]

export function normalizeCourseColor(raw: unknown): CourseColor {
  return (COURSE_COLORS as readonly unknown[]).includes(raw)
    ? (raw as CourseColor)
    : 'violet'
}

// Petit vocabulaire d'icônes lucide proposé pour un cours.
export const COURSE_ICONS = [
  'book-open',
  'languages',
  'calculator',
  'flask-conical',
  'globe',
  'landmark',
  'music',
  'palette',
  'dumbbell',
  'sparkles',
] as const
export type CourseIcon = (typeof COURSE_ICONS)[number]

export function normalizeCourseIcon(raw: unknown): CourseIcon {
  return (COURSE_ICONS as readonly unknown[]).includes(raw)
    ? (raw as CourseIcon)
    : 'book-open'
}

// --- Normalisation ------------------------------------------------------------
const str = (v: unknown): string => (typeof v === 'string' ? v : '')

/** Titre nettoyé : rogné, borné, jamais vide (retombe sur le repli fourni). */
export function normalizeTitle(raw: unknown, fallback = 'Sans titre'): string {
  const t = str(raw).trim().slice(0, MAX_TITLE_LEN)
  return t.length > 0 ? t : fallback
}

export function normalizeDescription(raw: unknown): string | null {
  const t = str(raw).trim().slice(0, MAX_DESCRIPTION_LEN)
  return t.length > 0 ? t : null
}

const optionalText = (raw: unknown, max: number): string | null => {
  const t = str(raw).trim().slice(0, max)
  return t.length > 0 ? t : null
}

// Codes de langue proposés pour les faces d'une flashcard (LV1/LV2…).
export const FLASHCARD_LANGS = ['fr', 'en', 'es', 'de', 'it', 'la'] as const
export type FlashcardLang = (typeof FLASHCARD_LANGS)[number]

const normalizeLang = (raw: unknown): FlashcardLang | null =>
  (FLASHCARD_LANGS as readonly unknown[]).includes(raw)
    ? (raw as FlashcardLang)
    : null

export function normalizeQcm(raw: unknown): QcmContent {
  const o = (raw ?? {}) as Record<string, unknown>
  const choixRaw = Array.isArray(o.choix) ? o.choix : []
  const choix = choixRaw
    .map((c) => {
      if (!c || typeof c !== 'object') return null
      const co = c as Record<string, unknown>
      const texte = str(co.texte).trim().slice(0, MAX_CHOICE_LEN)
      if (texte.length === 0) return null
      return { texte, correct: co.correct === true }
    })
    .filter((c): c is QcmChoice => c !== null)
    .slice(0, MAX_QCM_CHOICES)
  // On NE coche PLUS d'office la première réponse. C'était fabriquer un
  // corrigé : l'élève qui enregistre sans rien cocher voyait « Enregistré ✓ »,
  // sa question passait « complète », et elle lui serait comptée FAUSSE à
  // chaque révision — sauf s'il devinait la première case. Mieux vaut une
  // question déclarée « Brouillon » (elle sort alors des sessions, cf.
  // `sessionQuestions`) qu'une question qui enseigne une erreur.
  //
  // Effet de bord voulu : le test `choix.some(x => x.correct)` d'
  // `isQuestionReady` était jusqu'ici TOUJOURS vrai — un garde-fou qui ne
  // pouvait pas échouer. Il redevient utile.
  return {
    enonce: str(o.enonce).trim().slice(0, MAX_ENONCE_LEN),
    choix,
    feedback: optionalText(o.feedback, MAX_FEEDBACK_LEN),
  }
}

export function normalizeFlashcard(raw: unknown): FlashcardContent {
  const o = (raw ?? {}) as Record<string, unknown>
  return {
    recto: str(o.recto).trim().slice(0, MAX_FLASHCARD_FACE_LEN),
    verso: str(o.verso).trim().slice(0, MAX_FLASHCARD_FACE_LEN),
    langue_recto: normalizeLang(o.langue_recto),
    langue_verso: normalizeLang(o.langue_verso),
  }
}

export function normalizeVraiFaux(raw: unknown): VraiFauxContent {
  const o = (raw ?? {}) as Record<string, unknown>
  return {
    enonce: str(o.enonce).trim().slice(0, MAX_ENONCE_LEN),
    reponse: o.reponse === true,
    feedback: optionalText(o.feedback, MAX_FEEDBACK_LEN),
  }
}

export function normalizeTrous(raw: unknown): TrousContent {
  const o = (raw ?? {}) as Record<string, unknown>
  return { texte: str(o.texte).trim().slice(0, MAX_TROUS_LEN) }
}

export function normalizeLibre(raw: unknown): LibreContent {
  const o = (raw ?? {}) as Record<string, unknown>
  const reponses = Array.isArray(o.reponses)
    ? o.reponses
        .map((x) => str(x).trim().slice(0, MAX_CHOICE_LEN))
        .filter((x) => x.length > 0)
        .slice(0, MAX_LIBRE_ANSWERS)
    : []
  return {
    enonce: str(o.enonce).trim().slice(0, MAX_ENONCE_LEN),
    reponses,
  }
}

export function normalizeQuestionContent(
  type: CourseQuestionType,
  raw: unknown,
): QuestionContent {
  if (type === 'qcm') return normalizeQcm(raw)
  if (type === 'flashcard') return normalizeFlashcard(raw)
  if (type === 'vrai_faux') return normalizeVraiFaux(raw)
  if (type === 'texte_a_trous') return normalizeTrous(raw)
  return normalizeLibre(raw)
}

export function emptyQuestionContent(
  type: CourseQuestionType,
): QuestionContent {
  if (type === 'qcm') {
    return {
      enonce: '',
      choix: [
        { texte: '', correct: true },
        { texte: '', correct: false },
      ],
      feedback: null,
    }
  }
  if (type === 'flashcard') {
    return { recto: '', verso: '', langue_recto: null, langue_verso: null }
  }
  if (type === 'vrai_faux') return { enonce: '', reponse: true, feedback: null }
  if (type === 'texte_a_trous') return { texte: '' }
  return { enonce: '', reponses: [] }
}

/** Une question est jouable (complète) — sinon elle est un brouillon. */
export function isQuestionReady(
  type: CourseQuestionType,
  content: QuestionContent,
): boolean {
  if (type === 'qcm') {
    const c = content as QcmContent
    return (
      c.enonce.length > 0 &&
      c.choix.length >= MIN_QCM_CHOICES &&
      c.choix.some((x) => x.correct)
    )
  }
  if (type === 'flashcard') {
    const c = content as FlashcardContent
    return c.recto.length > 0 && c.verso.length > 0
  }
  if (type === 'vrai_faux') {
    return (content as VraiFauxContent).enonce.length > 0
  }
  if (type === 'texte_a_trous') {
    return parseTrous((content as TrousContent).texte).some(
      (s) => s.type === 'trou',
    )
  }
  const c = content as LibreContent
  return c.enonce.length > 0 && c.reponses.length > 0
}

/** Résumé d'une question pour la liste (1re ligne de son contenu). */
export function questionSummary(
  type: CourseQuestionType,
  content: QuestionContent,
): string {
  if (type === 'flashcard') {
    const c = content as FlashcardContent
    return c.recto.length > 0 ? c.recto : 'Flashcard vide'
  }
  if (type === 'texte_a_trous') {
    const texte = (content as TrousContent).texte
    return texte.length > 0 ? texte.replace(/\[([^\]]*)\]/g, '___') : 'Texte vide'
  }
  const enonce = (content as QcmContent | VraiFauxContent | LibreContent).enonce
  return enonce.length > 0 ? enonce : 'Question vide'
}

// --- Texte à trous : parsing --------------------------------------------------
export type TrouSegment =
  | { type: 'texte'; valeur: string }
  | { type: 'trou'; valeur: string }

/**
 * Découpe « La [Seine] traverse [Paris]. » en segments texte/trou.
 * Un crochet vide `[]` ou non fermé est laissé tel quel dans le texte.
 */
export function parseTrous(texte: string): TrouSegment[] {
  const segments: TrouSegment[] = []
  const re = /\[([^\]\n]+)\]/g
  let last = 0
  for (let m = re.exec(texte); m !== null; m = re.exec(texte)) {
    if (m.index > last) {
      segments.push({ type: 'texte', valeur: texte.slice(last, m.index) })
    }
    segments.push({ type: 'trou', valeur: m[1].trim() })
    last = m.index + m[0].length
  }
  if (last < texte.length) {
    segments.push({ type: 'texte', valeur: texte.slice(last) })
  }
  return segments.filter((s) => !(s.type === 'trou' && s.valeur.length === 0))
}

/** Les réponses attendues d'un texte à trous, dans l'ordre. */
export function trousAnswers(texte: string): string[] {
  return parseTrous(texte)
    .filter((s) => s.type === 'trou')
    .map((s) => s.valeur)
}

// --- Correction ----------------------------------------------------------------
/**
 * Forme canonique d'une réponse texte : minuscules, accents retirés, espaces
 * réduits — « Ecole » == « école ». Volontairement tolérant : ce sont des
 * élèves qui tapent sur téléphone.
 */
// Diacritiques combinants (U+0300–U+036F) laissés par la décomposition NFD.
const COMBINING_MARKS = /[̀-ͯ]/g

export function canonicalAnswer(s: string): string {
  return s
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** QCM : vrai si l'ensemble coché == l'ensemble des bonnes réponses. */
export function gradeQcm(content: QcmContent, selected: number[]): boolean {
  const want = new Set(
    content.choix.flatMap((c, i) => (c.correct ? [i] : [])),
  )
  // Un QCM SANS bonne réponse n'est pas corrigeable : ne rien cocher y aurait
  // été « juste » (deux ensembles vides sont égaux). Le cas n'existait pas tant
  // que la normalisation cochait d'office la première réponse ; il apparaît
  // depuis qu'elle a cessé de fabriquer un corrigé. Le flux normal écarte déjà
  // ces questions (elles sont « brouillon », donc hors session), mais
  // `recordAttempt` corrige sans passer par `isQuestionReady` : un appel forgé
  // se serait offert des tentatives réussies à volonté.
  if (want.size === 0) return false
  // Un index hors bornes invalide la réponse (pas de filtrage silencieux).
  if (
    selected.some(
      (i) => !Number.isInteger(i) || i < 0 || i >= content.choix.length,
    )
  ) {
    return false
  }
  const got = new Set(selected)
  if (want.size !== got.size) return false
  for (const i of want) if (!got.has(i)) return false
  return true
}

export function gradeVraiFaux(
  content: VraiFauxContent,
  answer: boolean,
): boolean {
  return content.reponse === answer
}

/** Texte à trous : chaque trou est comparé en forme canonique, dans l'ordre. */
export function gradeTrous(content: TrousContent, answers: string[]): boolean {
  const want = trousAnswers(content.texte)
  if (want.length === 0) return false
  if (answers.length !== want.length) return false
  return want.every(
    (w, i) => canonicalAnswer(answers[i] ?? '') === canonicalAnswer(w),
  )
}

/** Réponse libre : vraie si elle égale (forme canonique) une réponse acceptée. */
export function gradeLibre(content: LibreContent, answer: string): boolean {
  const got = canonicalAnswer(answer)
  if (got.length === 0) return false
  return content.reponses.some((r) => canonicalAnswer(r) === got)
}

// --- Arbre de chapitres ---------------------------------------------------------
/** Une question rattachable à l'arbre (la liste n'a pas besoin du contenu). */
export type TreeQuestion = { chapterId: string | null; position: number }

export type ChapterNode<Q extends TreeQuestion = CourseQuestion> =
  CourseChapter & {
    children: ChapterNode<Q>[]
    /** Questions directement dans ce chapitre (triées par position). */
    questions: Q[]
    /** Nombre de questions, sous-chapitres inclus. */
    totalQuestions: number
  }

const byPosition = <T extends { position: number }>(a: T, b: T) =>
  a.position - b.position

/**
 * Construit l'arbre des chapitres d'un cours + questions rattachées.
 * Retourne { racine (chapitres de 1er niveau), questions hors chapitre }.
 * Un chapitre orphelin (parent inconnu) est rattaché à la racine plutôt que
 * perdu.
 */
export function buildCourseTree<Q extends TreeQuestion>(
  chapters: CourseChapter[],
  questions: Q[],
): { chapters: ChapterNode<Q>[]; rootQuestions: Q[] } {
  const nodes = new Map<string, ChapterNode<Q>>()
  for (const c of chapters) {
    nodes.set(c.id, { ...c, children: [], questions: [], totalQuestions: 0 })
  }

  const roots: ChapterNode<Q>[] = []
  for (const node of nodes.values()) {
    const parent =
      node.parentChapterId !== null ? nodes.get(node.parentChapterId) : undefined
    if (parent && parent.id !== node.id) parent.children.push(node)
    else roots.push(node)
  }

  const rootQuestions: Q[] = []
  for (const q of questions) {
    const owner = q.chapterId !== null ? nodes.get(q.chapterId) : undefined
    if (owner) owner.questions.push(q)
    else rootQuestions.push(q)
  }

  const finalize = (node: ChapterNode<Q>): number => {
    node.children.sort(byPosition)
    node.questions.sort(byPosition)
    node.totalQuestions =
      node.questions.length +
      node.children.reduce((sum, child) => sum + finalize(child), 0)
    return node.totalQuestions
  }
  roots.sort(byPosition)
  rootQuestions.sort(byPosition)
  for (const r of roots) finalize(r)

  return { chapters: roots, rootQuestions }
}

/** Profondeur d'un chapitre (1 = racine). Cycle éventuel → profondeur max. */
export function chapterDepth(
  chapters: CourseChapter[],
  chapterId: string,
): number {
  const byId = new Map(chapters.map((c) => [c.id, c]))
  let depth = 1
  let current = byId.get(chapterId)
  const seen = new Set<string>([chapterId])
  while (current && current.parentChapterId !== null) {
    if (seen.has(current.parentChapterId)) return MAX_CHAPTER_DEPTH
    seen.add(current.parentChapterId)
    current = byId.get(current.parentChapterId)
    depth += 1
    if (depth >= MAX_CHAPTER_DEPTH) return depth
  }
  return depth
}

/** Hauteur du sous-arbre enraciné en `chapterId` (1 = feuille). */
function subtreeHeight(chapters: CourseChapter[], chapterId: string): number {
  const children = chapters.filter((c) => c.parentChapterId === chapterId)
  if (children.length === 0) return 1
  return 1 + Math.max(...children.map((c) => subtreeHeight(chapters, c.id)))
}

/**
 * Peut-on déplacer `chapterId` sous `newParentId` (null = racine) ?
 * Interdit : se déplacer sous soi-même ou un descendant (cycle), ou dépasser
 * MAX_CHAPTER_DEPTH une fois le sous-arbre déplacé.
 */
export function canMoveChapter(
  chapters: CourseChapter[],
  chapterId: string,
  newParentId: string | null,
): boolean {
  if (newParentId === null) return true
  if (newParentId === chapterId) return false
  const byId = new Map(chapters.map((c) => [c.id, c]))
  if (!byId.has(newParentId)) return false
  // Remonte depuis le nouveau parent : si on croise chapterId, c'est un cycle.
  let cursor = byId.get(newParentId)
  const seen = new Set<string>()
  while (cursor) {
    if (cursor.id === chapterId) return false
    if (seen.has(cursor.id)) break
    seen.add(cursor.id)
    cursor =
      cursor.parentChapterId !== null
        ? byId.get(cursor.parentChapterId)
        : undefined
  }
  const parentDepth = chapterDepth(chapters, newParentId)
  return parentDepth + subtreeHeight(chapters, chapterId) <= MAX_CHAPTER_DEPTH
}

// --- Statistiques ----------------------------------------------------------------
export type AttemptRow = {
  questionId: string
  isCorrect: boolean
  answeredAt: string
}

export type CourseStats = {
  totalAttempts: number
  correctAttempts: number
  /** % de bonnes réponses, arrondi — null si aucune tentative. */
  successPct: number | null
  /** Questions jamais tentées / en échec au dernier essai / maîtrisées. */
  neverSeen: number
  struggling: number
  mastered: number
}

/**
 * Statistiques d'un cours à partir des tentatives : le « dernier essai » d'une
 * question décide de son état (maîtrisée / à retravailler).
 */
export function computeCourseStats(
  questionIds: string[],
  attempts: AttemptRow[],
): CourseStats {
  const totalAttempts = attempts.length
  const correctAttempts = attempts.filter((a) => a.isCorrect).length

  const lastByQuestion = new Map<string, AttemptRow>()
  for (const a of attempts) {
    const prev = lastByQuestion.get(a.questionId)
    if (!prev || a.answeredAt > prev.answeredAt) {
      lastByQuestion.set(a.questionId, a)
    }
  }

  let neverSeen = 0
  let struggling = 0
  let mastered = 0
  for (const id of questionIds) {
    const last = lastByQuestion.get(id)
    if (!last) neverSeen += 1
    else if (last.isCorrect) mastered += 1
    else struggling += 1
  }

  return {
    totalAttempts,
    correctAttempts,
    successPct:
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : null,
    neverSeen,
    struggling,
    mastered,
  }
}

// --- File de questions d'une session ---------------------------------------------
/**
 * Les questions jouables d'une session : tout le cours (chapterId null) ou un
 * chapitre + ses descendants. Ordre : questions hors chapitre puis parcours en
 * profondeur de l'arbre — l'ordre visuel de la liste.
 */
export function sessionQuestions(
  chapters: CourseChapter[],
  questions: CourseQuestion[],
  chapterId: string | null,
): CourseQuestion[] {
  const { chapters: tree, rootQuestions } = buildCourseTree(chapters, questions)

  const collect = (node: ChapterNode): CourseQuestion[] => [
    ...node.questions,
    ...node.children.flatMap(collect),
  ]

  const findNode = (nodes: ChapterNode[]): ChapterNode | null => {
    for (const n of nodes) {
      if (n.id === chapterId) return n
      const found = findNode(n.children)
      if (found) return found
    }
    return null
  }

  const pool =
    chapterId === null
      ? [...rootQuestions, ...tree.flatMap(collect)]
      : (() => {
          const node = findNode(tree)
          return node ? collect(node) : []
        })()

  return pool.filter((q) => isQuestionReady(q.type, q.content))
}
