import { describe, expect, it } from 'vitest'
import {
  devinerSeparateur,
  lireCollage,
  MAX_CARTES_IMPORT,
  MAX_FACE,
  nettoyerSaisie,
} from '@/lib/carnet/import-colle'

describe('devinerSeparateur', () => {
  it('reconnaît la tabulation (copier-coller de tableur)', () => {
    expect(devinerSeparateur(['dog\tchien', 'cat\tchat'])).toBe('tabulation')
  })

  it('reconnaît le point-virgule', () => {
    expect(devinerSeparateur(['dog;chien', 'cat;chat'])).toBe('point-virgule')
  })

  it('reconnaît le tiret entouré d’espaces', () => {
    expect(devinerSeparateur(['dog - chien', 'cat - chat'])).toBe('tiret')
  })

  it('reconnaît la virgule', () => {
    expect(devinerSeparateur(['dog,chien', 'cat,chat'])).toBe('virgule')
  })

  it('choisit celui qui découpe le PLUS de lignes, pas le premier trouvé', () => {
    // Les virgules sont DANS les définitions : la tabulation doit gagner.
    const lignes = [
      'dog\tchien, animal domestique',
      'cat\tchat, félin',
      'bird\toiseau, animal à plumes',
    ]
    expect(devinerSeparateur(lignes)).toBe('tabulation')
  })
})

describe('lireCollage — le cas courant', () => {
  it('lit une liste de vocabulaire tabulée', () => {
    const { cartes, rejets } = lireCollage('dog\tchien\ncat\tchat')
    expect(cartes).toEqual([
      { recto: 'dog', verso: 'chien' },
      { recto: 'cat', verso: 'chat' },
    ])
    expect(rejets).toHaveLength(0)
  })

  it('ignore les lignes vides sans les signaler', () => {
    const { cartes, rejets } = lireCollage('dog\tchien\n\n\ncat\tchat')
    expect(cartes).toHaveLength(2)
    expect(rejets).toHaveLength(0)
  })

  it('rogne les espaces autour des colonnes', () => {
    const { cartes } = lireCollage('  dog  \t  chien  ')
    expect(cartes[0]).toEqual({ recto: 'dog', verso: 'chien' })
  })

  it('ne coupe qu’au PREMIER séparateur — le reste est le verso', () => {
    const { cartes } = lireCollage('to run ; courir ; filer')
    expect(cartes[0]).toEqual({ recto: 'to run', verso: 'courir ; filer' })
  })

  it('retire les guillemets d’un vrai CSV', () => {
    const { cartes } = lireCollage('"dog";"chien, animal"')
    expect(cartes[0]).toEqual({ recto: 'dog', verso: 'chien, animal' })
  })

  it('ne coupe pas un mot composé sur son tiret', () => {
    // « rez-de-chaussée » ne doit pas devenir deux cartes : le tiret n'est un
    // séparateur QUE s'il est entouré d'espaces.
    const { cartes } = lireCollage('rez-de-chaussée\tground floor')
    expect(cartes[0].recto).toBe('rez-de-chaussée')
  })
})

describe('lireCollage — ce qui est rejeté, et dit', () => {
  it('signale une ligne sans deuxième colonne', () => {
    const { cartes, rejets } = lireCollage('dog\tchien\njuste-un-mot')
    expect(cartes).toHaveLength(1)
    expect(rejets).toEqual([
      { ligne: 2, texte: 'juste-un-mot', raison: 'une-seule-colonne' },
    ])
  })

  it('signale un doublon de recto', () => {
    const { cartes, rejets } = lireCollage('dog\tchien\ndog\tclébard')
    expect(cartes).toHaveLength(1)
    expect(rejets[0].raison).toBe('doublon')
  })

  it('le doublon ignore la casse', () => {
    const { cartes } = lireCollage('Dog\tchien\ndog\tchien')
    expect(cartes).toHaveLength(1)
  })

  it('signale une face trop longue', () => {
    const long = 'a'.repeat(MAX_FACE + 1)
    const { cartes, rejets } = lireCollage(`dog\t${long}`)
    expect(cartes).toHaveLength(0)
    expect(rejets[0].raison).toBe('trop-long')
  })

  it('garde le numéro de ligne d’origine (lignes vides comprises)', () => {
    const { rejets } = lireCollage('dog\tchien\n\nseul')
    expect(rejets[0].ligne).toBe(3)
  })

  it('borne le nombre de cartes importées', () => {
    const texte = Array.from(
      { length: MAX_CARTES_IMPORT + 10 },
      (_, i) => `mot${i}\tdef${i}`,
    ).join('\n')
    const { cartes, rejets } = lireCollage(texte)
    expect(cartes).toHaveLength(MAX_CARTES_IMPORT)
    expect(rejets.length).toBeGreaterThan(0)
  })
})

describe('lireCollage — séparateur imposé', () => {
  it('respecte le choix de l’élève contre la devinette', () => {
    // Deviné : virgule. Imposé : point-virgule.
    const { cartes } = lireCollage('a,b;c,d', 'point-virgule')
    expect(cartes[0]).toEqual({ recto: 'a,b', verso: 'c,d' })
  })

  it('rend le séparateur retenu pour l’afficher', () => {
    expect(lireCollage('dog\tchien').separateur).toBe('tabulation')
  })
})

describe('lireCollage — cas limites', () => {
  it('un texte vide ne rend rien et ne casse pas', () => {
    const { cartes, rejets } = lireCollage('')
    expect(cartes).toHaveLength(0)
    expect(rejets).toHaveLength(0)
  })

  it('un recto vide est rejeté', () => {
    const { cartes, rejets } = lireCollage('\tchien')
    expect(cartes).toHaveLength(0)
    expect(rejets[0].raison).toBe('vide')
  })

  it('accepte les fins de ligne Windows', () => {
    const { cartes } = lireCollage('dog\tchien\r\ncat\tchat')
    expect(cartes).toHaveLength(2)
    expect(cartes[1].verso).toBe('chat')
  })
})

describe('nettoyerSaisie (mode rafale)', () => {
  it('jette les lignes à moitié remplies', () => {
    // Sinon l'élève se retrouve avec des brouillons invisibles dans son cours.
    const cartes = nettoyerSaisie([
      { recto: 'dog', verso: 'chien' },
      { recto: 'cat', verso: '' },
      { recto: '', verso: 'oiseau' },
    ])
    expect(cartes).toEqual([{ recto: 'dog', verso: 'chien' }])
  })

  it('dédoublonne', () => {
    const cartes = nettoyerSaisie([
      { recto: 'dog', verso: 'chien' },
      { recto: 'DOG', verso: 'clébard' },
    ])
    expect(cartes).toHaveLength(1)
  })

  it('rogne et borne les faces', () => {
    const cartes = nettoyerSaisie([
      { recto: '  dog  ', verso: 'x'.repeat(MAX_FACE + 50) },
    ])
    expect(cartes[0].recto).toBe('dog')
    expect(cartes[0].verso).toHaveLength(MAX_FACE)
  })

  it('borne le nombre de cartes', () => {
    const brutes = Array.from({ length: MAX_CARTES_IMPORT + 5 }, (_, i) => ({
      recto: `m${i}`,
      verso: `d${i}`,
    }))
    expect(nettoyerSaisie(brutes)).toHaveLength(MAX_CARTES_IMPORT)
  })
})
