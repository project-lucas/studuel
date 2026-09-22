import { describe, expect, it } from 'vitest'
import { carteBilan, libellePlace, libelleTrophees } from './bilan-carte'
import type { BilanPartie } from '@/lib/palmares/bilan'

// Un bilan de première partie, seul de sa classe cette semaine — la capture
// du 22/09/2026 (« Premier score posé ! · 1er de ta classe · Tu mènes »).
function bilanDe(extra: Partial<BilanPartie> = {}): BilanPartie {
  return {
    mode: 'anatomie-express',
    score: 100,
    plays: 1,
    last: null,
    bestBefore: null,
    best: 100,
    weekKey: '2026-W39',
    weekBestBefore: null,
    weekBest: 100,
    weekRankBefore: null,
    weekTotalBefore: null,
    weekRank: 1,
    weekTotal: 1,
    allRank: 1,
    allTotal: 1,
    grade: '5e',
    next: null,
    leader: { name: 'Toi', score: 100, isMe: true },
    ...extra,
  }
}

describe('libelleTrophees', () => {
  it('écrit le gain avec son signe et son pluriel', () => {
    expect(libelleTrophees(8)).toBe('+8 trophées')
    expect(libelleTrophees(1)).toBe('+1 trophée')
  })

  it('ne parle jamais d’une perte en alerte : « Rien perdu », puis le signe moins typographique', () => {
    expect(libelleTrophees(0)).toBe('Rien perdu')
    expect(libelleTrophees(-5)).toBe('−5 trophées')
    expect(libelleTrophees(-1)).toBe('−1 trophée')
  })
})

describe('libellePlace', () => {
  it('dit le rang brut sous 100 élèves', () => {
    expect(libellePlace({ weekRank: 1, weekTotal: 1 })).toBe('1er de ta classe cette semaine')
    expect(libellePlace({ weekRank: 3, weekTotal: 23 })).toBe('3e de ta classe cette semaine')
  })

  it('passe au pourcentage à partir de 100 élèves', () => {
    expect(libellePlace({ weekRank: 5, weekTotal: 200 })).toMatch(/^Top \d+ % de ta classe cette semaine$/)
    expect(libellePlace({ weekRank: 180, weekTotal: 200 })).toMatch(
      /^Mieux que \d+ % de ta classe cette semaine$/,
    )
  })

  it('ne dit rien quand il n’y a pas de classement', () => {
    expect(libellePlace({ weekRank: 0, weekTotal: 0 })).toBeNull()
  })
})

describe('carteBilan', () => {
  it('n’a pas de carte sans trophées ni bilan', () => {
    expect(carteBilan({ trophies: null, bilan: null, saved: true })).toBeNull()
    expect(carteBilan({ trophies: undefined, bilan: undefined, saved: null })).toBeNull()
  })

  it('réunit la capture du 22/09 : verdict, place, rien perdu, prochaine victoire, journée', () => {
    const carte = carteBilan({
      trophies: { before: 0, after: 0, delta: 0 },
      bilan: bilanDe(),
      saved: true,
    })
    expect(carte).toEqual({
      icone: 'palmares',
      titre: 'Premier score posé !',
      sousTitre: '1er de ta classe cette semaine',
      marche: null,
      pastille: { texte: 'Rien perdu', ton: 'neutre', nombre: false },
      prochaineVictoire: 10,
      journee: 'validee',
      lien: true,
    })
  })

  it('ne répète pas « Tu mènes ta classe » quand la place le dit déjà', () => {
    const carte = carteBilan({ trophies: null, bilan: bilanDe(), saved: null })
    expect(carte?.sousTitre).toBe('1er de ta classe cette semaine')
    expect(JSON.stringify(carte)).not.toContain('mènes')
  })

  it('garde « Tu mènes ta classe » quand il n’y a pas de rang à dire', () => {
    const carte = carteBilan({
      trophies: null,
      bilan: bilanDe({ weekRank: 0, weekTotal: 0 }),
      saved: null,
    })
    expect(carte?.sousTitre).toBe('Tu mènes ta classe cette semaine')
  })

  it('met le gain en pastille jaune, la perte en pastille neutre', () => {
    const gain = carteBilan({
      trophies: { before: 100, after: 108, delta: 8 },
      bilan: bilanDe(),
      saved: true,
    })
    expect(gain?.pastille).toEqual({ texte: '+8', ton: 'gain', nombre: true })
    expect(gain?.prochaineVictoire).toBe(9)

    const perte = carteBilan({
      trophies: { before: 250, after: 248, delta: -2 },
      bilan: bilanDe({ last: 300, bestBefore: 400 }),
      saved: true,
    })
    expect(perte?.pastille).toEqual({ texte: '−2', ton: 'neutre', nombre: true })
    expect(perte?.titre).toBe('Un cran sous la dernière fois')
  })

  it('annonce la prochaine marche quand quelqu’un est juste au-dessus', () => {
    const carte = carteBilan({
      trophies: null,
      bilan: bilanDe({
        weekRank: 3,
        weekTotal: 23,
        next: { name: 'Léa', avatar: null, score: 320 },
        leader: { name: 'Sami', score: 500, isMe: false },
      }),
      saved: true,
    })
    expect(carte?.sousTitre).toBe('3e de ta classe cette semaine')
    expect(carte?.marche).toBe('Prochaine marche : Léa · 320')
    expect(carte?.pastille).toBeNull()
    expect(carte?.prochaineVictoire).toBeNull()
  })

  it('sans bilan, les trophées font le titre et la pastille disparaît', () => {
    const carte = carteBilan({
      trophies: { before: 34, after: 42, delta: 8 },
      bilan: null,
      saved: true,
    })
    expect(carte).toEqual({
      icone: 'trophees',
      titre: '+8 trophées',
      sousTitre: 'Total sur ce jeu : 42',
      marche: null,
      pastille: null,
      prochaineVictoire: 10,
      journee: 'validee',
      lien: false,
    })
  })

  it('sans bilan ni trophée au compteur, dit qu’on débute', () => {
    const carte = carteBilan({
      trophies: { before: 0, after: 0, delta: 0 },
      bilan: null,
      saved: null,
    })
    expect(carte?.titre).toBe('Rien perdu')
    expect(carte?.sousTitre).toBe('Tu débutes sur ce jeu')
    expect(carte?.journee).toBeNull()
  })

  it('distingue la partie non enregistrée de la réponse encore attendue', () => {
    const base = { trophies: { before: 0, after: 10, delta: 10 }, bilan: null }
    expect(carteBilan({ ...base, saved: false })?.journee).toBe('non-enregistree')
    expect(carteBilan({ ...base, saved: null })?.journee).toBeNull()
  })
})
