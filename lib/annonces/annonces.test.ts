import { describe, expect, it } from 'vitest'
import {
  agregerResultats,
  annonceRecueDepuis,
  BROUILLON_VIDE,
  etatAnnonce,
  messageErreurAnnonce,
  nouvelleQuestion,
  prochaineAnnonce,
  reponsesPropres,
  segmentsPour,
  tauxReponse,
  verifierBrouillon,
  type Question,
} from './annonces'

describe('segmentsPour', () => {
  it('un coach ne parle qu’à ses élèves', () => {
    expect(segmentsPour(false).map((s) => s.id)).toEqual(['coaches', 'groupe'])
  })
  it('l’admin a tous les publics', () => {
    expect(segmentsPour(true)).toHaveLength(7)
  })
})

describe('verifierBrouillon', () => {
  it('un message complet passe', () => {
    const v = verifierBrouillon({ ...BROUILLON_VIDE, titre: ' Bravo ', corps: 'Belle semaine !', lien: '/reviser', lienLibelle: 'Réviser' }, false)
    expect(v.ok).toBe(true)
    if (v.ok) {
      expect(v.payload.titre).toBe('Bravo')
      expect(v.payload.lien).toBe('/reviser')
      expect(v.payload.questions).toBeNull()
    }
  })
  it('refuse un public réservé à un coach', () => {
    const v = verifierBrouillon({ ...BROUILLON_VIDE, titre: 'x', corps: 'y', segment: 'tous' }, false)
    expect(v.ok).toBe(false)
  })
  it('refuse un lien externe', () => {
    const v = verifierBrouillon({ ...BROUILLON_VIDE, titre: 'x', corps: 'y', lien: 'https://evil.com' }, true)
    expect(v.ok).toBe(false)
  })
  it('exige le groupe', () => {
    const v = verifierBrouillon({ ...BROUILLON_VIDE, titre: 'x', corps: 'y', segment: 'groupe' }, false)
    expect(v.ok).toBe(false)
  })
  it('un sondage renumérote ses questions et nettoie les options', () => {
    const v = verifierBrouillon({
      ...BROUILLON_VIDE,
      type: 'sondage',
      titre: 'Ton avis',
      segment: 'eleves',
      anonyme: true,
      questions: [
        { id: 'zz', type: 'choix', libelle: 'Matière ?', options: ['Maths', ' Maths ', '', 'SVT'] },
        { id: 'yy', type: 'note', libelle: 'Note ?' },
      ],
    }, true)
    expect(v.ok).toBe(true)
    if (v.ok) {
      expect(v.payload.questions?.map((q) => q.id)).toEqual(['q1', 'q2'])
      expect(v.payload.questions?.[0].options).toEqual(['Maths', 'SVT'])
      expect(v.payload.anonyme).toBe(true)
    }
  })
  it('un sondage sans question ou à une seule option échoue', () => {
    expect(verifierBrouillon({ ...BROUILLON_VIDE, type: 'sondage', titre: 'x' }, true).ok).toBe(false)
    const v = verifierBrouillon({ ...BROUILLON_VIDE, type: 'sondage', titre: 'x', questions: [{ id: 'q', type: 'choix', libelle: 'a', options: ['seul'] }] }, true)
    expect(v.ok).toBe(false)
  })
  it('les classes ne valent pas pour les parents', () => {
    const v = verifierBrouillon({ ...BROUILLON_VIDE, titre: 'x', corps: 'y', segment: 'parents', classes: ['3e'] }, true)
    expect(v.ok && v.payload.classes).toEqual([])
  })
})

describe('nouvelleQuestion', () => {
  it('prépare deux options pour un choix', () => {
    expect(nouvelleQuestion('choix', 1).options).toEqual(['', ''])
    expect(nouvelleQuestion('texte', 2).options).toBeUndefined()
  })
})

const Q: Question[] = [
  { id: 'q1', type: 'choix', libelle: 'Matière', options: ['Maths', 'SVT'] },
  { id: 'q2', type: 'multiple', libelle: 'Outils', options: ['Quiz', 'Jeux'] },
  { id: 'q3', type: 'note', libelle: 'Note' },
  { id: 'q4', type: 'texte', libelle: 'Idée' },
]

describe('reponsesPropres', () => {
  it('garde seulement les réponses valables', () => {
    expect(reponsesPropres(Q, { q1: 'Physique', q2: ['Quiz', 'Quiz', 'Hack'], q3: 6, q4: '  oui ' })).toEqual({ q2: ['Quiz'], q4: 'oui' })
  })
  it('rien de rempli → null', () => {
    expect(reponsesPropres(Q, {})).toBeNull()
  })
})

describe('prochaineAnnonce', () => {
  const a = (id: string, coach: boolean, creeLe: string) => annonceRecueDepuis({ id, auteur_coach: coach, cree_le: creeLe, titre: id })
  it('le coach passe avant Studuel, puis la plus ancienne', () => {
    const liste = [a('studuel', false, '2026-10-01'), a('coach', true, '2026-10-10')]
    expect(prochaineAnnonce(liste, new Set())?.id).toBe('coach')
    expect(prochaineAnnonce(liste, new Set(['coach']))?.id).toBe('studuel')
    expect(prochaineAnnonce(liste, new Set(['coach', 'studuel']))).toBeNull()
  })
  it('ignore un lien externe reçu', () => {
    expect(annonceRecueDepuis({ id: 'x', lien: 'https://x.fr' }).lien).toBeNull()
  })
})

describe('agregerResultats', () => {
  const r = (reponses: Record<string, unknown>, prenom: string | null = 'Léa') => ({ reponses, creeLe: '2026-10-16', prenom, classe: '3e' })
  it('compte, fait la moyenne et liste les textes', () => {
    const res = agregerResultats(Q, [
      r({ q1: 'Maths', q2: ['Quiz', 'Jeux'], q3: 4, q4: 'Plus de jeux' }),
      r({ q1: 'Maths', q2: ['Quiz'], q3: 5 }),
      r({ q1: 'SVT', q3: 3 }, null),
    ])
    const choix = res[0]
    expect(choix.type === 'choix' && choix.options).toEqual([
      { option: 'Maths', n: 2, part: 2 / 3 },
      { option: 'SVT', n: 1, part: 1 / 3 },
    ])
    const multiple = res[1]
    expect(multiple.repondants).toBe(2)
    const note = res[2]
    expect(note.type === 'note' && note.moyenne).toBe(4)
    expect(note.type === 'note' && note.repartition).toEqual([0, 0, 1, 1, 1])
    const texte = res[3]
    expect(texte.type === 'texte' && texte.textes[0].texte).toBe('Plus de jeux')
  })
})

describe('divers', () => {
  it('etatAnnonce', () => {
    const now = new Date('2026-10-16T12:00:00Z')
    expect(etatAnnonce({ expireLe: '2026-10-20T00:00:00Z', archiveLe: null }, now)).toBe('active')
    expect(etatAnnonce({ expireLe: '2026-10-10T00:00:00Z', archiveLe: null }, now)).toBe('expiree')
    expect(etatAnnonce({ expireLe: '2026-10-20T00:00:00Z', archiveLe: 'x' }, now)).toBe('archivee')
  })
  it('tauxReponse', () => {
    expect(tauxReponse({ vues: 40, reponses: 10 })).toBe(25)
    expect(tauxReponse({ vues: 0, reponses: 0 })).toBe(0)
  })
  it('messageErreurAnnonce', () => {
    expect(messageErreurAnnonce('segment_interdit')).toContain('réservé')
  })
})

describe('le lien d’une annonce', () => {
  it('refuse « //site » (adresse externe déguisée) et accepte une page de l’app', () => {
    const base = { ...BROUILLON_VIDE, titre: 'x', corps: 'y' }
    expect(verifierBrouillon({ ...base, lien: '//evil.com' }, true).ok).toBe(false)
    expect(verifierBrouillon({ ...base, lien: '/reviser?x=1' }, true).ok).toBe(true)
    expect(annonceRecueDepuis({ id: 'x', lien: '//evil.com' }).lien).toBeNull()
  })
})
