// LA LECTURE D'UN COURS — ce qui la fait compter (13/10/2026).
//
// Un cours est « lu » quand l'élève a atteint la fin du texte ET y a passé un
// temps minimum. Le temps attendu est volontairement bas — une seconde pour
// dix mots, soit 600 mots à la minute, trois fois la vitesse d'un lecteur qui
// lit vraiment — : il ne juge pas la lecture, il écarte le geste de faire
// défiler jusqu'en bas sans rien lire. Borné entre 20 s (un cours très court
// mérite au moins ça) et 2 min (au-delà, un élève qui survole part sans rien
// valider, et il n'a pas tort).
//
// Pur et testé.

export const MOTS_PAR_SECONDE = 10
export const LECTURE_MIN_S = 20
export const LECTURE_MAX_S = 120

/** Le nombre de mots d'un cours écrit en Markdown, sans son balisage. */
export function compterMots(contenu: string | null | undefined): number {
  if (!contenu) return 0
  return contenu
    .replace(/[#*_>`|~-]+/g, ' ')
    .split(/\s+/)
    .filter((m) => /[\p{L}\p{N}]/u.test(m)).length
}

/** Les secondes de lecture attendues avant que la leçon compte. */
export function secondesDeLecture(mots: number): number {
  const brut = Math.ceil(Math.max(0, mots) / MOTS_PAR_SECONDE)
  return Math.min(LECTURE_MAX_S, Math.max(LECTURE_MIN_S, brut))
}
