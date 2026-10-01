import { describe, expect, it } from 'vitest'
import { annalesParAnnee, cheminAnnale, lieuDe, resumeParties, trouverAnnale } from './apercu'
import type { AnnaleCorrigee, NaturePartie } from './types'

function annale(
  id: string,
  annee: number,
  centre: string,
  natures: NaturePartie[],
  over: Partial<AnnaleCorrigee> = {},
): AnnaleCorrigee {
  return {
    id,
    matiere: 'philosophie',
    niveau: 'Tle',
    examen: 'bac',
    annee,
    centre,
    jour: null,
    code: '',
    titre: `Bac ${annee}`,
    dureeMin: 240,
    coefficient: 8,
    consigne: 'Un sujet au choix.',
    parties: natures.map((nature, i) => ({
      id: `p${i}`,
      titre: `Sujet ${i + 1}`,
      nature,
      enonce: 'Q ?',
      enBref: ['a', 'b'],
      blocs: [{ type: 'texte', texte: 'x' }],
    })),
    ...over,
  }
}

const CORPUS = [
  annale('philo-2023', 2023, 'Métropole', ['dissertation']),
  annale('philo-2025', 2025, 'Amérique du Nord', ['dissertation', 'dissertation', 'explication']),
  annale('philo-2025b', 2025, 'Asie', ['dissertation']),
  annale('maths-2024', 2024, 'Centres étrangers', ['exercice'], { matiere: 'maths' }),
  annale('fr-2024', 2024, 'Asie', ['commentaire'], { matiere: 'philosophie', niveau: '1re' }),
]

describe('annalesParAnnee', () => {
  it('ne garde que la matière et le niveau demandés, la plus récente d’abord', () => {
    const g = annalesParAnnee(CORPUS, 'philosophie', 'Tle')
    expect(g.map((x) => x.annee)).toEqual([2025, 2023])
    expect(g[0].annales.map((a) => a.id)).toEqual(['philo-2025', 'philo-2025b'])
  })

  it('garde l’épreuve, pour que la carte dise « Brevet » ou « Bac »', () => {
    const brevet = annale('maths-brevet-2025', 2025, 'Métropole', ['exercice'], {
      matiere: 'maths',
      niveau: '3e',
      examen: 'brevet',
    })
    const g = annalesParAnnee([...CORPUS, brevet], 'maths', '3e')
    expect(g[0].annales.map((a) => [a.id, a.examen])).toEqual([['maths-brevet-2025', 'brevet']])
  })

  it('rend une liste vide pour une matière sans annale', () => {
    expect(annalesParAnnee(CORPUS, 'svt', 'Tle')).toEqual([])
  })

  it('n’embarque pas le corrigé dans l’aperçu', () => {
    const a = annalesParAnnee(CORPUS, 'philosophie', 'Tle')[0].annales[0]
    expect(JSON.stringify(a)).not.toContain('blocs')
  })
})

describe('lieuDe', () => {
  it('ajoute le jour quand l’épreuve en a deux', () => {
    expect(lieuDe({ centre: 'Métropole', jour: 2 })).toBe('Métropole · jour 2')
    expect(lieuDe({ centre: 'Sujet zéro', jour: null })).toBe('Sujet zéro')
  })
})

describe('trouverAnnale', () => {
  it('refuse une annale d’une autre matière', () => {
    expect(trouverAnnale(CORPUS, 'philosophie', 'maths-2024')).toBeNull()
    expect(trouverAnnale(CORPUS, 'maths', 'maths-2024')?.id).toBe('maths-2024')
  })
})

describe('resumeParties', () => {
  it('compte les parties par nature, dans l’ordre du sujet', () => {
    expect(resumeParties([{ nature: 'dissertation' }, { nature: 'dissertation' }, { nature: 'explication' }])).toBe(
      '2 dissertations · 1 explication de texte',
    )
    expect(resumeParties([{ nature: 'exercice' }, { nature: 'exercice' }, { nature: 'exercice' }])).toBe('3 exercices')
    expect(resumeParties([{ nature: 'etude' }, { nature: 'etude' }])).toBe('2 études critiques de documents')
  })
})

describe('cheminAnnale', () => {
  it('range l’annale dans le dossier de sa matière', () => {
    expect(cheminAnnale('svt', 'svt-2024-amerique-nord-j1')).toBe('/reviser/svt/annales/svt-2024-amerique-nord-j1')
  })
})
