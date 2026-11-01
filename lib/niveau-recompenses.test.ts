import { describe, expect, test } from 'vitest'
import { decouvertesAuNiveau } from '@/lib/decouverte/catalogue'
import { gainsDuPassage, titreDuNiveau } from './niveau-recompenses'

describe('gainsDuPassage', () => {
  test('le niveau 4 ouvre les gardiens et donne le titre « Régulier »', () => {
    const gains = gainsDuPassage(3, 4)
    const ouverts = decouvertesAuNiveau(4).map((d) => d.cle)
    expect(gains.filter((g) => g.type === 'decouverte').map((g) => g.cle)).toEqual(ouverts)
    expect(gains.at(-1)).toEqual({ type: 'titre', cle: 'titre-4', nom: 'Régulier' })
  })

  test('une découverte mène à sa page avec son mini-tour', () => {
    const d = decouvertesAuNiveau(4)[0]
    const gain = gainsDuPassage(3, 4).find((g) => g.cle === d.cle)
    expect(gain).toMatchObject({ type: 'decouverte', href: `${d.href}?decouvrir=${d.cle}` })
  })

  test('le niveau 6 habille la photo du cadre d’argent', () => {
    expect(gainsDuPassage(5, 6)).toContainEqual({
      type: 'cadre',
      cle: 'cadre-argent',
      nom: 'Cadre d’argent',
      image: '/images/moi/cadres/argent.webp',
    })
  })

  test('un grand saut cumule les écrans mais ne garde que le dernier cadre et le dernier titre', () => {
    const gains = gainsDuPassage(1, 7)
    expect(gains.filter((g) => g.type === 'cadre').map((g) => g.cle)).toEqual(['cadre-argent'])
    expect(gains.filter((g) => g.type === 'titre').map((g) => g.nom)).toEqual([titreDuNiveau(7)])
    const ecrans = [2, 3, 4, 5, 6, 7].flatMap((n) => decouvertesAuNiveau(n).map((d) => d.cle))
    expect(gains.filter((g) => g.type === 'decouverte').map((g) => g.cle)).toEqual(ecrans)
  })

  test('au-delà du dernier titre, un niveau sans cadre ni écran ne rapporte rien', () => {
    expect(gainsDuPassage(13, 14)).toEqual([])
  })

  test('rien quand on ne monte pas', () => {
    expect(gainsDuPassage(4, 4)).toEqual([])
    expect(gainsDuPassage(5, 3)).toEqual([])
  })
})
