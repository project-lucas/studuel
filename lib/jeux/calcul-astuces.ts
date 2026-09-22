// Les ASTUCES de calcul mental — la méthode la plus rapide pour CETTE
// opération, écrite avec ses nombres, en ÉTAPES.
//
// POURQUOI. Le jeu Calcul mental corrigeait (« 48 × 7 = 336. ») sans jamais
// dire COMMENT on va vite : sur les quatorze familles d'opérations servies,
// quatre seulement portaient un conseil, et les tables, additions et
// soustractions — le cœur du jeu — n'en avaient aucun. Or ce que l'élève
// vient chercher dans un jeu de vitesse, c'est précisément la vitesse ; et
// elle s'apprend : ×5 c'est ×10 puis la moitié, 47 + 29 c'est 47 + 30 − 1,
// 7 × 8 se retrouve en passant par 5 × 8. Ce sont les procédures du programme
// (compléments à 10, doubles et moitiés, distributivité, point d'appui 5,
// passage par la dizaine), que Mathador et Calculatice enseignent, et qu'aucun
// jeu de l'app ne disait.
//
// L'EXEMPLE D'ABORD, LA RÈGLE ENSUITE (Lucas, 22/09/2026). Une astuce se lit
// comme une chaîne de petits calculs — « 63 − 30 = 33 » puis « 33 + 1 = 34 » —
// et non comme une phrase : les étapes sont donc STRUCTURÉES (`etapes`), pour
// que l'écran les pose en chips avec une flèche entre chacune, et que la règle
// en toutes lettres vienne après, quand l'exemple a déjà tout montré.
//
// Deux usages : la ligne d'astuce sous la correction (`astucePour` +
// `astuceTexte`, avec les nombres de l'opération jouée) et le catalogue des
// méthodes (`ASTUCES_CATALOGUE`, un exemple par méthode, pour le dojo de la
// carte du jeu). Pur : aucune graine, aucun état. Testé.

/** La forme d'une opération, telle que `lib/jeux/calcul-mental` la tire. */
export type OperationSpec =
  | { kind: 'add'; a: number; b: number }
  | { kind: 'sub'; a: number; b: number }
  | { kind: 'mul'; a: number; b: number }
  | { kind: 'pct'; p: number; n: number }
  | { kind: 'prio'; a: number; b: number; c: number }
  | { kind: 'double'; a: number; b: number; c: number; d: number }

/** L'expression telle qu'elle s'affiche : « 48 × 7 », « 25 % de 80 », « 7 + 6 × 4 ». */
export function operationLabel(op: OperationSpec): string {
  switch (op.kind) {
    case 'add':
      return `${op.a} + ${op.b}`
    case 'sub':
      return `${op.a} − ${op.b}`
    case 'mul':
      return `${op.a} × ${op.b}`
    case 'pct':
      return `${op.p} % de ${op.n}`
    case 'prio':
      return `${op.a} + ${op.b} × ${op.c}`
    case 'double':
      return `${op.a} × ${op.b} + ${op.c} × ${op.d}`
  }
}

export function operationResultat(op: OperationSpec): number {
  switch (op.kind) {
    case 'add':
      return op.a + op.b
    case 'sub':
      return op.a - op.b
    case 'mul':
      return op.a * op.b
    case 'pct':
      return (op.n * op.p) / 100
    case 'prio':
      return op.a + op.b * op.c
    case 'double':
      return op.a * op.b + op.c * op.d
  }
}

export type Astuce = {
  /** L'identifiant de la MÉTHODE (partagé par toutes les opérations qui l'appellent). */
  id: AstuceId
  /** Le nom court de la méthode : « ×5 : ×10 puis la moitié ». */
  titre: string
  /**
   * La méthode appliquée AUX NOMBRES de l'opération, une étape par calcul :
   * ['28 × 10 = 280', '280 ÷ 2 = 140']. La dernière étape se termine par le
   * résultat — un test le vérifie sur des centaines d'opérations.
   */
  etapes: string[]
}

export type AstuceId =
  | 'x10'
  | 'x5'
  | 'x9'
  | 'x11-chiffre'
  | 'x11-deux-chiffres'
  | 'x12'
  | 'x15'
  | 'x25'
  | 'double'
  | 'double-double'
  | 'triple-double'
  | 'appui-5'
  | 'x3'
  | 'decoupe-dizaines'
  | 'add-arrondi'
  | 'add-complement'
  | 'add-dizaine-ronde'
  | 'add-par-blocs'
  | 'sub-arrondi'
  | 'sub-compte-en-avant'
  | 'sub-par-blocs'
  | 'sub-passe-par-10'
  | 'pct-10'
  | 'pct-50'
  | 'pct-25'
  | 'pct-75'
  | 'pct-20'
  | 'pct-15'
  | 'pct-5'
  | 'pct-par-10'
  | 'pct-complement'
  | 'priorite'
  | 'double-operation'

const unites = (n: number) => n % 10

/** Le nombre de chiffres, pour distinguer un « 7 » d'un « 47 ». */
const chiffres = (n: number) => String(Math.abs(n)).length

const astuce = (id: AstuceId, titre: string, etapes: string[]): Astuce => ({ id, titre, etapes })

// --- Multiplication ----------------------------------------------------------

/**
 * Les facteurs remarquables, du plus spécifique au plus banal : 2 × 10 se
 * retient par ×10, pas par « le double ». Les petits multiplicateurs (3, 4, 8)
 * passent APRÈS le point d'appui 5 : 7 × 8 s'apprend par 5 × 8, doubler trois
 * fois est la méthode de 8 × 13, pas celle des tables.
 */
const FACTEURS_FORTS = [10, 25, 15, 12, 11, 9, 5, 2] as const
const FACTEURS_DOUX = [3, 4, 8] as const

function astuceMul(a: number, b: number): Astuce | null {
  for (const f of FACTEURS_FORTS) {
    if (a === f) return parFacteur(f, b)
    if (b === f) return parFacteur(f, a)
  }
  const appui = appui5(a, b) ?? appui5(b, a)
  if (appui) return appui
  for (const f of FACTEURS_DOUX) {
    if (a === f) return parFacteur(f, b)
    if (b === f) return parFacteur(f, a)
  }
  return deuxChiffresParDeuxChiffres(a, b)
}

/** Astuce quand `f` est un facteur remarquable et `n` l'autre facteur. */
function parFacteur(f: number, n: number): Astuce | null {
  switch (f) {
    case 10:
      return astuce('x10', '×10 : ajoute un 0', [`${n} × 10 = ${n}0`])
    case 5:
      return astuce('x5', '×5 : ×10 puis la moitié', [`${n} × 10 = ${n * 10}`, `${n * 10} ÷ 2 = ${n * 5}`])
    case 9:
      return astuce('x9', '×9 : ×10 moins une fois', [`${n} × 10 = ${n * 10}`, `${n * 10} − ${n} = ${n * 9}`])
    case 11:
      if (chiffres(n) === 1) {
        return astuce('x11-chiffre', '×11 : le chiffre deux fois', [`${n} → ${n}${n}`])
      }
      if (chiffres(n) === 2) {
        const d = Math.floor(n / 10)
        const u = unites(n)
        const s = d + u
        return astuce(
          'x11-deux-chiffres',
          '×11 : la somme des chiffres au milieu',
          s < 10
            ? [`${d} + ${u} = ${s}`, `${d} ${s} ${u} → ${n * 11}`]
            : [`${d} + ${u} = ${s}`, `(${d}+1) ${s % 10} ${u} → ${n * 11}`],
        )
      }
      return null
    case 12:
      return astuce('x12', '×12 : ×10 plus ×2', [
        `${n} × 10 = ${n * 10}`,
        `${n} × 2 = ${n * 2}`,
        `${n * 10} + ${n * 2} = ${n * 12}`,
      ])
    case 15:
      return astuce('x15', '×15 : ×10 plus la moitié', [
        `${n} × 10 = ${n * 10}`,
        `${n * 10} ÷ 2 = ${n * 5}`,
        `${n * 10} + ${n * 5} = ${n * 15}`,
      ])
    case 25:
      return astuce('x25', '×25 : ×100 puis ÷ 4', [`${n} × 100 = ${n * 100}`, `${n * 100} ÷ 4 = ${n * 25}`])
    case 2:
      return astuce('double', '×2 : le double', [`${n} + ${n} = ${n * 2}`])
    case 4:
      return astuce('double-double', '×4 : double, puis double', [`${n} × 2 = ${n * 2}`, `${n * 2} × 2 = ${n * 4}`])
    case 8:
      return astuce('triple-double', '×8 : double trois fois', [
        `${n} × 2 = ${n * 2}`,
        `${n * 2} × 2 = ${n * 4}`,
        `${n * 4} × 2 = ${n * 8}`,
      ])
    case 3:
      return astuce('x3', '×3 : le double plus une fois', [`${n} × 2 = ${n * 2}`, `${n * 2} + ${n} = ${n * 3}`])
    default:
      return null
  }
}

/** 17 × 14 : on découpe le second en 10 + 4. */
function deuxChiffresParDeuxChiffres(a: number, b: number): Astuce | null {
  if (chiffres(a) !== 2 || chiffres(b) !== 2) return null
  // Le facteur le plus proche de 10 est celui qu'on découpe.
  const [g, p] = a - 10 <= b - 10 ? [b, a] : [a, b]
  const reste = p - 10
  return astuce('decoupe-dizaines', 'Découpe en 10 + le reste', [
    `${g} × 10 = ${g * 10}`,
    `${g} × ${reste} = ${g * reste}`,
    `${g * 10} + ${g * reste} = ${a * b}`,
  ])
}

/** 7 × 8 : on passe par 5 × 8, que tout le monde connaît. Les faits de table
 *  difficiles seulement (6, 7, 8 × un nombre de 6 à 12) : 4 × 7 se double. */
function appui5(f: number, n: number): Astuce | null {
  if (f < 6 || f > 8 || n < 6 || n > 12) return null
  const reste = f - 5
  return astuce('appui-5', `×${f} : passe par ×5`, [
    `5 × ${n} = ${5 * n}`,
    `${reste} × ${n} = ${reste * n}`,
    `${5 * n} + ${reste * n} = ${f * n}`,
  ])
}

// --- Addition ----------------------------------------------------------------

function astuceAdd(a: number, b: number): Astuce | null {
  // Le second terme finit par 8 ou 9 : on arrondit, puis on rend la monnaie.
  const arrondi = (x: number, y: number): Astuce | null => {
    const u = unites(y)
    if (y < 10 || (u !== 9 && u !== 8)) return null
    const r = 10 - u
    return astuce('add-arrondi', `+${y} : +${y + r} puis −${r}`, [
      `${x} + ${y + r} = ${x + y + r}`,
      `${x + y + r} − ${r} = ${x + y}`,
    ])
  }
  const parArrondi = arrondi(a, b) ?? arrondi(b, a)
  if (parArrondi) return parArrondi

  // Les unités se complètent à 10 : 37 + 43.
  if (a >= 10 && b >= 10 && unites(a) + unites(b) === 10 && unites(a) !== 0) {
    const da = a - unites(a)
    const db = b - unites(b)
    return astuce('add-complement', 'Complément à 10', [
      `${unites(a)} + ${unites(b)} = 10`,
      `${da} + ${db} = ${da + db}`,
      `${da + db} + 10 = ${a + b}`,
    ])
  }

  // Avec retenue : on va d'abord à la dizaine ronde. 46 + 35 : 46 + 4 = 50, + 31.
  if (a >= 10 && b >= 10 && unites(a) + unites(b) > 10 && unites(a) >= 5) {
    const r = 10 - unites(a)
    return astuce('add-dizaine-ronde', 'Va à la dizaine ronde', [
      `${a} + ${r} = ${a + r}`,
      `${a + r} + ${b - r} = ${a + b}`,
    ])
  }

  // Par blocs : dizaines (ou centaines) ensemble, unités ensemble.
  if (a >= 10 && b >= 10) {
    const bloc = a >= 100 && b >= 100 ? 100 : 10
    const ha = a - (a % bloc)
    const hb = b - (b % bloc)
    const ra = a % bloc
    const rb = b % bloc
    return astuce('add-par-blocs', bloc === 100 ? 'Centaines, puis le reste' : 'Dizaines, puis unités', [
      `${ha} + ${hb} = ${ha + hb}`,
      `${ra} + ${rb} = ${ra + rb}`,
      `${ha + hb} + ${ra + rb} = ${a + b}`,
    ])
  }
  return null
}

// --- Soustraction ------------------------------------------------------------

function astuceSub(a: number, b: number): Astuce | null {
  const u = unites(b)
  // −29 : on enlève 30, on rend 1.
  if (b >= 10 && (u === 9 || u === 8)) {
    const r = 10 - u
    return astuce('sub-arrondi', `−${b} : −${b + r} puis +${r}`, [
      `${a} − ${b + r} = ${a - b - r}`,
      `${a - b - r} + ${r} = ${a - b}`,
    ])
  }
  // Petit écart, ou emprunt : on COMPTE EN AVANT depuis le plus petit.
  if (b >= 10 && (a - b <= 20 || unites(b) > unites(a))) {
    const dizaine = b - unites(b) + 10
    if (dizaine <= a) {
      const pas1 = dizaine - b
      const pas2 = a - dizaine
      return astuce('sub-compte-en-avant', 'Compte en avant', [
        `${b} → ${dizaine} : ${pas1}`,
        `${dizaine} → ${a} : ${pas2}`,
        `${pas1} + ${pas2} = ${pas1 + pas2}`,
      ])
    }
  }
  // Sous 20 : on passe par 10.
  if (a <= 20 && b < 10 && a - b < 10 && a > 10) {
    const pas1 = a - 10
    return astuce('sub-passe-par-10', 'Passe par 10', [
      `${a} − ${pas1} = 10`,
      `10 − ${b - pas1} = ${a - b}`,
    ])
  }
  // Par blocs : les dizaines d'abord, puis les unités.
  if (b >= 10) {
    const db = b - unites(b)
    return astuce('sub-par-blocs', 'Dizaines d’abord, puis unités', [
      `${a} − ${db} = ${a - db}`,
      `${a - db} − ${unites(b)} = ${a - b}`,
    ])
  }
  return null
}

// --- Pourcentages ------------------------------------------------------------

function astucePct(p: number, n: number): Astuce | null {
  const dix = n / 10
  switch (p) {
    case 10:
      return astuce('pct-10', '10 % : ÷ 10', [`${n} ÷ 10 = ${dix}`])
    case 50:
      return astuce('pct-50', '50 % : la moitié', [`${n} ÷ 2 = ${n / 2}`])
    case 25:
      return astuce('pct-25', '25 % : la moitié de la moitié', [`${n} ÷ 2 = ${n / 2}`, `${n / 2} ÷ 2 = ${n / 4}`])
    case 75:
      return astuce('pct-75', '75 % : tout moins un quart', [`${n} ÷ 4 = ${n / 4}`, `${n} − ${n / 4} = ${(n * 3) / 4}`])
    case 20:
      return astuce('pct-20', '20 % : ÷ 5 (deux fois 10 %)', [`${n} ÷ 5 = ${n / 5}`])
    case 15:
      return astuce('pct-15', '15 % : 10 % plus la moitié', [
        `10 % = ${dix}`,
        `5 % = ${dix / 2}`,
        `${dix} + ${dix / 2} = ${dix * 1.5}`,
      ])
    case 5:
      return astuce('pct-5', '5 % : la moitié de 10 %', [`10 % = ${dix}`, `${dix} ÷ 2 = ${dix / 2}`])
    default:
      break
  }
  // Au-dessus de 50 : plus court de retirer le complément.
  if (p > 50 && p < 100) {
    const c = 100 - p
    return astuce('pct-complement', `${p} % : tout moins ${c} %`, [
      `${c} % de ${n} = ${(n * c) / 100}`,
      `${n} − ${(n * c) / 100} = ${(n * p) / 100}`,
    ])
  }
  // Sinon : 10 %, puis on multiplie.
  return astuce('pct-par-10', 'Pars de 10 %', [`10 % = ${dix}`, `${dix} × ${p / 10} = ${(n * p) / 100}`])
}

// --- Le point d'entrée --------------------------------------------------------

/** L'astuce la plus rapide pour cette opération, ou null s'il n'y en a pas. */
export function astucePour(op: OperationSpec): Astuce | null {
  switch (op.kind) {
    case 'add':
      return astuceAdd(op.a, op.b)
    case 'sub':
      return astuceSub(op.a, op.b)
    case 'mul':
      return astuceMul(op.a, op.b)
    case 'pct':
      return astucePct(op.p, op.n)
    case 'prio':
      return astuce('priorite', 'La × avant le +', [
        `${op.b} × ${op.c} = ${op.b * op.c}`,
        `${op.a} + ${op.b * op.c} = ${op.a + op.b * op.c}`,
      ])
    case 'double':
      return astuce('double-operation', 'Les deux produits, puis la somme', [
        `${op.a} × ${op.b} = ${op.a * op.b}`,
        `${op.c} × ${op.d} = ${op.c * op.d}`,
        `${op.a * op.b} + ${op.c * op.d} = ${op.a * op.b + op.c * op.d}`,
      ])
    default:
      return null
  }
}

/** « ×5 : ×10 puis la moitié — 28 × 10 = 280 · 280 ÷ 2 = 140 » (la ligne en partie). */
export function astuceTexte(astuce: Astuce): string {
  return `${astuce.titre} — ${astuce.etapes.join(' · ')}`
}

// --- Le catalogue, pour le dojo ---------------------------------------------

export type AstuceFiche = {
  id: AstuceId
  titre: string
  /** L'opération de l'exemple, telle qu'elle s'affiche : « 63 − 29 ». */
  operation: string
  resultat: number
  /** Les étapes de l'exemple, calculées par le même code que le jeu. */
  etapes: string[]
  /** La règle, sans nombres — lue APRÈS l'exemple. */
  regle: string
  /** Où on la rencontre dans le jeu. */
  famille: 'Tables' | 'Additions' | 'Soustractions' | 'Pourcentages' | 'Priorités'
}

function fiche(famille: AstuceFiche['famille'], regle: string, op: OperationSpec): AstuceFiche {
  const a = astucePour(op)
  if (!a) throw new Error(`astuce absente pour ${JSON.stringify(op)}`)
  return {
    id: a.id,
    titre: a.titre,
    operation: operationLabel(op),
    resultat: operationResultat(op),
    etapes: a.etapes,
    regle,
    famille,
  }
}

/**
 * Toutes les méthodes, une fois chacune, avec un exemple calculé par le même
 * code que le jeu — le dojo ne peut donc pas dire autre chose que la partie.
 */
export const ASTUCES_CATALOGUE: readonly AstuceFiche[] = [
  fiche('Tables', 'Multiplier par 10, c’est écrire un 0 à la fin.', { kind: 'mul', a: 7, b: 10 }),
  fiche('Tables', 'Multiplier par 5 : multiplie par 10, puis prends la moitié.', { kind: 'mul', a: 28, b: 5 }),
  fiche('Tables', 'Multiplier par 9 : multiplie par 10, puis enlève une fois le nombre.', { kind: 'mul', a: 9, b: 7 }),
  fiche('Tables', 'Un chiffre × 11 : écris-le deux fois.', { kind: 'mul', a: 11, b: 7 }),
  fiche('Tables', 'Deux chiffres × 11 : mets la somme des deux chiffres au milieu.', { kind: 'mul', a: 36, b: 11 }),
  fiche('Tables', 'Multiplier par 12 : ×10, plus ×2.', { kind: 'mul', a: 12, b: 7 }),
  fiche('Tables', 'Multiplier par 15 : ×10, plus la moitié.', { kind: 'mul', a: 15, b: 8 }),
  fiche('Tables', 'Multiplier par 25 : ×100, puis divise par 4.', { kind: 'mul', a: 25, b: 8 }),
  fiche('Tables', 'Multiplier par 2, c’est doubler.', { kind: 'mul', a: 2, b: 7 }),
  fiche('Tables', 'Multiplier par 4 : double, puis double encore.', { kind: 'mul', a: 4, b: 7 }),
  fiche('Tables', 'Multiplier par 8 : double trois fois.', { kind: 'mul', a: 8, b: 13 }),
  fiche('Tables', 'Multiplier par 3 : le double, plus une fois.', { kind: 'mul', a: 3, b: 8 }),
  fiche('Tables', 'Les tables de 6, 7 et 8 : passe par 5, puis ajoute le reste.', { kind: 'mul', a: 7, b: 8 }),
  fiche('Tables', 'Deux nombres à deux chiffres : découpe l’un en 10 + le reste.', { kind: 'mul', a: 17, b: 14 }),
  fiche('Additions', 'Le nombre finit par 8 ou 9 : arrondis à la dizaine, puis rends la différence.', { kind: 'add', a: 47, b: 29 }),
  fiche('Additions', 'Les unités se complètent à 10 : additionne-les d’abord.', { kind: 'add', a: 37, b: 43 }),
  fiche('Additions', 'Avec retenue : va d’abord à la dizaine ronde.', { kind: 'add', a: 46, b: 35 }),
  fiche('Additions', 'Dizaines ensemble, unités ensemble.', { kind: 'add', a: 42, b: 31 }),
  fiche('Soustractions', 'Enlever 29, c’est enlever 30 et rendre 1.', { kind: 'sub', a: 63, b: 29 }),
  fiche('Soustractions', 'Petit écart ou emprunt : compte en avant depuis le plus petit.', { kind: 'sub', a: 52, b: 37 }),
  fiche('Soustractions', 'Sous 20 : passe par 10.', { kind: 'sub', a: 15, b: 8 }),
  fiche('Soustractions', 'Enlève les dizaines, puis les unités.', { kind: 'sub', a: 74, b: 21 }),
  fiche('Pourcentages', '10 %, c’est diviser par 10.', { kind: 'pct', p: 10, n: 80 }),
  fiche('Pourcentages', '50 %, c’est la moitié.', { kind: 'pct', p: 50, n: 80 }),
  fiche('Pourcentages', '25 %, c’est la moitié de la moitié.', { kind: 'pct', p: 25, n: 80 }),
  fiche('Pourcentages', '75 %, c’est tout moins un quart.', { kind: 'pct', p: 75, n: 80 }),
  fiche('Pourcentages', '20 %, c’est diviser par 5.', { kind: 'pct', p: 20, n: 80 }),
  fiche('Pourcentages', '15 %, c’est 10 % plus la moitié de 10 %.', { kind: 'pct', p: 15, n: 80 }),
  fiche('Pourcentages', 'Plus de 50 % : enlève le complément.', { kind: 'pct', p: 60, n: 80 }),
  fiche('Pourcentages', 'Un pourcentage quelconque : pars de 10 % et multiplie.', { kind: 'pct', p: 30, n: 80 }),
  fiche('Priorités', 'La multiplication passe avant l’addition.', { kind: 'prio', a: 7, b: 6, c: 4 }),
  fiche('Priorités', 'Deux produits à additionner : chaque produit d’abord.', { kind: 'double', a: 3, b: 4, c: 5, d: 6 }),
]
