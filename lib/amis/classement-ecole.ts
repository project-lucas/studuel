// -----------------------------------------------------------------------------
// LE CLASSEMENT DE L'ÉTABLISSEMENT, LU DE HAUT EN BAS — logique pure.
//
// Refonte du 16/09/2026 (Lucas : « il doit ressembler à Duolingo dans la
// structure »), puis le même jour : « le classement se fera via les trophées
// et non plus le nombre d'heures travaillées », avec « les écussons par
// division cachés tant que le joueur n'a pas atteint le palier ».
//
// L'écran se lit donc comme la ligue de Duolingo :
//
//   1. LE RAIL DES DIVISIONS — les six blasons de rang (lib/rank, les mêmes
//      que l'arène : Bronze → Maître). Celui de l'élève est au centre, en
//      grand ; ceux qu'il a traversés restent en couleur, plus petits ; ceux
//      qu'il n'a pas atteints sont gris et cadenassés — on ne les DÉCOUVRE
//      qu'en y arrivant, comme la coupe d'argent grisée de Duolingo.
//   2. LA PHRASE qui dit ma place (« Tu es n°3 du classement de ton collège »)
//      et dessous ce qu'il me reste à faire (« 40 trophées pour doubler Rayan »).
//   3. LA LISTE — rang, avatar, nom, trophées — coupée par un bandeau sous la
//      3e place : ici il n'y a ni semaine ni relégation, la seule zone qui
//      existe est LE PODIUM.
//
// Tout ce que le composant affiche est décidé ICI pour être testable : les
// lignes et leur ordre, ce qu'on montre replié, l'état de chaque blason du
// rail, la phrase du titre et celle du dessous. Le composant
// (AmisHome › GeoRankingSection) ne fait que dessiner.
// -----------------------------------------------------------------------------

import { sortSchool, type SchoolMate } from '@/lib/social'
import { RANK_TIERS, nextTier, rankFor, tierFloor, type RankTier } from '@/lib/rank'

/** Les places du podium : le bandeau se pose sous la dernière. */
export const PODIUM = 3

/** Replié, la liste montre ce nombre de lignes — puis ma ligne si elle est plus bas. */
export const LIGNES_REPLIEES = 10

export type LigneEcole =
  | { kind: 'eleve'; mate: SchoolMate; rank: number; podium: boolean }
  /** Le bandeau « Podium », sous la 3e place. */
  | { kind: 'separateur' }
  /** « … n élèves » : les lignes sautées entre le haut de liste et la mienne. */
  | { kind: 'ellipse'; caches: number }

/**
 * La liste telle qu'elle se lit. `tout` = déplié (toutes les lignes) ; replié,
 * on garde les LIGNES_REPLIEES premières, et si je suis plus bas, une ellipse
 * puis MA ligne et celle juste derrière moi — c'est ma place qu'on vient
 * vérifier, elle ne doit jamais demander un tap de plus.
 */
export function lignesEcole(mates: SchoolMate[], tout: boolean): LigneEcole[] {
  const tries = sortSchool(mates)
  const total = tries.length
  const myIndex = tries.findIndex((m) => m.isMe)

  const garde = (i: number): boolean => {
    if (tout || total <= LIGNES_REPLIEES) return true
    if (i < LIGNES_REPLIEES) return true
    // Ma ligne, et celle juste derrière.
    return myIndex >= LIGNES_REPLIEES && (i === myIndex || i === myIndex + 1)
  }

  const lignes: LigneEcole[] = []
  let precedent = -1
  tries.forEach((mate, i) => {
    if (!garde(i)) return
    if (precedent >= 0 && i > precedent + 1) {
      lignes.push({ kind: 'ellipse', caches: i - precedent - 1 })
    }
    const rank = i + 1
    lignes.push({ kind: 'eleve', mate, rank, podium: rank <= PODIUM })
    // Le bandeau sous la 3e place — seulement s'il sépare quelque chose.
    if (rank === PODIUM && i < total - 1) lignes.push({ kind: 'separateur' })
    precedent = i
  })
  return lignes
}

/** Y a-t-il des lignes cachées quand la liste est repliée ? */
export function peutDeplier(mates: SchoolMate[]): boolean {
  return lignesEcole(mates, false).length < sortSchool(mates).length
}

/** Mon rang (1 = premier), ou null si je n'y figure pas. */
export function monRang(mates: SchoolMate[]): number | null {
  const i = sortSchool(mates).findIndex((m) => m.isMe)
  return i === -1 ? null : i + 1
}

/**
 * « Tu es n°3 du classement de ton collège » — la phrase sous le rail.
 * `complement` est la portée avec son déterminant (« ton collège »,
 * « ta région », « la France » — cf. geoScopePossessive).
 */
export function titreEcole(myRank: number | null, complement: string): string {
  if (myRank === null) return `Le classement de ${complement}`
  if (myRank === 1) return `Tu es 1er du classement de ${complement}`
  return `Tu es n°${myRank} du classement de ${complement}`
}

/** « 1 trophée », « 40 trophées ». */
export function trophees(n: number): string {
  const safe = Math.max(0, Math.floor(n))
  return `${safe} ${safe === 1 ? 'trophée' : 'trophées'}`
}

/**
 * La ligne du dessous : ce qu'il me reste à faire. L'écart avec celui juste
 * devant (« 40 trophées pour doubler Rayan »), mon avance si je mène, et rien
 * de chiffré quand je suis seul — un écart avec personne ne veut rien dire.
 */
export function sousTitreEcole(mates: SchoolMate[], complement: string): string {
  const tries = sortSchool(mates)
  const i = tries.findIndex((m) => m.isMe)
  if (i === -1) return `Chaque duel gagné compte pour ${complement}.`
  if (tries.length === 1) return 'Tu es seul pour l’instant — chaque duel gagné compte.'
  if (i === 0) {
    const second = tries[1]
    const avance = Math.max(0, tries[0].trophies - second.trophies)
    return avance > 0
      ? `${trophees(avance)} d’avance sur ${second.name}`
      : `À égalité avec ${second.name} — un duel te départage`
  }
  const devant = tries[i - 1]
  const ecart = Math.max(0, devant.trophies - tries[i].trophies)
  return ecart > 0
    ? `${trophees(ecart)} pour doubler ${devant.name}`
    : `À égalité avec ${devant.name} — un duel te départage`
}

// --- Le rail des divisions ----------------------------------------------------

export type EtatDivision = 'passee' | 'courante' | 'verrouillee'

export type DivisionRail = {
  tier: RankTier
  etat: EtatDivision
}

/**
 * Les six blasons du rail, vus depuis mes trophées : ceux d'avant sont
 * « passés » (en couleur, petits), le mien est « courant » (en grand), ceux
 * d'après sont « verrouillés » — gris et cadenassés, on ne les découvre qu'en
 * y arrivant. Le palier vient de `rankFor` : c'est LE rang de saison, le même
 * que celui de la carte de profil et de l'arène.
 */
export function railDivisions(myTrophies: number): DivisionRail[] {
  const courante = rankFor(myTrophies).tier.id
  const index = RANK_TIERS.findIndex((t) => t.id === courante)
  return RANK_TIERS.map((tier, i) => ({
    tier,
    etat: i === index ? 'courante' : i < index ? 'passee' : 'verrouillee',
  }))
}

/**
 * « Division Bronze · Argent dans 320 trophées » — la ligne sous le rail qui
 * nomme la division et dit le prochain blason à débloquer. Au sommet, il n'y a
 * plus rien à débloquer : on le dit.
 */
export function ligneDivision(myTrophies: number): string {
  const rang = rankFor(myTrophies)
  const suivant = nextTier(rang.tier.id)
  if (!suivant) return `Division ${rang.tier.name} · le sommet`
  const manque = Math.max(0, tierFloor(suivant.id) - Math.max(0, Math.floor(myTrophies)))
  return `Division ${rang.tier.name} · ${suivant.name} dans ${trophees(manque)}`
}
