import { describe, expect, it } from 'vitest'
import { consommerCoursePassee, marquerCoursePassee } from '@/lib/apres-course'

describe('le drapeau d’après course', () => {
  it('n’est pas posé au départ', () => {
    expect(consommerCoursePassee()).toBe(false)
  })

  it('se lit une seule fois après une course', () => {
    marquerCoursePassee()
    expect(consommerCoursePassee()).toBe(true)
    expect(consommerCoursePassee()).toBe(false)
  })

  it('plusieurs courses d’affilée ne font qu’un rafraîchissement', () => {
    marquerCoursePassee()
    marquerCoursePassee()
    marquerCoursePassee()
    expect(consommerCoursePassee()).toBe(true)
    expect(consommerCoursePassee()).toBe(false)
  })
})
