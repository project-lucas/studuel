import { describe, expect, test } from 'vitest'
import type { SupportChip } from './subject-template'
import { pagesAuRepos, peutPrechargerAuRepos } from './precharge-repos'

const chip = (kind: SupportChip['kind'], href: string, extra: Partial<SupportChip> = {}): SupportChip => ({
  kind,
  label: kind,
  meta: '',
  badge: null,
  href,
  done: false,
  ...extra,
})

describe('peut-on précharger au repos ?', () => {
  test('sans information sur la connexion : oui', () => {
    expect(peutPrechargerAuRepos(undefined)).toBe(true)
    expect(peutPrechargerAuRepos({ effectiveType: '4g' })).toBe(true)
  })
  test('jamais en économie de données ni en 2G', () => {
    expect(peutPrechargerAuRepos({ saveData: true, effectiveType: '4g' })).toBe(false)
    expect(peutPrechargerAuRepos({ effectiveType: '2g' })).toBe(false)
    expect(peutPrechargerAuRepos({ effectiveType: 'slow-2g' })).toBe(false)
  })
})

describe('les pages à préparer pendant la lecture', () => {
  test('le quiz d’abord, puis la leçon suivante, puis le cahier', () => {
    const chips = [
      chip('exercice', '/reviser/maths/c1/exercice'),
      chip('cours', '/reviser/maths/c1/l2/cours'),
      chip('carte', '/reviser/maths/c1/carte'),
      chip('quiz', '/test/q1'),
    ]
    expect(pagesAuRepos(chips)).toEqual(['/test/q1', '/reviser/maths/c1/l2/cours', '/reviser/maths/c1/exercice'])
  })
  test('ni verrouillé, ni « bientôt », ni hors de l’app, ni en double', () => {
    const chips = [
      chip('carte', '/reviser/maths/c1/carte', { locked: true }),
      chip('ia', '/reviser/ia', { bientot: true }),
      chip('quiz', 'https://ailleurs.fr/x'),
      chip('quiz', '//ailleurs.fr/x'),
      chip('quiz', '/test/q1'),
      chip('erreurs', '/test/q1'),
    ]
    expect(pagesAuRepos(chips)).toEqual(['/test/q1'])
  })
  test('le plafond se règle', () => {
    const chips = [chip('quiz', '/a'), chip('cours', '/b'), chip('exercice', '/c')]
    expect(pagesAuRepos(chips, 1)).toEqual(['/a'])
    expect(pagesAuRepos(chips, 0)).toEqual([])
  })
})
