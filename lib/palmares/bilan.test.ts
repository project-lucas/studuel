import { describe, expect, it } from 'vitest'
import {
  joursAvantLundi,
  mouvementEchelle,
  parseBilan,
  phraseMarche,
  phraseMouvement,
  phraseRemiseAZero,
  phraseSommet,
  phraseVerdict,
  placeDeToujours,
  prochaineMarche,
  reperesJauge,
  titreVerdict,
  verdictPartie,
} from './bilan'

const brut = {
  mode: 'blitz',
  score: 1200,
  plays: 4,
  last: 900,
  best_before: 1100,
  best: 1200,
  week_key: '2026-08-31',
  week_best_before: 900,
  week_best: 1200,
  week_rank_before: 12,
  week_total_before: 40,
  week_rank: 7,
  week_total: 41,
  all_rank: 30,
  all_total: 200,
  grade: '3e',
  next: { name: 'Léa', avatar: { seed: 'x' }, score: 1370 },
  leader: { name: 'Nour', score: 2100, is_me: false },
}

describe('parseBilan', () => {
  it('lit le JSON de record_mode_score', () => {
    const b = parseBilan(brut)
    expect(b).not.toBeNull()
    expect(b?.mode).toBe('blitz')
    expect(b?.weekRankBefore).toBe(12)
    expect(b?.weekRank).toBe(7)
    expect(b?.next?.name).toBe('Léa')
    expect(b?.next?.score).toBe(1370)
    expect(b?.leader).toEqual({ name: 'Nour', score: 2100, isMe: false })
  })

  it('rend null sur null, un tableau, un mode inconnu ou une forme tronquée', () => {
    expect(parseBilan(null)).toBeNull()
    expect(parseBilan([])).toBeNull()
    expect(parseBilan({ ...brut, mode: 'ranked' })).toBeNull()
    expect(parseBilan({ ...brut, week_rank: undefined })).toBeNull()
  })

  it('garde les nulls de la première partie', () => {
    const b = parseBilan({
      ...brut,
      last: null,
      best_before: null,
      week_best_before: null,
      week_rank_before: null,
      week_total_before: null,
      next: null,
      leader: null,
    })
    expect(b?.last).toBeNull()
    expect(b?.bestBefore).toBeNull()
    expect(b?.weekRankBefore).toBeNull()
    expect(b?.next).toBeNull()
    expect(b?.leader).toBeNull()
  })

  it('ignore un avatar mal formé sans jeter la marche', () => {
    const b = parseBilan({ ...brut, next: { name: 'Léa', avatar: 'oops', score: 1370 } })
    expect(b?.next).toEqual({ name: 'Léa', avatar: null, score: 1370 })
  })
})

describe('verdictPartie', () => {
  it('la première partie est une première', () => {
    expect(verdictPartie({ score: 500, last: null, bestBefore: null })).toEqual({
      kind: 'premiere',
    })
  })

  it('battre son record prime sur « mieux que la dernière fois »', () => {
    expect(verdictPartie({ score: 1200, last: 900, bestBefore: 1100 })).toEqual({
      kind: 'record',
      delta: 100,
    })
  })

  it('mieux que la dernière fois, sous le record', () => {
    expect(verdictPartie({ score: 1000, last: 900, bestBefore: 1100 })).toEqual({
      kind: 'mieux',
      delta: 100,
      reste: 100,
    })
  })

  it('pareil, et moins bien', () => {
    expect(verdictPartie({ score: 900, last: 900, bestBefore: 1100 })).toEqual({
      kind: 'pareil',
      reste: 200,
    })
    expect(verdictPartie({ score: 700, last: 900, bestBefore: 1100 })).toEqual({
      kind: 'moins',
      delta: 200,
      reste: 400,
    })
  })

  it('égaler son record n’est PAS un record', () => {
    expect(verdictPartie({ score: 1100, last: 900, bestBefore: 1100 }).kind).toBe('mieux')
  })
})

describe('les phrases du verdict', () => {
  it('ont un titre par cas', () => {
    expect(titreVerdict({ kind: 'premiere' })).toBe('Premier score posé !')
    expect(titreVerdict({ kind: 'record', delta: 1 })).toBe('Nouveau record !')
    expect(titreVerdict({ kind: 'mieux', delta: 1, reste: 1 })).toMatch(/Mieux/)
    expect(titreVerdict({ kind: 'moins', delta: 1, reste: 1 })).toMatch(/sous/)
  })

  it('disent de combien, et ce qui reste jusqu’au record', () => {
    expect(phraseVerdict('blitz', { kind: 'mieux', delta: 100, reste: 80 })).toBe(
      '+100 pts — encore 80 pts pour ton record.',
    )
    expect(phraseVerdict('blitz', { kind: 'moins', delta: 200, reste: 400 })).toBe(
      '−200 pts — ton record tient à 400 pts.',
    )
    expect(phraseVerdict('survie', { kind: 'record', delta: 3 })).toBe(
      '+3 d’affilée sur ton ancien record.',
    )
  })

  it('« pareil » distingue égaler son record et rester dessous', () => {
    expect(phraseVerdict('chrono', { kind: 'pareil', reste: 0 })).toMatch(/égales/)
    expect(phraseVerdict('chrono', { kind: 'pareil', reste: 2 })).toMatch(/2 bonnes réponses plus haut/)
  })
})

describe('reperesJauge', () => {
  it('place les trois repères sous le plein, le plus haut ne colle pas au bord', () => {
    const r = reperesJauge({ score: 1200, last: 900, best: 1200 })
    expect(r.score).toBeCloseTo(1 / 1.12, 3)
    expect(r.best).toBe(r.score)
    expect(r.last).toBeLessThan(r.score)
    expect(r.score).toBeLessThan(1)
  })

  it('tolère une première partie sans dernière fois', () => {
    const r = reperesJauge({ score: 500, last: null, best: 500 })
    expect(r.last).toBeNull()
    expect(r.score).toBeGreaterThan(0)
  })

  it('ne divise jamais par zéro', () => {
    const r = reperesJauge({ score: 0, last: 0, best: 0 })
    expect(r.score).toBe(0)
    expect(Number.isFinite(r.plein)).toBe(true)
  })
})

describe('mouvementEchelle', () => {
  it('entre quand il n’y avait pas de place avant', () => {
    expect(mouvementEchelle({ weekRankBefore: null, weekRank: 7, weekTotal: 41 })).toEqual({
      kind: 'entree',
      rank: 7,
      total: 41,
    })
  })

  it('monte, ou reste', () => {
    expect(mouvementEchelle({ weekRankBefore: 12, weekRank: 7, weekTotal: 41 })).toEqual({
      kind: 'monte',
      de: 12,
      a: 7,
      total: 41,
    })
    expect(mouvementEchelle({ weekRankBefore: 7, weekRank: 7, weekTotal: 41 })).toEqual({
      kind: 'stable',
      rank: 7,
      total: 41,
    })
  })

  it('ne dit jamais « tu descends » sur ta propre partie', () => {
    // D'autres ont joué entre-temps : on est passé de 5e à 6e sans démériter.
    expect(mouvementEchelle({ weekRankBefore: 5, weekRank: 6, weekTotal: 41 }).kind).toBe('stable')
  })

  it('se dit en français avec la cohorte', () => {
    expect(phraseMouvement({ kind: 'monte', de: 12, a: 7, total: 41 }, '3e')).toBe(
      '12e → 7e des 3e cette semaine.',
    )
    expect(phraseMouvement({ kind: 'monte', de: 3, a: 1, total: 41 }, '3e')).toMatch(/prends la tête/)
    expect(phraseMouvement({ kind: 'entree', rank: 1, total: 1 }, null)).toMatch(/des élèves/)
    expect(phraseMouvement({ kind: 'stable', rank: 2, total: 9 }, 'Tle')).toMatch(/Toujours 2e/)
  })
})

describe('placeDeToujours', () => {
  it('parle en rang sous 100 joueurs, en pourcentage au-dessus', () => {
    expect(placeDeToujours({ allRank: 3, allTotal: 20 })).toEqual({ kind: 'rang', rank: 3, total: 20 })
    expect(placeDeToujours({ allRank: 5, allTotal: 500 }).kind).toBe('pourcentage')
  })
})

describe('prochaineMarche', () => {
  it('dit ce qu’il manque pour dépasser le joueur du dessus', () => {
    const m = prochaineMarche({
      mode: 'blitz',
      weekBest: 1200,
      next: { name: 'Léa', avatar: null, score: 1370 },
    })
    expect(m).toEqual({ name: 'Léa', avatar: null, cible: 1370, manque: 170 })
    expect(phraseMarche('blitz', m!)).toBe('Encore 170 pts pour dépasser Léa')
  })

  it('est nulle en tête, ou si la base rend une marche déjà franchie', () => {
    expect(prochaineMarche({ mode: 'blitz', weekBest: 1200, next: null })).toBeNull()
    expect(
      prochaineMarche({ mode: 'blitz', weekBest: 1400, next: { name: 'Léa', avatar: null, score: 1370 } }),
    ).toBeNull()
  })

  it('le sommet se dit selon que c’est moi ou pas', () => {
    expect(phraseSommet('blitz', { name: 'Nour', score: 2100, isMe: false }, '3e')).toBe(
      'En tête : Nour, 2 100 pts.',
    )
    expect(phraseSommet('blitz', { name: 'Moi', score: 2100, isMe: true }, '3e')).toMatch(/Tu es en tête des 3e/)
    expect(phraseSommet('blitz', null, '3e')).toBeNull()
  })
})

describe('la remise à zéro du lundi', () => {
  it('compte les jours entiers avant lundi, lundi compris comme 7', () => {
    expect(joursAvantLundi('2026-08-31')).toBe(7) // lundi
    expect(joursAvantLundi('2026-09-01')).toBe(6) // mardi
    expect(joursAvantLundi('2026-09-05')).toBe(2) // samedi
    expect(joursAvantLundi('2026-09-06')).toBe(1) // dimanche
  })

  it('se dit de plus en plus pressant', () => {
    expect(phraseRemiseAZero('2026-08-31')).toMatch(/chaque lundi/)
    expect(phraseRemiseAZero('2026-09-04')).toBe('Plus que 3 jours avant la remise à zéro.')
    expect(phraseRemiseAZero('2026-09-06')).toMatch(/Dernier jour/)
  })
})
