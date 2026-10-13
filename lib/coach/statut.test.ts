import { describe, expect, it } from 'vitest'
import {
  aSurveiller,
  compteurs,
  filtrer,
  formaterDerniereActivite,
  formaterDuree,
  joursEntre,
  juger,
  ligneDepuis,
  page,
  statutEleve,
  trier,
  type LigneCoach,
} from './statut'

const AUJOURDHUI = '2026-10-13'

function ligne(partiel: Partial<LigneCoach> = {}): LigneCoach {
  return {
    eleveId: 'e1',
    prenom: 'Léa',
    pseudo: null,
    classe: '3e',
    groupeId: 'g1',
    groupe: 'U15',
    categorie: 'U15',
    rattacheLe: '2026-09-01',
    derniereActivite: '2026-10-12',
    secondes7: 3600,
    secondes4s: 4 * 3600,
    joursActifs7: 4,
    sessions7: 5,
    matiereFaible: 'Maths',
    ratioFaible: 0.52,
    ratioGlobal: 0.7,
    quizTotal: 40,
    ...partiel,
  }
}

describe('le statut d’un élève', () => {
  it('vert : régulier cette semaine, dans la lignée des quatre d’avant', () => {
    expect(statutEleve(ligne(), AUJOURDHUI)).toEqual({ statut: 'vert', raisons: [] })
  })

  it('rouge : aucune activité depuis 7 jours, et dit depuis combien', () => {
    const v = statutEleve(ligne({ derniereActivite: '2026-10-04', joursActifs7: 0 }), AUJOURDHUI)
    expect(v.statut).toBe('rouge')
    expect(v.raisons).toEqual(['Aucune activité depuis 9 j'])
  })

  it('rouge : jamais actif', () => {
    const v = statutEleve(ligne({ derniereActivite: null, joursActifs7: 0, secondes7: 0 }), AUJOURDHUI)
    expect(v).toEqual({ statut: 'rouge', raisons: ['Jamais actif'] })
  })

  it('rouge : 0 jour actif sur 7 même avec une trace récente (un quiz hier, pas de temps)', () => {
    const v = statutEleve(ligne({ joursActifs7: 0, secondes7: 0 }), AUJOURDHUI)
    expect(v).toEqual({ statut: 'rouge', raisons: ['0 jour actif sur 7'] })
  })

  it('orange : 1 ou 2 jours actifs sur 7', () => {
    expect(statutEleve(ligne({ joursActifs7: 2 }), AUJOURDHUI)).toEqual({
      statut: 'orange',
      raisons: ['2 jours actifs sur 7'],
    })
    expect(statutEleve(ligne({ joursActifs7: 1 }), AUJOURDHUI).raisons).toEqual([
      '1 jour actif sur 7',
    ])
  })

  it('orange : le temps de la semaine tombe sous la moitié de sa moyenne', () => {
    // 4 semaines à 1 h → moyenne 1 h ; cette semaine 20 min → −67 %.
    const v = statutEleve(ligne({ secondes7: 20 * 60, secondes4s: 4 * 3600 }), AUJOURDHUI)
    expect(v.statut).toBe('orange')
    expect(v.raisons).toEqual(['Temps −67 % vs ses 4 semaines'])
  })

  it('ne crie pas à la baisse quand les 4 semaines d’avant étaient vides', () => {
    expect(statutEleve(ligne({ secondes7: 5 * 60, secondes4s: 0 }), AUJOURDHUI).statut).toBe('vert')
  })

  it('cumule les raisons oranges, mais une raison rouge l’emporte', () => {
    const orange = statutEleve(
      ligne({ joursActifs7: 1, secondes7: 10 * 60, secondes4s: 4 * 3600 }),
      AUJOURDHUI,
    )
    expect(orange.statut).toBe('orange')
    expect(orange.raisons).toHaveLength(2)
    const rouge = statutEleve(
      ligne({ joursActifs7: 1, derniereActivite: '2026-10-01', secondes4s: 4 * 3600 }),
      AUJOURDHUI,
    )
    expect(rouge.statut).toBe('rouge')
    expect(rouge.raisons).toEqual(['Aucune activité depuis 12 j'])
  })

  it('nouveau : rattaché depuis moins de 7 jours, quoi qu’il ait fait', () => {
    expect(statutEleve(ligne({ rattacheLe: '2026-10-10', joursActifs7: 0, derniereActivite: null }), AUJOURDHUI)).toEqual({
      statut: 'nouveau',
      raisons: ['Arrivé il y a 3 j'],
    })
    expect(statutEleve(ligne({ rattacheLe: AUJOURDHUI }), AUJOURDHUI).raisons).toEqual(['Arrivé aujourd’hui'])
    expect(statutEleve(ligne({ rattacheLe: '2026-10-06' }), AUJOURDHUI).statut).toBe('vert')
  })
})

describe('les compteurs, le tri, les filtres', () => {
  const lignes = juger(
    [
      ligne({ eleveId: 'a', prenom: 'Awa' }),
      ligne({ eleveId: 'b', prenom: 'Bilal', derniereActivite: '2026-10-02', joursActifs7: 0 }),
      ligne({ eleveId: 'c', prenom: 'Chloé', joursActifs7: 2, classe: '2de' }),
      ligne({ eleveId: 'd', prenom: 'Dylan', derniereActivite: null, joursActifs7: 0, secondes7: 0 }),
      ligne({ eleveId: 'e', prenom: 'Élise', rattacheLe: '2026-10-11', groupeId: 'g2', groupe: 'U17' }),
    ],
    AUJOURDHUI,
  )

  it('compte actifs, en baisse, décrochés, nouveaux', () => {
    expect(compteurs(lignes)).toEqual({ total: 5, actifs: 3, enBaisse: 1, decroches: 2, nouveaux: 1 })
  })

  it('« À surveiller » : les rouges d’abord, le plus silencieux en tête, puis les oranges', () => {
    expect(aSurveiller(lignes).map((l) => l.prenom)).toEqual(['Dylan', 'Bilal', 'Chloé'])
  })

  it('le tri par statut met les rouges en tête et les verts en fin', () => {
    expect(trier(lignes, 'statut', 'asc').map((l) => l.statut)).toEqual([
      'rouge',
      'rouge',
      'orange',
      'nouveau',
      'vert',
    ])
  })

  it('trie par colonne, et garde les vides en fin de liste dans les deux sens', () => {
    expect(trier(lignes, 'derniereActivite', 'asc').map((l) => l.prenom)).toEqual([
      'Bilal',
      'Awa',
      'Chloé',
      'Élise',
      'Dylan',
    ])
    expect(trier(lignes, 'derniereActivite', 'desc').map((l) => l.prenom).at(-1)).toBe('Dylan')
    expect(trier(lignes, 'prenom', 'desc')[0].prenom).toBe('Élise')
  })

  it('filtre par groupe, classe, statut, nouveaux du mois, et cherche sans accent', () => {
    expect(filtrer(lignes, { groupeId: 'g2' }, AUJOURDHUI).map((l) => l.prenom)).toEqual(['Élise'])
    expect(filtrer(lignes, { classe: '2de' }, AUJOURDHUI).map((l) => l.prenom)).toEqual(['Chloé'])
    expect(filtrer(lignes, { statut: 'rouge' }, AUJOURDHUI)).toHaveLength(2)
    expect(filtrer(lignes, { nouveauxDuMois: true }, AUJOURDHUI).map((l) => l.prenom)).toEqual(['Élise'])
    expect(filtrer(lignes, { recherche: 'elise' }, AUJOURDHUI).map((l) => l.prenom)).toEqual(['Élise'])
    expect(filtrer(lignes, { recherche: 'chlo' }, AUJOURDHUI)).toHaveLength(1)
  })

  it('pagine par 50', () => {
    const beaucoup = Array.from({ length: 120 }, (_, i) => i)
    expect(page(beaucoup, 1)).toHaveLength(50)
    expect(page(beaucoup, 3)).toHaveLength(20)
    expect(page(beaucoup, 4)).toHaveLength(0)
  })
})

describe('les formats et la lecture de la RPC', () => {
  it('écrit les durées comme on les dit', () => {
    expect(formaterDuree(0)).toBe('—')
    expect(formaterDuree(25 * 60)).toBe('25 min')
    expect(formaterDuree(3600)).toBe('1 h')
    expect(formaterDuree(3900)).toBe('1 h 05')
  })

  it('écrit la dernière activité en relatif', () => {
    expect(formaterDerniereActivite(null, AUJOURDHUI)).toBe('jamais')
    expect(formaterDerniereActivite('2026-10-13', AUJOURDHUI)).toBe('aujourd’hui')
    expect(formaterDerniereActivite('2026-10-12', AUJOURDHUI)).toBe('hier')
    expect(formaterDerniereActivite('2026-10-04', AUJOURDHUI)).toBe('il y a 9 j')
    expect(joursEntre('2026-10-01', AUJOURDHUI)).toBe(12)
  })

  it('relit une ligne brute (nombres en texte, dates longues, vides)', () => {
    const l = ligneDepuis({
      eleve_id: 'e9',
      prenom: 'Noa',
      pseudo: null,
      classe: 'Tle',
      groupe_id: 'g1',
      groupe: 'U18',
      categorie: null,
      rattache_le: '2026-10-01T09:12:00+00:00',
      derniere_activite: '2026-10-12',
      secondes_7: '1800',
      secondes_4s: 0,
      jours_actifs_7: 2,
      sessions_7: '3',
      matiere_faible: null,
      ratio_faible: null,
      ratio_global: '0.6123',
      quiz_total: 12,
    })
    expect(l.rattacheLe).toBe('2026-10-01')
    expect(l.secondes7).toBe(1800)
    expect(l.sessions7).toBe(3)
    expect(l.ratioFaible).toBeNull()
    expect(l.ratioGlobal).toBeCloseTo(0.6123)
    expect(l.matiereFaible).toBeNull()
    expect(ligneDepuis({}).prenom).toBe('Sans nom')
  })
})
