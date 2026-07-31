import { describe, it, expect } from 'vitest'
import {
  HORS_DOCTRINE,
  REGIMES,
  REGIME_BY_SUBJECT,
  SEANCE_MIN_MINUTES,
  hasRegime,
  regimeOf,
  regimeSecondaireOf,
  seanceFor,
  seanceForSubject,
  specOf,
  subjectsOfRegime,
  type Regime,
} from './regimes'
import { subjectInitials } from '../subject-style'

const TOUS: Regime[] = ['pratique', 'restitution', 'expression', 'langue']

describe('la carte des matières', () => {
  it('donne un régime aux matières qui en ont un', () => {
    expect(regimeOf('maths')).toBe('pratique')
    expect(regimeOf('histoire-geo')).toBe('restitution')
    expect(regimeOf('francais')).toBe('expression')
    expect(regimeOf('anglais')).toBe('langue')
  })

  it('se tait sur les matières hors doctrine', () => {
    // Un prof crédible est un prof qui sait de quoi il ne parle pas : la
    // pratique du sport ou de la musique se passe hors de l'app.
    for (const slug of HORS_DOCTRINE) {
      expect(regimeOf(slug)).toBeNull()
      expect(hasRegime(slug)).toBe(false)
      expect(specOf(slug)).toBeNull()
      expect(seanceForSubject(slug, 10)).toBeNull()
    }
  })

  it('ne range jamais une matière hors doctrine dans un régime', () => {
    for (const slug of HORS_DOCTRINE) {
      expect(REGIME_BY_SUBJECT[slug]).toBeUndefined()
    }
  })

  it('ignore une matière inconnue sans jeter', () => {
    expect(regimeOf('matiere-qui-nexiste-pas')).toBeNull()
    expect(regimeSecondaireOf('maths')).toBeNull()
  })

  it('donne un second régime au latin et au grec', () => {
    // La version est un geste : elle se répète comme un exercice de maths.
    expect(regimeSecondaireOf('latin')).toBe('pratique')
    expect(regimeSecondaireOf('grec')).toBe('pratique')
  })

  it('couvre toutes les matières du catalogue, sauf les hors doctrine', () => {
    // Miroir de lib/subject-style : si une matière est ajoutée là-bas sans
    // régime ici, Marcel resterait muet dessus sans que personne le voie.
    const connues = [
      'maths', 'maths-expertes', 'francais', 'histoire-geo', 'hggsp',
      'anglais', 'espagnol', 'allemand', 'latin', 'grec', 'svt',
      'physique-chimie', 'enseignement-scientifique', 'technologie', 'nsi',
      'ses', 'philosophie', 'culture-generale', 'economie',
      'finances-personnelles', 'fiscalite', 'entrepreneuriat',
      'figures-historiques', 'musique', 'sport', 'arts-plastiques',
    ]

    for (const slug of connues) {
      // Garde-fou : le slug doit exister côté style, sinon le test se périme.
      expect(subjectInitials(slug)).toBeTruthy()

      const couverte = hasRegime(slug) || HORS_DOCTRINE.includes(slug)
      expect(couverte, `${slug} n’a ni régime ni exemption`).toBe(true)
    }
  })

  it('range chaque matière dans un seul régime', () => {
    const vus = new Set<string>()
    for (const regime of TOUS) {
      for (const slug of subjectsOfRegime(regime)) {
        expect(vus.has(slug), `${slug} apparaît deux fois`).toBe(false)
        vus.add(slug)
      }
    }
    expect(vus.size).toBe(Object.keys(REGIME_BY_SUBJECT).length)
  })
})

describe('la doctrine de chaque régime', () => {
  it('donne une voix, une mesure et un piège à chacun', () => {
    for (const regime of TOUS) {
      const spec = REGIMES[regime]
      expect(spec.key).toBe(regime)
      expect(spec.marcel.length).toBeGreaterThan(30)
      expect(spec.mesure.length).toBeGreaterThan(3)
      expect(spec.piege.length).toBeGreaterThan(10)
    }
  })

  it('mesure quelque chose de DIFFÉRENT dans chaque régime', () => {
    // Si deux régimes mesuraient la même chose, la doctrine ne servirait à rien.
    const mesures = TOUS.map((r) => REGIMES[r].mesure)
    expect(new Set(mesures).size).toBe(TOUS.length)
  })

  it('décrit une séance en trois temps, de parts positives et complètes', () => {
    for (const regime of TOUS) {
      const { seance } = REGIMES[regime]
      expect(seance).toHaveLength(3)

      const somme = seance.reduce((s, b) => s + b.share, 0)
      expect(somme).toBeCloseTo(1, 5)
      for (const bloc of seance) expect(bloc.share).toBeGreaterThan(0)
    }
  })
})

describe('seanceFor', () => {
  it('distribue EXACTEMENT les minutes annoncées', () => {
    // Un plan qui annonce 10 minutes et en distribue 9 fait mentir Marcel dès
    // le premier écran.
    for (const regime of TOUS) {
      for (let minutes = SEANCE_MIN_MINUTES; minutes <= 60; minutes += 1) {
        const etapes = seanceFor(regime, minutes)
        const total = etapes.reduce((s, e) => s + e.minutes, 0)
        expect(total, `${regime} à ${minutes} min`).toBe(minutes)
      }
    }
  })

  it('donne au moins une minute à chaque temps', () => {
    for (const regime of TOUS) {
      const etapes = seanceFor(regime, SEANCE_MIN_MINUTES)
      expect(etapes).toHaveLength(3)
      for (const etape of etapes) expect(etape.minutes).toBeGreaterThanOrEqual(1)
    }
  })

  it('garde l’ordre des temps de la doctrine', () => {
    const etapes = seanceFor('pratique', 10)
    expect(etapes.map((e) => e.key)).toEqual([
      'attaque',
      'correction',
      'refaire',
    ])
  })

  it('donne le plus de temps au temps qui fait la note', () => {
    // En pratique, c'est « refaire seul » qui compte — pas la correction.
    const etapes = seanceFor('pratique', 20)
    const refaire = etapes.find((e) => e.key === 'refaire')!
    const correction = etapes.find((e) => e.key === 'correction')!
    expect(refaire.minutes).toBeGreaterThan(correction.minutes)
  })

  it('remonte au plancher plutôt que de rendre une séance absurde', () => {
    for (const bidon of [0, -5, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      const etapes = seanceFor('langue', bidon)
      const total = etapes.reduce((s, e) => s + e.minutes, 0)
      expect(total).toBe(SEANCE_MIN_MINUTES)
    }
  })

  it('passe par la matière quand on la lui donne', () => {
    const parMatiere = seanceForSubject('francais', 12)
    const parRegime = seanceFor('expression', 12)
    expect(parMatiere).toEqual(parRegime)
  })
})
