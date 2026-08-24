// -----------------------------------------------------------------------------
// LA CÉLÉBRATION DE SÉRIE — le moment où la case du jour se remplit.
//
// La série existait déjà : la flamme du bandeau, les sept jours de `SerieBar`.
// Mais elle se remplissait EN SILENCE, sur un écran que l'élève ne regardait
// pas — il finissait son quiz, voyait son score, et la case du lundi passait au
// vert quelque part derrière lui. Le seul mécanisme de rétention du produit ne
// se voyait jamais au moment où il se déclenche.
//
// Ce module dit UNIQUEMENT : faut-il célébrer, et à quoi ressemble la semaine
// AVANT et APRÈS. L'animation (la case qui se remplit, le son) vit dans le
// composant ; le fait de savoir si elle a lieu vit ici, pur et testé.
//
// LA RÈGLE : on célèbre à la PREMIÈRE activité enregistrée du jour, pas à
// chaque quiz. Un élève qui enchaîne cinq quiz ne veut pas voir cinq fois la
// même fête — la deuxième la transformerait déjà en obstacle entre lui et le
// suivant.
// -----------------------------------------------------------------------------

/** Un jour de la bande hebdomadaire (même forme que `weekProgress`). */
export type JourSerie = {
  done: boolean
  isToday: boolean
  isFuture: boolean
}

export type Celebration = {
  /** Faut-il jouer l'écran ? */
  celebrer: boolean
  /** La semaine AVANT — la case du jour y est encore vide. */
  avant: JourSerie[]
  /** La semaine APRÈS — c'est celle qui se remplit à l'écran. */
  apres: JourSerie[]
  /** Le compte de série à annoncer, une fois le jour compté. */
  serie: number
  /** Index (0 = lundi) du jour qui vient de se remplir, -1 s'il n'y en a pas. */
  indexDuJour: number
}

/**
 * Prépare la célébration à partir de l'état de la semaine AVANT l'activité.
 *
 * `serieAvant` est le compte de série tel qu'il était avant : on n'ajoute 1 que
 * si le jour n'était pas déjà fait. Le serveur pourrait le recalculer, mais il
 * le ferait APRÈS l'écriture — donc sans savoir si la case était vide, qui est
 * précisément l'information dont l'animation a besoin.
 */
export function preparerCelebration(
  semaineAvant: readonly JourSerie[],
  serieAvant: number,
): Celebration {
  const avant = semaineAvant.map((j) => ({ ...j }))
  const indexDuJour = avant.findIndex((j) => j.isToday)

  // Pas de jour courant dans la bande (semaine mal formée) : on ne célèbre
  // rien plutôt que de remplir une case au hasard.
  if (indexDuJour === -1) {
    return { celebrer: false, avant, apres: avant, serie: serieAvant, indexDuJour }
  }

  // Le jour était DÉJÀ fait : ce n'est pas la première activité de la journée,
  // il n'y a rien à remplir et rien à fêter.
  if (avant[indexDuJour].done) {
    return { celebrer: false, avant, apres: avant, serie: serieAvant, indexDuJour }
  }

  const apres = avant.map((j, i) => (i === indexDuJour ? { ...j, done: true } : j))
  return {
    celebrer: true,
    avant,
    apres,
    serie: Math.max(1, serieAvant + 1),
    indexDuJour,
  }
}

/**
 * La phrase du haut — celle que la mascotte dit. Elle change avec le palier,
 * parce qu'une même phrase répétée trente jours d'affilée cesse d'être une
 * récompense pour devenir un bruit.
 */
export function phraseSerie(serie: number): string {
  if (serie <= 1) return 'Arriveras-tu à travailler tous les jours ?'
  if (serie === 2) return 'Deux jours de suite. C’est comme ça que ça commence.'
  if (serie < 7) return 'Tu tiens le rythme — ne lâche pas maintenant.'
  if (serie === 7) return 'Une semaine complète. Sérieusement.'
  if (serie < 30) return 'La régularité, c’est ce qui fait la différence.'
  if (serie === 30) return 'Trente jours. Tu n’es plus en train d’essayer.'
  return 'Personne ne fait ça par hasard.'
}

/** « 1 jour ! » / « 12 jours ! » — l'accord, sans y penser à chaque appel. */
export function libelleSerie(serie: number): string {
  const n = Math.max(0, Math.floor(Number(serie) || 0))
  return n > 1 ? `${n} jours !` : `${n} jour !`
}
