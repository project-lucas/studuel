// -----------------------------------------------------------------------------
// LE COURRIER — la logique pure (25/10/2026, cadrage « le jeu vivant » § G,
// migration 602).
//
// Une boîte aux lettres par élève : les mots de Marcel, les cadeaux à
// récupérer, les nouveautés — et, FUSIONNÉS côté serveur (`courrier_boite`),
// les diffusions du coach et de l'admin (588) et les défis reçus des amis
// (558). Ici : la lecture sans rien croire de ce que rend la base, le tri, les
// onglets (Tout · Marcel · Amis · Coach), le compte des non-lus (le MÊME que
// `courrier_non_lus`), « il y a 2 h », et les gains sous la forme que le vol
// des récompenses attend. Sans réseau, testé.
//
// LES GAINS RESTENT DÉCIDÉS PAR LE SERVEUR (décision 2 du cadrage) : ce module
// met en forme ce que `courrier_encaisser` a VERSÉ, il ne calcule jamais une
// récompense.
// -----------------------------------------------------------------------------

import { lienDirect, lireDefisRecus } from '@/lib/amis/defi-ami'
import type { Gain } from '@/lib/gains'
import { epreuve, formatScore, type EpreuveId } from '@/lib/palmares/epreuves'

export type TypeLettre = 'marcel' | 'cadeau' | 'coach' | 'ami' | 'nouveaute'
/** D'où vient une lettre : la table `courrier`, une diffusion (588), un défi (558). */
export type SourceLettre = 'courrier' | 'annonce' | 'defi'
export type OngletCourrier = 'tout' | 'marcel' | 'amis' | 'coach'

/** Les poses de Marcel qu'une lettre peut demander (components/marcel/PoseMarcel). */
export const POSES_LETTRE = ['salut', 'soir', 'dort', 'ecoute', 'lit', 'invite', 'recharge'] as const
export type PoseLettre = (typeof POSES_LETTRE)[number]

/** Ce qu'une lettre offre — au moins l'un des deux est positif. */
export type GainsLettre = { xp: number; gemmes: number }

/** Le visage posé à gauche de la lettre. */
export type VisageLettre =
  | { genre: 'marcel'; pose: PoseLettre }
  | { genre: 'joueur'; id: string; portrait: string }
  | { genre: 'coach' }
  | { genre: 'studuel' }

export type Lettre = {
  id: string
  source: SourceLettre
  type: TypeLettre
  titre: string
  corps: string
  /** Un lien INTERNE (`/reviser`, `/defi/jeux/…`), jamais une adresse externe. */
  lien: string | null
  lienLibelle: string | null
  gains: GainsLettre | null
  /** Le nom affiché de l'expéditeur. */
  expediteur: string
  visage: VisageLettre
  lue: boolean
  /** Les gains ont été versés (vrai aussi quand il n'y a rien à verser). */
  recuperee: boolean
  /** ISO 8601. */
  recueLe: string
  expireLe: string | null
  /** Un défi d'ami à relever (source `defi`). */
  defi: { mode: EpreuveId | null; sonScore: number | null } | null
}

export const ONGLETS: readonly { id: OngletCourrier; libelle: string }[] = [
  { id: 'tout', libelle: 'Tout' },
  { id: 'marcel', libelle: 'Marcel' },
  { id: 'amis', libelle: 'Amis' },
  { id: 'coach', libelle: 'Coach' },
]

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const LIEN_INTERNE = /^\/(?!\/)[A-Za-z0-9/_?=&#.-]*$/
const TYPES: readonly TypeLettre[] = ['marcel', 'cadeau', 'coach', 'ami', 'nouveaute']
/** Un défi reçu vit sept jours (`defis_recus`, 558). */
export const DEFI_JOURS = 7
const JOUR_MS = 24 * 60 * 60 * 1000

function texte(v: unknown, repli = ''): string {
  return typeof v === 'string' ? v : repli
}

function dateIso(v: unknown): string | null {
  if (typeof v !== 'string' || v.length === 0) return null
  const t = Date.parse(v)
  return Number.isFinite(t) ? new Date(t).toISOString() : null
}

function lienPropre(v: unknown): string | null {
  return typeof v === 'string' && LIEN_INTERNE.test(v) && v.length <= 200 ? v : null
}

function entierPositif(v: unknown): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

/** `{"xp": 50, "gemmes": 5}` relu ; null sans rien de positif. */
export function gainsDepuis(brut: unknown): GainsLettre | null {
  if (!brut || typeof brut !== 'object') return null
  const r = brut as Record<string, unknown>
  const xp = entierPositif(r.xp)
  const gemmes = entierPositif(r.gemmes)
  return xp > 0 || gemmes > 0 ? { xp, gemmes } : null
}

/** Les gains sous la forme du vol des récompenses (`celebrer`). */
export function gainsEnListe(gains: GainsLettre | null | undefined): Gain[] {
  if (!gains) return []
  const liste: Gain[] = []
  if (gains.xp > 0) liste.push({ unite: 'xp', montant: gains.xp })
  if (gains.gemmes > 0) liste.push({ unite: 'gemme', montant: gains.gemmes })
  return liste
}

/** « 50 XP », « 20 XP et 5 gemmes », « 1 gemme ». Chaîne vide sans gain. */
export function resumeGains(gains: GainsLettre | null | undefined): string {
  if (!gains) return ''
  const parts: string[] = []
  if (gains.xp > 0) parts.push(`${gains.xp} XP`)
  if (gains.gemmes > 0) parts.push(`${gains.gemmes} gemme${gains.gemmes > 1 ? 's' : ''}`)
  return parts.join(' et ')
}

/** Une ligne de `courrier_boite().lettres`, relue sans rien croire. */
export function lettreDepuisCourrier(brut: unknown): Lettre | null {
  if (!brut || typeof brut !== 'object') return null
  const r = brut as Record<string, unknown>
  const id = texte(r.id)
  const type = r.type
  const titre = texte(r.titre).trim()
  const recueLe = dateIso(r.created_at)
  if (!UUID.test(id) || !TYPES.includes(type as TypeLettre) || titre.length === 0 || !recueLe) return null
  const gains = gainsDepuis(r.gains)
  const meta = r.meta && typeof r.meta === 'object' ? (r.meta as Record<string, unknown>) : {}
  const expediteur = texte(r.expediteur).trim() || 'Marcel'
  const lettreType = type as TypeLettre
  return {
    id,
    source: 'courrier',
    type: lettreType,
    titre,
    corps: texte(r.corps),
    lien: lienPropre(r.lien),
    lienLibelle: null,
    gains,
    expediteur,
    visage: visageDe(lettreType, expediteur, meta),
    lue: dateIso(r.lu_at) !== null,
    recuperee: gains === null || dateIso(r.encaisse_at) !== null,
    recueLe,
    expireLe: dateIso(r.expire_at),
    defi: null,
  }
}

function visageDe(type: TypeLettre, expediteur: string, meta: Record<string, unknown>): VisageLettre {
  if (type === 'ami') {
    const id = texte(meta.de)
    return { genre: 'joueur', id: UUID.test(id) ? id : expediteur, portrait: texte(meta.portrait) }
  }
  if (type === 'coach') return { genre: 'coach' }
  if (type === 'nouveaute' && expediteur !== 'Marcel') return { genre: 'studuel' }
  const pose = meta.pose
  return { genre: 'marcel', pose: POSES_LETTRE.includes(pose as PoseLettre) ? (pose as PoseLettre) : 'salut' }
}

/** Une diffusion de `courrier_annonces()` (588) : du coach, ou de l'équipe. */
export function lettreDepuisAnnonce(brut: unknown): Lettre | null {
  if (!brut || typeof brut !== 'object') return null
  const r = brut as Record<string, unknown>
  const id = texte(r.id)
  const titre = texte(r.titre).trim()
  const recueLe = dateIso(r.cree_le)
  if (!UUID.test(id) || titre.length === 0 || !recueLe) return null
  const coach = r.auteur_coach === true
  const auteur = texte(r.auteur).trim()
  return {
    id,
    source: 'annonce',
    type: coach ? 'coach' : 'nouveaute',
    titre,
    corps: texte(r.corps),
    lien: lienPropre(r.lien),
    lienLibelle: texte(r.lien_libelle).trim() || null,
    gains: null,
    expediteur: coach ? auteur || 'Ton coach' : 'L’équipe Studuel',
    visage: coach ? { genre: 'coach' } : { genre: 'studuel' },
    lue: dateIso(r.vue_le) !== null,
    recuperee: true,
    recueLe,
    expireLe: null,
    defi: null,
  }
}

/** Un défi reçu de `defis_recus()` (558) : « Léa te défie ! », à relever. */
export function lettreDepuisDefi(brut: unknown): Lettre | null {
  const [d] = lireDefisRecus([brut])
  if (!d) return null
  const recueLe = dateIso((brut as Record<string, unknown>).le) ?? new Date(0).toISOString()
  const mode = d.mode
  const corps = mode
    ? d.sonScore !== null
      ? `${epreuve(mode).nom} · son score : ${formatScore(mode, d.sonScore)}. À toi de faire mieux !`
      : `${epreuve(mode).nom} · à toi de jouer !`
    : 'Un défi du jour t’attend dans l’onglet Amis.'
  return {
    id: d.id,
    source: 'defi',
    type: 'ami',
    titre: `${d.nom} te défie !`,
    corps,
    lien: mode ? lienDirect(mode) : '/amis',
    lienLibelle: 'Relever',
    gains: null,
    expediteur: d.nom,
    visage: { genre: 'joueur', id: d.de, portrait: d.portrait },
    lue: false,
    recuperee: true,
    recueLe,
    expireLe: new Date(Date.parse(recueLe) + DEFI_JOURS * JOUR_MS).toISOString(),
    defi: { mode, sonScore: d.sonScore },
  }
}

/** `courrier_boite()` entière : les trois sources réunies, triées. */
export function boiteDepuis(brut: unknown): Lettre[] {
  if (!brut || typeof brut !== 'object') return []
  const r = brut as Record<string, unknown>
  const liste = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
  const lettres = [
    ...liste(r.lettres).map(lettreDepuisCourrier),
    ...liste(r.annonces).map(lettreDepuisAnnonce),
    ...liste(r.defis).map(lettreDepuisDefi),
  ].filter((l): l is Lettre => l !== null)
  return trierLettres(lettres)
}

export function estExpiree(l: Lettre, maintenant: Date = new Date()): boolean {
  return l.expireLe !== null && Date.parse(l.expireLe) <= maintenant.getTime()
}

/** Un cadeau encore à récupérer (gains versables, pas expiré). */
export function estARecuperer(l: Lettre, maintenant: Date = new Date()): boolean {
  return l.gains !== null && !l.recuperee && !estExpiree(l, maintenant)
}

/** Un défi d'ami encore ouvert. */
export function estARelever(l: Lettre, maintenant: Date = new Date()): boolean {
  return l.source === 'defi' && !l.lue && !estExpiree(l, maintenant)
}

/**
 * Compte comme NON LUE : pas encore lue, ou un cadeau pas encore récupéré —
 * la règle de `courrier_non_lus` (602), recopiée pour que le badge du bouton
 * flottant et la boîte disent la même chose.
 */
export function estNonLue(l: Lettre, maintenant: Date = new Date()): boolean {
  if (estExpiree(l, maintenant)) return false
  return !l.lue || (l.gains !== null && !l.recuperee)
}

export function nonLus(lettres: readonly Lettre[], maintenant: Date = new Date()): number {
  return lettres.filter((l) => estNonLue(l, maintenant)).length
}

/** L'onglet d'une lettre : Marcel (et l'équipe), les amis, le coach. */
export function ongletDe(l: Lettre): Exclude<OngletCourrier, 'tout'> {
  if (l.type === 'ami') return 'amis'
  if (l.type === 'coach') return 'coach'
  return 'marcel'
}

export function parOnglet(lettres: readonly Lettre[], onglet: OngletCourrier): Lettre[] {
  return onglet === 'tout' ? [...lettres] : lettres.filter((l) => ongletDe(l) === onglet)
}

export function nonLusParOnglet(lettres: readonly Lettre[], maintenant: Date = new Date()): Record<OngletCourrier, number> {
  const comptes: Record<OngletCourrier, number> = { tout: 0, marcel: 0, amis: 0, coach: 0 }
  for (const l of lettres) {
    if (!estNonLue(l, maintenant)) continue
    comptes.tout += 1
    comptes[ongletDe(l)] += 1
  }
  return comptes
}

/** Le rang de tri : ce qui attend un geste d'abord, puis le non-lu, puis le reste. */
function rang(l: Lettre, maintenant: Date): number {
  if (estARecuperer(l, maintenant) || estARelever(l, maintenant)) return 0
  if (estNonLue(l, maintenant)) return 1
  return 2
}

/** Les cadeaux et défis en tête, puis les non-lues, puis les lues ; du plus récent au plus ancien dans chaque groupe. */
export function trierLettres(lettres: readonly Lettre[], maintenant: Date = new Date()): Lettre[] {
  return [...lettres].sort((a, b) => {
    const r = rang(a, maintenant) - rang(b, maintenant)
    if (r !== 0) return r
    return Date.parse(b.recueLe) - Date.parse(a.recueLe)
  })
}

/** Les cadeaux encore à récupérer. */
export function aRecuperer(lettres: readonly Lettre[], maintenant: Date = new Date()): Lettre[] {
  return lettres.filter((l) => estARecuperer(l, maintenant))
}

/** Ce que « Tout récupérer » rapporterait — annoncé, puis vérifié par le serveur. */
export function totalARecuperer(lettres: readonly Lettre[], maintenant: Date = new Date()): GainsLettre | null {
  const total = aRecuperer(lettres, maintenant).reduce(
    (acc, l) => ({ xp: acc.xp + (l.gains?.xp ?? 0), gemmes: acc.gemmes + (l.gains?.gemmes ?? 0) }),
    { xp: 0, gemmes: 0 },
  )
  return total.xp > 0 || total.gemmes > 0 ? total : null
}

/** Les diffusions encore jamais vues — « tout lire » doit les marquer une à une (`annonce_marquer`). */
export function annoncesNonVues(lettres: readonly Lettre[]): string[] {
  return lettres.filter((l) => l.source === 'annonce' && !l.lue).map((l) => l.id)
}

// ------------------------------------------------------------ l'état à l'écran

export function marquerLue(lettres: readonly Lettre[], id: string): Lettre[] {
  return lettres.map((l) => (l.id === id && !l.lue ? { ...l, lue: true } : l))
}

export function marquerRecuperee(lettres: readonly Lettre[], id: string): Lettre[] {
  return lettres.map((l) => (l.id === id ? { ...l, lue: true, recuperee: true } : l))
}

/** Tout lu — les défis restent « à relever » : on ne lit pas un défi, on le joue. */
export function toutMarquerLu(lettres: readonly Lettre[]): Lettre[] {
  return lettres.map((l) => (l.lue || l.source === 'defi' ? l : { ...l, lue: true }))
}

export function toutMarquerRecupere(lettres: readonly Lettre[], maintenant: Date = new Date()): Lettre[] {
  return lettres.map((l) => (estARecuperer(l, maintenant) ? { ...l, lue: true, recuperee: true } : l))
}

// --------------------------------------------------------------------- le temps

const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

/**
 * « à l’instant », « il y a 5 min », « il y a 2 h », « hier », « il y a 3 j »,
 * « il y a 2 sem. », puis la date (« 12 oct. », « 12 oct. 2025 » une autre
 * année). Une date illisible ou future : « à l’instant ».
 */
export function ilYA(iso: string, maintenant: Date = new Date()): string {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return 'à l’instant'
  const ecart = maintenant.getTime() - t
  if (ecart < 60_000) return 'à l’instant'
  const minutes = Math.floor(ecart / 60_000)
  if (minutes < 60) return `il y a ${minutes} min`
  const heures = Math.floor(minutes / 60)
  if (heures < 24) return `il y a ${heures} h`
  const jours = Math.floor(heures / 24)
  if (jours === 1) return 'hier'
  if (jours < 7) return `il y a ${jours} j`
  if (jours < 30) return `il y a ${Math.floor(jours / 7)} sem.`
  const d = new Date(t)
  const date = `${d.getDate()} ${MOIS_COURTS[d.getMonth()]}`
  return d.getFullYear() === maintenant.getFullYear() ? date : `${date} ${d.getFullYear()}`
}

/** « 2 non lues · 1 cadeau à récupérer », ou « Tout est lu ». */
export function sousTitreBoite(lettres: readonly Lettre[], maintenant: Date = new Date()): string {
  const n = nonLus(lettres, maintenant)
  if (n === 0) return lettres.length === 0 ? 'Rien pour l’instant' : 'Tout est lu'
  const cadeaux = aRecuperer(lettres, maintenant).length
  const parts = [`${n} non lue${n > 1 ? 's' : ''}`]
  if (cadeaux > 0) parts.push(`${cadeaux} cadeau${cadeaux > 1 ? 'x' : ''} à récupérer`)
  return parts.join(' · ')
}
