import { describe, it, expect } from 'vitest'
import {
  CONTEXTE_MESSAGE_LEN,
  MAX_TITRE_LEN,
  contexteFor,
  dernierEchange,
  nettoyerTitre,
  quandDit,
  titreAuto,
  type Message,
} from '@/lib/coach/conversations'

const eleve = (id: string, texte: string): Message => ({ id, role: 'eleve', texte })
const marcel = (id: string, texte: string): Message => ({ id, role: 'marcel', texte })

describe('titreAuto', () => {
  it('prend la question telle quelle quand elle est courte', () => {
    expect(titreAuto('Le théorème de Thalès ?')).toBe('Le théorème de Thalès ?')
  })

  it('écrase les espaces et les retours à la ligne', () => {
    expect(titreAuto('  Les  fractions\n\nen 5e  ')).toBe('Les fractions en 5e')
  })

  it('coupe au mot, jamais au milieu, et le dit avec des points de suspension', () => {
    const long =
      'Explique-moi pourquoi la Première Guerre mondiale a commencé en 1914 et pas avant'
    const titre = titreAuto(long)
    expect(titre.length).toBeLessThanOrEqual(MAX_TITRE_LEN + 1)
    expect(titre.endsWith('…')).toBe(true)
    // Le dernier mot conservé est entier : le titre tronqué est un préfixe de
    // la question, aux points de suspension près.
    expect(long.startsWith(titre.slice(0, -1))).toBe(true)
  })

  it('coupe net si le premier mot dépasse déjà la longueur', () => {
    const titre = titreAuto('a'.repeat(120))
    expect(titre).toBe(`${'a'.repeat(MAX_TITRE_LEN)}…`)
  })

  it('un fil sans question a quand même un nom', () => {
    // Sans repli, la liste d'historique afficherait une ligne vide,
    // impossible à rouvrir ni à distinguer des autres.
    expect(titreAuto('   ')).toBe('Nouvelle question')
  })
})

describe('nettoyerTitre', () => {
  it('accepte un renommage ordinaire', () => {
    expect(nettoyerTitre('  Mes  révisions de SVT ')).toBe('Mes révisions de SVT')
  })

  it('borne la longueur', () => {
    expect(nettoyerTitre('x'.repeat(200))?.length).toBe(MAX_TITRE_LEN)
  })

  it('refuse le vide et ce qui n’est pas une chaîne', () => {
    // Refuser plutôt que d'écrire : un titre vide effacerait le seul repère de
    // la ligne dans l'historique.
    expect(nettoyerTitre('   ')).toBeNull()
    expect(nettoyerTitre(null)).toBeNull()
    expect(nettoyerTitre(42)).toBeNull()
  })
})

describe('contexteFor', () => {
  const fil: Message[] = [
    eleve('1', 'Question 1'),
    marcel('2', 'Réponse 1'),
    eleve('3', 'Question 2'),
    marcel('4', 'Réponse 2'),
    eleve('5', 'Question 3'),
    marcel('6', 'Réponse 3'),
  ]

  it('ne rappelle que les derniers tours', () => {
    // C'est la borne de COÛT : un fil de trente messages ne se repaie pas
    // trente fois à chaque question.
    expect(contexteFor(fil).map((m) => m.texte)).toEqual([
      'Question 2',
      'Réponse 2',
      'Question 3',
      'Réponse 3',
    ])
  })

  it('ne commence jamais par une réponse orpheline', () => {
    // Rappeler « Réponse 1 » sans « Question 1 » donnerait au modèle une
    // réponse sans son objet.
    const impair = fil.slice(1) // commence par une réponse de Marcel
    expect(contexteFor(impair, 2)[0].texte).toBe('Question 2')
  })

  it('tronque chaque message rappelé', () => {
    const gros = [eleve('1', 'z'.repeat(2000)), marcel('2', 'ok')]
    expect(contexteFor(gros)[0].texte.length).toBe(CONTEXTE_MESSAGE_LEN)
  })

  it('zéro tour = aucun contexte', () => {
    expect(contexteFor(fil, 0)).toEqual([])
  })
})

describe('quandDit', () => {
  const maintenant = new Date('2026-09-02T09:00:00Z')

  it('dit le jour tant qu’il a un nom', () => {
    expect(quandDit('2026-09-02T07:12:00Z', maintenant)).toBe('Aujourd’hui')
    expect(quandDit('2026-09-01T23:59:00Z', maintenant)).toBe('Hier')
    expect(quandDit('2026-08-30T10:00:00Z', maintenant)).toBe('Il y a 3 jours')
  })

  it('passe à la date au-delà de la semaine', () => {
    expect(quandDit('2026-08-12T10:00:00Z', maintenant)).toBe('12 août')
  })

  it('un fil « du futur » se dit aujourd’hui', () => {
    // Horloge du téléphone en avance : « il y a -1 jour » n'existe pas.
    expect(quandDit('2026-09-03T10:00:00Z', maintenant)).toBe('Aujourd’hui')
  })

  it('rend une chaîne vide sur une date illisible', () => {
    expect(quandDit('pas une date', maintenant)).toBe('')
  })
})

describe('dernierEchange', () => {
  it('rend la dernière question ET la réponse qu’elle a reçue', () => {
    const fil = [
      eleve('1', 'Les fractions ?'),
      marcel('2', 'Commence par le dénominateur.'),
      eleve('3', 'Et Thalès ?'),
      marcel('4', 'Repère les droites parallèles.'),
    ]
    expect(dernierEchange(fil)).toEqual({
      question: 'Et Thalès ?',
      reponse: 'Repère les droites parallèles.',
    })
  })

  it('null tant qu’aucun échange n’est complet', () => {
    // C'est ce cas qui fait dire « je n'ai rien à ranger » plutôt que d'écrire
    // une carte vide dans le carnet.
    expect(dernierEchange([])).toBeNull()
    expect(dernierEchange([eleve('1', 'Coucou')])).toBeNull()
    expect(dernierEchange([marcel('1', 'Salut')])).toBeNull()
  })

  it('ignore la question en cours, restée sans réponse', () => {
    const fil = [
      eleve('1', 'Les fractions ?'),
      marcel('2', 'Commence par le dénominateur.'),
      eleve('3', 'envoie ça dans mon carnet'),
    ]
    expect(dernierEchange(fil)?.question).toBe('Les fractions ?')
  })
})
