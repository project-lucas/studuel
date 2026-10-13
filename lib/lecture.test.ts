import { describe, expect, it } from 'vitest'
import { LECTURE_MAX_S, LECTURE_MIN_S, compterMots, secondesDeLecture } from './lecture'

describe('lib/lecture', () => {
  it('compte les mots sans le balisage Markdown', () => {
    expect(compterMots('## Titre\n\n- **Un** point ✱ et `du code` | --- |')).toBe(6)
    expect(compterMots('')).toBe(0)
    expect(compterMots(null)).toBe(0)
  })

  it('attend une seconde pour dix mots, entre 20 s et 2 min', () => {
    expect(secondesDeLecture(0)).toBe(LECTURE_MIN_S)
    expect(secondesDeLecture(150)).toBe(LECTURE_MIN_S)
    expect(secondesDeLecture(450)).toBe(45)
    expect(secondesDeLecture(5000)).toBe(LECTURE_MAX_S)
  })
})
