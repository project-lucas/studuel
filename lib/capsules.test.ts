import { describe, expect, it } from 'vitest'
import {
  capsulesNonOuvertes,
  etagereCarnet,
  etatCapsule,
  libelleEuros,
  lireAchats,
  lireCapsule,
  lireCatalogue,
  lireContenu,
  quizReussi,
  rayonsParTheme,
  type AchatCapsule,
  type Capsule,
} from './capsules'

const ligne = {
  id: 'sommeil',
  theme: 'bien-etre',
  titre: 'Le sommeil, ton super-pouvoir',
  accroche: 'Mieux dormir pour mieux apprendre.',
  emoji: '😴',
  teinte: 'ocean',
  prix_gemmes: 60,
  prix_euros: null,
  duree_min: 10,
  au_programme: ['Un', 'Deux', ' '],
  badge: 'Pro du sommeil',
  ordre: 10,
}

const capsule = lireCapsule(ligne) as Capsule

const achat = (o: Partial<AchatCapsule> = {}): AchatCapsule => ({
  capsuleId: 'sommeil',
  statut: 'active',
  acheteeLe: '2026-09-18T10:00:00Z',
  ouverteLe: null,
  termineeLe: null,
  ...o,
})

describe('lireCapsule', () => {
  it('lit une ligne complète, sans les puces vides', () => {
    expect(capsule).toMatchObject({
      id: 'sommeil',
      theme: 'bien-etre',
      teinte: 'ocean',
      prixGemmes: 60,
      prixEuros: null,
      auProgramme: ['Un', 'Deux'],
    })
  })

  it('lit le prix carte que PostgREST rend en texte (numeric)', () => {
    expect(lireCapsule({ ...ligne, prix_euros: '2.99' })?.prixEuros).toBe(2.99)
    expect(lireCapsule({ ...ligne, prix_euros: '0' })?.prixEuros).toBeNull()
  })

  it('refuse une ligne sans id, sans thème connu ou au prix négatif', () => {
    expect(lireCapsule({ ...ligne, id: '' })).toBeNull()
    expect(lireCapsule({ ...ligne, theme: 'cuisine' })).toBeNull()
    expect(lireCapsule({ ...ligne, prix_gemmes: -5 })).toBeNull()
    expect(lireCapsule(null)).toBeNull()
  })

  it('retombe sur des valeurs sûres pour le décor', () => {
    expect(lireCapsule({ ...ligne, teinte: 'fluo', emoji: '', badge: '' })).toMatchObject({
      teinte: 'violet',
      emoji: '✨',
      badge: ligne.titre,
    })
  })

  it('trie le catalogue par ordre et écarte les lignes cassées', () => {
    const cat = lireCatalogue([{ ...ligne, id: 'b', ordre: 20 }, { ...ligne, id: 'a', ordre: 5 }, { id: 'x' }])
    expect(cat.map((c) => c.id)).toEqual(['a', 'b'])
    expect(lireCatalogue('rien')).toEqual([])
  })
})

describe('lireAchats', () => {
  it('lit les achats et leur statut', () => {
    expect(
      lireAchats([
        { capsule_id: 'sommeil', statut: 'active', achetee_le: 't', ouverte_le: null, terminee_le: null },
        { capsule_id: 'stress', statut: 'attente_paiement', achetee_le: 't' },
        { statut: 'active' },
      ]),
    ).toEqual([
      { capsuleId: 'sommeil', statut: 'active', acheteeLe: 't', ouverteLe: null, termineeLe: null },
      { capsuleId: 'stress', statut: 'attente_paiement', acheteeLe: 't', ouverteLe: null, termineeLe: null },
    ])
  })
})

describe('lireContenu', () => {
  const lignes = [
    { type: 'cours', titre: 'Le cours', contenu: { intro: 'Salut', sections: [{ titre: 'A', texte: ['p1'], astuce: 'tip' }] } },
    { type: 'fiche', titre: '', contenu: { points: [{ titre: 'P', texte: 't' }], aRetenir: 'Dors.' } },
    {
      type: 'quiz',
      titre: 'Le quiz',
      contenu: {
        questions: [
          { question: 'Q ?', choix: ['a', 'b'], bonne: 1, explication: 'car' },
          { question: 'Cassée', choix: ['a', 'b'], bonne: 5 },
        ],
      },
    },
    { type: 'outil', titre: 'Ton calculateur', contenu: { kind: 'calculateur', modele: 'sommeil', intro: 'i' } },
  ]

  it('lit les quatre éléments, écarte une question cassée, donne un titre par défaut', () => {
    const c = lireContenu(lignes)
    expect(c?.cours.contenu.sections[0]).toEqual({ titre: 'A', texte: ['p1'], astuce: 'tip' })
    expect(c?.fiche.titre).toBe('La fiche récap')
    expect(c?.quiz.contenu.questions).toHaveLength(1)
    expect(c?.outil.contenu).toEqual({ kind: 'calculateur', modele: 'sommeil', intro: 'i' })
  })

  it('refuse une capsule à laquelle il manque un élément ou un outil inconnu', () => {
    expect(lireContenu(lignes.slice(0, 3))).toBeNull()
    expect(
      lireContenu([...lignes.slice(0, 3), { type: 'outil', contenu: { kind: 'boussole' } }]),
    ).toBeNull()
    expect(lireContenu(null)).toBeNull()
  })

  it('lit une liste à cocher et un planning', () => {
    const avec = (outil: unknown) => lireContenu([...lignes.slice(0, 3), { type: 'outil', contenu: outil }])
    expect(avec({ kind: 'checklist', intro: '', items: ['un', ''] })?.outil.contenu).toEqual({
      kind: 'checklist',
      intro: '',
      items: ['un'],
    })
    expect(avec({ kind: 'planning', intro: '', jours: ['Lundi'], moments: ['Soir'], activites: [] })).toBeNull()
  })
})

describe('etatCapsule', () => {
  it('dit si la capsule est à l’élève, ouverte ou terminée', () => {
    expect(etatCapsule(capsule, achat(), 0)).toEqual({ kind: 'possedee', ouverte: false, terminee: false })
    expect(etatCapsule(capsule, achat({ ouverteLe: 't', termineeLe: 't' }), 0)).toMatchObject({
      ouverte: true,
      terminee: true,
    })
  })

  it('compare le solde au prix', () => {
    expect(etatCapsule(capsule, null, 60)).toEqual({ kind: 'achetable' })
    expect(etatCapsule(capsule, null, 45)).toEqual({ kind: 'trop-chere', manque: 15 })
    expect(etatCapsule(capsule, undefined, Number.NaN)).toEqual({ kind: 'trop-chere', manque: 60 })
  })

  it('garde la demande par carte visible, sans cacher ce qui manque en gemmes', () => {
    expect(etatCapsule(capsule, achat({ statut: 'attente_paiement' }), 20)).toEqual({
      kind: 'en-attente',
      manque: 40,
    })
  })
})

describe('la Boutique et le carnet', () => {
  const autre = { ...capsule, id: 'argent', theme: 'vie-pratique' as const }

  it('range les capsules par thème, sans rayon vide', () => {
    const rayons = rayonsParTheme([autre, capsule])
    expect(rayons.map((r) => r.theme.id)).toEqual(['bien-etre', 'vie-pratique'])
  })

  it('compte les capsules jamais ouvertes, pas les demandes en attente', () => {
    expect(
      capsulesNonOuvertes([
        achat(),
        achat({ capsuleId: 'argent', ouverteLe: 't' }),
        achat({ capsuleId: 'stress', statut: 'attente_paiement' }),
      ]),
    ).toBe(1)
  })

  it('met les capsules jamais ouvertes en tête de l’étagère, puis les plus récentes', () => {
    const etagere = etagereCarnet(
      [capsule, autre],
      [
        achat({ capsuleId: 'argent', ouverteLe: 't', acheteeLe: '2026-09-18' }),
        achat({ capsuleId: 'sommeil', acheteeLe: '2026-09-01' }),
        achat({ capsuleId: 'fantome' }),
        achat({ capsuleId: 'argent', statut: 'attente_paiement' }),
      ],
    )
    expect(etagere.map((e) => e.capsule.id)).toEqual(['sommeil', 'argent'])
  })

  it('juge le quiz réussi à 60 %', () => {
    expect(quizReussi(5, 8)).toBe(true)
    expect(quizReussi(4, 8)).toBe(false)
    expect(quizReussi(0, 0)).toBe(false)
  })

  it('écrit le prix carte à la française', () => {
    expect(libelleEuros(2.99).replace(/\s/g, ' ')).toBe('2,99 €')
  })
})
