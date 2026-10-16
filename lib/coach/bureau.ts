// -----------------------------------------------------------------------------
// LE BUREAU DE MARCEL — ce que montre son écran, onglet par onglet (16/10/2026).
//
// Lucas a choisi la barre « Aujourd'hui · Radar · Toi · Outils »
// (assets-sources/maquettes/marcel-bureau-plus.html, maquette 2, puis
// marcel-onglets.html) et une règle : « la fatigue va avec la journée — plus la
// journée avance, plus ils sont fatigués, il faut adapter la recommandation en
// temps : 15, 10, 5 minutes ». Il n'y a donc pas de sélecteur d'humeur : c'est
// l'HEURE DE PARIS qui décide de la longueur de la séance.
//
// Rien ici ne coûte un jeton : la séance reprend la mission que Réviser choisit
// déjà (lib/mission), le plan du contrôle se déduit de ses chapitres. C'est ce
// qui permet d'offrir « Aujourd'hui » et « Radar » à l'élève gratuit.
//
// Logique PURE et testée (bureau.test.ts).
// -----------------------------------------------------------------------------

import { missionHref, type Mission, type MissionPlan } from '../mission'
import { JOURS_FR } from '../time'

// ------------------------------------------------------------------ onglets

export const ONGLETS_MARCEL = ['aujourdhui', 'radar', 'toi', 'outils'] as const
export type OngletMarcel = (typeof ONGLETS_MARCEL)[number]

export const LIBELLE_ONGLET: Record<OngletMarcel, string> = {
  aujourdhui: 'Aujourd’hui',
  radar: 'Radar',
  toi: 'Toi',
  outils: 'Outils',
}

/** L'onglet de l'adresse (`?onglet=`), sinon « Aujourd'hui ». */
export function parseOnglet(raw: unknown): OngletMarcel {
  return typeof raw === 'string' && (ONGLETS_MARCEL as readonly string[]).includes(raw)
    ? (raw as OngletMarcel)
    : 'aujourdhui'
}

// ------------------------------------------------- la durée suit la journée

export type Palier = 'complet' | 'moyen' | 'express'

export type Rythme = {
  palier: Palier
  /** La durée proposée ce soir. */
  minutes: 15 | 10 | 5
  /** Le nombre de gestes qui tiennent dans cette durée. */
  nbGestes: 3 | 2 | 1
}

/** Avant 17 h : la version complète. De 17 h à 20 h : 10 min. Après : 5 min. */
export const HEURE_MOYEN = 17
export const HEURE_EXPRESS = 20

export const RYTHMES: Record<Palier, Rythme> = {
  complet: { palier: 'complet', minutes: 15, nbGestes: 3 },
  moyen: { palier: 'moyen', minutes: 10, nbGestes: 2 },
  express: { palier: 'express', minutes: 5, nbGestes: 1 },
}

/** Le rythme de l'heure (de Paris, 0–23). */
export function rythmeDeLHeure(heure: number): Rythme {
  if (!Number.isFinite(heure) || heure < HEURE_MOYEN) return RYTHMES.complet
  if (heure < HEURE_EXPRESS) return RYTHMES.moyen
  return RYTHMES.express
}

// ------------------------------------------------------- la séance du jour

export type Geste = {
  cle: string
  titre: string
  detail: string
  minutes: number
  href: string
}

export type Seance = Rythme & {
  /** Ce qui tient dans la durée de ce soir. */
  gestes: Geste[]
  /** Ce qui attend demain — le soir, on n'empile pas. */
  reportes: Geste[]
}

function titreDuGeste(m: Mission): string {
  if (m.kind === 'controle') return `Préparer « ${m.chapterTitle} »`
  if (m.kind === 'decouverte' || m.isNew) return `Découvrir « ${m.chapterTitle} »`
  return `Reprendre « ${m.chapterTitle} »`
}

function detailDuGeste(m: Mission): string {
  const pourquoi = m.countdown
    ? `contrôle ${m.countdown}`
    : m.progress !== null && !m.isNew
      ? `à ${Math.round(m.progress * 100)} %`
      : 'nouveau'
  return `${m.subjectName} · ${pourquoi} · ${m.minutes} min`
}

function geste(m: Mission): Geste {
  return {
    cle: `${m.kind}:${m.chapterId}`,
    titre: titreDuGeste(m),
    detail: detailDuGeste(m),
    minutes: m.minutes,
    href: missionHref(m),
  }
}

/**
 * Les gestes de ce soir : la mission de Réviser d'abord, puis la suite qu'elle
 * propose, coupés au nombre que l'heure permet. Un même chapitre ne revient
 * jamais deux fois.
 */
export function seanceDuJour(plan: MissionPlan, heure: number): Seance {
  const rythme = rythmeDeLHeure(heure)
  const vus = new Set<string>()
  const tous: Geste[] = []
  for (const m of [plan.mission, ...plan.ensuite]) {
    if (!m || vus.has(m.chapterId)) continue
    vus.add(m.chapterId)
    tous.push(geste(m))
  }
  return { ...rythme, gestes: tous.slice(0, rythme.nbGestes), reportes: tous.slice(rythme.nbGestes) }
}

// --------------------------------------------------------- les jours, en mots

function decaler(jour: string, n: number): Date {
  const d = new Date(`${jour}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d
}

/** « Jeudi » pour le jour `aujourdhui + n`. */
export function nomDuJour(aujourdhui: string, n: number): string {
  const nom = JOURS_FR[decaler(aujourdhui, n).getUTCDay()]
  return nom.charAt(0).toUpperCase() + nom.slice(1)
}

/** « aujourd'hui », « demain », « jeudi » ou « dans 9 jours ». */
export function quandEnMots(aujourdhui: string, dans: number): string {
  if (dans <= 0) return 'aujourd’hui'
  if (dans === 1) return 'demain'
  if (dans < 7) return nomDuJour(aujourdhui, dans).toLowerCase()
  return `dans ${dans} jours`
}

// ---------------------------------------------------- le contrôle qui vient

export type ControleBureau = {
  matiere: string
  slug: string | null
  /** Le premier chapitre du contrôle : là où « Réviser » emmène. */
  chapitreId: string | null
  /** Jours avant le contrôle (0 = aujourd'hui). */
  dans: number
  chapitres: string[]
  /** Préparation : la maîtrise moyenne de ses chapitres, en pourcent. */
  pret: number
}

export type EtapeControle = { quand: string; quoi: string; maintenant: boolean }

const ECLAIR = '5 questions éclair'

/**
 * Le plan jusqu'au contrôle, en trois temps au plus : ce soir le premier
 * chapitre, la veille le suivant, le jour J une révision éclair. Un contrôle
 * demain tient en deux temps, un contrôle aujourd'hui en un.
 */
export function planDuControle(c: Pick<ControleBureau, 'dans' | 'chapitres'>, aujourdhui: string): EtapeControle[] {
  const chapitres = c.chapitres.length > 0 ? c.chapitres : ['Tout le chapitre']
  if (c.dans <= 0) return [{ quand: 'Aujourd’hui', quoi: ECLAIR, maintenant: true }]
  const jourJ = `${nomDuJour(aujourdhui, c.dans)} matin`
  if (c.dans === 1) {
    return [
      { quand: 'Ce soir', quoi: chapitres.join(' · '), maintenant: true },
      { quand: jourJ, quoi: ECLAIR, maintenant: false },
    ]
  }
  const [premier, ...reste] = chapitres
  return [
    { quand: 'Ce soir', quoi: premier, maintenant: true },
    { quand: nomDuJour(aujourdhui, c.dans - 1), quoi: reste.length > 0 ? reste.join(' · ') : 'Tout revoir', maintenant: false },
    { quand: jourJ, quoi: ECLAIR, maintenant: false },
  ]
}

/** La préparation d'un contrôle : la moyenne des maîtrises (0–1) en pourcent. */
export function preparation(valeurs: readonly number[]): number {
  if (valeurs.length === 0) return 0
  const somme = valeurs.reduce((s, v) => s + Math.max(0, Math.min(1, v)), 0)
  return Math.round((somme / valeurs.length) * 100)
}

/** Le ton d'une préparation, en rôles de la DA (écran de bilan : feu tricolore). */
export function tonPreparation(pret: number): 'success' | 'warning' | 'destructive' {
  if (pret >= 70) return 'success'
  if (pret >= 40) return 'warning'
  return 'destructive'
}

// ------------------------------------------------- le décor et la pose de l’heure

export type Decor = 'jour' | 'soir'

/** Le bureau peint au jour de 7 h à 18 h, à la lampe le reste du temps. */
export function decorDuMoment(heure: number): Decor {
  return heure >= 7 && heure < 18 ? 'jour' : 'soir'
}

/** Marcel bâille, un chocolat à la main, quand la séance passe en express. */
export function poseDuMoment(heure: number): 'salut' | 'soir' {
  return rythmeDeLHeure(heure).palier === 'express' ? 'soir' : 'salut'
}

// ---------------------------------------------------------- ce que dit Marcel

/**
 * La phrase de Marcel en haut du bureau : l'heure, ce qu'elle permet, et le
 * contrôle qui vient s'il y en a un.
 */
export function bulleDuJour(heure: number, controle: ControleBureau | null, aujourdhui: string): string {
  const { palier } = rythmeDeLHeure(heure)
  const ctrl = controle
    ? `Ton contrôle de ${controle.matiere}, c’est ${quandEnMots(aujourdhui, controle.dans)}. `
    : ''
  if (palier === 'complet') return `Salut ! ${ctrl}T’as de l’énergie : on fait la séance complète.`
  if (palier === 'moyen') return `Salut ! ${ctrl}Une séance de 10 minutes, ça passe.`
  return `Il est ${heure} h, tu dois être cuit. ${ctrl}Juste l’essentiel : 5 minutes.`
}
