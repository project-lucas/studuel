import { describe, expect, it } from 'vitest'
import {
  foldBestByQuiz,
  parseMasteryInputs,
  type SessionRow,
} from './mastery-inputs'

describe('foldBestByQuiz — le repli JavaScript', () => {
  it('garde le MEILLEUR essai de chaque quiz', () => {
    const rows: SessionRow[] = [
      { quiz_id: 'q1', score: 4, total: 10 },
      { quiz_id: 'q1', score: 9, total: 10 },
      { quiz_id: 'q1', score: 6, total: 10 },
    ]
    expect(foldBestByQuiz(rows).get('q1')).toBeCloseTo(0.9)
  })

  it('écrête un score supérieur au total', () => {
    // Arrivé pour de vrai : un total corrigé après coup. Sans écrêtage, la
    // maîtrise dépasserait son maximum et l'élève recevrait une couronne que
    // rien ne lui expliquerait.
    expect(
      foldBestByQuiz([{ quiz_id: 'q1', score: 12, total: 10 }]).get('q1'),
    ).toBe(1)
  })

  it('ignore les sessions sans quiz', () => {
    // File « À revoir » et examen blanc : elles ne se rattachent à aucun
    // chapitre, les compter fausserait la maîtrise de tous.
    expect(foldBestByQuiz([{ quiz_id: null, score: 8, total: 10 }]).size).toBe(0)
  })

  it('ignore un total nul ou négatif plutôt que de diviser par zéro', () => {
    const best = foldBestByQuiz([
      { quiz_id: 'q1', score: 3, total: 0 },
      { quiz_id: 'q2', score: 3, total: -5 },
    ])
    expect(best.size).toBe(0)
  })

  it('rend une carte vide sur null ou undefined', () => {
    expect(foldBestByQuiz(null).size).toBe(0)
    expect(foldBestByQuiz(undefined).size).toBe(0)
  })
})

describe('parseMasteryInputs — le JSON de la RPC', () => {
  const payload = {
    best_per_quiz: [
      { quiz_id: 'q1', ratio: 0.9 },
      { quiz_id: 'q2', ratio: 1 },
    ],
    completed_lessons: ['l1', 'l2'],
  }

  it('lit les deux entrées', () => {
    const r = parseMasteryInputs(payload)
    expect(r.bestByQuiz.get('q1')).toBeCloseTo(0.9)
    expect(r.bestByQuiz.get('q2')).toBe(1)
    expect([...r.completedLessons]).toEqual(['l1', 'l2'])
  })

  it('rend le MÊME résultat que le repli sur les mêmes données', () => {
    // L'invariant qui compte : l'agrégat SQL et la boucle JavaScript sont deux
    // chemins vers la même vérité. S'ils divergent, la maîtrise d'un élève
    // change selon qu'une migration est passée ou non — un bug invisible.
    const rows: SessionRow[] = [
      { quiz_id: 'q1', score: 4, total: 10 },
      { quiz_id: 'q1', score: 9, total: 10 },
      { quiz_id: 'q2', score: 12, total: 10 },
      { quiz_id: null, score: 8, total: 10 },
    ]
    const parRepli = foldBestByQuiz(rows)
    // Ce que la 321 rendrait pour ces mêmes lignes.
    const parSql = parseMasteryInputs({
      best_per_quiz: [
        { quiz_id: 'q1', ratio: 0.9 },
        { quiz_id: 'q2', ratio: 1 },
      ],
      completed_lessons: [],
    }).bestByQuiz

    expect([...parSql.entries()].sort()).toEqual([...parRepli.entries()].sort())
  })

  it('accepte un ratio rendu en CHAÎNE (numeric de PostgREST)', () => {
    // `numeric` traverse PostgREST en chaîne pour ne pas perdre de précision :
    // le lire avec `typeof === number` aurait vidé toute la maîtrise en prod
    // sans faire échouer un seul test.
    const r = parseMasteryInputs({
      best_per_quiz: [{ quiz_id: 'q1', ratio: '0.85' }],
      completed_lessons: [],
    })
    expect(r.bestByQuiz.get('q1')).toBeCloseTo(0.85)
  })

  it('ignore une entrée illisible sans perdre les autres', () => {
    const r = parseMasteryInputs({
      best_per_quiz: [
        { quiz_id: 'q1', ratio: 0.5 },
        { quiz_id: '', ratio: 0.9 },
        { quiz_id: 'q3', ratio: 'plouf' },
        null,
        { quiz_id: 'q4', ratio: 0.7 },
      ],
      completed_lessons: ['l1', '', null, 42],
    })
    expect([...r.bestByQuiz.keys()]).toEqual(['q1', 'q4'])
    expect([...r.completedLessons]).toEqual(['l1'])
  })

  it('ne transforme JAMAIS un ratio illisible en zéro', () => {
    // Zéro veut dire « raté ». Afficher « raté » sur un chapitre réussi est
    // pire que de ne rien afficher du tout.
    const r = parseMasteryInputs({
      best_per_quiz: [{ quiz_id: 'q1', ratio: null }],
      completed_lessons: [],
    })
    expect(r.bestByQuiz.has('q1')).toBe(false)
  })

  it('borne le ratio à 0..1', () => {
    const r = parseMasteryInputs({
      best_per_quiz: [
        { quiz_id: 'haut', ratio: 4 },
        { quiz_id: 'bas', ratio: -1 },
      ],
      completed_lessons: [],
    })
    expect(r.bestByQuiz.get('haut')).toBe(1)
    expect(r.bestByQuiz.get('bas')).toBe(0)
  })

  it('survit à un payload absent ou de mauvaise forme', () => {
    for (const raw of [null, undefined, 42, 'texte', [], {}]) {
      const r = parseMasteryInputs(raw)
      expect(r.bestByQuiz.size).toBe(0)
      expect(r.completedLessons.size).toBe(0)
    }
  })
})
