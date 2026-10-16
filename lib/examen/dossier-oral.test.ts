import { describe, expect, it } from 'vitest'
import { DEROULE_ORAL, DOSSIER, ETAPES, consigneOralBlanc, etatDossier, normaliserDossier, tirerPiece, type Piece } from './dossier-oral'

const texte = (id: string, etapes: Record<string, boolean> = {}, passages = 0): Piece => ({
  id,
  genre: 'texte',
  titre: `Texte ${id}`,
  detail: null,
  matiere: 'francais',
  etapes: { explication: false, grammaire: false, oral: false, ...etapes },
  passages,
  ordre: Number(id),
})

describe('le dossier d’oral', () => {
  it('normalise les lignes de la base et jette les invalides', () => {
    const d = normaliserDossier([
      { id: 'b', genre: 'texte', titre: '  Hugo  ', etapes: { explication: true, inconnue: true }, ordre: 2 },
      { id: 'a', genre: 'question', titre: 'Q', etapes: null, ordre: 1 },
      { id: 'c', genre: 'poeme', titre: 'X' },
      { id: 'd', genre: 'texte', titre: '   ' },
    ])
    expect(d.map((p) => p.id)).toEqual(['a', 'b'])
    expect(d[1].titre).toBe('Hugo')
    expect(d[1].etapes).toEqual({ explication: true, grammaire: false, oral: false })
  })

  it('compte les pièces prêtes et l’avancée', () => {
    const pieces = [texte('1', { explication: true, grammaire: true, oral: true }), texte('2', { explication: true })]
    const e = etatDossier('bac-francais', pieces)
    expect(e.pretes).toBe(1)
    expect(e.part).toBeCloseTo((1 + 1 / 3) / 16)
  })

  it('compte une question du Grand oral pas encore écrite comme une pièce à zéro', () => {
    const q: Piece = { ...texte('1'), genre: 'question', etapes: { problematique: true, plan: true, introduction: true, oral: true } }
    expect(etatDossier('bac', [q]).part).toBeCloseTo(0.5)
    expect(DOSSIER.bac.max).toBe(2)
  })

  it('tire d’abord un texte jamais passé', () => {
    const pieces = [texte('1', {}, 2), texte('2', {}, 0), texte('3', {}, 1)]
    for (const h of [0, 0.5, 0.99]) expect(tirerPiece(pieces, h)?.id).toBe('2')
    expect(tirerPiece([], 0.3)).toBeNull()
  })

  it('écrit la demande de l’oral blanc avec le texte tiré', () => {
    const c = consigneOralBlanc('bac-francais', { titre: 'Demain, dès l’aube', detail: 'Hugo' })
    expect(c).toContain('« Demain, dès l’aube » (Hugo)')
    expect(c).not.toContain('{')
  })

  it('cale l’oral blanc sur les épreuves réelles', () => {
    expect(DEROULE_ORAL['bac-francais'].preparation).toBe(30)
    expect(DEROULE_ORAL['bac-francais'].temps.reduce((s, t) => s + t.minutes, 0)).toBe(20)
    expect(DEROULE_ORAL.bac.temps.reduce((s, t) => s + t.minutes, 0)).toBe(20)
    expect(DEROULE_ORAL.brevet.temps.reduce((s, t) => s + t.minutes, 0)).toBe(15)
    for (const g of Object.values(ETAPES)) expect(g.at(-1)?.id).toBe('oral')
  })
})
