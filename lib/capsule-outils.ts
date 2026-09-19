// -----------------------------------------------------------------------------
// LES OUTILS DES CAPSULES — la logique pure des calculateurs et des listes.
// Les composants (components/capsules/outils/*) ne font que la dessiner.
// -----------------------------------------------------------------------------

// ------------------------------------------------------------------ sommeil

/** Un cycle de sommeil dure environ 90 minutes. */
export const MINUTES_PAR_CYCLE = 90

/** Le temps moyen pour s'endormir, compté avant le premier cycle. */
export const MINUTES_ENDORMISSEMENT = 15

/** Les nuits proposées, de la plus conseillée à un ado à la plus courte. */
export const CYCLES_PROPOSES = [6, 5] as const

export type Coucher = {
  cycles: number
  /** L'heure où se mettre au lit, « 22:15 ». */
  heure: string
  /** Le sommeil obtenu, « 9 h », « 7 h 30 ». */
  sommeil: string
  /** 6 cycles et plus : la nuit qu'il faut à un ado. */
  conseille: boolean
}

/** « 07:05 » → 425 minutes. `null` si l'heure est invalide. */
export function minutesDepuisMinuit(heure: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(heure.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

/** 1350 → « 22:30 » (modulo 24 h, les heures négatives repartent de minuit). */
export function heureDepuisMinutes(minutes: number): string {
  const jour = 24 * 60
  const m = ((Math.round(minutes) % jour) + jour) % jour
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/** 450 → « 7 h 30 », 540 → « 9 h ». */
export function libelleDuree(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}

/**
 * Les heures de coucher pour se réveiller en fin de cycle : on part de l'heure
 * du réveil, on retire des cycles entiers, puis le temps de s'endormir.
 */
export function heuresDeCoucher(reveil: string): Coucher[] {
  const r = minutesDepuisMinuit(reveil)
  if (r === null) return []
  return CYCLES_PROPOSES.map((cycles) => {
    const sommeil = cycles * MINUTES_PAR_CYCLE
    return {
      cycles,
      heure: heureDepuisMinutes(r - sommeil - MINUTES_ENDORMISSEMENT),
      sommeil: libelleDuree(sommeil),
      conseille: cycles >= 6,
    }
  })
}

// ------------------------------------------------------------------- budget

export type EntreeBudget = {
  /** Argent de poche reçu chaque mois, en euros. */
  argentMensuel: number
  /** Ce qui part chaque mois, en euros. */
  depensesMensuelles: number
  /** Le prix de l'objectif, en euros. */
  objectif: number
  /** Ce qui est déjà de côté, en euros. */
  dejaEconomise: number
}

export type PlanEpargne =
  /** Objectif déjà atteint avec ce qui est de côté. */
  | { kind: 'atteint' }
  /** Il faut `mois` mois en mettant `epargneMensuelle` € de côté. */
  | { kind: 'possible'; epargneMensuelle: number; mois: number; reste: number }
  /** Rien ne reste chaque mois : l'objectif ne se rapproche pas. */
  | { kind: 'impossible'; deficit: number }
  /** Des montants manquants ou négatifs. */
  | { kind: 'incomplet' }

const montant = (n: number): number | null =>
  Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null

export function planEpargne(entree: EntreeBudget): PlanEpargne {
  const argent = montant(entree.argentMensuel)
  const depenses = montant(entree.depensesMensuelles)
  const objectif = montant(entree.objectif)
  const deja = montant(entree.dejaEconomise) ?? 0
  if (argent === null || depenses === null || objectif === null || objectif === 0) {
    return { kind: 'incomplet' }
  }
  const reste = Math.max(0, Math.round((objectif - deja) * 100) / 100)
  if (reste === 0) return { kind: 'atteint' }
  const epargne = Math.round((argent - depenses) * 100) / 100
  if (epargne <= 0) return { kind: 'impossible', deficit: Math.abs(epargne) }
  return { kind: 'possible', epargneMensuelle: epargne, mois: Math.ceil(reste / epargne), reste }
}

/** « 12,50 € ». */
export function euros(n: number): string {
  return `${n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} €`
}

/** « 1 mois », « 7 mois », « 1 an et 2 mois ». */
export function libelleMois(mois: number): string {
  if (mois < 12) return `${mois} mois`
  const ans = Math.floor(mois / 12)
  const reste = mois % 12
  const a = ans === 1 ? '1 an' : `${ans} ans`
  return reste === 0 ? a : `${a} et ${reste} mois`
}

// --------------------------------------------------------- listes et grilles

/** La part cochée d'une liste, 0..1, et le mot qui l'accompagne. */
export function progressionListe(
  coches: readonly boolean[],
): { faits: number; total: number; ratio: number; message: string } {
  const total = coches.length
  const faits = coches.filter(Boolean).length
  const ratio = total === 0 ? 0 : faits / total
  const message =
    faits === 0
      ? 'Coche ce que tu fais déjà.'
      : faits === total
        ? 'Tout est coché : bravo !'
        : ratio >= 0.5
          ? 'Plus de la moitié, continue.'
          : 'Bon début.'
  return { faits, total, ratio, message }
}

/**
 * Relit l'état enregistré d'une liste (localStorage) : un tableau de booléens
 * de la bonne longueur, quoi qu'on ait trouvé.
 */
export function lireCoches(raw: unknown, total: number): boolean[] {
  const base = Array.from({ length: Math.max(0, total) }, () => false)
  if (!Array.isArray(raw)) return base
  return base.map((_, i) => raw[i] === true)
}

/** La grille d'un planning : `grille[jour][moment]` = une activité ou ''. */
export type GrillePlanning = string[][]

export function lireGrille(
  raw: unknown,
  jours: number,
  moments: number,
  activites: readonly string[],
): GrillePlanning {
  const permises = new Set(activites)
  return Array.from({ length: jours }, (_, j) =>
    Array.from({ length: moments }, (_, m) => {
      const v = Array.isArray(raw) && Array.isArray(raw[j]) ? raw[j][m] : ''
      return typeof v === 'string' && permises.has(v) ? v : ''
    }),
  )
}

/** Combien de créneaux sont remplis, sur combien. */
export function remplissageGrille(grille: GrillePlanning): { remplis: number; total: number } {
  const cases = grille.flat()
  return { remplis: cases.filter((c) => c !== '').length, total: cases.length }
}
