import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import {
  DICTEES_CONTENU,
  audioDuMorceau,
  audioIntegral,
  sessionDeContenu,
} from '@/lib/francais/dictee/contenu'
import { isNiveauDictee } from '@/lib/francais/dictee/niveaux'

const CLASSES = ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']

// Ce que ces tests gardent : chaque dictée du contenu est jouable (des morceaux,
// une voix pour chacun), se replace dans son histoire (un contexte court, une
// source, une date) et s'adresse à des classes réelles.
describe('les dictées de Studuel', () => {
  test.each(DICTEES_CONTENU.map((d) => [d.slug, d] as const))('%s est complète', (_slug, d) => {
    expect(d.titre.length).toBeGreaterThan(0)
    expect(d.source.length).toBeGreaterThan(0)
    expect(d.date.length).toBeGreaterThan(0)
    expect(isNiveauDictee(d.niveau)).toBe(true)
    expect(d.classes.length).toBeGreaterThan(0)
    for (const c of d.classes) expect(CLASSES).toContain(c)
    // Le contexte se lit d'un coup d'œil : trois paragraphes au plus.
    expect(d.contexte.length).toBeGreaterThan(0)
    expect(d.contexte.length).toBeLessThanOrEqual(3)
    expect(d.segments.length).toBeGreaterThanOrEqual(4)
    for (const s of d.segments) expect(s.trim()).toBe(s)
    for (const p of d.paragraphes ?? []) expect(p).toBeLessThan(d.segments.length - 1)
  })

  test.each(DICTEES_CONTENU.map((d) => [d.slug, d] as const))('%s a sa voix, morceau par morceau', (_slug, d) => {
    const fichier = (adresse: string) => path.join(process.cwd(), 'public', adresse)
    expect(existsSync(fichier(audioIntegral(d.slug)))).toBe(true)
    d.segments.forEach((_s, i) => expect(existsSync(fichier(audioDuMorceau(d.slug, i)))).toBe(true))
  })

  test('les slugs sont uniques', () => {
    const slugs = DICTEES_CONTENU.map((d) => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  test('la session reçoit chaque morceau avec son enregistrement', () => {
    const d = DICTEES_CONTENU[0]
    const session = sessionDeContenu(d)
    expect(session.segments[0]).toEqual({ position: 0, texte: d.segments[0], audio: `/audio/dictees/${d.slug}/01.mp3` })
    expect(session.audioIntegral).toBe(`/audio/dictees/${d.slug}/integrale.mp3`)
    expect(session.contexte.paragraphes).toBe(d.contexte)
  })
})
