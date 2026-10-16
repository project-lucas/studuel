// -----------------------------------------------------------------------------
// L'ONGLET EXAMEN DU BUREAU DE MARCEL (16/10/2026, maquettes de
// assets-sources/maquettes/marcel-examen.html, validées par Lucas : « vas-y,
// implémente les maquettes dans le mode examen, il doit devenir à terme
// indispensable »).
//
// L'onglet répond à quatre questions, dans cet ordre :
//   1. Où j'en suis ?           le compte à rebours, la phase, « prêt à 31 % »
//   2. Qu'est-ce que je fais ?   les trois gestes de la semaine, cochés tout seuls
//   3. Qu'est-ce qui m'attend ?  les épreuves, chacune avec SA préparation
//   4. Et l'oral ?               le dossier d'oral (lib/examen/dossier-oral)
// et, aux derniers jours, il devient la check-list du jour J.
//
// Ce module assemble la vue à partir de ce que le serveur a lu. Logique PURE
// et testée ; aucun appel IA.
// -----------------------------------------------------------------------------

import { etatDossier, type Piece } from './dossier-oral'
import { objectifsDeLaSemaine, type Epreuve, type Examen, type IdExamen, type Phase } from './parcours'

// ---------------------------------------------- 2. les gestes de la semaine

/** Ce que l'élève a fait depuis lundi (00:00 UTC). */
export type CompteursSemaine = {
  lecons: number
  quiz: number
  annalesOuvertes: number
  annalesTraitees: number
  blancs: number
}

export const COMPTEURS_VIDES: CompteursSemaine = { lecons: 0, quiz: 0, annalesOuvertes: 0, annalesTraitees: 0, blancs: 0 }

export type Geste = {
  texte: string
  href: string
  /** Ce qui le coche tout seul ; `null` = un geste qu'on ne peut pas mesurer. */
  mesure: { fait: number; cible: number } | null
}

type Mesure = { cle: keyof CompteursSemaine; cible: number } | null

/**
 * Les trois gestes de la semaine (lib/examen/parcours) avec ce qui les COCHE :
 * des leçons lues, des quiz passés, un sujet tombé ouvert ou traité, une
 * épreuve blanche. Un geste sans mesure fiable (préparer ses affaires, l'oral
 * à voix haute) n'est pas coché à la place de l'élève.
 */
export function gestesDeLaSemaine(
  examen: Examen,
  phase: Phase,
  ctx: { pointsFaibles: number; aCommencer: number; matierePrincipale: string | null },
  compteurs: CompteursSemaine,
): Geste[] {
  const base = objectifsDeLaSemaine(examen, phase, ctx)
  const faibles = Math.max(1, Math.min(3, ctx.pointsFaibles))
  let mesures: Mesure[]
  switch (phase.id) {
    case 'fondations':
      mesures = [
        ctx.aCommencer > 0 ? { cle: 'lecons', cible: 3 } : { cle: 'quiz', cible: 3 },
        // Les mêmes quiz ne cochent pas deux gestes.
        ctx.aCommencer > 0 ? { cle: 'quiz', cible: Math.min(2, faibles) } : null,
        { cle: 'annalesOuvertes', cible: 1 },
      ]
      break
    case 'entrainement':
      // Un sujet « fait » est un sujet TRAITÉ (« J'ai traité ce sujet »), pas ouvert ;
      // relire son corrigé ne se mesure pas.
      mesures = [{ cle: 'annalesTraitees', cible: 1 }, null, { cle: 'quiz', cible: ctx.pointsFaibles > 0 ? faibles : 5 }]
      break
    case 'sprint':
      mesures = [{ cle: 'blancs', cible: 1 }, null, { cle: 'quiz', cible: 3 }]
      break
    default:
      mesures = [null, null, null]
  }
  return base.map((g, i) => {
    const m = mesures[i] ?? null
    return { ...g, mesure: m ? { fait: Math.min(compteurs[m.cle], m.cible), cible: m.cible } : null }
  })
}

export function gesteFait(g: Geste): boolean {
  return g.mesure !== null && g.mesure.fait >= g.mesure.cible
}

// ------------------------------------------------- 3. les épreuves de l'élève

export type Specialite = { slug: string; nom: string }

/** Les matières (slugs) dont les chapitres préparent une épreuve. */
export function matieresDeLEpreuve(e: Epreuve): string[] {
  if (e.id === 'brevet-sciences') return ['svt', 'physique-chimie', 'technologie']
  return e.matiere ? [e.matiere] : []
}

/**
 * Les épreuves telles que l'élève les passera : en terminale, « les deux
 * spécialités » devient SES deux spécialités, chacune avec sa ligne.
 */
export function epreuvesDeLEleve(examen: Examen, specialites: readonly Specialite[]): Epreuve[] {
  return examen.epreuves.flatMap((e) => {
    if (e.id !== 'bac-specialites' || specialites.length === 0) return [e]
    return specialites.slice(0, 2).map((s) => ({
      ...e,
      id: `bac-spe-${s.slug}`,
      titre: s.nom,
      duree: '3 h 30 à 4 h',
      coefficient: '16',
      matiere: s.slug,
      format: ['Une épreuve écrite sur le programme de terminale', 'Plus une épreuve pratique en SVT, physique-chimie et NSI'],
      ressources: [{ type: 'annales' as const, matiere: s.slug }, { type: 'examen-blanc' as const, matiere: s.slug }],
    }))
  })
}

export type EntreesEpreuve = {
  /** La maîtrise moyenne des chapitres de ses matières, de 0 à 1. */
  maitrise: number
  annalesFaites: number
  annalesTotal: number
  blancs: number
}

/**
 * LA PRÉPARATION d'une épreuve écrite, de 0 à 1 : surtout la maîtrise des
 * chapitres (70 %), puis les sujets tombés faits (20 % — deux suffisent pour le
 * plein) et une épreuve blanche passée (10 %). Une matière sans annales en
 * ligne ne peut pas être pénalisée de ne pas en avoir fait.
 */
export function preparationEcrit(x: EntreesEpreuve): number {
  const m = Math.max(0, Math.min(1, x.maitrise))
  const blanc = Math.min(1, Math.max(0, x.blancs))
  if (x.annalesTotal > 0) {
    const annales = Math.min(1, x.annalesFaites / Math.min(2, x.annalesTotal))
    return 0.7 * m + 0.2 * annales + 0.1 * blanc
  }
  return 0.85 * m + 0.15 * blanc
}

export type EpreuveVue = {
  id: string
  titre: string
  nature: 'ecrit' | 'oral'
  duree: string
  coefficient: string | null
  format: string[]
  temps: { minutes: number; quoi: string }[]
  tempsConseil: boolean
  /** La matière qui donne la vignette, le dossier, les annales. */
  matiere: string | null
  /** Chapitres maîtrisés sur le total (écrit seulement). */
  chapitres: { maitrises: number; total: number } | null
  annales: { faites: number; total: number } | null
  blancs: number
  /** De 0 à 1. */
  preparation: number
}

export type DonneesEpreuve = {
  chapitres: { maitrises: number; total: number; maitrise: number }
  annales: { faites: number; total: number }
  blancs: number
}

/** Assemble une épreuve : l'oral prend l'avancée du dossier, l'écrit ses chiffres. */
export function vueEpreuve(e: Epreuve, d: DonneesEpreuve, partOral: number): EpreuveVue {
  const commun = {
    id: e.id,
    titre: e.titre,
    nature: e.nature,
    duree: e.duree,
    coefficient: e.coefficient,
    format: e.format,
    temps: e.temps ?? [],
    tempsConseil: e.tempsConseil === true,
    matiere: e.id === 'brevet-sciences' ? 'svt' : e.matiere,
  }
  if (e.nature === 'oral') {
    return { ...commun, chapitres: null, annales: null, blancs: 0, preparation: Math.max(0, Math.min(1, partOral)) }
  }
  return {
    ...commun,
    chapitres: d.chapitres.total > 0 ? { maitrises: d.chapitres.maitrises, total: d.chapitres.total } : null,
    annales: d.annales.total > 0 ? d.annales : null,
    blancs: d.blancs,
    preparation: preparationEcrit({ maitrise: d.chapitres.maitrise, annalesFaites: d.annales.faites, annalesTotal: d.annales.total, blancs: d.blancs }),
  }
}

/**
 * La préparation de tout l'examen : la moyenne de ses épreuves. Une épreuve
 * écrite sans chapitre au catalogue (une spécialité non choisie, une matière
 * absente) n'y compte pas : l'élève ne pourrait rien faire pour la remonter.
 */
export function preparationGlobale(epreuves: readonly Pick<EpreuveVue, 'preparation' | 'nature' | 'chapitres'>[]): number {
  const comptees = epreuves.filter((e) => e.nature === 'oral' || e.chapitres !== null)
  if (comptees.length === 0) return 0
  return comptees.reduce((s, e) => s + e.preparation, 0) / comptees.length
}

/** « 31 % » : arrondi CONTRE l'élève, on ne lui promet pas ce qu'il n'a pas. */
export function pourcent(part: number): number {
  return Math.max(0, Math.min(100, Math.floor(part * 100)))
}

/** La part du dossier d'oral qui sert de préparation à l'épreuve orale. */
export function partOral(examen: IdExamen, pieces: readonly Piece[]): number {
  return etatDossier(examen, pieces).part
}

// --------------------------------------------------------- le jour J

/** L'onglet bascule en check-list du jour J sept jours avant. */
export function estJourJProche(jours: number): boolean {
  return jours >= 0 && jours <= 7
}

export type ObjetSac = { id: string; texte: string }

/** Le sac de l'examen (mémoire du navigateur : une coche par objet). */
export function sacDeLExamen(examen: IdExamen): ObjetSac[] {
  const calculatrice: ObjetSac =
    examen === 'bac'
      ? { id: 'calculatrice', texte: 'Ta calculatrice en mode examen, si ton épreuve l’autorise' }
      : { id: 'calculatrice', texte: 'Ta calculatrice en mode examen' }
  return [
    { id: 'convocation', texte: 'Ta convocation, imprimée' },
    { id: 'identite', texte: 'Ta pièce d’identité' },
    { id: 'stylos', texte: 'Deux stylos, une règle, un correcteur' },
    calculatrice,
    { id: 'montre', texte: 'Une montre simple (ni téléphone ni montre connectée)' },
    { id: 'eau', texte: 'De l’eau et un en-cas' },
  ]
}

/** La phrase du soir, de J-7 au jour J. */
export function conseilDuSoir(jours: number): string {
  if (jours === 0) return 'C’est aujourd’hui. Lis bien chaque consigne, garde du temps pour te relire. Tu es prêt.'
  if (jours === 1) return 'Demain, c’est le jour J. Prépare ton sac, relis une fiche, et couche-toi tôt.'
  return 'Plus de nouveau chapitre : relis tes fiches, une matière par soir. Écran éteint à 22 h : le sommeil fixe ce que tu as appris.'
}
