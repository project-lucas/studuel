import { seededRng } from './defi-modes'

// Mélange l'ordre des options d'un QCM à la source, en gardant la bonne réponse
// synchronisée. Le score, les pastilles, la correction et le SRS comparent tous
// la réponse choisie PAR INDEX à `correctIndex` : il faut donc permuter les
// `options` ET l'index ENSEMBLE, sinon la correction devient fausse.
//
// Le mélange est déterministe (Fisher-Yates semé par `seed`) : au même seed le
// même ordre. On sème par `question.id` — stable, SSR-safe (pas de re-mélange à
// chaque rendu), et testable. Les vrai/faux ne passent pas ici (le caller garde
// « Vrai » puis « Faux »).
export function permuteOptions(
  options: string[],
  correctIndex: number,
  seed: string,
): { options: string[]; correctIndex: number } {
  const n = options.length
  // Rien à permuter (0 ou 1 option) ou index hors bornes : on renvoie tel quel.
  if (n < 2 || correctIndex < 0 || correctIndex >= n) {
    return { options: [...options], correctIndex }
  }

  const perm = Array.from({ length: n }, (_, i) => i)
  const rng = seededRng(seed)
  // Fisher-Yates déterministe.
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = perm[i]
    perm[i] = perm[j]
    perm[j] = tmp
  }

  return {
    options: perm.map((k) => options[k]),
    correctIndex: perm.indexOf(correctIndex),
  }
}

// Politique de mélange partagée par TOUTES les surfaces de quiz (Défi, Quiz,
// Révision, Examen blanc, Coop/Duel en direct) : on permute les QCM mais on
// laisse les vrai/faux dans l'ordre « Vrai » puis « Faux ». Centralisé ici pour
// que le comportement reste identique partout — en particulier, en Coop/Duel en
// direct, hôte et invité chargent leurs questions séparément mais appellent
// cette même fonction avec le même seed (`question.id`), donc obtiennent le
// MÊME ordre. Accepte le `kind` de la question ; `seed` = l'id de la question.
export function permuteQuizOptions(
  kind: 'mcq' | 'true_false',
  options: string[],
  correctIndex: number,
  seed: string,
): { options: string[]; correctIndex: number } {
  if (kind === 'true_false') return { options, correctIndex }
  return permuteOptions(options, correctIndex, seed)
}
