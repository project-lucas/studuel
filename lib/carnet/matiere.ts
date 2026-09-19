// -----------------------------------------------------------------------------
// UN DOSSIER DU CARNET ET SA MATIÈRE.
//
// Depuis le 10/09/2026 (Lucas), la feuille « Nouveau cours » pose une question
// de plus : « C'est pour quelle matière ? », avec les matières de Réviser
// (classe de l'élève et `selected_subjects`, cf. `matieresSuivies`). Deux
// raisons, toutes deux ici, pures et testées :
//   · L'ALLURE : le dossier hérite de l'icône et de la couleur de sa matière
//     (`allureDeMatiere`), au lieu de naître « livre violet » comme tous les
//     autres — cinq dossiers identiques rendaient la grille illisible ;
//   · LE DOUBLON : « anglais » ne se crée plus trois fois (`trouverDoublon`).
//     Même matière ET même titre (aux majuscules, accents et espaces près),
//     ou même titre sans matière : la feuille propose d'OUVRIR l'existant.
// La colonne `carnet_courses.subject_id` existe depuis la migration 316.
// -----------------------------------------------------------------------------

import type { CourseColor, CourseIcon } from '@/lib/carnet-cours'
import type { CoursCarnet } from './priorite'

/** Ce que la feuille de création sait d'une matière proposée. */
export type MatiereChoix = {
  id: string
  slug: string
  name: string
  /** L'emoji du catalogue (« 🧮 »), affiché sur la puce. */
  icon: string
  /** Le jeton de couleur du catalogue (« blue », « red »…). */
  color: string
}

/** Jeton de couleur du catalogue (`subjects.color`) → teinte pastel du carnet. */
const COULEUR_PAR_JETON: Record<string, CourseColor> = {
  blue: 'ciel',
  indigo: 'violet',
  purple: 'violet',
  red: 'corail',
  pink: 'corail',
  orange: 'sable',
  yellow: 'jaune',
  green: 'menthe',
  teal: 'menthe',
  slate: 'sable',
}

/**
 * Icône du carnet par matière, sur le SLUG : un slug est stable, un nom se
 * traduit. Les langues vivantes partagent « languages », les langues anciennes
 * le parchemin ; tout ce qui n'est pas listé garde le livre.
 */
const ICONE_PAR_SLUG: Record<string, CourseIcon> = {
  maths: 'calculator',
  'maths-complementaires': 'sigma',
  'maths-expertes': 'sigma',
  'physique-chimie': 'atom',
  svt: 'leaf',
  'enseignement-scientifique': 'microscope',
  'histoire-geo': 'landmark',
  hggsp: 'map',
  emc: 'landmark',
  francais: 'feather',
  philosophie: 'brain',
  hlp: 'scroll',
  latin: 'scroll',
  grec: 'scroll',
  anglais: 'languages',
  espagnol: 'languages',
  allemand: 'languages',
  italien: 'languages',
  'llcer-anglais': 'languages',
  nsi: 'code',
  snt: 'code',
  ses: 'globe',
  economie: 'globe',
  musique: 'music',
  'arts-plastiques': 'palette',
  'arts-appliques': 'palette',
  eps: 'dumbbell',
  'grand-oral': 'lightbulb',
}

export function allureDeMatiere(matiere: Pick<MatiereChoix, 'slug' | 'color'> | null): {
  icon: CourseIcon
  color: CourseColor
} {
  if (!matiere) return { icon: 'book-open', color: 'violet' }
  return {
    icon: ICONE_PAR_SLUG[matiere.slug] ?? 'book-open',
    color: COULEUR_PAR_JETON[matiere.color] ?? 'violet',
  }
}

/** « Anglais — Verbes » ≡ « anglais   verbes » : minuscules, sans accents, espaces et tirets fondus. */
export function cleTitre(titre: string): string {
  return titre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Le dossier déjà existant qui ferait doublon, ou null. Les archivés comptent :
 * on propose de les ressortir plutôt que d'en créer un deuxième.
 */
export function trouverDoublon(
  cours: readonly CoursCarnet[],
  titre: string,
  subjectId: string | null,
): CoursCarnet | null {
  const cle = cleTitre(titre)
  if (cle.length === 0) return null
  return (
    cours.find((c) => {
      if (cleTitre(c.title) !== cle) return false
      // Même titre : c'est un doublon si la matière est la même, ou si l'un
      // des deux n'en a pas (on ne sait pas les distinguer, on prévient).
      return c.subjectId === null || subjectId === null || c.subjectId === subjectId
    }) ?? null
  )
}
