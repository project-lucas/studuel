// -----------------------------------------------------------------------------
// Les RÉGIMES d'apprentissage — la doctrine de Marcel, rendue exécutable.
//
// « On ne révise pas l'histoire comme les maths. » C'est la seule chose que
// Marcel sait faire et qu'un modèle de langage ne saura jamais faire à sa place,
// parce que ce n'est pas une réponse : c'est une méthode, écrite d'avance et
// opposable. Elle vit donc ICI, en logique pure et testée — aucun accès base,
// aucun appel réseau, aucun token dépensé.
//
// Quatre régimes, et un seul par matière (voir `REGIME_BY_SUBJECT`). Le régime
// pilote tout ce que Marcel dit et propose : la séance type, ce qu'on mesure, le
// piège à nommer. Les composants ne décident de rien — ils affichent.
//
// Convention projet : les clés sont les `subjects.slug` de la base (cf.
// lib/subject-style.ts, qui porte déjà les sigles de ces mêmes slugs).
// -----------------------------------------------------------------------------

/**
 * Les quatre façons d'apprendre.
 *
 *  - `pratique`     — le geste. Seule la répétition d'exercices fait la note.
 *  - `restitution`  — la carte. Ce n'est pas la quantité qui paie, c'est l'ordre.
 *  - `expression`   — la voix. On note la façon d'articuler, pas le savoir.
 *  - `langue`       — la fréquence. Dix minutes par jour battent deux heures.
 */
export type Regime = 'pratique' | 'restitution' | 'expression' | 'langue'

/** Un bloc de la séance type d'un régime. `share` = part des minutes totales. */
export type SeanceBloc = {
  key: string
  title: string
  hint: string
  share: number
}

/** Un bloc de séance une fois les minutes réparties. */
export type SeanceEtape = SeanceBloc & { minutes: number }

export type RegimeSpec = {
  key: Regime
  /** Nom court affiché en cartouche (« la pratique »). */
  name: string
  /** Ce que Marcel dit de la matière, à la première personne. Sa voix. */
  marcel: string
  /** Ce que Marcel mesure dans ce régime — jamais la même chose d'un régime à l'autre. */
  mesure: string
  /**
   * La consigne du jour, à l'impératif et en une ligne. C'est elle qui passe
   * sous le diagnostic du point du jour : le « comment » qui distingue Marcel
   * d'une simple file de révisions.
   */
  consigne: string
  /** Le piège que l'élève tombe dedans s'il ne l'entend pas. */
  piege: string
  /** La séance type, dans l'ordre. */
  seance: SeanceBloc[]
}

// ----------------------------------------------------------------- la doctrine

export const REGIMES: Record<Regime, RegimeSpec> = {
  pratique: {
    key: 'pratique',
    name: 'la pratique',
    marcel:
      'Ici, seule la pratique compte. Relire un exercice corrigé ne t’apprend rien — c’est en le refaisant seul, sans le corrigé sous les yeux, que ça rentre.',
    mesure: 'ta réussite à froid',
    consigne: 'On refait, on ne relit pas.',
    piege:
      '« J’ai compris » n’est pas « je sais faire ». Celui qui relit se croit prêt.',
    seance: [
      {
        key: 'attaque',
        title: 'Zéro lecture',
        hint: 'On attaque directement par un exercice',
        share: 0.4,
      },
      {
        key: 'correction',
        title: 'Correction à chaud',
        hint: 'Tant que l’erreur est encore fraîche',
        share: 0.2,
      },
      {
        key: 'refaire',
        title: 'Le même type, refait seul',
        hint: 'C’est ce troisième temps qui fait la note',
        share: 0.4,
      },
    ],
  },

  restitution: {
    key: 'restitution',
    name: 'la restitution',
    marcel:
      'Ici, ce n’est pas la quantité de travail qui paie, c’est l’ordre. Si tu ne peux pas me raconter le chapitre en 90 secondes sans tes notes, tu ne le sais pas.',
    mesure: 'ce que tu restitues sans support',
    consigne: 'Cours fermé : tu redis, puis tu vérifies.',
    piege:
      'Le surlignage. Trois heures de fluo, et zéro rappel actif au bout.',
    seance: [
      {
        key: 'plan',
        title: 'Le plan d’abord',
        hint: 'Les grandes parties, avant le détail',
        share: 0.25,
      },
      {
        key: 'avide',
        title: 'Restituer à vide',
        hint: 'Cours fermé — c’est là que ça travaille',
        share: 0.5,
      },
      {
        key: 'trous',
        title: 'Rouvrir sur les trous',
        hint: 'Seulement ce que tu n’as pas su redire',
        share: 0.25,
      },
    ],
  },

  expression: {
    key: 'expression',
    name: 'l’expression',
    marcel:
      'Ici, on ne te note pas sur ce que tu sais, mais sur la façon dont tu l’articules. On travaille donc l’intro et l’annonce de plan.',
    mesure: 'le rituel tenu',
    consigne: 'À voix haute, debout, sans notes.',
    piege:
      'Apprendre le cours par cœur en croyant que ça suffira. C’est la forme qui se note.',
    seance: [
      {
        key: 'intro',
        title: 'Une intro, chrono',
        hint: 'Accroche, problématique, annonce de plan',
        share: 0.35,
      },
      {
        key: 'voix',
        title: 'À voix haute',
        hint: 'Debout, sans notes — l’app n’écoute pas',
        share: 0.45,
      },
      {
        key: 'ecoute',
        title: 'Te réécouter',
        hint: 'Intro claire ? plan annoncé ? transitions ?',
        share: 0.2,
      },
    ],
  },

  langue: {
    key: 'langue',
    name: 'la fréquence',
    marcel:
      'Ici, dix minutes tous les jours battent deux heures le dimanche. Et il faut produire, pas seulement reconnaître.',
    mesure: 'tes jours d’exposition',
    consigne: 'Court, mais aujourd’hui — c’est la fréquence qui décide.',
    piege:
      'Le QCM de vocabulaire : on reconnaît le mot sans savoir le sortir.',
    seance: [
      {
        key: 'expo',
        title: 'Une exposition courte',
        hint: 'Un texte, un extrait, une écoute',
        share: 0.3,
      },
      {
        key: 'rappel',
        title: 'Rappel actif du vocabulaire',
        hint: 'De ta langue vers la sienne, jamais l’inverse',
        share: 0.4,
      },
      {
        key: 'produire',
        title: 'Produire une phrase',
        hint: 'Écrite puis dite — c’est le seul vrai test',
        share: 0.3,
      },
    ],
  },
}

// ------------------------------------------------------------- les matières

/**
 * Régime PRINCIPAL de chaque matière du catalogue (clé = `subjects.slug`).
 *
 * Les matières absentes de cette table sont « hors doctrine » : Marcel se tait
 * plutôt que de dire une bêtise (cf. `HORS_DOCTRINE`). C'est volontaire — un
 * prof crédible est un prof qui sait de quoi il ne parle pas.
 */
export const REGIME_BY_SUBJECT: Record<string, Regime> = {
  // Le geste : on ne progresse qu'en refaisant.
  maths: 'pratique',
  'maths-expertes': 'pratique',
  'physique-chimie': 'pratique',
  nsi: 'pratique',
  technologie: 'pratique',
  'finances-personnelles': 'pratique',
  fiscalite: 'pratique',

  // La carte : la note se joue sur l'organisation du propos.
  'histoire-geo': 'restitution',
  svt: 'restitution',
  ses: 'restitution',
  'enseignement-scientifique': 'restitution',
  economie: 'restitution',
  'figures-historiques': 'restitution',
  'culture-generale': 'restitution',

  // La voix : on note l'articulation des idées.
  francais: 'expression',
  philosophie: 'expression',
  hggsp: 'expression',
  entrepreneuriat: 'expression',

  // La fréquence : l'exposition quotidienne prime sur la séance longue.
  anglais: 'langue',
  espagnol: 'langue',
  allemand: 'langue',
  latin: 'langue',
  grec: 'langue',
}

/**
 * Matières où la pratique compte AUTANT que le régime principal — la version
 * en latin/grec est un geste, elle se répète comme un exercice de maths.
 */
export const REGIME_SECONDAIRE_BY_SUBJECT: Record<string, Regime> = {
  latin: 'pratique',
  grec: 'pratique',
}

/**
 * Matières que Marcel ne coache PAS : la pratique y est physique et se passe
 * hors de l'application. Elles restent au catalogue, il n'a simplement rien à
 * en dire.
 */
export const HORS_DOCTRINE: readonly string[] = [
  'musique',
  'sport',
  'arts-plastiques',
]

// ------------------------------------------------------------------- l'API

/** Régime d'une matière, ou `null` si Marcel n'a rien à dire dessus. */
export function regimeOf(slug: string): Regime | null {
  return REGIME_BY_SUBJECT[slug] ?? null
}

/** Régime secondaire (rare), ou `null`. */
export function regimeSecondaireOf(slug: string): Regime | null {
  return REGIME_SECONDAIRE_BY_SUBJECT[slug] ?? null
}

/** Marcel a-t-il une méthode pour cette matière ? */
export function hasRegime(slug: string): boolean {
  return regimeOf(slug) !== null
}

/** La doctrine complète d'une matière, ou `null` si elle est hors doctrine. */
export function specOf(slug: string): RegimeSpec | null {
  const regime = regimeOf(slug)
  return regime === null ? null : REGIMES[regime]
}

/** Toutes les matières d'un régime donné, dans l'ordre de la table. */
export function subjectsOfRegime(regime: Regime): string[] {
  return Object.keys(REGIME_BY_SUBJECT).filter(
    (slug) => REGIME_BY_SUBJECT[slug] === regime,
  )
}

// --------------------------------------------------------- la séance minutée

/** Durée plancher d'une séance : en dessous, les trois temps n'existent plus. */
export const SEANCE_MIN_MINUTES = 3

/**
 * Répartit `minutes` sur les blocs du régime, au prorata de leur `share`.
 *
 * La somme des minutes rendues est EXACTEMENT `minutes` (méthode des plus forts
 * restes) : un plan qui annonce 10 minutes et en distribue 9 fait mentir Marcel
 * dès le premier écran. Chaque bloc reçoit au moins 1 minute.
 */
export function seanceFor(regime: Regime, minutes: number): SeanceEtape[] {
  const blocs = REGIMES[regime].seance
  const total = Math.max(
    SEANCE_MIN_MINUTES,
    Number.isFinite(minutes) ? Math.floor(minutes) : SEANCE_MIN_MINUTES,
  )

  // 1 minute plancher par bloc, le reste réparti au prorata.
  const reste = total - blocs.length
  const bruts = blocs.map((b) => b.share * reste)
  const bas = bruts.map((v) => Math.floor(v))
  let distribue = bas.reduce((sum, v) => sum + v, 0)

  // Les minutes non attribuées par l'arrondi vont aux plus forts restes.
  const ordre = bruts
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)

  let k = 0
  while (distribue < reste) {
    bas[ordre[k % ordre.length].i] += 1
    distribue += 1
    k += 1
  }

  return blocs.map((bloc, i) => ({ ...bloc, minutes: 1 + bas[i] }))
}

/** La séance type d'une matière (`null` si elle est hors doctrine). */
export function seanceForSubject(
  slug: string,
  minutes: number,
): SeanceEtape[] | null {
  const regime = regimeOf(slug)
  return regime === null ? null : seanceFor(regime, minutes)
}
