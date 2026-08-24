// -----------------------------------------------------------------------------
// LA CORRECTION D'UNE DICTÉE — aligner la copie de l'élève sur le texte attendu.
//
// C'est le cœur du mode Dictée, et la seule partie qui ne pardonne pas
// l'à-peu-près : l'écran de correction montre la copie mot à mot, le juste en
// vert et le faux barré en rouge. Un alignement bancal ne se voit pas dans un
// test de score — il se voit à l'écran, sous la forme d'un paragraphe entier
// barré parce qu'un mot a été oublié au début.
//
// L'ALGORITHME : plus longue sous-séquence commune (LCS) sur les MOTS, pas sur
// les caractères. Un diff caractère par caractère sur « chevaux » / « chevals »
// produirait « cheva[ux→ls] » — illisible pour un élève. Au mot, on obtient
// « chevaux » barré et remplacé, ce qui est exactement ce qu'un professeur
// écrirait dans la marge.
//
// La ponctuation est un TOKEN À PART : elle compte dans une dictée (« ; » oublié
// est une faute), mais la coller au mot ferait passer « mourir. » et « mourir »
// pour deux mots différents quand seul le point manque.
//
// Pur et testable. Aucune lecture d'horloge, aucun accès réseau.
// -----------------------------------------------------------------------------

/** Un morceau de la copie, tel que l'écran de correction doit le rendre. */
export type MorceauCorrection =
  | { type: 'garde'; texte: string }
  /** L'élève a écrit ça, ce n'était pas attendu ici : barré en rouge. */
  | { type: 'ajoute'; texte: string }
  /** Attendu, absent de la copie : montré en vert, à sa place. */
  | { type: 'manque'; texte: string }

export type Correction = {
  morceaux: MorceauCorrection[]
  /** Mots du texte attendu (le dénominateur de la note). */
  motsAttendus: number
  /** Mots justes, à leur place. */
  motsJustes: number
  /** Nombre de fautes — ce qu'on annonce à l'élève. */
  erreurs: number
}

/**
 * Découpe un texte en jetons : les mots d'un côté, la ponctuation de l'autre.
 *
 * L'apostrophe et le trait d'union RESTENT dans le mot : « n'ai » et
 * « rez-de-chaussée » sont un mot chacun, et les séparer ferait de chaque
 * élision une faute distincte.
 */
export function tokeniser(texte: string): string[] {
  const t = String(texte ?? '')
  // Mots (lettres accentuées comprises, apostrophes et traits d'union inclus),
  // OU un signe de ponctuation isolé. Tout le reste (espaces) disparaît.
  const motif = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*|[.,;:!?«»"()…]/gu
  return t.match(motif) ?? []
}

/**
 * Forme comparable d'un jeton.
 *
 * La casse et les accents COMPTENT dans une dictée — c'est même une bonne part
 * de l'exercice. On ne normalise donc rien, à une exception près : les deux
 * apostrophes (droite et typographique) sont ramenées à la même, parce que
 * laquelle sort du clavier ne dépend pas de l'élève.
 */
export function normaliserJeton(jeton: string): string {
  return String(jeton ?? '').replace(/’/g, "'")
}

/** Ce jeton est-il un mot (par opposition à un signe de ponctuation) ? */
export function estMot(jeton: string): boolean {
  return /[\p{L}\p{N}]/u.test(jeton)
}

/**
 * Table de plus longue sous-séquence commune entre deux listes de jetons.
 *
 * Bornée : au-delà de `MAX_JETONS` de part et d'autre, la matrice deviendrait
 * un gouffre (n × m entiers). Une dictée scolaire dépasse rarement 300 mots ;
 * une copie de 4 000 jetons est un collage accidentel, pas une dictée.
 */
export const MAX_JETONS = 2_000

function tableLcs(a: readonly string[], b: readonly string[]): Int32Array[] {
  const n = a.length
  const m = b.length
  const table: Int32Array[] = Array.from(
    { length: n + 1 },
    () => new Int32Array(m + 1),
  )
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] =
        a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  return table
}

/**
 * Compare la copie de l'élève au texte attendu.
 *
 * `attendu` d'abord, `copie` ensuite — l'ordre compte : un jeton présent dans
 * l'attendu et absent de la copie est un OUBLI (`manque`), l'inverse est un
 * AJOUT (`ajoute`). Les intervertir échangerait le vert et le rouge.
 */
export function corrigerDictee(attendu: string, copie: string): Correction {
  const a = tokeniser(attendu).slice(0, MAX_JETONS)
  const b = tokeniser(copie).slice(0, MAX_JETONS)
  const na = a.map(normaliserJeton)
  const nb = b.map(normaliserJeton)

  const motsAttendus = a.filter(estMot).length

  // Copie vide : tout manque. On le traite à part plutôt que de faire tourner
  // une LCS sur une liste vide — et surtout, ça évite un tableau de morceaux
  // vide qui donnerait à l'écran une correction... blanche.
  if (b.length === 0) {
    return {
      morceaux: a.length > 0 ? [{ type: 'manque', texte: a.join(' ') }] : [],
      motsAttendus,
      motsJustes: 0,
      erreurs: motsAttendus,
    }
  }

  const table = tableLcs(na, nb)

  // Remontée de la table : on produit les morceaux dans l'ordre du texte.
  const morceaux: MorceauCorrection[] = []
  let motsJustes = 0
  let erreurs = 0
  let i = 0
  let j = 0

  const pousser = (type: MorceauCorrection['type'], texte: string) => {
    const dernier = morceaux[morceaux.length - 1]
    // On RECOLLE les morceaux voisins de même nature : sans ça, une phrase
    // juste deviendrait vingt segments verts à rendre un par un, et le texte
    // perdrait ses espaces au passage.
    if (dernier && dernier.type === type) dernier.texte += ` ${texte}`
    else morceaux.push({ type, texte })
  }

  while (i < na.length && j < nb.length) {
    if (na[i] === nb[j]) {
      pousser('garde', a[i])
      if (estMot(a[i])) motsJustes++
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      // Le jeton attendu n'est pas dans la copie : oubli.
      pousser('manque', a[i])
      if (estMot(a[i])) erreurs++
      i++
    } else {
      // Le jeton de la copie n'était pas attendu ici : ajout.
      pousser('ajoute', b[j])
      if (estMot(b[j])) erreurs++
      j++
    }
  }
  while (i < na.length) {
    pousser('manque', a[i])
    if (estMot(a[i])) erreurs++
    i++
  }
  while (j < nb.length) {
    pousser('ajoute', b[j])
    if (estMot(b[j])) erreurs++
    j++
  }

  return { morceaux, motsAttendus, motsJustes, erreurs }
}

// --- La note ------------------------------------------------------------------

/**
 * La note sur 20.
 *
 * PAS « 20 moins le nombre de fautes ». C'est la règle scolaire classique, et
 * elle est ingérable ici : sur une dictée de 150 mots, une copie honnête à 25
 * fautes et une copie vide donnent toutes les deux zéro. L'élève ne verrait
 * aucune différence entre travailler et ne rien rendre.
 *
 * La note est donc PROPORTIONNELLE à la part du texte correctement restituée.
 * Elle reste sévère — une faute sur dix mots coûte deux points — mais elle
 * distingue enfin les copies entre elles, ce qui est tout ce qu'on lui demande.
 *
 * Arrondie au demi-point : c'est l'usage scolaire, et « 13,5 » se lit mieux que
 * « 13,47 ».
 */
export function noteSur20(correction: {
  motsAttendus: number
  motsJustes: number
}): number {
  const total = Math.max(0, Math.floor(correction.motsAttendus))
  if (total === 0) return 0
  const justes = Math.max(0, Math.min(total, Math.floor(correction.motsJustes)))
  const brute = (justes / total) * 20
  return Math.round(brute * 2) / 2
}

/** « 13,5 / 20 » — la virgule décimale française, et pas de « ,0 » inutile. */
export function formatNote(note: number): string {
  const n = Math.max(0, Math.min(20, Number(note) || 0))
  return Number.isInteger(n) ? `${n}` : n.toFixed(1).replace('.', ',')
}

// --- Les explications ----------------------------------------------------------

/** Une erreur isolée, avec le contexte qui la rend compréhensible. */
export type ErreurExpliquee = {
  /** Le mot attendu, celui sur lequel porte l'explication. */
  attendu: string
  /** Le mot précédent et le suivant, pour situer sans relire toute la dictée. */
  avant: string
  apres: string
}

/**
 * Les erreurs à expliquer, dans l'ordre du texte.
 *
 * Seuls les OUBLIS et REMPLACEMENTS de mots portent une explication : un ajout
 * n'a rien à expliquer (l'élève a écrit un mot qui n'existe pas dans le texte),
 * et la ponctuation ferait vingt entrées « virgule » qui noieraient les fautes
 * de grammaire.
 */
export function erreursAExpliquer(
  correction: Correction,
  max = 20,
): ErreurExpliquee[] {
  // On reconstitue la suite des mots ATTENDUS (gardés + manquants), pour
  // pouvoir donner à chaque erreur son voisinage réel.
  const suite: { mot: string; rate: boolean }[] = []
  for (const m of correction.morceaux) {
    if (m.type === 'ajoute') continue
    for (const jeton of m.texte.split(' ')) {
      if (!estMot(jeton)) continue
      suite.push({ mot: jeton, rate: m.type === 'manque' })
    }
  }

  const sorties: ErreurExpliquee[] = []
  for (let i = 0; i < suite.length && sorties.length < max; i++) {
    if (!suite[i].rate) continue
    sorties.push({
      attendu: suite[i].mot,
      avant: i > 0 ? suite[i - 1].mot : '',
      apres: i + 1 < suite.length ? suite[i + 1].mot : '',
    })
  }
  return sorties
}
