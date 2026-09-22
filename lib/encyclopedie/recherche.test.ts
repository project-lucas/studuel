import { describe, expect, it } from 'vitest'
import {
  comptes,
  commenceUnMot,
  filtrer,
  indexDuJour,
  motsDe,
  normaliser,
  score,
} from './recherche'
import { citationCourte } from './apercu'
import type { Apercu } from './apercu'
import { PERIODES } from './types'
import { periodesPresentes } from './recherche'

function apercu(partiel: Partial<Apercu> & Pick<Apercu, 'id' | 'nom'>): Apercu {
  return {
    volet: 'personnages',
    dates: '1412 – 1431',
    tri: 1431,
    periode: 'moyen-age',
    emoji: '⚔️',
    citation: '',
    niveaux: ['5e'],
    cles: normaliser(partiel.nom),
    ...partiel,
  }
}

describe('normaliser', () => {
  it('enlève les accents, la casse et la ponctuation', () => {
    expect(normaliser('Jeanne d’Arc')).toBe('jeanne d arc')
    expect(normaliser('LUMIÈRES')).toBe('lumieres')
    expect(normaliser('Été 1789 !')).toBe('ete 1789')
  })

  it('réduit les espaces multiples et coupe les bords', () => {
    expect(normaliser('  la   Bastille  ')).toBe('la bastille')
  })
})

describe('motsDe', () => {
  it('découpe la requête en mots normalisés', () => {
    expect(motsDe('Saint Louis')).toEqual(['saint', 'louis'])
  })

  it('rend un tableau vide pour une requête vide ou blanche', () => {
    expect(motsDe('   ')).toEqual([])
  })
})

describe('commenceUnMot', () => {
  it('reconnaît un début de mot au début de la chaîne', () => {
    expect(commenceUnMot('napoleon bonaparte', 'napo')).toBe(true)
  })

  it('reconnaît un début de mot au milieu de la chaîne', () => {
    expect(commenceUnMot('napoleon bonaparte', 'bona')).toBe(true)
  })

  it('refuse un morceau qui ne commence pas un mot', () => {
    // Sans cette borne, « leon » ferait remonter Napoléon, et « ale » la
    // moitié du corpus.
    expect(commenceUnMot('napoleon bonaparte', 'leon')).toBe(false)
  })
})

describe('score', () => {
  const jeanne = apercu({
    id: 'jeanne-d-arc',
    nom: 'Jeanne d’Arc',
    cles: 'jeanne arc pucelle orleans domremy boutes hors de france',
  })

  it('accepte une fiche sans requête', () => {
    expect(score(jeanne, [])).toBe(1)
  })

  it('exige TOUS les mots de la requête', () => {
    expect(score(jeanne, ['jeanne', 'orleans'])).toBeGreaterThan(0)
    expect(score(jeanne, ['jeanne', 'bastille'])).toBe(0)
  })

  it('met devant la fiche dont le nom commence par la requête', () => {
    const orleans = apercu({
      id: 'siege-d-orleans',
      nom: 'Le siège d’Orléans',
      cles: 'le siege d orleans jeanne loire',
    })
    expect(score(jeanne, ['jeanne'])).toBeGreaterThan(score(orleans, ['jeanne']))
  })

  it('trouve une fiche par un mot de sa citation', () => {
    expect(score(jeanne, ['boutes'])).toBeGreaterThan(0)
  })
})

describe('filtrer', () => {
  const liste: Apercu[] = [
    apercu({ id: 'clovis', nom: 'Clovis', tri: 511, periode: 'moyen-age', cles: 'clovis reims' }),
    apercu({
      id: 'saint-louis',
      nom: 'Saint Louis',
      tri: 1270,
      periode: 'moyen-age',
      niveaux: ['5e'],
      cles: 'saint louis justice vincennes',
    }),
    apercu({
      id: 'napoleon-bonaparte',
      nom: 'Napoléon Bonaparte',
      tri: 1821,
      periode: 'revolution',
      niveaux: ['4e', '1re'],
      cles: 'napoleon bonaparte empereur austerlitz',
    }),
    apercu({
      id: 'prise-de-la-bastille',
      nom: 'La prise de la Bastille',
      volet: 'evenements',
      tri: 1789,
      periode: 'revolution',
      niveaux: ['4e'],
      cles: 'la prise de la bastille paris 14 juillet',
    }),
  ]

  it('ne rend que le volet demandé', () => {
    const rendus = filtrer(liste, { volet: 'evenements' })
    expect(rendus.map((a) => a.id)).toEqual(['prise-de-la-bastille'])
  })

  it('classe par ordre chronologique quand il n’y a pas de requête', () => {
    const rendus = filtrer(liste, { volet: 'personnages' })
    expect(rendus.map((a) => a.id)).toEqual(['clovis', 'saint-louis', 'napoleon-bonaparte'])
  })

  it('classe par pertinence quand on cherche', () => {
    const rendus = filtrer(liste, { volet: 'personnages', requete: 'louis' })
    expect(rendus[0].id).toBe('saint-louis')
  })

  it('filtre par période', () => {
    const rendus = filtrer(liste, { volet: 'personnages', periode: 'revolution' })
    expect(rendus.map((a) => a.id)).toEqual(['napoleon-bonaparte'])
  })

  it('filtre par classe', () => {
    const rendus = filtrer(liste, { volet: 'personnages', niveau: '1re' })
    expect(rendus.map((a) => a.id)).toEqual(['napoleon-bonaparte'])
  })

  it('rend une liste vide quand rien ne correspond, sans planter', () => {
    expect(filtrer(liste, { volet: 'personnages', requete: 'zzz' })).toEqual([])
  })
})

describe('periodesPresentes', () => {
  it('ne garde que les périodes qui ont une fiche dans ce volet', () => {
    const liste: Apercu[] = [
      apercu({ id: 'clovis', nom: 'Clovis', periode: 'moyen-age' }),
      apercu({
        id: 'prise-de-la-bastille',
        nom: 'La prise de la Bastille',
        volet: 'evenements',
        periode: 'revolution',
      }),
    ]
    expect(periodesPresentes(liste, 'personnages', PERIODES)).toEqual(['moyen-age'])
    expect(periodesPresentes(liste, 'evenements', PERIODES)).toEqual(['revolution'])
  })
})

describe('comptes', () => {
  it('compte les fiches de chaque volet', () => {
    const liste: Apercu[] = [
      apercu({ id: 'clovis', nom: 'Clovis' }),
      apercu({ id: 'saint-louis', nom: 'Saint Louis' }),
      apercu({ id: 'bastille', nom: 'Bastille', volet: 'evenements' }),
    ]
    expect(comptes(liste)).toEqual({ personnages: 2, evenements: 1 })
  })
})

describe('indexDuJour', () => {
  it('rend le même index pour la même journée', () => {
    expect(indexDuJour('2026-09-20', 50)).toBe(indexDuJour('2026-09-20', 50))
  })

  it('change de citation d’un jour à l’autre', () => {
    const jours = ['2026-09-20', '2026-09-21', '2026-09-22', '2026-09-23']
    const tires = new Set(jours.map((jour) => indexDuJour(jour, 200)))
    expect(tires.size).toBeGreaterThan(1)
  })

  it('reste dans les bornes et supporte une liste vide', () => {
    expect(indexDuJour('2026-09-20', 0)).toBe(0)
    expect(indexDuJour('2026-09-20', 7)).toBeLessThan(7)
  })
})

describe('citationCourte', () => {
  it('laisse passer une citation courte', () => {
    expect(citationCourte('Je suis née pour cela.')).toBe('Je suis née pour cela.')
  })

  it('coupe au mot et pose des points de suspension', () => {
    const longue =
      'De l’amour ou de la haine que Dieu a pour les Anglais, je ne sais rien ; mais je sais bien qu’ils seront boutés hors de France.'
    const courte = citationCourte(longue, 40)
    expect(courte.endsWith('…')).toBe(true)
    expect([...courte].length).toBeLessThanOrEqual(41)
    // Pas de mot coupé en deux : le dernier morceau avant « … » est un mot entier.
    expect(longue.startsWith(courte.slice(0, -1))).toBe(true)
  })

  it('ne laisse pas de ponctuation orpheline avant les points de suspension', () => {
    expect(citationCourte('Paris, ville lumière et capitale', 7)).toBe('Paris…')
  })
})
