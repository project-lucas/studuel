import { describe, expect, it } from 'vitest'
import {
  coinsManquants,
  issueAchat,
  messageAchat,
  prochainArticle,
} from './tresor-achat'

describe('issueAchat — pourquoi le serveur a refusé', () => {
  it('rend « achete » quand le serveur a débité', () => {
    expect(
      issueAchat({
        reponse: { bought: true, coins: 80 },
        prix: 120,
        possedeDeja: false,
      }),
    ).toBe('achete')
  })

  it('rend « panne » quand la Server Action n’a rien renvoyé', () => {
    expect(issueAchat({ reponse: null, prix: 120, possedeDeja: false })).toBe(
      'panne',
    )
  })

  it('rend « deja » plutôt que « trop-cher » sur un article déjà possédé', () => {
    // Le cas du double tap : le premier achat a vidé la bourse, le second est
    // refusé. Dire « il te manque des pièces » serait exact ET trompeur —
    // l'élève a l'article, il n'a rien à racheter.
    expect(
      issueAchat({
        reponse: { bought: false, coins: 0 },
        prix: 120,
        possedeDeja: true,
      }),
    ).toBe('deja')
  })

  it('rend « trop-cher » quand le solde SERVEUR ne couvre pas le prix', () => {
    expect(
      issueAchat({
        reponse: { bought: false, coins: 40 },
        prix: 120,
        possedeDeja: false,
      }),
    ).toBe('trop-cher')
  })

  it('rend « deconnecte » AVANT de regarder le solde', () => {
    // Session expirée : le serveur répond « 0 pièce » faute de savoir à qui il
    // parle. Comparer ce zéro au prix annoncerait « il te manque 120 pièces »
    // à un élève qui les a — et l'enverrait résoudre le mauvais problème.
    expect(
      issueAchat({
        reponse: { bought: false, coins: 0, raison: 'anonyme' },
        prix: 120,
        possedeDeja: false,
      }),
    ).toBe('deconnecte')
  })

  it('rend « panne » quand le serveur nomme la panne, même à solde bas', () => {
    // La RPC a échoué : le solde renvoyé est le solde RÉEL, il n'explique rien
    // du refus. Dire « pas assez de pièces » serait une coïncidence, pas une
    // cause.
    expect(
      issueAchat({
        reponse: { bought: false, coins: 10, raison: 'panne' },
        prix: 120,
        possedeDeja: false,
      }),
    ).toBe('panne')
  })

  it('rend « panne » sur un refus que le solde n’explique pas', () => {
    // Solde suffisant, article non possédé, refus quand même : on ne sait pas.
    // On ne va SURTOUT pas dire à l'élève qu'il est fauché — il ne l'est pas.
    expect(
      issueAchat({
        reponse: { bought: false, coins: 500 },
        prix: 120,
        possedeDeja: false,
      }),
    ).toBe('panne')
  })

  it('rend « panne » quand le solde renvoyé est illisible', () => {
    expect(
      issueAchat({
        reponse: { bought: false, coins: Number.NaN },
        prix: 120,
        possedeDeja: false,
      }),
    ).toBe('panne')
  })
})

describe('messageAchat', () => {
  it('nomme l’article acheté', () => {
    const m = messageAchat('achete', 'Gel de série')
    expect(m.texte).toContain('Gel de série')
    expect(m.ton).toBe('success')
  })

  it('ne traite pas « déjà possédé » comme une erreur', () => {
    expect(messageAchat('deja', 'Gel de série').ton).toBe('success')
  })

  it('chiffre ce qui manque, au singulier comme au pluriel', () => {
    expect(messageAchat('trop-cher', 'Gel de série', 45).texte).toContain(
      '45 pièces',
    )
    expect(messageAchat('trop-cher', 'Gel de série', 1).texte).toContain(
      '1 pièce',
    )
  })

  it('reste compréhensible sans montant manquant', () => {
    const m = messageAchat('trop-cher', 'Gel de série', 0)
    expect(m.texte).toContain('Gel de série')
    expect(m.texte).not.toContain('0')
  })

  it('propose une suite en cas de panne', () => {
    const m = messageAchat('panne', 'Gel de série')
    expect(m.ton).toBe('error')
    expect(m.texte).toMatch(/[Rr]éessaie/)
  })

  it('parle de session, et non de pièces, quand l’élève est déconnecté', () => {
    const m = messageAchat('deconnecte', 'Gel de série', 120)
    expect(m.ton).toBe('error')
    expect(m.texte).toMatch(/reconnecte/i)
    expect(m.texte).not.toMatch(/pièce/)
  })
})

describe('coinsManquants', () => {
  it('rend 0 quand l’élève peut se le payer', () => {
    expect(coinsManquants(200, 120)).toBe(0)
    expect(coinsManquants(120, 120)).toBe(0)
  })

  it('rend la différence exacte', () => {
    expect(coinsManquants(75, 120)).toBe(45)
  })

  it('traite un solde illisible comme zéro pièce', () => {
    expect(coinsManquants(Number.NaN, 120)).toBe(120)
    expect(coinsManquants(-40, 120)).toBe(120)
  })

  it('arrondit vers le haut : il ne manque jamais « 0,5 pièce »', () => {
    expect(coinsManquants(119.5, 120)).toBe(1)
  })
})

describe('prochainArticle', () => {
  const catalogue = [
    { id: 'a', price: 80, owned: false },
    { id: 'b', price: 200, owned: false },
    { id: 'c', price: 120, owned: false },
  ]

  it('propose le plus cher de ce qui est accessible', () => {
    const r = prochainArticle(catalogue, 150)
    expect(r?.accessible).toBe(true)
    expect(r?.article.id).toBe('c')
  })

  it('propose le moins cher à viser quand rien n’est accessible', () => {
    const r = prochainArticle(catalogue, 10)
    expect(r?.accessible).toBe(false)
    expect(r?.article.id).toBe('a')
  })

  it('ignore ce qui est déjà possédé', () => {
    const r = prochainArticle(
      [
        { id: 'a', price: 80, owned: true },
        { id: 'b', price: 200, owned: false },
      ],
      500,
    )
    expect(r?.article.id).toBe('b')
  })

  it('rend null quand tout est possédé', () => {
    expect(prochainArticle([{ id: 'a', price: 80, owned: true }], 500)).toBeNull()
  })

  it('rend null sur un catalogue vide', () => {
    expect(prochainArticle([], 500)).toBeNull()
  })
})
