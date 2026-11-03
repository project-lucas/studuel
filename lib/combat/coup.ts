// -----------------------------------------------------------------------------
// LE COUP (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md § 4.
//
// Ce que l'arène joue quand quelqu'un frappe : qui frappe, ce que la cible
// perd (en points pour le chiffre qui vole, en QUARTS de cœur pour la
// rangée), et la mise en scène du coup — critique (la question dorée) ou
// SUPER (trois bonnes réponses d'affilée, l'idée de Brawl Stars).
//
// La règle de la peau, toujours : rien ici ne change un point. La course et la
// Traque décident ; le coup raconte.
// -----------------------------------------------------------------------------
import { coeursDuDuel, PV_DUEL, type Coeurs } from './coeurs'

export type Camp = 'moi' | 'rival'

export type Coup = {
  /** Clé d'animation : chaque coup rejoue son attaque (parité de l'id). */
  id: number
  /** Le camp qui FRAPPE. */
  camp: Camp
  /** Le chiffre qui vole (les points arrachés) ; `null` : pas de chiffre (le gardien). */
  degats: number | null
  /** Les quarts de cœur que la cible perd. */
  quartsPerdus: number
  /** La question dorée : ralenti, éclat d'or, « Coup critique ! ». */
  critique: boolean
  /** La troisième bonne réponse d'affilée : l'attaque fétiche en GRAND. */
  super: boolean
  /** L'attaque part et la cible l'ESQUIVE (une réponse fausse) : rien n'est perdu. */
  rate: boolean
  /** L'instant du coup sur l'horloge du combat (ms). */
  atMs: number
}

/** Trois bonnes réponses d'affilée chargent le super. */
export const SUPER_TOUTES = 3

/** La jauge du super après `serie` bonnes réponses d'affilée (0, 1 ou 2 crans pleins). */
export function chargeSuper(serie: number): number {
  const s = Number.isFinite(serie) ? Math.max(0, Math.floor(serie)) : 0
  return s % SUPER_TOUTES
}

/** Cette bonne réponse est-elle un super ? La 3e, la 6e, la 9e d'affilée. */
export function estSuper(serieApres: number): boolean {
  return Number.isFinite(serieApres) && serieApres > 0 && Math.floor(serieApres) % SUPER_TOUTES === 0
}

/**
 * Le coup d'une réponse du DUEL CLASSÉ. Une erreur ne frappe pas (null). Les
 * dégâts sont plafonnés aux PV qui restent : le chiffre qui vole est ce que la
 * cible perd vraiment, et les quarts suivent les cœurs de la course.
 */
export function coupDuDuel(input: {
  id: number
  camp: Camp
  points: number
  /** Les PV de la CIBLE avant le coup (1 000 − le score de l'attaquant). */
  pvCible: number
  golden: boolean
  serieApres: number
  atMs: number
}): Coup | null {
  const points = Number.isFinite(input.points) ? Math.floor(input.points) : 0
  if (points <= 0) return null
  const pv = Math.max(0, Math.floor(input.pvCible))
  const degats = Math.min(points, pv)
  const avant = coeursDuDuel(pv)
  const apres = coeursDuDuel(pv - degats)
  return {
    id: input.id,
    camp: input.camp,
    degats,
    quartsPerdus: avant.quarts - apres.quarts,
    critique: input.golden,
    super: input.camp === 'moi' && estSuper(input.serieApres),
    rate: false,
    atMs: input.atMs,
  }
}

/**
 * Le coup du COMBAT DE GARDIEN : ma bonne réponse lui retire un demi-cœur ;
 * mon erreur, c'est LUI qui attaque, et je perds un cœur entier.
 */
export function coupDuGardien(input: {
  id: number
  bonne: boolean
  serieApres: number
  atMs: number
}): Coup {
  return {
    id: input.id,
    camp: input.bonne ? 'moi' : 'rival',
    degats: null,
    quartsPerdus: input.bonne ? 2 : 4,
    critique: false,
    super: input.bonne && estSuper(input.serieApres),
    rate: false,
    atMs: input.atMs,
  }
}

/**
 * L'attaque RATÉE du duel : la réponse est fausse, le héros lance quand même
 * son attaque, l'autre l'esquive (Pokémon : « l'attaque a échoué »). Rien
 * n'est perdu, rien ne vole.
 */
export function coupRate(input: { id: number; camp: Camp; atMs: number }): Coup {
  return { id: input.id, camp: input.camp, degats: null, quartsPerdus: 0, critique: false, super: false, rate: true, atMs: input.atMs }
}

/** La rangée de la cible AVANT le coup : ce qu'elle avait à perdre. */
export function coeursAvant(apres: Coeurs, coup: Coup): Coeurs {
  return { ...apres, quarts: Math.min(apres.max * 4, apres.quarts + coup.quartsPerdus) }
}

/** Ce que l'arène retient de la course d'un instant à l'autre (useCourse). */
export type InstantCourse = {
  moi: { score: number; answered: number; combo: number }
  rival: { total: number; answered: number; combo: number }
  /** La question que je viens de jouer était-elle la dorée ? */
  golden: boolean
}

/**
 * LE COUP DE LA VRAIE COURSE : la course classée (`useCourse`) avance ses
 * compteurs, l'arène en déduit qui vient de frapper. Une réponse de plus de
 * mon côté : je frappe (ou j'ai raté, il esquive) ; une de plus du sien :
 * idem en face. Si les deux bougent au même instant, c'est MON coup qui se
 * joue — c'est moi qui viens de toucher l'écran.
 */
export function coupDeLaCourse(avant: InstantCourse, apres: InstantCourse, id: number, atMs: number): Coup | null {
  if (apres.moi.answered > avant.moi.answered) {
    const points = apres.moi.score - avant.moi.score
    if (points <= 0) return coupRate({ id, camp: 'moi', atMs })
    return coupDuDuel({
      id,
      camp: 'moi',
      points,
      pvCible: PV_DUEL - avant.moi.score,
      golden: apres.golden,
      serieApres: apres.moi.combo,
      atMs,
    })
  }
  if (apres.rival.answered > avant.rival.answered) {
    const points = apres.rival.total - avant.rival.total
    if (points <= 0) return coupRate({ id, camp: 'rival', atMs })
    return coupDuDuel({
      id,
      camp: 'rival',
      points,
      pvCible: PV_DUEL - avant.rival.total,
      golden: false,
      serieApres: apres.rival.combo,
      atMs,
    })
  }
  return null
}
