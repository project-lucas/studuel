import { describe, expect, it } from 'vitest'
import {
  adoption,
  aTraiterDepuis,
  constats,
  dureeCourte,
  fonctionnalitesMuettes,
  graviteQuestion,
  insightsDepuis,
  libellePage,
  libelleSource,
  libelleVariation,
  usageDepuis,
  variation,
} from './insights'

const brut = {
  periode: { jours: 30, depuis: '2026-09-17', jusqua: '2026-10-16' },
  audience: { comptes: 120, eleves: 100, parents: 15, coachs: 5, plus: 12, nouveaux: 40, nouveaux_avant: 20 },
  classes: [{ classe: '3e', n: 50 }],
  jours: [{ jour: '2026-10-16', inscrits: 2, actifs: 30, minutes: 400, quiz: 50 }],
  actifs: { jour: 30, semaine: 60, mois: 90, periode: 90 },
  temps: { minutes: 9000, eleves: 80, jours_eleve: 600 },
  fonctionnalites: [
    { source: 'quiz', n: 500, eleves: 70, xp: 9000 },
    { source: 'jeu', n: 200, eleves: 40, xp: 400 },
    { source: 'duel', n: 20, eleves: 10, xp: 300 },
  ],
  fonctionnalites_avant: { quiz: 300, jeu: 400, duel: 20 },
  matieres: [
    { matiere: 'Maths', sessions: 200, eleves: 60, score: 0.55 },
    { matiere: 'SVT', sessions: 50, eleves: 20, score: 0.8 },
  ],
  heures: [{ h: 18, n: 300 }, { h: 9, n: 20 }],
  semaine: [{ j: 1, n: 10 }, { j: 7, n: 30 }],
  achats: { fiches: 3, capsules: 1, demandes_plus: 2, annales_commencees: 0, annales_terminees: 0 },
}

describe('insightsDepuis', () => {
  it('normalise et range heures et jours de la semaine', () => {
    const i = insightsDepuis(brut)!
    expect(i.heures).toHaveLength(24)
    expect(i.heures[18]).toBe(300)
    expect(i.semaine).toEqual([10, 0, 0, 0, 0, 0, 30])
    expect(i.fonctionnalites[0].libelle).toBe('Quiz de chapitre')
    expect(i.fonctionnalites[1].avant).toBe(400)
  })
  it('null pour une réponse vide (hors admin)', () => {
    expect(insightsDepuis(null)).toBeNull()
  })
})

describe('variations', () => {
  it('variation et libellé', () => {
    expect(variation(40, 20)).toBe(100)
    expect(variation(5, 0)).toBeNull()
    expect(libelleVariation(100, 40)).toBe('+100 %')
    expect(libelleVariation(-50, 1)).toBe('−50 %')
    expect(libelleVariation(null, 5)).toBe('nouveau')
    expect(libelleVariation(null, 0)).toBe('—')
    expect(libelleVariation(0, 3)).toBe('=')
  })
})

describe('constats', () => {
  it('tire les constats clés', () => {
    const titres = constats(insightsDepuis(brut)!).map((c) => c.titre)
    expect(titres).toContain('Inscriptions +100 %')
    expect(titres).toContain('33 % des actifs du mois sont venus aujourd’hui')
    expect(titres).toContain('Quiz de chapitre décolle (+67 %)')
    expect(titres).toContain('Jeux de salon recule (−50 %)')
    expect(titres).toContain('Matière la plus travaillée : Maths')
    expect(titres).toContain('Matière la plus difficile : Maths (55 %)')
    expect(titres).toContain('Heure de pointe : 18 h – 19 h')
    expect(titres).toContain('2 demandes de Studuel+')
  })
  it('liste les fonctionnalités jamais utilisées', () => {
    const muettes = fonctionnalitesMuettes(insightsDepuis(brut)!)
    expect(muettes).toContain('Dictées')
    expect(muettes).not.toContain('Quiz de chapitre')
  })
})

describe('petits outils', () => {
  it('adoption', () => {
    expect(adoption(45, 90)).toBe(50)
    expect(adoption(5, 0)).toBe(0)
  })
  it('libelleSource inconnu = la source', () => {
    expect(libelleSource('xyz')).toBe('xyz')
  })
  it('gravité', () => {
    expect(graviteQuestion(0.8)).toBe('critique')
    expect(graviteQuestion(0.55)).toBe('haute')
    expect(graviteQuestion(0.3)).toBe('moyenne')
  })
  it('libellePage', () => {
    expect(libellePage('/reviser/[matiere]')).toBe('Réviser › une matière')
    expect(libellePage('/')).toBe('Accueil')
  })
  it('dureeCourte', () => {
    expect(dureeCourte(42)).toBe('42 s')
    expect(dureeCourte(65)).toBe('1 min 05')
    expect(dureeCourte(3720)).toBe('1 h 02')
  })
})

describe('à traiter et usage', () => {
  it('aTraiterDepuis', () => {
    const a = aTraiterDepuis({ questions: [{ id: 'q', question: '1/2+1/3', quiz: 'Fractions', matiere: 'Maths', classe: '3e', eleves: 5, joueurs: 6, taux: 0.833 }], chapitres_muets: [{ matiere: 'Maths', classe: '3e', muets: 1, total: 2, exemples: ['Pythagore'] }] })!
    expect(a.questions[0].taux).toBe(0.833)
    expect(a.chapitresMuets[0].exemples).toEqual(['Pythagore'])
    expect(a.quizBas).toEqual([])
  })
  it('usageDepuis', () => {
    const u = usageDepuis({ jours: 7, total: 10, pages: [{ page: '/reviser', vues: 4, visiteurs: 2, temps_moyen_s: 42, temps_median_s: 30 }], sessions: { n: 2 } })!
    expect(u.pages[0].tempsMoyenS).toBe(42)
    expect(u.sessions.n).toBe(2)
    expect(u.recherchesVides).toEqual([])
  })
})
