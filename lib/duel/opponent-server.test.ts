import { describe, expect, it } from 'vitest'
import { traceDeLaVersion } from '@/lib/duel/opponent-server'

const ACTUELLE = [{ at: 2000, good: true, ms: 2000 }]
const PRECEDENTE = [{ at: 3000, good: false, ms: 3000 }]

describe('la trace que l’élève a vraiment courue', () => {
  const ligne = {
    steps: ACTUELLE,
    created_at: '2026-09-19T20:10:05.123456+00:00',
    steps_precedents: PRECEDENTE,
    precedent_le: '2026-09-19T20:08:41.5+00:00',
  }

  it('la version actuelle quand c’est elle qui a été servie', () => {
    expect(traceDeLaVersion(ligne, '2026-09-19T20:10:05.123456+00:00')).toBe(ACTUELLE)
  })

  it('la précédente quand le rival a rejoué pendant ma course', () => {
    expect(traceDeLaVersion(ligne, '2026-09-19T20:08:41.500+00:00')).toBe(PRECEDENTE)
  })

  it('aucune quand la trace a changé deux fois : course non vérifiée', () => {
    expect(traceDeLaVersion(ligne, '2026-09-19T19:00:00+00:00')).toBeUndefined()
  })

  it('la trace actuelle sans version (écran d’avant) ou sans la 374', () => {
    expect(traceDeLaVersion(ligne, null)).toBe(ACTUELLE)
    expect(traceDeLaVersion({ steps: ACTUELLE }, '2026-09-19T20:10:05Z')).toBe(ACTUELLE)
  })
})
