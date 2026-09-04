import { describe, it, expect } from 'vitest'
import { MAX_CARTES, lireCartes, phraseCartes } from '@/lib/coach/cartes-ia'
import { MAX_RECTO_LEN } from '@/lib/coach/vers-carnet'

describe('lireCartes', () => {
  it('lit un tableau JSON propre', () => {
    expect(
      lireCartes('[{"recto":"1789 ?","verso":"Révolution française"}]'),
    ).toEqual([{ recto: '1789 ?', verso: 'Révolution française' }])
  })

  it('survit au bavardage autour du JSON', () => {
    // Un modèle sur dix encadre sa réponse d'une phrase ou d'une clôture
    // markdown. Refuser pour ça ferait échouer une génération payée.
    const raw = 'Voilà tes cartes !\n```json\n[{"recto":"a","verso":"b"}]\n```\nBon courage.'
    expect(lireCartes(raw)).toEqual([{ recto: 'a', verso: 'b' }])
  })

  it('accepte le vocabulaire spontané des modèles', () => {
    expect(
      lireCartes('[{"question":"Capitale du Japon ?","reponse":"Tokyo"}]'),
    ).toEqual([{ recto: 'Capitale du Japon ?', verso: 'Tokyo' }])
  })

  it('jette les cartes incomplètes', () => {
    // Une carte sans verso se retournerait sur du vide, pendant des mois, dans
    // le carnet de l'élève.
    expect(
      lireCartes('[{"recto":"a","verso":""},{"recto":"","verso":"b"},{"recto":"c","verso":"d"}]'),
    ).toEqual([{ recto: 'c', verso: 'd' }])
  })

  it('déduplique les rectos et refuse la carte tautologique', () => {
    const cartes = lireCartes(
      '[{"recto":"Thalès","verso":"Un théorème"},{"recto":"thalès","verso":"Autre chose"},{"recto":"Pythagore","verso":"pythagore"}]',
    )
    expect(cartes).toEqual([{ recto: 'Thalès', verso: 'Un théorème' }])
  })

  it('borne le nombre de cartes et la longueur des faces', () => {
    const beaucoup = JSON.stringify(
      Array.from({ length: 40 }, (_, i) => ({ recto: `q${i}`, verso: 'v' })),
    )
    expect(lireCartes(beaucoup)).toHaveLength(MAX_CARTES)

    const long = JSON.stringify([{ recto: 'r'.repeat(900), verso: 'v' }])
    expect(lireCartes(long)[0].recto.length).toBe(MAX_RECTO_LEN)
  })

  it('rend une liste vide sur une réponse illisible', () => {
    for (const raw of ['', 'Je ne sais pas.', '{"recto":"a"}', '[', '[oups]']) {
      expect(lireCartes(raw), raw).toEqual([])
    }
  })

  it('écrase les espaces et les retours à la ligne', () => {
    expect(lireCartes('[{"recto":"  a\\n  b ","verso":"c"}]')).toEqual([
      { recto: 'a b', verso: 'c' },
    ])
  })
})

describe('phraseCartes', () => {
  it('dit combien, et demande une relecture', () => {
    // « Relis-les » n'est pas de la politesse : le carnet ne doit pas enseigner
    // les erreurs d'un modèle.
    expect(phraseCartes(8)).toContain('8 cartes')
    expect(phraseCartes(8)).toContain('Relis')
    expect(phraseCartes(1)).toContain('une carte')
  })

  it('dit aussi l’échec, sans faire semblant', () => {
    expect(phraseCartes(0)).toContain('pas réussi')
  })
})
