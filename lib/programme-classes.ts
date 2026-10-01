import type { GradeLevel } from '@/lib/types'

/**
 * LE PROGRAMME OFFICIEL, CLASSE PAR CLASSE — ce que l'élève a FORCÉMENT
 * (`obligatoires`, cochées d'office à l'onboarding) et ce qui dépend de SES
 * choix (`aChoisir` : deuxième langue, spécialités, options — proposées mais
 * décochées). Une matière absente des deux listes n'est pas proposée du tout.
 *
 * La base (`subjects.levels`) dit où il y a du CONTENU ; cette table dit ce
 * qu'un élève de la classe suit vraiment. L'onboarding croise les deux.
 * Repères (Éducation nationale, rentrée 2025) :
 * - cycle 2 (CP → CE2) : pas encore d'histoire-géo, c'est « Questionner le
 *   monde » (ici sciences et technologie) ;
 * - la technologie a quitté la 6e à la rentrée 2023 ;
 * - la LV2 (allemand, espagnol) est un choix, l'anglais est la LV1 par défaut ;
 * - en 1re et Tle générales, maths, physique-chimie, SVT… sont des
 *   SPÉCIALITÉS (l'élève en garde trois, puis deux) ; latin et grec sont des
 *   options facultatives ;
 * - arts plastiques et musique s'arrêtent au collège (décision de Lucas,
 *   25/09/2026 : la spécialité et l'option « Arts » du lycée existent, mais
 *   l'app ne les propose pas) ;
 * - le Grand oral est une épreuve de Terminale seulement ;
 * - la culture générale (économie, fiscalité…) se débloque plus tard dans
 *   l'app : elle n'est jamais proposée ici.
 */
export type ProgrammeClasse = {
  obligatoires: readonly string[]
  aChoisir: readonly string[]
}

const LANGUES_VIVANTES_2 = ['allemand', 'espagnol'] as const

const PRIMAIRE_CYCLE_2: ProgrammeClasse = {
  obligatoires: [
    'francais',
    'maths',
    'anglais',
    'sciences-technologie',
    'emc',
    'arts-plastiques',
    'musique',
    'sport',
  ],
  aChoisir: [],
}

const PRIMAIRE_CYCLE_3: ProgrammeClasse = {
  obligatoires: [
    'francais',
    'maths',
    'anglais',
    'histoire-geo',
    'sciences-technologie',
    'emc',
    'arts-plastiques',
    'musique',
    'sport',
  ],
  aChoisir: [...LANGUES_VIVANTES_2],
}

const COLLEGE_TRONC = [
  'francais',
  'maths',
  'anglais',
  'histoire-geo',
  'emc',
  'svt',
  'physique-chimie',
  'arts-plastiques',
  'musique',
  'sport',
]

const SPECIALITES_GENERALES = [
  'maths',
  'physique-chimie',
  'svt',
  'ses',
  'hggsp',
  'hlp',
  'nsi',
  'si',
  'llcer-anglais',
]

const OPTIONS_LYCEE = ['latin', 'grec']

// Les spécialités de la voie technologique (migration 383), rangées par série :
// STMG, STI2D, ST2S, STL. Physique-chimie et mathématiques est commune à STI2D
// et STL : elle n'apparaît qu'une fois.
const SPECIALITES_TECHNO_1RE = [
  'sciences-gestion-numerique',
  'management',
  'droit-economie',
  'innovation-technologique',
  'ingenierie-dd',
  'physique-chimie-maths',
  'physique-chimie-sante',
  'biologie-physiopathologie',
  'sciences-sanitaires-sociales',
  'biochimie-biologie',
  'biotechnologies',
  'spcl',
]

const SPECIALITES_TECHNO_TLE = [
  'management-sgn',
  'droit-economie',
  'i2d',
  'physique-chimie-maths',
  'sciences-sanitaires-sociales',
  'chimie-biologie-physiopathologie',
  'biochimie-biologie-biotechnologie',
  'spcl',
]

export const PROGRAMME_PAR_CLASSE: Record<GradeLevel, ProgrammeClasse> = {
  CP: PRIMAIRE_CYCLE_2,
  CE1: PRIMAIRE_CYCLE_2,
  CE2: PRIMAIRE_CYCLE_2,
  CM1: PRIMAIRE_CYCLE_3,
  CM2: PRIMAIRE_CYCLE_3,
  '6e': {
    obligatoires: COLLEGE_TRONC,
    // Classe bilangue : une seconde langue dès la 6e, sur choix.
    aChoisir: [...LANGUES_VIVANTES_2],
  },
  '5e': {
    obligatoires: [...COLLEGE_TRONC, 'technologie'],
    aChoisir: [...LANGUES_VIVANTES_2, 'latin'],
  },
  '4e': {
    obligatoires: [...COLLEGE_TRONC, 'technologie'],
    aChoisir: [...LANGUES_VIVANTES_2, 'latin'],
  },
  '3e': {
    obligatoires: [...COLLEGE_TRONC, 'technologie'],
    aChoisir: [...LANGUES_VIVANTES_2, 'latin', 'grec'],
  },
  '2de': {
    obligatoires: [
      'francais',
      'maths',
      'anglais',
      'histoire-geo',
      'emc',
      'svt',
      'physique-chimie',
      'ses',
      'snt',
      'sport',
    ],
    aChoisir: [...LANGUES_VIVANTES_2, ...OPTIONS_LYCEE],
  },
  '1re': {
    obligatoires: [
      'francais',
      'anglais',
      'histoire-geo',
      'emc',
      'enseignement-scientifique',
      'sport',
    ],
    aChoisir: [...SPECIALITES_GENERALES, ...LANGUES_VIVANTES_2, ...OPTIONS_LYCEE],
  },
  // LA VOIE TECHNOLOGIQUE A SES PROPRES ENSEIGNEMENTS (migration 383) : ses
  // mathématiques et son histoire-géographie de tronc commun, sa philosophie en
  // Terminale, et les spécialités de sa série. La série n'étant pas demandée au
  // profil, toutes les spécialités techno sont PROPOSÉES (décochées) : l'élève
  // coche celles de sa série. Les matières de la voie générale gardent leurs
  // niveaux (rien n'est retiré), elles ne sont simplement plus proposées ici.
  '1re techno': {
    obligatoires: ['francais', 'maths-techno', 'anglais', 'histoire-geo-techno', 'emc', 'sport'],
    aChoisir: [...SPECIALITES_TECHNO_1RE, ...LANGUES_VIVANTES_2],
  },
  Tle: {
    obligatoires: [
      'philosophie',
      'anglais',
      'histoire-geo',
      'emc',
      'enseignement-scientifique',
      'grand-oral',
      'sport',
    ],
    aChoisir: [
      ...SPECIALITES_GENERALES,
      'maths-expertes',
      'maths-complementaires',
      ...LANGUES_VIVANTES_2,
      ...OPTIONS_LYCEE,
    ],
  },
  'Tle techno': {
    obligatoires: [
      'philosophie-techno',
      'maths-techno',
      'anglais',
      'histoire-geo-techno',
      'emc',
      'grand-oral',
      'sport',
    ],
    aChoisir: [...SPECIALITES_TECHNO_TLE, ...LANGUES_VIVANTES_2],
  },
}

/** Le programme d'une classe, ou `null` pour une classe inconnue. */
export function programmeDeClasse(grade: string | null): ProgrammeClasse | null {
  if (!grade) return null
  return (PROGRAMME_PAR_CLASSE as Record<string, ProgrammeClasse>)[grade] ?? null
}

/**
 * La matière a-t-elle sa place dans la classe ? Oui si le programme la prévoit
 * (obligatoire ou à choisir) et que l'app a du contenu à ce niveau — ou si
 * c'est de la culture générale, rangée à part, ouverte à tous. C'est LE
 * filtre de toute liste de matières d'une classe (onboarding, accueil
 * Réviser) : les classes de la base (`levels`) ne suffisent pas, elles disent
 * où il y a du contenu, pas ce que l'élève suit.
 */
export function estDansLaClasse(
  subject: { slug: string; category: string; levels: readonly string[] },
  grade: string,
): boolean {
  if (!subject.levels.includes(grade)) return false
  if (subject.category === 'culture') return true
  const programme = programmeDeClasse(grade)
  if (!programme) return false
  return (
    programme.obligatoires.includes(subject.slug) ||
    programme.aChoisir.includes(subject.slug)
  )
}

/** Le titre de la section « à choisir » : des spécialités au lycée général. */
export function titreAChoisir(grade: string | null): string {
  return grade === '1re' || grade === 'Tle'
    ? 'Tes spécialités et options'
    : 'Langues et options'
}
