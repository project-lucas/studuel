import { schoolLevelForGrade, type SchoolLevel } from './clan'

// Le mot de la fin d'une session de quiz — logique pure.
//
// Le même texte était servi à TOUT LE MONDE : « Aïeee… Tu peux faire mieux ! 😮 »
// est juste pour un 6e, et franchement infantilisant pour un Terminale qui
// prépare le bac. Le ton se règle donc sur le CYCLE, les seuils restant
// identiques pour que la progression se lise pareil partout.

export type Verdict = {
  emoji: string
  /**
   * LE TITRE — deux ou trois mots, en gros, sous la mascotte.
   *
   * L'écran de fin n'avait que le `message`, une phrase entière servie en petit
   * corps de texte. Duolingo ouvre par un TITRE que l'œil prend d'un coup, et
   * garde la phrase pour dessous : on sait comment on s'en est sorti avant
   * d'avoir lu quoi que ce soit. Même ton que le message, même palier.
   */
  titre: string
  message: string
}

type Palier = 'parfait' | 'bien' | 'moyen' | 'faible'

// Ton primaire : court, chaleureux, sans vocabulaire d'évaluation. « Chapitre à
// retravailler au fond » ne veut rien dire pour un CE1 — et « Aïeee » de la
// version collège se lit comme une moquerie à cet âge, pas comme un clin d'œil.
const PRIMAIRE: Record<Palier, Verdict> = {
  parfait: { emoji: '🌟', titre: 'Tout juste !', message: 'Bravo, tu as tout bon.' },
  bien: { emoji: '😄', titre: 'Très bien !', message: 'Il ne manquait presque rien.' },
  moyen: { emoji: '🙂', titre: 'Bon début !', message: 'On regarde ensemble ce qui a coincé ?' },
  faible: { emoji: '🌱', titre: 'Ça s’apprend', message: 'Pas grave. On refait un tour tranquillement.' },
}

const COLLEGE: Record<Palier, Verdict> = {
  parfait: { emoji: '🤩', titre: 'Sans faute !', message: 'Tu maîtrises cette leçon.' },
  bien: { emoji: '😎', titre: 'Excellent !', message: 'Encore un petit effort pour le sans-faute.' },
  moyen: { emoji: '🙂', titre: 'Pas mal !', message: 'Relis la correction et retente ta chance.' },
  faible: { emoji: '😮', titre: 'Aïeee…', message: 'Tu peux faire mieux ! On recommence ?' },
}

// Ton lycée : sobre, tourné vers l'examen. On parle résultat et méthode, pas
// « aïeee ».
const LYCEE: Record<Palier, Verdict> = {
  parfait: { emoji: '🎯', titre: 'Chapitre acquis', message: 'Sans faute.' },
  bien: { emoji: '📈', titre: 'Bon niveau', message: 'Reprends les points ratés pour sécuriser.' },
  moyen: { emoji: '📚', titre: 'À consolider', message: 'Les bases sont là, mais il reste des trous à combler.' },
  faible: { emoji: '🧭', titre: 'À retravailler', message: 'Ce chapitre est à reprendre au fond avant de le valider.' },
}

const TONS: Record<SchoolLevel, Record<Palier, Verdict>> = {
  primaire: PRIMAIRE,
  college: COLLEGE,
  lycee: LYCEE,
}

// Seuils communs aux trois tons : un 8/10 vaut « bien » quelle que soit la
// classe. Écrits ICI et nulle part ailleurs : le ton du message et le dessin de
// la mascotte doivent basculer au même 8/10, sinon l'écran de fin félicite d'un
// côté et console de l'autre.
export function verdictPalier(ratio: number): Palier {
  if (ratio >= 1) return 'parfait'
  if (ratio >= 0.8) return 'bien'
  if (ratio >= 0.5) return 'moyen'
  return 'faible'
}

export function verdictFor(
  ratio: number,
  grade?: string | null,
): Verdict {
  return TONS[schoolLevelForGrade(grade)][verdictPalier(ratio)]
}

/**
 * L'ILLUSTRATION de la mascotte pour ce score.
 *
 * L'écran de fin affichait un EMOJI — rendu par la police du système, donc
 * différent sur chaque téléphone, et étranger au reste de l'app. Or la mascotte
 * a déjà ses dix dessins (`lib/quiz-feedback`), montrés à CHAQUE question dans
 * la feuille de retour : l'écran de fin était le seul endroit où elle
 * disparaissait, juste au moment où on la regarde le plus longtemps.
 *
 * Le rang 5 des bonnes réponses est réservé au sans-faute par définition (cf.
 * `REACTION_SANS_FAUTE`) : c'est exactement le palier « parfait ». En dessous
 * de la moitié, la mascotte prend le dessin d'erreur à mi-parcours — assez pour
 * que le gag se lise, pas assez pour se moquer.
 */
export function verdictSrc(ratio: number): string {
  const rangs: Record<Palier, string> = {
    parfait: 'bonne-5',
    bien: 'bonne-3',
    moyen: 'bonne-1',
    faible: 'mauvaise-3',
  }
  return `/images/mascotte/reaction-${rangs[verdictPalier(ratio)]}.webp`
}

export type { SchoolLevel }
