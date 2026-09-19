// -----------------------------------------------------------------------------
// L'EXERCICE DE CHAPITRE — un faux contrôle rédigé par l'IA, corrigé par l'IA.
//
// Lucas, 16/09/2026 : « défi devient exercice, où tu crées volontairement le
// côté faux contrôle : ex. pour les maths un problème, un texte à traduire pour
// l'anglais ». C'est la tuile « Se tester » qui ne rejoue PAS les huit
// questions du quiz : une copie qu'on rédige, un barème, une note sur 20.
//
// Ici la logique PURE : le style d'exercice selon la matière, les deux prompts
// (rédaction, correction), et la lecture STRICTE de ce que le modèle renvoie —
// un modèle se trompe, invente des champs, dépasse le barème. Rien de ce qui
// vient de lui n'est cru sur parole : la note est RECALCULÉE depuis les points
// par critère, chacun borné à son maximum. Les actions serveur (app/reviser/…/
// exercice/actions.ts) ne font qu'appeler et ranger.
// -----------------------------------------------------------------------------

/** Toute copie est notée sur 20 — le barème que l'élève connaît. */
export const EXERCICE_SUR = 20
/** Durée d'un contrôle, en minutes : le modèle propose, on borne. */
export const EXERCICE_DUREE_MIN = 5
export const EXERCICE_DUREE_MAX = 20
export const EXERCICE_DUREE_DEFAUT = 10
/** Une copie : assez pour une traduction ou un problème, pas pour un roman. */
export const REPONSE_MAX_LEN = 6_000
/** Le cours envoyé au modèle est rogné (jetons, prix, temps de réponse). */
export const COURS_MAX_LEN = 9_000
/** Nombre de critères du barème : assez pour nuancer, pas de quoi noyer. */
export const BAREME_MIN = 2
export const BAREME_MAX = 5

/**
 * Le STYLE du contrôle : ce que la matière demande vraiment en classe.
 *
 *   probleme     maths : un problème en questions enchaînées, réponse rédigée
 *   traduction   langues : un texte à traduire (thème ou version)
 *   redaction    lettres, histoire-géo, philo, SES : un paragraphe argumenté
 *   application  sciences, techno, NSI : un exercice d'application chiffré
 */
export type StyleExercice = 'probleme' | 'traduction' | 'redaction' | 'application'

const STYLES_PAR_MOT: readonly [RegExp, StyleExercice][] = [
  [/math/i, 'probleme'],
  [/anglais|espagnol|allemand|italien|latin|grec|chinois|portugais|arabe|russe|langue|lv[12]/i, 'traduction'],
  [/physique|chimie|svt|science|techno|nsi|informatique|sciences?[-_ ]?ing/i, 'application'],
]

/** Le style d'exercice d'une matière, deviné à son slug puis à son nom. */
export function styleExercice(subjectSlug: string, subjectName = ''): StyleExercice {
  const cle = `${subjectSlug} ${subjectName}`
  for (const [motif, style] of STYLES_PAR_MOT) if (motif.test(cle)) return style
  return 'redaction'
}

/** Le nom du style, tel que l'élève le lit sur la consigne. */
export function libelleStyle(style: StyleExercice): string {
  switch (style) {
    case 'probleme':
      return 'Problème'
    case 'traduction':
      return 'Texte à traduire'
    case 'application':
      return 'Exercice d’application'
    default:
      return 'Question rédigée'
  }
}

/** La consigne de STYLE donnée au modèle : ce que doit être l'épreuve. */
export function consigneStyle(style: StyleExercice): string {
  switch (style) {
    case 'probleme':
      return 'Un PROBLÈME de mathématiques en 2 à 4 questions enchaînées, avec des données chiffrées, dont la résolution demande de rédiger les étapes et de justifier. Pas de QCM.'
    case 'traduction':
      return "Un TEXTE À TRADUIRE de 4 à 7 phrases (thème : du français vers la langue étudiée, ou version : de la langue étudiée vers le français — choisis ce qui exerce le mieux le point de grammaire ou le vocabulaire du chapitre), qui mobilise les structures du chapitre. Le texte est l'énoncé ; l'élève rend sa traduction."
    case 'application':
      return "Un EXERCICE D'APPLICATION en 2 à 4 questions, avec une situation concrète et des données, qui demande d'appliquer les notions du chapitre (calcul, schéma décrit en mots, raisonnement) et de rédiger la démarche. Pas de QCM."
    default:
      return "Une QUESTION RÉDIGÉE (ou deux au plus) qui demande un paragraphe argumenté ou une analyse, appuyé sur les notions du chapitre : définir, expliquer, illustrer par un exemple. Pas de QCM."
  }
}

/**
 * LA DIFFICULTÉ d'un sujet (Lucas, 17/09/2026 : « des exos par difficulté par
 * chapitre »). Chaque fiche porte trois sujets écrits d'avance, un par
 * niveau ; l'élève choisit le sien avant de commencer.
 *
 *   1 facile     restituer ou appliquer directement une notion
 *   2 moyen      appliquer dans une situation concrète, en quelques étapes
 *   3 difficile  combiner plusieurs notions et justifier
 */
export type Difficulte = 1 | 2 | 3
export const DIFFICULTES: readonly Difficulte[] = [1, 2, 3]
export const DIFFICULTE_DEFAUT: Difficulte = 1

export function estDifficulte(v: unknown): v is Difficulte {
  return v === 1 || v === 2 || v === 3
}

export function libelleDifficulte(d: Difficulte): string {
  return d === 1 ? 'Facile' : d === 2 ? 'Moyen' : 'Difficile'
}

/** Ce que le niveau demande, dit au modèle quand il rédige un sujet neuf. */
export function consigneDifficulte(d: Difficulte): string {
  switch (d) {
    case 1:
      return 'Niveau FACILE : restitution ou application directe d’une notion du cours, 5 à 8 minutes, 2 ou 3 critères.'
    case 2:
      return 'Niveau MOYEN : application dans une situation concrète, en 2 ou 3 étapes, 8 à 12 minutes, 3 ou 4 critères.'
    default:
      return 'Niveau DIFFICILE : un sujet qui combine plusieurs notions du chapitre et demande de justifier ou d’analyser, 12 à 20 minutes, 3 à 5 critères.'
  }
}

export type CritereBareme = { critere: string; points: number }

/** L'exercice tel que rangé en base et servi à l'écran. */
export type Exercice = {
  titre: string
  /** Ce que l'élève doit faire, en une ou deux phrases. */
  consigne: string
  /** L'épreuve elle-même (énoncé, texte, questions), en Markdown léger. */
  enonce: string
  /** Le barème, dont les points font EXERCICE_SUR. */
  bareme: CritereBareme[]
  /** Durée conseillée, en minutes, bornée. */
  dureeMin: number
  /**
   * Le corrigé type d'un sujet ÉCRIT D'AVANCE (catalogue). Il ne part JAMAIS
   * vers l'élève avant la copie (cf. exercicePublic) : il sert de référence
   * au correcteur, puis de corrigé affiché.
   */
  corrige?: string
}

export type PointsCritere = {
  critere: string
  obtenu: number
  maximum: number
  commentaire: string
}

/** La correction, recalculée depuis les points par critère. */
export type Correction = {
  note: number
  sur: number
  points: PointsCritere[]
  /** Le mot du correcteur : ce qui va, ce qui manque, en 2 à 4 phrases. */
  bilan: string
  /** Le corrigé type, en Markdown léger. */
  corrige: string
}

/** Durée en secondes du contrôle, bornée. */
export function dureeExerciceSecondes(dureeMin: number): number {
  const m = Number.isFinite(dureeMin) ? Math.round(dureeMin) : EXERCICE_DUREE_DEFAUT
  return Math.max(EXERCICE_DUREE_MIN, Math.min(EXERCICE_DUREE_MAX, m)) * 60
}

const texte = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

/**
 * Normalise un barème : critères non vides, points entiers > 0, de 2 à 5
 * lignes, et la SOMME ramenée à EXERCICE_SUR (le modèle rend souvent 18 ou 22).
 * `null` si rien d'exploitable.
 */
export function normaliserBareme(brut: unknown): CritereBareme[] | null {
  if (!Array.isArray(brut)) return null
  const lignes: CritereBareme[] = []
  for (const item of brut) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const critere = texte(o.critere, 160)
    const points = Number(o.points)
    if (!critere || !Number.isFinite(points) || points <= 0) continue
    lignes.push({ critere, points })
    if (lignes.length >= BAREME_MAX) break
  }
  if (lignes.length < BAREME_MIN) return null

  // Répartition proportionnelle en entiers, le reste sur le premier critère.
  const total = lignes.reduce((s, l) => s + l.points, 0)
  const ajustees = lignes.map((l) => ({
    critere: l.critere,
    points: Math.max(1, Math.round((l.points / total) * EXERCICE_SUR)),
  }))
  const ecart = EXERCICE_SUR - ajustees.reduce((s, l) => s + l.points, 0)
  ajustees[0] = { ...ajustees[0], points: Math.max(1, ajustees[0].points + ecart) }
  // Si l'arrondi a poussé le premier sous 1, la somme n'est plus 20 : on
  // recale sur le dernier, qui a de la marge.
  const somme = ajustees.reduce((s, l) => s + l.points, 0)
  if (somme !== EXERCICE_SUR) {
    const dernier = ajustees.length - 1
    ajustees[dernier] = {
      ...ajustees[dernier],
      points: ajustees[dernier].points + (EXERCICE_SUR - somme),
    }
  }
  return ajustees
}

/** Lit l'exercice renvoyé par le modèle. `null` s'il est inutilisable. */
export function parseExercice(brut: unknown): Exercice | null {
  if (!brut || typeof brut !== 'object') return null
  const o = brut as Record<string, unknown>
  const titre = texte(o.titre, 120)
  const consigne = texte(o.consigne, 600)
  const enonce = texte(o.enonce, 4_000)
  const bareme = normaliserBareme(o.bareme)
  if (!titre || !consigne || !enonce || !bareme) return null
  // `duree_min` (réponse du modèle, catalogue) ou `dureeMin` (rangé en base).
  const dureeMin = dureeExerciceSecondes(Number(o.duree_min ?? o.dureeMin)) / 60
  const corrige = texte(o.corrige, 4_000)
  return corrige
    ? { titre, consigne, enonce, bareme, dureeMin, corrige }
    : { titre, consigne, enonce, bareme, dureeMin }
}

/** L'exercice tel qu'il part vers l'élève : sans son corrigé. */
export function exercicePublic(ex: Exercice): Exercice {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { corrige, ...sujet } = ex
  return sujet
}

/**
 * Lit la correction renvoyée par le modèle, CONTRE le barème de l'exercice :
 * chaque critère du barème reçoit les points que le modèle lui attribue,
 * bornés à son maximum ; un critère oublié vaut 0 ; un critère inventé est
 * ignoré. La note est la somme — jamais celle que le modèle annonce.
 */
export function parseCorrection(
  brut: unknown,
  bareme: CritereBareme[],
  corrigeReference = '',
): Correction | null {
  if (!brut || typeof brut !== 'object') return null
  const o = brut as Record<string, unknown>
  const bilan = texte(o.bilan, 1_200)
  // Un sujet du catalogue a SON corrigé, relu : c'est lui qu'on affiche.
  const corrige = corrigeReference.trim() || texte(o.corrige, 4_000)
  if (!bilan || !corrige) return null

  const lus = new Map<string, { obtenu: number; commentaire: string }>()
  if (Array.isArray(o.points)) {
    for (const item of o.points) {
      if (!item || typeof item !== 'object') continue
      const p = item as Record<string, unknown>
      const critere = texte(p.critere, 160)
      if (!critere) continue
      const obtenu = Number(p.obtenu)
      lus.set(cleCritere(critere), {
        obtenu: Number.isFinite(obtenu) ? obtenu : 0,
        commentaire: texte(p.commentaire, 400),
      })
    }
  }

  const points: PointsCritere[] = bareme.map((b) => {
    const lu = lus.get(cleCritere(b.critere))
    const obtenu = lu ? Math.max(0, Math.min(b.points, Math.round(lu.obtenu * 2) / 2)) : 0
    return {
      critere: b.critere,
      obtenu,
      maximum: b.points,
      commentaire: lu?.commentaire ?? '',
    }
  })
  const note = Math.max(
    0,
    Math.min(EXERCICE_SUR, points.reduce((s, p) => s + p.obtenu, 0)),
  )
  return { note, sur: EXERCICE_SUR, points, bilan, corrige }
}

/** Clé de rapprochement d'un critère : sans accents, sans casse, sans ponctuation. */
function cleCritere(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Part de la note, 0..1. */
export function noteRatio(note: number, sur: number): number {
  if (sur <= 0) return 0
  return Math.max(0, Math.min(1, note / sur))
}

/** Le mot qui accompagne la note — le ton d'un bulletin, pas d'un jeu. */
export function appreciation(note: number, sur: number = EXERCICE_SUR): string {
  const r = noteRatio(note, sur)
  if (r >= 0.9) return 'Excellent'
  if (r >= 0.75) return 'Très bien'
  if (r >= 0.6) return 'Bien'
  if (r >= 0.5) return 'Assez bien'
  if (r >= 0.35) return 'Peut mieux faire'
  return 'À retravailler'
}

/**
 * Le cours du chapitre, aplati pour le modèle : titre de leçon puis contenu,
 * rogné à COURS_MAX_LEN. Les leçons vides sont sautées.
 */
export function extraitCours(
  lessons: readonly { title: string; content: string | null }[],
  max = COURS_MAX_LEN,
): string {
  const parties = lessons
    .filter((l) => (l.content ?? '').trim().length > 0)
    .map((l) => `## ${l.title.trim()}\n${(l.content ?? '').trim()}`)
  return parties.join('\n\n').slice(0, max)
}

export type ContexteExercice = {
  matiere: string
  /** La classe (« 3e », « Terminale »), ou vide. */
  niveau: string
  chapitre: string
  /** Le cours aplati (extraitCours). */
  cours: string
  style: StyleExercice
  difficulte?: Difficulte
}

/** Les deux messages de la RÉDACTION de l'exercice. */
export function promptExercice(ctx: ContexteExercice): { system: string; user: string } {
  const system = `Tu es un professeur français de ${ctx.matiere}. Tu rédiges un CONTRÔLE court, en français, pour un élève${ctx.niveau ? ` de ${ctx.niveau}` : ''}, sur le chapitre « ${ctx.chapitre} ».
Forme attendue : ${consigneStyle(ctx.style)}
${ctx.difficulte ? `${consigneDifficulte(ctx.difficulte)}\n` : ''}L'épreuve doit pouvoir se faire en ${EXERCICE_DUREE_MIN} à ${EXERCICE_DUREE_MAX} minutes, à l'écrit, sans document. Elle s'appuie STRICTEMENT sur le cours fourni (pas de notion hors programme).
Réponds UNIQUEMENT avec un objet JSON, sans texte autour :
{"titre":"…","consigne":"ce que l'élève doit faire, 1 à 2 phrases","enonce":"l'épreuve en Markdown léger (questions numérotées, texte à traduire, données)","bareme":[{"critere":"…","points":8},{"critere":"…","points":6}],"duree_min":10}
Le barème compte ${BAREME_MIN} à ${BAREME_MAX} critères et ses points font ${EXERCICE_SUR}.`
  const user = `<cours>\n${ctx.cours}\n</cours>`
  return { system, user }
}

/** Les deux messages de la CORRECTION d'une copie. */
export function promptCorrection(input: {
  matiere: string
  niveau: string
  exercice: Exercice
  reponse: string
}): { system: string; user: string } {
  const { matiere, niveau, exercice, reponse } = input
  const bareme = exercice.bareme
    .map((b) => `- ${b.critere} : ${b.points} points`)
    .join('\n')
  // Sujet du catalogue : son corrigé de référence guide la notation.
  const reference = exercice.corrige
    ? `\n<corrige_de_reference>\n${exercice.corrige}\n</corrige_de_reference>`
    : ''
  const system = `Tu es un professeur français de ${matiere}. Tu corriges la copie d'un élève${niveau ? ` de ${niveau}` : ''} avec bienveillance et exigence : tu attribues des points PAR CRITÈRE du barème, tu expliques en une phrase ce qui vaut ou manque, puis tu donnes un corrigé type.
Une copie vide ou hors sujet vaut 0 à chaque critère. Si un corrigé de référence est fourni, note par rapport à lui (une réponse juste formulée autrement vaut les points).${exercice.corrige ? ' Le champ "corrige" peut alors rester une chaîne courte.' : ''} Ne dépasse jamais le maximum d'un critère. Réponds en français.
Réponds UNIQUEMENT avec un objet JSON, sans texte autour :
{"points":[{"critere":"intitulé EXACT du critère","obtenu":6,"commentaire":"une phrase"}],"bilan":"2 à 4 phrases à l'élève : ce qui va, ce qui manque, un conseil","corrige":"le corrigé type en Markdown léger"}`
  const user = `<exercice>
Titre : ${exercice.titre}
Consigne : ${exercice.consigne}
Énoncé :
${exercice.enonce}
Barème :
${bareme}
</exercice>${reference}
<copie>
${reponse.trim().slice(0, REPONSE_MAX_LEN) || '(copie vide)'}
</copie>`
  return { system, user }
}
