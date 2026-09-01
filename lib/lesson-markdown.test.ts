import { describe, expect, it } from 'vitest'
import {
  alerte,
  cellules,
  chaine,
  construireTableau,
  estLigneTableau,
  estSeparateurTableau,
  etapeNumerotee,
  formule,
  jalon,
  segmenterInline,
} from './lesson-markdown'

describe('segmenterInline', () => {
  it('rend l’italique — le défaut qui touchait 43 % des cours', () => {
    // 11 237 occurrences affichaient leurs astérisques à l'écran, et d'abord
    // en LANGUES, où l'italique porte l'exemple : « *a book* » au lieu de
    // a book.
    expect(segmenterInline('un exemple : *a book*')).toEqual([
      { type: 'texte', valeur: 'un exemple : ' },
      { type: 'italique', valeur: 'a book' },
    ])
  })

  it('rend le gras', () => {
    expect(segmenterInline('le **terme** à retenir')).toEqual([
      { type: 'texte', valeur: 'le ' },
      { type: 'gras', valeur: 'terme' },
      { type: 'texte', valeur: ' à retenir' },
    ])
  })

  it('LE GRAS N’EST PAS MANGÉ PAR L’ITALIQUE', () => {
    // LE test de ce module. Si l'alternative `*…*` passait avant `**…**` dans
    // la regex, `**gras**` se lirait comme un italique vide suivi de texte —
    // et le gras disparaîtrait de TOUS les cours de l'app d'un coup.
    const frags = segmenterInline('**important**')
    expect(frags).toEqual([{ type: 'gras', valeur: 'important' }])
    expect(frags.some((f) => f.type === 'italique')).toBe(false)
  })

  it('gère gras et italique dans la même ligne', () => {
    expect(segmenterInline('**the** devant *the sun*')).toEqual([
      { type: 'gras', valeur: 'the' },
      { type: 'texte', valeur: ' devant ' },
      { type: 'italique', valeur: 'the sun' },
    ])
  })

  it('laisse une astérisque isolée tranquille', () => {
    // Sans la borne `[^*\n]`, une étoile solitaire avalerait la fin de la
    // phrase — le paragraphe entier basculerait en italique.
    const t = 'la note 5* est rare'
    expect(segmenterInline(t)).toEqual([{ type: 'texte', valeur: t }])
  })

  it('ne franchit jamais une fin de ligne', () => {
    const frags = segmenterInline('début *ouvert\nligne suivante*')
    expect(frags.every((f) => f.type === 'texte')).toBe(true)
  })

  it('ignore les marqueurs vides', () => {
    // `**` et `*` seuls ne doivent produire ni gras ni italique vide : les deux
    // alternatives exigent au moins un caractère entre les bornes.
    expect(segmenterInline('a ** b')).toEqual([{ type: 'texte', valeur: 'a ** b' }])
    expect(segmenterInline('a * b')).toEqual([{ type: 'texte', valeur: 'a * b' }])
  })

  it('rend une ligne sans marqueur en un seul fragment', () => {
    expect(segmenterInline('texte simple')).toEqual([
      { type: 'texte', valeur: 'texte simple' },
    ])
  })
})

describe('tableaux', () => {
  it('reconnaît une ligne de tableau et sa ligne de séparation', () => {
    expect(estLigneTableau('| a | b |')).toBe(true)
    expect(estLigneTableau('du texte ordinaire')).toBe(false)
    expect(estSeparateurTableau('|---|---|')).toBe(true)
    expect(estSeparateurTableau('|:---|---:|')).toBe(true)
    expect(estSeparateurTableau('| a | b |')).toBe(false)
  })

  it('découpe les cellules sans les tuyaux de bord', () => {
    expect(cellules('| singulier | pluriel |')).toEqual(['singulier', 'pluriel'])
  })

  it('construit un tableau en jetant le séparateur', () => {
    const t = construireTableau(['| a | b |', '|---|---|', '| 1 | 2 |'])
    expect(t).toEqual({ entete: ['a', 'b'], corps: [['1', '2']] })
  })

  it('rend null quand il ne reste rien à peindre', () => {
    // Un cadre vide serait pire que pas de tableau du tout.
    expect(construireTableau(['|---|---|'])).toBeNull()
    expect(construireTableau([])).toBeNull()
  })
})

describe('etapeNumerotee', () => {
  it('reconnaît une étape', () => {
    expect(etapeNumerotee('1. Protéger')).toBe('Protéger')
    expect(etapeNumerotee('12. Douzième point')).toBe('Douzième point')
  })

  it('NE prend PAS une année pour une étape', () => {
    // « 1985. Une année charnière » est une phrase ordinaire dans un cours
    // d'histoire. Sans la borne à deux chiffres, elle deviendrait une liste
    // numérotée d'un seul élément, au beau milieu d'un paragraphe.
    expect(etapeNumerotee('1985. Une année charnière')).toBeNull()
  })

  it('exige le point ET l’espace', () => {
    expect(etapeNumerotee('1.Protéger')).toBeNull()
    expect(etapeNumerotee('1 Protéger')).toBeNull()
  })
})

// -----------------------------------------------------------------------------
// LES QUATRE BLOCS DU COLLÈGE
// -----------------------------------------------------------------------------

describe('alerte', () => {
  it('reconnaît le piège', () => {
    expect(alerte('!> 12,7 est plus grand que 12,25.')).toBe(
      '12,7 est plus grand que 12,25.',
    )
  })

  it('NE confond PAS l’alerte et l’idée clé', () => {
    // LE test de ce bloc. `!> ` et `> ` doivent rester deux choses : l'or dit
    // « emporte ça », le corail dit « ne tombe pas là-dedans ». Un élève de
    // sixième qui voit deux encadrés de la même couleur n'apprend pas lequel
    // est le piège.
    expect(alerte('> Une idée à retenir.')).toBeNull()
  })

  it('exige l’espace après le marqueur', () => {
    expect(alerte('!>collé')).toBeNull()
  })
})

describe('formule', () => {
  it('reconnaît la formule', () => {
    expect(formule('= Aire = Longueur × largeur')).toBe(
      'Aire = Longueur × largeur',
    )
  })

  it('ne mord pas sur une phrase qui contient un égal', () => {
    expect(formule('On écrit alors 3 = 3,0.')).toBeNull()
  })
})

describe('jalon', () => {
  it('sépare la date de l’événement', () => {
    expect(jalon('@ 1789 — Prise de la Bastille')).toEqual({
      date: '1789',
      evenement: 'Prise de la Bastille',
    })
  })

  it('accepte une date qui n’est pas un nombre', () => {
    // « Vers 3300 av. J.-C. », « IIe siècle », « 1914-1918 » : au collège, la
    // date d'une frise est presque toujours une expression, pas un entier.
    expect(jalon('@ Vers 3300 av. J.-C. — Naissance de l’écriture')).toEqual({
      date: 'Vers 3300 av. J.-C.',
      evenement: 'Naissance de l’écriture',
    })
  })

  it('refuse un jalon sans événement', () => {
    // Une frise dont les jalons sont muets ne vaut rien : mieux vaut que la
    // ligne retombe en paragraphe ordinaire que d'afficher une date seule
    // sur un rail.
    expect(jalon('@ 1789')).toBeNull()
    expect(jalon('@ 1789 - tiret court')).toBeNull()
  })
})

describe('chaine', () => {
  it('découpe les maillons', () => {
    expect(chaine('~ Évaporation → Condensation → Pluie')).toEqual([
      'Évaporation',
      'Condensation',
      'Pluie',
    ])
  })

  it('refuse un maillon seul', () => {
    // Sans flèche, ce n'est pas un schéma : c'est une phrase.
    expect(chaine('~ Évaporation')).toBeNull()
  })

  it('LAISSE LA PROSE FLÉCHÉE TRANQUILLE', () => {
    // 154 lignes du dépôt contiennent déjà « → » en pleine phrase
    // (*alt → älter*, « 3,47 → 3,5 »). Reconnaître la chaîne à ses flèches
    // seules les aurait toutes transformées en schémas ; le marqueur `~ ` est
    // là pour ça.
    expect(chaine('Beaucoup d’adjectifs : *alt → älter*, *jung → jünger*.')).toBeNull()
  })
})
