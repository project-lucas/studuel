import { describe, it, expect } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { chaptersWithMindMap, chapterHasMindMap, fetchMindMap } from './mind-map-access'
import type { MindMapData } from './types'

// Ce module porte des REPLIS à trois états de base (aucune migration / 181 /
// 181+182) : c'est exactement le genre de code qu'on ne peut pas vérifier « à
// l'œil », et dont une régression ne se verrait qu'en production — soit par un
// écran cassé, soit, bien pire, par du contenu payant re-servi gratuitement.
//
// D'où ce faux client Supabase : il rejoue les trois états, y compris les
// erreurs exactes que renvoie PostgREST (colonne absente = 42703, droit retiré
// = 42501).

const CARTE: MindMapData = {
  centre: 'Pythagore',
  branches: [{ titre: 'Énoncé', enfants: ['a² + b² = c²'] }],
}

const ERREUR_COLONNE_ABSENTE = { code: '42703', message: 'column does not exist' }
const ERREUR_DROIT_RETIRE = { code: '42501', message: 'permission denied for table chapters' }
const ERREUR_RPC_ABSENTE = { code: 'PGRST202', message: 'function does not exist' }

type Reponse = { data: unknown; error: unknown }

// Faux client : `responses` associe une clause `select(...)` à sa réponse, et
// `rpc` la réponse de la RPC. Toute requête non prévue échoue bruyamment plutôt
// que de renvoyer un silence trompeur.
function fakeClient(responses: Record<string, Reponse>, rpc?: Reponse) {
  const appels: string[] = []

  function builder(clause: string) {
    const reponse = responses[clause]
    const chain = {
      in: () => chain,
      eq: () => chain,
      returns: () => chain,
      maybeSingle: () => chain,
      then: (resolve: (r: Reponse) => unknown) => {
        if (!reponse) throw new Error(`Requête non prévue par le test : ${clause}`)
        return Promise.resolve(reponse).then(resolve)
      },
    }
    return chain
  }

  const client = {
    from: () => ({
      select: (clause: string) => {
        appels.push(clause)
        return builder(clause)
      },
    }),
    rpc: () => {
      appels.push('rpc:chapter_mind_map')
      if (!rpc) throw new Error('RPC non prévue par le test')
      return Promise.resolve(rpc)
    },
  }

  return { client: client as unknown as SupabaseClient, appels }
}

describe('chaptersWithMindMap', () => {
  it('cas nominal (181 passée) : lit la colonne générée, une seule requête', async () => {
    const { client, appels } = fakeClient({
      'id, has_mind_map': {
        data: [
          { id: 'a', has_mind_map: true },
          { id: 'b', has_mind_map: false },
        ],
        error: null,
      },
    })

    const avec = await chaptersWithMindMap(client, ['a', 'b'])

    expect([...avec]).toEqual(['a'])
    expect(appels).toEqual(['id, has_mind_map'])
  })

  it('repli (181 pas encore passée) : retombe sur mind_map', async () => {
    const { client, appels } = fakeClient({
      'id, has_mind_map': { data: null, error: ERREUR_COLONNE_ABSENTE },
      'id, mind_map': {
        data: [
          { id: 'a', mind_map: CARTE },
          { id: 'b', mind_map: null },
        ],
        error: null,
      },
    })

    const avec = await chaptersWithMindMap(client, ['a', 'b'])

    expect([...avec]).toEqual(['a'])
    expect(appels).toEqual(['id, has_mind_map', 'id, mind_map'])
  })

  it('échoue FERMÉ si les deux chemins sont refusés', async () => {
    // État impossible en théorie (182 sans 181). La tuile disparaît, mais rien
    // ne casse et surtout rien ne fuit.
    const { client } = fakeClient({
      'id, has_mind_map': { data: null, error: ERREUR_DROIT_RETIRE },
      'id, mind_map': { data: null, error: ERREUR_DROIT_RETIRE },
    })

    expect([...(await chaptersWithMindMap(client, ['a']))]).toEqual([])
  })

  it('ne requête RIEN sur une liste vide', async () => {
    const { client, appels } = fakeClient({})

    expect([...(await chaptersWithMindMap(client, []))]).toEqual([])
    expect(appels).toEqual([])
  })

  it('chapterHasMindMap répond bien pour un chapitre isolé', async () => {
    const { client } = fakeClient({
      'id, has_mind_map': { data: [{ id: 'a', has_mind_map: true }], error: null },
    })

    expect(await chapterHasMindMap(client, 'a')).toBe(true)
    expect(await chapterHasMindMap(client, 'zzz')).toBe(false)
  })
})

describe('fetchMindMap', () => {
  it('cas nominal : passe par la RPC, qui vérifie l’abonnement côté serveur', async () => {
    const { client, appels } = fakeClient({}, { data: CARTE, error: null })

    expect(await fetchMindMap(client, 'a')).toEqual(CARTE)
    expect(appels).toEqual(['rpc:chapter_mind_map'])
  })

  it('rend null quand la RPC refuse (non-abonné) — sans repli', async () => {
    // Le point de sécurité : un refus est un SUCCÈS renvoyant NULL, pas une
    // erreur. Il ne doit donc SURTOUT pas déclencher le repli, qui lirait la
    // colonne en direct et re-servirait le contenu payant gratuitement.
    const { client, appels } = fakeClient({}, { data: null, error: null })

    expect(await fetchMindMap(client, 'a')).toBeNull()
    expect(appels).toEqual(['rpc:chapter_mind_map'])
  })

  it('repli (181 pas encore passée) : lit la colonne tant qu’elle est lisible', async () => {
    const { client, appels } = fakeClient(
      { mind_map: { data: { mind_map: CARTE }, error: null } },
      { data: null, error: ERREUR_RPC_ABSENTE },
    )

    expect(await fetchMindMap(client, 'a')).toEqual(CARTE)
    expect(appels).toEqual(['rpc:chapter_mind_map', 'mind_map'])
  })

  it('échoue FERMÉ après la 182 si la RPC est injoignable', async () => {
    // RPC en panne + colonne révoquée : on rend null, on ne sert rien.
    const { client } = fakeClient(
      { mind_map: { data: null, error: ERREUR_DROIT_RETIRE } },
      { data: null, error: ERREUR_RPC_ABSENTE },
    )

    expect(await fetchMindMap(client, 'a')).toBeNull()
  })
})
