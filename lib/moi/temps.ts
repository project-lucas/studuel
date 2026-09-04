// -----------------------------------------------------------------------------
// LE TEMPS DE TRAVAIL — le chiffre qui ne redescend jamais.
//
// L'onglet Moi montrait une « capacité » sur 100 calculée à partir de cases
// d'habitudes cochées : un élève qui avait travaillé trois heures dans la
// semaine sans rien cocher y lisait 8. Le seul écran qui parle de lui ne parlait
// pas de son travail.
//
// Deux mesures vivent ici, et une seule requête les nourrit toutes les deux :
//   · le CUMUL (profiles.work_seconds, migration 014) — il ne peut que monter,
//     c'est lui qui rend fier ;
//   · le RYTHME (work_daily, migration 084) — le journal par jour, agrégé en
//     semaines, qui répond à la seule question qui compte : est-ce que je tiens ?
//
// Conventions du projet : clés de jour UTC 'YYYY-MM-DD', semaine du LUNDI.
// Logique pure, aucun accès base.
// -----------------------------------------------------------------------------

/** Une ligne de `work_daily` : un jour, des secondes. */
export type JourTravail = {
  day: string
  seconds: number
}

/** Une semaine du rythme, identifiée par son lundi. */
export type SemaineTravail = {
  /** Clé de jour du lundi de cette semaine. */
  lundi: string
  secondes: number
}

/** Profondeur du graphique de rythme, en semaines (aujourd'hui compris). */
export const SEMAINES_RYTHME = 8

/** Le lundi de la semaine d'un jour donné. Renvoie l'entrée telle quelle si
 *  elle n'est pas une date lisible — on ne fabrique pas de faux bucket. */
export function lundiDe(jour: string): string {
  const d = new Date(`${jour}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return jour
  // getUTCDay() : 0 = dimanche → on ramène lundi à 0 (convention du projet).
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

/**
 * Les `nb` dernières semaines, de la plus ancienne à la semaine EN COURS.
 *
 * Les semaines vides sont produites quand même, à zéro : un trou dans le
 * graphique est une information (« j'ai décroché deux semaines »), une barre
 * absente n'est qu'un décalage qui ment sur les dates.
 */
export function rythmeHebdo(
  jours: readonly JourTravail[],
  today: string,
  nb: number = SEMAINES_RYTHME,
): SemaineTravail[] {
  const base = new Date(`${lundiDe(today)}T00:00:00.000Z`)
  if (Number.isNaN(base.getTime()) || nb <= 0) return []

  const semaines: SemaineTravail[] = []
  for (let i = nb - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() - i * 7)
    semaines.push({ lundi: d.toISOString().slice(0, 10), secondes: 0 })
  }

  const index = new Map(semaines.map((s, i) => [s.lundi, i]))
  for (const jour of jours) {
    const i = index.get(lundiDe(String(jour?.day ?? '')))
    if (i === undefined) continue
    const s = Number(jour.seconds)
    if (!Number.isFinite(s) || s <= 0) continue
    semaines[i].secondes += Math.round(s)
  }
  return semaines
}

/**
 * Durée en français, lisible d'un coup d'œil : « 45 min », « 3 h 20 », « 27 h ».
 *
 * Au-delà de 10 heures on laisse tomber les minutes : sur un cumul de plusieurs
 * mois, « 127 h 04 » donne une fausse précision et coûte deux caractères de
 * large sur un écran de téléphone.
 */
export function formatDuree(secondes: number): string {
  const s = Math.max(0, Math.round(Number(secondes) || 0))
  if (s < 60) return '0 min'
  const minutes = Math.floor(s / 60)
  if (minutes < 60) return `${minutes} min`
  const heures = Math.floor(minutes / 60)
  const reste = minutes % 60
  if (heures >= 10 || reste === 0) return `${heures} h`
  return `${heures} h ${String(reste).padStart(2, '0')}`
}

/**
 * Semaines actives consécutives, en remontant depuis la semaine en cours.
 *
 * Même clémence que la série quotidienne (lib/streak) : si la semaine en cours
 * est encore vide, on compte à partir de la précédente. Sans ça, tout élève
 * verrait sa constance retomber à zéro chaque lundi matin — exactement l'inverse
 * de l'effet recherché.
 */
export function semainesTenues(semaines: readonly SemaineTravail[]): number {
  if (semaines.length === 0) return 0
  let i = semaines.length - 1
  if (semaines[i].secondes <= 0) {
    i -= 1
    if (i < 0 || semaines[i].secondes <= 0) return 0
  }
  let n = 0
  while (i >= 0 && semaines[i].secondes > 0) {
    n += 1
    i -= 1
  }
  return n
}

/**
 * La phrase qui lit le graphique à voix haute.
 *
 * Le graphique seul demande à l'élève de comparer huit barres de tête ; la
 * phrase fait ce travail pour lui, et elle ne dit QUE des choses vraies (aucune
 * projection, aucun encouragement fabriqué).
 */
export function phraseRythme(semaines: readonly SemaineTravail[]): string {
  if (semaines.length === 0) return 'Ton rythme apparaîtra ici.'

  const courante = semaines[semaines.length - 1].secondes
  const precedentes = semaines.slice(0, -1)
  const total = semaines.reduce((s, w) => s + w.secondes, 0)
  if (total <= 0) {
    return 'Dès que tu travailles, ton rythme se dessine ici.'
  }

  const record = precedentes.reduce((max, w) => Math.max(max, w.secondes), 0)
  if (courante > 0 && courante > record) {
    return record > 0
      ? `Ta meilleure semaine depuis ${semaines.length} semaines.`
      : 'Ta première semaine de travail est lancée.'
  }

  const tenues = semainesTenues(semaines)
  if (tenues >= 2) return `Tu tiens depuis ${tenues} semaines d’affilée.`

  if (courante <= 0) {
    const derniere = precedentes[precedentes.length - 1]?.secondes ?? 0
    return derniere > 0
      ? `Ta semaine démarre. La précédente : ${formatDuree(derniere)}.`
      : 'Tu as fait une pause. Une session suffit pour repartir.'
  }

  return `${formatDuree(courante)} cette semaine.`
}

/** « +3 h cette semaine » — la micro-tendance sous le cumul, ou null si rien. */
export function libelleCetteSemaine(
  semaines: readonly SemaineTravail[],
): string | null {
  const courante = semaines[semaines.length - 1]?.secondes ?? 0
  if (courante <= 0) return null
  return `+${formatDuree(courante)} cette semaine`
}

// -----------------------------------------------------------------------------
// L'HISTORIQUE — la même donnée, à quatre profondeurs.
//
// Un seul graphique de 8 semaines répond à « est-ce que je tiens en ce moment ».
// Il ne répond ni à « qu'est-ce que j'ai fait cette semaine » (trop grossier :
// une barre pour sept jours) ni à « où j'en suis depuis la rentrée » (trop
// court). Le sélecteur de période règle la lunette sans changer de source :
// `work_daily` est lu UNE fois, sur un an, et regroupé ici.
//
// La granularité suit la portée — sinon l'année afficherait 365 points sur
// 320 pixels, soit un pâté :
//   semaine    → 7 jours
//   mois       → 30 jours
//   trimestre  → 13 semaines
//   année      → 12 mois
// -----------------------------------------------------------------------------

export type Portee = 'semaine' | 'mois' | 'trimestre' | 'annee'

export type PorteeDef = {
  cle: Portee
  /** Ce qui s'affiche dans le sélecteur. */
  label: string
  /** Jours d'historique nécessaires — la lecture de `work_daily` prend le max. */
  jours: number
}

export const PORTEES: readonly PorteeDef[] = [
  { cle: 'semaine', label: 'Semaine', jours: 7 },
  { cle: 'mois', label: 'Mois', jours: 30 },
  { cle: 'trimestre', label: '3 mois', jours: 91 },
  { cle: 'annee', label: 'Année', jours: 365 },
]

/** Profondeur de lecture de `work_daily` : la plus large des portées. */
export const JOURS_HISTORIQUE = PORTEES.reduce((m, p) => Math.max(m, p.jours), 0)

export type PointTemps = {
  /** Clé du regroupement (jour, lundi de semaine, ou mois 'YYYY-MM'). */
  cle: string
  /** Repère lisible sous le graphique. */
  label: string
  secondes: number
}

const LETTRES_JOUR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const
const MOIS_COURTS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
] as const

function moisDe(jour: string): string {
  return jour.slice(0, 7)
}

/** Le regroupement auquel un jour appartient, pour une portée donnée. */
export function cleDeRegroupement(jour: string, portee: Portee): string {
  if (portee === 'annee') return moisDe(jour)
  if (portee === 'trimestre') return lundiDe(jour)
  return jour
}

function labelDe(cle: string, portee: Portee): string {
  if (portee === 'annee') {
    const mois = Number(cle.slice(5, 7))
    return MOIS_COURTS[mois - 1] ?? cle
  }
  const d = new Date(`${cle}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return cle
  if (portee === 'semaine') return LETTRES_JOUR[(d.getUTCDay() + 6) % 7]
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Les clés de regroupement de la portée, de la plus ancienne à aujourd'hui. */
function clesDeLaPortee(today: string, portee: Portee): string[] {
  const base = new Date(`${today}T00:00:00.000Z`)
  if (Number.isNaN(base.getTime())) return []

  if (portee === 'annee') {
    const cles: string[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(base)
      d.setUTCDate(1)
      d.setUTCMonth(d.getUTCMonth() - i)
      cles.push(d.toISOString().slice(0, 7))
    }
    return cles
  }

  if (portee === 'trimestre') {
    const lundi = new Date(`${lundiDe(today)}T00:00:00.000Z`)
    const cles: string[] = []
    for (let i = 12; i >= 0; i--) {
      const d = new Date(lundi)
      d.setUTCDate(d.getUTCDate() - i * 7)
      cles.push(d.toISOString().slice(0, 10))
    }
    return cles
  }

  const n = portee === 'semaine' ? 7 : 30
  const cles: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() - i)
    cles.push(d.toISOString().slice(0, 10))
  }
  return cles
}

/**
 * Le temps de travail d'une portée, regroupé et prêt à tracer.
 *
 * Les périodes vides sortent à zéro plutôt que d'être omises : un trou est une
 * information (« j'ai décroché deux semaines »), une absence de point n'est
 * qu'un décalage qui ment sur les dates.
 */
export function serieTravail(
  jours: readonly JourTravail[],
  today: string,
  portee: Portee,
): PointTemps[] {
  const cles = clesDeLaPortee(today, portee)
  if (cles.length === 0) return []

  const index = new Map(cles.map((cle, i) => [cle, i]))
  const points: PointTemps[] = cles.map((cle) => ({
    cle,
    label: labelDe(cle, portee),
    secondes: 0,
  }))

  for (const jour of jours) {
    const brut = String(jour?.day ?? '')
    const i = index.get(cleDeRegroupement(brut, portee))
    if (i === undefined) continue
    const s = Number(jour.seconds)
    if (!Number.isFinite(s) || s <= 0) continue
    points[i].secondes += Math.round(s)
  }
  return points
}

/** Le total d'une série — ce qu'annonce l'en-tête du graphique. */
export function totalSerie(points: readonly PointTemps[]): number {
  return points.reduce((s, p) => s + p.secondes, 0)
}

// ------------------------------------------------------------ les barres du rythme

/**
 * L'objectif hebdomadaire dessiné en pointillé sur le graphique : une heure.
 * Un repère, pas une consigne — il n'est écrit nulle part que l'élève doit
 * l'atteindre, il est là pour qu'une semaine pleine se voie.
 */
export const OBJECTIF_HEBDO_SECONDES = 3600

/**
 * Les hauteurs des barres (0..100) et celle de la ligne d'objectif, sur UNE
 * même échelle : le maximum entre la meilleure semaine et l'objectif majoré
 * d'un quart, pour que ni l'un ni l'autre ne touche le plafond. Une semaine
 * vide fait 0 ; le composant lui laisse un liseré minimal.
 */
export function hauteursBarres(
  semaines: readonly SemaineTravail[],
  objectifSecondes: number,
): { hauteurs: number[]; objectifPct: number } {
  const meilleure = Math.max(0, ...semaines.map((s) => s.secondes))
  const plafond = Math.max(meilleure, objectifSecondes * 1.25, 1)
  return {
    hauteurs: semaines.map((s) => Math.round((Math.max(0, s.secondes) / plafond) * 100)),
    objectifPct: Math.round((objectifSecondes / plafond) * 100),
  }
}
