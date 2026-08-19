import { describe, expect, it } from 'vitest'
import { SALONS } from './catalog'
import { GAME_FORMATS } from './formats'
import {
  MIN_PROGRAMME_QUESTIONS,
  PROGRAMME_FORMAT,
  PROGRAMME_GAME_ID,
  orderQuizzesByWeakness,
  programmeHref,
  programmeSlug,
  subjectFromProgrammeSlug,
} from './programme'
import { poolSizeFor } from './formats'

describe('le jeu Programme reste hors du catalogue des salons', () => {
  it('n’entre pas dans GAME_FORMATS (les invariants des salons ne le concernent pas)', () => {
    expect(Object.keys(GAME_FORMATS)).not.toContain(PROGRAMME_GAME_ID)
  })

  it('n’apparaît dans aucun salon', () => {
    const ids = SALONS.flatMap((s) => s.games.map((g) => g.id))
    expect(ids).not.toContain(PROGRAMME_GAME_ID)
  })

  it('porte une robe qui n’est prise par aucun jeu de salon', () => {
    const themes = Object.values(GAME_FORMATS).map((f) => f.theme)
    expect(themes).not.toContain(PROGRAMME_FORMAT.theme)
  })
})

describe('le format du Programme', () => {
  it('laisse lire l’énoncé — aucun chrono par question', () => {
    expect(PROGRAMME_FORMAT.params.mechanic).toBe('vies')
    if (PROGRAMME_FORMAT.params.mechanic === 'vies') {
      expect(PROGRAMME_FORMAT.params.vies.questionSeconds).toBeNull()
      expect(PROGRAMME_FORMAT.params.vies.lives).toBeGreaterThan(0)
      expect(PROGRAMME_FORMAT.params.vies.target).toBeGreaterThan(0)
    }
  })

  it('n’ouvre le jeu qu’avec de quoi jouer sans jamais répéter une question', () => {
    // Une partie aux vies consomme au PIRE `target + lives` questions (chaque
    // vie perdue est une question de plus). Le seuil d'offre doit dépasser ce
    // maximum, sinon la table reboucle sur `pool[i % n]` et l'élève retombe sur
    // une question qu'il vient de rater — ce que le trophée cesserait de mesurer.
    if (PROGRAMME_FORMAT.params.mechanic === 'vies') {
      const worstCase =
        PROGRAMME_FORMAT.params.vies.target + PROGRAMME_FORMAT.params.vies.lives
      expect(MIN_PROGRAMME_QUESTIONS).toBeGreaterThan(worstCase)
    }
  })

  it('sait dimensionner son pool comme n’importe quel format', () => {
    expect(poolSizeFor(PROGRAMME_FORMAT)).toBeGreaterThan(0)
  })

  it('écrit un lexique complet, jamais générique', () => {
    for (const value of Object.values(PROGRAMME_FORMAT.lexicon)) {
      expect(value.trim().length).toBeGreaterThan(0)
      expect(value.toLowerCase()).not.toBe('bravo')
    }
  })
})

describe('les slugs de matière', () => {
  it('produit un slug d’URL sans accent ni majuscule', () => {
    expect(programmeSlug('Histoire-Géo')).toBe('histoire-geo')
    expect(programmeSlug('Physique-Chimie')).toBe('physique-chimie')
    expect(programmeSlug('Maths')).toBe('maths')
  })

  it('fait l’aller-retour pour toutes les matières du catalogue', () => {
    for (const salon of SALONS) {
      expect(subjectFromProgrammeSlug(programmeSlug(salon.subject))).toBe(
        salon.subject,
      )
    }
  })

  it('donne un slug unique par matière (aucune collision d’URL)', () => {
    const slugs = SALONS.map((s) => programmeSlug(s.subject))
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('rend null sur un slug inconnu', () => {
    expect(subjectFromProgrammeSlug('philosophie-quantique')).toBeNull()
  })

  it('construit un lien jouable', () => {
    expect(programmeHref('Histoire-Géo')).toBe('/defi/programme/histoire-geo')
  })
})

describe('orderQuizzesByWeakness', () => {
  const chapters = new Map([
    ['l1', 'c1'],
    ['l2', 'c2'],
    ['l3', 'c3'],
  ])
  const mastery = new Map([
    ['c1', 0.9],
    ['c2', 0.2],
    // c3 jamais travaillé — absent de la table.
  ])
  const masteryOf = (id: string) => mastery.get(id)

  it('sert le chapitre le moins maîtrisé en premier', () => {
    const ordered = orderQuizzesByWeakness(
      [
        { id: 'a', lesson_id: 'l1' },
        { id: 'b', lesson_id: 'l2' },
      ],
      chapters,
      masteryOf,
    )
    expect(ordered.map((q) => q.id)).toEqual(['b', 'a'])
  })

  it('met un chapitre jamais travaillé en tête (priorité maximale)', () => {
    const ordered = orderQuizzesByWeakness(
      [
        { id: 'a', lesson_id: 'l1' },
        { id: 'c', lesson_id: 'l3' },
      ],
      chapters,
      masteryOf,
    )
    expect(ordered[0].id).toBe('c')
  })

  it('traite un quiz sans leçon comme jamais travaillé', () => {
    const ordered = orderQuizzesByWeakness(
      [
        { id: 'a', lesson_id: 'l1' },
        { id: 'orphelin', lesson_id: null },
      ],
      chapters,
      masteryOf,
    )
    expect(ordered[0].id).toBe('orphelin')
  })

  it('est stable : à maîtrise égale, l’ordre d’entrée est conservé', () => {
    const ordered = orderQuizzesByWeakness(
      [
        { id: 'x', lesson_id: 'l3' },
        { id: 'y', lesson_id: null },
        { id: 'z', lesson_id: 'l3' },
      ],
      chapters,
      masteryOf,
    )
    expect(ordered.map((q) => q.id)).toEqual(['x', 'y', 'z'])
  })

  it('ne perd ni ne duplique aucun quiz', () => {
    const input = [
      { id: 'a', lesson_id: 'l1' },
      { id: 'b', lesson_id: 'l2' },
      { id: 'c', lesson_id: 'l3' },
    ]
    const ordered = orderQuizzesByWeakness(input, chapters, masteryOf)
    expect(ordered).toHaveLength(3)
    expect(new Set(ordered.map((q) => q.id)).size).toBe(3)
  })

  it('ne modifie pas le tableau d’entrée', () => {
    const input = [
      { id: 'a', lesson_id: 'l1' },
      { id: 'b', lesson_id: 'l2' },
    ]
    orderQuizzesByWeakness(input, chapters, masteryOf)
    expect(input.map((q) => q.id)).toEqual(['a', 'b'])
  })
})
