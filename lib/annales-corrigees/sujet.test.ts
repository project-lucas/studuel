import { describe, expect, it } from 'vitest'
import { pdfSujet } from './apercu'
import { ANNALES_CORRIGEES } from './registre'
import { cheminSujetPublic, estIdAnnale, hrefSujet, nomObjetSujet, nomTelechargementSujet } from './sujet'

describe('le sujet habillé d’une annale', () => {
  it('accepte les identifiants du corpus et refuse le reste', () => {
    for (const a of ANNALES_CORRIGEES) expect(estIdAnnale(a.id), a.id).toBe(true)
    expect(estIdAnnale('../etc/passwd')).toBe(false)
    expect(estIdAnnale('philo..2024')).toBe(false)
    expect(estIdAnnale('Philo-2024')).toBe(false)
    expect(estIdAnnale('ab')).toBe(false)
    expect(estIdAnnale('-maths-2024')).toBe(false)
  })

  it('nomme l’objet, l’adresse servie, le repli public et le fichier enregistré', () => {
    expect(nomObjetSujet('maths-2024-asie-j1')).toBe('maths-2024-asie-j1.pdf')
    expect(hrefSujet('maths-2024-asie-j1')).toBe('/api/annales/maths-2024-asie-j1/sujet')
    expect(hrefSujet('maths-2024-asie-j1', { telecharger: true })).toBe('/api/annales/maths-2024-asie-j1/sujet?dl=1')
    expect(cheminSujetPublic('maths-2024-asie-j1')).toBe('/annales/maths-2024-asie-j1.pdf')
    expect(nomTelechargementSujet('maths-2024-asie-j1')).toBe('maths-2024-asie-j1-studuel.pdf')
  })

  it('l’écran lit le sujet par la route, plus par public/', () => {
    expect(pdfSujet('svt-2023-metropole-j1')).toBe('/api/annales/svt-2023-metropole-j1/sujet')
    expect(pdfSujet('svt-2023-metropole-j1', { telecharger: true })).toBe('/api/annales/svt-2023-metropole-j1/sujet?dl=1')
  })
})
