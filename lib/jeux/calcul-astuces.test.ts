import { describe, expect, it } from 'vitest'
import {
  ASTUCES_CATALOGUE,
  astucePour,
  astuceTexte,
  operationLabel,
  operationResultat,
  type OperationSpec,
} from './calcul-astuces'

function dernierNombre(texte: string): number {
  const nombres = texte.match(/\d+(?:[.,]\d+)?/g) ?? []
  return Number(nombres[nombres.length - 1]?.replace(',', '.'))
}

describe('astucePour — les tables', () => {
  it('×5 passe par ×10 puis la moitié', () => {
    const a = astucePour({ kind: 'mul', a: 28, b: 5 })
    expect(a?.id).toBe('x5')
    expect(a?.etapes).toEqual(['28 × 10 = 280', '280 ÷ 2 = 140'])
    // Commutatif : 5 × 28 donne la même astuce.
    expect(astucePour({ kind: 'mul', a: 5, b: 28 })?.id).toBe('x5')
  })

  it('×9 est ×10 moins une fois', () => {
    expect(astucePour({ kind: 'mul', a: 9, b: 7 })?.etapes).toEqual(['7 × 10 = 70', '70 − 7 = 63'])
  })

  it('×11 distingue un chiffre et deux chiffres, avec ou sans retenue', () => {
    expect(astucePour({ kind: 'mul', a: 11, b: 7 })?.etapes).toEqual(['7 → 77'])
    expect(astucePour({ kind: 'mul', a: 36, b: 11 })?.etapes).toEqual(['3 + 6 = 9', '3 9 6 → 396'])
    expect(astucePour({ kind: 'mul', a: 11, b: 78 })?.etapes).toEqual(['7 + 8 = 15', '(7+1) 5 8 → 858'])
  })

  it('×12, ×15, ×25 ont chacune leur découpe', () => {
    expect(astucePour({ kind: 'mul', a: 12, b: 7 })?.etapes).toEqual(['7 × 10 = 70', '7 × 2 = 14', '70 + 14 = 84'])
    expect(astucePour({ kind: 'mul', a: 15, b: 8 })?.etapes).toEqual(['8 × 10 = 80', '80 ÷ 2 = 40', '80 + 40 = 120'])
    expect(astucePour({ kind: 'mul', a: 25, b: 8 })?.etapes).toEqual(['8 × 100 = 800', '800 ÷ 4 = 200'])
  })

  it('×4 et ×8 doublent, ×3 double puis ajoute', () => {
    expect(astucePour({ kind: 'mul', a: 4, b: 7 })?.etapes).toEqual(['7 × 2 = 14', '14 × 2 = 28'])
    // ×8 par doublements quand l'autre facteur sort des tables ; 8 × 7, lui,
    // passe par 5 (voir plus bas).
    expect(astucePour({ kind: 'mul', a: 8, b: 13 })?.etapes).toEqual(['13 × 2 = 26', '26 × 2 = 52', '52 × 2 = 104'])
    expect(astucePour({ kind: 'mul', a: 3, b: 8 })?.etapes).toEqual(['8 × 2 = 16', '16 + 8 = 24'])
  })

  it('7 × 8 passe par 5 × 8 — le point d’appui du programme', () => {
    const a = astucePour({ kind: 'mul', a: 7, b: 8 })
    expect(a?.id).toBe('appui-5')
    expect(a?.etapes).toEqual(['5 × 8 = 40', '2 × 8 = 16', '40 + 16 = 56'])
  })

  it('le facteur remarquable prime sur le point d’appui', () => {
    // 6 × 5 : c'est ×5 qu'on retient, pas « passe par 5 ».
    expect(astucePour({ kind: 'mul', a: 6, b: 5 })?.id).toBe('x5')
  })

  it('deux nombres à deux chiffres se découpent en 10 + le reste', () => {
    const a = astucePour({ kind: 'mul', a: 17, b: 14 })
    expect(a?.id).toBe('decoupe-dizaines')
    expect(a?.etapes).toEqual(['17 × 10 = 170', '17 × 4 = 68', '170 + 68 = 238'])
  })

  it('se tait sur une table sans méthode particulière', () => {
    expect(astucePour({ kind: 'mul', a: 2, b: 10 })?.id).toBe('x10')
    expect(astucePour({ kind: 'mul', a: 13, b: 7 })).toBeNull()
  })
})

describe('astucePour — additions et soustractions', () => {
  it('arrondit un terme qui finit par 9 ou 8', () => {
    expect(astucePour({ kind: 'add', a: 47, b: 29 })?.etapes).toEqual(['47 + 30 = 77', '77 − 1 = 76'])
    expect(astucePour({ kind: 'add', a: 38, b: 25 })?.id).toBe('add-arrondi')
  })

  it('voit le complément à 10', () => {
    expect(astucePour({ kind: 'add', a: 37, b: 43 })?.etapes).toEqual(['7 + 3 = 10', '30 + 40 = 70', '70 + 10 = 80'])
  })

  it('va à la dizaine ronde quand il y a retenue', () => {
    expect(astucePour({ kind: 'add', a: 46, b: 35 })?.etapes).toEqual(['46 + 4 = 50', '50 + 31 = 81'])
  })

  it('additionne par blocs sinon', () => {
    expect(astucePour({ kind: 'add', a: 42, b: 31 })?.etapes).toEqual(['40 + 30 = 70', '2 + 1 = 3', '70 + 3 = 73'])
    expect(astucePour({ kind: 'add', a: 312, b: 247 })?.etapes).toEqual(['300 + 200 = 500', '12 + 47 = 59', '500 + 59 = 559'])
  })

  it('−29, c’est −30 puis +1', () => {
    expect(astucePour({ kind: 'sub', a: 63, b: 29 })?.etapes).toEqual(['63 − 30 = 33', '33 + 1 = 34'])
  })

  it('compte en avant sur un emprunt', () => {
    expect(astucePour({ kind: 'sub', a: 52, b: 37 })?.etapes).toEqual(['37 → 40 : 3', '40 → 52 : 12', '3 + 12 = 15'])
  })

  it('passe par 10 sous 20', () => {
    expect(astucePour({ kind: 'sub', a: 15, b: 8 })?.etapes).toEqual(['15 − 5 = 10', '10 − 3 = 7'])
  })

  it('enlève les dizaines puis les unités sinon', () => {
    expect(astucePour({ kind: 'sub', a: 74, b: 21 })?.etapes).toEqual(['74 − 20 = 54', '54 − 1 = 53'])
  })
})

describe('astucePour — pourcentages et priorités', () => {
  it('connaît les pourcentages usuels', () => {
    expect(astucePour({ kind: 'pct', p: 25, n: 80 })?.etapes).toEqual(['80 ÷ 2 = 40', '40 ÷ 2 = 20'])
    expect(astucePour({ kind: 'pct', p: 75, n: 80 })?.etapes).toEqual(['80 ÷ 4 = 20', '80 − 20 = 60'])
    expect(astucePour({ kind: 'pct', p: 15, n: 80 })?.etapes).toEqual(['10 % = 8', '5 % = 4', '8 + 4 = 12'])
  })

  it('retire le complément au-dessus de 50 %, part de 10 % sinon', () => {
    expect(astucePour({ kind: 'pct', p: 60, n: 80 })?.etapes).toEqual(['40 % de 80 = 32', '80 − 32 = 48'])
    expect(astucePour({ kind: 'pct', p: 30, n: 80 })?.etapes).toEqual(['10 % = 8', '8 × 3 = 24'])
  })

  it('rappelle la priorité et la double opération', () => {
    expect(astucePour({ kind: 'prio', a: 7, b: 6, c: 4 })?.etapes).toEqual(['6 × 4 = 24', '7 + 24 = 31'])
    expect(astucePour({ kind: 'double', a: 3, b: 4, c: 5, d: 6 })?.etapes).toEqual([
      '3 × 4 = 12',
      '5 × 6 = 30',
      '12 + 30 = 42',
    ])
  })
})

describe('les astuces sont toujours JUSTES', () => {
  const cas: OperationSpec[] = []
  for (let a = 2; a <= 25; a++) for (let b = 2; b <= 19; b++) cas.push({ kind: 'mul', a, b })
  for (let a = 11; a <= 99; a += 7) for (let b = 10; b <= 99; b += 11) cas.push({ kind: 'add', a, b })
  for (let a = 125; a <= 899; a += 97) cas.push({ kind: 'add', a, b: 247 })
  for (let a = 30; a <= 99; a += 5) for (let b = 6; b < a; b += 9) cas.push({ kind: 'sub', a, b })
  for (const a of [12, 15, 17, 20]) for (let b = 1; b < a; b += 2) cas.push({ kind: 'sub', a, b })
  for (const p of [5, 10, 15, 20, 25, 30, 35, 45, 50, 60, 65, 70, 75, 85]) cas.push({ kind: 'pct', p, n: 120 })
  cas.push({ kind: 'prio', a: 20, b: 9, c: 9 }, { kind: 'double', a: 9, b: 9, c: 12, d: 9 })

  it('la dernière étape se termine par le bon résultat', () => {
    let avec = 0
    for (const op of cas) {
      const a = astucePour(op)
      if (!a) continue
      avec++
      expect(a.etapes.length).toBeGreaterThan(0)
      const derniere = a.etapes[a.etapes.length - 1]
      expect(dernierNombre(derniere), `${operationLabel(op)} → ${derniere}`).toBe(operationResultat(op))
    }
    // La grande majorité des opérations du jeu ont une méthode.
    expect(avec / cas.length).toBeGreaterThan(0.85)
  })

  it('astuceTexte réunit le titre et les étapes', () => {
    expect(astuceTexte({ id: 'x5', titre: 'A', etapes: ['B', 'C'] })).toBe('A — B · C')
  })

  it('operationLabel écrit l’opération comme le jeu', () => {
    expect(operationLabel({ kind: 'sub', a: 63, b: 29 })).toBe('63 − 29')
    expect(operationLabel({ kind: 'pct', p: 25, n: 80 })).toBe('25 % de 80')
    expect(operationLabel({ kind: 'double', a: 3, b: 4, c: 5, d: 6 })).toBe('3 × 4 + 5 × 6')
  })
})

describe('le catalogue du dojo', () => {
  it('couvre chaque méthode une fois, avec un exemple calculé par le jeu', () => {
    const ids = ASTUCES_CATALOGUE.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.length).toBeGreaterThanOrEqual(30)
    for (const f of ASTUCES_CATALOGUE) {
      expect(f.regle.length).toBeGreaterThan(10)
      expect(f.etapes.length).toBeGreaterThan(0)
      // L'exemple est cohérent : sa dernière étape donne son résultat.
      expect(dernierNombre(f.etapes[f.etapes.length - 1]), f.operation).toBe(f.resultat)
    }
  })

  it('range les fiches par famille', () => {
    const familles = new Set(ASTUCES_CATALOGUE.map((f) => f.famille))
    expect([...familles]).toEqual(['Tables', 'Additions', 'Soustractions', 'Pourcentages', 'Priorités'])
  })
})
