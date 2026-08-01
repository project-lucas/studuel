import { describe, expect, test } from 'vitest'
import {
  bilanHabitudes,
  derniersJours,
  FENETRE_JOURS,
  libelleSerie,
  meilleureSerie,
  serieEnCours,
  verdictHabitudes,
  type HabitudeLog,
  type HabitudeSuivie,
} from './habitudes'

const TODAY = '2026-08-01'

const habitude = (id: string, titre: string): HabitudeSuivie => ({
  id,
  titre,
  icone: '📚',
  raison: 'Parce que.',
})

const log = (
  habit_id: string,
  date: string,
  completed = true,
  auto_validated = false,
): HabitudeLog => ({ habit_id, date, completed, auto_validated })

describe('derniersJours', () => {
  test('rend n jours, du plus ancien au plus récent, aujourd’hui inclus', () => {
    expect(derniersJours(TODAY, 3)).toEqual(['2026-07-30', '2026-07-31', '2026-08-01'])
  })

  test('traverse un changement de mois', () => {
    expect(derniersJours('2026-03-01', 2)).toEqual(['2026-02-28', '2026-03-01'])
  })

  test('une date illisible ne fait pas exploser l’écran', () => {
    expect(derniersJours('jamais', 5)).toEqual([])
  })
})

describe('serieEnCours', () => {
  test('compte à rebours depuis aujourd’hui', () => {
    const jours = new Set(['2026-08-01', '2026-07-31', '2026-07-30'])
    expect(serieEnCours(jours, TODAY)).toBe(3)
  })

  test('la série survit à une journée pas encore faite', () => {
    // Le cœur de la règle : à 8 h du matin, une habitude tenue hier et
    // avant-hier ne doit pas afficher « 0 » — sinon l'écran punit l'élève
    // d'être matinal.
    const jours = new Set(['2026-07-31', '2026-07-30', '2026-07-29'])
    expect(serieEnCours(jours, TODAY)).toBe(3)
  })

  test('deux jours manqués cassent la série', () => {
    const jours = new Set(['2026-07-30', '2026-07-29'])
    expect(serieEnCours(jours, TODAY)).toBe(0)
  })

  test('aucun jour → aucune série', () => {
    expect(serieEnCours(new Set(), TODAY)).toBe(0)
  })
})

describe('meilleureSerie', () => {
  test('trouve la plus longue suite, pas la plus récente', () => {
    const jours = new Set([
      '2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', // 4
      '2026-07-20', '2026-07-21', // 2
    ])
    expect(meilleureSerie(jours)).toBe(4)
  })

  test('un jour isolé vaut 1', () => {
    expect(meilleureSerie(new Set(['2026-07-15']))).toBe(1)
  })

  test('rien → 0', () => {
    expect(meilleureSerie(new Set())).toBe(0)
  })
})

describe('bilanHabitudes', () => {
  const revision = habitude('h1', 'Réviser 20 minutes')
  const lecture = habitude('h2', 'Lire avant de dormir')

  test('série, régularité et rythme de la semaine', () => {
    const logs = [
      log('h1', '2026-08-01'),
      log('h1', '2026-07-31'),
      log('h1', '2026-07-30'),
      log('h2', '2026-07-25'),
    ]
    const [r, l] = bilanHabitudes([revision, lecture], logs, TODAY)

    expect(r.serie).toBe(3)
    expect(r.aujourdhui).toBe(true)
    expect(r.semaine).toEqual([false, false, false, false, true, true, true])
    expect(r.regularite).toBe(Math.round((3 / FENETRE_JOURS) * 100))

    expect(l.serie).toBe(0)
    expect(l.aujourdhui).toBe(false)
  })

  test('ignore les lignes non complétées', () => {
    const [b] = bilanHabitudes([revision], [log('h1', TODAY, false)], TODAY)
    expect(b.aujourdhui).toBe(false)
    expect(b.serie).toBe(0)
  })

  test('ignore les logs d’une AUTRE habitude', () => {
    const [b] = bilanHabitudes([revision], [log('h2', TODAY)], TODAY)
    expect(b.serie).toBe(0)
  })

  test('mesure la part de validations automatiques', () => {
    const logs = [
      log('h1', '2026-08-01', true, true),
      log('h1', '2026-07-31', true, true),
      log('h1', '2026-07-30', true, false),
    ]
    const [b] = bilanHabitudes([revision], logs, TODAY)
    expect(b.autoPart).toBe(67)
  })

  test('les jours hors fenêtre ne comptent pas dans la régularité', () => {
    const vieux = log('h1', '2026-01-01')
    const [b] = bilanHabitudes([revision], [vieux], TODAY)
    expect(b.regularite).toBe(0)
    // …mais ils comptent toujours dans le record historique.
    expect(b.meilleureSerie).toBe(1)
  })
})

describe('verdictHabitudes', () => {
  const solide = {
    ...habitude('h1', 'Réviser 20 minutes'),
    serie: 10,
    meilleureSerie: 10,
    regularite: 85,
    aujourdhui: true,
    semaine: [],
    autoPart: 0,
  }
  const fragile = {
    ...habitude('h2', 'Lire avant de dormir'),
    serie: 0,
    meilleureSerie: 2,
    regularite: 10,
    aujourdhui: false,
    semaine: [],
    autoPart: 0,
  }

  test('sans habitude, il invite à en prendre une seule', () => {
    const v = verdictHabitudes([])
    expect(v.total).toBe(0)
    expect(v.phrase).toMatch(/une seule/i)
  })

  test('nomme celle qui tient ET celle qui lâche', () => {
    const v = verdictHabitudes([solide, fragile])
    expect(v.solide?.id).toBe('h1')
    expect(v.fragile?.id).toBe('h2')
    expect(v.phrase).toContain('Réviser 20 minutes')
    expect(v.phrase).toContain('lire avant de dormir')
  })

  test('une seule habitude solide n’est pas déclarée fragile en même temps', () => {
    const v = verdictHabitudes([solide])
    expect(v.solide?.id).toBe('h1')
    expect(v.fragile).toBeNull()
  })

  test('rien d’ancré : il vise trois jours, pas sept', () => {
    const v = verdictHabitudes([fragile])
    expect(v.solide).toBeNull()
    expect(v.phrase).toMatch(/trois jours/i)
  })

  test('compte ce qui est tenu aujourd’hui', () => {
    const v = verdictHabitudes([solide, fragile])
    expect(v.tenuesAujourdhui).toBe(1)
    expect(v.total).toBe(2)
  })

  test('aucune note globale n’est produite', () => {
    // Un chiffre unique écraserait la seule information utile : QUELLE
    // habitude tient. Le verdict ne doit contenir ni score ni /20.
    const v = verdictHabitudes([solide, fragile])
    expect(v.phrase).not.toMatch(/\/20|score|note/i)
  })
})

describe('libelleSerie', () => {
  test('0 → à relancer, 1 → singulier, sinon pluriel', () => {
    expect(libelleSerie(0)).toBe('à relancer')
    expect(libelleSerie(1)).toBe('1 jour')
    expect(libelleSerie(5)).toBe('5 jours')
  })
})
