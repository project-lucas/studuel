// Série (streak) et anneau hebdomadaire — logique pure, testable.
// Les jours sont identifiés par leur clé UTC 'YYYY-MM-DD'.

export const toDayKey = (d: Date) => d.toISOString().slice(0, 10)

function shiftDays(d: Date, days: number): Date {
  const copy = new Date(d)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

// Fenêtre glissante des requêtes d'« activité » (série + semaine) : borne les
// selects sur les tables d'événements qui grossissent sans fin. 400 jours
// couvrent toute série affichable — au-delà, l'historique n'apporte rien à
// computeStreak/weekProgress.
export const ACTIVITY_WINDOW_DAYS = 400

export function activityCutoff(now: Date = new Date()): string {
  return new Date(
    now.getTime() - ACTIVITY_WINDOW_DAYS * 86_400_000,
  ).toISOString()
}

// -----------------------------------------------------------------------------
// LES GELS DE SÉRIE (boutique, migration 368).
//
// Un gel s'achète en gemmes et se garde en réserve (`user_wallet.gels_serie`,
// deux au plus). Il est CONSOMMÉ par `wallet_touch` le jour où l'élève revient
// après un trou que sa réserve peut couvrir : les jours manqués sont alors
// inscrits dans `user_wallet.jours_geles`, et la série stockée continue.
//
// Un jour gelé PONTE la série sans la faire monter — c'est la règle de
// Duolingo : le gel protège la série, il ne travaille pas à la place de
// l'élève. La série affichée ne compte donc que les jours réellement actifs.
//
// Les gels EN RÉSERVE comptent aussi, mais seulement pour le trou qui court
// encore (rien aujourd'hui, rien hier…) : sans eux, un élève qui a payé son
// gel verrait sa flamme à zéro le matin du lendemain d'un jour manqué, puis
// ressusciter dès sa première partie. La base (`current_streak`, 368) applique
// exactement la même règle — c'est elle qui nourrit le bandeau du haut.
// -----------------------------------------------------------------------------

/** Taille de la réserve de gels (miroir du CHECK `user_wallet.gels_serie`). */
export const MAX_GELS_SERIE = 2

export type GelsSerie = {
  /** Jours déjà gelés (clés UTC 'YYYY-MM-DD'), `user_wallet.jours_geles`. */
  joursGeles: ReadonlySet<string>
  /** Gels encore en réserve, `user_wallet.gels_serie`. */
  gelsDisponibles: number
}

export const AUCUN_GEL: GelsSerie = { joursGeles: new Set(), gelsDisponibles: 0 }

/** Ligne `user_wallet` (colonnes 368) → gels sûrs. Tolère tout : ligne absente,
 *  colonne nulle, date illisible (ignorée, jamais inventée). */
export function parseGelsSerie(row: unknown): GelsSerie {
  if (!row || typeof row !== 'object') return AUCUN_GEL
  const r = row as { jours_geles?: unknown; gels_serie?: unknown }
  const joursGeles = new Set<string>()
  if (Array.isArray(r.jours_geles)) {
    for (const d of r.jours_geles) {
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) joursGeles.add(d)
    }
  }
  const n = Number(r.gels_serie)
  return {
    joursGeles,
    gelsDisponibles: Number.isFinite(n)
      ? Math.min(MAX_GELS_SERIE, Math.max(0, Math.floor(n)))
      : 0,
  }
}

// Série de jours consécutifs avec activité, en remontant depuis aujourd'hui.
// Clémence façon Duolingo : si rien aujourd'hui mais activité hier,
// la série d'hier est toujours vivante. Les gels (ci-dessus) pontent les trous
// sans compter : voir l'en-tête. Sans `gels`, le calcul est celui d'avant.
export function computeStreak(
  activeDays: ReadonlySet<string>,
  now = new Date(),
  gels: GelsSerie = AUCUN_GEL,
): number {
  const actif = (d: Date) => activeDays.has(toDayKey(d))
  const gele = (d: Date) => gels.joursGeles.has(toDayKey(d))

  let cursor = new Date(now)
  if (!actif(cursor)) {
    // Aujourd'hui n'est pas encore perdu (clémence). On remonte le trou qui
    // court : chaque jour sans activité doit être déjà gelé ou couvert par un
    // gel en réserve, sinon la série est éteinte.
    cursor = shiftDays(cursor, -1)
    let reserve = Number.isFinite(gels.gelsDisponibles)
      ? Math.min(MAX_GELS_SERIE, Math.max(0, Math.floor(gels.gelsDisponibles)))
      : 0
    while (!actif(cursor)) {
      if (gele(cursor)) {
        cursor = shiftDays(cursor, -1)
      } else if (reserve > 0) {
        reserve -= 1
        cursor = shiftDays(cursor, -1)
      } else {
        return 0
      }
    }
  }

  let streak = 0
  while (actif(cursor) || gele(cursor)) {
    if (actif(cursor)) streak += 1
    cursor = shiftDays(cursor, -1)
  }
  return streak
}

// Semaine courante (lundi → dimanche) : [fait ?, est aujourd'hui ?] par jour.
export function weekProgress(
  activeDays: Set<string>,
  now = new Date(),
): { done: boolean; isToday: boolean; isFuture: boolean }[] {
  const todayKey = toDayKey(now)
  // getUTCDay() : 0 = dimanche → on ramène lundi = 0.
  const mondayOffset = (now.getUTCDay() + 6) % 7
  const monday = shiftDays(now, -mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const day = shiftDays(monday, i)
    const key = toDayKey(day)
    return {
      done: activeDays.has(key),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    }
  })
}
