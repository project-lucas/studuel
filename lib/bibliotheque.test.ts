import { describe, expect, it } from 'vitest'
import {
  RAYONS,
  fichesParMatiere,
  filtrerCapsules,
  hrefRayon,
  lireFichesAchetees,
  lireRayon,
  matieresDesFiches,
  themesDesCapsules,
  type CapsuleRangee,
} from './bibliotheque'
import type { Capsule } from './capsules'

const matieres = [
  { id: 's-maths', slug: 'maths', name: 'Maths' },
  { id: 's-hg', slug: 'histoire-geo', name: 'Histoire-Géo' },
]

const unlock = (
  id: string,
  subject: string,
  o: { position?: number; title?: string; theme?: string | null } = {},
) => ({
  chapter_id: id,
  created_at: '2026-09-20T10:00:00Z',
  chapter: {
    id,
    title: o.title ?? `Chapitre ${id}`,
    position: o.position ?? 1,
    subject_id: subject,
    theme: o.theme ?? null,
  },
})

describe('les rayons', () => {
  it('sont trois, sans « Tout » : Dossiers, Capsules, Fiches', () => {
    expect(RAYONS.map((r) => r.id)).toEqual(['dossiers', 'capsules', 'fiches'])
  })

  it('lit un rayon connu, en chaîne ou en tableau', () => {
    expect(lireRayon('fiches')).toBe('fiches')
    expect(lireRayon(['capsules', 'fiches'])).toBe('capsules')
  })

  it('arrive sur les Dossiers sans rayon, ou sur un ancien lien « tout »', () => {
    expect(lireRayon(undefined)).toBe('dossiers')
    expect(lireRayon('tout')).toBe('dossiers')
    expect(lireRayon(3)).toBe('dossiers')
  })

  it('écrit l’adresse d’un rayon, sans paramètre pour celui d’arrivée', () => {
    expect(hrefRayon('dossiers')).toBe('/carnet')
    expect(hrefRayon('fiches')).toBe('/carnet?rayon=fiches')
  })
})

describe('lireFichesAchetees', () => {
  it('relie chaque fiche à la Fiche de son chapitre', () => {
    const [fiche] = lireFichesAchetees([unlock('c1', 's-maths', { theme: 'Fonctions' })], matieres)
    expect(fiche).toMatchObject({
      chapitreId: 'c1',
      titre: 'Chapitre c1',
      theme: 'Fonctions',
      matiere: { slug: 'maths', nom: 'Maths' },
      href: '/reviser/maths/c1/carte',
    })
  })

  it('range par matière, puis dans l’ordre du programme', () => {
    const fiches = lireFichesAchetees(
      [
        unlock('m2', 's-maths', { position: 2 }),
        unlock('h1', 's-hg', { position: 5 }),
        unlock('m1', 's-maths', { position: 1 }),
      ],
      matieres,
    )
    expect(fiches.map((f) => f.chapitreId)).toEqual(['h1', 'm1', 'm2'])
  })

  it('accepte le chapitre joint sous forme de tableau', () => {
    const ligne = { ...unlock('c1', 's-maths'), chapter: [unlock('c1', 's-maths').chapter] }
    expect(lireFichesAchetees([ligne], matieres)).toHaveLength(1)
  })

  it('écarte un chapitre disparu, une matière inconnue, un doublon et les lignes illisibles', () => {
    const fiches = lireFichesAchetees(
      [
        { chapter_id: 'x', created_at: '2026-09-20', chapter: null },
        unlock('c2', 's-inconnue'),
        unlock('c1', 's-maths'),
        unlock('c1', 's-maths'),
        null,
        'n’importe quoi',
      ],
      matieres,
    )
    expect(fiches.map((f) => f.chapitreId)).toEqual(['c1'])
    expect(lireFichesAchetees(null, matieres)).toEqual([])
  })
})

describe('le rayon Fiches, par matière', () => {
  const fiches = lireFichesAchetees(
    [unlock('m1', 's-maths'), unlock('m2', 's-maths', { position: 2 }), unlock('h1', 's-hg')],
    matieres,
  )

  it('propose une puce par matière, avec son compte', () => {
    expect(matieresDesFiches(fiches)).toEqual([
      { id: 'histoire-geo', label: 'Histoire-Géo', nombre: 1 },
      { id: 'maths', label: 'Maths', nombre: 2 },
    ])
  })

  it('groupe par matière, et ne garde que la matière choisie', () => {
    expect(fichesParMatiere(fiches, null).map((g) => g.matiere.slug)).toEqual([
      'histoire-geo',
      'maths',
    ])
    const seule = fichesParMatiere(fiches, 'maths')
    expect(seule).toHaveLength(1)
    expect(seule[0].fiches.map((f) => f.chapitreId)).toEqual(['m1', 'm2'])
  })

  it('montre tout quand la matière choisie n’a plus de fiche', () => {
    expect(fichesParMatiere(fiches, 'anglais')).toHaveLength(2)
  })
})

describe('le rayon Capsules, par thème', () => {
  const capsule = (id: string, theme: Capsule['theme']): CapsuleRangee => ({
    capsule: { id, theme } as Capsule,
    achat: {
      capsuleId: id,
      statut: 'active',
      acheteeLe: '2026-09-18T10:00:00Z',
      ouverteLe: null,
      termineeLe: null,
    },
  })
  const etagere = [capsule('a', 'methode'), capsule('b', 'bien-etre'), capsule('c', 'methode')]

  it('propose les thèmes possédés, dans l’ordre de la Boutique', () => {
    expect(themesDesCapsules(etagere)).toEqual([
      { id: 'bien-etre', label: 'Bien-être', nombre: 1 },
      { id: 'methode', label: 'Méthode', nombre: 2 },
    ])
  })

  it('filtre par thème, et montre tout pour un thème absent', () => {
    expect(filtrerCapsules(etagere, 'methode').map((e) => e.capsule.id)).toEqual(['a', 'c'])
    expect(filtrerCapsules(etagere, 'avenir')).toHaveLength(3)
    expect(filtrerCapsules(etagere, null)).toHaveLength(3)
  })
})
