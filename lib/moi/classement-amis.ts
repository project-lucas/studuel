// -----------------------------------------------------------------------------
// LE CLASSEMENT ENTRE AMIS — logique pure de l'onglet Progrès de Moi.
//
// Lucas, 01/10/2026 : « à la place du bloc matière, un classement VISUEL du
// user vis-à-vis de ses amis (trophées, temps de travail, en temps réel) pour
// qu'il puisse se comparer et vouloir battre les autres, avec la couronne pour
// le numéro 1 et un autre icône pour celui qui a le plus révisé et gagné de
// trophées (challenger par exemple) ».
//
// Une colonne par personne, de la plus haute à la plus basse, sur l'une des
// deux mesures :
//   · les TROPHÉES — le total de l'arène ;
//   · le TEMPS DE TRAVAIL — celui de la SEMAINE (du lundi UTC, comme la
//     ligue) : le cumul de toute une vie ne se rattrape pas, une semaine si.
//
// Deux distinctions, qui ne disent pas la même chose :
//   · la COURONNE va au n° 1 de la mesure affichée ;
//   · le CHALLENGER est celui qui a fait la meilleure SEMAINE — le plus de
//     travail et de trophées gagnés. C'est lui qui menace le classement, où
//     qu'il s'y trouve.
//
// Les données viennent de `classement_amis()` (migration 465). Miroir de rien :
// la base rend les nombres, tout le reste est ici.
// -----------------------------------------------------------------------------

import { formatDuree } from '@/lib/moi/temps'

export type AmiClasse = {
  id: string
  /** Le prénom. */
  nom: string
  /** Le blason (`profiles.avatar.portrait`), '' s'il n'y en a pas. */
  portrait: string
  moi: boolean
  /** Le total de trophées de l'arène. */
  trophees: number
  /** Gagnés (ou perdus) depuis lundi. */
  tropheesSemaine: number
  /** Le temps de travail de la semaine, en secondes. */
  secondesSemaine: number
  /** Le cumul de toujours, en secondes. */
  secondes: number
}

export type Mesure = 'trophees' | 'temps'

export const MESURES: readonly { cle: Mesure; label: string }[] = [
  { cle: 'trophees', label: 'Trophées' },
  { cle: 'temps', label: 'Temps de travail' },
]

// ------------------------------------------------------------------ la lecture

const entier = (v: unknown): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : Number.NaN
  return Number.isFinite(n) ? Math.trunc(n) : 0
}

/**
 * Ce que rend `classement_amis()`, relu sans rien croire : une ligne mal formée
 * est écartée, un nombre absent vaut zéro, un temps ne peut pas être négatif.
 */
export function lireClassementAmis(brut: unknown): AmiClasse[] {
  if (!Array.isArray(brut)) return []
  return brut.flatMap((ligne): AmiClasse[] => {
    if (!ligne || typeof ligne !== 'object') return []
    const l = ligne as Record<string, unknown>
    if (typeof l.id !== 'string' || l.id.length === 0) return []
    return [
      {
        id: l.id,
        nom: typeof l.nom === 'string' && l.nom.trim() ? l.nom.trim() : 'Élève',
        portrait: typeof l.portrait === 'string' ? l.portrait : '',
        moi: l.moi === true,
        trophees: Math.max(0, entier(l.trophees)),
        tropheesSemaine: entier(l.trophees_semaine),
        secondesSemaine: Math.max(0, entier(l.secondes_semaine)),
        secondes: Math.max(0, entier(l.secondes)),
      },
    ]
  })
}

// --------------------------------------------------------------- le classement

/** Le nombre qui fait la longueur de la barre, pour la mesure affichée. */
export function valeurDe(joueur: AmiClasse, mesure: Mesure): number {
  return mesure === 'trophees' ? joueur.trophees : joueur.secondesSemaine
}

export type AmiRange = AmiClasse & { rang: number }

/**
 * Du plus haut au plus bas. À égalité, ma ligne passe APRÈS celle de l'ami
 * (comme dans la ligue : il faut le dépasser, pas l'égaler), puis le prénom.
 * Les ex æquo gardent des rangs distincts : une colonne, une place.
 */
export function classerAmisPar(joueurs: readonly AmiClasse[], mesure: Mesure): AmiRange[] {
  return [...joueurs]
    .sort(
      (a, b) =>
        valeurDe(b, mesure) - valeurDe(a, mesure) ||
        Number(a.moi) - Number(b.moi) ||
        a.nom.localeCompare(b.nom, 'fr') ||
        a.id.localeCompare(b.id),
    )
    .map((j, i) => ({ ...j, rang: i + 1 }))
}

/**
 * Celui qui porte la couronne : le n° 1 de la mesure, s'il a quelque chose à
 * montrer. Une couronne sur une colonne à zéro ne récompenserait rien.
 */
export function couronneDe(classes: readonly AmiRange[], mesure: Mesure): string | null {
  const premier = classes[0]
  return premier && valeurDe(premier, mesure) > 0 ? premier.id : null
}

/**
 * LE CHALLENGER : la meilleure semaine du cercle. Chaque joueur reçoit une
 * part de 0 à 1 sur le temps travaillé et une autre sur les trophées GAGNÉS
 * (une semaine perdante vaut zéro, pas moins), rapportées au meilleur du
 * cercle ; le challenger est celui dont la somme est la plus haute.
 *
 * Il faut au moins deux personnes (on ne se défie pas soi-même) et une
 * semaine où quelqu'un a fait quelque chose. À égalité : le plus de travail,
 * puis l'ami avant moi.
 */
export function challengerDe(joueurs: readonly AmiClasse[]): string | null {
  if (joueurs.length < 2) return null
  const gain = (j: AmiClasse) => Math.max(0, j.tropheesSemaine)
  const maxTemps = Math.max(0, ...joueurs.map((j) => j.secondesSemaine))
  const maxGain = Math.max(0, ...joueurs.map(gain))
  const elan = (j: AmiClasse) =>
    (maxTemps > 0 ? j.secondesSemaine / maxTemps : 0) + (maxGain > 0 ? gain(j) / maxGain : 0)

  const meilleur = [...joueurs].sort(
    (a, b) =>
      elan(b) - elan(a) ||
      b.secondesSemaine - a.secondesSemaine ||
      Number(a.moi) - Number(b.moi) ||
      a.id.localeCompare(b.id),
  )[0]
  return meilleur && elan(meilleur) > 0 ? meilleur.id : null
}

// -------------------------------------------------------------------- les barres

/** Longueur minimale d'une barre qui a quelque chose, en % : elle reste visible. */
export const PART_MIN_PCT = 8

/** La longueur de chaque barre, en % de la plus longue (qui fait 100). */
export function partsDuMeilleur(classes: readonly AmiClasse[], mesure: Mesure): number[] {
  const max = Math.max(0, ...classes.map((j) => valeurDe(j, mesure)))
  if (max <= 0) return classes.map(() => 0)
  return classes.map((j) => {
    const valeur = valeurDe(j, mesure)
    return valeur <= 0 ? 0 : Math.max(PART_MIN_PCT, Math.round((valeur / max) * 100))
  })
}

// --------------------------------------------------------------------- les mots

/** « 1 280 » — les milliers groupés par l'espace fine insécable. */
function nombre(n: number): string {
  return String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** Ce qui s'écrit au bout d'une barre : « 128 », « 2 h 10 ». */
export function libelleValeur(joueur: AmiClasse, mesure: Mesure): string {
  return mesure === 'trophees' ? nombre(joueur.trophees) : formatDuree(joueur.secondesSemaine)
}

/** « +12 », « −4 », « 0 » : le mouvement des trophées dans la semaine. */
export function libelleMouvement(tropheesSemaine: number): string {
  if (tropheesSemaine > 0) return `+${nombre(tropheesSemaine)}`
  if (tropheesSemaine < 0) return `−${nombre(-tropheesSemaine)}`
  return '0'
}

/** Le détail de la ligne touchée, dit en entier. */
export function detailJoueur(joueur: AmiClasse): string {
  const qui = joueur.moi ? 'Toi' : joueur.nom
  const trophees = `${nombre(joueur.trophees)} trophée${joueur.trophees > 1 ? 's' : ''}`
  return `${qui} · ${trophees} (${libelleMouvement(joueur.tropheesSemaine)} cette semaine) · ${formatDuree(joueur.secondesSemaine)} de travail cette semaine`
}

/**
 * LA PHRASE SOUS LE TITRE : où j'en suis, et ce qu'il faut pour passer devant.
 * C'est elle qui donne envie de jouer — un écart, un prénom.
 */
export function phraseDuClassement(classes: readonly AmiRange[], mesure: Mesure): string {
  const moi = classes.find((j) => j.moi)
  if (!moi) return ''
  if (classes.length === 1) return 'Ajoute un ami pour vous mesurer.'

  const quoi = mesure === 'trophees' ? 'aux trophées' : 'au temps de travail de la semaine'
  // À égalité l'ami passe devant : si je suis premier, c'est que je mène vraiment.
  if (moi.rang === 1) return `Tu mènes ${quoi}. Garde ta place.`
  if (valeurDe(classes[0], mesure) <= 0) return 'Personne n’a encore marqué : prends la tête.'
  const devant = classes[moi.rang - 2]
  const ecart = valeurDe(devant, mesure) - valeurDe(moi, mesure)
  if (mesure === 'trophees') {
    const manque = ecart + 1
    return `Encore ${nombre(manque)} trophée${manque > 1 ? 's' : ''} pour passer devant ${devant.nom}.`
  }
  // Moins d'une minute d'écart ne s'écrit pas « 0 min ».
  return ecart < 60
    ? `${devant.nom} est juste devant toi : une minute de travail suffit.`
    : `Encore ${formatDuree(ecart)} de travail pour passer devant ${devant.nom}.`
}
