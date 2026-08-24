import { describe, expect, it } from 'vitest'
import {
  comparerReponse,
  distanceEdition,
  fautesTolerees,
  isTolerance,
  normalizeTolerance,
  sansArticle,
  corrigerTrous,
  parseTrouAttendu,
  trousAttendus,
} from '@/lib/carnet/correction'

describe('distanceEdition', () => {
  it('vaut 0 pour deux chaînes identiques', () => {
    expect(distanceEdition('roosevelt', 'roosevelt')).toBe(0)
  })

  it('compte une substitution, une insertion, une suppression', () => {
    expect(distanceEdition('chat', 'chai')).toBe(1)
    expect(distanceEdition('roosevelt', 'rooseveltt')).toBe(1)
    expect(distanceEdition('rooseveltt', 'roosevelt')).toBe(1)
  })

  it('rend max + 1 dès que la borne est dépassée, sans finir le calcul', () => {
    expect(distanceEdition('abc', 'xyzxyzxyz', 2)).toBe(3)
  })

  it('gère les chaînes vides', () => {
    expect(distanceEdition('', 'abc', 5)).toBe(3)
    expect(distanceEdition('abc', '', 5)).toBe(3)
  })
})

describe('sansArticle', () => {
  it('retire l’article de tête', () => {
    expect(sansArticle('la seine')).toBe('seine')
    expect(sansArticle('les alpes')).toBe('alpes')
    expect(sansArticle('the beatles')).toBe('beatles')
  })

  it('traite l’élision comme un article', () => {
    expect(sansArticle("l'onu")).toBe('onu')
    expect(sansArticle('l’onu')).toBe('onu')
  })

  it('ne mange pas une réponse qui n’est QUE son article', () => {
    // Sinon « le » deviendrait la chaîne vide, qui égale n'importe quoi de vide.
    expect(sansArticle('le')).toBe('le')
  })

  it('laisse intacte une réponse sans article', () => {
    expect(sansArticle('napoleon')).toBe('napoleon')
  })
})

describe('fautesTolerees', () => {
  it('ne tolère rien en mode strict', () => {
    expect(fautesTolerees(20, 'stricte')).toBe(0)
  })

  it('ne tolère rien sur un mot très court', () => {
    // « chat » et « char » sont deux mots, pas une faute de frappe : sur quatre
    // lettres, une différence pèse le quart de la réponse.
    expect(fautesTolerees(3, 'normale')).toBe(0)
    expect(fautesTolerees(4, 'normale')).toBe(0)
    expect(fautesTolerees(4, 'large')).toBe(0)
  })

  it('tolère une faute sur un mot moyen, deux en mode large sur un mot long', () => {
    expect(fautesTolerees(6, 'normale')).toBe(1)
    expect(fautesTolerees(6, 'large')).toBe(1)
    expect(fautesTolerees(20, 'normale')).toBe(1)
    expect(fautesTolerees(20, 'large')).toBe(2)
  })
})

describe('comparerReponse — les cas qui motivaient ce module', () => {
  it('« l’ONU » vaut « ONU » — et ce n’est PAS un « presque »', () => {
    const issue = comparerReponse("l'ONU", ['ONU'])
    expect(issue.correct).toBe(true)
    expect(issue.presque).toBe(false)
  })

  it('« ONU » vaut « l’ONU » dans l’autre sens', () => {
    expect(comparerReponse('ONU', ["l'ONU"]).correct).toBe(true)
  })

  it('« Rooseveltt » est un PRESQUE, pas un faux', () => {
    const issue = comparerReponse('Rooseveltt', ['Roosevelt'])
    expect(issue.correct).toBe(true)
    expect(issue.presque).toBe(true)
    expect(issue.attendue).toBe('Roosevelt')
  })

  it('un accent manquant reste juste (déjà normalisé)', () => {
    expect(comparerReponse('ecole', ['école']).presque).toBe(false)
    expect(comparerReponse('ecole', ['école']).correct).toBe(true)
  })
})

describe('comparerReponse — ce qui doit rester faux', () => {
  it('une vraie erreur reste fausse', () => {
    expect(comparerReponse('Churchill', ['Roosevelt']).correct).toBe(false)
  })

  it('une réponse vide est fausse', () => {
    expect(comparerReponse('   ', ['Roosevelt']).correct).toBe(false)
  })

  it('aucune réponse attendue = faux (jamais « tout est juste »)', () => {
    expect(comparerReponse('quoi que ce soit', []).correct).toBe(false)
  })

  it('deux mots courts qui diffèrent d’une lettre restent distincts', () => {
    expect(comparerReponse('char', ['chat']).correct).toBe(false)
  })

  it('le mode strict refuse la faute de frappe', () => {
    expect(comparerReponse('Rooseveltt', ['Roosevelt'], 'stricte').correct).toBe(
      false,
    )
  })
})

describe('comparerReponse — la meilleure issue l’emporte', () => {
  it('une réponse exacte bat un « presque » trouvé ailleurs dans la liste', () => {
    const issue = comparerReponse('Truman', ['Trumann', 'Truman'])
    expect(issue.correct).toBe(true)
    expect(issue.presque).toBe(false)
  })

  it('plusieurs réponses acceptées : n’importe laquelle suffit', () => {
    expect(comparerReponse('USA', ['États-Unis', 'USA']).correct).toBe(true)
  })

  it('le mode large accepte deux fautes sur un mot long', () => {
    const issue = comparerReponse(
      'anticonstitutionellemant',
      ['anticonstitutionnellement'],
      'large',
    )
    expect(issue.correct).toBe(true)
    expect(issue.presque).toBe(true)
  })
})

describe('normalizeTolerance', () => {
  it('accepte les trois réglages', () => {
    expect(isTolerance('stricte')).toBe(true)
    expect(isTolerance('large')).toBe(true)
    expect(isTolerance('molle')).toBe(false)
  })

  it('retombe sur « normale » pour tout le reste', () => {
    expect(normalizeTolerance(undefined)).toBe('normale')
    expect(normalizeTolerance('molle')).toBe('normale')
    expect(normalizeTolerance('stricte')).toBe('stricte')
  })
})

describe('parseTrouAttendu', () => {
  it('un trou à l’ancienne n’a qu’une réponse et aucun indice', () => {
    expect(parseTrouAttendu('Seine')).toEqual({
      reponses: ['Seine'],
      indice: null,
    })
  })

  it('découpe les variantes acceptées', () => {
    expect(parseTrouAttendu('Seine|la Seine').reponses).toEqual([
      'Seine',
      'la Seine',
    ])
  })

  it('sépare l’indice', () => {
    const t = parseTrouAttendu('Seine::le fleuve de Paris')
    expect(t.reponses).toEqual(['Seine'])
    expect(t.indice).toBe('le fleuve de Paris')
  })

  it('combine variantes et indice', () => {
    const t = parseTrouAttendu('Seine|la Seine::le fleuve de Paris')
    expect(t.reponses).toEqual(['Seine', 'la Seine'])
    expect(t.indice).toBe('le fleuve de Paris')
  })

  it('ignore les variantes vides', () => {
    expect(parseTrouAttendu('Seine||').reponses).toEqual(['Seine'])
  })
})

describe('trousAttendus', () => {
  it('lit tous les trous d’un texte', () => {
    const t = trousAttendus('La [Seine|la Seine] traverse [Paris::la capitale].')
    expect(t).toHaveLength(2)
    expect(t[0].reponses).toEqual(['Seine', 'la Seine'])
    expect(t[1].indice).toBe('la capitale')
  })
})

describe('corrigerTrous', () => {
  const TEXTE = 'La [Seine] traverse [Paris].'

  it('tous les trous justes = juste', () => {
    expect(corrigerTrous(TEXTE, ['Seine', 'Paris']).correct).toBe(true)
  })

  it('un trou faux = faux, même si l’autre est juste', () => {
    expect(corrigerTrous(TEXTE, ['Seine', 'Lyon']).correct).toBe(false)
  })

  it('un nombre de réponses qui ne colle pas = faux', () => {
    expect(corrigerTrous(TEXTE, ['Seine']).correct).toBe(false)
    expect(corrigerTrous(TEXTE, ['Seine', 'Paris', 'Lyon']).correct).toBe(false)
  })

  it('un texte sans trou = faux (rien à corriger)', () => {
    expect(corrigerTrous('Aucun trou ici.', []).correct).toBe(false)
  })

  it('une variante acceptée passe', () => {
    const texte = 'Le fleuve est la [Seine|Sequana].'
    expect(corrigerTrous(texte, ['Sequana']).correct).toBe(true)
  })

  it('l’indice ne fait PAS partie des réponses acceptées', () => {
    // Sinon écrire l'indice vaudrait la bonne réponse.
    const texte = 'Le fleuve est la [Seine::le fleuve de Paris].'
    expect(corrigerTrous(texte, ['le fleuve de Paris']).correct).toBe(false)
    expect(corrigerTrous(texte, ['Seine']).correct).toBe(true)
  })

  it('une faute de frappe sur un trou vaut « presque »', () => {
    const texte = 'Le président était [Roosevelt].'
    const issue = corrigerTrous(texte, ['Rooseveltt'])
    expect(issue.correct).toBe(true)
    expect(issue.presque).toBe(true)
    expect(issue.attendue).toBe('Roosevelt')
  })

  it('l’article en trop ne pénalise pas', () => {
    expect(corrigerTrous(TEXTE, ['la Seine', 'Paris']).correct).toBe(true)
  })
})
