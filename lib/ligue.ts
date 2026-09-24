import { RANK_TIERS, type RankTier } from '@/lib/rank'

// -----------------------------------------------------------------------------
// LA LIGUE DE LA SEMAINE — l'onglet Amis, « à l'identique de Duolingo » (Lucas,
// 24/09/2026). Chaque semaine (lundi 00:00 UTC → lundi suivant), l'élève est
// placé dans un GROUPE de 30 joueurs du même échelon, classé à l'XP gagnée
// dans la semaine. À la fin : les premiers MONTENT d'un échelon, les derniers
// DESCENDENT, et tout recommence.
//
// LES ÉCHELONS sont les rangs de l'app (lib/rank : Bronze → Maître) en quatre
// divisions — « Bronze 4, 3, 2, 1 », puis Argent 4… — et le sommet, Maître,
// n'en a pas : 21 marches. On y monte d'une DIVISION par semaine, jamais de
// deux. Les trophées ne jouent plus ici : ils restent au duel classé.
//
// LES AMIS MULTIPLIENT L'XP : +10 % de l'XP de la semaine par ami, jusqu'à ×2
// à 10 amis, versés en fin de semaine dans la barre de niveau (les niveaux
// gagnés paient leurs gemmes, comme partout). Le bonus ne compte pas dans la
// ligue : il tombe la semaine suivante, et il fausserait le classement.
//
// Module PUR, miroir des fonctions SQL `ligue_*` (migration 376) : toute règle
// changée ici doit l'être là-bas, et réciproquement.
// -----------------------------------------------------------------------------

export const TAILLE_GROUPE = 30
export const DIVISIONS_PAR_RANG = 4
/** 5 rangs × 4 divisions, plus le sommet sans division. */
export const NB_ECHELONS = (RANK_TIERS.length - 1) * DIVISIONS_PAR_RANG + 1
export const ECHELON_MAX = NB_ECHELONS - 1

export type Echelon = {
  /** 0 = Bronze 4 … 19 = Diamant 1, 20 = Maître. */
  index: number
  rang: RankTier
  /** 4 → 1 (4 est la plus basse) ; null au sommet. */
  division: number | null
  /** « Bronze 4 », « Maître ». */
  nom: string
}

/** L'échelon d'un index, borné à l'échelle. */
export function echelon(index: number): Echelon {
  const i = Number.isFinite(index) ? Math.min(ECHELON_MAX, Math.max(0, Math.trunc(index))) : 0
  if (i === ECHELON_MAX) {
    const rang = RANK_TIERS[RANK_TIERS.length - 1]
    return { index: i, rang, division: null, nom: rang.name }
  }
  const rang = RANK_TIERS[Math.floor(i / DIVISIONS_PAR_RANG)]
  const division = DIVISIONS_PAR_RANG - (i % DIVISIONS_PAR_RANG)
  return { index: i, rang, division, nom: `${rang.name} ${division}` }
}

// ------------------------------------------------------ qui monte, qui descend

/**
 * Combien de joueurs MONTENT. 7 sur 30 dans un groupe plein (Duolingo),
 * proportionnel sinon, au moins un dès qu'on est deux — et personne au sommet.
 */
export function nbPromus(taille: number, index: number): number {
  if (index >= ECHELON_MAX || taille < 2) return 0
  return Math.max(1, Math.floor((taille * 7) / TAILLE_GROUPE))
}

/** Combien DESCENDENT. 5 sur 30 dans un groupe plein ; personne sous Bronze 4. */
export function nbRelegues(taille: number, index: number): number {
  if (index <= 0) return 0
  return Math.floor((taille * 5) / TAILLE_GROUPE)
}

export type Mouvement = 'promu' | 'maintenu' | 'relegue'

/** Le sort d'un joueur en fin de semaine. Il faut de l'XP pour monter. */
export function mouvement({
  rang,
  taille,
  echelon: index,
  xp,
}: {
  rang: number
  taille: number
  echelon: number
  xp: number
}): Mouvement {
  if (rang <= nbPromus(taille, index) && xp > 0) return 'promu'
  const relegues = nbRelegues(taille, index)
  if (relegues > 0 && rang > taille - relegues) return 'relegue'
  return 'maintenu'
}

export type Zone = 'promotion' | 'neutre' | 'relegation'

/** La zone d'une ligne de la liste (les bandeaux « Zone de promotion »…). */
export function zoneDe(rang: number, promus: number, relegues: number, taille = TAILLE_GROUPE): Zone {
  if (rang <= promus) return 'promotion'
  if (relegues > 0 && rang > taille - relegues) return 'relegation'
  return 'neutre'
}

// ----------------------------------------------------------------- classement

export type MembreBrut = { id: string; xp: number; rejointLe: string }

/**
 * Le classement du groupe : l'XP d'abord, puis le premier arrivé dans le
 * groupe (à XP égale, celui qui s'y est mis le plus tôt), puis l'identifiant —
 * un ordre total, le même pour tous les joueurs du groupe.
 */
export function classer<T extends MembreBrut>(membres: readonly T[]): (T & { rang: number })[] {
  return [...membres]
    .sort(
      (a, b) =>
        b.xp - a.xp ||
        a.rejointLe.localeCompare(b.rejointLe) ||
        a.id.localeCompare(b.id),
    )
    .map((m, i) => ({ ...m, rang: i + 1 }))
}

// ------------------------------------------------------------------ les gemmes

export const GEMMES_DIVISION = 10
export const GEMMES_RANG = 25
export const GEMMES_PODIUM = [15, 10, 5] as const

/**
 * Les gemmes de fin de semaine : la montée d'une division (10), ou le passage
 * au rang suivant (25, Bronze 1 → Argent 4) ; plus le podium (15, 10, 5).
 * Rien sans XP dans la semaine.
 */
export function gemmesDeFinDeSemaine({
  avant,
  apres,
  rang,
  xp,
}: {
  avant: number
  apres: number
  rang: number
  xp: number
}): number {
  if (xp <= 0) return 0
  let gemmes = 0
  if (apres > avant) {
    gemmes += echelon(apres).rang.id !== echelon(avant).rang.id ? GEMMES_RANG : GEMMES_DIVISION
  }
  if (rang >= 1 && rang <= GEMMES_PODIUM.length) gemmes += GEMMES_PODIUM[rang - 1]
  return gemmes
}

// ------------------------------------------------------ les amis qui comptent

/**
 * 10 amis comptent, pas plus : dans le coffre d'équipe (les 10 qui ont le
 * plus joué) et dans le multiplicateur d'XP (×2,0 à dix amis). Un garde-fou
 * contre les comptes créés pour gonfler l'un ou l'autre.
 */
export const AMIS_MAX = 10

// ------------------------------------------ le multiplicateur d'XP (migration 380)
//
// LE MULTIPLICATEUR DE GAINS D'XP (Lucas, 24/09/2026 : « à côté de la barre
// de niveau, le multiplicateur d'XP, simplement : ×1,0, ×1,1, ×1,2… ») : toute
// l'XP versée est multipliée — +0,1 par ami accepté (10 au plus : ×2,0), et la
// potion d'XP (le Boost XP du Marché) double le tout. Miroir de
// `xp_avec_bonus` (migration 380), qui l'applique au moment du versement.

/** +0,1 par ami. */
export const BONUS_PAR_AMI = 0.1
/** La potion d'XP double le tout. */
export const FACTEUR_POTION = 2

/** Les amis qui comptent dans le multiplicateur : 0 à 10. */
function amisComptes(nbAmis: number): number {
  return Math.min(AMIS_MAX, Math.max(0, Math.trunc(nbAmis || 0)))
}

/** ×1,0 sans ami, ×1,3 à trois amis, ×2,0 à dix ; ×2 de plus avec la potion. */
export function multiplicateurXp(nbAmis: number, potion: boolean): number {
  return ((10 + amisComptes(nbAmis)) / 10) * (potion ? FACTEUR_POTION : 1)
}

/** « ×1,3 » — toujours une décimale, à la française. */
export function libelleMultiplicateur(multiplicateur: number): string {
  return `×${(Math.round(multiplicateur * 10) / 10).toFixed(1).replace('.', ',')}`
}

/**
 * Ce que rapporte vraiment une XP gagnée (miroir exact de `xp_avec_bonus`) :
 * arrondie après les amis, puis doublée par la potion.
 */
export function xpAvecMultiplicateur(montant: number, nbAmis: number, potion: boolean): number {
  const m = Math.trunc(montant || 0)
  if (m <= 0) return m
  return Math.round((m * (10 + amisComptes(nbAmis))) / 10) * (potion ? FACTEUR_POTION : 1)
}

// ------------------------------------------------------------------ la semaine

/** Le lundi (UTC) de la semaine d'une date, en clé `YYYY-MM-DD`. */
export function lundiUTC(date: Date): string {
  const jour = (date.getUTCDay() + 6) % 7 // lundi = 0
  const lundi = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - jour))
  return lundi.toISOString().slice(0, 10)
}

/** L'instant où la semaine se termine : le lundi suivant, 00:00 UTC. */
export function finDeSemaine(date: Date): Date {
  const lundi = new Date(`${lundiUTC(date)}T00:00:00Z`)
  return new Date(lundi.getTime() + 7 * 24 * 3600_000)
}

/** « 3 j 5 h », « 5 h 12 min », « 12 min » — le compte à rebours de la ligue. */
export function libelleFin(ms: number): string {
  if (!Number.isFinite(ms) || ms < 60_000) return 'moins d’une minute'
  const minutes = Math.floor(ms / 60_000)
  const jours = Math.floor(minutes / 1440)
  const heures = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  if (jours > 0) return `${jours}\u00a0j ${heures}\u00a0h`
  if (heures > 0) return `${heures}\u00a0h ${mins}\u00a0min`
  return `${mins}\u00a0min`
}

// ------------------------------------------------ ce que rend le serveur
// `ligue_etat()` (migration 376), relu et validé : jamais de confiance aveugle
// dans un JSON. `null` = la migration n'est pas passée, ou réponse illisible.

export type MembreLigue = {
  cle: string
  /** L'identifiant de l'élève ; null pour un rival IA. */
  id: string | null
  nom: string
  portrait: string
  xp: number
  rang: number
  robot: boolean
  moi: boolean
}

export type BilanLigue = {
  semaine: string
  echelonAvant: number
  echelonApres: number
  rang: number
  taille: number
  xp: number
  gemmes: number
  nbAmis: number
  bonusXp: number
  niveauAvant: number | null
  niveauApres: number | null
  gemmesNiveau: number
  /** Les paliers de la tirelire versés à la clôture (oubliés dans la semaine). */
  gemmesTirelire: number
  /** Ce que les amis ont versé dans la tirelire (le reste est ma part). */
  tirelireAmis: number
  /** Le niveau du coffre d'équipe enregistré à la clôture (0 : pas de coffre). */
  coffreNiveau: number
}

export type AmiLigue = { id: string; xp: number; echelon: number }

/** Le coffre d'équipe de la semaine en cours, tel que le serveur le rend (migration 379). */
export type CoffreSemaine = {
  /** Mon XP de la semaine. */
  xpMoi: number
  nbAmis: number
  /** L'XP de la semaine des 10 amis qui ont le plus joué. */
  partAmis: number
  /** Mon XP + celle de mes amis : ce qui fait monter le coffre. */
  points: number
}

/** Un coffre d'une semaine finie, prêt à être ouvert. */
export type CoffrePret = {
  semaine: string
  niveau: number
  points: number
  xp: number
  gemmes: number
}

export type EtatLigue = {
  semaine: string
  /** ISO de la fin de la semaine (lundi suivant, 00:00 UTC). */
  fin: string
  echelon: number
  /** Dans un groupe cette semaine (il faut une première XP pour y entrer). */
  inscrit: boolean
  groupe: MembreLigue[]
  xpSemaine: number
  nbAmis: number
  amis: AmiLigue[]
  bilan: BilanLigue | null
  /** null tant que la migration 379 n'est pas passée (l'écran le recalcule). */
  coffre: CoffreSemaine | null
  /** Les coffres des semaines finies, pas encore ouverts (le plus ancien d'abord). */
  coffresPrets: CoffrePret[]
}

const entier = (v: unknown, defaut = 0): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : Number.NaN
  return Number.isFinite(n) ? Math.trunc(n) : defaut
}
const chaine = (v: unknown): string => (typeof v === 'string' ? v : '')
const objet = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null

function lireBilan(raw: unknown): BilanLigue | null {
  const o = objet(raw)
  if (!o || !chaine(o.semaine)) return null
  const niveau = (v: unknown) => (v === null || v === undefined ? null : entier(v))
  return {
    semaine: chaine(o.semaine).slice(0, 10),
    echelonAvant: echelon(entier(o.echelon_avant)).index,
    echelonApres: echelon(entier(o.echelon_apres)).index,
    rang: Math.max(1, entier(o.rang, 1)),
    taille: Math.max(1, entier(o.taille, TAILLE_GROUPE)),
    xp: Math.max(0, entier(o.xp)),
    gemmes: Math.max(0, entier(o.gemmes)),
    nbAmis: Math.max(0, entier(o.nb_amis)),
    bonusXp: Math.max(0, entier(o.bonus_xp)),
    niveauAvant: niveau(o.niveau_avant),
    niveauApres: niveau(o.niveau_apres),
    gemmesNiveau: Math.max(0, entier(o.gemmes_niveau)),
    gemmesTirelire: Math.max(0, entier(o.gemmes_tirelire)),
    tirelireAmis: Math.max(0, entier(o.tirelire_amis)),
    coffreNiveau: Math.min(COFFRE_NIVEAU_MAX, Math.max(0, entier(o.coffre_niveau))),
  }
}

function lireCoffre(raw: unknown): CoffreSemaine | null {
  const o = objet(raw)
  if (!o || o.points === undefined) return null
  return {
    xpMoi: Math.max(0, entier(o.xp_moi)),
    nbAmis: Math.max(0, entier(o.nb_amis)),
    partAmis: Math.max(0, entier(o.part_amis)),
    points: Math.max(0, entier(o.points)),
  }
}

function lireCoffresPrets(raw: unknown): CoffrePret[] {
  return (Array.isArray(raw) ? raw : [])
    .flatMap((c): CoffrePret[] => {
      const x = objet(c)
      const niveau = x ? entier(x.niveau) : 0
      if (!x || !chaine(x.semaine) || niveau < 1) return []
      return [
        {
          semaine: chaine(x.semaine).slice(0, 10),
          niveau: Math.min(COFFRE_NIVEAU_MAX, niveau),
          points: Math.max(0, entier(x.points)),
          xp: Math.max(0, entier(x.xp)),
          gemmes: Math.max(0, entier(x.gemmes)),
        },
      ]
    })
    .sort((a, b) => a.semaine.localeCompare(b.semaine))
}

/** Relit la réponse de `ligue_etat()`. */
export function lireEtatLigue(raw: unknown): EtatLigue | null {
  const o = objet(raw)
  if (!o || !chaine(o.semaine) || !chaine(o.fin)) return null
  const groupe = (Array.isArray(o.groupe) ? o.groupe : []).flatMap((m): MembreLigue[] => {
    const x = objet(m)
    if (!x || !chaine(x.cle)) return []
    return [
      {
        cle: chaine(x.cle),
        id: chaine(x.id) || null,
        nom: chaine(x.nom).trim() || 'Élève',
        portrait: chaine(x.portrait),
        xp: Math.max(0, entier(x.xp)),
        rang: Math.max(1, entier(x.rang, 1)),
        robot: x.robot === true,
        moi: x.moi === true,
      },
    ]
  })
  const amis = (Array.isArray(o.amis) ? o.amis : []).flatMap((a): AmiLigue[] => {
    const x = objet(a)
    return x && chaine(x.id)
      ? [{ id: chaine(x.id), xp: Math.max(0, entier(x.xp)), echelon: echelon(entier(x.echelon)).index }]
      : []
  })
  return {
    semaine: chaine(o.semaine).slice(0, 10),
    fin: chaine(o.fin),
    echelon: echelon(entier(o.echelon)).index,
    inscrit: o.inscrit === true && groupe.length > 0,
    groupe: [...groupe].sort((a, b) => a.rang - b.rang),
    xpSemaine: Math.max(0, entier(o.xp_semaine)),
    nbAmis: Math.max(0, entier(o.nb_amis)),
    amis,
    bilan: lireBilan(o.bilan),
    coffre: lireCoffre(o.coffre),
    coffresPrets: lireCoffresPrets(o.coffres_prets),
  }
}

/** Le mouvement qu'un bilan raconte. */
export function mouvementDuBilan(bilan: Pick<BilanLigue, 'echelonAvant' | 'echelonApres'>): Mouvement {
  if (bilan.echelonApres > bilan.echelonAvant) return 'promu'
  if (bilan.echelonApres < bilan.echelonAvant) return 'relegue'
  return 'maintenu'
}

/** Le rang change-t-il avec ce bilan (Bronze → Argent) ? C'est la grande fête. */
export function changeDeRang(bilan: Pick<BilanLigue, 'echelonAvant' | 'echelonApres'>): boolean {
  return echelon(bilan.echelonAvant).rang.id !== echelon(bilan.echelonApres).rang.id
}

/** « Les 7 premiers montent en Bronze 3 » — la règle de la semaine, en une ligne. */
export function regleDeLaSemaine(index: number): string {
  const e = echelon(index)
  const promus = nbPromus(TAILLE_GROUPE, e.index)
  if (promus === 0) return 'Le sommet\u00a0: garde ta place parmi les meilleurs'
  return `Les ${promus} premiers montent en ${echelon(e.index + 1).nom}`
}

export type EtatRail = 'passee' | 'courante' | 'verrouillee'

/** Le rail des six rangs : passés, courant, à venir. */
export function railLigue(index: number): { rang: RankTier; etat: EtatRail }[] {
  const courant = RANK_TIERS.findIndex((t) => t.id === echelon(index).rang.id)
  return RANK_TIERS.map((rang, i) => ({
    rang,
    etat: i === courant ? 'courante' : i < courant ? 'passee' : 'verrouillee',
  }))
}

// ------------------------------------------------------------ les mots de l'UI

// --------------------------------------------- le coffre d'équipe (migration 379)
//
// LE COFFRE D'ÉQUIPE (Lucas, 24/09/2026) remplace la tirelire : toute l'XP que
// je gagne dans la semaine compte DEUX fois — une fois dans ma barre de niveau,
// une fois dans mon coffre —, et celle de mes amis aussi. Le coffre monte de
// niveau en niveau (cinq), ne s'ouvre qu'une fois la semaine finie (le lundi),
// et donne le contenu du niveau ATTEINT. Rien sans XP à soi dans la semaine.
// Miroir de `ligue_coffre_niveaux` et `ligue_coffre` (migration 379).

/** Les cinq niveaux du coffre : le seuil de points, et ce qu'il contient. */
export const COFFRE_NIVEAUX = [
  { niveau: 1, seuil: 100, xp: 100, gemmes: 5 },
  { niveau: 2, seuil: 250, xp: 250, gemmes: 10 },
  { niveau: 3, seuil: 450, xp: 450, gemmes: 15 },
  { niveau: 4, seuil: 700, xp: 700, gemmes: 25 },
  { niveau: 5, seuil: 1000, xp: 1000, gemmes: 40 },
] as const

export const COFFRE_NIVEAU_MAX = COFFRE_NIVEAUX.length

export type NiveauCoffre = (typeof COFFRE_NIVEAUX)[number]

/**
 * Les points du coffre (miroir de `ligue_coffre`) : mon XP de la semaine, plus
 * celle des 10 amis qui ont le plus joué, à 100 %.
 */
export function calculerCoffre(xpMoi: number, xpAmis: readonly number[]): { partAmis: number; points: number } {
  const moi = Math.max(0, Math.trunc(xpMoi || 0))
  const meilleurs = xpAmis
    .map((x) => Math.max(0, Math.trunc(x || 0)))
    .sort((a, b) => b - a)
    .slice(0, AMIS_MAX)
  const partAmis = meilleurs.reduce((total, x) => total + x, 0)
  return { partAmis, points: moi + partAmis }
}

/** Le niveau atteint (0 sous le premier seuil, 5 au plus). */
export function niveauCoffre(points: number): number {
  const p = Math.max(0, Math.trunc(points || 0))
  let niveau = 0
  for (const n of COFFRE_NIVEAUX) if (p >= n.seuil) niveau = n.niveau
  return niveau
}

/** Ce que contient un coffre de ce niveau (null : le niveau 0 est vide). */
export function contenuCoffre(niveau: number): NiveauCoffre | null {
  return COFFRE_NIVEAUX.find((n) => n.niveau === niveau) ?? null
}

export type ProgressionCoffre = {
  niveau: number
  /** Le niveau suivant, ou null au sommet. */
  suivant: NiveauCoffre | null
  /** Part du chemin vers le niveau suivant (0 → 1 ; 1 au sommet). */
  part: number
  /** Points qui manquent pour le suivant (0 au sommet). */
  reste: number
}

/** Où en est le coffre : son niveau, et le chemin vers le suivant. */
export function progressionCoffre(points: number): ProgressionCoffre {
  const p = Math.max(0, Math.trunc(points || 0))
  const niveau = niveauCoffre(p)
  const suivant = COFFRE_NIVEAUX.find((n) => n.niveau === niveau + 1) ?? null
  if (!suivant) return { niveau, suivant: null, part: 1, reste: 0 }
  const depart = contenuCoffre(niveau)?.seuil ?? 0
  return {
    niveau,
    suivant,
    part: Math.min(1, Math.max(0, (p - depart) / (suivant.seuil - depart))),
    reste: suivant.seuil - p,
  }
}

/**
 * Part de chaque tronçon de la jauge du coffre (un tronçon par niveau, de 0 au
 * seuil du niveau 1, puis de seuil en seuil) : pleine, entamée ou vide.
 */
export function tronconsCoffre(points: number): number[] {
  const p = Math.max(0, Math.trunc(points || 0))
  return COFFRE_NIVEAUX.map((n, i) => {
    const depart = i === 0 ? 0 : COFFRE_NIVEAUX[i - 1].seuil
    return Math.min(1, Math.max(0, (p - depart) / (n.seuil - depart)))
  })
}

/**
 * « 1 180 » : les milliers groupés par l'espace fine insécable. Pas de
 * `toLocaleString`, dont le résultat dépend de l'appareil (lib/jeux/records).
 */
export function nombreFr(n: number): string {
  return String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')
}

/** Ce que raconte l'écran de fin de semaine : un titre, une phrase, un ton. */
export type RecitBilan = {
  mouvement: Mouvement
  /** Le rang change (Bronze → Argent) : la grande fête. */
  nouveauRang: boolean
  titre: string
  phrase: string
}

/** « 1re », « 2e », « 30e ». */
export function ordinal(n: number): string {
  return n === 1 ? '1re' : `${n}e`
}

export function recitBilan(bilan: BilanLigue): RecitBilan {
  const m = mouvementDuBilan(bilan)
  const apres = echelon(bilan.echelonApres)
  const place = `${ordinal(bilan.rang)} sur ${bilan.taille}`
  if (m === 'promu') {
    const nouveauRang = changeDeRang(bilan)
    return {
      mouvement: m,
      nouveauRang,
      titre: nouveauRang ? `Bienvenue en ${apres.rang.name}\u00a0!` : 'Promotion\u00a0!',
      phrase: `${place} la semaine dernière\u00a0: tu montes en ${apres.nom}.`,
    }
  }
  if (m === 'relegue') {
    return {
      mouvement: m,
      nouveauRang: false,
      titre: `Retour en ${apres.nom}`,
      phrase: `${place} la semaine dernière. Une bonne semaine suffit pour remonter.`,
    }
  }
  const promus = nbPromus(TAILLE_GROUPE, apres.index)
  return {
    mouvement: m,
    nouveauRang: false,
    titre: `Tu restes en ${apres.nom}`,
    phrase:
      promus > 0
        ? `${place} la semaine dernière. Finis dans les ${promus} premiers pour monter.`
        : `${place} au sommet. Garde ta place parmi les meilleurs.`,
  }
}

// -------------------------------------------------- le classement des amis

export type JoueurAmi = {
  id: string
  nom: string
  portrait: string
  xp: number
  echelon: number
  moi: boolean
}

/**
 * Mes amis et moi, classés à l'XP de la semaine — comme la ligue. À XP égale,
 * ma ligne passe APRÈS celle de l'ami : il faut le dépasser, pas l'égaler.
 */
export function classerAmis(joueurs: readonly JoueurAmi[]): (JoueurAmi & { rang: number })[] {
  return [...joueurs]
    .sort(
      (a, b) =>
        b.xp - a.xp ||
        Number(a.moi) - Number(b.moi) ||
        a.nom.localeCompare(b.nom, 'fr') ||
        a.id.localeCompare(b.id),
    )
    .map((j, i) => ({ ...j, rang: i + 1 }))
}

/** L'ami juste devant moi (la cible du jour), ou null si je mène. */
export function amiDevant<T extends JoueurAmi & { rang: number }>(lignes: readonly T[]): T | null {
  const moi = lignes.find((l) => l.moi)
  if (!moi || moi.rang <= 1) return null
  return lignes.find((l) => l.rang === moi.rang - 1) ?? null
}

// ----------------------------------------------- l'invitation de la semaine

/**
 * La fenêtre « Fais équipe avec tes amis » s'ouvre d'elle-même UNE fois par
 * semaine, tant que moins de 10 amis comptent dans le coffre d'équipe et
 * qu'aucun bilan n'attend d'être joué (la fête passe d'abord).
 */
export function doitProposerInvitation({
  nbAmis,
  bilanEnAttente,
  semaine,
  derniereSemaineVue,
}: {
  nbAmis: number
  bilanEnAttente: boolean
  semaine: string
  derniereSemaineVue: string | null
}): boolean {
  if (bilanEnAttente || nbAmis >= AMIS_MAX) return false
  return derniereSemaineVue !== semaine
}

// --------------------------------------------- le signal « un bilan attend »

/**
 * L'événement de fenêtre qui dit qu'un bilan de semaine attend (detail: true)
 * ou vient d'être vu (false). Émis par le réveil de la ligue et par l'écran de
 * fin de semaine ; écouté par la pastille de l'onglet Amis et par l'onglet
 * lui-même, gardé vivant, qui se relit alors une fois.
 */
export const EVENEMENT_BILAN_LIGUE = 'studuel:ligue-bilan'
/** Le dernier état annoncé, pour qui monte APRÈS l'annonce (la pastille, l'onglet). */
export const CLE_BILAN_LIGUE = 'studuel-ligue-bilan'

/** Un bilan attend-il, d'après la dernière annonce de cette session ? */
export function bilanLigueEnAttente(): boolean {
  try {
    return sessionStorage.getItem(CLE_BILAN_LIGUE) === '1'
  } catch {
    return false
  }
}

/** Annonce l'état du bilan (et le retient). Sans navigateur : ne fait rien. */
export function annoncerBilanLigue(enAttente: boolean): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CLE_BILAN_LIGUE, enAttente ? '1' : '0')
  } catch {
    // stockage indisponible : l'événement suffit à qui écoute déjà
  }
  window.dispatchEvent(new CustomEvent<boolean>(EVENEMENT_BILAN_LIGUE, { detail: enAttente }))
}

/** Écoute l'état du bilan. Rend le désabonnement. */
export function ecouterBilanLigue(ecoute: (enAttente: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (event: Event) => ecoute((event as CustomEvent<boolean>).detail === true)
  window.addEventListener(EVENEMENT_BILAN_LIGUE, handler)
  return () => window.removeEventListener(EVENEMENT_BILAN_LIGUE, handler)
}

/** Ce que rend l'ouverture d'un coffre (`coffre_equipe_ouvrir`, migration 379). */
export type OuvertureCoffre =
  | {
      ok: true
      semaine: string
      niveau: number
      /** XP et gemmes VRAIMENT versées (bonus d'abonné compris). */
      xp: number
      gemmes: number
      niveauAvant: number | null
      niveauApres: number | null
      /** Gemmes des niveaux de joueur gagnés grâce à l'XP du coffre. */
      gemmesNiveau: number
    }
  | { ok: false; raison: 'anonyme' | 'introuvable' | 'deja_ouvert' | 'semaine' | 'bientot' | 'erreur' }

const RAISONS_REFUS = ['anonyme', 'introuvable', 'deja_ouvert'] as const

/** Relit la réponse de `coffre_equipe_ouvrir`. */
export function lireOuvertureCoffre(raw: unknown): OuvertureCoffre {
  const o = objet(raw)
  if (!o) return { ok: false, raison: 'erreur' }
  if (o.ok !== true) {
    const raison = RAISONS_REFUS.find((r) => r === o.raison)
    return { ok: false, raison: raison ?? 'erreur' }
  }
  const niveauJoueur = (v: unknown) => (v === null || v === undefined ? null : Math.max(0, entier(v)))
  return {
    ok: true,
    semaine: chaine(o.semaine).slice(0, 10),
    niveau: Math.min(COFFRE_NIVEAU_MAX, Math.max(0, entier(o.niveau))),
    xp: Math.max(0, entier(o.xp)),
    gemmes: Math.max(0, entier(o.gemmes)),
    niveauAvant: niveauJoueur(o.niveau_avant),
    niveauApres: niveauJoueur(o.niveau_apres),
    gemmesNiveau: Math.max(0, entier(o.gemmes_niveau)),
  }
}

/** Les gains d'une ouverture, pour la volée vers le bandeau (lib/gains). */
export function gainsOuverture(o: Extract<OuvertureCoffre, { ok: true }>): { unite: 'xp' | 'gemme'; montant: number }[] {
  const gains: { unite: 'xp' | 'gemme'; montant: number }[] = []
  if (o.xp > 0) gains.push({ unite: 'xp', montant: o.xp })
  const gemmes = o.gemmes + o.gemmesNiveau
  if (gemmes > 0) gains.push({ unite: 'gemme', montant: gemmes })
  return gains
}

// ------------------------------------------ le signal « un coffre attend »

/**
 * Le coffre d'une semaine finie attend d'être ouvert (detail: true) ou vient
 * de l'être (false). Même mécanique que le bilan : émis par le réveil de la
 * ligue et par l'ouverture, écouté par la pastille de l'onglet Amis.
 */
export const EVENEMENT_COFFRE_PRET = 'studuel:coffre-pret'
export const CLE_COFFRE_PRET = 'studuel-coffre-pret'

export function coffrePretEnAttente(): boolean {
  try {
    return sessionStorage.getItem(CLE_COFFRE_PRET) === '1'
  } catch {
    return false
  }
}

export function annoncerCoffrePret(enAttente: boolean): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CLE_COFFRE_PRET, enAttente ? '1' : '0')
  } catch {
    // stockage indisponible : l'événement suffit à qui écoute déjà
  }
  window.dispatchEvent(new CustomEvent<boolean>(EVENEMENT_COFFRE_PRET, { detail: enAttente }))
}

export function ecouterCoffrePret(ecoute: (enAttente: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (event: Event) => ecoute((event as CustomEvent<boolean>).detail === true)
  window.addEventListener(EVENEMENT_COFFRE_PRET, handler)
  return () => window.removeEventListener(EVENEMENT_COFFRE_PRET, handler)
}

// ------------------------------------------------ les gains, ligne par ligne

export type LigneGain = {
  cle: 'montee' | 'podium' | 'tirelire' | 'paliers' | 'niveau' | 'gemmes'
  libelle: string
  montant: number
  unite: 'gemme' | 'xp'
}

/**
 * Ce que la semaine a rapporté, ligne par ligne, pour l'écran de fin : la
 * montée, le podium, le bonus d'amis, le niveau gagné. Le total de gemmes du
 * serveur fait foi : si le détail recalculé ne tombe pas juste (barème changé
 * entre-temps), une seule ligne « Gemmes de la semaine » le remplace.
 */
export function lignesGainsBilan(bilan: BilanLigue): LigneGain[] {
  const lignes: LigneGain[] = []
  const apres = echelon(bilan.echelonApres)
  const montee = gemmesDeFinDeSemaine({
    avant: bilan.echelonAvant,
    apres: bilan.echelonApres,
    rang: 0,
    xp: bilan.xp,
  })
  const podium = bilan.xp > 0 && bilan.rang <= GEMMES_PODIUM.length ? GEMMES_PODIUM[bilan.rang - 1] : 0
  if (montee + podium === bilan.gemmes) {
    if (montee > 0) {
      lignes.push({
        cle: 'montee',
        libelle: changeDeRang(bilan) ? `Nouveau rang\u00a0: ${apres.rang.name}` : `Montée en ${apres.nom}`,
        montant: montee,
        unite: 'gemme',
      })
    }
    if (podium > 0) {
      lignes.push({ cle: 'podium', libelle: `Podium\u00a0: ${ordinal(bilan.rang)} place`, montant: podium, unite: 'gemme' })
    }
  } else if (bilan.gemmes > 0) {
    lignes.push({ cle: 'gemmes', libelle: 'Gemmes de la semaine', montant: bilan.gemmes, unite: 'gemme' })
  }
  if (bilan.bonusXp > 0) {
    lignes.push({ cle: 'tirelire', libelle: 'Tirelire d’amis', montant: bilan.bonusXp, unite: 'xp' })
  }
  if (bilan.gemmesTirelire > 0) {
    lignes.push({
      cle: 'paliers',
      libelle: 'Paliers de la tirelire',
      montant: bilan.gemmesTirelire,
      unite: 'gemme',
    })
  }
  if (bilan.niveauAvant !== null && bilan.niveauApres !== null && bilan.niveauApres > bilan.niveauAvant) {
    lignes.push({
      cle: 'niveau',
      libelle: `Niveau ${bilan.niveauAvant} → ${bilan.niveauApres}`,
      montant: bilan.gemmesNiveau,
      unite: 'gemme',
    })
  }
  return lignes
}
