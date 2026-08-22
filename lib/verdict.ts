import { schoolLevelForGrade, type SchoolLevel } from './clan'

// Le mot de la fin d'une session de quiz — logique pure.
//
// Le même texte était servi à TOUT LE MONDE : « Aïeee… Tu peux faire mieux ! 😮 »
// est juste pour un 6e, et franchement infantilisant pour un Terminale qui
// prépare le bac. Le ton se règle donc sur le CYCLE, les seuils restant
// identiques pour que la progression se lise pareil partout.

export type Verdict = { emoji: string; message: string }

type Palier = 'parfait' | 'bien' | 'moyen' | 'faible'

// Ton primaire : court, chaleureux, sans vocabulaire d'évaluation. « Chapitre à
// retravailler au fond » ne veut rien dire pour un CE1 — et « Aïeee » de la
// version collège se lit comme une moquerie à cet âge, pas comme un clin d'œil.
const PRIMAIRE: Record<Palier, Verdict> = {
  parfait: { emoji: '🌟', message: 'Tout juste ! Bravo, tu as tout bon.' },
  bien: { emoji: '😄', message: 'Très bien ! Il ne manquait presque rien.' },
  moyen: { emoji: '🙂', message: 'C’est un bon début. On regarde ensemble ce qui a coincé ?' },
  faible: { emoji: '🌱', message: 'Pas grave, ça s’apprend. On refait un tour tranquillement.' },
}

const COLLEGE: Record<Palier, Verdict> = {
  parfait: { emoji: '🤩', message: 'Parfait, sans faute ! Tu maîtrises cette leçon.' },
  bien: { emoji: '😎', message: 'Excellent ! Encore un petit effort pour le sans-faute.' },
  moyen: { emoji: '🙂', message: 'Pas mal ! Relis la correction et retente ta chance.' },
  faible: { emoji: '😮', message: 'Aïeee… Tu peux faire mieux ! On recommence ?' },
}

// Ton lycée : sobre, tourné vers l'examen. On parle résultat et méthode, pas
// « aïeee ».
const LYCEE: Record<Palier, Verdict> = {
  parfait: { emoji: '🎯', message: 'Sans faute. Ce chapitre est acquis.' },
  bien: { emoji: '📈', message: 'Bon niveau. Reprends les points ratés pour sécuriser.' },
  moyen: { emoji: '📚', message: 'Les bases sont là, mais il reste des trous à combler.' },
  faible: { emoji: '🧭', message: 'Chapitre à retravailler au fond avant de le valider.' },
}

const TONS: Record<SchoolLevel, Record<Palier, Verdict>> = {
  primaire: PRIMAIRE,
  college: COLLEGE,
  lycee: LYCEE,
}

// Seuils communs aux trois tons : un 8/10 vaut « bien » quelle que soit la classe.
export function verdictFor(
  ratio: number,
  grade?: string | null,
): Verdict {
  const table = TONS[schoolLevelForGrade(grade)]
  if (ratio >= 1) return table.parfait
  if (ratio >= 0.8) return table.bien
  if (ratio >= 0.5) return table.moyen
  return table.faible
}

export type { SchoolLevel }
