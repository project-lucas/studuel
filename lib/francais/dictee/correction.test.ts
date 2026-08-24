import { describe, expect, it } from 'vitest'
import {
  corrigerDictee,
  erreursAExpliquer,
  estMot,
  formatNote,
  noteSur20,
  normaliserJeton,
  tokeniser,
} from '@/lib/francais/dictee/correction'

const textes = (c: ReturnType<typeof corrigerDictee>, type: string) =>
  c.morceaux.filter((m) => m.type === type).map((m) => m.texte)

describe('tokeniser', () => {
  it('sépare les mots et la ponctuation', () => {
    expect(tokeniser('Le chat dort.')).toEqual(['Le', 'chat', 'dort', '.'])
  })

  it('garde l’apostrophe DANS le mot', () => {
    // « n'ai » est un mot : le couper ferait de chaque élision une faute.
    expect(tokeniser("je n'ai vu")).toEqual(['je', "n'ai", 'vu'])
  })

  it('garde le trait d’union DANS le mot', () => {
    expect(tokeniser('un rez-de-chaussée')).toEqual(['un', 'rez-de-chaussée'])
  })

  it('garde les accents et les majuscules', () => {
    expect(tokeniser('Étrange époque')).toEqual(['Étrange', 'époque'])
  })

  it('ignore les espaces et les retours à la ligne', () => {
    expect(tokeniser('  a \n\n b  ')).toEqual(['a', 'b'])
  })

  it('ne rend rien pour un texte vide', () => {
    expect(tokeniser('')).toEqual([])
    expect(tokeniser(null as unknown as string)).toEqual([])
  })
})

describe('normaliserJeton', () => {
  it('ramène les deux apostrophes à la même', () => {
    // Laquelle sort du clavier ne dépend pas de l'élève.
    expect(normaliserJeton('n’ai')).toBe("n'ai")
  })

  it('ne touche NI à la casse NI aux accents — c’est l’exercice', () => {
    expect(normaliserJeton('Étrange')).toBe('Étrange')
    expect(normaliserJeton('ÉTRANGE')).not.toBe('Étrange')
  })
})

describe('estMot', () => {
  it('distingue un mot d’un signe de ponctuation', () => {
    expect(estMot('chat')).toBe(true)
    expect(estMot('.')).toBe(false)
    expect(estMot('«')).toBe(false)
  })
})

describe('corrigerDictee — la copie parfaite', () => {
  it('garde tout, sans une seule erreur', () => {
    const c = corrigerDictee('Le chat dort.', 'Le chat dort.')
    expect(c.erreurs).toBe(0)
    expect(c.motsJustes).toBe(3)
    expect(c.motsAttendus).toBe(3)
    expect(c.morceaux).toEqual([{ type: 'garde', texte: 'Le chat dort .' }])
  })

  it('accepte l’autre apostrophe', () => {
    const c = corrigerDictee("je n'ai vu", 'je n’ai vu')
    expect(c.erreurs).toBe(0)
  })
})

describe('corrigerDictee — les fautes', () => {
  it('un mot mal orthographié = un manque ET un ajout', () => {
    const c = corrigerDictee('les chevaux', 'les chevals')
    expect(textes(c, 'manque')).toContain('chevaux')
    expect(textes(c, 'ajoute')).toContain('chevals')
    expect(c.motsJustes).toBe(1)
  })

  it('un mot oublié est un MANQUE, pas un ajout', () => {
    // L'ordre des arguments décide du vert et du rouge : les intervertir
    // échangerait les deux couleurs à l'écran.
    const c = corrigerDictee('le grand chat', 'le chat')
    expect(textes(c, 'manque')).toEqual(['grand'])
    expect(textes(c, 'ajoute')).toEqual([])
  })

  it('un mot en trop est un AJOUT', () => {
    const c = corrigerDictee('le chat', 'le gros chat')
    expect(textes(c, 'ajoute')).toEqual(['gros'])
    expect(textes(c, 'manque')).toEqual([])
  })

  it('un oubli au DÉBUT ne barre pas tout le reste', () => {
    // Le défaut classique d'un mauvais alignement : le décalage d'un mot fait
    // passer tout le paragraphe pour faux.
    const c = corrigerDictee('Or le chat dort ce soir', 'le chat dort ce soir')
    expect(c.erreurs).toBe(1)
    expect(c.motsJustes).toBe(5)
  })

  it('compte la ponctuation dans les morceaux mais PAS dans les erreurs', () => {
    // Un point oublié se voit à l'écran, sans faire chuter la note comme une
    // faute de grammaire.
    const c = corrigerDictee('Il dort.', 'Il dort')
    expect(textes(c, 'manque')).toEqual(['.'])
    expect(c.erreurs).toBe(0)
  })
})

describe('corrigerDictee — les cas limites', () => {
  it('une copie vide fait manquer tout le texte', () => {
    const c = corrigerDictee('Le chat dort.', '')
    expect(c.motsJustes).toBe(0)
    expect(c.erreurs).toBe(3)
    // Et surtout : la correction n'est pas VIDE — l'élève doit voir le texte.
    expect(c.morceaux).toHaveLength(1)
    expect(c.morceaux[0].type).toBe('manque')
  })

  it('un texte attendu vide ne casse pas', () => {
    const c = corrigerDictee('', 'du texte')
    expect(c.motsAttendus).toBe(0)
    expect(textes(c, 'ajoute')).toEqual(['du texte'])
  })

  it('deux textes vides ne rendent aucun morceau', () => {
    expect(corrigerDictee('', '').morceaux).toEqual([])
  })

  it('recolle les morceaux voisins de même nature', () => {
    // Sans ça, une phrase juste deviendrait vingt segments verts, et le texte
    // perdrait ses espaces au passage.
    const c = corrigerDictee('a b c d', 'a b c d')
    expect(c.morceaux).toHaveLength(1)
    expect(c.morceaux[0].texte).toBe('a b c d')
  })
})

describe('noteSur20', () => {
  it('une copie parfaite vaut 20', () => {
    expect(noteSur20({ motsAttendus: 40, motsJustes: 40 })).toBe(20)
  })

  it('une copie vide vaut 0', () => {
    expect(noteSur20({ motsAttendus: 40, motsJustes: 0 })).toBe(0)
  })

  it('est PROPORTIONNELLE — deux copies inégales ne valent pas toutes deux 0', () => {
    // Avec « 20 moins les fautes », une copie à 25 fautes et une copie vide
    // donnent le même zéro : l'élève ne voit aucune différence entre travailler
    // et ne rien rendre.
    const honnete = noteSur20({ motsAttendus: 150, motsJustes: 125 })
    const vide = noteSur20({ motsAttendus: 150, motsJustes: 0 })
    expect(honnete).toBeGreaterThan(vide)
    expect(honnete).toBeCloseTo(16.5, 1)
  })

  it('arrondit au demi-point', () => {
    expect(noteSur20({ motsAttendus: 3, motsJustes: 2 })).toBe(13.5)
  })

  it('ne dépasse jamais les bornes, même sur des entrées absurdes', () => {
    expect(noteSur20({ motsAttendus: 0, motsJustes: 10 })).toBe(0)
    expect(noteSur20({ motsAttendus: 10, motsJustes: 99 })).toBe(20)
    expect(noteSur20({ motsAttendus: -5, motsJustes: -5 })).toBe(0)
  })
})

describe('formatNote', () => {
  it('écrit la virgule décimale française', () => {
    expect(formatNote(13.5)).toBe('13,5')
  })

  it('n’ajoute pas de « ,0 » inutile', () => {
    expect(formatNote(20)).toBe('20')
    expect(formatNote(0)).toBe('0')
  })

  it('borne les valeurs aberrantes', () => {
    expect(formatNote(-3)).toBe('0')
    expect(formatNote(99)).toBe('20')
    expect(formatNote(Number.NaN)).toBe('0')
  })
})

describe('erreursAExpliquer', () => {
  it('donne à chaque erreur son voisinage', () => {
    const c = corrigerDictee('peur de mourir aujourd’hui', 'peur de mourire aujourd’hui')
    const e = erreursAExpliquer(c)
    expect(e[0].attendu).toBe('mourir')
    expect(e[0].avant).toBe('de')
    expect(e[0].apres).toBe('aujourd’hui')
  })

  it('ignore les mots justes', () => {
    const c = corrigerDictee('le chat dort', 'le chat dort')
    expect(erreursAExpliquer(c)).toEqual([])
  })

  it('ne liste PAS la ponctuation', () => {
    // Vingt entrées « virgule » noieraient les fautes de grammaire.
    const c = corrigerDictee('Il dort, puis part.', 'Il dort puis part')
    expect(erreursAExpliquer(c)).toEqual([])
  })

  it('borne la liste', () => {
    const attendu = Array.from({ length: 50 }, (_, i) => `mot${i}`).join(' ')
    const c = corrigerDictee(attendu, '')
    expect(erreursAExpliquer(c, 5)).toHaveLength(5)
  })
})
