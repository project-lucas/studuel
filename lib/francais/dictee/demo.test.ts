import { describe, expect, it } from 'vitest'
import {
  DEMO_DICTEE_ID,
  DEMO_DICTEE_SLUG,
  DICTEE_DEMO,
  estDemo,
  texteAttenduDemo,
} from '@/lib/francais/dictee/demo'
import {
  corrigerDictee,
  formatNote,
  noteSur20,
} from '@/lib/francais/dictee/correction'

describe('la dictée de démonstration', () => {
  it('est courte — elle sert à parcourir les écrans, pas à travailler', () => {
    expect(DICTEE_DEMO.segments.length).toBeLessThanOrEqual(4)
    expect(DICTEE_DEMO.duree_min).toBeLessThanOrEqual(3)
  })

  it('a des segments non vides, dans l’ordre', () => {
    DICTEE_DEMO.segments.forEach((s, i) => {
      expect(s.position).toBe(i)
      expect(s.texte.trim().length).toBeGreaterThan(0)
    })
  })

  it('n’a PAS un identifiant d’UUID — c’est le garde-fou', () => {
    // Toute écriture en base le rejetterait : c'est ce qui garantit qu'une note
    // de démonstration ne peut pas se glisser dans l'historique de l'élève.
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(uuid.test(DEMO_DICTEE_ID)).toBe(false)
  })

  it('se reconnaît par son identifiant comme par son slug', () => {
    expect(estDemo(DEMO_DICTEE_ID)).toBe(true)
    expect(estDemo(DEMO_DICTEE_SLUG)).toBe(true)
    expect(estDemo('homme-foudroye')).toBe(false)
    expect(estDemo('')).toBe(false)
  })

  it('recompose son texte comme le fait le serveur', () => {
    expect(texteAttenduDemo()).toBe(
      DICTEE_DEMO.segments.map((s) => s.texte).join(' '),
    )
  })
})

describe('le parcours complet, sur la démo', () => {
  const attendu = texteAttenduDemo()

  it('une copie parfaite donne 20/20 et aucune erreur', () => {
    const c = corrigerDictee(attendu, attendu)
    expect(c.erreurs).toBe(0)
    expect(formatNote(noteSur20(c))).toBe('20')
  })

  it('une copie vide donne 0/20, et la correction montre le texte', () => {
    const c = corrigerDictee(attendu, '')
    expect(noteSur20(c)).toBe(0)
    // Et surtout : l'écran de correction n'est pas blanc.
    expect(c.morceaux.length).toBeGreaterThan(0)
  })

  it('les fautes plantées dans le texte se corrigent bien', () => {
    // « sortis » sans accord, « marchés » de trop, apostrophe mangée.
    const copie =
      'Les enfants sont sorti de bonne heure. Ils ont marchés le long de la rivière, et n’ont pas vu le temps passé.'
    const c = corrigerDictee(attendu, copie)
    expect(c.erreurs).toBeGreaterThan(0)
    // La note reste dans les bornes, et distingue cette copie d'une copie vide.
    const note = noteSur20(c)
    expect(note).toBeGreaterThan(0)
    expect(note).toBeLessThan(20)
  })

  it('l’apostrophe typographique de la démo ne compte pas comme une faute', () => {
    // Le texte l'écrit « n’ont » ; un clavier qui produit « n'ont » ne doit pas
    // coûter un point.
    const copie = attendu.replace(/’/g, "'")
    expect(corrigerDictee(attendu, copie).erreurs).toBe(0)
  })
})
