import { describe, expect, it } from 'vitest'
import { avecPrenom, cleCache, donneesTri, filPourResume, pseudonymiser, remettrePrenoms, trierAvecPrenoms } from './assistant'
import type { LigneJugee } from './statut'

const ligne = (id: string, prenom: string, p: Partial<LigneJugee> = {}): LigneJugee => ({
  eleveId: id, prenom, pseudo: null, classe: '3e', groupeId: 'g', groupe: 'U15', categorie: null,
  rattacheLe: '2026-09-01', derniereActivite: '2026-10-05', secondes7: 1800, secondes4s: 14400,
  joursActifs7: 1, sessions7: 2, matiereFaible: 'Maths', ratioFaible: 0.41, ratioGlobal: 0.6, quizTotal: 9,
  statut: 'rouge', raisons: ['Aucune activité depuis 11 j'], ...p,
})

describe('pseudonymiser', () => {
  it('aucun prénom ni identifiant ne part vers Claude', () => {
    const { eleves, table } = pseudonymiser([ligne('id-lea', 'Léa'), ligne('id-tom', 'Tom')], '2026-10-16')
    const json = donneesTri(eleves, '2026-10-16')
    expect(json).not.toContain('Léa')
    expect(json).not.toContain('id-lea')
    expect(eleves[0]).toMatchObject({ code: 'E1', minutes7: 30, minutesMoy4s: 60, derniereActiviteJours: 11, scoreFaiblePct: 41 })
    expect(table.get('E2')).toEqual({ eleveId: 'id-tom', prenom: 'Tom' })
  })
})

describe('remettrePrenoms', () => {
  it('sur des mots entiers seulement', () => {
    const table = new Map([['E1', { prenom: 'Léa' }], ['E12', { prenom: 'Tom' }]])
    expect(remettrePrenoms('E1 et E12 ; E120 inconnu ; WE1 non', table)).toBe('Léa et Tom ; E120 inconnu ; WE1 non')
  })
})

describe('trierAvecPrenoms', () => {
  it('écarte les codes inconnus et les doublons, remet les prénoms', () => {
    const { table } = pseudonymiser([ligne('a', 'Léa'), ligne('b', 'Tom')], '2026-10-16')
    const r = trierAvecPrenoms({
      synthese: 'E1 décroche.',
      eleves: [
        { code: 'E1', urgence: 'haute', raison: 'E1 inactive', action: 'Appeler', message: 'Coucou !' },
        { code: 'E9', urgence: 'basse', raison: 'x', action: 'x', message: 'x' },
        { code: 'E1', urgence: 'haute', raison: 'doublon', action: 'x', message: 'x' },
      ],
    }, table)
    expect(r.synthese).toBe('Léa décroche.')
    expect(r.eleves).toHaveLength(1)
    expect(r.eleves[0]).toMatchObject({ eleveId: 'a', prenom: 'Léa', raison: 'Léa inactive' })
  })
})

describe('divers', () => {
  it('avecPrenom', () => {
    expect(avecPrenom('Bravo [Prénom] ! [Prenom]', 'Léa')).toBe('Bravo Léa ! Léa')
  })
  it('filPourResume : rôles, ordre, pièces', () => {
    const t = filPourResume([
      { auteurRole: 'eleve', corps: '', creeLe: '2026-10-16T09:00:00Z', pieceType: 'image' },
      { auteurRole: 'coach', corps: 'Salut', creeLe: '2026-10-16T08:00:00Z', pieceType: null },
    ])
    expect(t.split('\n')).toEqual(['2026-10-16 08:00 COACH : Salut', '2026-10-16 09:00 ÉLÈVE : [photo]'])
  })
  it('cleCache', () => {
    expect(cleCache('tri', '2026-10-16')).toBe('tri:2026-10-16')
    expect(cleCache('bilan', '2026-10-16', 'x')).toBe('bilan:2026-10-16:x')
  })
})

describe('masquerNoms', () => {
  it('masque les prénoms connus, mots entiers, sans la casse', async () => {
    const { masquerNoms } = await import('./assistant')
    expect(masquerNoms('Léa a vu LÉA et Léandre ; Al reste', ['Léa', 'Al'])).toBe('[Prénom] a vu [Prénom] et Léandre ; Al reste')
    expect(masquerNoms('Coach Lucas écrit à Tom', ['Lucas', 'Tom'], 'X')).toBe('Coach X écrit à X')
  })
})
