// -----------------------------------------------------------------------------
// LE CADRE DE LA PHOTO DE PROFIL — gagné, jamais acheté (05/10/2026).
//
// Lucas : « ce visuel [le polaroid scotché] est le visuel d'un joueur qui
// n'est pas classé, une simple photo accrochée. Dès qu'il a fait quelques
// quiz, modes de jeu, gains de trophées, il doit automatiquement obtenir un
// cadre en bronze — puis argent, or, platine, diamant, émeraude… Personne n'a
// envie de rester une photo accrochée. »
//
// LE NIVEAU EST LA MESURE, et lui seul : l'XP est versée par TOUS les gestes de
// l'app (quiz, cours, jeux, arène, duels — lib/economie), donc le niveau dit
// déjà « il a fait quelques quiz, quelques parties ». Les trophées ne disent
// que l'arène : un élève qui ne fait que réviser n'en aurait jamais.
//
// Les paliers s'écartent de plus en plus (la courbe d'XP est déjà quadratique,
// lib/wallet) : le bronze tombe en un soir, la légende est l'affaire d'une
// année. C'est le milieu et la fin du jeu.
// -----------------------------------------------------------------------------

export type IdCadre =
  | 'polaroid'
  | 'bronze'
  | 'argent'
  | 'or'
  | 'platine'
  | 'diamant'
  | 'emeraude'
  | 'rubis'
  | 'legende'

export type Cadre = {
  id: IdCadre
  nom: string
  /** Le niveau qui l'accorde. */
  niveau: number
}

export const CADRES: readonly Cadre[] = [
  { id: 'polaroid', nom: 'Photo', niveau: 1 },
  { id: 'bronze', nom: 'Bronze', niveau: 2 },
  { id: 'argent', nom: 'Argent', niveau: 6 },
  { id: 'or', nom: 'Or', niveau: 12 },
  { id: 'platine', nom: 'Platine', niveau: 20 },
  { id: 'diamant', nom: 'Diamant', niveau: 30 },
  { id: 'emeraude', nom: 'Émeraude', niveau: 42 },
  { id: 'rubis', nom: 'Rubis', niveau: 56 },
  { id: 'legende', nom: 'Légende', niveau: 75 },
]

/** Le cadre porté à ce niveau. */
export function cadreDuNiveau(niveau: number): Cadre {
  const n = Number.isFinite(niveau) ? Math.floor(niveau) : 1
  let porte = CADRES[0]
  for (const c of CADRES) if (n >= c.niveau) porte = c
  return porte
}

/** Le prochain cadre et les niveaux qui manquent ; null au sommet. */
export function cadreSuivant(niveau: number): { cadre: Cadre; manque: number } | null {
  const actuel = cadreDuNiveau(niveau)
  const i = CADRES.findIndex((c) => c.id === actuel.id)
  const suivant = CADRES[i + 1]
  if (!suivant) return null
  return { cadre: suivant, manque: suivant.niveau - Math.floor(niveau) }
}

/** « Cadre d'or », « Cadre d'argent », « Cadre de bronze »… */
export function libelleCadre(cadre: Cadre): string {
  if (cadre.id === 'polaroid') return 'Photo accrochée'
  const voyelle = /^[aeiouéè]/i.test(cadre.nom)
  return `Cadre ${voyelle ? 'd’' : 'de '}${cadre.nom.toLowerCase()}`
}

/** L'image du cadre (null pour le polaroid, dessiné en CSS). */
export function imageCadre(cadre: Cadre): string | null {
  return cadre.id === 'polaroid' ? null : `/images/moi/cadres/${cadre.id}.webp`
}

/** « Niv. 12 pour l’or », « niv. 20 pour le platine » ; null au sommet. */
export function phraseCadreSuivant(niveau: number): string | null {
  const s = cadreSuivant(niveau)
  if (!s) return null
  const nom = s.cadre.nom.toLowerCase()
  const article = /^[aeiouéè]/i.test(nom) ? 'l’' : 'le '
  return `niv. ${s.cadre.niveau} pour ${article}${nom}`
}
