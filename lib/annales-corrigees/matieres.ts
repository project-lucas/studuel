// Les matières des annales corrigées : leur nom, et la vignette qui les
// représente (la même que le médaillon du dossier dans Réviser).
//
// Module sans dépendance : il est lu par l'écran ET par le script qui habille
// les sujets PDF (`scripts/annales-sujets.mjs`), qui en garde une copie.

export const MATIERES_ANNALES = {
  philosophie: { court: 'Philosophie', long: 'Philosophie', vignette: 'philosophie' },
  hlp: { court: 'HLP', long: 'Humanités, littérature et philosophie', vignette: 'philosophie' },
  hggsp: {
    court: 'HGGSP',
    long: 'Histoire-géographie, géopolitique et sciences politiques',
    vignette: 'hggsp',
  },
  ses: { court: 'SES', long: 'Sciences économiques et sociales', vignette: 'ses' },
  maths: { court: 'Maths', long: 'Mathématiques', vignette: 'maths' },
  'physique-chimie': { court: 'Physique-chimie', long: 'Physique-chimie', vignette: 'physique-chimie' },
  svt: { court: 'SVT', long: 'Sciences de la vie et de la Terre', vignette: 'svt' },
  nsi: { court: 'NSI', long: 'Numérique et sciences informatiques', vignette: 'nsi' },
  francais: { court: 'Français', long: 'Français', vignette: 'francais' },
  // Le brevet : l’épreuve d’histoire-géographie comprend l’EMC.
  'histoire-geo': {
    court: 'Histoire-géo',
    long: 'Histoire-géographie et enseignement moral et civique',
    vignette: 'histoire-geo',
  },
} as const

export type MatiereAnnale = keyof typeof MATIERES_ANNALES

export function estMatiereAnnale(slug: string): slug is MatiereAnnale {
  return Object.hasOwn(MATIERES_ANNALES, slug)
}
