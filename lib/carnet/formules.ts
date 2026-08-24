// -----------------------------------------------------------------------------
// LES FORMULES DU CARNET — maths et sciences, sans bibliothèque.
//
// Le carnet était en texte brut : « x² », « H₂O », « √2 » ou « 3/4 » s'y
// écrivaient à la main, mal, ou pas du tout. Les maths et la physique étaient
// donc hors-jeu — dans une app de révision scolaire.
//
// POURQUOI PAS KaTeX / MathJax
// Le dépôt vient de faire une passe de poids (19,6 Mo d'images sorties, Recharts
// chargé à la demande). KaTeX, c'est ~280 Ko de JS + ses polices, sur TOUTES les
// pages du carnet, pour une minorité de cartes. Et l'immense majorité de ce
// qu'écrit un élève de collège ou de lycée tient dans cinq notations.
//
// On lit donc une syntaxe VOLONTAIREMENT ÉTROITE, et on l'assume :
//   x^2      exposant            → x²
//   H_2O     indice              → H₂O
//   3/4      fraction simple     → ¾ (rendue par le composant, en pile)
//   sqrt(2)  racine              → √2
//   \alpha   lettres grecques    → α    (et le reste du petit lexique)
//
// Tout le reste passe en texte, tel quel : mieux vaut afficher « \int_0^1 »
// littéralement que de prétendre le rendre et le rendre faux.
//
// Pur et testable : ce module DÉCOUPE, il ne rend rien. Le rendu (JSX) vit dans
// le composant, comme partout ailleurs.
// -----------------------------------------------------------------------------

export type SegmentFormule =
  | { type: 'texte'; valeur: string }
  | { type: 'exposant'; base: string; valeur: string }
  | { type: 'indice'; base: string; valeur: string }
  | { type: 'fraction'; numerateur: string; denominateur: string }
  | { type: 'racine'; valeur: string }

/** Le petit lexique de symboles reconnus, écrits à la LaTeX. */
export const SYMBOLES: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  Delta: 'Δ',
  epsilon: 'ε',
  theta: 'θ',
  lambda: 'λ',
  mu: 'µ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  Sigma: 'Σ',
  tau: 'τ',
  phi: 'φ',
  omega: 'ω',
  Omega: 'Ω',
  infty: '∞',
  times: '×',
  div: '÷',
  pm: '±',
  leq: '≤',
  geq: '≥',
  neq: '≠',
  approx: '≈',
  in: '∈',
  cup: '∪',
  cap: '∩',
  rightarrow: '→',
  Rightarrow: '⇒',
  degree: '°',
  euro: '€',
}

/** Chiffres en exposant / indice, pour les cas qui tiennent en Unicode. */
const EXPOSANTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  n: 'ⁿ',
}
const INDICES: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
}

/**
 * Remplace les `\symbole` par leur caractère. Un `\inconnu` est laissé TEL QUEL :
 * un élève qui a écrit une commande qu'on ne connaît pas doit la voir, pas la
 * voir disparaître.
 */
export function remplacerSymboles(texte: string): string {
  return String(texte).replace(/\\([A-Za-z]+)/g, (brut, nom: string) =>
    Object.prototype.hasOwnProperty.call(SYMBOLES, nom) ? SYMBOLES[nom] : brut,
  )
}

/** Convertit en Unicode si TOUS les caractères sont convertibles, sinon null. */
function versUnicode(
  valeur: string,
  table: Record<string, string>,
): string | null {
  if (valeur.length === 0) return null
  let out = ''
  for (const ch of valeur) {
    const remplacant = table[ch]
    if (!remplacant) return null
    out += remplacant
  }
  return out
}

// Ce qui peut porter un exposant ou un indice : un mot, un nombre, ou un groupe
// entre parenthèses. On ne remonte pas plus loin — « 2x^2 » a pour base « x ».
const BASE = '[A-Za-zÀ-ÿ0-9)\\]]+'
// La valeur : soit un groupe {…}, soit — SANS accolades — un nombre (signé) ou
// UNE seule lettre. Accepter une suite de lettres et de chiffres serait
// gourmand : « H_2O » verrait « 2O » comme l'indice et mangerait l'oxygène.
// Au-delà d'un caractère non chiffré, on exige les accolades — c'est aussi ce
// que fait LaTeX.
const VALEUR = '(?:\\{([^{}]{1,20})\\}|([+-]?\\d+|[A-Za-z]))'

const MOTIF = new RegExp(
  [
    `(${BASE})\\^${VALEUR}`, // exposant
    `(${BASE})_${VALEUR}`, // indice
    'sqrt\\(([^()]{1,40})\\)', // racine
    '(\\d+)\\s*/\\s*(\\d+)', // fraction simple
  ].join('|'),
  'g',
)

/**
 * Découpe un texte en segments : du texte ordinaire, et les notations
 * reconnues. Les exposants et indices entièrement convertibles en Unicode sont
 * rendus DANS le texte (« x² »), ce qui garde la ligne compacte ; les autres
 * deviennent des segments que le composant met en petit et en hauteur.
 */
export function lireFormule(texte: string): SegmentFormule[] {
  const source = remplacerSymboles(String(texte ?? ''))
  const segments: SegmentFormule[] = []
  let dernier = 0

  const pousserTexte = (valeur: string) => {
    if (valeur.length === 0) return
    const precedent = segments[segments.length - 1]
    // On recolle les morceaux de texte voisins : sans ça, « x² puis y² »
    // deviendrait une pluie de petits segments à rendre un par un.
    if (precedent && precedent.type === 'texte') precedent.valeur += valeur
    else segments.push({ type: 'texte', valeur })
  }

  MOTIF.lastIndex = 0
  for (let m = MOTIF.exec(source); m !== null; m = MOTIF.exec(source)) {
    pousserTexte(source.slice(dernier, m.index))
    dernier = m.index + m[0].length

    const [
      ,
      baseExp,
      expAccolade,
      expNu,
      baseInd,
      indAccolade,
      indNu,
      racine,
      num,
      den,
    ] = m

    if (baseExp !== undefined) {
      const valeur = expAccolade ?? expNu ?? ''
      const unicode = versUnicode(valeur, EXPOSANTS)
      if (unicode) pousserTexte(baseExp + unicode)
      else segments.push({ type: 'exposant', base: baseExp, valeur })
    } else if (baseInd !== undefined) {
      const valeur = indAccolade ?? indNu ?? ''
      const unicode = versUnicode(valeur, INDICES)
      if (unicode) pousserTexte(baseInd + unicode)
      else segments.push({ type: 'indice', base: baseInd, valeur })
    } else if (racine !== undefined) {
      segments.push({ type: 'racine', valeur: racine })
    } else if (num !== undefined && den !== undefined) {
      segments.push({ type: 'fraction', numerateur: num, denominateur: den })
    }
  }
  pousserTexte(source.slice(dernier))

  return segments
}

/**
 * Le texte « à plat » d'une formule — pour les résumés de liste, la recherche
 * et la lecture à voix haute, où une fraction en pile n'a pas de sens.
 */
export function formuleEnTexte(texte: string): string {
  return lireFormule(texte)
    .map((s) => {
      if (s.type === 'texte') return s.valeur
      if (s.type === 'exposant') return `${s.base}^${s.valeur}`
      if (s.type === 'indice') return `${s.base}_${s.valeur}`
      if (s.type === 'racine') return `√${s.valeur}`
      return `${s.numerateur}/${s.denominateur}`
    })
    .join('')
}

/** Y a-t-il quelque chose à mettre en forme ? (sinon on rend du texte brut) */
export function contientFormule(texte: string): boolean {
  return lireFormule(texte).some((s) => s.type !== 'texte')
}
