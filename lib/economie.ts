// -----------------------------------------------------------------------------
// L'ÉCONOMIE DE STUDUEL — LE BARÈME UNIQUE (04/10/2026, migration 557).
//
// Lucas : « partout il doit y avoir un gain d'XP, plus ou moins fort, avec une
// vraie logique. Le gain de gemmes doit être très rare, que pour les dictées,
// les annales ou quelque chose qui a un vrai impact sur les notes, car plus
// difficile. Si c'est trop facile, c'est un souci. »
//
// DEUX MONNAIES, DEUX SENS.
//   · L'XP (l'éclair) dit « j'ai travaillé ». TOUT geste de travail en verse,
//     de la 6e à la Terminale : lire un cours, faire un quiz, réviser, une
//     dictée, une annale, un jeu, un duel. Le montant suit L'EFFORT — une
//     annale traitée vaut quinze fois une fiche d'encyclopédie lue — et chaque
//     activité a un PLAFOND PAR JOUR, pour que l'XP ne se « farme » pas en
//     relançant le jeu le plus facile.
//   · LA GEMME dit « j'ai réussi une ÉPREUVE ». Elle ne tombe que sur ce qui
//     ressemble à une vraie note : la dictée (écrite dans l'app), le contrôle
//     blanc corrigé, l'examen blanc, l'annale du bac, l'exercice ★★★ du cahier
//     — et seulement au-dessus d'un seuil. Plus rien pour un niveau franchi,
//     une quête, une étoile de jeu, une série de 7 jours ou un coffre d'amis :
//     ces gestes paient en XP. Un plafond HEBDOMADAIRE borne le tout.
//
// Ce module est la SOURCE : `xp_activite_bareme`, `xp_activite_plafond` et
// `epreuve_gemmes` (migration 557) en sont les MIROIRS, vérifiés par
// `lib/economie.test.ts`. Les montants sont ceux de BASE : le serveur applique
// ensuite le multiplicateur d'amis et la potion (`xp_avec_bonus`, 380).
// -----------------------------------------------------------------------------

/** Les activités qui versent de l'XP par `xp_activite` (557). */
export type ActiviteXp =
  | 'quiz'
  | 'revision'
  | 'examen_blanc'
  | 'controle'
  | 'dictee'
  | 'annale'
  | 'capsule'
  | 'encyclo'
  | 'flashcards'
  | 'jeu'
  | 'arene'
  | 'defi_jour'
  | 'duel'
  | 'bienvenue'

export type RegleXp = {
  /** Versé dès que l'activité est finie. */
  base: number
  /** Par bonne réponse (ou par point de note sur 20 pour une épreuve notée). */
  parPoint: number
  /** Bonus d'un sans-faute (toutes les réponses justes). */
  parfait: number
  /** Le plus qu'une seule partie peut verser. */
  maxPartie: number
  /** Le plus que l'activité peut verser dans une journée (UTC). */
  plafondJour: number
  /** Ce que l'élève lit sur le barème (« 10 + 2 par bonne réponse »). */
  libelle: string
}

/**
 * LE BARÈME. Ordre de grandeur voulu : une soirée de travail sérieux (deux
 * cours, deux quiz, une révision, une dictée) fait ~200 XP — le niveau 5
 * (2 000 XP) en une à deux semaines, le niveau 10 (4 500) en un mois ; le jeu
 * seul plafonne vite (~160 XP par jour), le travail scolaire non.
 */
export const BAREME_XP: Readonly<Record<ActiviteXp, RegleXp>> = {
  quiz: { base: 10, parPoint: 2, parfait: 10, maxPartie: 50, plafondJour: 250, libelle: '10 + 2 par bonne réponse, +10 si tout est juste' },
  revision: { base: 0, parPoint: 2, parfait: 0, maxPartie: 40, plafondJour: 120, libelle: '2 par carte retrouvée' },
  examen_blanc: { base: 20, parPoint: 2, parfait: 20, maxPartie: 100, plafondJour: 200, libelle: '20 + 2 par bonne réponse' },
  controle: { base: 20, parPoint: 2, parfait: 0, maxPartie: 60, plafondJour: 180, libelle: '20 + 2 par point de la note sur 20' },
  dictee: { base: 10, parPoint: 2, parfait: 0, maxPartie: 50, plafondJour: 150, libelle: '10 + 2 par point de la note sur 20' },
  annale: { base: 150, parPoint: 0, parfait: 0, maxPartie: 150, plafondJour: 300, libelle: '150 par sujet du bac traité' },
  capsule: { base: 80, parPoint: 0, parfait: 0, maxPartie: 80, plafondJour: 240, libelle: '80 par capsule terminée' },
  encyclo: { base: 5, parPoint: 0, parfait: 0, maxPartie: 5, plafondJour: 25, libelle: '5 par fiche lue' },
  flashcards: { base: 0, parPoint: 1, parfait: 0, maxPartie: 20, plafondJour: 60, libelle: '1 par carte revue' },
  jeu: { base: 0, parPoint: 1, parfait: 5, maxPartie: 15, plafondJour: 60, libelle: '1 par bonne réponse' },
  arene: { base: 5, parPoint: 1, parfait: 0, maxPartie: 25, plafondJour: 100, libelle: '5 + 1 par bonne réponse' },
  defi_jour: { base: 30, parPoint: 0, parfait: 0, maxPartie: 30, plafondJour: 30, libelle: '30 par jour' },
  duel: { base: 10, parPoint: 0, parfait: 10, maxPartie: 20, plafondJour: 100, libelle: '10 par course, 20 si tu la gagnes' },
  bienvenue: { base: 50, parPoint: 0, parfait: 0, maxPartie: 50, plafondJour: 50, libelle: '50 pour ta première partie' },
}

export const ACTIVITES_XP = Object.keys(BAREME_XP) as ActiviteXp[]

function entier(n: number): number {
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0
}

/**
 * L'XP de BASE d'une partie : `points` bonnes réponses (ou points de note) sur
 * `total`. Le « parfait » demande au moins une réponse ; le duel le détourne
 * pour sa victoire (`points = total = 1`). MIROIR de `xp_activite_bareme`.
 */
export function xpActivite(activite: ActiviteXp, points: number, total: number): number {
  const r = BAREME_XP[activite]
  const p = entier(points)
  const t = entier(total)
  const parfait = t > 0 && p >= t ? r.parfait : 0
  return Math.min(r.maxPartie, r.base + r.parPoint * Math.min(p, t > 0 ? t : p) + parfait)
}

/** Ce qu'il reste à verser aujourd'hui, `dejaVerse` XP de base étant passés. */
export function xpDansLePlafond(activite: ActiviteXp, montant: number, dejaVerse: number): number {
  return Math.max(0, Math.min(entier(montant), BAREME_XP[activite].plafondJour - entier(dejaVerse)))
}

// --------------------------------------------------------------- les sources fixes

/** L'XP des sources « une fois pour toutes » versées par `wallet_award_xp`. */
export const XP_LECON = 10
/** Le palier de série : tous les 7 jours d'affilée (les 20 gemmes d'avant). */
export const XP_SERIE_7 = 50
/** Une étoile de palier d'un jeu de salon : palier N → 5 × N XP (ex-N gemmes). */
export function xpEtoilePalier(palier: number): number {
  const p = entier(palier)
  return p >= 1 && p <= 5 ? 5 * p : 0
}
/** La victoire contre un gardien de la Traque (ex-gemmes ×3). */
export function xpTraque(rang: number, nox: boolean, enChasse: boolean): number {
  if (nox) return 90
  const base = rang <= 1 ? 30 : rang === 2 ? 45 : 60
  return enChasse ? base * 2 : base
}

// ----------------------------------------------------------------- les gemmes

/** Les épreuves qui peuvent verser des gemmes (`epreuve_recompenser`, 557). */
export type Epreuve = 'dictee' | 'controle' | 'examen_blanc' | 'annale'

/**
 * Les gemmes d'une épreuve RÉUSSIE, une fois par épreuve (l'examen blanc : une
 * fois par semaine). `note` est sur 20. MIROIR de `epreuve_gemmes`.
 *   · dictée écrite dans l'app : 16/20 → 5, 19/20 → 10 (sur papier, l'élève
 *     se corrige lui-même : de l'XP, jamais de gemme) ;
 *   · contrôle blanc corrigé : 14/20 → 5, 17/20 → 10 ;
 *   · examen blanc d'au moins 20 questions : 15/20 → 10 ;
 *   · annale du bac traitée (au moins 15 min sur le sujet) : 10.
 */
export function gemmesEpreuve(epreuve: Epreuve, note: number): number {
  const n = Number.isFinite(note) ? note : 0
  switch (epreuve) {
    case 'dictee':
      return n >= 19 ? 10 : n >= 16 ? 5 : 0
    case 'controle':
      return n >= 17 ? 10 : n >= 14 ? 5 : 0
    case 'examen_blanc':
      return n >= 15 ? 10 : 0
    case 'annale':
      return 10
  }
}

/** Le seuil (sur 20) à partir duquel une épreuve rapporte des gemmes. */
export const SEUIL_GEMMES: Readonly<Record<Epreuve, number>> = {
  dictee: 16,
  controle: 14,
  examen_blanc: 15,
  annale: 0,
}

/** Gemmes d'épreuves au plus par semaine (lundi UTC) : la rareté est garantie. */
export const PLAFOND_GEMMES_SEMAINE = 40
/** Le temps passé sur une annale avant qu'elle compte comme traitée. */
export const ANNALE_MINUTES_MIN = 15
/** Un examen blanc trop court ne rapporte pas de gemme. */
export const EXAMEN_QUESTIONS_MIN = 20
/** L'exercice ★★★ du cahier : 5 gemmes à la première réussite ; ★ et ★★ : 0. */
export function gemmesExerciceCahier(etoiles: number): number {
  return etoiles >= 3 ? 5 : 0
}
