import { describe, expect, it } from 'vitest'
import { CONSEILS, conseilThemes } from './parents-conseils'

// Ces fiches SONT le volet « Conseils » : elles remplacent le « les vidéos
// arrivent bientôt » qu'un parent lisait à chaque visite. Une fiche vide, sans
// ancrage ou en double referait exactement le trou qu'elles bouchent.
describe('CONSEILS — le volet ne peut plus être vide', () => {
  it('contient de quoi remplir l’écran sans aucune migration', () => {
    expect(CONSEILS.length).toBeGreaterThanOrEqual(6)
  })

  it('a des identifiants uniques (clés de rendu et d’ancre)', () => {
    const ids = CONSEILS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('donne à chaque fiche un résumé qui suffit sans la déplier', () => {
    for (const c of CONSEILS) {
      expect(c.titre.trim().length).toBeGreaterThan(5)
      expect(c.resume.trim().length).toBeGreaterThan(40)
    }
  })

  it('donne à chaque fiche un corps réellement écrit', () => {
    for (const c of CONSEILS) {
      expect(c.corps.length).toBeGreaterThanOrEqual(2)
      for (const p of c.corps) expect(p.trim().length).toBeGreaterThan(80)
    }
  })

  it('rattache chaque conseil à une mécanique visible de l’app', () => {
    // Un conseil qui ne se rattache à rien est un conseil que le parent ne
    // peut pas appliquer.
    for (const c of CONSEILS) {
      expect(c.ancrage.trim().length).toBeGreaterThan(30)
    }
  })
})

describe('conseilThemes', () => {
  it('dérive les thèmes des fiches, dans leur ordre d’apparition', () => {
    expect(conseilThemes()).toEqual(['Posture', 'Méthode', 'Rythme', 'Notes'])
  })

  it('ne rend que des thèmes réellement portés par une fiche', () => {
    const themes = conseilThemes()
    for (const t of themes) {
      expect(CONSEILS.some((c) => c.theme === t)).toBe(true)
    }
    expect(new Set(themes).size).toBe(themes.length)
  })

  it('rend une liste vide sur une liste vide', () => {
    expect(conseilThemes([])).toEqual([])
  })
})
