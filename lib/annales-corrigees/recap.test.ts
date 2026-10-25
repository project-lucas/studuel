import { describe, expect, it } from 'vitest'
import { annalesParAnnee } from './apercu'
import { phraseFrequence, poidsTheme, recapAnnales, recapDesAnnales } from './recap'
import { ANNALES_CORRIGEES } from './registre'
import type { AnnaleCorrigee, NaturePartie } from './types'

function annale(
  id: string,
  annee: number,
  centre: string,
  parties: [string, NaturePartie][],
  over: Partial<AnnaleCorrigee> = {},
): AnnaleCorrigee {
  return {
    id,
    matiere: 'histoire-geo',
    niveau: '3e',
    examen: 'brevet',
    annee,
    centre,
    jour: null,
    code: '',
    titre: `Brevet ${annee}`,
    dureeMin: 120,
    coefficient: null,
    consigne: 'Trois exercices.',
    parties: parties.map(([theme, nature], i) => ({
      id: `p${i}`,
      titre: `Exercice ${i + 1}`,
      nature,
      enonce: 'Q ?',
      theme,
      enBref: ['a', 'b'],
      blocs: [{ type: 'texte', texte: 'x' }],
    })),
    ...over,
  }
}

const CORPUS = [
  annale('hg-2021', 2021, 'Métropole', [['Première Guerre mondiale', 'etude'], ['Les aires urbaines', 'exercice']]),
  annale('hg-2022', 2022, 'Métropole', [['Première Guerre mondiale', 'exercice'], ['Mers et océans', 'etude']]),
  annale('hg-2023', 2023, 'Métropole', [['Mers et océans', 'exercice'], ['Les espaces productifs', 'etude']]),
  annale('hg-2023-am', 2023, 'Amérique du Nord', [['Seconde Guerre mondiale', 'etude'], ['Seconde Guerre mondiale', 'exercice']]),
  annale('philo-2023', 2023, 'Métropole', [['Le bonheur', 'dissertation']], { matiere: 'philosophie', niveau: 'Tle', examen: 'bac' }),
]

describe('recapAnnales', () => {
  const recap = recapAnnales(CORPUS, 'histoire-geo', '3e')

  it('déroule la frise année par année, la plus récente d’abord, avec le centre et la nature', () => {
    expect(recap.sessions).toBe(4)
    expect(recap.annees.map((a) => a.annee)).toEqual([2023, 2022, 2021])
    expect(recap.annees[0].sessions.map((s) => s.lieu)).toEqual(['Amérique du Nord', 'Métropole'])
    expect(recap.annees[2].sessions[0].sujets).toEqual([
      { theme: 'Première Guerre mondiale', nature: 'etude', titre: 'Exercice 1' },
      { theme: 'Les aires urbaines', nature: 'exercice', titre: 'Exercice 2' },
    ])
  })

  it('classe les thèmes du plus fréquent au plus rare, le plus récent d’abord à égalité', () => {
    expect(recap.frequents.map((f) => [f.theme, f.fois])).toEqual([
      ['Mers et océans', 2],
      ['Première Guerre mondiale', 2],
      ['Les espaces productifs', 1],
      ['Seconde Guerre mondiale', 1],
      ['Les aires urbaines', 1],
    ])
  })

  it('compte une session une seule fois même si deux parties portent le même thème', () => {
    const seconde = recap.frequents.find((f) => f.theme === 'Seconde Guerre mondiale')
    expect(seconde).toEqual({ theme: 'Seconde Guerre mondiale', fois: 1, annees: [2023] })
  })

  it('liste les années d’un thème sans doublon, la plus récente d’abord', () => {
    expect(recap.frequents[1].annees).toEqual([2022, 2021])
  })

  it('ne mélange pas les matières ni les classes', () => {
    expect(recapAnnales(CORPUS, 'philosophie', 'Tle').frequents).toEqual([{ theme: 'Le bonheur', fois: 1, annees: [2023] }])
    expect(recapAnnales(CORPUS, 'philosophie', '3e')).toEqual({ sessions: 0, annees: [], frequents: [] })
  })

  it('se calcule aussi depuis les aperçus que l’onglet reçoit', () => {
    expect(recapDesAnnales(annalesParAnnee(CORPUS, 'histoire-geo', '3e'))).toEqual(recap)
  })
})

describe('phraseFrequence et poidsTheme', () => {
  it('accorde le pluriel des sessions', () => {
    expect(phraseFrequence(3, 6)).toBe('tombé 3 fois en 6 sessions')
    expect(phraseFrequence(1, 1)).toBe('tombé 1 fois en 1 session')
  })

  it('borne le poids entre 0 et 1', () => {
    expect(poidsTheme(3, 6)).toBe(0.5)
    expect(poidsTheme(2, 0)).toBe(0)
    expect(poidsTheme(7, 6)).toBe(1)
  })
})

describe('le corpus réel', () => {
  it('a un thème sur chaque partie et des thèmes qui reviennent en SES', () => {
    for (const a of ANNALES_CORRIGEES) for (const p of a.parties) expect(p.theme.length, `${a.id}/${p.id}`).toBeGreaterThan(0)
    const ses = recapAnnales(ANNALES_CORRIGEES, 'ses', 'Tle')
    expect(ses.frequents[0].theme).toBe('Action publique et environnement')
    expect(ses.frequents[0].fois).toBeGreaterThanOrEqual(3)
  })
})
