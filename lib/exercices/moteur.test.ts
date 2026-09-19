import { describe, expect, it } from 'vitest'
import { compilerExercice, melanger } from './compiler'
import { juger } from './juger'
import { decouper, motsMarques, oterMarques } from './mots'
import { formaterNombre, lireNombre, normaliser } from './normaliser'
import { bilan, etatsExercices, pointsQuestion } from './progression'
import type { ExerciceSource } from './types'
import { validerExercice } from './valider'
import { graduations, idGraduation } from './zones'

const CHAP = '0399dc65-9d41-56cc-a0c0-e68818658988'

describe('normaliser — le miroir de exercice_normaliser (SQL)', () => {
  it.each([
    ['la Loire', 'la loire'],
    ['LOÏRE', 'loire'],
    ['  Là, c’est  l’ÉTÉ ! ', 'la c est l ete'],
    ['Œuvre', 'oeuvre'],
    ['cœur', 'coeur'],
    ['Straße', 'strasse'],
    ['Moyen-Orient', 'moyen orient'],
    ['12,5', '12 5'],
    ['ÀÉÎÕÜÇÑ', 'aeioucn'],
    ['...', ''],
  ])('%s → %s', (entree, attendu) => {
    expect(normaliser(entree)).toBe(attendu)
  })
})

describe('lireNombre / formaterNombre', () => {
  it.each([
    ['12,5', 12.5],
    ['12.5', 12.5],
    [' 1 200 ', 1200],
    ['-3', -3],
    ['−3', -3],
    ['3/4', 0.75],
    ['0,25', 0.25],
    ['abc', null],
    ['', null],
    ['1/0', null],
    ['12,5 cm', null],
  ])('%s → %s', (s, n) => {
    expect(lireNombre(s)).toBe(n)
  })

  it('écrit à la française, sans grouper une année', () => {
    expect(formaterNombre(12.5)).toBe('12,5')
    expect(formaterNombre(1789)).toBe('1789')
    expect(formaterNombre(125000)).toBe('125 000')
    expect(formaterNombre(-0.25)).toBe('−0,25')
    expect(formaterNombre(1 / 3)).toBe('0,3333')
  })
})

describe('mots — le découpage partagé écran / compilateur', () => {
  it('coupe les élisions françaises, pas « aujourd’hui » ni l’anglais', () => {
    const mots = (s: string) =>
      decouper(s).jetons.flatMap((j) => (j.kind === 'mot' ? [j.texte] : []))
    expect(mots("L'enfant qu’il voit aujourd'hui")).toEqual(["L'", 'enfant', 'qu’', 'il', 'voit', "aujourd'hui"])
    expect(mots("It's a dog. I'm happy, don't worry")).toEqual(["It's", 'a', 'dog', "I'm", 'happy', "don't", 'worry'])
    expect(mots('peut-être, le Moyen-Orient')).toEqual(['peut-être', 'le', 'Moyen-Orient'])
  })

  it('suit le gras, l’italique et les fractions sans en faire des mots', () => {
    const { jetons, suivant } = decouper('Le **grand** *chat* mange {{3/4}} du gâteau', 10)
    const mots = jetons.filter((j) => j.kind === 'mot')
    expect(mots.map((m) => m.index)).toEqual([10, 11, 12, 13, 14, 15])
    expect(suivant).toBe(16)
    expect(mots[1]).toMatchObject({ texte: 'grand', gras: true, italique: false })
    expect(mots[2]).toMatchObject({ texte: 'chat', italique: true })
    expect(jetons.some((j) => j.kind === 'fraction' && j.num === '3' && j.den === '4')).toBe(true)
  })

  it('ôte les marques et retrouve les numéros des mots marqués, bloc après bloc', () => {
    expect(oterMarques('Le [[v|chat]] [[v|dort]].').texte).toBe('Le chat dort.')
    const { nettoyees, groupes, total } = motsMarques(['Le [[s|chat]] dort.', 'Il [[v|rêve]] de [[s|souris]].'])
    expect(nettoyees).toEqual(['Le chat dort.', 'Il rêve de souris.'])
    expect(groupes.get('s')).toEqual([1, 6])
    expect(groupes.get('v')).toEqual([4])
    expect(total).toBe(7)
  })
})

describe('juger — le miroir de exercice_juger (SQL)', () => {
  it('choix et zones : l’ensemble exact, ni plus ni moins', () => {
    const cle = { type: 'zone' as const, ids: ['m3', 'm7'] }
    expect(juger(cle, { ids: ['m7', 'm3'] })).toEqual({ juste: true, bons: 2, total: 2 })
    expect(juger(cle, { ids: ['m7', 'm3', 'm9'] })).toEqual({ juste: false, bons: 2, total: 2 })
    expect(juger(cle, { ids: ['m3'] })).toEqual({ juste: false, bons: 1, total: 2 })
    expect(juger(cle, { ids: ['m3', 'm3', 'm7'] }).juste).toBe(true)
    expect(juger(cle, null).juste).toBe(false)
  })

  it('ordre : la bonne suite, et combien de places sont justes', () => {
    const cle = { type: 'ordre' as const, ids: ['c', 'a', 'b'] }
    expect(juger(cle, { ids: ['c', 'a', 'b'] }).juste).toBe(true)
    expect(juger(cle, { ids: ['c', 'b', 'a'] })).toEqual({ juste: false, bons: 1, total: 3 })
    expect(juger(cle, { ids: ['c', 'a'] }).juste).toBe(false)
  })

  it('nombre : un nombre JSON, à la tolérance près', () => {
    const cle = { type: 'nombre' as const, valeur: 12.5, tolerance: 0 }
    expect(juger(cle, { valeur: 12.5 }).juste).toBe(true)
    expect(juger(cle, { valeur: 12.6 }).juste).toBe(false)
    expect(juger({ type: 'nombre', valeur: 0.3, tolerance: 0 }, { valeur: 0.1 + 0.2 }).juste).toBe(true)
    expect(juger({ type: 'nombre', valeur: 100, tolerance: 5 }, { valeur: 96 }).juste).toBe(true)
    expect(juger(cle, { valeur: '12.5' } as never).juste).toBe(false)
  })

  it('texte : normalisé, parmi les réponses acceptées', () => {
    const cle = { type: 'texte' as const, acceptes: ['loire', 'la loire'] }
    expect(juger(cle, { texte: '  La LOIRE ' }).juste).toBe(true)
    expect(juger(cle, { texte: 'Seine' }).juste).toBe(false)
    expect(juger(cle, { texte: '' }).juste).toBe(false)
  })

  it('paires et catégories : combien sont justes', () => {
    const cle = { type: 'association' as const, paires: { g0: 'd1', g1: 'd0' } }
    expect(juger(cle, { paires: { g0: 'd1', g1: 'd0' } }).juste).toBe(true)
    expect(juger(cle, { paires: { g0: 'd1', g1: 'd1' } })).toEqual({ juste: false, bons: 1, total: 2 })
    expect(juger({ type: 'categories', items: { i0: 'c1' } }, { items: { i0: 1 } } as never).juste).toBe(false)
  })

  it('trous : chaque trou parmi ses réponses', () => {
    const cle = { type: 'trous' as const, trous: [['dort'], ['miaule', 'ronronne']] }
    expect(juger(cle, { trous: ['Dort', 'ronronne'] }).juste).toBe(true)
    expect(juger(cle, { trous: ['dort', 'aboie'] })).toEqual({ juste: false, bons: 1, total: 2 })
  })
})

describe('progression — le barème miroir de exercice_terminer', () => {
  it('2 points du premier coup, 1 au second, 0 sinon', () => {
    expect(pointsQuestion({ essais: 1, juste: true })).toBe(2)
    expect(pointsQuestion({ essais: 2, juste: true })).toBe(1)
    expect(pointsQuestion({ essais: 2, juste: false })).toBe(0)
  })

  it('réussi à la moitié des points, sans faute à tous', () => {
    expect(bilan([{ essais: 1, juste: true }, { essais: 2, juste: false }])).toEqual({
      score: 2,
      max: 4,
      reussi: true,
      parfait: false,
    })
    expect(bilan([{ essais: 2, juste: true }, { essais: 2, juste: false }]).reussi).toBe(false)
    expect(bilan([{ essais: 1, juste: true }]).parfait).toBe(true)
    expect(bilan([]).reussi).toBe(false)
  })

  it('débloque au fur et à mesure', () => {
    const ex = [
      { id: 'b', position: 2 },
      { id: 'a', position: 1 },
      { id: 'c', position: 3 },
    ]
    expect([...etatsExercices(ex, new Map()).entries()]).toEqual([
      ['a', 'ouvert'],
      ['b', 'verrouille'],
      ['c', 'verrouille'],
    ])
    const r = etatsExercices(ex, new Map([['a', { reussi: true }]]))
    expect(r.get('a')).toBe('reussi')
    expect(r.get('b')).toBe('ouvert')
    expect(r.get('c')).toBe('verrouille')
  })
})

describe('droite graduée — les identifiants de graduation', () => {
  it('énumère principales et fines', () => {
    expect(graduations({ min: 0, max: 2, pas: 1, division: 4 })).toEqual([0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2])
    expect(idGraduation(0.1 + 0.2)).toBe('v0.3')
    expect(idGraduation(-1)).toBe('v-1')
  })
})

// --------------------------------------------------------------- compilation

const exemple: ExerciceSource = {
  chapitre: CHAP,
  position: 1,
  etoiles: 1,
  titre: 'Le goûter de la classe',
  competence: 'resoudre',
  situation: 'La classe de 6e B prépare un goûter.',
  documents: [
    {
      id: 'doc1',
      type: 'texte',
      genre: 'recit',
      blocs: ['Le [[n|chat]] [[v|dort]] sur le toit.', "L'oiseau [[v|chante]]."],
    },
    {
      id: 'doc2',
      type: 'chaine',
      disposition: 'ligne',
      noeuds: [
        { id: 'herbe', texte: 'Herbe' },
        { id: 'lapin', texte: 'Lapin' },
        { id: 'renard', texte: 'Renard' },
      ],
      liens: [
        { de: 'herbe', a: 'lapin' },
        { de: 'lapin', a: 'renard' },
      ],
    },
  ],
  questions: [
    { type: 'choix', enonce: 'Combien font 2 + 2 ?', options: ['3', '4', '5', '22'], reponse: 1, explication: '2 + 2 = 4.' },
    { type: 'zone', document: 'doc1', enonce: 'Touche les verbes.', reponse: ['v'], explication: 'Dort et chante.' },
    { type: 'zone', document: 'doc2', enonce: 'Touche le prédateur.', reponse: ['renard'], explication: 'Le renard.' },
    {
      type: 'ordre',
      enonce: 'Range du plus petit au plus grand.',
      items: ['1', '2', '3', '4'],
      explication: 'Dans l’ordre croissant.',
    },
  ],
}

describe('compilerExercice', () => {
  const { public: pub, cles } = compilerExercice(exemple)

  it('ne laisse partir aucune réponse ni explication', () => {
    const json = JSON.stringify(pub)
    expect(json).not.toContain('explication')
    expect(json).not.toContain('reponse')
    expect(json).not.toContain('[[')
    expect(cles).toHaveLength(4)
  })

  it('nomme les options dans l’ordre d’affichage et garde la bonne en clé', () => {
    const q = pub.questions[0]
    if (q.type !== 'choix') throw new Error('choix attendu')
    expect(q.options.map((o) => o.id)).toEqual(['a', 'b', 'c', 'd'])
    const cle = cles[0].cle
    if (cle.type !== 'choix') throw new Error()
    expect(q.options.find((o) => o.id === cle.ids[0])?.texte).toBe('4')
  })

  it('traduit les mots marqués en numéros de mots', () => {
    expect(cles[1].cle).toEqual({ type: 'zone', ids: ['m2', 'm8'] })
  })

  it('neutralise les identifiants écrits (le renard ne s’appelle plus « renard »)', () => {
    const doc = pub.documents[1]
    if (doc.type !== 'chaine') throw new Error()
    expect(doc.noeuds.map((n) => n.id)).toEqual(['z1', 'z2', 'z3'])
    expect(doc.liens).toEqual([
      { de: 'z1', a: 'z2' },
      { de: 'z2', a: 'z3' },
    ])
    expect(cles[2].cle).toEqual({ type: 'zone', ids: ['z3'] })
  })

  it('mélange l’ordre à retrouver, jamais dans le bon ordre', () => {
    const q = pub.questions[3]
    if (q.type !== 'ordre') throw new Error()
    expect(q.items.map((i) => i.texte)).not.toEqual(['1', '2', '3', '4'])
    const cle = cles[3].cle
    if (cle.type !== 'ordre') throw new Error()
    expect(cle.ids.map((id) => q.items.find((i) => i.id === id)?.texte)).toEqual(['1', '2', '3', '4'])
    expect(juger(cle, { ids: cle.ids }).juste).toBe(true)
  })

  it('est déterministe', () => {
    expect(compilerExercice(exemple)).toEqual(compilerExercice(exemple))
    expect(melanger(5, 'x')).toEqual(melanger(5, 'x'))
  })
})

describe('validerExercice', () => {
  it('accepte un exercice bien formé', () => {
    expect(validerExercice(exemple)).toEqual([])
  })

  it('signale les fautes qui feraient déclarer faux un élève qui a juste', () => {
    const faux: ExerciceSource = {
      ...exemple,
      etoiles: 2,
      questions: [
        { type: 'choix', enonce: 'Une question ?', options: ['a', 'b'], reponse: 3, explication: 'Parce que.' },
        { type: 'zone', document: 'doc2', enonce: 'Touche le loup.', reponse: ['loup'], explication: 'Le loup.' },
        { type: 'trous', enonce: 'Complète.', texte: 'Le ___ dort.', reponses: [['chat'], ['chien']], explication: 'Chat.' },
      ],
    }
    const messages = validerExercice(faux).map((f) => f.message)
    expect(messages.some((m) => m.includes('vaut 1 étoile'))).toBe(true)
    expect(messages.some((m) => m.includes("pas d'option"))).toBe(true)
    expect(messages.some((m) => m.includes('« loup » introuvable'))).toBe(true)
    expect(messages.some((m) => m.includes('1 trou(s) mais 2'))).toBe(true)
  })

  it('refuse une région inconnue ou non cliquable sur une carte', () => {
    const carte: ExerciceSource = {
      ...exemple,
      documents: [{ id: 'c', type: 'carte', fond: 'france', regions: [{ code: 'XYZ', teinte: 'vert' }] }],
      questions: [
        { type: 'zone', document: 'c', enonce: 'Touche la Bretagne.', reponse: ['BRE'], explication: 'À l’ouest.' },
        { type: 'nombre', enonce: 'Combien de régions ?', reponse: 13, explication: 'Treize.' },
      ],
    }
    const messages = validerExercice(carte).map((f) => f.message)
    expect(messages.some((m) => m.includes('« XYZ »'))).toBe(true)
    expect(messages.some((m) => m.includes('regionsCliquables'))).toBe(true)
  })
})
