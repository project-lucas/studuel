// -----------------------------------------------------------------------------
// LE PLANIFICATEUR DU CARNET (v2) — quand une carte revient, et pourquoi.
//
// Remplace la règle de `lib/carnet-revoir` : des paliers fixes 1/3/7/14/35 jours
// indexés sur le nombre de bonnes réponses d'affilée, à partir d'un verdict
// binaire juste/faux. Cette règle avait quatre défauts, tous corrigés ici.
//
//   1. TOUTES LES CARTES VIEILLISSAIENT PAREIL. Une carte évidente et une carte
//      qui résiste suivaient la même échelle. Chaque carte a maintenant son
//      AISANCE (`ease`), qui monte quand elle est facile et descend quand elle
//      coince : c'est elle qui multiplie l'intervalle.
//
//   2. RIEN NE POUVAIT REVENIR LE JOUR MÊME. Le premier palier était à J+1, or
//      c'est dans l'heure qui suit la découverte que la mémorisation se joue.
//      Une carte neuve passe d'abord par des ÉTAPES D'APPRENTISSAGE en minutes
//      (phase « apprentissage ») avant d'être diplômée en jours.
//
//   3. UNE ERREUR REMETTAIT TOUT À ZÉRO. Une carte sue depuis trois semaines,
//      ratée une fois, repartait de J+1 comme au premier jour. Elle RECHUTE
//      désormais : elle repasse par l'apprentissage, mais ressort à la moitié
//      de son ancien intervalle, pas au début.
//
//   4. LA CARTE IMPOSSIBLE TOURNAIT EN BOUCLE. Au-delà de `SEUIL_SANGSUE`
//      rechutes, la carte est marquée SANGSUE : le problème n'est pas l'élève,
//      c'est la carte, et l'app doit proposer de la reformuler plutôt que de la
//      resservir indéfiniment.
//
// Tout est pur : `planifier` prend un état + un verdict + l'instant, et rend un
// nouvel état. Aucune horloge lue ici, aucun aléa tiré ici (le grain de
// dispersion est passé en paramètre) — c'est ce qui rend le moteur testable au
// cas près.
// -----------------------------------------------------------------------------

/** Ce que l'élève (ou la correction) dit de son passage sur la carte. */
export type Verdict = 'encore' | 'difficile' | 'bien' | 'facile'

export const VERDICTS: readonly Verdict[] = [
  'encore',
  'difficile',
  'bien',
  'facile',
]

export function isVerdict(v: unknown): v is Verdict {
  return (VERDICTS as readonly unknown[]).includes(v)
}

/** Libellés montrés sur les quatre boutons de la session. */
export const VERDICT_LABEL: Record<Verdict, string> = {
  encore: 'Encore',
  difficile: 'Difficile',
  bien: 'Bien',
  facile: 'Facile',
}

export type Phase = 'apprentissage' | 'revision'

/** L'état d'une carte pour un élève (miroir de `carnet_question_states`). */
export type CardState = {
  phase: Phase
  /** Index de l'étape d'apprentissage en cours (ignoré en révision). */
  step: number
  /** Intervalle courant en jours (0 tant que la carte n'est pas diplômée). */
  intervalDays: number
  ease: number
  /** Bonnes réponses d'affilée. */
  streak: number
  /** Nombre total de passages. */
  reps: number
  /** Rechutes d'une carte déjà diplômée. */
  lapses: number
  isLeech: boolean
  /** Instant ISO où la carte redevient due. */
  dueAt: string
  /** Instant ISO du dernier passage (null si jamais vue). */
  lastSeenAt: string | null
}

// --- Réglages du moteur -------------------------------------------------------

/**
 * Les étapes d'apprentissage, en MINUTES. Une carte neuve les gravit avant
 * d'entrer dans le cycle en jours. Deux marches seulement : la première rattrape
 * l'oubli immédiat, la seconde vérifie que ça tient sur la durée d'une session.
 * En mettre plus allongerait chaque session sans rien apprendre de neuf.
 */
export const ETAPES_APPRENTISSAGE = [1, 10] as const

/** Intervalle d'une carte fraîchement diplômée, en jours. */
export const INTERVALLE_DIPLOME = 1
/** Diplôme direct (verdict « Facile » dès l'apprentissage), en jours. */
export const INTERVALLE_FACILE = 4

/** Aisance de départ, et ses bornes. Sous 1,30 une carte n'avance plus. */
export const AISANCE_DEPART = 2.5
export const AISANCE_MIN = 1.3
export const AISANCE_MAX = 5

/** Ce que chaque verdict fait à l'aisance d'une carte diplômée. */
export const AISANCE_DELTA: Record<Verdict, number> = {
  encore: -0.2,
  difficile: -0.15,
  bien: 0,
  facile: 0.15,
}

/** Multiplicateur d'intervalle du verdict « Difficile » (au lieu de l'aisance). */
export const FACTEUR_DIFFICILE = 1.2
/** Bonus du verdict « Facile », par-dessus l'aisance. */
export const FACTEUR_FACILE = 1.3
/** Ce qu'il reste de l'intervalle après une rechute. */
export const FACTEUR_RECHUTE = 0.5

/** Plafond d'un intervalle, en jours : au-delà, réviser ne veut plus dire grand-chose. */
export const INTERVALLE_MAX = 365

/** Rechutes à partir desquelles la carte est signalée à reformuler. */
export const SEUIL_SANGSUE = 8

/** Amplitude de la dispersion des échéances (±5 %). */
export const DISPERSION = 0.05

const MINUTE_MS = 60_000
const JOUR_MS = 86_400_000

const borne = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v))

/** L'état d'une carte jamais vue : due tout de suite, en apprentissage. */
export function etatInitial(nowIso: string): CardState {
  return {
    phase: 'apprentissage',
    step: 0,
    intervalDays: 0,
    ease: AISANCE_DEPART,
    streak: 0,
    reps: 0,
    lapses: 0,
    isLeech: false,
    dueAt: nowIso,
    lastSeenAt: null,
  }
}

const plusMinutes = (nowIso: string, minutes: number): string =>
  new Date(Date.parse(nowIso) + minutes * MINUTE_MS).toISOString()

/**
 * Échéance d'un intervalle en JOURS. On vise le début du jour cible (clé UTC,
 * convention du projet) : une carte due « dans 3 jours » doit être disponible
 * dès le réveil du 3e jour, pas à l'heure exacte où l'élève l'a vue.
 */
function echeanceJours(nowIso: string, jours: number): string {
  const cible = new Date(Date.parse(nowIso) + jours * JOUR_MS)
  cible.setUTCHours(0, 0, 0, 0)
  return cible.toISOString()
}

/**
 * Disperse un intervalle de ±DISPERSION à partir d'un grain dans [0, 1[.
 * Sans elle, tout ce qui est appris le même jour retombe le même jour : la
 * charge arrive par vagues, et une grosse session se paie en une seule fois
 * trois semaines plus tard. Le grain est fourni par l'appelant (jamais tiré
 * ici) pour que la fonction reste pure et le test reproductible.
 */
export function disperser(jours: number, grain: number): number {
  if (jours < 2) return jours // trop court pour être dispersé sans tout casser
  const g = Number.isFinite(grain) ? borne(grain, 0, 0.999999) : 0.5
  const facteur = 1 + (g * 2 - 1) * DISPERSION
  return Math.max(1, Math.round(jours * facteur))
}

/**
 * L'étape d'apprentissage suivante, ou `null` si la carte est diplômée.
 * Extrait pour que `planifier` reste lisible : c'est la seule branche qui
 * regarde la longueur du tableau d'étapes.
 */
function etapeSuivante(step: number): number | null {
  const next = step + 1
  return next < ETAPES_APPRENTISSAGE.length ? next : null
}

/** Diplôme une carte : elle quitte les minutes pour les jours. */
function diplomer(
  state: CardState,
  nowIso: string,
  jours: number,
  ease: number,
  grain: number,
): CardState {
  const intervalDays = borne(disperser(jours, grain), 1, INTERVALLE_MAX)
  return {
    ...state,
    phase: 'revision',
    step: 0,
    intervalDays,
    ease,
    dueAt: echeanceJours(nowIso, intervalDays),
  }
}

/**
 * LA règle : un état + un verdict + l'instant → le nouvel état.
 *
 * `grain` est un nombre dans [0, 1[ qui sert la dispersion des échéances ;
 * l'appelant le tire (Math.random côté serveur), le test le fixe.
 */
export function planifier(
  state: CardState,
  verdict: Verdict,
  nowIso: string,
  grain = 0.5,
): CardState {
  const reussi = verdict !== 'encore'
  const base: CardState = {
    ...state,
    reps: state.reps + 1,
    streak: reussi ? state.streak + 1 : 0,
    lastSeenAt: nowIso,
  }

  // ---------------------------------------------------- phase apprentissage ---
  if (state.phase === 'apprentissage') {
    // L'aisance ne bouge PAS pendant l'apprentissage : une carte qu'on découvre
    // n'a pas encore de difficulté propre, seulement une nouveauté. La punir
    // dès le premier tâtonnement la condamnerait à des intervalles courts pour
    // toujours.
    if (verdict === 'encore') {
      return {
        ...base,
        step: 0,
        dueAt: plusMinutes(nowIso, ETAPES_APPRENTISSAGE[0]),
      }
    }
    if (verdict === 'facile') {
      // Raccourci assumé : l'élève dit qu'il la sait déjà, on ne lui fait pas
      // gravir les marches.
      return diplomer(base, nowIso, INTERVALLE_FACILE, base.ease, grain)
    }
    if (verdict === 'difficile') {
      // On reste sur la même marche : ni punition, ni progression.
      const attente = ETAPES_APPRENTISSAGE[
        borne(state.step, 0, ETAPES_APPRENTISSAGE.length - 1)
      ]
      return { ...base, dueAt: plusMinutes(nowIso, attente) }
    }
    // « Bien » : on monte d'une marche, ou on sort.
    const next = etapeSuivante(state.step)
    if (next === null) {
      // Une carte qui SORT D'UNE RECHUTE reprend la moitié de son ancien
      // intervalle (mémorisée dans `intervalDays` au moment de la rechute) et
      // non le diplôme d'une carte neuve : elle a déjà été sue, ce serait la
      // faire repartir de zéro une seconde fois.
      const jours =
        state.intervalDays > 0 ? state.intervalDays : INTERVALLE_DIPLOME
      return diplomer(base, nowIso, jours, base.ease, grain)
    }
    return {
      ...base,
      step: next,
      dueAt: plusMinutes(nowIso, ETAPES_APPRENTISSAGE[next]),
    }
  }

  // --------------------------------------------------------- phase révision ---
  const ease = borne(
    state.ease + AISANCE_DELTA[verdict],
    AISANCE_MIN,
    AISANCE_MAX,
  )

  if (verdict === 'encore') {
    // RECHUTE. La carte redescend en apprentissage, mais on garde la moitié de
    // son intervalle sous le coude : c'est ce qu'elle retrouvera en sortant.
    const lapses = state.lapses + 1
    return {
      ...base,
      phase: 'apprentissage',
      step: 0,
      intervalDays: borne(
        Math.round(state.intervalDays * FACTEUR_RECHUTE),
        1,
        INTERVALLE_MAX,
      ),
      ease,
      lapses,
      isLeech: lapses >= SEUIL_SANGSUE,
      dueAt: plusMinutes(nowIso, ETAPES_APPRENTISSAGE[0]),
    }
  }

  const courant = Math.max(1, state.intervalDays)
  const facteur =
    verdict === 'difficile'
      ? FACTEUR_DIFFICILE
      : verdict === 'facile'
        ? ease * FACTEUR_FACILE
        : ease
  // `+ 1` minimum : sans lui, un intervalle de 1 jour multiplié par 1,2 et
  // arrondi resterait à 1 jour indéfiniment — la carte ne décollerait jamais.
  const brut = Math.max(courant + 1, Math.round(courant * facteur))
  const intervalDays = borne(disperser(brut, grain), 1, INTERVALLE_MAX)

  return {
    ...base,
    phase: 'revision',
    step: 0,
    intervalDays,
    ease,
    dueAt: echeanceJours(nowIso, intervalDays),
  }
}

// --- Lecture de l'état ---------------------------------------------------------

/** La carte est-elle due à cet instant ? */
export function estDue(state: CardState, nowIso: string): boolean {
  const due = Date.parse(state.dueAt)
  const now = Date.parse(nowIso)
  if (Number.isNaN(due) || Number.isNaN(now)) return true
  return due <= now
}

/** Une carte jamais vue (aucun état enregistré) est toujours « nouvelle ». */
export function estNouvelle(state: CardState): boolean {
  return state.reps === 0
}

/**
 * Le verdict déduit d'une question CORRIGÉE (QCM, vrai/faux, trous, libre) :
 * l'élève ne s'auto-évalue pas, c'est le résultat qui parle. Le « presque »
 * (faute de frappe tolérée) vaut « Difficile » — la réponse est sue, l'écrit
 * ne l'est pas encore.
 */
export function verdictAutomatique(resultat: {
  correct: boolean
  presque?: boolean
}): Verdict {
  if (!resultat.correct) return 'encore'
  return resultat.presque === true ? 'difficile' : 'bien'
}

// --- Composition d'une file de session -----------------------------------------

/** Ce que le sélecteur a besoin de savoir d'une carte. */
export type CarteACaler = {
  id: string
  state: CardState
}

export type PlafondsSession = {
  /** Cartes neuves acceptées dans la session. */
  nouvelles: number
  /** Cartes déjà connues acceptées dans la session. */
  revisions: number
}

/**
 * Compose la file d'une session : les cartes DUES, plafonnées, mélangées.
 *
 * Deux règles, et pas une de plus :
 *   • les RÉVISIONS passent avant les NOUVELLES. Découvrir dix cartes le jour
 *     où trente sont à revoir, c'est creuser la dette de demain ;
 *   • chaque catégorie est plafonnée. Le mur de 300 cartes dues est le premier
 *     motif d'abandon d'une révision espacée : mieux vaut vingt cartes faites
 *     que trois cents affichées.
 *
 * `grains` est une suite de nombres dans [0, 1[ (un par carte) qui sert le
 * mélange ; l'appelant la tire, le test la fixe.
 */
export function composerFile(
  cartes: readonly CarteACaler[],
  plafonds: PlafondsSession,
  nowIso: string,
  grains: readonly number[] = [],
): string[] {
  const dues = cartes.filter((c) => estDue(c.state, nowIso))
  const nouvelles = dues.filter((c) => estNouvelle(c.state))
  const revisions = dues.filter((c) => !estNouvelle(c.state))

  const melanger = (liste: readonly CarteACaler[], decalage: number) =>
    liste
      .map((c, i) => ({
        c,
        g: grains[(decalage + i) % Math.max(1, grains.length)] ?? i,
      }))
      .sort((a, b) => a.g - b.g)
      .map((x) => x.c)

  // Les cartes en RECHUTE (apprentissage mais déjà vues) passent en tête des
  // révisions : ce sont celles qui coincent, et les laisser en fin de file,
  // c'est les servir quand l'attention est déjà retombée.
  const priorite = (c: CarteACaler) =>
    c.state.phase === 'apprentissage' && c.state.reps > 0 ? 0 : 1

  const revisionsTriees = melanger(revisions, 0).sort(
    (a, b) => priorite(a) - priorite(b),
  )

  return [
    ...revisionsTriees.slice(0, Math.max(0, plafonds.revisions)),
    ...melanger(nouvelles, revisions.length).slice(
      0,
      Math.max(0, plafonds.nouvelles),
    ),
  ].map((c) => c.id)
}

/**
 * Le bilan d'un cours : ce qui est dû, ce qui est neuf, ce qui coince. C'est ce
 * qu'affiche l'étagère du carnet — et, contrairement à l'ancien calcul, ça se
 * lit sur les états, pas sur quatre mille tentatives.
 */
export type BilanCours = {
  total: number
  dues: number
  nouvelles: number
  enRechute: number
  sangsues: number
  /** Cartes diplômées dont l'intervalle dépasse 21 jours : acquises. */
  acquises: number
}

/** Seuil au-delà duquel une carte est considérée comme acquise (jours). */
export const SEUIL_ACQUISE = 21

export function bilanCours(
  cartes: readonly CarteACaler[],
  nowIso: string,
): BilanCours {
  let dues = 0
  let nouvelles = 0
  let enRechute = 0
  let sangsues = 0
  let acquises = 0
  for (const { state } of cartes) {
    if (estDue(state, nowIso)) dues += 1
    if (estNouvelle(state)) nouvelles += 1
    else if (state.phase === 'apprentissage') enRechute += 1
    if (state.isLeech) sangsues += 1
    if (state.phase === 'revision' && state.intervalDays >= SEUIL_ACQUISE) {
      acquises += 1
    }
  }
  return {
    total: cartes.length,
    dues,
    nouvelles,
    enRechute,
    sangsues,
    acquises,
  }
}

/**
 * Couronnes de maîtrise d'un cours (0 → 3), sur la part de cartes ACQUISES.
 * Même vocabulaire que les couronnes de leçon. Remplace le calcul de
 * `crownsForCourse`, qui comptait « dernier essai juste » — une carte devinée
 * une fois valait alors autant qu'une carte sue depuis deux mois.
 */
export function couronnes(bilan: BilanCours): 0 | 1 | 2 | 3 {
  if (bilan.total <= 0) return 0
  const ratio = borne(bilan.acquises / bilan.total, 0, 1)
  if (ratio >= 1) return 3
  if (ratio >= 2 / 3) return 2
  if (ratio >= 1 / 3) return 1
  return 0
}

/**
 * Un grain de mélange DÉTERMINISTE dans [0, 1[, dérivé d'une graine texte.
 *
 * `Math.random()` ne peut pas servir ici : les files de session sont composées
 * pendant le RENDU d'un composant serveur, où React interdit les fonctions
 * impures (deux rendus du même écran donneraient deux ordres différents). Une
 * graine « id de la carte + jour » donne mieux qu'un aléa : l'ordre change
 * chaque jour, mais reste stable si l'élève recharge sa session en cours.
 *
 * Hachage FNV-1a 32 bits — court, sans dépendance, et assez dispersé pour un
 * mélange de file (ce n'est pas de la cryptographie).
 */
export function grainDe(graine: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < graine.length; i++) {
    h ^= graine.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h / 0x100000000
}

/** Les grains d'une liste de cartes pour un jour donné (clé UTC). */
export function grainsDuJour(
  ids: readonly string[],
  jour: string,
): number[] {
  return ids.map((id) => grainDe(`${id}:${jour}`))
}
