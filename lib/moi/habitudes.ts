// -----------------------------------------------------------------------------
// « Mes habitudes » — le bilan de l'onglet Moi. Logique pure, testée.
//
// LE CONSTAT : la moitié de l'onglet Moi était un panneau « Bientôt ici ». Or
// les données existaient déjà, toutes, et la page les chargeait déjà : les
// habitudes suivies (`habits`), leur catalogue (`habit_catalog`) et le journal
// quotidien (`habit_logs`, complété par les validations automatiques). Il ne
// manquait que de les regarder.
//
// CE QU'ON MONTRE, ET DANS CET ORDRE :
//   1. la SÉRIE en cours de chaque habitude — c'est ce qui donne envie de ne
//      pas casser la chaîne ;
//   2. la RÉGULARITÉ sur 28 jours, en pourcentage de jours tenus ;
//   3. le RYTHME de la semaine, jour par jour.
//
// CE QU'ON NE MONTRE PAS : une note globale d'habitudes. Un chiffre unique
// écrase la seule information utile — QUELLE habitude tient et laquelle lâche.
// -----------------------------------------------------------------------------

export type HabitudeLog = {
  habit_id: string
  date: string // clé de jour UTC 'YYYY-MM-DD'
  completed: boolean
  auto_validated: boolean
}

export type HabitudeSuivie = {
  id: string
  titre: string
  icone: string
  /** Pourquoi cette habitude existe (texte du catalogue). */
  raison: string
}

export type BilanHabitude = HabitudeSuivie & {
  /** Jours consécutifs tenus, en comptant à rebours depuis aujourd'hui. */
  serie: number
  /** La plus longue série jamais tenue. */
  meilleureSerie: number
  /** Jours tenus sur la fenêtre, en pourcentage entier. */
  regularite: number
  /** Tenu aujourd'hui ? */
  aujourdhui: boolean
  /** Les 7 derniers jours, du plus ancien au plus récent. */
  semaine: boolean[]
  /** Part des validations obtenues automatiquement (révision, trajet). */
  autoPart: number
}

export const FENETRE_JOURS = 28

// --- Dates : mêmes conventions que lib/streak (clés UTC 'YYYY-MM-DD') --------
function cleDe(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Les `n` derniers jours, du plus ANCIEN au plus récent, `today` inclus. */
export function derniersJours(today: string, n: number): string[] {
  const base = new Date(`${today}T00:00:00.000Z`)
  if (Number.isNaN(base.getTime())) return []
  const jours: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() - i)
    jours.push(cleDe(d))
  }
  return jours
}

/**
 * Série en cours. Elle démarre à AUJOURD'HUI s'il est tenu, sinon à HIER —
 * sinon une habitude tenue tous les jours passerait à zéro chaque matin au
 * réveil, ce qui est exactement l'inverse de l'effet recherché.
 */
export function serieEnCours(jours: ReadonlySet<string>, today: string): number {
  const base = new Date(`${today}T00:00:00.000Z`)
  if (Number.isNaN(base.getTime())) return 0

  let curseur = new Date(base)
  if (!jours.has(cleDe(curseur))) {
    curseur.setUTCDate(curseur.getUTCDate() - 1)
    if (!jours.has(cleDe(curseur))) return 0
  }

  let n = 0
  while (jours.has(cleDe(curseur))) {
    n++
    curseur = new Date(curseur)
    curseur.setUTCDate(curseur.getUTCDate() - 1)
  }
  return n
}

/** La plus longue suite de jours consécutifs, toutes périodes confondues. */
export function meilleureSerie(jours: ReadonlySet<string>): number {
  let record = 0
  for (const jour of jours) {
    // On ne compte une suite qu'à partir de son PREMIER jour : sans ce test,
    // une série de 10 jours serait parcourue 10 fois (quadratique pour rien).
    const veille = new Date(`${jour}T00:00:00.000Z`)
    if (Number.isNaN(veille.getTime())) continue
    veille.setUTCDate(veille.getUTCDate() - 1)
    if (jours.has(cleDe(veille))) continue

    let n = 0
    let curseur = new Date(`${jour}T00:00:00.000Z`)
    while (jours.has(cleDe(curseur))) {
      n++
      curseur = new Date(curseur)
      curseur.setUTCDate(curseur.getUTCDate() + 1)
    }
    record = Math.max(record, n)
  }
  return record
}

export function bilanHabitudes(
  habitudes: readonly HabitudeSuivie[],
  logs: readonly HabitudeLog[],
  today: string,
): BilanHabitude[] {
  const fenetre = new Set(derniersJours(today, FENETRE_JOURS))
  const semaineJours = derniersJours(today, 7)

  return habitudes.map((h) => {
    const siens = logs.filter((l) => l.habit_id === h.id && l.completed)
    const jours = new Set(siens.map((l) => l.date))
    const dansFenetre = siens.filter((l) => fenetre.has(l.date))
    const auto = dansFenetre.filter((l) => l.auto_validated).length

    return {
      ...h,
      serie: serieEnCours(jours, today),
      meilleureSerie: meilleureSerie(jours),
      regularite:
        fenetre.size === 0
          ? 0
          : Math.round((new Set(dansFenetre.map((l) => l.date)).size / fenetre.size) * 100),
      aujourdhui: jours.has(today),
      semaine: semaineJours.map((j) => jours.has(j)),
      autoPart:
        dansFenetre.length === 0 ? 0 : Math.round((auto / dansFenetre.length) * 100),
    }
  })
}

// --- Ce que Marcel-esque dirait du lot --------------------------------------

export type VerdictHabitudes = {
  /** Habitudes tenues aujourd'hui / total. */
  tenuesAujourdhui: number
  total: number
  /** La plus solide, s'il y en a une. */
  solide: BilanHabitude | null
  /** Celle qui lâche — la plus utile à nommer. */
  fragile: BilanHabitude | null
  phrase: string
}

const SEUIL_SOLIDE = 70
const SEUIL_FRAGILE = 40

export function verdictHabitudes(bilans: readonly BilanHabitude[]): VerdictHabitudes {
  const total = bilans.length
  const tenuesAujourdhui = bilans.filter((b) => b.aujourdhui).length

  if (total === 0) {
    return {
      tenuesAujourdhui: 0,
      total: 0,
      solide: null,
      fragile: null,
      phrase:
        'Tu ne suis encore aucune habitude. Une seule suffit pour commencer — la régularité fait le reste.',
    }
  }

  const triees = [...bilans].sort((a, b) => b.regularite - a.regularite)
  const solide = triees[0].regularite >= SEUIL_SOLIDE ? triees[0] : null
  const dernier = triees[triees.length - 1]
  const fragile =
    dernier.regularite < SEUIL_FRAGILE && dernier !== solide ? dernier : null

  let phrase: string
  if (solide && fragile) {
    phrase = `${solide.titre} tient. C’est ${fragile.titre.toLowerCase()} qui lâche — reprends celle-là en premier.`
  } else if (solide) {
    phrase = `${solide.titre} est ancrée. Tu peux en ajouter une autre sans risque.`
  } else if (fragile) {
    phrase = `Rien n’est encore ancré. Vise ${fragile.titre.toLowerCase()} trois jours de suite, pas sept.`
  } else {
    phrase = 'Tes habitudes s’installent. Continue : c’est la répétition qui compte, pas l’intensité.'
  }

  return { tenuesAujourdhui, total, solide, fragile, phrase }
}

/** Libellé court d'une série, pour la pastille. */
export function libelleSerie(serie: number): string {
  if (serie === 0) return 'à relancer'
  if (serie === 1) return '1 jour'
  return `${serie} jours`
}
