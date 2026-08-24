// -----------------------------------------------------------------------------
// « COMMENT TU VEUX RÉVISER ? » — les réglages d'une session.
//
// Le menu « Réviser » du carnet proposait exactement deux choses : tout le
// cours, ou un chapitre. C'est tout ce que voulait dire « personnalisation »
// dans un produit qui se donne pour but d'en faire son avantage. Manquaient
// les cinq décisions qui changent vraiment une révision :
//
//   PORTÉE   — tout / un chapitre / mes erreurs / une étiquette
//   SENS     — recto→verso, verso→recto, ou les deux (vital en langues, et les
//              colonnes `langue_recto`/`langue_verso` dormaient déjà en base)
//   TYPES    — flashcards seules, QCM seuls, tout
//   LONGUEUR — 10 cartes, 20, ou tout ce qui est dû
//   MODE     — apprentissage (échéances respectées) / entraînement (tout
//              repasser, rien n'est planifié) / examen (tout, chronométré,
//              correction à la fin)
//
// Pur et testable. Le module ne CHOISIT pas les cartes (c'est `composerFile`) :
// il dit lesquelles ont le droit d'y entrer, et comment les présenter.
// -----------------------------------------------------------------------------

import type { CourseQuestionType } from '@/lib/carnet-cours'
import { QUESTION_TYPES } from '@/lib/carnet-cours'
import type { CardState } from '@/lib/carnet/planification'
import { estDue, estNouvelle } from '@/lib/carnet/planification'

export type Portee =
  | { kind: 'tout' }
  | { kind: 'chapitre'; chapterId: string }
  | { kind: 'erreurs' }
  | { kind: 'etiquette'; tagId: string }

export type Sens = 'recto-verso' | 'verso-recto' | 'mixte'
export type Mode = 'apprentissage' | 'entrainement' | 'examen'

export const SENS: readonly Sens[] = ['recto-verso', 'verso-recto', 'mixte']
export const MODES: readonly Mode[] = [
  'apprentissage',
  'entrainement',
  'examen',
]

export const SENS_LABEL: Record<Sens, string> = {
  'recto-verso': 'Recto → verso',
  'verso-recto': 'Verso → recto',
  mixte: 'Les deux au hasard',
}

export const MODE_LABEL: Record<Mode, string> = {
  apprentissage: 'Apprendre',
  entrainement: 'S’entraîner',
  examen: 'Examen blanc',
}

export const MODE_AIDE: Record<Mode, string> = {
  apprentissage: 'Ce qui est dû aujourd’hui — les échéances sont respectées',
  entrainement: 'Tout repasser, sans toucher aux échéances',
  examen: 'Tout, d’affilée, correction à la fin',
}

/** Longueurs proposées. `null` = tout ce qui entre dans la portée. */
export const LONGUEURS: readonly (number | null)[] = [10, 20, 40, null]

export type SessionOptions = {
  portee: Portee
  sens: Sens
  /** Types acceptés. Vide = tous (on ne stocke pas « tous » en extension). */
  types: CourseQuestionType[]
  longueur: number | null
  mode: Mode
}

export const OPTIONS_DEFAUT: SessionOptions = {
  portee: { kind: 'tout' },
  sens: 'recto-verso',
  types: [],
  longueur: null,
  mode: 'apprentissage',
}

const isType = (v: unknown): v is CourseQuestionType =>
  (QUESTION_TYPES as readonly unknown[]).includes(v)

/**
 * Relit des options venues du client (ou d'une session reprise) : tout ce qui
 * n'est pas reconnu retombe sur le défaut. Une session ne doit jamais échouer
 * parce qu'un réglage a mal voyagé.
 */
export function normalizeOptions(raw: unknown): SessionOptions {
  const o = (raw ?? {}) as Record<string, unknown>

  const p = (o.portee ?? {}) as Record<string, unknown>
  let portee: Portee = { kind: 'tout' }
  if (p.kind === 'chapitre' && typeof p.chapterId === 'string' && p.chapterId) {
    portee = { kind: 'chapitre', chapterId: p.chapterId }
  } else if (p.kind === 'erreurs') {
    portee = { kind: 'erreurs' }
  } else if (p.kind === 'etiquette' && typeof p.tagId === 'string' && p.tagId) {
    portee = { kind: 'etiquette', tagId: p.tagId }
  }

  const types = Array.isArray(o.types) ? o.types.filter(isType) : []

  const longueurBrute = o.longueur
  const longueur =
    typeof longueurBrute === 'number' &&
    Number.isFinite(longueurBrute) &&
    longueurBrute > 0
      ? Math.min(500, Math.floor(longueurBrute))
      : null

  return {
    portee,
    sens: (SENS as readonly unknown[]).includes(o.sens)
      ? (o.sens as Sens)
      : OPTIONS_DEFAUT.sens,
    // Dédoublonné : « flashcard, flashcard » ne veut rien dire de plus.
    types: [...new Set(types)],
    longueur,
    mode: (MODES as readonly unknown[]).includes(o.mode)
      ? (o.mode as Mode)
      : OPTIONS_DEFAUT.mode,
  }
}

/** Une carte candidate, vue par le filtre. */
export type CarteCandidate = {
  id: string
  type: CourseQuestionType
  chapterId: string | null
  /** Chapitres ANCÊTRES compris — l'appelant a déjà aplati l'arbre. */
  chapitresParents: string[]
  tagIds: string[]
  state: CardState
}

/**
 * Les cartes qui ont le droit d'entrer dans la session, avant plafonnement et
 * mélange (`composerFile` s'en charge ensuite).
 *
 * Le MODE décide de la place des échéances :
 *   • apprentissage → seules les cartes DUES entrent ;
 *   • entraînement et examen → tout entre, l'échéance ne filtre rien. C'est ce
 *     qu'on veut la veille d'un contrôle : repasser ce qu'on sait déjà.
 */
export function filtrerPourSession(
  cartes: readonly CarteCandidate[],
  options: SessionOptions,
  nowIso: string,
): CarteCandidate[] {
  const { portee, types, mode } = options

  return cartes.filter((c) => {
    // 1. La portée.
    if (portee.kind === 'chapitre') {
      const dedans =
        c.chapterId === portee.chapterId ||
        c.chapitresParents.includes(portee.chapterId)
      if (!dedans) return false
    } else if (portee.kind === 'etiquette') {
      if (!c.tagIds.includes(portee.tagId)) return false
    } else if (portee.kind === 'erreurs') {
      // « Mes erreurs » = les cartes qui coincent : déjà vues, et retombées en
      // apprentissage (rechute) ou marquées sangsues. Une carte jamais vue
      // n'est pas une erreur, c'est une inconnue.
      const coince =
        !estNouvelle(c.state) &&
        (c.state.phase === 'apprentissage' || c.state.isLeech)
      if (!coince) return false
    }

    // 2. Les types.
    if (types.length > 0 && !types.includes(c.type)) return false

    // 3. Les échéances — seulement en mode apprentissage.
    if (mode === 'apprentissage' && !estDue(c.state, nowIso)) return false

    return true
  })
}

/**
 * Le sens de présentation d'UNE flashcard, une fois le « mixte » tranché.
 * Le grain vient de l'appelant (jamais tiré ici) : même exigence de pureté que
 * le planificateur, et la session reprise retrouve le même sens.
 */
export function sensDeLaCarte(sens: Sens, grain: number): 'endroit' | 'envers' {
  if (sens === 'recto-verso') return 'endroit'
  if (sens === 'verso-recto') return 'envers'
  return grain < 0.5 ? 'endroit' : 'envers'
}

/**
 * La longueur effective d'une file : le réglage de l'élève, borné par ce qui
 * existe réellement. `null` veut dire « tout ».
 */
export function longueurEffective(
  disponibles: number,
  longueur: number | null,
): number {
  if (longueur === null) return disponibles
  return Math.max(0, Math.min(disponibles, longueur))
}

/**
 * Le mode écrit-il les échéances ? L'entraînement et l'examen ne planifient
 * RIEN : repasser vingt fois ses cartes la veille d'un contrôle ne doit pas
 * repousser leurs révisions de six mois. Seul l'apprentissage compte.
 */
export function modePlanifie(mode: Mode): boolean {
  return mode === 'apprentissage'
}

/** Le mode corrige-t-il au fil de l'eau, ou seulement à la fin ? */
export function correctionDifferee(mode: Mode): boolean {
  return mode === 'examen'
}

/** Un résumé lisible des options, pour l'en-tête de la session. */
export function resumeOptions(
  options: SessionOptions,
  nomChapitre?: string,
  nomEtiquette?: string,
): string {
  const portee =
    options.portee.kind === 'chapitre'
      ? (nomChapitre ?? 'Un chapitre')
      : options.portee.kind === 'etiquette'
        ? (nomEtiquette ?? 'Une étiquette')
        : options.portee.kind === 'erreurs'
          ? 'Mes erreurs'
          : 'Tout le cours'
  return `${portee} · ${MODE_LABEL[options.mode]}`
}
