// LE TEXTE À TROUS — la troisième forme de question du quiz du programme.
//
// Duolingo ne pose jamais huit fois la même question. Il alterne : on choisit,
// on associe, on complète une phrase. Le quiz de Studuel, lui, servait DEUX
// formes — le QCM et le vrai/faux — sur les trois mille questions du catalogue.
// Huit écrans identiques d'affilée, où seul le texte change.
//
// ⚠️ CETTE FORME NE COÛTE AUCUNE MIGRATION, et c'est tout son intérêt. Une
// question à trou EST un QCM : même énoncé, mêmes quatre options, même index de
// bonne réponse. Ce qui change est la façon de la LIRE — au lieu de « Quel mot
// complète cette phrase ? » suivi de la phrase, on montre la phrase avec un
// creux dedans, et l'option choisie vient s'y poser. Le contenu se contente
// donc d'écrire `___` là où le mot manque ; la base ne bouge pas, et les 3 300
// questions existantes continuent de fonctionner sans être touchées.
//
// Pur et testé : le rendu (components/quiz/EnonceATrou) ne fait que jouer ce
// que ce module a découpé.

/** La marque du trou dans un énoncé. Trois soulignés, jamais un de plus. */
export const MARQUE_TROU = '___'

export type EnonceATrou = {
  /** Ce qui précède le trou (peut être vide : la phrase peut commencer par lui). */
  avant: string
  /** Ce qui suit (peut être vide). */
  apres: string
}

/**
 * Découpe un énoncé autour de son trou, ou rend `null` si ce n'en est pas un.
 *
 * ⚠️ UN SEUL TROU PAR QUESTION. Deux creux dans la même phrase demanderaient
 * deux réponses, donc un autre modèle de correction (et un autre écran) : tant
 * que le quiz n'a qu'un index de bonne réponse, une question à deux trous est
 * une question mal écrite. On la refuse ici plutôt que d'en deviner une :
 * l'énoncé s'affiche alors tel quel, avec ses soulignés visibles — ce qui se
 * voit tout de suite en relecture, là où un trou choisi au hasard passerait.
 */
export function decouperTrou(enonce: string): EnonceATrou | null {
  const texte = typeof enonce === 'string' ? enonce : ''
  const premier = texte.indexOf(MARQUE_TROU)
  if (premier < 0) return null

  const apres = texte.slice(premier + MARQUE_TROU.length)
  // Un second trou : ce n'est pas une question à trou valide.
  if (apres.includes(MARQUE_TROU)) return null

  return { avant: texte.slice(0, premier), apres }
}

/** Cette question se lit-elle comme un texte à trous ? */
export function estTexteATrou(enonce: string): boolean {
  return decouperTrou(enonce) !== null
}

/**
 * L'énoncé LU À VOIX HAUTE par un lecteur d'écran, une fois le trou rempli.
 *
 * Un lecteur d'écran qui rencontre « ___ » annonce « souligné souligné
 * souligné », ou rien du tout selon le moteur. La phrase entière, elle,
 * s'entend — et c'est la seule façon d'entendre l'exercice.
 *
 * `rempli` absent : on annonce « blanc », le mot que l'élève entendrait d'un
 * professeur qui lit un texte lacunaire.
 */
export function enonceParle(enonce: string, rempli?: string | null): string {
  const parts = decouperTrou(enonce)
  if (!parts) return enonce
  const mot = rempli && rempli.trim().length > 0 ? rempli : 'blanc'
  return `${parts.avant}${mot}${parts.apres}`.replace(/\s+/g, ' ').trim()
}

/**
 * La largeur du creux, en caractères, quand il est encore vide.
 *
 * Elle suit la LONGUEUR DE LA PLUS LONGUE OPTION, et non celle de la bonne
 * réponse : un creux taillé sur la réponse juste la désignerait à l'œil avant
 * même qu'on ait lu les propositions. Bornée pour qu'une option bavarde ne
 * pousse pas la phrase hors de l'écran.
 */
export function largeurDuCreux(options: readonly string[]): number {
  const longueurs = (options ?? [])
    .map((o) => (typeof o === 'string' ? o.length : 0))
    .filter((n) => n > 0)
  if (longueurs.length === 0) return MIN_CREUX
  const max = Math.max(...longueurs)
  return Math.min(MAX_CREUX, Math.max(MIN_CREUX, max))
}

/** Un creux plus court ne se lit plus comme un creux. */
export const MIN_CREUX = 4
/** Au-delà, il passerait à la ligne et casserait la phrase en deux. */
export const MAX_CREUX = 16
