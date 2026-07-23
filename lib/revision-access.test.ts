import { describe, it, expect } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchRevisionSheet, lessonHasRevisionSheet } from './revision-access'

// Jumeau de `mind-map-access.test.ts`, pour le second contenu payant de l'app.
//
// Ce module porte des REPLIS à trois états de base (aucune migration / 184 /
// 184+185). C'est du code qu'on ne peut pas vérifier « à l'œil » : une
// régression ne se verrait qu'en production, soit par un écran cassé, soit —
// bien pire — par une fiche payante re-servie gratuitement. Le repli ne doit
// JAMAIS se déclencher sur un refus légitime, seulement sur une base où la
// migration n'est pas encore passée.

const FICHE = '# Théorème de Pythagore\n\nDans un triangle rectangle…'

const ERREUR_COLONNE_ABSENTE = { code: '42703', message: 'column does not exist' }
const ERREUR_DROIT_RETIRE = {
  code: '42501',
  message: 'permission denied for table lessons',
}
const ERREUR_RPC_ABSENTE = { code: 'PGRST202', message: 'function does not exist' }

type Reponse = { data: unknown; error: unknown }

// `responses` associe une clause `select(...)` à sa réponse, `rpc` la réponse de
// la RPC. Toute requête non prévue échoue bruyamment plutôt que de renvoyer un
// silence trompeur qu'on prendrait pour un succès.
function fakeClient(responses: Record<string, Reponse>, rpc?: Reponse) {
  const appels: string[] = []

  function builder(clause: string) {
    const reponse = responses[clause]
    const chain = {
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
      appels.push('rpc:lesson_revision_sheet')
      if (!rpc) throw new Error('RPC non prévue par le test')
      return Promise.resolve(rpc)
    },
  }

  return { client: client as unknown as SupabaseClient, appels }
}

describe('fetchRevisionSheet', () => {
  it('cas nominal : passe par la RPC, qui vérifie le droit côté serveur', async () => {
    const { client, appels } = fakeClient({}, { data: FICHE, error: null })
    expect(await fetchRevisionSheet(client, 'lecon-1')).toBe(FICHE)
    expect(appels).toEqual(['rpc:lesson_revision_sheet'])
  })

  it('rend null quand la RPC refuse (non-abonné) — SANS repli', async () => {
    // Le point le plus important du fichier : un refus légitime renvoie
    // `data: null` sans erreur. Si le repli se déclenchait là, tout le verrou
    // premium tomberait — la fiche serait re-servie par lecture directe.
    const { client, appels } = fakeClient({}, { data: null, error: null })
    expect(await fetchRevisionSheet(client, 'lecon-1')).toBeNull()
    expect(appels).toEqual(['rpc:lesson_revision_sheet'])
  })

  it('traite une fiche vide ou blanche comme absente', async () => {
    const { client } = fakeClient({}, { data: '   \n  ', error: null })
    expect(await fetchRevisionSheet(client, 'lecon-1')).toBeNull()
  })

  it('repli (184 pas encore passée) : lit la colonne tant qu’elle est lisible', async () => {
    const { client, appels } = fakeClient(
      { revision_sheet: { data: { revision_sheet: FICHE }, error: null } },
      { data: null, error: ERREUR_RPC_ABSENTE },
    )
    expect(await fetchRevisionSheet(client, 'lecon-1')).toBe(FICHE)
    expect(appels).toEqual(['rpc:lesson_revision_sheet', 'revision_sheet'])
  })

  it('échoue FERMÉ après la 185 si la RPC est injoignable', async () => {
    // RPC en panne ET colonne révoquée : on ne sert rien. Le contraire
    // (servir en cas de doute) serait une fuite.
    const { client } = fakeClient(
      { revision_sheet: { data: null, error: ERREUR_DROIT_RETIRE } },
      { data: null, error: ERREUR_RPC_ABSENTE },
    )
    expect(await fetchRevisionSheet(client, 'lecon-1')).toBeNull()
  })
})

describe('lessonHasRevisionSheet', () => {
  it('cas nominal (184 passée) : lit la colonne générée, une seule requête', async () => {
    const { client, appels } = fakeClient({
      has_revision_sheet: { data: { has_revision_sheet: true }, error: null },
    })
    expect(await lessonHasRevisionSheet(client, 'lecon-1')).toBe(true)
    expect(appels).toEqual(['has_revision_sheet'])
  })

  it('rend false quand la leçon n’a pas de fiche', async () => {
    const { client } = fakeClient({
      has_revision_sheet: { data: { has_revision_sheet: false }, error: null },
    })
    expect(await lessonHasRevisionSheet(client, 'lecon-1')).toBe(false)
  })

  it('repli (184 pas encore passée) : retombe sur la présence du texte', async () => {
    const { client, appels } = fakeClient({
      has_revision_sheet: { data: null, error: ERREUR_COLONNE_ABSENTE },
      revision_sheet: { data: { revision_sheet: FICHE }, error: null },
    })
    expect(await lessonHasRevisionSheet(client, 'lecon-1')).toBe(true)
    expect(appels).toEqual(['has_revision_sheet', 'revision_sheet'])
  })

  it('ne prend pas une fiche blanche pour une fiche existante', async () => {
    const { client } = fakeClient({
      has_revision_sheet: { data: null, error: ERREUR_COLONNE_ABSENTE },
      revision_sheet: { data: { revision_sheet: '   ' }, error: null },
    })
    expect(await lessonHasRevisionSheet(client, 'lecon-1')).toBe(false)
  })

  it('échoue FERMÉ si les deux chemins sont refusés', async () => {
    const { client } = fakeClient({
      has_revision_sheet: { data: null, error: ERREUR_COLONNE_ABSENTE },
      revision_sheet: { data: null, error: ERREUR_DROIT_RETIRE },
    })
    expect(await lessonHasRevisionSheet(client, 'lecon-1')).toBe(false)
  })
})
