// -----------------------------------------------------------------------------
// LE COURS ENTAMÉ — où l'élève s'est arrêté de lire (effet Zeigarnik, 28/10/2026).
//
// Un cours se valide tout seul quand on en atteint la fin (lib/lecture). Mais
// un élève qui le ferme au milieu repartait de zéro : le bouton de la fiche
// disait « Cours » comme au premier jour, et rien ne rappelait le chemin déjà
// fait. On garde ici, dans le navigateur, la part du texte LUE (la plus loin
// atteinte) : le dossier de matière dit « lu à 60 % », la carte de Réviser
// rappelle le cours, et le cours rouvert propose de reprendre à cet endroit.
//
// Rien côté serveur : une position de lecture n'est ni un acquis ni une
// récompense (même précédent que les favoris de thème). Contrepartie assumée :
// elle ne suit pas l'élève d'un appareil à l'autre.
//
// Pur et testé. L'enveloppe navigateur vit dans lib/lecture-entamee-local.
// -----------------------------------------------------------------------------

/** En dessous, l'élève a ouvert le cours, il ne l'a pas commencé. */
export const PART_MIN = 0.1
/** Au-delà, il l'a lu : la validation est l'affaire de lib/lecture. */
export const PART_MAX = 0.95

/** Un mois : au-delà, « reprendre où tu t'étais arrêté » ne veut plus rien dire. */
export const LECTURE_DUREE_MS = 30 * 24 * 60 * 60 * 1000

/** Le nombre de cours gardés à la fois — les plus récents. */
export const LECTURES_MAX = 40

export type LectureEntamee = {
  lessonId: string
  /** Le titre de la fiche (celui de la page du cours). */
  titre: string
  matiere: string | null
  subjectSlug: string | null
  /** L'adresse du cours. */
  href: string
  /** La part du texte atteinte, 0..1 — la plus loin. */
  part: number
  at: string
}

export type StockLectures = Readonly<Record<string, LectureEntamee>>

const STOCK_VIDE: StockLectures = Object.freeze({})

const estTexte = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= max

/** Une adresse de cours de l'app, et rien d'autre (jamais un lien externe). */
const HREF_COURS = /^\/reviser\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/cours$/

export function parserLecture(valeur: unknown): LectureEntamee | null {
  if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur)) return null
  const v = valeur as Record<string, unknown>
  if (!estTexte(v.lessonId, 64) || !estTexte(v.titre, 200) || !estTexte(v.at, 40)) return null
  if (Number.isNaN(Date.parse(v.at))) return null
  if (!estTexte(v.href, 260) || !HREF_COURS.test(v.href)) return null
  const matiere = v.matiere ?? null
  const slug = v.subjectSlug ?? null
  if (matiere !== null && !estTexte(matiere, 80)) return null
  if (slug !== null && !estTexte(slug, 80)) return null
  if (typeof v.part !== 'number' || !Number.isFinite(v.part)) return null
  return {
    lessonId: v.lessonId,
    titre: v.titre,
    matiere: matiere as string | null,
    subjectSlug: slug as string | null,
    href: v.href,
    part: Math.max(0, Math.min(1, v.part)),
    at: v.at,
  }
}

const horodatage = (l: { at: string }) => Date.parse(l.at) || 0

function garderLesPlusRecentes(stock: Record<string, LectureEntamee>): StockLectures {
  const tries = Object.values(stock).sort((a, b) => horodatage(b) - horodatage(a))
  return Object.fromEntries(tries.slice(0, LECTURES_MAX).map((l) => [l.lessonId, l]))
}

export function parserStockLectures(brut: string | null): StockLectures {
  if (!brut) return STOCK_VIDE
  try {
    const valeur: unknown = JSON.parse(brut)
    if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur)) return STOCK_VIDE
    const stock: Record<string, LectureEntamee> = {}
    for (const brute of Object.values(valeur).slice(0, LECTURES_MAX * 2)) {
      const l = parserLecture(brute)
      if (l) stock[l.lessonId] = l
    }
    return garderLesPlusRecentes(stock)
  } catch {
    return STOCK_VIDE
  }
}

/**
 * Le stock avec la lecture avancée. La part ne RECULE jamais : remonter relire
 * le titre en fin de cours ne doit pas effacer le chemin fait. L'horodatage,
 * lui, avance toujours — c'est la dernière visite.
 */
export function avecLecture(stock: StockLectures, l: LectureEntamee): StockLectures {
  const avant = stock[l.lessonId]
  const part = Math.max(avant?.part ?? 0, l.part)
  return garderLesPlusRecentes({ ...stock, [l.lessonId]: { ...l, part } })
}

export function sansLecture(stock: StockLectures, lessonId: string): StockLectures {
  if (!(lessonId in stock)) return stock
  return Object.fromEntries(Object.entries(stock).filter(([cle]) => cle !== lessonId))
}

/** Le cours est-il vraiment entamé, et pas trop vieux ? */
export function estEntamee(l: LectureEntamee, maintenant: number): boolean {
  const t = horodatage(l)
  return (
    l.part >= PART_MIN &&
    l.part < PART_MAX &&
    t > 0 &&
    maintenant - t >= 0 &&
    maintenant - t < LECTURE_DUREE_MS
  )
}

/** La lecture d'une leçon, si elle est entamée. */
export function lectureDe(
  stock: StockLectures,
  lessonId: string | null | undefined,
  maintenant: number,
): LectureEntamee | null {
  if (!lessonId) return null
  const l = stock[lessonId]
  return l && estEntamee(l, maintenant) ? l : null
}

/** Le cours entamé le plus récent — celui que la carte de Réviser rappelle. */
export function lectureARappeler(stock: StockLectures, maintenant: number): LectureEntamee | null {
  let meilleure: LectureEntamee | null = null
  for (const l of Object.values(stock)) {
    if (!estEntamee(l, maintenant)) continue
    if (!meilleure || horodatage(l) > horodatage(meilleure)) meilleure = l
  }
  return meilleure
}

/** « 60 % » — arrondi à la dizaine : une position de lecture n'est pas une mesure. */
export function pourcentLu(part: number): number {
  return Math.max(0, Math.min(100, Math.round(part * 10) * 10))
}

/**
 * La part du TEXTE atteinte par le bas de l'écran, 0..1. `debut` et `hauteur`
 * sont ceux du bloc du cours dans la page ; le bas de l'écran est
 * `defilement + hauteurEcran`.
 */
export function partAtteinte(input: {
  defilement: number
  hauteurEcran: number
  debut: number
  hauteur: number
}): number {
  const { defilement, hauteurEcran, debut, hauteur } = input
  if (!(hauteur > 0)) return 0
  const vu = defilement + hauteurEcran - debut
  return Math.max(0, Math.min(1, vu / hauteur))
}

/**
 * Où défiler pour reprendre : le haut de l'écran un peu AVANT l'endroit
 * atteint, pour relire la dernière phrase plutôt que tomber au milieu.
 */
export function defilementDeReprise(input: {
  part: number
  hauteurEcran: number
  debut: number
  hauteur: number
}): number {
  const { part, hauteurEcran, debut, hauteur } = input
  const bas = debut + part * hauteur
  return Math.max(0, Math.round(bas - hauteurEcran * 0.85))
}
