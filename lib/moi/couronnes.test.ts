import { describe, expect, it } from 'vitest'
import type { ChapitreProgression } from '@/lib/progression'
import {
  SEUILS_COURONNE,
  avanceeVersProchain,
  bilanCouronnes,
  chapitresPourTier,
  couronneMatiere,
  couronnes,
  phraseProchaineCouronne,
  tierPourRatio,
  tierSuivant,
} from './couronnes'

// Un chapitre maîtrisé, un chapitre entamé, un chapitre jamais ouvert.
const acquis: ChapitreProgression = { value: 1, state: 'maitrise', vuEnCours: true }
const enRoute: ChapitreProgression = { value: 0.4, state: 'en_cours', vuEnCours: true }
const vierge: ChapitreProgression = { value: 0, state: 'a_commencer', vuEnCours: false }

const matiere = (
  chapitres: readonly ChapitreProgression[],
  name = 'Maths',
  slug = 'maths',
) => ({ subjectId: slug, subjectSlug: slug, subjectName: name, chapitres })

const repete = (c: ChapitreProgression, n: number) => Array.from({ length: n }, () => c)

describe('tierPourRatio', () => {
  it('rend le métal du seuil atteint', () => {
    expect(tierPourRatio(0)).toBe('aucune')
    expect(tierPourRatio(0.24)).toBe('aucune')
    expect(tierPourRatio(SEUILS_COURONNE.bronze)).toBe('bronze')
    expect(tierPourRatio(0.49)).toBe('bronze')
    expect(tierPourRatio(SEUILS_COURONNE.argent)).toBe('argent')
    expect(tierPourRatio(SEUILS_COURONNE.or)).toBe('or')
    expect(tierPourRatio(1)).toBe('diamant')
  })

  it('ne casse pas sur une entrée aberrante', () => {
    expect(tierPourRatio(Number.NaN)).toBe('aucune')
    expect(tierPourRatio(-3)).toBe('aucune')
    expect(tierPourRatio(42)).toBe('diamant')
  })
})

describe('tierSuivant', () => {
  it('gravit la chaîne et s’arrête au diamant', () => {
    expect(tierSuivant('aucune')).toBe('bronze')
    expect(tierSuivant('bronze')).toBe('argent')
    expect(tierSuivant('argent')).toBe('or')
    expect(tierSuivant('or')).toBe('diamant')
    expect(tierSuivant('diamant')).toBeNull()
  })
})

describe('chapitresPourTier', () => {
  it('arrondit AU-DESSUS (pas de couronne pour un seuil frôlé)', () => {
    // 25 % de 17 = 4,25 → il en faut 5.
    expect(chapitresPourTier('bronze', 17)).toBe(5)
    expect(chapitresPourTier('argent', 17)).toBe(9)
    expect(chapitresPourTier('diamant', 17)).toBe(17)
  })

  it('rend 0 sur un programme vide', () => {
    expect(chapitresPourTier('bronze', 0)).toBe(0)
  })
})

describe('couronneMatiere', () => {
  it('compte les chapitres MAÎTRISÉS sur le programme ENTIER', () => {
    // 5 acquis sur 20 chapitres = 25 % → bronze, quoi qu'il arrive aux autres.
    const c = couronneMatiere(matiere([...repete(acquis, 5), ...repete(vierge, 15)]))
    expect(c.acquis).toBe(5)
    expect(c.total).toBe(20)
    expect(c.pct).toBe(25)
    expect(c.tier).toBe('bronze')
  })

  // Le piège que ce module existe pour éviter : `progressionMatiere` afficherait
  // 100 % ici (un seul chapitre commencé, et il est maîtrisé). Une couronne de
  // diamant pour un chapitre sur dix-sept viderait l'objet de son sens.
  it('ne décerne pas le diamant pour un seul chapitre maîtrisé', () => {
    const c = couronneMatiere(matiere([acquis, ...repete(vierge, 16)]))
    expect(c.tier).toBe('aucune')
    expect(c.pct).toBe(5)
    expect(c.prochain).toEqual({ tier: 'bronze', chapitres: 4 })
  })

  it('un chapitre entamé ne compte pas comme acquis', () => {
    const c = couronneMatiere(matiere([...repete(enRoute, 10)]))
    expect(c.acquis).toBe(0)
    expect(c.tier).toBe('aucune')
  })

  it('le programme fini donne le diamant, et plus rien à viser', () => {
    const c = couronneMatiere(matiere(repete(acquis, 8)))
    expect(c.tier).toBe('diamant')
    expect(c.pct).toBe(100)
    expect(c.prochain).toBeNull()
  })

  it('arrondit le pourcentage VERS LE BAS', () => {
    // 1 / 3 = 33,33 % → 33, jamais 34.
    const c = couronneMatiere(matiere([acquis, vierge, vierge]))
    expect(c.pct).toBe(33)
  })

  it('tolère une matière sans aucun chapitre', () => {
    const c = couronneMatiere(matiere([]))
    expect(c.total).toBe(0)
    expect(c.ratio).toBe(0)
    expect(c.tier).toBe('aucune')
    expect(c.prochain).toBeNull()
  })
})

describe('couronnes', () => {
  it('range du métal le plus haut au plus bas', () => {
    const liste = couronnes([
      matiere([acquis, ...repete(vierge, 3)], 'Histoire', 'histoire'), // 25 % bronze
      matiere(repete(acquis, 4), 'Maths', 'maths'), // 100 % diamant
      matiere([...repete(acquis, 2), ...repete(vierge, 2)], 'Anglais', 'anglais'), // 50 % argent
    ])
    expect(liste.map((c) => c.subjectName)).toEqual(['Maths', 'Anglais', 'Histoire'])
  })

  it('écarte les matières sans chapitre au programme', () => {
    const liste = couronnes([
      matiere(repete(acquis, 2), 'Maths', 'maths'),
      matiere([], 'Grec', 'grec'),
    ])
    expect(liste.map((c) => c.subjectSlug)).toEqual(['maths'])
  })

  it('départage deux égalités par ordre alphabétique', () => {
    const liste = couronnes([
      matiere(repete(acquis, 2), 'Physique', 'physique'),
      matiere(repete(acquis, 2), 'Anglais', 'anglais'),
    ])
    expect(liste.map((c) => c.subjectName)).toEqual(['Anglais', 'Physique'])
  })
})

describe('bilanCouronnes', () => {
  const liste = couronnes([
    matiere(repete(acquis, 4), 'Maths', 'maths'), // diamant
    matiere([...repete(acquis, 2), ...repete(vierge, 2)], 'Anglais', 'anglais'), // argent
    matiere([acquis, ...repete(vierge, 3)], 'Histoire', 'histoire'), // bronze
    matiere(repete(vierge, 10), 'Espagnol', 'espagnol'), // aucune
  ])

  it('compte les couronnes par métal', () => {
    const bilan = bilanCouronnes(liste)
    expect(bilan.parTier).toEqual({ bronze: 1, argent: 1, or: 0, diamant: 1 })
    expect(bilan.gagnees).toBe(3)
    expect(bilan.matieres).toBe(4)
  })

  it('désigne la matière la plus proche de sa prochaine couronne', () => {
    // Anglais : 2/4 acquis, l'or (75 % de 4 = 3) est à 1 chapitre.
    // Histoire : 1/4, l'argent (2) est à 1 chapitre aussi — Anglais est plus
    // avancé, il gagne le départage.
    const bilan = bilanCouronnes(liste)
    expect(bilan.prochaine?.subjectName).toBe('Anglais')
  })

  it('ignore une matière déjà au diamant', () => {
    const bilan = bilanCouronnes(couronnes([matiere(repete(acquis, 3), 'Maths', 'maths')]))
    expect(bilan.prochaine).toBeNull()
  })

  it('rend un bilan vide sans matière', () => {
    const bilan = bilanCouronnes([])
    expect(bilan.gagnees).toBe(0)
    expect(bilan.matieres).toBe(0)
    expect(bilan.prochaine).toBeNull()
  })
})

describe('phraseProchaineCouronne', () => {
  it('élide correctement chaque métal', () => {
    const c = couronneMatiere(matiere([acquis, ...repete(vierge, 3)], 'Maths'))
    expect(phraseProchaineCouronne(c)).toBe(
      '1 chapitre pour la couronne d’argent en Maths',
    )
  })

  it('accorde le pluriel', () => {
    const c = couronneMatiere(matiere(repete(vierge, 20), 'Maths'))
    expect(phraseProchaineCouronne(c)).toBe(
      '5 chapitres pour la couronne de bronze en Maths',
    )
  })

  it('ne dit rien quand il n’y a rien à viser', () => {
    expect(phraseProchaineCouronne(null)).toBeNull()
    expect(phraseProchaineCouronne(couronneMatiere(matiere(repete(acquis, 3))))).toBeNull()
  })
})

describe('avanceeVersProchain', () => {
  // L'anneau de l'étagère (components/moi/CouronnesRangee) lit CETTE valeur, et
  // pas `ratio` : ce qui doit bouger à l'écran, c'est la route vers le métal
  // suivant, pas la part du programme.
  const couronneDe = (ratio: number) =>
    couronneMatiere(
      matiere([
        ...repete(acquis, Math.round(ratio * 100)),
        ...repete(vierge, 100 - Math.round(ratio * 100)),
      ]),
    )

  it('rend la part du palier courant, pas la part du programme', () => {
    // 40 % du programme = bronze, et 60 % de la route bronze → argent.
    const c = couronneDe(0.4)
    expect(c.tier).toBe('bronze')
    expect(avanceeVersProchain(c)).toBeCloseTo(0.6, 5)
  })

  it('part de zéro à chaque nouveau métal', () => {
    expect(avanceeVersProchain(couronneDe(0.25))).toBeCloseTo(0, 5)
    expect(avanceeVersProchain(couronneDe(0.5))).toBeCloseTo(0, 5)
    expect(avanceeVersProchain(couronneDe(0.75))).toBeCloseTo(0, 5)
  })

  it('mesure le premier palier depuis zéro', () => {
    const c = couronneDe(0.1)
    expect(c.tier).toBe('aucune')
    expect(avanceeVersProchain(c)).toBeCloseTo(0.4, 5)
  })

  it('est plein au diamant, faute de palier au-dessus', () => {
    const c = couronneDe(1)
    expect(c.tier).toBe('diamant')
    expect(avanceeVersProchain(c)).toBe(1)
  })

  it('reste dans 0..1 sur un programme vide', () => {
    const c = couronneMatiere(matiere([]))
    expect(avanceeVersProchain(c)).toBe(0)
  })
})
