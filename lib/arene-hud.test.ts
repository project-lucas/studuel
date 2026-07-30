import { describe, it, expect } from 'vitest'
import { bossTimerLabel, menuAlertCount, questTileBadge } from './arene-hud'

describe('menuAlertCount', () => {
  it('compte les entrées qui réclament quelque chose maintenant', () => {
    expect(
      menuAlertCount([
        { badge: '1', badgeTone: 'alert' },
        { badge: '!', badgeTone: 'alert' },
        { badge: '3', badgeTone: 'neutral' },
        {},
      ]),
    ).toBe(2)
  })

  it('traite une pastille sans ton comme une alerte (le défaut de l’UI)', () => {
    expect(menuAlertCount([{ badge: '2' }])).toBe(1)
  })

  it('ne compte rien quand le menu est calme', () => {
    expect(menuAlertCount([])).toBe(0)
    expect(menuAlertCount([{ badgeTone: 'alert' }, { badge: '' }])).toBe(0)
  })
})

describe('bossTimerLabel', () => {
  it("compte les jours jusqu'au lundi suivant (rotation du boss)", () => {
    // 2026-07-27 est un lundi : le boss vient d'arriver, il reste 7 jours.
    expect(bossTimerLabel('2026-07-27')).toBe('7j')
    expect(bossTimerLabel('2026-07-29')).toBe('5j') // mercredi
    expect(bossTimerLabel('2026-08-01')).toBe('2j') // samedi
  })

  it('affiche 1j le dernier jour (dimanche)', () => {
    expect(bossTimerLabel('2026-08-02')).toBe('1j')
  })
})

describe('questTileBadge', () => {
  const view = (id: string, done: boolean) => ({ id, done })

  it('signale en corail les récompenses à réclamer', () => {
    const badge = questTileBadge(
      [view('a', true), view('b', true), view('c', false)],
      ['a'],
    )
    expect(badge).toEqual({ count: 1, tone: 'alert' })
  })

  it("compte en neutre les quêtes restantes quand rien n'est à réclamer", () => {
    const badge = questTileBadge(
      [view('a', true), view('b', false), view('c', false)],
      ['a'],
    )
    expect(badge).toEqual({ count: 2, tone: 'neutral' })
  })

  it('se tait quand tout est fait et réclamé', () => {
    expect(questTileBadge([view('a', true)], ['a'])).toBeNull()
    expect(questTileBadge([], [])).toBeNull()
  })
})
