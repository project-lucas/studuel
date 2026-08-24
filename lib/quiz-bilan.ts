// -----------------------------------------------------------------------------
// LES TROIS CHIFFRES DE FIN DE QUIZ — réussite, avancement, ancrage.
//
// L'écran de fin ne disait qu'une chose : « 3 / 8 ». C'est le score du jour, et
// il ne dit RIEN de ce qui compte vraiment — est-ce que j'ai fait le tour du
// chapitre ? est-ce que ça tient dans le temps ? Un élève à 3/8 sur les deux
// dernières questions difficiles d'un chapitre qu'il maîtrise voit le même
// nombre qu'un élève qui découvre tout.
//
// Trois lectures, donc, et elles ne mesurent pas la même chose :
//
//   RÉUSSITE   — ce que tu viens de faire. Le score de la session.
//   AVANCEMENT — combien de questions du quiz tu as DÉJÀ RENCONTRÉES, une fois
//                au moins. C'est la couverture : « j'ai fait le tour ».
//   ANCRAGE    — combien tiennent DURABLEMENT, c'est-à-dire montées assez haut
//                dans le moteur de répétition espacée pour ne revenir que dans
//                deux semaines ou plus. C'est la mémorisation, pas la chance.
//
// Les trois se lisent sur le MÊME dénominateur (le quiz entier) sauf la
// réussite, qui porte sur les questions réellement posées — une séance
// d'entraînement de 5 questions sur 8 ne doit pas afficher 62 % de réussite
// parce qu'on l'aurait divisée par 8.
//
// Pur et testable.
// -----------------------------------------------------------------------------

import { MAX_BOX, MIN_BOX } from '@/lib/questions/engine'

/**
 * Palier à partir duquel une question est dite ANCRÉE.
 *
 * Les intervalles du moteur sont [1, 3, 7, 14, 30] jours. La boîte 4 (14 jours)
 * est le premier palier où l'on peut parler de mémoire durable plutôt que de
 * souvenir de la veille — c'est aussi le seuil qu'utilise le carnet
 * (`SEUIL_ACQUISE`, 21 jours) transposé à l'échelle du moteur du programme.
 */
export const BOX_ANCRAGE = 4

/** L'état d'une question, réduit à ce dont le bilan a besoin. */
export type EtatBilan = {
  /** Palier du moteur (1 → 5). */
  box: number
  /** Nombre de passages. 0 = jamais rencontrée. */
  timesSeen: number
}

export type Bilan = {
  /** % de bonnes réponses de la session (0 si rien n'a été posé). */
  reussite: number
  /** % des questions du quiz déjà rencontrées au moins une fois. */
  avancement: number
  /** % des questions du quiz mémorisées durablement. */
  ancrage: number
}

const pourcent = (part: number, tout: number): number =>
  tout > 0 ? Math.round((part / tout) * 100) : 0

/** Une boîte lue en base peut être absente ou hors bornes : on la ramène. */
function boxSure(box: unknown): number {
  const n = Number(box)
  if (!Number.isFinite(n)) return MIN_BOX
  return Math.max(MIN_BOX, Math.min(MAX_BOX, Math.floor(n)))
}

/**
 * Les trois chiffres.
 *
 * `etats` porte les états APRÈS la session, pour les questions dont on en a
 * un. Les questions du quiz sans état n'ont jamais été rencontrées : elles
 * comptent au dénominateur, jamais au numérateur.
 */
export function bilanDuQuiz(
  /** Nombre de questions du QUIZ ENTIER (le dénominateur de la couverture). */
  total: number,
  etats: readonly EtatBilan[],
  session: { justes: number; posees: number },
): Bilan {
  const t = Math.max(0, Math.floor(total))

  let vues = 0
  let ancrees = 0
  for (const e of etats) {
    if ((Number(e.timesSeen) || 0) > 0) vues += 1
    if (boxSure(e.box) >= BOX_ANCRAGE) ancrees += 1
  }

  return {
    // La réussite se divise par les questions POSÉES, pas par le quiz entier :
    // une séance d'entraînement de 5 questions sur 8 toutes justes vaut 100 %,
    // pas 62 %.
    reussite: pourcent(session.justes, session.posees),
    // Les deux autres, elles, se divisent par le quiz entier — c'est le sens
    // même de « avancement » et « ancrage ». On borne : plus d'états que de
    // questions (un quiz raccourci depuis) ne doit pas donner 120 %.
    avancement: Math.min(100, pourcent(vues, t)),
    ancrage: Math.min(100, pourcent(ancrees, t)),
  }
}

/**
 * Le temps de révision qui vient d'être fait, écrit court : « +2m16 », « +45s »,
 * « +1h04 ». C'est un GAIN qu'on annonce, d'où le « + » — il s'ajoute au temps
 * global de l'onglet profil.
 */
export function formatDureeGain(secondes: number): string {
  const s = Math.max(0, Math.floor(Number(secondes) || 0))
  if (s < 60) return `+${s}s`
  const minutes = Math.floor(s / 60)
  const reste = s % 60
  if (minutes < 60) {
    // Les secondes sur deux chiffres : « 2m06 » et non « 2m6 ».
    return `+${minutes}m${String(reste).padStart(2, '0')}`
  }
  const heures = Math.floor(minutes / 60)
  return `+${heures}h${String(minutes % 60).padStart(2, '0')}`
}
