// -----------------------------------------------------------------------------
// LES COURONNES — ce qu'un élève a ACCOMPLI dans une matière, en un objet.
//
// Logique PURE, aucun accès base. Elle ne produit aucune donnée neuve : elle
// TRADUIT la maîtrise déjà calculée (lib/mastery + lib/progression) en un
// palier nommé, exactement comme `lib/subject-rank` traduit un total de
// trophées en « Or II ». Aucune table, aucune migration.
//
// POURQUOI CE DÉNOMINATEUR-LÀ, ET PAS CELUI DE `progressionMatiere`.
//
// Le pourcentage affiché partout ailleurs dans l'app (Réviser, Marcel) porte
// sur les chapitres COMMENCÉS : c'est la bonne mesure pour dire « où j'en suis
// de ce que j'ai travaillé », et elle protège l'élève d'être puni pour un
// programme que son prof n'a pas encore abordé (cf. lib/progression.ts).
//
// Une couronne ne répond pas à cette question-là. Une couronne est un TROPHÉE :
// elle dit ce qui est acquis sur l'ANNÉE ENTIÈRE. Un élève qui maîtrise
// 1 chapitre sur 17 afficherait 100 % au sens de `progressionMatiere` — lui
// donner la couronne de diamant pour ça viderait l'objet de son sens en une
// journée. Le dénominateur est donc le programme du niveau, et le numérateur
// les chapitres réellement SOLIDES.
//
// Conséquence assumée : les couronnes montent lentement, et c'est le but. Le
// pourcentage de travail vit ailleurs, sur Réviser ; ici on compte ce qui est
// gagné pour de bon.
// -----------------------------------------------------------------------------

import {
  progressionMatiere,
  type ChapitreProgression,
} from '@/lib/progression'

/** Les quatre métaux, plus l'absence de couronne. */
export type CouronneTier = 'aucune' | 'bronze' | 'argent' | 'or' | 'diamant'

/** Les paliers qui donnent une couronne, du plus bas au plus haut. */
export const COURONNE_TIERS = ['bronze', 'argent', 'or', 'diamant'] as const

export type CouronneGagnee = (typeof COURONNE_TIERS)[number]

/**
 * Part du programme à MAÎTRISER pour chaque métal.
 *
 * Le diamant est à 100 % : c'est la matière finie, chapitre par chapitre. Il
 * doit rester rare — un sommet qu'on atteint en juin, pas un palier de plus.
 */
export const SEUILS_COURONNE: Readonly<Record<CouronneGagnee, number>> = {
  bronze: 0.25,
  argent: 0.5,
  or: 0.75,
  diamant: 1,
}

export const COURONNE_LABELS: Readonly<Record<CouronneTier, string>> = {
  aucune: 'Pas encore de couronne',
  bronze: 'Couronne de bronze',
  argent: 'Couronne d’argent',
  or: 'Couronne d’or',
  diamant: 'Couronne de diamant',
}

/** Le nom court, pour une pastille (« Or »). */
export const COURONNE_NOMS: Readonly<Record<CouronneGagnee, string>> = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
  diamant: 'Diamant',
}

/** Le métal atteint par une part de programme maîtrisée (0..1). */
export function tierPourRatio(ratio: number): CouronneTier {
  if (!Number.isFinite(ratio) || ratio <= 0) return 'aucune'
  if (ratio >= SEUILS_COURONNE.diamant) return 'diamant'
  if (ratio >= SEUILS_COURONNE.or) return 'or'
  if (ratio >= SEUILS_COURONNE.argent) return 'argent'
  if (ratio >= SEUILS_COURONNE.bronze) return 'bronze'
  return 'aucune'
}

/** Le métal juste au-dessus, ou null au sommet. */
export function tierSuivant(tier: CouronneTier): CouronneGagnee | null {
  switch (tier) {
    case 'aucune':
      return 'bronze'
    case 'bronze':
      return 'argent'
    case 'argent':
      return 'or'
    case 'or':
      return 'diamant'
    case 'diamant':
      return null
  }
}

/** La matière telle que l'écran la reçoit. */
export type MatiereACouronner = {
  subjectId: string
  subjectSlug: string
  subjectName: string
  chapitres: readonly ChapitreProgression[]
}

export type Couronne = {
  subjectId: string
  subjectSlug: string
  subjectName: string
  tier: CouronneTier
  /** Chapitres du niveau réellement maîtrisés. */
  acquis: number
  /** Chapitres du programme de l'année (le dénominateur). */
  total: number
  /** Part maîtrisée, 0..1 (0 quand le programme est vide). */
  ratio: number
  /** La même, en pourcent entier — pour l'affichage et les barres. */
  pct: number
  /** Le prochain métal et ce qu'il coûte encore, ou null au sommet. */
  prochain: { tier: CouronneGagnee; chapitres: number } | null
}

/**
 * Combien de chapitres maîtrisés faut-il pour atteindre ce métal ?
 * Arrondi AU-DESSUS : à 17 chapitres, le bronze (25 %) demande 5 chapitres et
 * non 4,25 — on ne décerne pas une couronne pour un seuil frôlé.
 */
export function chapitresPourTier(tier: CouronneGagnee, total: number): number {
  if (total <= 0) return 0
  return Math.ceil(SEUILS_COURONNE[tier] * total)
}

/** La couronne d'une matière. Ne jette jamais, même sur un programme vide. */
export function couronneMatiere(matiere: MatiereACouronner): Couronne {
  const bilan = progressionMatiere(matiere.chapitres)
  const total = bilan.total
  const acquis = bilan.solides
  const ratio = total > 0 ? Math.min(1, acquis / total) : 0
  const tier = tierPourRatio(ratio)
  const suivant = tierSuivant(tier)

  return {
    subjectId: matiere.subjectId,
    subjectSlug: matiere.subjectSlug,
    subjectName: matiere.subjectName,
    tier,
    acquis,
    total,
    ratio,
    // Arrondi VERS LE BAS : afficher « 50 % » à un élève qui n'a pas la
    // couronne d'argent (seuil 50 %) serait un mensonge de plus d'un pixel.
    pct: Math.floor(ratio * 100),
    prochain:
      suivant && total > 0
        ? {
            tier: suivant,
            chapitres: Math.max(1, chapitresPourTier(suivant, total) - acquis),
          }
        : null,
  }
}

/**
 * La part du chemin parcouru DANS le palier courant, 0..1.
 *
 * Pourquoi pas simplement `ratio` ? Parce que l'anneau de l'étagère
 * (`components/moi/Vitrine`) doit bouger entre deux couronnes. Un élève
 * qui passe de 26 % à 48 % du programme n'a rien gagné au sens des métaux — il
 * a pourtant fait presque toute la route du bronze vers l'argent, et c'est
 * cette route-là que l'anneau montre. Sur `ratio` brut, l'anneau d'un élève de
 * troisième trimestre serait quasi plein partout, et ne dirait plus rien.
 *
 * Au diamant il n'y a plus de palier au-dessus : l'anneau est plein, une fois
 * pour toutes.
 */
export function avanceeVersProchain(c: Couronne): number {
  const suivant = tierSuivant(c.tier)
  if (!suivant) return 1
  const socle = c.tier === 'aucune' ? 0 : SEUILS_COURONNE[c.tier]
  const sommet = SEUILS_COURONNE[suivant]
  if (!(sommet > socle)) return 0
  return Math.min(1, Math.max(0, (c.ratio - socle) / (sommet - socle)))
}

/**
 * Les couronnes de toutes les matières suivies, RANGÉES : d'abord les mieux
 * couronnées, puis à métal égal la plus avancée, puis l'ordre alphabétique
 * (départage stable d'un rendu à l'autre).
 *
 * Les matières sans aucun chapitre au programme sont ÉCARTÉES : l'app n'a pas
 * encore le contenu, ce n'est pas à l'élève d'en porter la trace sous forme
 * d'une couronne éteinte qu'il ne pourra jamais gagner.
 */
export function couronnes(
  matieres: readonly MatiereACouronner[],
): Couronne[] {
  const rang: Record<CouronneTier, number> = {
    diamant: 4,
    or: 3,
    argent: 2,
    bronze: 1,
    aucune: 0,
  }
  return matieres
    .map(couronneMatiere)
    .filter((c) => c.total > 0)
    .sort(
      (a, b) =>
        rang[b.tier] - rang[a.tier] ||
        b.ratio - a.ratio ||
        a.subjectName.localeCompare(b.subjectName, 'fr'),
    )
}

export type BilanCouronnes = {
  /** Couronnes par métal (les quatre clés sont toujours présentes). */
  parTier: Record<CouronneGagnee, number>
  /** Total des matières couronnées (bronze et au-dessus). */
  gagnees: number
  /** Matières au programme, couronnées ou non. */
  matieres: number
  /**
   * La matière la plus proche de sa prochaine couronne — celle qu'il faut
   * nommer à l'écran. C'est la seule sortie de ce module qui appelle à agir.
   */
  prochaine: Couronne | null
}

export function bilanCouronnes(liste: readonly Couronne[]): BilanCouronnes {
  const parTier: Record<CouronneGagnee, number> = {
    bronze: 0,
    argent: 0,
    or: 0,
    diamant: 0,
  }
  for (const c of liste) if (c.tier !== 'aucune') parTier[c.tier] += 1

  // « La plus proche » se mesure en CHAPITRES restants, pas en pourcentage :
  // deux chapitres à faire en physique (12 chapitres) sont plus proches que
  // deux points de pourcentage en histoire (30 chapitres). À égalité, la
  // matière la plus avancée gagne.
  let prochaine: Couronne | null = null
  for (const c of liste) {
    if (!c.prochain) continue
    if (
      !prochaine ||
      !prochaine.prochain ||
      c.prochain.chapitres < prochaine.prochain.chapitres ||
      (c.prochain.chapitres === prochaine.prochain.chapitres &&
        c.ratio > prochaine.ratio)
    )
      prochaine = c
  }

  return {
    parTier,
    gagnees: liste.filter((c) => c.tier !== 'aucune').length,
    matieres: liste.length,
    prochaine,
  }
}

// « couronne DE bronze » mais « couronne D'argent » : l'élision se règle ici,
// une fois, plutôt qu'à chaque endroit qui écrit la phrase.
const COMPLEMENT: Readonly<Record<CouronneGagnee, string>> = {
  bronze: 'de bronze',
  argent: 'd’argent',
  or: 'd’or',
  diamant: 'de diamant',
}

/** « 2 chapitres pour la couronne d'argent en Maths ». Null si rien à dire. */
export function phraseProchaineCouronne(c: Couronne | null): string | null {
  if (!c?.prochain) return null
  const n = c.prochain.chapitres
  return `${n} chapitre${n > 1 ? 's' : ''} pour la couronne ${COMPLEMENT[c.prochain.tier]} en ${c.subjectName}`
}
