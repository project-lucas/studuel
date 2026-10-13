import { describe, expect, it } from 'vitest'
import {
  LIMITES,
  cleDeDoublon,
  compterDepuis,
  creerLimiteur,
  estBruit,
  lireRapport,
  normaliserErreur,
  rapportDepuis,
  resumerErreurs,
  type LigneErreur,
} from './erreurs'

describe('normaliserErreur', () => {
  it('lit une Error : nom, message, pile, digest', () => {
    const e = Object.assign(new TypeError('x is not a function'), { digest: 'abc123' })
    const n = normaliserErreur(e)
    expect(n.nom).toBe('TypeError')
    expect(n.message).toBe('x is not a function')
    expect(n.pile).toContain('TypeError')
    expect(n.digest).toBe('abc123')
  })

  it('lit une chaîne, un objet à message, et n’importe quoi', () => {
    expect(normaliserErreur('boum').message).toBe('boum')
    expect(normaliserErreur({ message: 'objet', name: 'Custom' })).toMatchObject({
      message: 'objet',
      nom: 'Custom',
    })
    expect(normaliserErreur(null).message).toBe('Erreur sans message')
    expect(normaliserErreur(42).message).toBe('42')
    expect(normaliserErreur(new Error('')).message).toBe('Erreur sans message')
  })
})

describe('rapportDepuis', () => {
  it('borne chaque champ et ne garde que des scalaires en contexte', () => {
    const longue = 'm'.repeat(2000)
    const r = rapportDepuis(new Error(longue), 'navigateur', {
      url: `/reviser/${'x'.repeat(1000)}`,
      contexte: {
        ou: 'frontiere',
        n: 3,
        ok: true,
        rien: null,
        // @ts-expect-error — un objet n'est pas une valeur de contexte
        objet: { a: 1 },
        texte: 't'.repeat(500),
      },
    })
    expect(r.message.length).toBe(LIMITES.message)
    expect(r.url?.length).toBe(LIMITES.url)
    expect(r.contexte).toEqual({
      ou: 'frontiere',
      n: 3,
      ok: true,
      rien: null,
      texte: `${'t'.repeat(LIMITES.valeurContexte - 1)}…`,
    })
    expect(r.source).toBe('navigateur')
  })

  it('plafonne le nombre de clés de contexte', () => {
    const contexte: Record<string, number> = {}
    for (let i = 0; i < 50; i += 1) contexte[`k${i}`] = i
    const r = rapportDepuis('e', 'serveur', { contexte })
    expect(Object.keys(r.contexte)).toHaveLength(LIMITES.clesContexte)
  })
})

describe('estBruit', () => {
  it('ignore ResizeObserver, Script error., AbortError et les extensions', () => {
    expect(estBruit({ message: 'ResizeObserver loop completed with undelivered notifications.', pile: null, nom: null })).toBe(true)
    expect(estBruit({ message: 'Script error.', pile: null, nom: null })).toBe(true)
    expect(estBruit({ message: 'The user aborted a request.', pile: null, nom: 'AbortError' })).toBe(true)
    expect(estBruit({ message: 'x', pile: 'at chrome-extension://abc/content.js:1', nom: 'TypeError' })).toBe(true)
  })

  it('garde une vraie erreur de l’app', () => {
    expect(estBruit({ message: "Cannot read properties of undefined (reading 'id')", pile: 'at /_next/static/chunks/app.js', nom: 'TypeError' })).toBe(false)
    expect(estBruit({ message: 'Loading chunk 123 failed', pile: null, nom: 'ChunkLoadError' })).toBe(false)
  })
})

describe('creerLimiteur', () => {
  it('refuse les doublons et plafonne la session', () => {
    const lim = creerLimiteur(3)
    const a = { message: 'a', nom: 'E', url: '/x' }
    expect(lim.accepte(a)).toBe(true)
    expect(lim.accepte(a)).toBe(false)
    expect(lim.accepte({ ...a, url: '/y' })).toBe(true)
    expect(lim.accepte({ ...a, message: 'b' })).toBe(true)
    expect(lim.accepte({ ...a, message: 'c' })).toBe(false)
  })

  it('la clé de doublon ne regarde que les 200 premiers caractères du message', () => {
    const base = 'm'.repeat(200)
    expect(cleDeDoublon({ message: `${base}1`, nom: null, url: null })).toBe(
      cleDeDoublon({ message: `${base}2`, nom: null, url: null }),
    )
  })
})

describe('lireRapport — un corps reçu par le réseau', () => {
  it('refuse ce qui n’a pas de message', () => {
    expect(lireRapport(null, 'navigateur')).toBeNull()
    expect(lireRapport('texte', 'navigateur')).toBeNull()
    expect(lireRapport([], 'navigateur')).toBeNull()
    expect(lireRapport({ message: '' }, 'navigateur')).toBeNull()
    expect(lireRapport({ message: 42 }, 'navigateur')).toBeNull()
  })

  it('impose la source, type et borne chaque champ', () => {
    const r = lireRapport(
      {
        source: 'serveur',
        message: 'boum',
        nom: 'TypeError',
        pile: 'p'.repeat(10_000),
        url: 123,
        digest: 'd',
        contexte: { a: 'x', b: [1, 2], c: 2 },
      },
      'navigateur',
    )
    expect(r).not.toBeNull()
    expect(r?.source).toBe('navigateur')
    expect(r?.pile?.length).toBe(LIMITES.pile)
    expect(r?.url).toBeNull()
    expect(r?.contexte).toEqual({ a: 'x', c: 2 })
  })

  it('un contexte qui n’est pas un objet est vide', () => {
    expect(lireRapport({ message: 'm', contexte: 'non' }, 'navigateur')?.contexte).toEqual({})
    expect(lireRapport({ message: 'm', contexte: [1] }, 'navigateur')?.contexte).toEqual({})
  })
})

function ligne(partiel: Partial<LigneErreur> & { id: number }): LigneErreur {
  return {
    cree_le: '2026-10-12T10:00:00.000Z',
    source: 'navigateur',
    user_id: null,
    message: 'm',
    nom: null,
    pile: null,
    url: null,
    digest: null,
    contexte: null,
    navigateur: null,
    ...partiel,
  }
}

describe('resumerErreurs', () => {
  it('regroupe par nom + message, compte, trie par nombre puis récence', () => {
    const lignes = [
      ligne({ id: 1, message: 'A', nom: 'TypeError', url: '/x', user_id: 'u1', cree_le: '2026-10-12T10:00:00.000Z' }),
      ligne({ id: 2, message: 'A', nom: 'TypeError', url: '/y', user_id: 'u2', cree_le: '2026-10-12T11:00:00.000Z', source: 'serveur' }),
      ligne({ id: 3, message: 'A', nom: 'TypeError', url: '/x', user_id: 'u1', cree_le: '2026-10-12T09:00:00.000Z' }),
      ligne({ id: 4, message: 'B', nom: null, cree_le: '2026-10-12T12:00:00.000Z' }),
      ligne({ id: 5, message: 'C', nom: null, cree_le: '2026-10-12T13:00:00.000Z' }),
    ]
    const groupes = resumerErreurs(lignes)
    expect(groupes.map((g) => g.message)).toEqual(['A', 'C', 'B'])
    const a = groupes[0]
    expect(a.nombre).toBe(3)
    expect(a.eleves).toBe(2)
    expect(a.urls).toEqual(['/x', '/y'])
    expect(a.sources).toEqual(['navigateur', 'serveur'])
    expect(a.derniere).toBe('2026-10-12T11:00:00.000Z')
    expect(a.premiere).toBe('2026-10-12T09:00:00.000Z')
    expect(a.exemple.id).toBe(2)
  })

  it('une liste vide donne une liste vide', () => {
    expect(resumerErreurs([])).toEqual([])
  })
})

describe('compterDepuis', () => {
  it('compte les lignes à partir de l’instant donné, inclus', () => {
    const lignes = [
      ligne({ id: 1, cree_le: '2026-10-12T10:00:00.000Z' }),
      ligne({ id: 2, cree_le: '2026-10-11T10:00:00.000Z' }),
    ]
    expect(compterDepuis(lignes, new Date('2026-10-12T10:00:00.000Z'))).toBe(1)
    expect(compterDepuis(lignes, new Date('2026-10-10T00:00:00.000Z'))).toBe(2)
  })
})
