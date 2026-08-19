import { describe, expect, it } from 'vitest'
import {
  buildSubjectLadders,
  defaultSubject,
  LOCKED_HINT,
  SUBJECT_APEX_FLOOR,
  SUBJECT_DIVISIONS_PER_TIER,
  SUBJECT_DIVISION_SPAN,
  subjectDivisionRoman,
  subjectRankFor,
  subjectTierFloor,
} from './subject-rank'
import { restingTrophies, type GameTrophyRow } from './trophy-road'
import { DIVISION_SPAN } from './rank'

const SUBJECTS = [
  { subject: 'Maths', slug: 'maths', emoji: '🔢' },
  { subject: 'Histoire-Géo', slug: 'histoire-geo', emoji: '🏛️' },
  { subject: 'Anglais', slug: 'anglais', emoji: '🇬🇧' },
]

// `GameTrophyRow.subject` porte le SLUG (c'est ce que rend `game_trophies`),
// jamais le nom affiché.
function rows(entries: [string, string, number][]): GameTrophyRow[] {
  return entries.map(([subject, gameId, trophies]) => ({ subject, gameId, trophies }))
}

describe('échelle du rang de matière', () => {
  it('a trois divisions par palier, contre quatre au rang global', () => {
    expect(SUBJECT_DIVISIONS_PER_TIER).toBe(3)
    expect(subjectDivisionRoman(0)).toBe('III')
    expect(subjectDivisionRoman(1)).toBe('II')
    expect(subjectDivisionRoman(2)).toBe('I')
    // Hors bornes : on ramène dans l'échelle plutôt que de rendre undefined.
    expect(subjectDivisionRoman(-1)).toBe('III')
    expect(subjectDivisionRoman(9)).toBe('I')
  })

  it('a sa propre échelle, bien plus serrée que le rang global', () => {
    // Le rang global compte un total de sept matières ; une matière seule ne
    // pèse qu'une fraction de ça. Réutiliser l'échelle globale enfermerait tout
    // le monde dans Bronze.
    expect(SUBJECT_DIVISION_SPAN).toBeLessThan(DIVISION_SPAN)
    expect(SUBJECT_APEX_FLOOR).toBe(5 * 3 * SUBJECT_DIVISION_SPAN)
  })

  it('place les seuils de palier là où on les attend', () => {
    expect(subjectTierFloor('bronze')).toBe(0)
    expect(subjectTierFloor('argent')).toBe(450)
    expect(subjectTierFloor('or')).toBe(900)
    expect(subjectTierFloor('platine')).toBe(1350)
    expect(subjectTierFloor('diamant')).toBe(1800)
    expect(subjectTierFloor('maitre')).toBe(SUBJECT_APEX_FLOOR)
  })
})

describe('rang d’une matière', () => {
  it('démarre un compte neuf en Bronze III', () => {
    const r = subjectRankFor(0)
    expect(r.label).toBe('Bronze III')
    expect(r.progress).toBe(0)
    expect(r.toNext).toBe(SUBJECT_DIVISION_SPAN)
  })

  it('monte division par division', () => {
    expect(subjectRankFor(149).label).toBe('Bronze III')
    expect(subjectRankFor(150).label).toBe('Bronze II')
    expect(subjectRankFor(300).label).toBe('Bronze I')
    expect(subjectRankFor(450).label).toBe('Argent III')
    expect(subjectRankFor(900).label).toBe('Or III')
  })

  it('ouvre le sommet sans division et sans plafond', () => {
    const r = subjectRankFor(SUBJECT_APEX_FLOOR + 800)
    expect(r.label).toBe('Maître')
    expect(r.roman).toBeNull()
    expect(r.divisionIndex).toBeNull()
    expect(r.ceiling).toBeNull()
    expect(r.toNext).toBe(0)
    expect(r.inDivision).toBe(800)
  })

  it('rend une progression cohérente dans la division', () => {
    const r = subjectRankFor(975) // Or III + 75
    expect(r.floor).toBe(900)
    expect(r.ceiling).toBe(1050)
    expect(r.inDivision).toBe(75)
    expect(r.progress).toBeCloseTo(0.5)
    expect(r.toNext).toBe(75)
  })

  it('encaisse un total négatif ou décimal sans casser', () => {
    expect(subjectRankFor(-50).label).toBe('Bronze III')
    expect(subjectRankFor(150.9).label).toBe('Bronze II')
  })

  it('est ATTEIGNABLE : un très bon élève touche le sommet dans l’année', () => {
    // Trois jeux (dont le Programme) tenus au taux de victoire d'un très bon
    // élève. `restingTrophies` dit où chacun se stabilise ; leur somme doit
    // pouvoir franchir le sommet, sinon Maître serait un rang mort.
    const troisJeux = 3 * restingTrophies(0.8)
    expect(troisJeux).toBeGreaterThanOrEqual(SUBJECT_APEX_FLOOR)

    // …et un élève moyen ne doit PAS y être : le rang doit encore dire quelque
    // chose.
    expect(3 * restingTrophies(0.5)).toBeLessThan(SUBJECT_APEX_FLOOR)
  })
})

describe('ladder complet', () => {
  it('donne à chaque matière son propre rang, indépendamment des autres', () => {
    const ladders = buildSubjectLadders({
      subjects: SUBJECTS,
      rows: rows([
        ['maths', 'calcul-mental', 600],
        ['maths', 'programme', 400],
        ['histoire-geo', 'capitales', 120],
      ]),
    })

    const maths = ladders.find((l) => l.slug === 'maths')!
    const histoire = ladders.find((l) => l.slug === 'histoire-geo')!
    const anglais = ladders.find((l) => l.slug === 'anglais')!

    // Le cas que le cloisonnement doit rendre possible : fort ici, débutant là.
    expect(maths.trophies).toBe(1000)
    expect(maths.rank.label).toBe('Or III')
    expect(histoire.trophies).toBe(120)
    expect(histoire.rank.label).toBe('Bronze III')
    expect(anglais.trophies).toBe(0)
  })

  it('n’annonce jamais un pic inférieur au compteur du jour', () => {
    const ladders = buildSubjectLadders({
      subjects: SUBJECTS,
      rows: rows([['maths', 'programme', 700]]),
      peaks: new Map([['maths', 0]]), // migration pas encore passée
    })
    expect(ladders[0].peakTrophies).toBe(700)
  })

  it('garde le pic quand il dépasse le compteur courant', () => {
    const ladders = buildSubjectLadders({
      subjects: SUBJECTS,
      rows: rows([['maths', 'programme', 700]]),
      peaks: new Map([['maths', 900]]),
    })
    expect(ladders[0].peakTrophies).toBe(900)
  })

  it('marque les matières verrouillées sans les faire disparaître', () => {
    const ladders = buildSubjectLadders({
      subjects: SUBJECTS,
      rows: [],
      unlockedSlugs: new Set(['maths']),
    })
    expect(ladders).toHaveLength(3)
    expect(ladders.find((l) => l.slug === 'maths')!.unlocked).toBe(true)
    expect(ladders.find((l) => l.slug === 'anglais')!.unlocked).toBe(false)
    expect(LOCKED_HINT).toContain('chapitre')
  })

  it('considère tout ouvert quand l’éligibilité n’est pas fournie', () => {
    const ladders = buildSubjectLadders({ subjects: SUBJECTS, rows: [] })
    expect(ladders.every((l) => l.unlocked)).toBe(true)
  })
})

describe('matière présentée par défaut', () => {
  const ladders = () =>
    buildSubjectLadders({
      subjects: SUBJECTS,
      rows: rows([
        ['maths', 'programme', 300],
        ['anglais', 'programme', 800],
      ]),
      unlockedSlugs: new Set(['maths', 'anglais']),
    })

  it('propose la matière du chapitre en cours quand elle est ouverte', () => {
    expect(defaultSubject(ladders(), 'maths')!.slug).toBe('maths')
  })

  it('propose la meilleure matière ouverte quand la matière active est fermée', () => {
    expect(defaultSubject(ladders(), 'histoire-geo')!.slug).toBe('anglais')
  })

  it('propose la meilleure matière ouverte quand il n’y a pas de matière active', () => {
    expect(defaultSubject(ladders(), null)!.slug).toBe('anglais')
  })

  it('affiche quand même quelque chose sur un compte neuf, tout verrouillé', () => {
    const neuf = buildSubjectLadders({
      subjects: SUBJECTS,
      rows: [],
      unlockedSlugs: new Set(),
    })
    expect(defaultSubject(neuf, 'histoire-geo')!.slug).toBe('histoire-geo')
    expect(defaultSubject(neuf, null)!.slug).toBe('maths')
  })

  it('rend null quand il n’y a aucune matière', () => {
    expect(defaultSubject([], 'maths')).toBeNull()
  })
})
