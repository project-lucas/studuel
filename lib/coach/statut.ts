// -----------------------------------------------------------------------------
// LE TABLEAU DU COACH — la logique pure (13/10/2026).
//
// Lucas : « je dois pouvoir gérer ou surveiller des centaines, donc il faut
// surtout mettre en avant ceux qui sont en retard ». Le tableau fonctionne PAR
// EXCEPTION : la base renvoie une ligne d'agrégats par élève (`coach_tableau`,
// migration 560), et c'est ici — testé, sans réseau — qu'on en tire un STATUT,
// ses raisons en français, les compteurs, l'ordre, les filtres et la recherche.
//
// Le statut est un jugement sur UNE semaine, comparée aux quatre d'avant ; il
// ne dit rien d'un élève arrivé depuis moins de sept jours (« nouveau »).
// -----------------------------------------------------------------------------

/** Une ligne de `coach_tableau` (migration 560), normalisée. */
export type LigneCoach = {
  eleveId: string
  prenom: string
  pseudo: string | null
  /** La classe (`grade_level`), null si non renseignée. */
  classe: string | null
  groupeId: string
  groupe: string
  categorie: string | null
  /** Date d'activation du rattachement, `YYYY-MM-DD`. */
  rattacheLe: string
  /** Dernier jour avec du temps, un quiz ou de l'XP, `YYYY-MM-DD` — null si jamais. */
  derniereActivite: string | null
  /** Temps des 7 derniers jours, en secondes. */
  secondes7: number
  /** Temps des 4 semaines PRÉCÉDENTES (j-34 → j-7), en secondes. */
  secondes4s: number
  joursActifs7: number
  sessions7: number
  matiereFaible: string | null
  /** Score moyen de la matière la plus faible, 0..1. */
  ratioFaible: number | null
  ratioGlobal: number | null
  quizTotal: number
}

export type Statut = 'rouge' | 'orange' | 'vert' | 'nouveau'

/** Les seuils par défaut (un réglage par coach viendra ensuite). */
export const SEUILS = {
  /** Rouge : aucune activité depuis autant de jours. */
  inactifApresJours: 7,
  /** Orange : moins de jours actifs que ça sur les 7 derniers. */
  joursActifsMinimum: 3,
  /** Orange : le temps de la semaine est tombé sous ce pourcentage de la moyenne des 4 semaines d'avant. */
  baissePct: 50,
  /** Nouveau : rattaché depuis moins de… jours — on ne juge pas une semaine incomplète. */
  nouveauJours: 7,
  /** « Nouveaux du mois » : rattachés depuis moins de… jours. */
  nouveauxDuMoisJours: 30,
} as const

const JOUR_MS = 86_400_000

/** Nombre de jours entiers entre deux `YYYY-MM-DD` (b − a). */
export function joursEntre(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / JOUR_MS)
}

/** « 1 h 05 », « 25 min », « — » (rien). */
export function formaterDuree(secondes: number): string {
  const minutes = Math.round(secondes / 60)
  if (minutes <= 0) return '—'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}

/** « aujourd'hui », « hier », « il y a 3 j », « jamais ». */
export function formaterDerniereActivite(date: string | null, aujourdhui: string): string {
  if (!date) return 'jamais'
  const j = joursEntre(date, aujourdhui)
  if (j <= 0) return 'aujourd’hui'
  if (j === 1) return 'hier'
  return `il y a ${j} j`
}

export type Verdict = {
  statut: Statut
  /** Les raisons, de la plus grave à la moins grave, en français (vides au vert). */
  raisons: string[]
}

/**
 * Le statut d'un élève, pour le jour `aujourdhui` (`YYYY-MM-DD`, UTC — le
 * même jour que la base).
 *
 *   nouveau — rattaché depuis moins de 7 jours ;
 *   rouge   — aucune activité depuis 7 jours (ou jamais), ou 0 jour actif sur 7 ;
 *   orange  — 1 ou 2 jours actifs sur 7, ou le temps de la semaine sous la
 *             moitié de sa moyenne des 4 semaines d'avant ;
 *   vert    — le reste.
 */
export function statutEleve(l: LigneCoach, aujourdhui: string): Verdict {
  const depuisArrivee = joursEntre(l.rattacheLe, aujourdhui)
  if (depuisArrivee < SEUILS.nouveauJours) {
    return {
      statut: 'nouveau',
      raisons: [depuisArrivee <= 0 ? 'Arrivé aujourd’hui' : `Arrivé il y a ${depuisArrivee} j`],
    }
  }

  const raisonsRouges: string[] = []
  const raisonsOranges: string[] = []

  if (!l.derniereActivite) {
    raisonsRouges.push('Jamais actif')
  } else {
    const inactif = joursEntre(l.derniereActivite, aujourdhui)
    if (inactif >= SEUILS.inactifApresJours) raisonsRouges.push(`Aucune activité depuis ${inactif} j`)
  }
  if (l.joursActifs7 === 0 && raisonsRouges.length === 0) {
    raisonsRouges.push('0 jour actif sur 7')
  }
  if (raisonsRouges.length > 0) return { statut: 'rouge', raisons: raisonsRouges }

  if (l.joursActifs7 < SEUILS.joursActifsMinimum) {
    raisonsOranges.push(`${l.joursActifs7} jour${l.joursActifs7 > 1 ? 's' : ''} actif${l.joursActifs7 > 1 ? 's' : ''} sur 7`)
  }
  const moyenne4s = l.secondes4s / 4
  if (moyenne4s >= 10 * 60 && l.secondes7 < (moyenne4s * SEUILS.baissePct) / 100) {
    const baisse = Math.round(100 - (l.secondes7 / moyenne4s) * 100)
    raisonsOranges.push(`Temps −${baisse} % vs ses 4 semaines`)
  }
  if (raisonsOranges.length > 0) return { statut: 'orange', raisons: raisonsOranges }

  return { statut: 'vert', raisons: [] }
}

export type LigneJugee = LigneCoach & Verdict

export function juger(lignes: readonly LigneCoach[], aujourdhui: string): LigneJugee[] {
  return lignes.map((l) => ({ ...l, ...statutEleve(l, aujourdhui) }))
}

/** La gravité : rouge avant orange avant nouveau avant vert. */
const GRAVITE: Record<Statut, number> = { rouge: 0, orange: 1, nouveau: 2, vert: 3 }

export type Compteurs = {
  total: number
  actifs: number
  enBaisse: number
  decroches: number
  nouveaux: number
}

/** Les compteurs du haut de l'écran. « Actifs » = au moins un jour actif sur 7. */
export function compteurs(lignes: readonly LigneJugee[]): Compteurs {
  return {
    total: lignes.length,
    actifs: lignes.filter((l) => l.joursActifs7 > 0).length,
    enBaisse: lignes.filter((l) => l.statut === 'orange').length,
    decroches: lignes.filter((l) => l.statut === 'rouge').length,
    nouveaux: lignes.filter((l) => l.statut === 'nouveau').length,
  }
}

/** Le bloc « À surveiller » : les rouges puis les oranges, les plus anciens d'abord. */
export function aSurveiller(lignes: readonly LigneJugee[], max = 12): LigneJugee[] {
  return trier(
    lignes.filter((l) => l.statut === 'rouge' || l.statut === 'orange'),
    'statut',
    'asc',
  ).slice(0, max)
}

export type CleDeTri =
  | 'statut'
  | 'prenom'
  | 'derniereActivite'
  | 'secondes7'
  | 'joursActifs7'
  | 'matiereFaible'
  | 'rattacheLe'

/**
 * Le tri. `statut` range par gravité puis par ancienneté d'inactivité (le plus
 * silencieux en tête) ; une colonne vide (jamais actif, pas de matière) va
 * toujours en fin de liste, quel que soit le sens.
 */
export function trier(
  lignes: readonly LigneJugee[],
  cle: CleDeTri,
  sens: 'asc' | 'desc',
): LigneJugee[] {
  const s = sens === 'asc' ? 1 : -1
  const parNom = (a: LigneJugee, b: LigneJugee) => a.prenom.localeCompare(b.prenom, 'fr')
  const vides = <T>(a: T | null, b: T | null) =>
    a === null && b === null ? 0 : a === null ? 1 : b === null ? -1 : null

  return [...lignes].sort((a, b) => {
    switch (cle) {
      case 'statut': {
        const g = GRAVITE[a.statut] - GRAVITE[b.statut]
        if (g !== 0) return g * s
        // À gravité égale, le plus SILENCIEUX d'abord : jamais actif avant
        // une dernière activité datée, puis la plus ancienne.
        const v = vides(a.derniereActivite, b.derniereActivite)
        if (v !== null) return -v * s
        return a.derniereActivite!.localeCompare(b.derniereActivite!) * s || parNom(a, b)
      }
      case 'prenom':
        return parNom(a, b) * s
      case 'derniereActivite': {
        const v = vides(a.derniereActivite, b.derniereActivite)
        if (v !== null) return v
        return a.derniereActivite!.localeCompare(b.derniereActivite!) * s || parNom(a, b)
      }
      case 'secondes7':
        return (a.secondes7 - b.secondes7) * s || parNom(a, b)
      case 'joursActifs7':
        return (a.joursActifs7 - b.joursActifs7) * s || parNom(a, b)
      case 'matiereFaible': {
        const v = vides(a.ratioFaible, b.ratioFaible)
        if (v !== null) return v
        return (a.ratioFaible! - b.ratioFaible!) * s || parNom(a, b)
      }
      case 'rattacheLe':
        return a.rattacheLe.localeCompare(b.rattacheLe) * s || parNom(a, b)
    }
  })
}

export type Filtres = {
  groupeId?: string | null
  classe?: string | null
  /** Rattachés depuis moins de 30 jours. */
  nouveauxDuMois?: boolean
  statut?: Statut | null
  recherche?: string
}

/** Sans accent ni majuscule, pour la recherche par prénom ou pseudo. */
export function normaliser(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function filtrer(
  lignes: readonly LigneJugee[],
  f: Filtres,
  aujourdhui: string,
): LigneJugee[] {
  const q = normaliser(f.recherche ?? '')
  return lignes.filter((l) => {
    if (f.groupeId && l.groupeId !== f.groupeId) return false
    if (f.classe && l.classe !== f.classe) return false
    if (f.statut && l.statut !== f.statut) return false
    if (f.nouveauxDuMois && joursEntre(l.rattacheLe, aujourdhui) >= SEUILS.nouveauxDuMoisJours) {
      return false
    }
    if (q) {
      const nom = normaliser(l.prenom)
      const pseudo = normaliser(l.pseudo ?? '')
      if (!nom.includes(q) && !pseudo.includes(q)) return false
    }
    return true
  })
}

/** Une page de la liste (50 par page) — 100 à 300 lignes n'ont pas besoin de plus. */
export const PAR_PAGE = 50

export function page<T>(lignes: readonly T[], numero: number, parPage = PAR_PAGE): T[] {
  const debut = Math.max(0, numero - 1) * parPage
  return lignes.slice(debut, debut + parPage)
}

/** Relit une ligne brute de la RPC (snake_case, nombres en texte) en `LigneCoach`. */
export function ligneDepuis(brut: Record<string, unknown>): LigneCoach {
  const texte = (v: unknown): string | null => (typeof v === 'string' && v.length > 0 ? v : null)
  const nombre = (v: unknown): number => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
    return Number.isFinite(n) ? n : 0
  }
  const ratio = (v: unknown): number | null => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
    return Number.isFinite(n) ? n : null
  }
  const jour = (v: unknown): string | null => {
    if (typeof v !== 'string' || v.length < 10) return null
    return v.slice(0, 10)
  }
  return {
    eleveId: String(brut.eleve_id ?? ''),
    prenom: texte(brut.prenom) ?? 'Sans nom',
    pseudo: texte(brut.pseudo),
    classe: texte(brut.classe),
    groupeId: String(brut.groupe_id ?? ''),
    groupe: texte(brut.groupe) ?? '',
    categorie: texte(brut.categorie),
    rattacheLe: jour(brut.rattache_le) ?? '1970-01-01',
    derniereActivite: jour(brut.derniere_activite),
    secondes7: nombre(brut.secondes_7),
    secondes4s: nombre(brut.secondes_4s),
    joursActifs7: nombre(brut.jours_actifs_7),
    sessions7: nombre(brut.sessions_7),
    matiereFaible: texte(brut.matiere_faible),
    ratioFaible: ratio(brut.ratio_faible),
    ratioGlobal: ratio(brut.ratio_global),
    quizTotal: nombre(brut.quiz_total),
  }
}
