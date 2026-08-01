import { describe, it, expect } from 'vitest'
import {
  assietteGlobale,
  couvertureFor,
  couvertureGlobale,
  type ChapitreCouvert,
} from './couverture'
import { REGIMES } from './regimes'
import type { ChapterState } from '../mastery'

let compteur = 0

function ch(
  subjectSlug: string,
  state: ChapterState,
  value = 0,
  vuEnCours = false,
  subjectName = subjectSlug,
): ChapitreCouvert {
  compteur += 1
  return {
    chapterId: `ch-${compteur}`,
    chapterTitle: `Chapitre ${compteur}`,
    subjectSlug,
    subjectName,
    state,
    value,
    vuEnCours,
  }
}

describe('couvertureFor', () => {
  it('le pourcentage porte sur les chapitres COMMENCÉS, pas sur l’année', () => {
    // Le cœur du changement du 01/08 : 1 chapitre traité sur 10, maîtrisé à
    // 80 %, donne 80 % — pas 8 %. L'app ne punit plus l'élève pour un programme
    // que son prof n'a pas encore abordé.
    const [maths] = couvertureFor([
      ch('maths', 'en_cours', 0.8, true),
      ...Array.from({ length: 9 }, () => ch('maths', 'a_commencer')),
    ])

    expect(maths.pct).toBe(80)
    expect(maths.commences).toBe(1)
    expect(maths.total).toBe(10)
  })

  it('dit la couverture À PART, pour que 80 % ne soit pas un mensonge', () => {
    // Le garde-fou : 80 % sur un seul chapitre ne veut pas dire prêt. Les deux
    // informations ne sont jamais fondues dans la même phrase.
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 1, true),
      ch('maths', 'a_commencer'),
      ch('maths', 'a_commencer'),
    ])

    expect(maths.constat).toContain('solide')
    expect(maths.reste).toBe('2 chapitres pas encore vus en cours.')
  })

  it('ne dit rien du reste quand tout a été vu en cours', () => {
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 1, true),
      ch('maths', 'en_cours', 0.4, true),
    ])
    expect(maths.reste).toBeNull()
  })

  it('un chapitre travaillé dans l’app compte sans être coché', () => {
    const [maths] = couvertureFor([
      ch('maths', 'en_cours', 0.6),
      ch('maths', 'a_commencer'),
    ])
    expect(maths.commences).toBe(1)
    expect(maths.pct).toBe(60)
  })

  it('une matière que le prof n’a pas abordée ne réclame RIEN', () => {
    // L'ancien écran l'affichait à 0 % en rouge. Elle est désormais « rien à
    // réviser » — et passe en dernier dans la liste.
    const [svt] = couvertureFor([
      ch('svt', 'a_commencer'),
      ch('svt', 'a_commencer'),
    ])

    expect(svt.priorite).toBe('rien')
    expect(svt.commences).toBe(0)
    expect(svt.constat).toContain('ton prof')
  })

  it('classe la priorité sur la maîtrise du commencé', () => {
    const [faible] = couvertureFor([ch('maths', 'fragile', 0.3, true)])
    expect(faible.priorite).toBe('urgente')

    const [moyen] = couvertureFor([ch('anglais', 'en_cours', 0.65, true)])
    expect(moyen.priorite).toBe('attention')

    const [haut] = couvertureFor([ch('svt', 'maitrise', 0.95, true)])
    expect(haut.priorite).toBe('ok')
  })

  it('remonte l’urgent en tête et repousse le « rien à faire » en dernier', () => {
    const liste = couvertureFor([
      ch('anglais', 'maitrise', 1, true), // ok
      ch('maths', 'a_commencer'), // rien
      ch('francais', 'fragile', 0.2, true), // urgente
      ch('svt', 'en_cours', 0.6, true), // attention
    ])

    expect(liste.map((m) => m.slug)).toEqual([
      'francais',
      'svt',
      'anglais',
      'maths',
    ])
  })

  it('rend le détail chapitre par chapitre, avec son état de départ', () => {
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 0.9, true),
      ch('maths', 'a_commencer'),
    ])

    expect(maths.chapitres).toHaveLength(2)
    expect(maths.chapitres[0]).toMatchObject({
      pct: 90,
      vuEnCours: true,
      commence: true,
    })
    expect(maths.chapitres[1]).toMatchObject({
      pct: 0,
      vuEnCours: false,
      commence: false,
    })
  })

  it('aucune ligne ne peut se dire commencée sans compter dans le total', () => {
    // Le détail et le pourcentage sont calculés par la même fonction : c'est ce
    // qui empêche le tableau de contredire son propre en-tête.
    const [maths] = couvertureFor([
      ch('maths', 'en_cours', 0.5),
      ch('maths', 'a_commencer', 0, true),
      ch('maths', 'a_commencer'),
    ])
    expect(maths.chapitres.filter((c) => c.commence)).toHaveLength(
      maths.commences,
    )
  })

  it('dit ce que chaque chapitre RAPPORTERAIT à sa matière', () => {
    // 5 chapitres commencés : en maîtriser un à 0 % rapporte 20 points. C'est
    // ce que promet le bouton, et c'est exactement ce que la barre fera.
    const [hg] = couvertureFor([
      ch('histoire-geo', 'fragile', 0, true),
      ...Array.from({ length: 4 }, () => ch('histoire-geo', 'fragile', 0.3, true)),
    ])

    expect(hg.chapitres[0].gain).toBe(20)
    expect(hg.chapitres[1].gain).toBe(14) // (100 − 30) / 5
  })

  it('ne promet aucun gain sur un chapitre pas encore commencé', () => {
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 1, true),
      ch('maths', 'a_commencer'),
    ])

    expect(maths.chapitres[1].gain).toBe(0)
    // Et un chapitre déjà au sommet n'a plus rien à rapporter non plus.
    expect(maths.chapitres[0].gain).toBe(0)
  })

  it('porte la consigne du régime, et rien sur une matière hors doctrine', () => {
    const liste = couvertureFor([
      ch('maths', 'en_cours', 0.5, true),
      ch('sport', 'en_cours', 0.5, true),
    ])

    expect(liste.find((m) => m.slug === 'maths')?.consigne).toBe(
      REGIMES.pratique.consigne,
    )
    expect(liste.find((m) => m.slug === 'sport')?.consigne).toBeNull()
  })

  it('borne les valeurs aberrantes du catalogue', () => {
    const [maths] = couvertureFor([
      ch('maths', 'maitrise', 3, true), // valeur aberrante
      ch('maths', 'en_cours', -1, true),
    ])

    expect(maths.pct).toBe(50) // (1 + 0) / 2
  })

  it('ne parle pas d’une matière sans chapitre', () => {
    expect(couvertureFor([])).toEqual([])
  })
})

describe('couvertureGlobale', () => {
  it('pondère par les chapitres commencés, pas par le programme entier', () => {
    const liste = couvertureFor([
      ...Array.from({ length: 4 }, () => ch('maths', 'maitrise', 1, true)),
      ch('francais', 'en_cours', 0.5, true),
    ])

    expect(couvertureGlobale(liste)).toBe(90) // (100×4 + 50×1) / 5
  })

  it('une matière que le prof n’a pas abordée ne tire plus la moyenne', () => {
    const liste = couvertureFor([
      ch('maths', 'maitrise', 0.9, true),
      ...Array.from({ length: 20 }, () => ch('francais', 'a_commencer')),
    ])

    expect(couvertureGlobale(liste)).toBe(90)
  })

  it('rend 0 sans rien à mesurer', () => {
    expect(couvertureGlobale([])).toBe(0)
  })
})

describe('assietteGlobale', () => {
  it('somme les chapitres commencés ET le programme entier', () => {
    const liste = couvertureFor([
      ch('maths', 'maitrise', 1, true),
      ch('maths', 'a_commencer'),
      ch('francais', 'en_cours', 0.5, true),
      ch('francais', 'a_commencer'),
      ch('francais', 'a_commencer'),
    ])

    expect(assietteGlobale(liste)).toEqual({ commences: 2, total: 5 })
  })

  it('sans rien de commencé, le total reste dit', () => {
    const liste = couvertureFor([
      ch('maths', 'a_commencer'),
      ch('maths', 'a_commencer'),
    ])

    expect(assietteGlobale(liste)).toEqual({ commences: 0, total: 2 })
  })

  it('rien du tout : deux zéros', () => {
    expect(assietteGlobale([])).toEqual({ commences: 0, total: 0 })
  })
})
