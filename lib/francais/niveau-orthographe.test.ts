import { describe, it, expect } from 'vitest'
import {
  bilanDe,
  PALIERS,
  QUESTIONS,
  SEUIL_PALIER,
  TROU,
  verdictNiveau,
  type Reponse,
} from '@/lib/francais/niveau-orthographe'

// Ce que ces tests gardent :
//   1. la BANQUE est saine — chaque question a un trou, une bonne réponse qui
//      existe, des propositions distinctes, et les paliers sont équilibrés ;
//   2. le NIVEAU est cumulatif — on ne saute pas les fondamentaux ;
//   3. « Je ne sais pas » compte zéro au score MAIS se distingue d'une erreur.
//      C'est toute la raison d'être de cette quatrième porte : sans elle, le
//      test mesure la chance.

/** Un jeu de réponses : `correct` aux questions du palier visé, faux ailleurs. */
const repondJuste = (paliers: readonly string[]): Reponse[] =>
  QUESTIONS.map((q) =>
    paliers.includes(q.palier) ? q.correct : (q.correct + 1) % q.options.length,
  )

const toutJuste = (): Reponse[] => QUESTIONS.map((q) => q.correct)

describe('la banque des 9 questions', () => {
  it('pose exactement 3 questions par palier', () => {
    for (const p of PALIERS) {
      expect(QUESTIONS.filter((q) => q.palier === p)).toHaveLength(3)
    }
    expect(QUESTIONS).toHaveLength(9)
  })

  it('n’enchaîne jamais trois questions du même palier', () => {
    // Le test ne doit pas monter en difficulté : entrelacé, l'élève ne peut
    // pas lire sa propre courbe et se décourager en cours de route.
    for (let i = 0; i + 2 < QUESTIONS.length; i++) {
      const trois = new Set([
        QUESTIONS[i].palier,
        QUESTIONS[i + 1].palier,
        QUESTIONS[i + 2].palier,
      ])
      expect(trois.size).toBeGreaterThan(1)
    }
  })

  it('porte un trou, une bonne réponse valide et des propositions distinctes', () => {
    for (const q of QUESTIONS) {
      expect(q.phrase).toContain(TROU)
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(q.options.length)
      // Deux propositions identiques rendraient la question insoluble.
      expect(new Set(q.options).size).toBe(q.options.length)
      // Chaque règle ratée est rendue à l'élève : elle doit être nommée.
      expect(q.regle.length).toBeGreaterThan(0)
      expect(q.astuce.length).toBeGreaterThan(0)
    }
  })

  it('n’écrit jamais « Je ne sais pas » dans les propositions', () => {
    // La quatrième porte est ajoutée par la vue, à la même place partout.
    for (const q of QUESTIONS) {
      expect(q.options.some((o) => /je ne sais pas/i.test(o))).toBe(false)
    }
  })

  it('donne des identifiants uniques', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })
})

describe('bilanDe', () => {
  it('compte le sans-faute à 100 % et le classe expert', () => {
    const b = bilanDe(toutJuste())
    expect(b.score).toBe(9)
    expect(b.pourcentage).toBe(100)
    expect(b.niveau).toBe('expert')
    expect(b.aTravailler).toHaveLength(0)
  })

  it('rend le niveau CUMULATIF : pas d’expert sans les fondamentaux', () => {
    // Toutes les règles pointues justes, les bases ratées : ce n'est pas un
    // expert, c'est quelqu'un qui a eu de la chance sur trois questions.
    const b = bilanDe(repondJuste(['expert', 'confirme']))
    expect(b.parPalier.expert.bonnes).toBe(3)
    expect(b.niveau).toBeNull()
  })

  it('s’arrête au premier palier qui ne tient pas', () => {
    const b = bilanDe(repondJuste(['fondamentaux', 'expert']))
    expect(b.parPalier.fondamentaux.bonnes).toBe(3)
    expect(b.parPalier.expert.bonnes).toBe(3)
    // « confirmé » manque : on ne va pas plus haut que « fondamentaux ».
    expect(b.niveau).toBe('fondamentaux')
  })

  it('valide un palier à 2 sur 3 — une étourderie ne fait pas rétrograder', () => {
    const reponses = toutJuste()
    const premierFondamental = QUESTIONS.findIndex(
      (q) => q.palier === 'fondamentaux',
    )
    reponses[premierFondamental] = null
    const b = bilanDe(reponses)
    expect(b.parPalier.fondamentaux.bonnes).toBe(SEUIL_PALIER)
    expect(b.niveau).toBe('expert')
  })

  it('distingue le trou de la croyance fausse', () => {
    const q0 = QUESTIONS[0]
    const faux = (q0.correct + 1) % q0.options.length

    const ignore = bilanDe([null, ...toutJuste().slice(1)])
    const trompe = bilanDe([faux, ...toutJuste().slice(1)])

    // Même score : le pourcentage dit le niveau, pas l'honnêteté.
    expect(ignore.score).toBe(trompe.score)
    // Mais le bilan ne les confond pas — ils n'appellent pas le même travail.
    expect(ignore.sansReponse).toBe(1)
    expect(trompe.sansReponse).toBe(0)
    // Dans les deux cas la règle part au programme de travail.
    expect(ignore.aTravailler.map((q) => q.id)).toEqual([q0.id])
    expect(trompe.aTravailler.map((q) => q.id)).toEqual([q0.id])
  })

  it('traite une question non répondue comme un « je ne sais pas »', () => {
    // Test abandonné en cours de route : le tableau est plus court.
    const b = bilanDe([])
    expect(b.score).toBe(0)
    expect(b.sansReponse).toBe(9)
    expect(b.niveau).toBeNull()
    expect(b.aTravailler).toHaveLength(9)
  })

  it('rend les règles ratées dans l’ordre du test', () => {
    const b = bilanDe(repondJuste(['fondamentaux']))
    const attendus = QUESTIONS.filter((q) => q.palier !== 'fondamentaux').map(
      (q) => q.id,
    )
    expect(b.aTravailler.map((q) => q.id)).toEqual(attendus)
  })
})

describe('verdictNiveau', () => {
  it('donne un mot pour chaque palier, y compris le plus bas', () => {
    const vus = new Set<string>()
    for (const reponses of [
      toutJuste(),
      repondJuste(['fondamentaux', 'confirme']),
      repondJuste(['fondamentaux']),
      repondJuste([]),
    ]) {
      const v = verdictNiveau(bilanDe(reponses))
      expect(v.titre.length).toBeGreaterThan(0)
      expect(v.message.length).toBeGreaterThan(0)
      vus.add(v.titre)
    }
    // Quatre situations, quatre messages distincts.
    expect(vus.size).toBe(4)
  })
})
