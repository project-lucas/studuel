// Les HAUTS FAITS — la source de gemmes qui récompense la durée.
//
// LE MODÈLE VIENT DE CLASH OF CLANS, et il tient en une phrase de son wiki :
// « Gems can be used to buy other resources, but there is no way to convert
// these resources back into gems. » La gemme y est une vanne à sens unique, et
// elle se gagne par des gestes RARES : vider un obstacle, ouvrir la boîte à
// gemmes hebdomadaire, franchir un palier d'achievement. Jamais en répétant
// l'action ordinaire du jeu.
//
// Studuel appliquait déjà la moitié de cette doctrine (aucune conversion écus →
// gemmes, cf. lib/gems.ts) mais pas l'autre : sa seule source répétable, la
// victoire de défi, était payée PAR LEÇON et par jour. La migration 348 la
// ramène à une par jour ; ce module apporte le contrepoids qui manquait — des
// paliers qui se franchissent une fois, et qui demandent des semaines.
//
// ⚠️ LE MONTANT EST UN MIROIR, PAS UNE SOURCE. Le serveur ne fait confiance
// qu'à sa propre table `gem_achievements` (migration 348) : ce catalogue-ci dit
// QUAND réclamer et ce qu'on affiche, jamais COMBIEN verser. Les deux doivent
// rester alignés — le test le vérifie sur les montants.

/** Ce que l'élève a accumulé, tous programmes confondus. */
export type Compteurs = {
  /** Leçons terminées. */
  lecons: number
  /** Meilleure série atteinte, en jours. */
  serie: number
  /** Cartes passées en « acquise » (intervalle ≥ 21 j). */
  cartes: number
  /** Chapitres à 3 couronnes. */
  chapitres: number
}

export type MesureId = keyof Compteurs

export type HautFait = {
  id: string
  titre: string
  /** Ce qu'il faut faire, dit à l'élève. */
  detail: string
  /** Gemmes versées — miroir de `gem_achievements`. */
  gemmes: number
  mesure: MesureId
  seuil: number
}

/**
 * Le catalogue. Deux paliers par mesure : un atteignable en quelques semaines,
 * un qui demande l'année. Aucun ne se franchit deux fois.
 *
 * Les montants montent moins vite que les seuils, et c'est voulu : un haut fait
 * doit rester une reconnaissance, pas un salaire. 500 cartes acquises valent
 * 80 gemmes — moins de trois chapitres — pour un travail de plusieurs mois.
 */
export const HAUTS_FAITS: readonly HautFait[] = [
  {
    id: 'lecons-50',
    titre: 'Cinquante leçons',
    detail: 'Termine 50 leçons, toutes matières confondues.',
    gemmes: 30,
    mesure: 'lecons',
    seuil: 50,
  },
  {
    id: 'lecons-200',
    titre: 'Deux cents leçons',
    detail: 'Termine 200 leçons. C’est une année de programme.',
    gemmes: 60,
    mesure: 'lecons',
    seuil: 200,
  },
  {
    id: 'serie-30',
    titre: 'Un mois sans faillir',
    detail: 'Tiens une série de 30 jours.',
    gemmes: 40,
    mesure: 'serie',
    seuil: 30,
  },
  {
    id: 'serie-100',
    titre: 'Cent jours',
    detail: 'Tiens une série de 100 jours.',
    gemmes: 100,
    mesure: 'serie',
    seuil: 100,
  },
  {
    id: 'cartes-100',
    titre: 'Cent notions acquises',
    detail: 'Amène 100 cartes au-delà de 21 jours de mémoire.',
    gemmes: 30,
    mesure: 'cartes',
    seuil: 100,
  },
  {
    id: 'cartes-500',
    titre: 'Cinq cents notions acquises',
    detail: 'Amène 500 cartes au-delà de 21 jours de mémoire.',
    gemmes: 80,
    mesure: 'cartes',
    seuil: 500,
  },
  {
    id: 'chapitres-10',
    titre: 'Dix chapitres maîtrisés',
    detail: 'Décroche les 3 couronnes sur 10 chapitres.',
    gemmes: 50,
    mesure: 'chapitres',
    seuil: 10,
  },
] as const

const borne = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0)

/** La valeur d'une mesure, bornée — un compteur négatif ou absent vaut 0. */
export function valeur(compteurs: Compteurs, mesure: MesureId): number {
  return borne(compteurs[mesure])
}

/** Le haut fait est-il atteint ? */
export function estAtteint(hf: HautFait, compteurs: Compteurs): boolean {
  return valeur(compteurs, hf.mesure) >= hf.seuil
}

/** Tous les hauts faits atteints, dans l'ordre du catalogue. */
export function hautsFaitsAtteints(compteurs: Compteurs): HautFait[] {
  return HAUTS_FAITS.filter((hf) => estAtteint(hf, compteurs))
}

/** Progression 0..1 vers un haut fait (1 s'il est atteint). */
export function progression(hf: HautFait, compteurs: Compteurs): number {
  if (hf.seuil <= 0) return 1
  return Math.min(1, valeur(compteurs, hf.mesure) / hf.seuil)
}

/**
 * Ceux qui restent À RÉCLAMER : atteints, mais pas encore payés.
 *
 * C'est la liste que l'écran affiche et que la Server Action envoie à la RPC —
 * un par un, chacun sous sa propre clé. Un haut fait déjà payé est filtré ici
 * ET refusé en base (clé unique) : la double barrière est volontaire, celle du
 * client n'étant qu'un confort d'affichage.
 */
export function aReclamer(
  compteurs: Compteurs,
  dejaPayes: ReadonlySet<string>,
): HautFait[] {
  return hautsFaitsAtteints(compteurs).filter((hf) => !dejaPayes.has(hf.id))
}

/**
 * Le prochain haut fait à viser : le plus AVANCÉ parmi ceux qui restent.
 *
 * On montre celui dont on est le plus près, pas le moins cher : un objectif à
 * 92 % motive, un objectif à 4 % décourage — même s'il rapporte plus.
 */
export function prochainHautFait(
  compteurs: Compteurs,
  dejaPayes: ReadonlySet<string> = new Set(),
): HautFait | null {
  const restants = HAUTS_FAITS.filter(
    (hf) => !dejaPayes.has(hf.id) && !estAtteint(hf, compteurs),
  )
  if (restants.length === 0) return null
  return restants.reduce((meilleur, hf) =>
    progression(hf, compteurs) > progression(meilleur, compteurs) ? hf : meilleur,
  )
}

/** Total de gemmes que valent les hauts faits restant à réclamer. */
export function gemmesAReclamer(
  compteurs: Compteurs,
  dejaPayes: ReadonlySet<string>,
): number {
  return aReclamer(compteurs, dejaPayes).reduce((s, hf) => s + hf.gemmes, 0)
}
